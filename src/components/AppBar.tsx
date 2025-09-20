import { FC, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAutoConnect } from "../contexts/AutoConnectProvider";
import { useCookieConsent } from "../contexts/CookieConsentContext";
import { GearIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import styles from '../views/home/styles.module.css';

export const AppBar: FC = () => {
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const { showSettings } = useCookieConsent();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { connection } = useConnection();
  const { disconnect, connected, wallet } = useWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="navbar bg-[#0F1624] text-white shadow-lg">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case flex items-center">
          <Image src="https://pink-abstract-gayal-682.mypinata.cloud/ipfs/bafybeieue5otjvplqi2exrkdaxwdmjwsa2c7obiheim4wilcj6tleq63n4" alt="SoulMinter Logo" width={35} height={35} style={{ marginRight: '0.5rem', borderRadius: '0.3rem' }} />
          <span className={styles.title} style={{fontSize: '1.5rem', marginBottom: 0, fontWeight: 700}}>SoulMinter</span>
        </Link>
      </div>
      {/* Desktop Nav */}
      <div className="flex-none gap-2 hidden md:flex items-center">
        <Link href="/" className="btn btn-ghost">
          Home
        </Link>
        <Link href="/create" className="btn btn-ghost">
          Create Token
        </Link>
        <Link href="/affiliate" className="btn btn-ghost">
          Affiliate
        </Link>
        <WalletMultiButton />
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-square">
            <GearIcon className="h-5 w-5" />
          </label>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-[#0F1624] rounded-box w-52">
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
          <div className="absolute top-16 right-2 z-50 bg-[#0F1624] rounded-lg shadow-lg w-48 flex flex-col p-2">
            <Link href="/" className="btn btn-ghost w-full mb-1" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/create" className="btn btn-ghost w-full mb-1" onClick={() => setMenuOpen(false)}>
              Create Token
            </Link>
            <Link href="/affiliate" className="btn btn-ghost w-full mb-1" onClick={() => setMenuOpen(false)}>
              Affiliate
            </Link>
            <div className="mb-1">
              <WalletMultiButton />
            </div>
            <div className="dropdown dropdown-end w-full">
              <label tabIndex={0} className="btn btn-ghost btn-square w-full flex justify-between">
                <span>Settings</span>
                <GearIcon className="h-5 w-5" />
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-[#0F1624] rounded-box w-52">
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
                    onClick={() => {
                      showSettings();
                      setMenuOpen(false);
                    }}
                    className="btn btn-ghost w-full justify-start text-white hover:bg-gray-700"
                  >
                    🍪 Cookie Settings
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
