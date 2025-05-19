import { FC } from 'react';
import Link from 'next/link';
import { useConnection } from '@solana/wallet-adapter-react';
import styles from './Footer.module.css';
import { getSolanaNetwork } from '../utils/getSolanaNetwork';

const Footer: FC = () => {
  const network = getSolanaNetwork();
  const networkName = network === 'devnet' ? 'Solana Devnet' : network === 'testnet' ? 'Solana Testnet' : 'Solana Mainnet';

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          <Link href="/tos" className={styles.link}>
            Terms of Service
          </Link>
          <span className={styles.separator}>•</span>
          <Link href="/privacy" className={styles.link}>
            Privacy Policy
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