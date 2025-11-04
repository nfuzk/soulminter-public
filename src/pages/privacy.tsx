import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import fs from "fs";
import path from "path";
import { marked } from "marked";
import styles from "./styles.module.css";

const siteUrl = "https://soulminter.io/privacy";
const siteTitle = "Privacy Policy – SoulMinter";
const siteDescription = "Privacy Policy for SoulMinter - Learn how we protect your privacy and handle data when creating Solana tokens.";

interface PrivacyProps {
  html: string;
  lastUpdated: string;
}

const Privacy: NextPage<PrivacyProps> = ({ html, lastUpdated }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content="SoulMinter privacy policy, data protection, user privacy, token creator privacy, Solana privacy, crypto privacy policy, blockchain privacy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en" />
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
                    "name": "Privacy Policy",
                    "item": "https://soulminter.io/privacy"
                  }
                ]
              }
            })
          }}
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>SoulMinter Privacy Policy</h1>
        <div className={styles.lastUpdated}>Last Updated: {lastUpdated}</div>
        <article
          className={`${styles.content} prose prose-invert max-w-none`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps<PrivacyProps> = async () => {
  try {
    const privacyPath = path.join(process.cwd(), "public", "privacy.md");
    const markdown = fs.readFileSync(privacyPath, "utf8");

    // Extract last-updated line (assumes '**Last Updated: DATE**' exists)
    const match = markdown.match(/\*\*Last Updated: ([^\*]+)\*\*/);
    const lastUpdated = match ? match[1].trim() : "September 2025";

    // Configure marked options for consistent rendering
    const html = await marked(markdown, {
      breaks: true,
      gfm: true,
    });

    return {
      props: {
        html,
        lastUpdated,
      },
    };
  } catch (error) {
    console.error('Error loading privacy policy:', error);
    return {
      props: {
        html: '<p>Error loading privacy policy content.</p>',
        lastUpdated: 'Unknown',
      },
    };
  }
};

export default Privacy;
