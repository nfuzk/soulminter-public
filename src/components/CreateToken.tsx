import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useSimpleWalletAuth } from '../hooks/useSimpleWalletAuth';
import { useSecureRPC } from '../hooks/useSecureRPC';
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
  createUpdateMetadataAccountV2Instruction,
  PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { FC, useCallback, useState, useEffect, useRef } from "react";
import { notify } from "utils/notifications";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../views/create/styles.module.css";
import { FEE_CONFIG, UPLOAD_CONFIG, FEATURES, ERROR_MESSAGES } from '../config';
import { validateTokenName, validateTokenSymbol, validateTokenDecimals, validateInitialSupply, validateTokenDescription, validateCustomMintPattern } from '../utils/validation';
import { getSolanaNetwork } from '../utils/getSolanaNetwork';
import bs58 from "bs58";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Add loading steps enum
const LoadingStep = {
  INITIALIZING: "Initializing...",
  UPLOADING_IMAGE: "Uploading image to Arweave...",
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

// Modern Custom Switch Component
const ModernSwitch = ({ checked, onChange, id, label, disabled = false }) => (
  <div className={styles.modernSwitch}>
    <label className={styles.switchLabel}>
      <input 
        type="checkbox" 
        id={id} 
        checked={checked} 
        onChange={onChange} 
        className={styles.switchInput} 
        disabled={disabled}
      />
      <div className={styles.switchTrack}>
        <div className={styles.switchThumb}></div>
      </div>
      <span className={styles.switchText}>{label}</span>
  </label>
  </div>
);

// Helper to send transaction with simulation first, then fallback without preflight if simulation fails
async function sendWithFallback(secureRPC: any, rawTxBase64: string) {
  try {
    return await secureRPC.sendTransaction(rawTxBase64, {
      encoding: 'base64',
      skipPreflight: false, // first try with simulation
      preflightCommitment: 'processed',
      maxRetries: 3, // Allow retries for mainnet
    });
  } catch (err: any) {
    const msg: string = err?.message || '';
    if (
      msg.includes('simulation failed') ||
      msg.includes('already been processed') ||
      msg.includes('Transaction was previously processed') ||
      msg.includes('Blockhash not found') ||
      msg.includes('Transaction expired')
    ) {
      console.warn('sendWithFallback: simulation failed, retrying without preflight');
      // retry once without simulation with more retries
      return await secureRPC.sendTransaction(rawTxBase64, {
        encoding: 'base64',
        skipPreflight: true,
        preflightCommitment: 'processed',
        maxRetries: 5, // More retries for mainnet
      });
    }
    throw err;
  }
}

export const CreateToken: FC = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const { makeAuthenticatedRequest } = useSimpleWalletAuth();
  const secureRPC = useSecureRPC();
  const router = useRouter();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(LoadingStep.INITIALIZING);
  const [progress, setProgress] = useState(0);
  const [customMintPattern, setCustomMintPattern] = useState("");
  const [customMintPatternType, setCustomMintPatternType] = useState("prefix");
  const [mintGenProgress, setMintGenProgress] = useState({ attempts: 0, elapsed: 0, running: false });
  const [foundMintKeypair, setFoundMintKeypair] = useState<Keypair | null>(null);
  const loadingModalRef = useRef<HTMLDivElement>(null);
  const transactionLockRef = useRef<boolean>(false);

  // Add new state for toggling optional blocks
  const [isSocialLinksEnabled, setIsSocialLinksEnabled] = useState(false);
  const [isCustomMintEnabled, setIsCustomMintEnabled] = useState(false);

  // Toggle body class for loading state to control global styles
  useEffect(() => {
    if (isLoading) {
      document.body.classList.add('loading-active');
    } else {
      document.body.classList.remove('loading-active');
    }
  }, [isLoading]);

  const FEE_RECEIVER = new PublicKey("8347h8LeaVAUzyWES3Xj2Gd6QTpGrCayKBpuYvBW3PWD");


  const updateProgress = (step: string) => {
    const steps = Object.values(LoadingStep);
    const currentIndex = steps.indexOf(step);
    const progress = (currentIndex / (steps.length - 1)) * 100;
    setProgress(progress);
    setCurrentStep(step);
  };

  const handleImageChange = (event) => {
    if (!publicKey) return;
    
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

    // Prevent multiple submissions - check both state and ref lock
    if (isSubmitting || transactionLockRef.current) {
      notify({ type: 'error', message: 'Token creation already in progress. Please wait.' });
      return;
    }
    
    // Set submitting state and lock immediately to prevent race conditions
    setIsSubmitting(true);
    transactionLockRef.current = true;

    // Scroll to top immediately when user clicks create button
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    try {
      // Validate inputs first
      const nameValidation = validateTokenName(tokenName);
      if (!nameValidation.isValid) {
        notify({ type: "error", message: nameValidation.error });
        setIsSubmitting(false);
        transactionLockRef.current = false;
        return;
      }

      const symbolValidation = validateTokenSymbol(tokenSymbol);
      if (!symbolValidation.isValid) {
        notify({ type: "error", message: symbolValidation.error });
        setIsSubmitting(false);
        transactionLockRef.current = false;
        return;
      }

      const decimalsValidation = validateTokenDecimals(tokenDecimals);
      if (!decimalsValidation.isValid) {
        notify({ type: "error", message: decimalsValidation.error });
        setIsSubmitting(false);
        transactionLockRef.current = false;
        return;
      }

      if (initialMintAmount) {
        const supplyValidation = validateInitialSupply(initialMintAmount);
        if (!supplyValidation.isValid) {
          notify({ type: "error", message: supplyValidation.error });
          setIsSubmitting(false);
          transactionLockRef.current = false;
          return;
        }
      }

      // Validate custom mint pattern if provided
      if (customMintPattern) {
        const patternValidation = validateCustomMintPattern(customMintPattern);
        if (!patternValidation.isValid) {
          notify({ type: "error", message: patternValidation.error });
          setIsSubmitting(false);
          transactionLockRef.current = false;
          return;
        }
      }
    } catch (error) {
      console.error('Validation error:', error);
      notify({ type: "error", message: "Validation failed. Please try again." });
      setIsSubmitting(false);
      transactionLockRef.current = false;
      return;
    }

    // Handle custom mint address generation first
    if (customMintPattern && customMintPattern.length > 0) {
      setIsSubmitting(true);
      setMintGenProgress({ attempts: 0, elapsed: 0, running: true });
      
      const start = Date.now();
      let found = false;
      let attempts = 0;
      let foundCandidate = null;
      const pattern = customMintPattern;
      const isPrefix = customMintPatternType === "prefix";
      
      try {
        while (!found) {
          attempts++;
          const candidate = Keypair.generate();
          const base58 = bs58.encode(candidate.publicKey.toBytes());
          if (
            (isPrefix && base58.startsWith(pattern)) ||
            (!isPrefix && base58.endsWith(pattern))
          ) {
            // Store the found mint keypair for later use
            foundCandidate = candidate;
            setFoundMintKeypair(candidate);
            found = true;
            break;
          }
          if (attempts % 100 === 0) {
            setMintGenProgress({
              attempts,
              elapsed: Math.floor((Date.now() - start) / 1000),
              running: true
            });
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        }
        
        setMintGenProgress({
          attempts,
          elapsed: Math.floor((Date.now() - start) / 1000),
          running: false
        });
        
        // Show success notification when mint address is found
        const foundAddress = bs58.encode(foundCandidate!.publicKey.toBytes());
        console.log('Custom mint address found:', foundAddress);
        console.log('Pattern was:', pattern, 'Type:', isPrefix ? 'prefix' : 'suffix');
        notify({ 
          type: "success", 
          message: `Custom mint address found! ${foundAddress.slice(0, 8)}...${foundAddress.slice(-8)}` 
        });
        
        // Start token creation with the found custom mint keypair
        await startTokenCreation(foundCandidate);
        
      } catch (error) {
        notify({ type: "error", message: "Error generating custom mint address. Please try again." });
        setIsSubmitting(false);
        return;
      }
    } else {
      // No custom mint pattern, start token creation directly
      await startTokenCreation();
    }
  };

  const startTokenCreation = async (customMintKeypair?: Keypair, retryCount = 0) => {
    setIsLoading(true);
    updateProgress(LoadingStep.INITIALIZING);
    
    // Focus the loading modal to ensure it's visible
    setTimeout(() => {
      if (loadingModalRef.current) {
        loadingModalRef.current.focus();
      }
    }, 200);
    
    try {
      // Get the mint keypair (either custom or generated)
      let mintKeypair = null;
      if (customMintKeypair) {
        mintKeypair = customMintKeypair;
        console.log('Using custom mint keypair:', bs58.encode(customMintKeypair.publicKey.toBytes()));
      } else if (foundMintKeypair) {
        mintKeypair = foundMintKeypair;
        console.log('Using found mint keypair:', bs58.encode(foundMintKeypair.publicKey.toBytes()));
        setFoundMintKeypair(null); // Clean up
      } else {
        mintKeypair = Keypair.generate();
        console.log('Using generated mint keypair:', bs58.encode(mintKeypair.publicKey.toBytes()));
      }

      // Upload metadata to Arweave via server-side API
      let tokenUri = "";
      try {
        let imageUri = "https://pink-abstract-gayal-682.mypinata.cloud/ipfs/bafybeigjzuiviadtrfyvvo7o6ewccb46b3kgav2yi54fuf4vjxkb53da7i";
        
        if (imageFile) {
          updateProgress(LoadingStep.UPLOADING_IMAGE);
          
          // Upload image file via server-side API
          const imageFormData = new FormData();
          imageFormData.append('file', imageFile);
          
          const imageResponse = await fetch('/api/upload-file', {
            method: 'POST',
            body: imageFormData
          });
          
          if (!imageResponse.ok) {
            const errorData = await imageResponse.json();
            throw new Error(errorData.error || 'Failed to upload image');
          }
          
          const imageData = await imageResponse.json();
          imageUri = imageData.ipfsUrl;
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

        // Add social links to attributes if provided
        if (websiteUrl || telegramUrl || xUrl) {
          metadata.attributes = [
            ...(websiteUrl ? [{ trait_type: "Website", value: websiteUrl }] : []),
            ...(telegramUrl ? [{ trait_type: "Telegram", value: telegramUrl }] : []),
            ...(xUrl ? [{ trait_type: "Twitter", value: xUrl }] : [])
          ];
        }

        // Upload metadata JSON via server-side API
        const metadataResponse = await fetch('/api/upload-ipfs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ metadata })
        });
        
        if (!metadataResponse.ok) {
          const errorData = await metadataResponse.json();
          throw new Error(errorData.error || 'Failed to upload metadata');
        }
        
        const metadataData = await metadataResponse.json();
        tokenUri = metadataData.ipfsUrl;
      } catch (error: any) {
        throw new Error(`Failed to upload metadata: ${error.message}`);
      }

      // Create mint account
      updateProgress(LoadingStep.CREATING_MINT);
      // Use secureRPC instead of direct connection to avoid network errors
      let lamports: number;
      try {
        lamports = await getMinimumBalanceForRentExemptMint(connection);
      } catch (error: any) {
        // Fallback: use secureRPC if direct connection fails
        console.warn('Direct connection failed, using secureRPC fallback:', error);
        const result = await secureRPC.callRPC('getMinimumBalanceForRentExemption', [MINT_SIZE]);
        lamports = result;
      }
      
      // Calculate total cost including creation fee and transaction fee
      const creationFeeLamports = LAMPORTS_PER_SOL * FEE_CONFIG.CREATION_FEE;
      const estimatedTransactionFee = 5000000; // 0.005 SOL for transaction fee
      const totalCost = lamports + creationFeeLamports + estimatedTransactionFee;

      // Check balance
      const balance = await secureRPC.getBalance(publicKey.toString());
      if (balance < totalCost) {
        throw new Error(`Insufficient SOL balance. You need at least ${(totalCost / LAMPORTS_PER_SOL).toFixed(3)} SOL (including 0.2 SOL creation fee and transaction costs)`);
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

      updateProgress(LoadingStep.TRANSFERRING_FEE);

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
          const response = await makeAuthenticatedRequest(`/api/affiliate/${publicKey.toString()}/referral`);
          if (response.ok) {
            const data = await response.json();
            if (data.affiliateWallet) {
              affiliateWallet = new PublicKey(data.affiliateWallet.walletAddress);
              affiliateAmount = Math.floor(totalFeeLamports * FEE_CONFIG.AFFILIATE_COMMISSION);
              feeReceiverAmount = totalFeeLamports - affiliateAmount;
            }
          } else if (response.status === 404) {
            // No affiliate relationship found - this is normal
          } else {
            // Silent failure for affiliate check
          }
        } catch (error) {
          // Continue with token creation even if affiliate check fails
        }
      }

      // No creators array - set to null
      const creatorsArray = null;

      // Create transaction
      const tx = new Transaction();
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
        updateProgress(LoadingStep.TRANSFERRING_COMMISSION);
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
      updateProgress(LoadingStep.INITIALIZING_MINT);
      tx.add(
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          Number(tokenDecimals),
          publicKey,
          publicKey,
          TOKEN_PROGRAM_ID
        )
      );

      updateProgress(LoadingStep.CREATING_ATA);
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

      // Add metadata instruction
      updateProgress(LoadingStep.ADDING_METADATA);
      const burnAddress = new PublicKey('11111111111111111111111111111111');

      // If immutable is requested, use burn address as update authority from the start
      const updateAuthority = makeMetadataImmutable ? burnAddress : publicKey;

      tx.add(
        createCreateMetadataAccountV3Instruction(
          {
            metadata: metadataAddress,
            mint: mintKeypair.publicKey,
            mintAuthority: publicKey,
            payer: publicKey,
            updateAuthority: updateAuthority,
          },
          {
            createMetadataAccountArgsV3: {
              data: {
                name: tokenName,
                symbol: tokenSymbol,
                uri: tokenUri,
                sellerFeeBasisPoints: 0,
                creators: creatorsArray,
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

      // Add unique memo to ensure unique signature
      // Use a combination of timestamp, random number, mint address, and user wallet for maximum uniqueness
      const transactionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${mintKeypair.publicKey.toString().slice(0, 8)}-${publicKey.toString().slice(0, 8)}`;
      tx.add(new TransactionInstruction({
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        keys: [],
        data: Buffer.from(transactionId),
      }));

      // Begin transaction send & confirmation block
      let signature: string; // Declare signature in broader scope
      try {
        updateProgress(LoadingStep.FINALIZING);
        
        // Add a small delay to ensure transaction uniqueness, especially on devnet
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Get a fresh blockhash right before sending
        const { blockhash, lastValidBlockHeight } = await secureRPC.getLatestBlockhash('processed');
        tx.recentBlockhash = blockhash;
        tx.lastValidBlockHeight = lastValidBlockHeight;

        // Log transaction size before signing (for debugging)
        const txSizeBeforeSigning = tx.serialize({ requireAllSignatures: false, verifySignatures: false }).length;
        const txSizeLimit = 1232; // Solana's transaction size limit in bytes
        const txSizePercent = (txSizeBeforeSigning / txSizeLimit) * 100;
        console.log(`Transaction size: ${txSizeBeforeSigning} bytes (${txSizePercent.toFixed(2)}% of ${txSizeLimit} byte limit)`);
        console.log(`Transaction instructions: ${tx.instructions.length}`);
        if (txSizePercent > 80) {
          console.warn(`⚠️ Transaction size is ${txSizePercent.toFixed(2)}% of limit - approaching Solana's size limit!`);
        }

        // Simulate transaction before signing (as per Phantom's best practices)
        try {
          const simulationResult = await secureRPC.simulateTransaction(tx);
          if (simulationResult.value?.err) {
            throw new Error(`Transaction simulation failed: ${JSON.stringify(simulationResult.value.err)}`);
          }
          console.log('Transaction simulation successful');
        } catch (simError: any) {
          console.error('Transaction simulation error:', simError);
          throw new Error(`Transaction simulation failed: ${simError.message}`);
        }

        // Sign with Phantom wallet FIRST (as per Phantom's best practices)
        if (!signTransaction) {
          throw new Error('Wallet transaction methods not available');
        }

        const signedTx = await signTransaction(tx);

        // THEN add mintKeypair signature
        signedTx.partialSign(mintKeypair);

        // Log final transaction size after signing
        const signedTxBuffer = signedTx.serialize();
        const rawTx = signedTxBuffer.toString('base64');
        const finalTxSize = signedTxBuffer.length;
        const finalTxSizePercent = (finalTxSize / txSizeLimit) * 100;
        console.log(`Final transaction size: ${finalTxSize} bytes (${finalTxSizePercent.toFixed(2)}% of ${txSizeLimit} byte limit)`);

      // Send via secure RPC to Helius avoiding wallet adapter sendTransaction issues
      // Add timeout to prevent hanging transactions - increased for mainnet
      const sendTransactionPromise = sendWithFallback(secureRPC, rawTx);
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Transaction send timeout')), 90000); // 90 second timeout for cold starts
      });
      
      signature = await Promise.race([sendTransactionPromise, timeoutPromise]);

      // Wait for confirmation using getSignatureStatuses loop with improved logic
      const confirmationTimeout = 180000; // 3 minutes for mainnet (extended for cold starts)
      const startTime = Date.now();
      let status = null;
      let lastError = null;
      let consecutiveErrors = 0;
      const maxConsecutiveErrors = 3; // Stop after 3 consecutive errors (reduced to fail faster)
      const maxStatusChecks = 60; // Maximum 60 status checks to prevent infinite loops
      let statusCheckCount = 0;
      
      while (
        Date.now() - startTime < confirmationTimeout && 
        consecutiveErrors < maxConsecutiveErrors &&
        statusCheckCount < maxStatusChecks // Prevent infinite loops
      ) {
        try {
          statusCheckCount++;
          const statusResp = await secureRPC.getSignatureStatuses([signature]);
          status = statusResp && statusResp.value && statusResp.value[0];
          consecutiveErrors = 0; // Reset error counter on successful request
          
          if (status) {
            if (status.err) {
              throw new Error('Transaction failed: ' + JSON.stringify(status.err));
            }
            // Accept both 'finalized' and 'confirmed' for better reliability
            if (status.confirmationStatus === 'finalized' || status.confirmationStatus === 'confirmed') {
              break;
            }
            
            // If transaction is still null after many checks, it may have expired
            if (status.confirmationStatus === null && statusCheckCount > 20) {
              console.warn('Transaction appears to have expired or failed');
              throw new Error('Transaction expired - please try again');
            }
          }
        } catch (e) {
          lastError = e;
          consecutiveErrors++;
          console.warn(`Status check failed (${consecutiveErrors}/${maxConsecutiveErrors}), retrying...`, e);
          
          // If we've hit too many consecutive errors, break early
          if (consecutiveErrors >= maxConsecutiveErrors) {
            console.error('Too many consecutive RPC errors, stopping confirmation polling');
            break;
          }
        }
        
        // Progressive backoff with jitter to prevent thundering herd
        const baseDelay = Math.min(2000 + (statusCheckCount * 300), 8000); // Increase delay over time, max 8s
        const jitter = Math.random() * 1000; // Add random jitter
        await new Promise(res => setTimeout(res, baseDelay + jitter));
      }
      
      // Log final status for debugging
      console.log(`Confirmation loop ended. Status checks: ${statusCheckCount}/${maxStatusChecks}, Consecutive errors: ${consecutiveErrors}/${maxConsecutiveErrors}`);
      
      if (!status || (status.confirmationStatus !== 'finalized' && status.confirmationStatus !== 'confirmed')) {
        // Only do final check if we haven't hit too many consecutive errors
        if (consecutiveErrors < maxConsecutiveErrors) {
          try {
            const finalCheck = await secureRPC.getSignatureStatuses([signature]);
            const finalStatus = finalCheck && finalCheck.value && finalCheck.value[0];
            if (finalStatus && (finalStatus.confirmationStatus === 'finalized' || finalStatus.confirmationStatus === 'confirmed') && !finalStatus.err) {
              console.log('Transaction confirmed on final check');
              status = finalStatus;
            } else {
              throw new Error(`Transaction confirmation timed out after ${confirmationTimeout/1000} seconds. Last error: ${lastError?.message || 'Unknown'}`);
            }
          } catch (finalError) {
            throw new Error(`Transaction confirmation timed out after ${confirmationTimeout/1000} seconds. Last error: ${lastError?.message || 'Unknown'}`);
          }
        } else {
          throw new Error(`Transaction confirmation failed due to RPC errors. Last error: ${lastError?.message || 'Unknown'}`);
        }
      }

      // Update affiliate earnings if applicable
      if (affiliateWallet && affiliateAmount > 0) {
        try {
          const commissionAmount = Math.round((affiliateAmount / LAMPORTS_PER_SOL) * 100) / 100;
          const earningsResponse = await makeAuthenticatedRequest(`/api/affiliate/${affiliateWallet.toString()}/earnings`, {
            method: 'POST',
            body: JSON.stringify({
              amount: commissionAmount,
              transactionId: signature,
              timestamp: new Date().toISOString(),
              userWallet: publicKey.toString(),
            }),
          });
          
          if (!earningsResponse.ok) {
            // Silent failure for affiliate earnings update
          }
        } catch (error) {
          // Don't fail the token creation if affiliate earnings update fails
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
      
      // Handle specific error cases
      if (error.message?.includes("insufficient funds")) {
        throw new Error("Insufficient SOL balance to complete the transaction");
      } else if (error.message?.includes("blockhash")) {
        throw new Error("Transaction expired. Please try again.");
      } else if (error.message?.includes("too large")) {
        throw new Error("Transaction too large. Please reduce the number of instructions.");
      } else if (error.message?.includes("signature")) {
        throw new Error("Transaction signing failed. Please try again.");
      } else if (error.message?.includes("already been processed")) {
        // Check if the transaction was actually successful by looking up the signature
        try {
          const statusResp = await secureRPC.getSignatureStatuses([signature]);
          const status = statusResp && statusResp.value && statusResp.value[0];
          if (status && status.confirmationStatus === 'finalized' && !status.err) {
            // Transaction was actually successful, treat as success
            updateProgress(LoadingStep.COMPLETE);
            setTokenMintAddress(mintKeypair.publicKey.toString());
            notify({
              type: "success",
              message: "Token created successfully!",
              txid: signature
            });
            return; // Exit early since transaction was successful
          }
        } catch (lookupError) {
          // If we can't verify the status, fall through to the error
        }
        throw new Error("Transaction was already processed. Please check your wallet for the new token.");
      } else if (error.message?.includes("simulation failed")) {
        throw new Error("Transaction simulation failed. Please try again with a fresh page.");
      } else {
        throw new Error(`Transaction failed: ${error.message || "Unknown error"}`);
      }
    }

  } catch (error: any) {
    // Check if this is a timeout error and we haven't exceeded retry limit
    if (error.message?.includes('confirmation timed out') && retryCount < 2) {
      console.log(`Transaction timeout, retrying... (attempt ${retryCount + 1}/2)`);
      setIsLoading(false);
      setIsSubmitting(false);
      transactionLockRef.current = false;
      
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Retry the transaction
      return startTokenCreation(customMintKeypair, retryCount + 1);
    }
    
    notify({ 
      type: "error", 
      message: "Token creation failed",
      description: error.message
    });
    console.error("Token creation error:", error);
  } finally {
    setIsLoading(false);
    setIsSubmitting(false);
    transactionLockRef.current = false;
  }
};

  return (
    <>


      {/* Token Creation Loading Modal - Rendered outside form structure */}
      {isLoading && (
        <div className={styles.loadingModal} ref={loadingModalRef}>
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

      <div className={styles.tokenForm}>
        {!publicKey && !tokenMintAddress && (
          <div className={styles.walletConnectCard}>
            <div className={styles.walletIcon}>🔗</div>
            <h2 className={styles.walletTitle}>Connect Your Wallet</h2>
            <p className={styles.walletSubtitle}>Please connect your wallet to create a token.</p>
          </div>
        )}

      
      {!tokenMintAddress && (
        <div className={styles.formSections}>
          {/* Basic Token Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Basic Information</h3>
            <div className={styles.imageUploadSection}>
              <div className={styles.imagePreview}>
                {imageFile ? (
                  <Image 
                    src={URL.createObjectURL(imageFile)} 
                    alt="Token preview" 
                    className={styles.previewImage}
                    width={200}
                    height={200}
                  />
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <div className={styles.uploadIcon}>📷</div>
                    <p>Upload Token Image</p>
                  </div>
                )}
                  <input
                    type="file"
                    onChange={handleImageChange}
                  accept="image/*"
                  className={styles.fileInput}
                  disabled={!publicKey}
                  />
              </div>
              <div className={styles.basicFields}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Token Name</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="Enter token name"
                    disabled={!publicKey}
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
                    disabled={!publicKey}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    value={tokenDescription}
                    onChange={(e) => setTokenDescription(e.target.value)}
                    placeholder="Describe your token"
                    disabled={!publicKey}
                  />
                </div>
                </div>
              </div>
            </div>

          {/* Token Configuration */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Token Configuration</h3>
            <div className={styles.configGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Decimals</label>
                  <input
                    className={styles.input}
                    type="number"
                    value={tokenDecimals}
                    onChange={(e) => setTokenDecimals(e.target.value)}
                  placeholder="9"
                    disabled={!publicKey}
                  />
                </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Initial Supply</label>
                  <input
                    className={styles.input}
                    type="number"
                    value={initialMintAmount}
                    onChange={(e) => setInitialMintAmount(e.target.value)}
                  placeholder="0"
                    disabled={!publicKey}
                  />
                </div>
              </div>
            
            <div className={styles.authorityOptions}>
              <h4 className={styles.optionsTitle}>Authority Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Revoke Mint */}
                <div
                  onClick={() => !publicKey ? null : setRevokeMintAuthority(!revokeMintAuthority)}
                  className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    revokeMintAuthority
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                  } ${!publicKey ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-sm">Revoke Mint Authority</h5>
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors">
                      {revokeMintAuthority ? (
                        <div className="w-full h-full rounded-full bg-purple-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-full border border-white/30"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">Permanently disables minting additional tokens. Cannot be undone.</p>
                </div>

                {/* Revoke Freeze */}
                <div
                  onClick={() => !publicKey ? null : setRevokeFreezeAuthority(!revokeFreezeAuthority)}
                  className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    revokeFreezeAuthority
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                  } ${!publicKey ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-sm">Revoke Freeze Authority</h5>
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors">
                      {revokeFreezeAuthority ? (
                        <div className="w-full h-full rounded-full bg-purple-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-full border border-white/30"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">Prevents freezing token accounts. Cannot be undone.</p>
                </div>

                {/* Immutable Metadata */}
                <div
                  onClick={() => !publicKey ? null : setMakeMetadataImmutable(!makeMetadataImmutable)}
                  className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    makeMetadataImmutable
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                  } ${!publicKey ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-sm">Make Metadata Immutable</h5>
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors">
                      {makeMetadataImmutable ? (
                        <div className="w-full h-full rounded-full bg-purple-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-full border border-white/30"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">Locks metadata and renounces update authority forever. Cannot be undone.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className={styles.formSection}>
            <ModernSwitch
              checked={isSocialLinksEnabled}
              onChange={() => !publicKey ? null : setIsSocialLinksEnabled(!isSocialLinksEnabled)}
              id="social-links"
              label="Add Social Links"
              disabled={!publicKey}
            />
                {isSocialLinksEnabled && (
              <div className={styles.socialLinksGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Website</label>
                      <input
                        className={styles.input}
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://your-website.com"
                        disabled={!publicKey}
                      />
                    </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Telegram</label>
                      <input
                        className={styles.input}
                        type="url"
                        value={telegramUrl}
                        onChange={(e) => setTelegramUrl(e.target.value)}
                    placeholder="https://t.me/your-group"
                        disabled={!publicKey}
                      />
                    </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Twitter/X</label>
                      <input
                        className={styles.input}
                        type="url"
                        value={xUrl}
                        onChange={(e) => setXUrl(e.target.value)}
                    placeholder="https://x.com/your-handle"
                        disabled={!publicKey}
                      />
                    </div>
                  </div>
                )}
            </div>


          {/* Custom Mint Address */}
          <div className={styles.formSection}>
            <ModernSwitch
              checked={isCustomMintEnabled}
              onChange={() => !publicKey ? null : setIsCustomMintEnabled(!isCustomMintEnabled)}
              id="custom-mint"
              label="Custom Mint Address Pattern"
              disabled={!publicKey}
            />
                {isCustomMintEnabled && (
              <div className={styles.customMintGrid}>
                 <div className={styles.formGroup}>
                   <label className={styles.label}>Pattern (max 2 characters)</label>
                       <input
                         className={styles.input}
                         type="text"
                         maxLength={2}
                         value={customMintPattern}
                         onChange={e => setCustomMintPattern(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2))}
                     placeholder="AB"
                         disabled={!publicKey}
                       />
                     </div>
                <div className={styles.formGroup}>
                      <label className={styles.label}>Pattern Type</label>
                      <select
                        className={styles.input}
                        value={customMintPatternType}
                        onChange={e => setCustomMintPatternType(e.target.value)}
                        disabled={!publicKey}
                      >
                        <option value="prefix">Prefix</option>
                        <option value="suffix">Suffix</option>
                      </select>
                    </div>
                      {mintGenProgress.running && (
                  <div className={styles.mintProgressContainer}>
                    <div className={styles.mintProgressHeader}>
                      <span className={styles.mintProgressText}>
                        🔍 Searching for pattern: <strong>{customMintPattern}</strong>
                      </span>
                      <span className={styles.mintProgressStats}>
                        {mintGenProgress.attempts.toLocaleString()} attempts • {mintGenProgress.elapsed}s
                      </span>
                    </div>
                    <div className={styles.mintProgressBar}>
                      <div 
                        className={styles.mintProgressFill}
                        style={{ 
                          width: `${Math.min((mintGenProgress.attempts / Math.pow(58, customMintPattern.length)) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <div className={styles.mintProgressTip}>
                      💡 Tip: Shorter patterns (1-2 characters) are found much faster
                    </div>
                  </div>
                      )}

                  </div>
                )}
            </div>

          {/* Create Button */}
          <div className={styles.createSection}>
            <div className={styles.termsText}>
              By clicking create, you agree to our{' '}
              <a href="/terms" className={styles.termsLink} target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="/privacy" className={styles.termsLink} target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </div>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleCreateToken}
              disabled={!publicKey || isLoading || isSubmitting}
            >
              {!publicKey ? "Connect Wallet to Create Token" : isLoading ? "Creating..." : "Create Token (0.2 SOL fee)"}
            </button>
          </div>
        </div>
      )}

      {publicKey && tokenMintAddress && !isLoading && (
        <div className={styles.successMessage}>
          <h3 className={styles.successTitle}>Token Created Successfully!</h3>
          <p>Your token has been deployed to the Solana blockchain.</p>
          <div className={styles.successAddress}>
            <strong>Token Address:</strong> {tokenMintAddress}
          </div>
          <a
            className={styles.successLink}
            href={`https://explorer.solana.com/address/${tokenMintAddress}?cluster=${getSolanaNetwork()}`}
            target="_blank"
            rel="noreferrer"
          >
            View on Explorer →
          </a>
        </div>
      )}
      </div>
    </>
  );
};