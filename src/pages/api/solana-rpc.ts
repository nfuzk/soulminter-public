import { NextApiRequest, NextApiResponse } from 'next';
import { createRateLimit, rateLimitConfigs } from '../../middleware/rateLimit';

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

    // Validate method is allowed
    if (!method || !ALLOWED_METHODS.includes(method)) {
      return res.status(400).json({ 
        error: 'Method not allowed',
        allowedMethods: ALLOWED_METHODS 
      });
    }

    // Get the appropriate RPC endpoint based on network
     const network = req.headers['x-solana-network'] as string || 'mainnet-beta';
     
     // Get Helius API key
     const apiKey = process.env.HELIUS_API_KEY;
     if (!apiKey) {
       return res.status(500).json({ error: 'RPC configuration error' });
     }
     
     // Use Helius for both mainnet and devnet
     let rpcUrl: string;
     if (network === 'mainnet-beta') {
       rpcUrl = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
     } else if (network === 'devnet') {
       rpcUrl = `https://devnet.helius-rpc.com/?api-key=${apiKey}`;
     } else {
       return res.status(400).json({ error: 'Only mainnet-beta and devnet networks allowed for token creation' });
     }

    // Forward the RPC request to Solana
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params
      })
    });

    const data = await response.json();
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('RPC proxy error:', error);
    return res.status(500).json({ 
      error: 'RPC request failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Apply rate limiting
const rateLimitedHandler = createRateLimit(rateLimitConfigs.data)(handler);

export default rateLimitedHandler;

