import type { NextPage } from "next";
import Head from "next/head";
import { CreateView } from "../views";

const siteUrl = "https://yourdomain.com/create";
const siteTitle = "Create a Solana Token – SoulMinter";
const siteDescription = "Create your own Solana token instantly with SoulMinter. No coding required. Secure, fast, and easy token creation for everyone.";
const siteImage = "https://pink-abstract-gayal-682.mypinata.cloud/ipfs/bafybeieue5otjvplqi2exrkdaxwdmjwsa2c7obiheim4wilcj6tleq63n4";

const Create: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content="Solana, token creator, SPL, crypto, SoulMinter, create token, no code" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={siteImage} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={siteImage} />
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
              "image": siteImage
            })
          }}
        />
      </Head>
      <CreateView />
    </div>
  );
};

export default Create;
