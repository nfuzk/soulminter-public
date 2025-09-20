import { ArweaveSigner } from '@ardrive/turbo-sdk';
import Arweave from 'arweave';

// Initialize Arweave instance
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false,
});

export interface WalletConfig {
  privateKey: Uint8Array;
  address: string;
  wallet: any; // The original wallet object for ArweaveSigner
}

/**
 * Loads Arweave wallet from environment variables
 * Supports both file path (development) and base64 encoded private key (production)
 */
export async function loadWallet(): Promise<WalletConfig> {
  const walletPath = process.env.ARWEAVE_WALLET_PATH;
  const walletBase64 = process.env.ARWEAVE_WALLET_BASE64;
  
  
  if (walletBase64) {
    // Production: Base64 encoded wallet
    try {
      // Decode the base64 string to get the wallet JSON
      const walletJson = Buffer.from(walletBase64, 'base64').toString('utf8');
      const wallet = JSON.parse(walletJson);
      
      // Handle both old format (k array) and new format (d, dp, dq, etc.)
      let signer: ArweaveSigner;
      
      if (wallet.k && Array.isArray(wallet.k)) {
        // Old format with k array - convert to JWK format
        const jwk = {
          kty: 'RSA',
          e: 'AQAB',
          n: wallet.n || '',
          d: wallet.d || '',
          p: wallet.p || '',
          q: wallet.q || '',
          dp: wallet.dp || '',
          dq: wallet.dq || '',
          qi: wallet.qi || '',
          k: wallet.k
        };
        signer = new ArweaveSigner(jwk);
      } else if (wallet.d && wallet.dp && wallet.dq && wallet.e && wallet.kty && wallet.n && wallet.p && wallet.q && wallet.qi) {
        // New format - pass the wallet object directly to ArweaveSigner
        signer = new ArweaveSigner(wallet);
      } else {
        throw new Error('Invalid wallet format: unsupported wallet structure');
      }
      
      const address = await arweave.wallets.getAddress(wallet);
      const privateKey = Buffer.from(JSON.stringify(wallet), 'utf8');
      
      return { privateKey, address, wallet };
    } catch (error) {
      throw new Error(`Failed to load wallet from base64: ${error.message}`);
    }
  } else if (walletPath) {
    // Development: File path
    try {
      const fs = require('fs');
      const path = require('path');
      
      const resolvedPath = path.resolve(walletPath);
      const walletData = fs.readFileSync(resolvedPath, 'utf8');
      const wallet = JSON.parse(walletData);
      
      // Handle both old format (k array) and new format (d, dp, dq, etc.)
      let signer: ArweaveSigner;
      
      if (wallet.k && Array.isArray(wallet.k)) {
        // Old format with k array - convert to JWK format
        const jwk = {
          kty: 'RSA',
          e: 'AQAB',
          n: wallet.n || '',
          d: wallet.d || '',
          p: wallet.p || '',
          q: wallet.q || '',
          dp: wallet.dp || '',
          dq: wallet.dq || '',
          qi: wallet.qi || '',
          k: wallet.k
        };
        signer = new ArweaveSigner(jwk);
      } else if (wallet.d && wallet.dp && wallet.dq && wallet.e && wallet.kty && wallet.n && wallet.p && wallet.q && wallet.qi) {
        // New format - pass the wallet object directly to ArweaveSigner
        signer = new ArweaveSigner(wallet);
      } else {
        throw new Error('Invalid wallet format: unsupported wallet structure');
      }
      
      const address = await arweave.wallets.getAddress(wallet);
      const privateKey = Buffer.from(JSON.stringify(wallet), 'utf8');
      
      return { privateKey, address, wallet };
    } catch (error) {
      throw new Error(`Failed to load wallet from file: ${error.message}`);
    }
  } else {
    throw new Error('No wallet configuration found. Set ARWEAVE_WALLET_PATH or ARWEAVE_WALLET_BASE64');
  }
}

/**
 * Converts wallet file to base64 for production deployment
 */
export function walletToBase64(walletPath: string): string {
  const fs = require('fs');
  const walletData = fs.readFileSync(walletPath, 'utf8');
  const wallet = JSON.parse(walletData);
  
  // Convert entire wallet JSON to base64
  return Buffer.from(JSON.stringify(wallet), 'utf8').toString('base64');
}
