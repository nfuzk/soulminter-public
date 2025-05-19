import { PublicKey } from '@solana/web3.js';

// Fee Configuration
export const FEE_CONFIG = {
  RECEIVER: new PublicKey(process.env.NEXT_PUBLIC_FEE_RECEIVER || '8347h8LeaVAUzyWES3Xj2Gd6QTpGrCayKBpuYvBW3PWD'),
  CREATION_FEE: Number(process.env.NEXT_PUBLIC_CREATION_FEE || 0.2),
  AFFILIATE_COMMISSION: Number(process.env.NEXT_PUBLIC_AFFILIATE_COMMISSION || 0.2),
};

// Token Creation Limits
export const TOKEN_LIMITS = {
  MAX_NAME_LENGTH: 32,
  MAX_SYMBOL_LENGTH: 10,
  MAX_DECIMALS: 9,
  MIN_DECIMALS: 0,
  MAX_INITIAL_SUPPLY: 1000000000000,
  MAX_DESCRIPTION_LENGTH: 1000,
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DEFAULT_TOKEN_IMAGE: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
};

// Feature Flags
export const FEATURES = {
  ENABLE_AFFILIATE: process.env.NEXT_PUBLIC_ENABLE_AFFILIATE !== 'false',
  ENABLE_TOKEN_PREVIEW: process.env.NEXT_PUBLIC_ENABLE_TOKEN_PREVIEW !== 'false',
};

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  INVALID_TOKEN_NAME: 'Token name must be between 1 and 32 characters',
  INVALID_TOKEN_SYMBOL: 'Token symbol must be between 1 and 10 characters',
  INVALID_DECIMALS: 'Decimals must be between 0 and 9',
  INVALID_SUPPLY: 'Initial supply must be a positive number',
  FILE_TOO_LARGE: 'Image file size must be less than 5MB',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image',
};

// Analytics Events
export const ANALYTICS_EVENTS = {
  TOKEN_CREATED: 'token_created',
  AFFILIATE_LINKED: 'affiliate_linked',
  ERROR_OCCURRED: 'error_occurred',
}; 