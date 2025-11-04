import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import fs from "fs";
import path from "path";
import { marked } from "marked";
import styles from "./styles.module.css";

const siteUrl = "https://soulminter.io/tos";
const siteTitle = "Terms of Service – SoulMinter";
const siteDescription = "Terms of Service for SoulMinter - Learn about the terms and conditions for using SoulMinter to create Solana tokens.";

interface TermsProps {
  html: string;
  lastUpdated: string;
}

const Terms: NextPage<TermsProps> = ({ html, lastUpdated }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content="SoulMinter terms of service, user agreement, token creator terms, Solana terms, crypto terms, blockchain terms, legal terms" />
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
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <link rel="canonical" href={siteUrl} />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>SoulMinter Terms of Service</h1>
        <div className={styles.lastUpdated}>Last Updated: {lastUpdated}</div>
        <article
          className={`${styles.content} prose prose-invert max-w-none`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps<TermsProps> = async () => {
  try {
    const termsPath = path.join(process.cwd(), "public", "terms.md");
    const markdown = fs.readFileSync(termsPath, "utf8");

    // Extract last-updated line (assumes '**Last Updated: DATE**' exists)
    const match = markdown.match(/\*\*Last Updated: ([^\*]+)\*\*/);
    const lastUpdated = match ? match[1].trim() : "October 20, 2025";

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
    console.error('Error loading terms of service:', error);
    return {
      props: {
        html: '<p>Error loading terms of service content.</p>',
        lastUpdated: 'Unknown',
      },
    };
  }
};

export default Terms;
