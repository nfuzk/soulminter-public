import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback } from 'react';

export const useSimpleWalletAuth = () => {
  const { publicKey, connected } = useWallet();

  const makeAuthenticatedRequest = useCallback(async (
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> => {
    if (!connected || !publicKey) {
      throw new Error('Wallet not connected');
    }

    const walletAddress = publicKey.toString();

    const headers = {
      'Content-Type': 'application/json',
      'x-wallet-address': walletAddress,
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }, [connected, publicKey]);

  const getWalletAddress = useCallback((): string | null => {
    return connected && publicKey ? publicKey.toString() : null;
  }, [connected, publicKey]);

  return {
    makeAuthenticatedRequest,
    getWalletAddress,
    isConnected: connected,
    walletAddress: getWalletAddress(),
  };
};
