import { NextApiResponse } from 'next';

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(code: string, message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const ErrorCodes = {
  // Authentication errors
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID: 'AUTH_INVALID',
  AUTH_EXPIRED: 'AUTH_EXPIRED',
  AUTH_SIGNATURE_INVALID: 'AUTH_SIGNATURE_INVALID',
  
  // Authorization errors
  FORBIDDEN: 'FORBIDDEN',
  WALLET_OWNERSHIP_REQUIRED: 'WALLET_OWNERSHIP_REQUIRED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_WALLET_ADDRESS: 'INVALID_WALLET_ADDRESS',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  SELF_REFERRAL: 'SELF_REFERRAL',
  ALREADY_AFFILIATED: 'ALREADY_AFFILIATED',
  
  // Rate limiting errors
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Database errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  AFFILIATE_NOT_FOUND: 'AFFILIATE_NOT_FOUND',
  REFERRAL_NOT_FOUND: 'REFERRAL_NOT_FOUND',
  
  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export const createError = (code: keyof typeof ErrorCodes, message: string, statusCode: number = 500, details?: any): AppError => {
  return new AppError(ErrorCodes[code], message, statusCode, details);
};

export const handleApiError = (error: unknown, res: NextApiResponse): void => {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
      details: error.details,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('signature')) {
      res.status(401).json({
        error: 'Invalid signature',
        code: ErrorCodes.AUTH_SIGNATURE_INVALID,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (error.message.includes('wallet')) {
      res.status(400).json({
        error: 'Invalid wallet address',
        code: ErrorCodes.INVALID_WALLET_ADDRESS,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (error.message.includes('database') || error.message.includes('connection')) {
      res.status(503).json({
        error: 'Database service unavailable',
        code: ErrorCodes.SERVICE_UNAVAILABLE,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Generic error
    res.status(500).json({
      error: 'Internal server error',
      code: ErrorCodes.INTERNAL_ERROR,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Unknown error
  res.status(500).json({
    error: 'Internal server error',
    code: ErrorCodes.INTERNAL_ERROR,
    timestamp: new Date().toISOString(),
  });
};

export const validateWalletAddress = (wallet: string): boolean => {
  const SOLANA_WALLET_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return typeof wallet === 'string' && SOLANA_WALLET_REGEX.test(wallet);
};

export const validateAmount = (amount: any): boolean => {
  return typeof amount === 'number' && isFinite(amount) && amount > 0 && amount <= 1000;
};

export const sanitizeError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
};

