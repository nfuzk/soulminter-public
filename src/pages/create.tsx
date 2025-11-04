import type { NextPage } from "next";
import Head from "next/head";
import { CreateView } from "../views";

const siteUrl = "https://soulminter.io/create";
const siteTitle = "Create a Solana Token – SoulMinter";
const siteDescription = "Create your own Solana token instantly with SoulMinter. No coding required. Secure, fast, and easy token creation for everyone.";
const siteImage = "https://pink-abstract-gayal-682.mypinata.cloud/ipfs/bafybeieue5otjvplqi2exrkdaxwdmjwsa2c7obiheim4wilcj6tleq63n4";

const Create: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content="Solana token creator, SPL token, create Solana token, no-code token creation, crypto token maker, SoulMinter, Solana token launch, token generator, blockchain token, DeFi token, custom token, token minting" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en" />
        <meta name="author" content="SoulMinter" />
        <meta name="revisit-after" content="7 days" />
        <meta name="theme-color" content="#000000" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={siteImage} />
        <meta property="og:site_name" content="SoulMinter" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={siteImage} />
        <meta name="twitter:creator" content="@soulminter" />
        <meta name="twitter:site" content="@soulminter" />
        
        <link rel="canonical" href={siteUrl} />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "SoulMinter Token Creator",
              "url": siteUrl,
              "description": siteDescription,
              "image": siteImage,
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0.2",
                "priceCurrency": "SOL",
                "description": "Create Solana tokens for 0.2 SOL"
              },
              "creator": {
                "@type": "Organization",
                "name": "SoulMinter",
                "url": "https://soulminter.io"
              },
              "potentialAction": {
                "@type": "CreateAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://soulminter.io/create"
                },
                "name": "Create Solana Token"
              }
            })
          }}
        />
      </Head>
      <CreateView />
    </div>
  );
};

export default Create;
