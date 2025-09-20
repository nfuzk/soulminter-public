import type { NextPage } from "next";
import Head from "next/head";
import styles from "./styles.module.css";

import fs from 'fs';
import path from 'path';

const siteUrl = "https://soulminter.io/tos";
const siteTitle = "Terms of Service – SoulMinter";
const siteDescription = "Terms of Service for SoulMinter - Create your own Solana token instantly with SoulMinter. No coding required.";

interface TermsProps { markdown: string }

const Terms: NextPage<TermsProps> = ({ markdown }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content="SoulMinter terms of service, user agreement, token creator terms, Solana terms, crypto terms, blockchain terms, legal terms" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="SoulMinter" />
        <meta name="revisit-after" content="30 days" />
        <meta name="theme-color" content="#000000" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content="https://pink-abstract-gayal-682.mypinata.cloud/ipfs/bafybeieue5otjvplqi2exrkdaxwdmjwsa2c7obiheim4wilcj6tleq63n4" />
        <meta property="og:site_name" content="SoulMinter" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:creator" content="@soulminter" />
        <meta name="twitter:site" content="@soulminter" />
        
        <link rel="canonical" href={siteUrl} />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": siteTitle,
              "url": siteUrl,
              "description": siteDescription,
              "isPartOf": {
                "@type": "WebSite",
                "name": "SoulMinter",
                "url": "https://soulminter.io"
              },
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://soulminter.io"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Terms of Service",
                    "item": "https://soulminter.io/tos"
                  }
                ]
              }
            })
          }}
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Terms of Service</h1>
        <div className={styles.content} style={{ whiteSpace: 'pre-wrap' }}>
          {markdown}
        </div>
      </main>
    </div>
  );
};

export const getStaticProps = async () => {
  const filePath = path.join(process.cwd(), 'public', 'terms.md');
  const markdown = fs.readFileSync(filePath, 'utf8');
  return { props: { markdown } };
};

export default Terms;
