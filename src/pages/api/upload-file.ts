import { NextApiRequest, NextApiResponse } from 'next';
import { createRateLimit, rateLimitConfigs } from '../../middleware/rateLimit';
import formidable from 'formidable';
import fs from 'fs';
import { uploadFileWithFallback } from '../../lib/uploadService';

// Security configuration
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// File validation function
function validateFile(file: formidable.File): { isValid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'File size exceeds 5MB limit' };
  }

  // Check MIME type
  if (!file.mimetype || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed' };
  }

  // Check file extension
  if (!file.originalFilename) {
    return { isValid: false, error: 'Invalid filename' };
  }

  const extension = file.originalFilename.toLowerCase().substring(file.originalFilename.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { isValid: false, error: 'Invalid file extension' };
  }

  // Basic file content validation (check file header)
  try {
    const fileBuffer = fs.readFileSync(file.filepath);
    
    // Check for common image file signatures
    const isValidImage = 
      (fileBuffer[0] === 0xFF && fileBuffer[1] === 0xD8 && fileBuffer[2] === 0xFF) || // JPEG
      (fileBuffer[0] === 0x89 && fileBuffer[1] === 0x50 && fileBuffer[2] === 0x4E && fileBuffer[3] === 0x47) || // PNG
      (fileBuffer[0] === 0x47 && fileBuffer[1] === 0x49 && fileBuffer[2] === 0x46) || // GIF
      (fileBuffer[8] === 0x57 && fileBuffer[9] === 0x45 && fileBuffer[10] === 0x42 && fileBuffer[11] === 0x50); // WebP

    if (!isValidImage) {
      return { isValid: false, error: 'File does not appear to be a valid image' };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Unable to validate file content' };
  }
}

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let files: any = null;

  try {
    // Check if Arweave wallet is configured
    const walletPath = process.env.ARWEAVE_WALLET_PATH;
    const walletBase64 = process.env.ARWEAVE_WALLET_BASE64;
    
    if (!walletPath && !walletBase64) {
      console.error('Neither ARWEAVE_WALLET_PATH nor ARWEAVE_WALLET_BASE64 configured');
      return res.status(500).json({ error: 'ArDrive service not configured' });
    }

    // Parse the form data with size limits
    const form = formidable({
      maxFileSize: MAX_FILE_SIZE,
      maxFields: 1,
      maxFieldsSize: 1024, // 1KB for form fields
    });
    const [fields, parsedFiles] = await form.parse(req);
    files = parsedFiles;

    // Check if it's a file upload
    if (files && files.file && Array.isArray(files.file) && files.file.length > 0) {
      const file = files.file[0];
      
      // Validate the file
      const validation = validateFile(file);
      if (!validation.isValid) {
        // Clean up the temporary file
        try {
          fs.unlinkSync(file.filepath);
        } catch (cleanupError) {
          console.error('Failed to clean up invalid file:', cleanupError);
        }
        return res.status(400).json({ error: validation.error });
      }

      const fileBuffer = fs.readFileSync(file.filepath);
      
      const result = await uploadFileWithFallback(fileBuffer, file.originalFilename!, file.mimetype);

      // Clean up temporary file after successful upload
      try {
        fs.unlinkSync(file.filepath);
      } catch (cleanupError) {
        console.error('Failed to clean up temporary file:', cleanupError);
      }

      return res.status(200).json({
        success: true,
        ipfsHash: result.hash,
        ipfsUrl: result.url
      });
    } else {
      return res.status(400).json({ error: 'File is required' });
    }

  } catch (error) {
    console.error('File upload error:', error instanceof Error ? error.message : 'Unknown error');
    
    // Clean up any temporary files in case of error
    try {
      if (files && files.file && Array.isArray(files.file)) {
        for (const file of files.file) {
          if (file.filepath && fs.existsSync(file.filepath)) {
            fs.unlinkSync(file.filepath);
          }
        }
      }
    } catch (cleanupError) {
      // Silent cleanup failure
    }
    
    return res.status(500).json({
      error: 'File upload failed',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}

// Apply rate limiting - use upload config for Arweave uploads
const rateLimitedHandler = createRateLimit(rateLimitConfigs.upload)(handler);

export default rateLimitedHandler;
