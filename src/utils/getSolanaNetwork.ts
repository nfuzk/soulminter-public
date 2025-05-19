export type SolanaNetwork = 'mainnet-beta' | 'devnet' | 'testnet';

export function getSolanaNetwork(): SolanaNetwork {
  const env = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
  if (env === 'mainnet-beta' || env === 'devnet' || env === 'testnet') {
    return env;
  }
  return 'devnet';
} 