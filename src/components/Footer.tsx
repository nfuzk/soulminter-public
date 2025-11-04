import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { useConnection } from '@solana/wallet-adapter-react';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import styles from './Footer.module.css';
import { getSolanaNetwork } from '../utils/getSolanaNetwork';

const Footer: FC = () => {
  const network = getSolanaNetwork();
  const networkName = network === 'devnet' ? 'Solana Devnet' : network === 'testnet' ? 'Solana Testnet' : 'Solana Mainnet';
  const { showSettings } = useCookieConsent();
  const [isBlogSubdomain, setIsBlogSubdomain] = useState(false);

  useEffect(() => {
    // Check if we're on the blog subdomain
    if (typeof window !== 'undefined') {
      setIsBlogSubdomain(window.location.hostname === 'blog.soulminter.io' || window.location.hostname === 'www.blog.soulminter.io');
    }
  }, []);

  // Helper function to get the correct URL - redirect to main site if on blog subdomain
  const getMainSiteUrl = (path: string = '') => {
    if (isBlogSubdomain) {
      return `https://soulminter.io${path}`;
    }
    return path;
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          <Link href={getMainSiteUrl('/tos')} className={styles.link}>
            Terms of Service
          </Link>
          <span className={styles.separator}>•</span>
          <a href={getMainSiteUrl('/privacy')} className={styles.link} target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <span className={styles.separator}>|</span>
          <a href={getMainSiteUrl('/disclaimer')} className={styles.link} target="_blank" rel="noopener noreferrer">Disclaimer</a>
          <span className={styles.separator}>•</span>
          <Link href={getMainSiteUrl('/affiliate-terms')} className={styles.link}>
            Affiliate Terms
          </Link>
          <span className={styles.separator}>•</span>
          <Link href={getMainSiteUrl('/affiliate-faq')} className={styles.link}>
            Affiliate FAQ
          </Link>
          <span className={styles.separator}>•</span>
          <a href="mailto:main@soulminter.io" className={styles.link}>
            main@soulminter.io
          </a>
          <span className={styles.separator}>•</span>
          <a href="https://x.com/soulminter_io" target="_blank" rel="noopener noreferrer" className={styles.link}>
            X (Twitter)
          </a>
          <span className={styles.separator}>•</span>
          <a href="https://discord.com/users/soulminter_95345" target="_blank" rel="noopener noreferrer" className={styles.link}>
            Discord
          </a>
          <span className={styles.separator}>•</span>
          <a href="https://github.com/nfuzk/soulminter-public" target="_blank" rel="noopener noreferrer" className={styles.link}>
            Public Frontend Code
          </a>
          <span className={styles.separator}>•</span>
          <button onClick={showSettings} className={`${styles.link} ${styles.cookieSettings}`}>
            🍪 Cookie Settings
          </button>
        </div>
        <div className={styles.network}>
          <span className={styles.networkLabel}>Network:</span>
          <span className={styles.networkValue}>{networkName}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 