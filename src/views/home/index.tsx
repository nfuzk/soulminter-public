import { FC, useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import { AffiliateLink } from "../../components/AffiliateLink";
import Footer from "../../components/Footer";

export const HomeView: FC = ({}) => {
  const { publicKey, connect, disconnect } = useWallet();
  const router = useRouter();
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

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
            <h2 className={styles.title}>Launch Your Solana Token in Minutes</h2>
            <p className={styles.subtitle}>
              No coding required. Create secure, immutable tokens with optional free authority revocation. 
              Join the future of tokenization on Solana.
            </p>
            <button 
              onClick={handleCreateClick}
              className={`${styles.btn} ${styles.btnPrimary} ${styles.pulse}`}
            >
              Create Token
            </button>
          </div>
        </section>

        <section id="features" className={styles.features}>
          <div className={styles.container}>
            <h3>Why Choose SoulMinter?</h3>
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
            </div>
          </div>
        </section>

        <section id="how-it-works" className={styles.howItWorks}>
          <div className={styles.container}>
            <h3>Simple Steps to Your Token</h3>
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
            <h3>Join Our Affiliate Program</h3>
            <p>
              Share SoulMinter and earn! Get 50% commission (0.1 SOL) for every token created
              through your unique referral link. Help others launch their projects and get rewarded.
            </p>
            <button 
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => router.push('/affiliate')}
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
            >
              Create Token
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomeView;
