import { NextApiRequest, NextApiResponse } from 'next';
import { createRateLimit, rateLimitConfigs } from '../../middleware/rateLimit';
import { uploadJSONWithFallback } from '../../lib/uploadService';

// Security configuration
const MAX_METADATA_SIZE = 1024 * 1024; // 1MB for metadata
const MAX_STRING_LENGTH = 10000; // 10KB max for any string field

// Metadata validation function
function validateMetadata(metadata: any): { isValid: boolean; error?: string } {
  if (!metadata || typeof metadata !== 'object') {
    return { isValid: false, error: 'Metadata must be a valid object' };
  }

  // Check total size
  const metadataString = JSON.stringify(metadata);
  if (metadataString.length > MAX_METADATA_SIZE) {
    return { isValid: false, error: 'Metadata size exceeds 1MB limit' };
  }

  // Validate string fields
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === 'string' && value.length > MAX_STRING_LENGTH) {
      return { isValid: false, error: `Field '${key}' exceeds maximum length of ${MAX_STRING_LENGTH} characters` };
    }
    
    // Check for potentially dangerous content
    if (typeof value === 'string' && (
      value.includes('<script') || 
      value.includes('javascript:') || 
      value.includes('data:text/html')
    )) {
      return { isValid: false, error: 'Metadata contains potentially dangerous content' };
    }
  }

  return { isValid: true };
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure at least one storage backend is configured
    const hasLighthouse = Boolean(process.env.LIGHTHOUSE_API_KEY);
    const hasPinata = Boolean(process.env.PINATA_JWT);
    const hasArDrive = Boolean(process.env.ARWEAVE_WALLET_PATH || process.env.ARWEAVE_WALLET_BASE64);

    if (!hasLighthouse && !hasPinata && !hasArDrive) {
      console.error('No storage backend configured (LIGHTHOUSE_API_KEY, PINATA_JWT, or Arweave wallet)');
      return res.status(500).json({ error: 'No storage service configured' });
    }

    const { metadata } = req.body;

    if (!metadata) {
      return res.status(400).json({ error: 'Metadata is required' });
    }

    // Validate the metadata
    const validation = validateMetadata(metadata);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const result = await uploadJSONWithFallback(metadata);
    return res.status(200).json({
      success: true,
      ipfsHash: result.hash,
      ipfsUrl: result.url
    });

  } catch (error) {
    console.error('Metadata upload error:', error instanceof Error ? error.message : 'Unknown error');
    
    return res.status(500).json({
      error: 'Metadata upload failed',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}

// Apply rate limiting - use upload config for Arweave uploads
const rateLimitedHandler = createRateLimit(rateLimitConfigs.upload)(handler);

export default rateLimitedHandler;
