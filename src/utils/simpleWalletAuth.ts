import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback } from 'react';

/**
 * Simplified hook for making authenticated API requests
 * Only requires wallet connection, no signature needed
 */
export const useSimpleWalletAuth = () => {
  const { publicKey, connected } = useWallet();

  const makeAuthenticatedRequest = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    if (!publicKey || !connected) {
      throw new Error('Wallet not connected');
    }

    const headers = {
      'Content-Type': 'application/json',
      'x-wallet-address': publicKey.toString(),
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }, [publicKey, connected]);

  return {
    makeAuthenticatedRequest,
    isWalletConnected: connected && !!publicKey,
    walletAddress: publicKey?.toString() || null,
  };
};

