import { TOKEN_LIMITS } from '../config';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateTokenName = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, error: 'Token name is required' };
  }
  if (name.length > TOKEN_LIMITS.MAX_NAME_LENGTH) {
    return { isValid: false, error: `Token name must be less than ${TOKEN_LIMITS.MAX_NAME_LENGTH} characters` };
  }
  return { isValid: true };
};

export const validateTokenSymbol = (symbol: string): ValidationResult => {
  if (!symbol) {
    return { isValid: false, error: 'Token symbol is required' };
  }
  if (symbol.length > TOKEN_LIMITS.MAX_SYMBOL_LENGTH) {
    return { isValid: false, error: `Token symbol must be less than ${TOKEN_LIMITS.MAX_SYMBOL_LENGTH} characters` };
  }
  // Only allow letters, numbers, and common symbols
  if (!/^[A-Za-z0-9\-_]+$/.test(symbol)) {
    return { isValid: false, error: 'Token symbol can only contain letters, numbers, hyphens, and underscores' };
  }
  return { isValid: true };
};

export const validateTokenDecimals = (decimals: string): ValidationResult => {
  const decimalNum = Number(decimals);
  if (isNaN(decimalNum)) {
    return { isValid: false, error: 'Decimals must be a number' };
  }
  if (decimalNum < TOKEN_LIMITS.MIN_DECIMALS || decimalNum > TOKEN_LIMITS.MAX_DECIMALS) {
    return { isValid: false, error: `Decimals must be between ${TOKEN_LIMITS.MIN_DECIMALS} and ${TOKEN_LIMITS.MAX_DECIMALS}` };
  }
  if (!Number.isInteger(decimalNum)) {
    return { isValid: false, error: 'Decimals must be a whole number' };
  }
  return { isValid: true };
};

export const validateInitialSupply = (supply: string): ValidationResult => {
  if (!supply) {
    return { isValid: true }; // Optional field
  }
  const supplyNum = Number(supply);
  if (isNaN(supplyNum)) {
    return { isValid: false, error: 'Initial supply must be a number' };
  }
  if (supplyNum < 0) {
    return { isValid: false, error: 'Initial supply cannot be negative' };
  }
  if (supplyNum > TOKEN_LIMITS.MAX_INITIAL_SUPPLY) {
    return { isValid: false, error: `Initial supply cannot exceed ${TOKEN_LIMITS.MAX_INITIAL_SUPPLY}` };
  }
  if (!Number.isInteger(supplyNum)) {
    return { isValid: false, error: 'Initial supply must be a whole number' };
  }
  return { isValid: true };
};

export const validateTokenDescription = (description: string): ValidationResult => {
  if (!description) {
    return { isValid: true }; // Optional field
  }
  if (description.length > TOKEN_LIMITS.MAX_DESCRIPTION_LENGTH) {
    return { isValid: false, error: `Description must be less than ${TOKEN_LIMITS.MAX_DESCRIPTION_LENGTH} characters` };
  }
  return { isValid: true };
};

export const validateCustomMintPattern = (pattern: string): ValidationResult => {
  if (!pattern) {
    return { isValid: true }; // Optional field
  }
  if (pattern.length > 3) {
    return { isValid: false, error: 'Custom mint pattern cannot exceed 3 characters' };
  }
  if (pattern.length < 1) {
    return { isValid: false, error: 'Custom mint pattern must be at least 1 character' };
  }
  // Only allow alphanumeric characters (case sensitive)
  if (!/^[A-Za-z0-9]+$/.test(pattern)) {
    return { isValid: false, error: 'Custom mint pattern can only contain letters and numbers' };
  }
  return { isValid: true };
}; 