import { NextApiRequest, NextApiResponse } from 'next';

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    wallet: string;
  };
}

/**
 * Simplified authentication middleware that only checks wallet address
 * This is more practical for web3 applications where the wallet connection
 * is already established in the frontend
 */
export const requireWalletAuth = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Get wallet address from headers
      const walletAddress = req.headers['x-wallet-address'] as string;
      
      if (!walletAddress) {
        return res.status(401).json({ 
          error: 'Wallet address required',
          code: 'WALLET_REQUIRED',
          details: 'Please connect your wallet and include x-wallet-address header'
        });
      }

      // Validate wallet address format
      const SOLANA_WALLET_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
      if (!SOLANA_WALLET_REGEX.test(walletAddress)) {
        return res.status(400).json({ 
          error: 'Invalid wallet address format',
          code: 'INVALID_WALLET_FORMAT'
        });
      }

      // Add authenticated user to request object
      (req as AuthenticatedRequest).user = { wallet: walletAddress };
      
      // Call the original handler with authenticated request
      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return res.status(500).json({ 
        error: 'Authentication failed',
        code: 'AUTH_ERROR'
      });
    }
  };
};

/**
 * Middleware to verify wallet ownership for specific wallet operations
 * Ensures users can only access their own wallet data
 */
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

/**
 * Middleware for operations that don't require specific wallet ownership
 * but still need wallet authentication (e.g., creating new affiliate relationships)
 */
export const requireAnyWalletAuth = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
  return requireWalletAuth(handler);
};

