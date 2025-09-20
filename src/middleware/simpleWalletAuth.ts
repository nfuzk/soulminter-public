import { NextApiRequest, NextApiResponse } from 'next';

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    wallet: string;
  };
}

// Simple wallet address validation
function isValidSolanaAddress(address: string): boolean {
  // Solana addresses are base58 encoded and typically 32-44 characters
  const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return SOLANA_ADDRESS_REGEX.test(address);
}

// Extract wallet address from headers
function extractWalletAddress(req: NextApiRequest): string | null {
  const walletAddress = req.headers['x-wallet-address'] as string;
  
  if (!walletAddress) {
    return null;
  }

  // Validate the wallet address format
  if (!isValidSolanaAddress(walletAddress)) {
    return null;
  }

  return walletAddress;
}

// Simple wallet authentication middleware
export const requireWalletAuth = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const walletAddress = extractWalletAddress(req);
      
      if (!walletAddress) {
        return res.status(401).json({ 
          error: 'Wallet authentication required',
          message: 'Please connect your wallet and ensure a valid wallet address is provided'
        });
      }

      // Add the wallet to the request object
      (req as AuthenticatedRequest).user = { wallet: walletAddress };
      
      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error('Wallet authentication error:', error);
      return res.status(500).json({ 
        error: 'Authentication failed',
        message: 'Unable to verify wallet address'
      });
    }
  };
};

// Middleware for endpoints that need any wallet (not specific ownership)
export const requireAnyWalletAuth = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
  return requireWalletAuth(handler);
};

// Middleware for endpoints that need specific wallet ownership
export const requireWalletOwnership = (walletParam: string = 'wallet') => {
  return (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
    return requireWalletAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      const requestedWallet = req.query[walletParam] as string;
      const authenticatedWallet = req.user.wallet;

      // Ensure user can only access their own wallet data
      if (requestedWallet !== authenticatedWallet) {
        console.warn(`Unauthorized access attempt: ${authenticatedWallet} tried to access ${requestedWallet}`);
        return res.status(403).json({ 
          error: 'Forbidden',
          code: 'WALLET_OWNERSHIP_REQUIRED',
          details: 'You can only access your own wallet data'
        });
      }

      return handler(req, res);
    });
  };
};
