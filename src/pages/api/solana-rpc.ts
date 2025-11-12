import { NextApiRequest, NextApiResponse } from 'next';
import { createRateLimit, rateLimitConfigs } from '../../middleware/rateLimit';

// Cold start tracking
let isWarmedUp = false;
let lastRequestTime = 0;

// Solana RPC methods that are allowed
const ALLOWED_METHODS = [
  'getBalance',
  'getAccountInfo',
  'getTokenAccountsByOwner',
  'getProgramAccounts',
  'getRecentBlockhash',
  'getLatestBlockhash',
  'getBlockHeight',
  'getTransaction',
  'getSignaturesForAddress',
  'getTokenAccountBalance',
  'confirmTransaction',
  'getSignatureStatus',
  'getSignatureStatuses',
  'getMinimumBalanceForRentExemption',
  'getSlot',
  'getVersion',
  'getHealth',
  'getClusterNodes',
  'getEpochInfo',
  'getEpochSchedule',
  'getGenesisHash',
  'getIdentity',
  'getInflationGovernor',
  'getInflationRate',
  'getInflationReward',
  'getLargestAccounts',
  'getLeaderSchedule',
  'getMultipleAccounts',
  'getProgramAccounts',
  'getRecentPerformanceSamples',
  'getStakeActivation',
  'getStakeMinimumDelegation',
  'getSupply',
  'getTokenLargestAccounts',
  'getTokenSupply',
  'getVoteAccounts',
  'requestAirdrop',
  'simulateTransaction',
  'sendTransaction'
];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { method, params = [] } = req.body;
    
    // Detect cold start (function hasn't been called in 5 minutes)
    const isColdStart = !isWarmedUp || (Date.now() - lastRequestTime > 300000);
    if (isColdStart) {
      console.log('Cold start detected, using extended timeouts');
      isWarmedUp = true;
    }
    lastRequestTime = Date.now();

    // Validate method is allowed
    if (!method || !ALLOWED_METHODS.includes(method)) {
      return res.status(400).json({ 
        error: 'Method not allowed',
        allowedMethods: ALLOWED_METHODS 
      });
    }

    // Get the appropriate RPC endpoint based on network
    const network = req.headers['x-solana-network'] as string || 'mainnet-beta';
    
    // Validate network
    if (network !== 'mainnet-beta' && network !== 'devnet') {
      return res.status(400).json({ error: 'Only mainnet-beta and devnet networks allowed for token creation' });
    }

    // Get API keys
    const heliusApiKey = process.env.HELIUS_API_KEY;
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;
    const forceAlchemyFallback = process.env.FORCE_ALCHEMY_FALLBACK === 'true';
    
    // Check if we should force Alchemy fallback for testing
    if (forceAlchemyFallback) {
      console.log('🧪 Force fallback mode: Using Alchemy directly for RPC');
      if (!alchemyApiKey) {
        return res.status(500).json({ 
          error: 'RPC configuration error: ALCHEMY_API_KEY is required when FORCE_ALCHEMY_FALLBACK is enabled' 
        });
      }
    } else {
      if (!heliusApiKey) {
        return res.status(500).json({ error: 'RPC configuration error: HELIUS_API_KEY is required' });
      }
    }

    // Define RPC providers with fallback (Helius primary, Alchemy fallback)
    const providers = [
      {
        name: 'helius',
        url: network === 'mainnet-beta'
          ? `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`
          : `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`,
        enabled: !forceAlchemyFallback && !!heliusApiKey // Disable Helius if forcing fallback
      },
      {
        name: 'alchemy',
        url: network === 'mainnet-beta'
          ? `https://solana-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
          : `https://solana-devnet.g.alchemy.com/v2/${alchemyApiKey}`,
        enabled: !!alchemyApiKey
      }
    ].filter(p => p.enabled);

    if (providers.length === 0) {
      return res.status(500).json({ error: 'No RPC providers configured' });
    }

    // Forward the RPC request to Solana with timeout
    // Use longer timeout for cold starts and sendTransaction
    const isSendTransaction = method === 'sendTransaction';
    const baseTimeout = isSendTransaction ? 60000 : 45000; // 60s for sendTransaction, 45s for others
    const timeout = isColdStart ? baseTimeout * 1.5 : baseTimeout; // 90s/67.5s for cold starts

    let lastError: Error | null = null;

    // Try each provider in sequence
    for (const provider of providers) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(provider.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method,
            params
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Provider ${provider.name} returned ${response.status}`);
        }

        const data = await response.json();

        // Check for RPC-level errors
        if (data.error) {
          // If it's a rate limit or temporary error, try next provider
          const errorCode = data.error.code;
          if (errorCode === 429 || errorCode === -32005 || errorCode === -32603) {
            console.warn(`Provider ${provider.name} returned error, trying next:`, data.error);
            lastError = new Error(data.error.message || 'RPC error');
            continue;
          }
          // Return other RPC errors immediately (not provider issues)
          return res.status(200).json(data);
        }

        // Success - log if we used a fallback
        if (provider.name !== 'helius' || forceAlchemyFallback) {
          const logMessage = forceAlchemyFallback 
            ? `🧪 Test mode: Using Alchemy fallback for ${method} on ${network}`
            : `Used fallback provider: ${provider.name} for ${method} on ${network}`;
          console.log(logMessage);
        }

        return res.status(200).json(data);
      } catch (error: any) {
        // Handle timeout errors
        if (error.name === 'AbortError') {
          console.warn(`Provider ${provider.name} timed out after ${timeout}ms`);
          lastError = new Error('RPC request timeout');
          // Continue to next provider if available
          if (provider !== providers[providers.length - 1]) {
            continue;
          }
          // Last provider timed out
          return res.status(408).json({
            error: 'RPC request timeout',
            details: 'All providers timed out',
            providersAttempted: providers.map(p => p.name)
          });
        }

        // Handle network errors
        console.warn(`Provider ${provider.name} failed:`, error.message);
        lastError = error;
        
        // Continue to next provider if available
        if (provider !== providers[providers.length - 1]) {
          continue;
        }
      }
    }

    // All providers failed
    return res.status(500).json({
      error: 'All RPC providers failed',
      details: lastError?.message,
      providersAttempted: providers.map(p => p.name)
    });
  } catch (error: any) {
    // Catch any unexpected errors outside the provider loop
    console.error('RPC proxy error:', error);
    
    return res.status(500).json({ 
      error: 'RPC request failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Apply stricter rate limiting for getSignatureStatuses to prevent spam
const rateLimitedHandler = createRateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute (reduced from 60)
  keyGenerator: (req) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    const method = req.body?.method || 'unknown';
    return `${method}:${ip}`;
  }
})(handler);

export default rateLimitedHandler;

