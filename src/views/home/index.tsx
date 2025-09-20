import { FC, useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import { AffiliateLink } from "../../components/AffiliateLink";
import { useMobileDetection } from "../../utils/mobileDetection";

export const HomeView: FC = ({}) => {
  const { publicKey, connect, disconnect } = useWallet();
  const router = useRouter();
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isMobile = useMobileDetection();

  const handleConnectWallet = () => {
    if (publicKey) {
      disconnect();
    } else {
      connect();
    }
  };

  useEffect(() => {
    // Initialize Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all feature items and step items
    const featureItems = document.querySelectorAll(`.${styles.featureItem}`);
    const stepItems = document.querySelectorAll(`.${styles.stepItem}`);

    featureItems.forEach((item, index) => {
      item.id = `feature-${index}`;
      observerRef.current?.observe(item);
    });

    stepItems.forEach((item, index) => {
      item.id = `step-${index}`;
      observerRef.current?.observe(item);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleCreateClick = () => {
    router.push('/create');
  };

  return (
    <div className={styles.homeContainer}>
      <main>
        <section id="hero" className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>Launch Your Solana Token in Minutes</h1>
            <p className={styles.subtitle}>
              No coding required. Create secure, immutable tokens with optional free authority revocation. 
              Join the future of tokenization on Solana.
            </p>
            <button 
              onClick={handleCreateClick}
              className={`${styles.btn} ${styles.btnPrimary} ${styles.pulse}`}
              aria-label="Create a new Solana token"
            >
              Create Token
            </button>
          </div>
        </section>

        {/* Mobile Wallet Warning */}
        {isMobile && (
          <section className={styles.mobileWarningSection}>
            <div className={styles.container}>
              <div className={styles.mobileWarning}>
                <div className={styles.warningIcon}>⚠️</div>
                <div className={styles.warningContent}>
                  <h3 className={styles.warningTitle}>Mobile Device Detected</h3>
                  <p className={styles.warningText}>
                    Currently, you&apos;ll need to use your wallet&apos;s built-in browser to connect to this dApp. 
                    We&apos;re working on implementing mobile wallet adapter support for a better mobile experience.
                  </p>
                  <p className={styles.warningSubtext}>
                    For the best experience, please use your wallet&apos;s browser or switch to a desktop device.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="features" className={styles.features}>
          <div className={styles.container}>
            <h2>Why Choose SoulMinter?</h2>
            <div className={styles.featuresGrid}>
              <div 
                className={`${styles.featureItem} ${visibleItems.has('feature-0') ? styles.featureItemVisible : ''}`}
              >
                <h4><span className={styles.icon}>🔒</span> Secure & Immutable</h4>
                <p>Mint and freeze authorities can be revoked for free, ensuring maximum security and trust for your holders.</p>
              </div>
              <div 
                className={`${styles.featureItem} ${visibleItems.has('feature-1') ? styles.featureItemVisible : ''}`}
              >
                <h4><span className={styles.icon}>💻</span> No Code Needed</h4>
                <p>Forget complex programming. Our intuitive interface allows anyone to generate a Solana token with just a few clicks.</p>
              </div>
              <div 
                className={`${styles.featureItem} ${visibleItems.has('feature-2') ? styles.featureItemVisible : ''}`}
              >
                <h4><span className={styles.icon}>💰</span> Ultra-Low Fees</h4>
                <p>Launch your token for just 0.2 SOL, one of the most competitive rates available. Get started without breaking the bank.</p>
              </div>
              <div 
                className={`${styles.featureItem} ${visibleItems.has('feature-3') ? styles.featureItemVisible : ''}`}
              >
                <h4><span className={styles.icon}>🎯</span> Earn While You Share</h4>
                <p>Join our affiliate program and earn 50% commission (0.1 SOL) for every successful referral. Turn your network into passive income.</p>
              </div>
              <div 
                className={`${styles.featureItem} ${visibleItems.has('feature-4') ? styles.featureItemVisible : ''}`}
              >
                <h4><span className={styles.icon}>⚙️</span> Advanced Customization</h4>
                <p>Custom mint addresses, creator metadata, social links, and vanity patterns. Make your token truly unique with professional branding.</p>
              </div>
              <div 
                className={`${styles.featureItem} ${visibleItems.has('feature-5') ? styles.featureItemVisible : ''}`}
              >
                <h4><span className={styles.icon}>🌐</span> Arweave Metadata Storage</h4>
                <p>Your token metadata is securely stored on Arweave with automatic image upload. Permanent, decentralized storage ensures your token information never gets lost.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className={styles.howItWorks}>
          <div className={styles.container}>
            <h2>Simple Steps to Your Token</h2>
            <ol className={styles.stepsList}>
              <li className={`${styles.stepItem} ${visibleItems.has('step-0') ? styles.stepItemVisible : ''}`}>
                Connect your Solana Wallet (Phantom, Solflare, etc.).
              </li>
              <li className={`${styles.stepItem} ${visibleItems.has('step-1') ? styles.stepItemVisible : ''}`}>
                Fill in your token details (Name, Symbol, Decimals, Supply).
              </li>
              <li className={`${styles.stepItem} ${visibleItems.has('step-2') ? styles.stepItemVisible : ''}`}>
                Confirm the transaction (0.2 SOL fee + network fees).
              </li>
              <li className={`${styles.stepItem} ${visibleItems.has('step-3') ? styles.stepItemVisible : ''}`}>
                Receive your token instantly! Optionally revoke authorities for free.
              </li>
            </ol>
          </div>
        </section>

        <section id="affiliate" className={styles.affiliate}>
          <div className={styles.container}>
            <h2>Join Our Affiliate Program</h2>
            <p>
              Share SoulMinter and earn! Get 50% commission (0.1 SOL) for every token created
              through your unique referral link. Help others launch their projects and get rewarded.
            </p>
            <button 
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => router.push('/affiliate')}
              aria-label="Go to affiliate dashboard"
            >
              Affiliate Dashboard
            </button>
          </div>
        </section>

        <section id="cta" className={styles.cta}>
          <div className={styles.container}>
            <h2 className={styles.title}>Ready to Create Your Solana Token?</h2>
            <p>Connect your wallet and launch your project on the Solana blockchain today!</p>
            <button 
              onClick={handleCreateClick}
              className={`${styles.btn} ${styles.btnPrimary} ${styles.pulse}`}
              aria-label="Create a new Solana token"
            >
              Create Token
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeView;
