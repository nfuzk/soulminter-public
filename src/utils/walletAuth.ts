import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

export interface WalletAuthResult {
  isValid: boolean;
  wallet: string;
  error?: string;
}

/**
 * Verifies that a signature was created by the specified wallet's private key
 * This proves the user controls the wallet without requiring server-side key storage
 */
export const verifyWalletSignature = async (
  walletAddress: string,
  signature: string,
  message: string
): Promise<WalletAuthResult> => {
  try {
    // Validate wallet address format
    if (!walletAddress || typeof walletAddress !== 'string') {
      return { isValid: false, wallet: '', error: 'Invalid wallet address' };
    }

    // Validate signature format
    if (!signature || typeof signature !== 'string') {
      return { isValid: false, wallet: walletAddress, error: 'Invalid signature' };
    }

    // Validate message format
    if (!message || typeof message !== 'string') {
      return { isValid: false, wallet: walletAddress, error: 'Invalid message' };
    }

    // Convert wallet address to PublicKey for validation
    let publicKey: PublicKey;
    try {
      publicKey = new PublicKey(walletAddress);
    } catch (error) {
      return { isValid: false, wallet: walletAddress, error: 'Invalid wallet address format' };
    }

    // Decode the signature from base58
    let signatureBytes: Uint8Array;
    try {
      signatureBytes = bs58.decode(signature);
    } catch (error) {
      return { isValid: false, wallet: walletAddress, error: 'Invalid signature format' };
    }

    // Convert message to bytes
    const messageBytes = new TextEncoder().encode(message);

    // Verify the signature using nacl
    const isValidSignature = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKey.toBytes()
    );

    if (!isValidSignature) {
      return { isValid: false, wallet: walletAddress, error: 'Invalid signature verification' };
    }

    return { isValid: true, wallet: walletAddress };
  } catch (error) {
    console.error('Wallet signature verification error:', error);
    return { 
      isValid: false, 
      wallet: walletAddress, 
      error: 'Signature verification failed' 
    };
  }
};

/**
 * Generates a challenge message for wallet authentication
 * This should be unique per request to prevent replay attacks
 */
export const generateAuthMessage = (walletAddress: string, timestamp: number): string => {
  return `Authenticate wallet ${walletAddress} at ${timestamp}`;
};

/**
 * Validates that the timestamp is recent (within 5 minutes) to prevent replay attacks
 */
export const isTimestampValid = (timestamp: number): boolean => {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
  return Math.abs(now - timestamp) <= fiveMinutes;
};

/**
 * Extracts wallet authentication data from request headers
 */
export const extractWalletAuth = (req: any): {
  wallet: string;
  signature: string;
  timestamp: number;
  message: string;
} | null => {
  try {
    const wallet = req.headers['x-wallet-address'] as string;
    const signature = req.headers['x-wallet-signature'] as string;
    const timestampHeader = req.headers['x-wallet-timestamp'] as string;
    
    if (!wallet || !signature || !timestampHeader) {
      return null;
    }

    const timestamp = parseInt(timestampHeader, 10);
    if (isNaN(timestamp)) {
      return null;
    }

    const message = generateAuthMessage(wallet, timestamp);
    
    return { wallet, signature, timestamp, message };
  } catch (error) {
    console.error('Error extracting wallet auth:', error);
    return null;
  }
};

