import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createMintToInstruction,
  createSetAuthorityInstruction,
  AuthorityType,
} from "@solana/spl-token";
import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { FC, useCallback, useState, useEffect } from "react";
import { notify } from "utils/notifications";
import { ClipLoader } from "react-spinners";
import { PinataSDK } from "pinata-web3";
import { useRouter } from "next/router";
import styles from "../views/create/styles.module.css";
import { FEE_CONFIG, UPLOAD_CONFIG, FEATURES, ERROR_MESSAGES } from '../config';
import { validateTokenName, validateTokenSymbol, validateTokenDecimals, validateInitialSupply, validateTokenDescription } from '../utils/validation';
import { getSolanaNetwork } from '../utils/getSolanaNetwork';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Add loading steps enum
const LoadingStep = {
  INITIALIZING: "Initializing...",
  UPLOADING_IMAGE: "Uploading image to IPFS...",
  CREATING_MINT: "Creating mint account...",
  TRANSFERRING_FEE: "Transferring fee...",
  TRANSFERRING_COMMISSION: "Transferring affiliate commission...",
  INITIALIZING_MINT: "Initializing mint...",
  CREATING_ATA: "Creating token account...",
  ADDING_METADATA: "Adding metadata...",
  MINTING_TOKENS: "Minting initial supply...",
  REVOKING_AUTHORITIES: "Revoking authorities...",
  FINALIZING: "Finalizing transaction...",
  COMPLETE: "Complete!"
};

export const CreateToken: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const router = useRouter();
  const { ref } = router.query;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState("9");
  const [initialMintAmount, setInitialMintAmount] = useState("0");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [xUrl, setXUrl] = useState("");
  const [revokeMintAuthority, setRevokeMintAuthority] = useState(false);
  const [revokeFreezeAuthority, setRevokeFreezeAuthority] = useState(false);
  const [makeMetadataImmutable, setMakeMetadataImmutable] = useState(false);
  const [isSocialLinksExpanded, setIsSocialLinksExpanded] = useState(false);
  const [tokenMintAddress, setTokenMintAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(LoadingStep.INITIALIZING);
  const [progress, setProgress] = useState(0);

  const FEE_RECEIVER = new PublicKey("8347h8LeaVAUzyWES3Xj2Gd6QTpGrCayKBpuYvBW3PWD");

  useEffect(() => {
    const handleAffiliateLink = async () => {
      if (publicKey && ref && typeof ref === 'string' && FEATURES.ENABLE_AFFILIATE) {
        try {
          console.log('Attempting to create affiliate link:', {
            userWallet: publicKey.toString(),
            affiliateWallet: ref
          });

          const response = await fetch('/api/affiliate/link', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userWallet: publicKey.toString(),
              affiliateWallet: ref,
            }),
          });

          const data = await response.json();
          
          if (!response.ok) {
            console.warn('Failed to create affiliate relationship:', {
              status: response.status,
              statusText: response.statusText,
              data
            });
          } else {
            console.log('Successfully created affiliate relationship:', data);
          }
        } catch (error) {
          console.error('Error creating affiliate relationship:', error);
        }
      }
    };

    handleAffiliateLink();
  }, [publicKey, ref]);

  const updateProgress = (step: string) => {
    const steps = Object.values(LoadingStep);
    const currentIndex = steps.indexOf(step);
    const progress = (currentIndex / (steps.length - 1)) * 100;
    setProgress(progress);
    setCurrentStep(step);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
      notify({ 
        type: "error", 
        message: ERROR_MESSAGES.FILE_TOO_LARGE
      });
      return;
    }

    if (!UPLOAD_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
      notify({ 
        type: "error", 
        message: ERROR_MESSAGES.INVALID_FILE_TYPE
      });
      return;
    }

    setImageFile(file);
  };

  const handleCreateToken = async () => {
    if (!publicKey) {
      notify({ type: 'error', message: ERROR_MESSAGES.WALLET_NOT_CONNECTED });
      return;
    }

    // Validate inputs
    const nameValidation = validateTokenName(tokenName);
    if (!nameValidation.isValid) {
      notify({ type: "error", message: nameValidation.error });
      return;
    }

    const symbolValidation = validateTokenSymbol(tokenSymbol);
    if (!symbolValidation.isValid) {
      notify({ type: "error", message: symbolValidation.error });
      return;
    }

    const decimalsValidation = validateTokenDecimals(tokenDecimals);
    if (!decimalsValidation.isValid) {
      notify({ type: "error", message: decimalsValidation.error });
      return;
    }

    if (initialMintAmount) {
      const supplyValidation = validateInitialSupply(initialMintAmount);
      if (!supplyValidation.isValid) {
        notify({ type: "error", message: supplyValidation.error });
        return;
      }
    }

    setIsLoading(true);
    updateProgress(LoadingStep.INITIALIZING);
    
    try {
      // Upload metadata to IPFS
      let tokenUri = "";
      try {
        const pinata = new PinataSDK({
          pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT
        });

        let imageUri = "https://pink-abstract-gayal-682.mypinata.cloud/ipfs/bafybeigjzuiviadtrfyvvo7o6ewccb46b3kgav2yi54fuf4vjxkb53da7i";
        
        if (imageFile) {
          updateProgress(LoadingStep.UPLOADING_IMAGE);
          const imageUploadResponse = await pinata.upload.file(imageFile);
          imageUri = `https://ipfs.io/ipfs/${imageUploadResponse.IpfsHash}`;
        }

        const metadata = {
          name: tokenName,
          symbol: tokenSymbol,
          description: tokenDescription || "",
          image: imageUri,
          attributes: [],
          properties: {
            files: [{ uri: imageUri, type: "image/png" }],
            category: "image",
            creators: []
          },
          external_url: websiteUrl || undefined,
          extensions: {
            website: websiteUrl || undefined,
            telegram: telegramUrl || undefined,
            twitter: xUrl || undefined
          }
        };

        // Add social links to attributes
        if (websiteUrl || telegramUrl || xUrl) {
          metadata.attributes = [
            ...(websiteUrl ? [{ trait_type: "Website", value: websiteUrl }] : []),
            ...(telegramUrl ? [{ trait_type: "Telegram", value: telegramUrl }] : []),
            ...(xUrl ? [{ trait_type: "Twitter", value: xUrl }] : [])
          ];
        }

        const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
        const metadataFile = new File([metadataBlob], 'metadata.json');
        const metadataUploadResponse = await pinata.upload.file(metadataFile);
        tokenUri = `https://ipfs.io/ipfs/${metadataUploadResponse.IpfsHash}`;
      } catch (error: any) {
        throw new Error(`Failed to upload metadata: ${error.message}`);
      }

      // Create mint account
      updateProgress(LoadingStep.CREATING_MINT);
      const mintKeypair = Keypair.generate();
      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      const totalCost = lamports + 5000000; // Adding extra for transaction fees

      // Check balance
      const balance = await connection.getBalance(publicKey);
      if (balance < totalCost) {
        throw new Error(`Insufficient SOL balance. You need at least ${(totalCost / LAMPORTS_PER_SOL).toFixed(2)} SOL`);
      }

      // Get required addresses
      const associatedTokenAccount = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const [metadataAddress] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        PROGRAM_ID
      );

      // Calculate mint amount if needed
      let tokenMintAmount: bigint | null = null;
      if (Number(initialMintAmount) > 0) {
        const rawAmount = initialMintAmount.replace(/[^0-9]/g, '');
        tokenMintAmount = BigInt(rawAmount + '0'.repeat(Number(tokenDecimals)));
      }

      // Calculate fees
      const totalFeeLamports = LAMPORTS_PER_SOL * FEE_CONFIG.CREATION_FEE;
      let feeReceiverAmount = totalFeeLamports;
      let affiliateAmount = 0;
      let affiliateWallet: PublicKey | null = null;

      // Check for affiliate
      if (FEATURES.ENABLE_AFFILIATE && publicKey) {
        try {
          const response = await fetch(`/api/affiliate/${publicKey.toString()}/referral`);
          if (response.ok) {
            const data = await response.json();
            if (data.affiliateWallet) {
              affiliateWallet = new PublicKey(data.affiliateWallet.walletAddress);
              affiliateAmount = Math.floor(totalFeeLamports * FEE_CONFIG.AFFILIATE_COMMISSION);
              feeReceiverAmount = totalFeeLamports - affiliateAmount;
            }
          }
        } catch (error) {
          console.error('Error processing affiliate:', error);
        }
      }

      // Create transaction
      const tx = new Transaction();
      const blockhashResponse = await connection.getLatestBlockhash('confirmed');
      tx.recentBlockhash = blockhashResponse.blockhash;
      tx.feePayer = publicKey;

      // Add instructions
      tx.add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        })
      );

      // Add fee transfers
      if (affiliateWallet && affiliateAmount > 0) {
        tx.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: FEE_CONFIG.RECEIVER,
            lamports: feeReceiverAmount,
          })
        );
        tx.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: affiliateWallet,
            lamports: affiliateAmount,
          })
        );
      } else {
        tx.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: FEE_CONFIG.RECEIVER,
            lamports: totalFeeLamports,
          })
        );
      }

      // Add token setup instructions
      tx.add(
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          Number(tokenDecimals),
          publicKey,
          publicKey,
          TOKEN_PROGRAM_ID
        )
      );

      tx.add(
        createAssociatedTokenAccountInstruction(
          publicKey,
          associatedTokenAccount,
          publicKey,
          mintKeypair.publicKey,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );

      tx.add(
        createCreateMetadataAccountV3Instruction(
          {
            metadata: metadataAddress,
            mint: mintKeypair.publicKey,
            mintAuthority: publicKey,
            payer: publicKey,
            updateAuthority: publicKey,
          },
          {
            createMetadataAccountArgsV3: {
              data: {
                name: tokenName,
                symbol: tokenSymbol,
                uri: tokenUri,
                sellerFeeBasisPoints: 0,
                creators: null,
                collection: null,
                uses: null,
              },
              isMutable: !makeMetadataImmutable,
              collectionDetails: null,
            },
          }
        )
      );

      // Add mint instruction if needed
      if (tokenMintAmount !== null) {
        updateProgress(LoadingStep.MINTING_TOKENS);
        tx.add(
          createMintToInstruction(
            mintKeypair.publicKey,
            associatedTokenAccount,
            publicKey,
            tokenMintAmount,
            [],
            TOKEN_PROGRAM_ID
          )
        );
      }

      // Add authority revocations if needed
      if (revokeMintAuthority || revokeFreezeAuthority) {
        updateProgress(LoadingStep.REVOKING_AUTHORITIES);
        if (revokeMintAuthority) {
          tx.add(
            createSetAuthorityInstruction(
              mintKeypair.publicKey,
              publicKey,
              AuthorityType.MintTokens,
              null,
              [],
              TOKEN_PROGRAM_ID
            )
          );
        }
        if (revokeFreezeAuthority) {
          tx.add(
            createSetAuthorityInstruction(
              mintKeypair.publicKey,
              publicKey,
              AuthorityType.FreezeAccount,
              null,
              [],
              TOKEN_PROGRAM_ID
            )
          );
        }
      }

      // Sign and send transaction
      updateProgress(LoadingStep.FINALIZING);
      tx.partialSign(mintKeypair);

      // Get wallet name
      const walletName = localStorage.getItem('walletName');
      
      // Check transaction size for Phantom
      const txSize = tx.serializeMessage().length;
      if (walletName === 'Phantom' && txSize > 1100) {
        throw new Error('Transaction too large for Phantom Lighthouse guard');
      }

      // Send transaction
      if (!sendTransaction) {
        throw new Error('sendTransaction is not available');
      }

      const signature = await sendTransaction(tx, connection, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3
      });

      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash: blockhashResponse.blockhash,
        lastValidBlockHeight: blockhashResponse.lastValidBlockHeight,
      }, 'finalized');

      if (confirmation.value.err) {
        throw new Error("Transaction failed: " + JSON.stringify(confirmation.value.err));
      }

      // Update affiliate earnings if applicable
      if (affiliateWallet && affiliateAmount > 0) {
        try {
          const commissionAmount = affiliateAmount / LAMPORTS_PER_SOL;
          await fetch(`/api/affiliate/${affiliateWallet.toString()}/earnings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: commissionAmount,
              transactionId: signature,
              timestamp: new Date().toISOString(),
              userWallet: publicKey.toString(),
            }),
          });
        } catch (error) {
          console.error('Error updating affiliate earnings:', error);
        }
      }

      updateProgress(LoadingStep.COMPLETE);
      setTokenMintAddress(mintKeypair.publicKey.toString());
      notify({
        type: "success",
        message: "Token created successfully!",
        txid: signature
      });

    } catch (error: any) {
      notify({ 
        type: "error", 
        message: "Token creation failed",
        description: error.message
      });
      console.error("Token creation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!publicKey ? (
        <div className="bg-[#1A2332] rounded-lg p-8 text-center shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to create a token.</p>
        </div>
      ) : isLoading && (
        <div className={styles.loadingModal}>
          <div className={styles.loadingContent}>
            <div className={styles.loadingHeader}>
              <h3 className={styles.loadingTitle}>Creating Your Token</h3>
              <p className={styles.loadingStep}>{currentStep}</p>
            </div>
            <div className={styles.loadingProgress}>
              <div
                className={styles.loadingProgressBar}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className={styles.loadingSpinner}>
              <ClipLoader color="#9945FF" size={40} />
            </div>
            <p className={styles.loadingWarning}>
              Please don&apos;t close this window or refresh the page
            </p>
          </div>
        </div>
      )}
      {publicKey && !tokenMintAddress && !isLoading && (
        <div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Token Icon</label>
            <div className="flex p-2">
              <label className="m-auto rounded border border-dashed border-white px-2 cursor-pointer w-full flex flex-col items-center justify-center" style={{ minHeight: 100 }}>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium mt-2">Upload an image</span>
                <input
                  type="file"
                  className="sr-only"
                  onChange={handleImageChange}
                />
                {!imageFile ? null : (
                  <p className="text-gray-500 mt-2">{imageFile.name}</p>
                )}
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Token Name</label>
            <input
              className={styles.input}
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              placeholder="Enter token name"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Token Symbol</label>
            <input
              className={styles.input}
              type="text"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              placeholder="Enter token symbol (e.g., SOL)"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Token Description</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={tokenDescription}
              onChange={(e) => setTokenDescription(e.target.value)}
              placeholder="Describe your token"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Token Decimals</label>
            <input
              className={styles.input}
              type="number"
              value={tokenDecimals}
              onChange={(e) => setTokenDecimals(e.target.value)}
              placeholder="Enter decimals (default: 9)"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Initial Mint Amount</label>
            <input
              className={styles.input}
              type="number"
              value={initialMintAmount}
              onChange={(e) => setInitialMintAmount(e.target.value)}
              placeholder="Enter initial mint amount"
            />
          </div>

          <div className={styles.formGroup}>
            <button
              type="button"
              onClick={() => setIsSocialLinksExpanded(!isSocialLinksExpanded)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-[#1A2332] rounded-lg hover:bg-[#2A3342] focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
            >
              <span>Social Links (Optional)</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${isSocialLinksExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isSocialLinksExpanded && (
              <div className="mt-4 space-y-4">
                <div className={styles.formGroup}>
                  <label className={styles.label}>Website URL</label>
                  <input
                    className={styles.input}
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://your-token-website.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Telegram URL</label>
                  <input
                    className={styles.input}
                    type="url"
                    value={telegramUrl}
                    onChange={(e) => setTelegramUrl(e.target.value)}
                    placeholder="https://t.me/your-token-group"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>X (Twitter) URL</label>
                  <input
                    className={styles.input}
                    type="url"
                    value={xUrl}
                    onChange={(e) => setXUrl(e.target.value)}
                    placeholder="https://x.com/your-token-handle"
                  />
                </div>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Token Configuration</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div 
                className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                  revokeMintAuthority 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-gray-700 hover:border-purple-500/50'
                }`}
                onClick={() => setRevokeMintAuthority(!revokeMintAuthority)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex items-center justify-center mt-0.5`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                      revokeMintAuthority ? 'border-purple-500 bg-purple-500' : 'border-gray-500 bg-[#181f2a]'
                    }`} style={{ aspectRatio: '1/1', minWidth: '1.5rem', minHeight: '1.5rem' }}>
                      {revokeMintAuthority && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Revoke Mint Authority</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Permanently disable the ability to mint new tokens
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                  revokeFreezeAuthority 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-gray-700 hover:border-purple-500/50'
                }`}
                onClick={() => setRevokeFreezeAuthority(!revokeFreezeAuthority)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex items-center justify-center mt-0.5`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                      revokeFreezeAuthority ? 'border-purple-500 bg-purple-500' : 'border-gray-500 bg-[#181f2a]'
                    }`} style={{ aspectRatio: '1/1', minWidth: '1.5rem', minHeight: '1.5rem' }}>
                      {revokeFreezeAuthority && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Revoke Freeze Authority</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Remove the ability to freeze token accounts
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                  makeMetadataImmutable 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-gray-700 hover:border-purple-500/50'
                }`}
                onClick={() => setMakeMetadataImmutable(!makeMetadataImmutable)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex items-center justify-center mt-0.5`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                      makeMetadataImmutable ? 'border-purple-500 bg-purple-500' : 'border-gray-500 bg-[#181f2a]'
                    }`} style={{ aspectRatio: '1/1', minWidth: '1.5rem', minHeight: '1.5rem' }}>
                      {makeMetadataImmutable && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Immutable Metadata</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Lock token metadata permanently
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 text-sm text-gray-400">
            {['devnet', 'testnet'].includes(getSolanaNetwork()) && (
              <div className="bg-yellow-200 text-yellow-900 p-2 text-center rounded mb-4">
                Note: Phantom wallet may show a simulation error when creating a new token on devnet or testnet. This is expected and your token will still be created successfully.
              </div>
            )}
            By clicking the create token button, you state that you have read and accepted the{' '}
            <a href="/terms" className="text-purple-400 hover:text-purple-300 underline" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="/privacy" className="text-purple-400 hover:text-purple-300 underline" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </div>

          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleCreateToken}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Token (0.2 SOL fee)"}
          </button>
        </div>
      )}
      {publicKey && tokenMintAddress && !isLoading && (
        <div className="mt-4 break-words">
          <p className="font-medium">Link to your new token.</p>
          <a
            className="cursor-pointer font-medium text-purple-500 hover:text-indigo-500"
            href={`https://explorer.solana.com/address/${tokenMintAddress}?cluster=${getSolanaNetwork()}`}
            target="_blank"
            rel="noreferrer"
          >
            {tokenMintAddress}
          </a>
        </div>
      )}
    </div>
  );
};
