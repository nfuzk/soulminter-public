import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, SystemProgram } from '@solana/web3.js';
import { 
  createMint, 
  getMint, 
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  mintTo,
  getAssociatedTokenAddress,
  createSetAuthorityInstruction,
  AuthorityType,
  createMintToInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MINT_SIZE,
  MintLayout,
} from '@solana/spl-token';
import {
  createCreateMetadataAccountV3Instruction,
  createUpdateMetadataAccountV2Instruction,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  Metadata,
} from '@metaplex-foundation/mpl-token-metadata';

export interface TokenCreationParams {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  description?: string;
  imageUrl?: string;
  tokenUri?: string;
}

export async function createToken(
  connection: Connection,
  payer: Keypair,
  params: TokenCreationParams
) {
  const mint = await createMint(
    connection,
    payer,
    payer.publicKey,
    payer.publicKey,
    params.decimals,
    undefined,
    undefined,
    TOKEN_PROGRAM_ID
  );

  // Create metadata
  const [metadataAddress] = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataAddress,
      mint: mint,
      mintAuthority: payer.publicKey,
      payer: payer.publicKey,
      updateAuthority: payer.publicKey,
    },
    {
      createMetadataAccountArgsV3: {
        data: {
          name: params.name,
          symbol: params.symbol,
          uri: params.tokenUri || "",
          sellerFeeBasisPoints: 0,
          creators: null,
          collection: null,
          uses: null,
        },
        isMutable: true,
        collectionDetails: null,
      },
    }
  );

  const transaction = new Transaction().add(createMetadataInstruction);
  await connection.sendTransaction(transaction, [payer]);

  if (params.initialSupply > 0) {
    const associatedTokenAccount = await createAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey
    );

    await mintTo(
      connection,
      payer,
      mint,
      associatedTokenAccount,
      payer,
      params.initialSupply
    );
  }

  return { mint };
}

export async function getTokenInfo(connection: Connection, mintAddress: PublicKey) {
  try {
    const mintInfo = await getMint(connection, mintAddress);
    return mintInfo;
  } catch (error) {
    console.error('Error getting token info:', error);
    throw error;
  }
}

/**
 * Get mint and freeze authorities from a token mint account
 */
export async function getTokenAuthorities(connection: Connection, mintAddress: PublicKey) {
  try {
    const mintInfo = await getMint(connection, mintAddress);
    return {
      mintAuthority: mintInfo.mintAuthority,
      freezeAuthority: mintInfo.freezeAuthority,
      supply: mintInfo.supply,
      decimals: mintInfo.decimals,
    };
  } catch (error) {
    console.error('Error getting token authorities:', error);
    throw error;
  }
}

/**
 * Get mint and freeze authorities from a token mint account using secureRPC
 * This version uses the secure RPC proxy (Helius/Alchemy) instead of direct connection
 */
export async function getTokenAuthoritiesSecure(
  getAccountInfo: (publicKey: string) => Promise<any>,
  mintAddress: PublicKey
) {
  try {
    const accountInfo = await getAccountInfo(mintAddress.toString());
    
    // Handle different response formats
    // Solana RPC returns: { context: {...}, value: {...} } or { context: {...}, value: null }
    // Our secureRPC.callRPC returns data.result, which is the full result object
    let accountValue = null;
    
    if (!accountInfo) {
      throw new Error('Mint account not found');
    }
    
    if (typeof accountInfo === 'object') {
      if ('value' in accountInfo) {
        // Standard Solana RPC format: { context: {...}, value: {...} }
        accountValue = accountInfo.value;
      } else if ('data' in accountInfo) {
        // Direct account format: { data: [...], executable: false, ... }
        accountValue = accountInfo;
      }
    }
    
    if (!accountValue) {
      throw new Error('Mint account not found');
    }
    
    // Extract data from account value
    // accountValue should be: { data: [...], executable: false, lamports: ..., owner: "..." }
    const data = accountValue.data;
    
    if (!data) {
      throw new Error(`Account data is missing. Full response: ${JSON.stringify(accountInfo, null, 2)}`);
    }

    // Deserialize mint account data
    // Mint account structure (82 bytes total):
    // - mintAuthorityOption: u8 (1 byte) - 0 if null, 1 if present
    // - mintAuthority: Pubkey (32 bytes) if present, else skip
    // - supply: u64 (8 bytes)
    // - decimals: u8 (1 byte)
    // - isInitialized: u8 (1 byte)
    // - freezeAuthorityOption: u8 (1 byte) - 0 if null, 1 if present
    // - freezeAuthority: Pubkey (32 bytes) if present, else skip
    let buffer: Buffer;
    
    // Handle different data formats from RPC
    if (Array.isArray(data)) {
      // Format: { data: ["base64string"], encoding: "base64" }
      buffer = Buffer.from(data[0], 'base64');
    } else if (typeof data === 'string') {
      // Format: { data: "base64string", encoding: "base64" }
      buffer = Buffer.from(data, 'base64');
    } else {
      throw new Error(`Invalid account data format: ${JSON.stringify(data)}`);
    }
    
    if (buffer.length < MINT_SIZE) {
      throw new Error(`Invalid mint account size: ${buffer.length} bytes, expected at least ${MINT_SIZE}`);
    }

    // Use SPL token library's built-in deserialization for accurate parsing
    // This ensures we match exactly what Solana Explorer shows
    const rawMint = MintLayout.decode(buffer.slice(0, MINT_SIZE));
    
    // Extract authorities - MintLayout handles the Option<Pubkey> deserialization correctly
    const mintAuthority = rawMint.mintAuthorityOption ? new PublicKey(rawMint.mintAuthority) : null;
    const freezeAuthority = rawMint.freezeAuthorityOption ? new PublicKey(rawMint.freezeAuthority) : null;

    return {
      mintAuthority,
      freezeAuthority,
      supply: rawMint.supply,
      decimals: rawMint.decimals,
    };
  } catch (error) {
    console.error('Error getting token authorities:', error);
    throw error;
  }
}

/**
 * Fetch token metadata account
 */
export async function getTokenMetadata(connection: Connection, mintAddress: PublicKey) {
  try {
    const [metadataAddress] = await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintAddress.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const metadataAccountInfo = await connection.getAccountInfo(metadataAddress);
    
    if (!metadataAccountInfo) {
      return null;
    }

    // Parse metadata using Metaplex format
    // The metadata account structure: key (1 byte) + data
    // We need to deserialize the data according to Metaplex Token Metadata standard
    // For now, we'll return the raw data and parse isMutable from it
    // The isMutable flag is typically at a specific offset in the account data
    
    // Metaplex metadata v3 structure:
    // - key: u8 (1 byte)
    // - update_authority: Pubkey (32 bytes)
    // - mint: Pubkey (32 bytes)
    // - data: DataV2
    // - is_mutable: bool (1 byte) - typically around offset 1 + 32 + 32 + data_length
    
    // For simplicity, we'll fetch the account and let the component handle parsing
    // Or we can use a library to deserialize, but for now return the account info
    return {
      address: metadataAddress,
      accountInfo: metadataAccountInfo,
    };
  } catch (error) {
    console.error('Error getting token metadata:', error);
    throw error;
  }
}

/**
 * Fetch token metadata account using secureRPC
 * This version uses the secure RPC proxy (Helius/Alchemy) instead of direct connection
 */
export async function getTokenMetadataSecure(
  getAccountInfo: (publicKey: string) => Promise<any>,
  mintAddress: PublicKey
) {
  try {
    const [metadataAddress] = await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintAddress.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const accountInfo = await getAccountInfo(metadataAddress.toString());
    
    if (!accountInfo || !accountInfo.value) {
      return null;
    }

    // Convert the account info to a format similar to connection.getAccountInfo
    const metadataAccountInfo = {
      data: accountInfo.value.data,
      executable: accountInfo.value.executable,
      lamports: accountInfo.value.lamports,
      owner: new PublicKey(accountInfo.value.owner),
    };

    return {
      address: metadataAddress,
      accountInfo: metadataAccountInfo,
    };
  } catch (error) {
    console.error('Error getting token metadata:', error);
    throw error;
  }
}

/**
 * Parse metadata account to extract update authority and mutability
 * Metaplex Token Metadata structure:
 * - Offset 0: key (1 byte)
 * - Offset 1: update_authority (32 bytes)
 * - Offset 33: mint (32 bytes)
 * - Offset 65: data (variable length - name, symbol, uri, seller_fee_basis_points, creators)
 * - After data: is_mutable (1 byte) - this is the last byte before padding
 */
export function parseMetadataAccount(metadataAccountInfo: any): { updateAuthority: PublicKey | null; isMutable: boolean } {
  if (!metadataAccountInfo || !metadataAccountInfo.data) {
    return { updateAuthority: null, isMutable: false };
  }

  try {
    let buffer: Buffer;
    const data = metadataAccountInfo.data;
    
    // Handle different data formats from RPC
    if (Array.isArray(data)) {
      buffer = Buffer.from(data[0], 'base64');
    } else if (typeof data === 'string') {
      buffer = Buffer.from(data, 'base64');
    } else {
      return { updateAuthority: null, isMutable: true }; // Default to mutable if we can't parse
    }
    
    if (buffer.length < 66) {
      return { updateAuthority: null, isMutable: true }; // Not enough data, default to mutable
    }
    
    // Extract update authority
    // In Metaplex, update authority is stored as an Option<Pubkey>
    // The first byte at offset 1 indicates if it exists (0 = None, 1 = Some)
    // If it's 0, the update authority is revoked/null
    // If it's 1, the next 32 bytes contain the PublicKey
    const optionByte = buffer[1];
    
    let updateAuthority: PublicKey | null = null;
    if (optionByte === 1 && buffer.length >= 34) {
      // Update authority exists, extract it (offset 2-34)
      const updateAuthorityBytes = buffer.slice(2, 34);
      updateAuthority = new PublicKey(updateAuthorityBytes);
    } else if (optionByte === 0) {
      // Update authority is revoked (None)
      updateAuthority = null;
    } else {
      // Fallback: try to parse from offset 1-33 (old format or different structure)
      const updateAuthorityBytes = buffer.slice(1, 33);
      try {
        const updateAuthorityPubkey = new PublicKey(updateAuthorityBytes);
        // Check if it's the burn address (common way to revoke)
        const burnAddress = new PublicKey('11111111111111111111111111111111');
        updateAuthority = updateAuthorityPubkey.equals(burnAddress) ? null : updateAuthorityPubkey;
      } catch {
        updateAuthority = null;
      }
    }
    
    // Find isMutable byte (last non-zero byte before padding)
    let lastNonZeroIndex = buffer.length - 1;
    while (lastNonZeroIndex > 0 && buffer[lastNonZeroIndex] === 0) {
      lastNonZeroIndex--;
    }
    
    // Check possible positions for isMutable
    const possibleIsMutablePositions = [
      lastNonZeroIndex,
      lastNonZeroIndex - 1,
      buffer.length - 1,
      buffer.length - 2,
    ];
    
    let isMutable = true; // Default to mutable
    for (const pos of possibleIsMutablePositions) {
      if (pos >= 65 && pos < buffer.length) {
        const isMutableByte = buffer[pos];
        if (isMutableByte === 0 || isMutableByte === 1) {
          if (pos > 0 && (buffer[pos - 1] === 0 || pos === buffer.length - 1)) {
            isMutable = isMutableByte === 1;
            break;
          }
        }
      }
    }
    
    // Fallback: check last few bytes
    for (let i = buffer.length - 1; i >= Math.max(65, buffer.length - 10); i--) {
      const byte = buffer[i];
      if (byte === 0 || byte === 1) {
        if (i > 0 && (buffer[i - 1] === 0 || i === buffer.length - 1)) {
          isMutable = byte === 1;
          break;
        }
      }
    }
    
    return { updateAuthority, isMutable };
  } catch (error) {
    console.error('Error parsing metadata account:', error);
    return { updateAuthority: null, isMutable: true }; // Default to mutable if we can't determine
  }
}

/**
 * Check if metadata is mutable by parsing the account data
 * Metaplex Token Metadata structure:
 * - Offset 0: key (1 byte)
 * - Offset 1: update_authority (32 bytes)
 * - Offset 33: mint (32 bytes)
 * - Offset 65: data (variable length - name, symbol, uri, seller_fee_basis_points, creators)
 * - After data: is_mutable (1 byte) - this is the last byte before padding
 */
export function isMetadataMutable(metadataAccountInfo: any): boolean {
  const parsed = parseMetadataAccount(metadataAccountInfo);
  return parsed.isMutable;
}

/**
 * Create a transaction instruction to revoke mint authority
 */
export function createRevokeMintAuthorityInstruction(
  mintAddress: PublicKey,
  currentAuthority: PublicKey
): TransactionInstruction {
  return createSetAuthorityInstruction(
    mintAddress,
    currentAuthority,
    AuthorityType.MintTokens,
    null,
    [],
    TOKEN_PROGRAM_ID
  );
}

/**
 * Create a transaction instruction to revoke freeze authority
 */
export function createRevokeFreezeAuthorityInstruction(
  mintAddress: PublicKey,
  currentAuthority: PublicKey
): TransactionInstruction {
  return createSetAuthorityInstruction(
    mintAddress,
    currentAuthority,
    AuthorityType.FreezeAccount,
    null,
    [],
    TOKEN_PROGRAM_ID
  );
}

/**
 * Create a transaction instruction to make metadata immutable
 * Note: This requires fetching the existing metadata first
 */
export async function createMakeMetadataImmutableInstruction(
  connection: Connection,
  mintAddress: PublicKey,
  updateAuthority: PublicKey
): Promise<TransactionInstruction> {
  const [metadataAddress] = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintAddress.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  // Fetch existing metadata account
  const metadataAccountInfo = await connection.getAccountInfo(metadataAddress);
  if (!metadataAccountInfo) {
    throw new Error('Metadata account not found');
  }

  // Parse existing metadata - we need to extract the data
  // This is complex because we need to deserialize the account
  // For now, we'll create an instruction that updates with isMutable: false
  // The Metaplex library should handle the deserialization internally
  
  // We need to fetch the actual metadata data to preserve it
  // The update instruction requires the full data object
  // This is a limitation - we'd need to properly deserialize the metadata
  // For now, we'll create a minimal update that just sets isMutable to false
  
  // Simplified approach: create update instruction with minimal data
  // The instruction will preserve existing data and only update isMutable
  // Using V2 instruction which supports partial updates
  return createUpdateMetadataAccountV2Instruction(
    {
      metadata: metadataAddress,
      updateAuthority: updateAuthority,
    },
    {
      updateMetadataAccountArgsV2: {
        data: null, // null means don't update data
        isMutable: false, // Set to immutable
        updateAuthority: null, // null means don't change update authority
        primarySaleHappened: null, // null means don't change
      },
    }
  );
}

/**
 * Create a transaction instruction to revoke update authority using secureRPC
 * This version uses the secure RPC proxy (Helius/Alchemy) instead of direct connection
 */
export async function createRevokeUpdateAuthorityInstructionSecure(
  getAccountInfo: (publicKey: string) => Promise<any>,
  mintAddress: PublicKey,
  updateAuthority: PublicKey
): Promise<TransactionInstruction> {
  const [metadataAddress] = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintAddress.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  // Burn address used to indicate revoked authority
  const burnAddress = new PublicKey('11111111111111111111111111111111');

  return createUpdateMetadataAccountV2Instruction(
    {
      metadata: metadataAddress,
      updateAuthority: updateAuthority,
    },
    {
      updateMetadataAccountArgsV2: {
        data: null, // keep existing metadata
        isMutable: false, // make immutable
        updateAuthority: burnAddress, // set to burn address (revoked)
        primarySaleHappened: null,
      },
    }
  );
}

/**
 * Create a transaction instruction to mint additional tokens to a wallet
 */
export async function createMintAdditionalTokensInstruction(
  mintAddress: PublicKey,
  destinationWallet: PublicKey,
  amount: bigint,
  mintAuthority: PublicKey
): Promise<{ instruction: TransactionInstruction; associatedTokenAccount: PublicKey }> {
  const associatedTokenAccount = await getAssociatedTokenAddress(
    mintAddress,
    destinationWallet,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const instruction = createMintToInstruction(
    mintAddress,
    associatedTokenAccount,
    mintAuthority,
    amount,
    [],
    TOKEN_PROGRAM_ID
  );

  return {
    instruction,
    associatedTokenAccount,
  };
} 