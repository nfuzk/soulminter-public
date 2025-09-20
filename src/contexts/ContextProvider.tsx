import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { FC, ReactNode, useCallback, useMemo, useEffect } from "react";
import { AutoConnectProvider, useAutoConnect } from "./AutoConnectProvider";
import { notify } from "../utils/notifications";
import { getSolanaNetwork } from '../utils/getSolanaNetwork';

const WalletStateResetter: FC = () => {
  const { connected } = useWallet();
  useEffect(() => {
    if (!connected) {
      localStorage.removeItem("walletName");
      localStorage.removeItem("wallet-adapter-react-connection");
    }
  }, [connected]);
  return null;
};

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  const network = getSolanaNetwork() as WalletAdapterNetwork;
  
  // Configure wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  );
  const endpoint = useMemo(
    () => {
      // Use public RPC endpoints for wallet connection
      // Actual RPC calls will go through our secure proxy
      if (network === WalletAdapterNetwork.Mainnet) {
        return "https://api.mainnet-beta.solana.com";
      } else if (network === WalletAdapterNetwork.Devnet) {
        return "https://api.devnet.solana.com";
      } else if (network === WalletAdapterNetwork.Testnet) {
        return "https://api.testnet.solana.com";
      } else {
        return clusterApiUrl(network);
      }
    },
    [network],
  );

  const onError = useCallback((error: WalletError) => {
    // Suppress notification for user rejection
    if (
      (error.message && error.message.toLowerCase().includes("user rejected the request")) ||
      (error.name === 'WalletConnectionError' && error.message && error.message.toLowerCase().includes('connection rejected'))
    ) {
      return;
    }
    // Phantom wallet not installed: redirect and notify
    if (error.name === 'WalletNotReadyError' || error.message?.includes('Phantom')) {
      window.open('https://phantom.app/download', '_blank');
      notify({
        type: "info",
        message: "After installing Phantom, please refresh this page to connect your wallet.",
        persistent: true,
      });
      return;
    }
    notify({
      type: "error",
      message: error.message ? `${error.name}: ${error.message}` : error.name,
    });
    console.error(error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        onError={onError}
        autoConnect={autoConnect}
      >
        <WalletModalProvider>
          <WalletStateResetter />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AutoConnectProvider>
      <WalletContextProvider>{children}</WalletContextProvider>
    </AutoConnectProvider>
  );
};
