import { FC, useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import { AffiliateLink } from "../../components/AffiliateLink";

export const HomeView: FC = ({}) => {
  const { publicKey, connect, disconnect } = useWallet();
  const router = useRouter();
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const handleConnectWallet = () => {
    if (publicKey) {
      disconnect();
    } else {
      connect();
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
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
  }, [isMounted]);

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
              Join the future of tokenization on Solana. Our platform makes it easy for anyone to create 
              professional-grade Solana tokens without technical expertise.
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


        <section id="features" className={styles.features}>
          <div className={styles.container}>
            <h2>Why Choose SoulMinter?</h2>
            <div className={styles.featuresGrid}>
              <div 
                className={`${styles.featureItem} ${isMounted && visibleItems.has('feature-0') ? styles.featureItemVisible : ''}`}
              >
                <h3><span className={styles.icon}>🔒</span> Secure & Immutable</h3>
                <p>Mint and freeze authorities can be revoked for free, ensuring maximum security and trust for your holders.</p>
              </div>
              <div 
                className={`${styles.featureItem} ${isMounted && visibleItems.has('feature-1') ? styles.featureItemVisible : ''}`}
              >
                <h3><span className={styles.icon}>💻</span> No Code Needed</h3>
                <p>Forget complex programming. Our intuitive interface allows anyone to generate a Solana token with just a few clicks.</p>
              </div>
              <div 
                className={`${styles.featureItem} ${isMounted && visibleItems.has('feature-2') ? styles.featureItemVisible : ''}`}
              >
                <h3><span className={styles.icon}>💰</span> Ultra-Low Fees</h3>
                <p>Launch your token for just 0.2 SOL, one of the most competitive rates available. Get started without breaking the bank.</p>
              </div>
              <div 
                className={`${styles.featureItem} ${isMounted && visibleItems.has('feature-3') ? styles.featureItemVisible : ''}`}
              >
                <h3><span className={styles.icon}>🎯</span> Earn While You Share</h3>
                <p>Join our affiliate program and earn 50% commission (0.1 SOL) for every successful referral. Turn your network into passive income with lifetime earnings. <Link href="/affiliate" className="text-purple-400 hover:text-purple-300 underline">Join our affiliate program</Link>.</p>
              </div>
              <div 
                className={`${styles.featureItem} ${isMounted && visibleItems.has('feature-4') ? styles.featureItemVisible : ''}`}
              >
                <h3><span className={styles.icon}>⚙️</span> Advanced Customization</h3>
                <p>Custom mint addresses and social links. Make your token truly unique with professional branding. <Link href="/create" className="text-purple-400 hover:text-purple-300 underline">Try our token creation tool</Link>.</p>
              </div>
              <div 
                className={`${styles.featureItem} ${isMounted && visibleItems.has('feature-5') ? styles.featureItemVisible : ''}`}
              >
                <h3><span className={styles.icon}>🌐</span> Arweave Metadata Storage</h3>
                <p>Your token metadata is securely stored on Arweave with automatic image upload. Permanent, decentralized storage ensures your token information never gets lost.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className={styles.howItWorks}>
          <div className={styles.container}>
            <h2>Simple Steps to Your Token</h2>
            <p style={{textAlign: 'center', marginBottom: '2rem', color: 'var(--gray-text)', maxWidth: '600px', margin: '0 auto 2rem'}}>
              Creating a Solana token has never been easier. Follow these four simple steps to launch your project on the blockchain in minutes.
            </p>
            <ol className={styles.stepsList}>
              <li className={`${styles.stepItem} ${isMounted && visibleItems.has('step-0') ? styles.stepItemVisible : ''}`}>
                Connect your Solana Wallet (Phantom, Solflare, etc.) to get started with the token creation process.
              </li>
              <li className={`${styles.stepItem} ${isMounted && visibleItems.has('step-1') ? styles.stepItemVisible : ''}`}>
                Fill in your token details including Name, Symbol, Decimals, and Supply to customize your token.
              </li>
              <li className={`${styles.stepItem} ${isMounted && visibleItems.has('step-2') ? styles.stepItemVisible : ''}`}>
                Confirm the transaction with our low 0.2 SOL fee plus minimal network fees for deployment.
              </li>
              <li className={`${styles.stepItem} ${isMounted && visibleItems.has('step-3') ? styles.stepItemVisible : ''}`}>
                Receive your token instantly! Optionally revoke authorities for free to ensure maximum security.
              </li>
            </ol>
          </div>
        </section>

        <section id="affiliate" className={styles.affiliate}>
          <div className={styles.container}>
            <h2>Join Our Affiliate Program</h2>
            <p>
              Share SoulMinter and earn! Get 50% commission (0.1 SOL) for every token created
              through your unique referral link. Help others launch their projects and get rewarded for life with sustainable passive income. <Link href="/affiliate-terms" className="text-purple-400 hover:text-purple-300 underline">Read our affiliate terms</Link>.
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

        <section id="faq" className={styles.faq}>
          <div className={styles.container}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqGrid}>
              <div className={styles.faqItem}>
                <h3>What is SoulMinter and how does it work?</h3>
                <p>SoulMinter is a revolutionary no-code platform that allows anyone to create Solana tokens instantly without any programming knowledge. Our platform simplifies the complex process of token creation by providing an intuitive interface where you can configure your token&apos;s name, symbol, supply, and metadata with just a few clicks. The entire process takes minutes, and your token is deployed directly on the Solana blockchain with full immutability and security.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3>How much does it cost to create a Solana token?</h3>
                <p>Creating a Solana token with SoulMinter costs only 0.2 SOL (approximately $20-40 depending on SOL price), making it one of the most affordable token creation services available. This fee covers the platform usage and includes optional free authority revocation for maximum security. Additional network fees may apply for blockchain transactions, but these are minimal on the Solana network.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3>What are the security features of tokens created with SoulMinter?</h3>
                <p>Security is our top priority. All tokens created through SoulMinter can have their mint and freeze authorities revoked for free, ensuring maximum security and trust for token holders. This means once authorities are revoked, no one can mint new tokens or freeze existing ones, making your token completely immutable and secure. Additionally, all metadata is stored on Arweave, a decentralized storage network, ensuring permanent and tamper-proof storage. <Link href="/disclaimer" className="text-purple-400 hover:text-purple-300 underline">Read our security disclaimer</Link>.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3>Do I need programming skills to use SoulMinter?</h3>
                <p>Absolutely not! SoulMinter is designed specifically for users without any programming experience. Our intuitive interface guides you through the entire process step-by-step. You simply need to connect your Solana wallet, fill in your token details (name, symbol, supply, description), and confirm the transaction. No coding, no complex configurations, no technical knowledge required.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3>What wallets are supported for token creation?</h3>
                <p>SoulMinter supports all major Solana wallets including Phantom, Solflare, Sollet, and other Wallet Adapter compatible wallets. You can connect using any of these popular wallets to create your token. For the best experience, we recommend using Phantom or Solflare as they offer the most seamless integration with our platform.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3>How does the affiliate program work?</h3>
                <p>Our affiliate program allows you to earn 50% commission (0.1 SOL) for every successful referral. When someone creates a token using your unique referral link, you earn commissions for life. This creates a sustainable passive income stream as you help others launch their projects. The more you share, the more you earn, and your earnings never expire. <Link href="/affiliate-faq" className="text-purple-400 hover:text-purple-300 underline">Learn more about our affiliate program</Link>.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3>Can I customize my token&apos;s metadata and branding?</h3>
                <p>Yes! SoulMinter offers extensive customization options including custom token names, symbols, descriptions, logos, and social media links. You can also set custom mint addresses and vanity patterns to make your token truly unique. All metadata is automatically uploaded to Arweave for permanent, decentralized storage, ensuring your token information is always accessible and tamper-proof.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3>What happens after I create my token?</h3>
                <p>Once your token is created, you&apos;ll receive the token mint address and can immediately start using it. You can add it to your wallet, create liquidity pools, list it on decentralized exchanges, or use it for your project. The token will be fully functional on the Solana blockchain with all standard SPL token features. You can also track your token&apos;s performance and manage it through various Solana ecosystem tools.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3>Is there any ongoing maintenance or fees after creation?</h3>
                <p>No! Once your token is created, there are no ongoing fees, maintenance costs, or subscription charges. Your token exists independently on the Solana blockchain and requires no additional payments. The one-time 0.2 SOL fee covers everything, including optional authority revocation. Your token will continue to function indefinitely without any additional costs.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3>How do I get started with creating my first token?</h3>
                <p>Getting started is simple: First, ensure you have a Solana wallet with at least 0.2 SOL for the creation fee. Connect your wallet to SoulMinter, click &quot;Create Token,&quot; fill in your token details (name, symbol, supply, description), upload your logo if desired, and confirm the transaction. Within minutes, your token will be live on the Solana blockchain and ready to use! <Link href="/create" className="text-purple-400 hover:text-purple-300 underline">Start creating your token now</Link>.</p>
              </div>
            </div>
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
