import { FC, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { WalletMultiButton, useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAutoConnect } from "../contexts/AutoConnectProvider";
import { useCookieConsent } from "../contexts/CookieConsentContext";
import { GearIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { WalletName } from "@solana/wallet-adapter-base";
import { SolanaMobileWalletAdapterWalletName } from "@solana-mobile/wallet-standard-mobile";
import type { SolanaSignInInput } from "@solana/wallet-standard-features";
import { notify } from "../utils/notifications";
import styles from '../views/home/styles.module.css';

export const AppBar: FC = () => {
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const { showSettings } = useCookieConsent();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isBlogSubdomain, setIsBlogSubdomain] = useState(false);
  const { connection } = useConnection();
  const { disconnect, connected, wallet, connect, signIn, select, wallets, connecting } = useWallet();
  const { setVisible: showWalletSelectionModal } = useWalletModal();
  const prevAutoConnectRef = useRef<boolean>(autoConnect);

  useEffect(() => {
    setMounted(true);
    // Check if we're on the blog subdomain
    if (typeof window !== 'undefined') {
      setIsBlogSubdomain(window.location.hostname === 'blog.soulminter.io' || window.location.hostname === 'www.blog.soulminter.io');
    }
  }, []);

  // Handle auto-connect toggle: when turned on, attempt to reconnect if wallet was previously connected
  useEffect(() => {
    // Only trigger if autoConnect was just turned on (changed from false to true)
    if (autoConnect && !prevAutoConnectRef.current && !connected && !connecting && mounted) {
      // Check if there's a stored wallet name
      const storedWalletName = typeof window !== 'undefined' ? localStorage.getItem('walletName') : null;
      
      if (storedWalletName) {
        // Find the wallet by name
        const walletToConnect = wallets.find(w => w.adapter.name === storedWalletName);
        
        if (walletToConnect) {
          // Select and connect the previously used wallet
          select(walletToConnect.adapter.name);
          // Small delay to ensure wallet is selected before connecting
          setTimeout(() => {
            connect().catch((error) => {
              console.log('Auto-connect attempt failed:', error);
              // Don't show error to user - this is expected if wallet is not available
            });
          }, 100);
        }
      }
    }
    
    // Update the ref to track previous value
    prevAutoConnectRef.current = autoConnect;
  }, [autoConnect, connected, connecting, mounted, wallets, select, connect]);

  // Close settings when mobile menu closes
  useEffect(() => {
    if (!menuOpen) {
      setSettingsOpen(false);
    }
  }, [menuOpen]);

  // Close settings dropdown when clicking outside
  const settingsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    };

    if (settingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [settingsOpen]);

  // Helper function to get the correct URL - redirect to main site if on blog subdomain
  const getMainSiteUrl = (path: string = '') => {
    if (isBlogSubdomain) {
      return `https://soulminter.io${path}`;
    }
    return path;
  };

  // Find MWA wallet if available
  const mobileWalletAdapter = wallets.find(
    (w) => w.adapter.name === SolanaMobileWalletAdapterWalletName
  );

  // Handle wallet connection following MWA UX guidelines
  // https://docs.solanamobile.com/mobile-wallet-adapter/ux-guidelines
  // IMPORTANT: For MWA, use signIn() instead of connect() to do connect + signMessage in a single user action
  // This ensures the connection prompt appears and WebSocket is established properly
  const handleConnectClick = async () => {
    if (connected) {
      await disconnect();
      return;
    }

    try {
      // If MWA is already selected, use signIn() instead of connect()
      // signIn() does both connect + signMessage in a single user action, which is required for MWA
      // This must be called directly from the user click - no timeouts or wrappers
      if (wallet?.adapter?.name === SolanaMobileWalletAdapterWalletName) {
        // Verify adapter is ready
        if (wallet.readyState !== 'Installed' && wallet.readyState !== 'Loadable') {
          console.error('MWA adapter not ready, readyState:', wallet.readyState);
          notify({
            type: "error",
            message: "Wallet adapter is not ready. Please try again.",
            persistent: true,
          });
          return;
        }
        
        // Verify signIn is available
        if (!signIn) {
          console.error('signIn() not available - falling back to connect()');
          // Fallback to connect() if signIn is not available
          await connect();
          return;
        }
        
        // Prepare signIn input - following EIP-4361 format
        const signInInput: SolanaSignInInput = {
          domain: typeof window !== 'undefined' ? window.location.hostname : 'soulminter.io',
          statement: 'Sign in to SoulMinter',
          uri: typeof window !== 'undefined' ? window.location.origin : 'https://soulminter.io',
        };
        
        // Call signIn() - this does connect + signMessage in one user action
        // This should trigger Android Intent to open wallet app with connection + sign-in prompt
        await signIn(signInInput);
      } 
      // If MWA is not selected but available, select it first, then use signIn()
      // Per UX guidelines: "If it is not selected, but available, select it as early as possible"
      else if (mobileWalletAdapter) {
        // Select MWA first - must happen synchronously from user click
        select(SolanaMobileWalletAdapterWalletName as WalletName);
        
        // Minimal delay to allow selection to propagate
        // Use only one animation frame to maintain user interaction context
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        // Verify signIn is available
        if (!signIn) {
          console.error('signIn() not available - falling back to connect()');
          // Fallback to connect() if signIn is not available
          await connect();
          return;
        }
        
        // Prepare signIn input - following EIP-4361 format
        const signInInput: SolanaSignInInput = {
          domain: typeof window !== 'undefined' ? window.location.hostname : 'soulminter.io',
          statement: 'Sign in to SoulMinter',
          uri: typeof window !== 'undefined' ? window.location.origin : 'https://soulminter.io',
        };
        
        // Immediately call signIn() - must be from the same user interaction
        // This triggers Android Intent which opens wallet app and establishes WebSocket
        // signIn() does both connect + signMessage in one action
        await signIn(signInInput);
      } 
      // Otherwise, show the wallet selection modal
      else {
        showWalletSelectionModal(true);
      }
    } catch (error: any) {
      console.error('Failed to connect MWA:', error);
      console.error('Error details:', {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
        toString: String(error),
      });
      
      const errorMessage = error?.message || String(error) || 'Unknown error';
      
      // Show user-friendly error notification
      if (errorMessage.includes('no installed wallet') || errorMessage.includes('mobile wallet protocol')) {
        notify({
          type: "error",
          message: "No wallet app found. Please install Phantom or Solflare and try again.",
          persistent: true,
        });
      } else if (errorMessage.includes('rejected') || errorMessage.includes('denied')) {
        notify({
          type: "info",
          message: "Connection was rejected. Please try again and approve the connection in your wallet app.",
        });
      } else {
        notify({
          type: "error",
          message: `Connection failed: ${errorMessage}`,
          persistent: true,
        });
      }
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="navbar bg-[#0F1624] text-white shadow-lg relative z-50">
      <div className="flex-1">
        <Link href={getMainSiteUrl('/')} className="btn btn-ghost normal-case flex items-center">
          <Image src="https://pink-abstract-gayal-682.mypinata.cloud/ipfs/bafybeieue5otjvplqi2exrkdaxwdmjwsa2c7obiheim4wilcj6tleq63n4" alt="SoulMinter Logo" width={35} height={35} style={{ marginRight: '0.5rem', borderRadius: '0.3rem' }} />
          <span className={styles.title} style={{fontSize: '1.5rem', marginBottom: 0, fontWeight: 700}}>SoulMinter</span>
        </Link>
      </div>
      {/* Desktop Nav */}
      <div className="flex-none gap-2 hidden md:flex items-center">
        <Link href={getMainSiteUrl('/')} className="btn btn-ghost">
          Home
        </Link>
        <Link href={getMainSiteUrl('/create')} className="btn btn-ghost">
          Create Token
        </Link>
        <Link href={getMainSiteUrl('/manage-token')} className="btn btn-ghost">
          Manage Tokens
        </Link>
        <Link href={getMainSiteUrl('/affiliate')} className="btn btn-ghost">
          Affiliate
        </Link>
        <Link href="https://blog.soulminter.io" className="btn btn-ghost">
          Blog
        </Link>
        {mobileWalletAdapter ? (
          <button
            className="wallet-adapter-button wallet-adapter-button-trigger"
            onClick={handleConnectClick}
            disabled={false}
          >
            {connected ? 'Disconnect' : 'Connect Wallet'}
          </button>
        ) : (
          <WalletMultiButton />
        )}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-square">
            <GearIcon className="h-5 w-5" />
          </label>
          <ul tabIndex={0} className="dropdown-content z-[9999] menu p-2 shadow bg-[#0F1624] rounded-box w-52 mt-2">
            <li>
              <div className="form-control w-full">
                <label className="cursor-pointer label">
                  <span className="label-text text-white">Auto-connect</span>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={autoConnect}
                    onChange={(e) => setAutoConnect(e.target.checked)}
                  />
                </label>
              </div>
            </li>
            <li>
              <button 
                onClick={showSettings}
                className="btn btn-ghost w-full justify-start text-white hover:bg-gray-700"
              >
                🍪 Cookie Settings
              </button>
            </li>
          </ul>
        </div>
      </div>
      {/* Mobile Nav */}
      <div className="flex-none md:hidden">
        <button
          className="btn btn-ghost btn-square"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open menu"
        >
          <HamburgerMenuIcon className="h-6 w-6" />
        </button>
        {menuOpen && (
          <div className="absolute top-16 right-2 z-[9999] bg-[#0F1624] rounded-lg shadow-lg w-48 flex flex-col p-2">
            <Link href={getMainSiteUrl('/')} className="btn btn-ghost w-full mb-1" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href={getMainSiteUrl('/create')} className="btn btn-ghost w-full mb-1" onClick={() => setMenuOpen(false)}>
              Create Token
            </Link>
            <Link href={getMainSiteUrl('/manage-token')} className="btn btn-ghost w-full mb-1" onClick={() => setMenuOpen(false)}>
              Manage Tokens
            </Link>
            <Link href={getMainSiteUrl('/affiliate')} className="btn btn-ghost w-full mb-1" onClick={() => setMenuOpen(false)}>
              Affiliate
            </Link>
            <Link href="https://blog.soulminter.io" className="btn btn-ghost w-full mb-1" onClick={() => setMenuOpen(false)}>
              Blog
            </Link>
            <div className="mb-1">
              {mobileWalletAdapter ? (
                <button
                  className="wallet-adapter-button wallet-adapter-button-trigger w-full"
                  onClick={() => {
                    handleConnectClick();
                    setMenuOpen(false);
                  }}
                  disabled={false}
                >
                  {connected ? 'Disconnect' : 'Connect Wallet'}
                </button>
              ) : (
                <WalletMultiButton />
              )}
            </div>
            <div className="w-full relative" ref={settingsRef}>
              <button 
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="btn btn-ghost btn-square w-full flex justify-between"
              >
                <span>Settings</span>
                <GearIcon className="h-5 w-5" />
              </button>
              {settingsOpen && (
                <ul className="z-[9999] menu p-2 shadow bg-[#0F1624] rounded-box w-52 mt-2 absolute right-0 top-full border border-white/10">
                  <li>
                    <div className="form-control w-full">
                      <label className="cursor-pointer label">
                        <span className="label-text text-white">Auto-connect</span>
                        <input
                          type="checkbox"
                          className="toggle"
                          checked={autoConnect}
                          onChange={(e) => {
                            setAutoConnect(e.target.checked);
                          }}
                        />
                      </label>
                    </div>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        showSettings();
                        setMenuOpen(false);
                        setSettingsOpen(false);
                      }}
                      className="btn btn-ghost w-full justify-start text-white hover:bg-gray-700"
                    >
                      🍪 Cookie Settings
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
