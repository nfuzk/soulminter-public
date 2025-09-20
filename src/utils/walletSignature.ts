import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback } from 'react';

/**
 * Hook for generating wallet signatures for API authentication
 */
export const useWalletSignature = () => {
  const { signMessage, publicKey } = useWallet();

  const generateSignature = useCallback(async (): Promise<{
    signature: string;
    timestamp: number;
    message: string;
  } | null> => {
    if (!signMessage || !publicKey) {
      console.error('Wallet not connected or signMessage not available');
      return null;
    }

    try {
      const timestamp = Date.now();
      const message = `Authenticate wallet ${publicKey.toString()} at ${timestamp}`;
      
      // Convert message to Uint8Array
      const messageBytes = new TextEncoder().encode(message);
      
      // Sign the message
      const signature = await signMessage(messageBytes);
      
      // Convert signature to base58 string
      const signatureString = Buffer.from(signature).toString('base64');
      
      return {
        signature: signatureString,
        timestamp,
        message
      };
    } catch (error) {
      console.error('Failed to generate wallet signature:', error);
      return null;
    }
  }, [signMessage, publicKey]);

  const makeAuthenticatedRequest = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const signatureData = await generateSignature();
    
    if (!signatureData) {
      throw new Error('Failed to generate wallet signature');
    }

    const headers = {
      'Content-Type': 'application/json',
      'x-wallet-address': publicKey?.toString() || '',
      'x-wallet-signature': signatureData.signature,
      'x-wallet-timestamp': signatureData.timestamp.toString(),
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }, [generateSignature, publicKey]);

  return {
    generateSignature,
    makeAuthenticatedRequest,
    isWalletConnected: !!publicKey && !!signMessage,
  };
};

/**
 * Utility function to create authenticated API requests
 * This can be used outside of React components
 */
export const createAuthenticatedRequest = async (
  wallet: any, // Wallet adapter instance
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  if (!wallet.signMessage || !wallet.publicKey) {
    throw new Error('Wallet not connected or signMessage not available');
  }

  try {
    const timestamp = Date.now();
    const message = `Authenticate wallet ${wallet.publicKey.toString()} at ${timestamp}`;
    
    // Convert message to Uint8Array
    const messageBytes = new TextEncoder().encode(message);
    
    // Sign the message
    const signature = await wallet.signMessage(messageBytes);
    
    // Convert signature to base64 string
    const signatureString = Buffer.from(signature).toString('base64');
    
    const headers = {
      'Content-Type': 'application/json',
      'x-wallet-address': wallet.publicKey.toString(),
      'x-wallet-signature': signatureString,
      'x-wallet-timestamp': timestamp.toString(),
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error('Failed to create authenticated request:', error);
    throw error;
  }
};

