import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { 
  createMint, 
  getMint, 
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  mintTo
} from '@solana/spl-token';
import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID
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