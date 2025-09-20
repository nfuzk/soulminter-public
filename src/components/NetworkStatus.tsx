import { FC, useEffect, useState } from "react";
import { getSolanaNetwork } from '../utils/getSolanaNetwork';

export const NetworkStatus: FC = () => {
  const [mounted, setMounted] = useState(false);
  const network = getSolanaNetwork();
  // Map network configurations to display names
  const networkDisplayNames = {
    "mainnet-beta": "Solana Mainnet",
    "devnet": "Solana Devnet",
    "testnet": "Solana Testnet"
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial client render, use mainnet
  const displayNetwork = mounted 
    ? (networkDisplayNames[network] || "Solana Mainnet")
    : "Solana Mainnet";

  return (
    <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-xl rounded-lg px-3 py-1.5 border border-purple-500/20">
      <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
      <span className="text-white text-sm">{displayNetwork}</span>
    </div>
  );
}; 