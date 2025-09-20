import { useCallback } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

/**
 * Hook for making secure RPC calls through our server-side proxy
 * This keeps API keys secure on the server
 */
export const useSolanaRPC = () => {
  const makeRPCRequest = useCallback(async (
    method: string,
    params: any[] = [],
    network: string = 'devnet'
  ): Promise<any> => {
    try {
      const response = await fetch('/api/solana-rpc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-solana-network': network,
        },
        body: JSON.stringify({
          method,
          params
        })
      });

      if (!response.ok) {
        throw new Error(`RPC request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'RPC error');
      }

      return data.result;
    } catch (error) {
      console.error('RPC request error:', error);
      throw error;
    }
  }, []);

  // Convenience methods for common operations
  const getBalance = useCallback(async (publicKey: PublicKey, network: string = 'devnet') => {
    return makeRPCRequest('getBalance', [publicKey.toString()], network);
  }, [makeRPCRequest]);

  const getAccountInfo = useCallback(async (publicKey: PublicKey, network: string = 'devnet') => {
    return makeRPCRequest('getAccountInfo', [publicKey.toString()], network);
  }, [makeRPCRequest]);

  const getTokenAccountsByOwner = useCallback(async (
    owner: PublicKey, 
    filter: any, 
    network: string = 'devnet'
  ) => {
    return makeRPCRequest('getTokenAccountsByOwner', [owner.toString(), filter], network);
  }, [makeRPCRequest]);

  return {
    makeRPCRequest,
    getBalance,
    getAccountInfo,
    getTokenAccountsByOwner,
  };
};

