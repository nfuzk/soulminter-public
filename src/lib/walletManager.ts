import Arweave from 'arweave';

// Initialize Arweave instance
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false,
});

interface WalletConfig {
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
      
      // Validate wallet format (signer is created but not used directly - ArweaveSigner is used internally by Turbo SDK)
      if (!(wallet.k && Array.isArray(wallet.k)) && !(wallet.d && wallet.dp && wallet.dq && wallet.e && wallet.kty && wallet.n && wallet.p && wallet.q && wallet.qi)) {
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
      
      // Validate wallet format (signer is created but not used directly - ArweaveSigner is used internally by Turbo SDK)
      if (!(wallet.k && Array.isArray(wallet.k)) && !(wallet.d && wallet.dp && wallet.dq && wallet.e && wallet.kty && wallet.n && wallet.p && wallet.q && wallet.qi)) {
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
