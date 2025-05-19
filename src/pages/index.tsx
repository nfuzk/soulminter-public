import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const siteUrl = "https://soulminter.io";
const siteTitle = "SoulMinter – Create Solana Tokens Instantly | No-Code Token Creator";
const siteDescription = "Create Solana tokens instantly with SoulMinter. No coding required. Launch your SPL token in minutes with our secure, fast, and user-friendly platform. Join our affiliate program to earn SOL.";
const siteImage = "https://pink-abstract-gayal-682.mypinata.cloud/ipfs/bafybeieue5otjvplqi2exrkdaxwdmjwsa2c7obiheim4wilcj6tleq63n4";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content="Solana token creator, SPL token, create Solana token, no-code token creation, crypto token maker, SoulMinter, Solana token launch, token generator, affiliate program, earn SOL" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="SoulMinter" />
        <meta name="revisit-after" content="7 days" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={siteImage} />
        <meta property="og:site_name" content="SoulMinter" />
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
              "@type": "WebSite",
              "name": "SoulMinter",
              "url": siteUrl,
              "description": siteDescription,
              "image": siteImage,
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://soulminter.io/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
