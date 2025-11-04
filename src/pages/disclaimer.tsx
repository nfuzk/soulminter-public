import type { NextPage } from "next";
import Head from "next/head";
import styles from "./styles.module.css";

const siteUrl = "https://soulminter.io/disclaimer";
const siteTitle = "Disclaimer – SoulMinter";
const siteDescription = "Disclaimer for SoulMinter - Please read this important information about risks, responsibilities, and legal compliance.";

const Disclaimer: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content="SoulMinter disclaimer, legal disclaimer, crypto disclaimer, token creator disclaimer, Solana disclaimer, blockchain disclaimer, risk warning" />
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
                    "name": "Disclaimer",
                    "item": "https://soulminter.io/disclaimer"
                  }
                ]
              }
            })
          }}
        />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>SoulMinter Disclaimer</h1>
        <div className={styles.content}>
          <div className={styles.lastUpdated}>Last Updated: July 15, 2025</div>
          <section>
            <h2>1. General Information</h2>
            <p>The information provided on the SoulMinter.io website (the &quot;Platform&quot;) is for general informational purposes only. All information on the Platform is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Platform. UNDER NO CIRCUMSTANCES SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE PLATFORM OR RELIANCE ON ANY INFORMATION PROVIDED ON THE PLATFORM. YOUR USE OF THE PLATFORM AND YOUR RELIANCE ON ANY INFORMATION ON THE PLATFORM IS SOLELY AT YOUR OWN RISK.</p>
          </section>
          <section>
            <h2>2. Not Financial, Investment, or Legal Advice</h2>
            <p>SoulMinter is a technical tool that facilitates the creation of custom tokens on the Solana blockchain. We are not a financial institution, investment advisor, broker, legal counsel, or tax advisor. The content on this Platform, including any descriptions of token functionalities, regulatory summaries, or general market information, is for informational purposes only and does not constitute financial, investment, legal, or tax advice. You should not construe any such information or other material as legal, tax, investment, financial, or other advice. Nothing contained on our Platform constitutes a solicitation, recommendation, endorsement, or offer by SoulMinter or any third-party service provider to buy or sell any crypto-asset or other financial instrument.</p>
            <p>Before making any financial decisions, you should seek independent professional advice from a licensed and qualified financial advisor, legal counsel, or tax professional.</p>
          </section>
          <section>
            <h2>3. Risks Associated with Crypto-Assets</h2>
            <p>THE USE OF CRYPTO-ASSETS AND INTERACTION WITH BLOCKCHAIN TECHNOLOGIES INVOLVES SIGNIFICANT RISKS. YOU ACKNOWLEDGE AND AGREE THAT YOU ARE SOLELY RESPONSIBLE FOR ASSESSING AND BEARING THE RISKS ASSOCIATED WITH THE USE OF THE PLATFORM AND THE CREATION, HOLDING, AND TRADING OF CRYPTO-ASSETS. THESE RISKS INCLUDE, BUT ARE NOT LIMITED TO:</p>
            <ul>
              <li><b>Market Volatility:</b> The prices of crypto-assets are extremely volatile and can fluctuate significantly and rapidly. You may lose all or a substantial portion of your investment.</li>
              <li><b>Regulatory Risk:</b> The regulatory landscape for crypto-assets is uncertain, evolving, and varies significantly across jurisdictions. New regulations or changes to existing ones may negatively impact the legality, usability, or value of crypto-assets and services. You are solely responsible for understanding and complying with all applicable laws and regulations in your jurisdiction.</li>
              <li><b>Technological Risks:</b> Risks associated with the underlying blockchain technology (e.g., Solana), smart contracts, software bugs, network congestion, security vulnerabilities, and potential exploits. These risks could lead to loss of funds or disruption of services.</li>
              <li><b>Security Risks:</b> Risks of cyberattacks, hacking, phishing, malware, or other security breaches that could compromise your wallet, private keys, or other digital assets. SoulMinter does not store your private keys or have access to your wallet.</li>
              <li><b>Liquidity Risk:</b> Some crypto-assets may have limited liquidity, making it difficult to buy or sell them at a desired price or at all.</li>
              <li><b>Loss of Access:</b> Loss of private keys or seed phrases will result in permanent loss of access to your crypto-assets.</li>
              <li><b>Counterparty Risk:</b> Risks associated with third-party service providers (e.g., wallet providers, Arweave services) that are beyond SoulMinter&apos;s control.</li>
            </ul>
          </section>
          <section>
            <h2>4. Non-Custodial Nature</h2>
            <p>SoulMinter is a non-custodial platform. This means:</p>
            <ul>
              <li>We do not hold, store, or have access to your private keys, seed phrases, or any crypto-assets.</li>
              <li>You retain full and exclusive control over your wallet and all assets within it at all times.</li>
              <li>All transactions initiated through the Platform are executed directly from your connected wallet.</li>
              <li>We are not responsible for any loss of funds due to compromised private keys, wallet errors, or user negligence.</li>
            </ul>
          </section>
          <section>
            <h2>5. User Responsibility for Compliance</h2>
            <p>By using SoulMinter to create tokens, you acknowledge and agree that you are solely responsible for ensuring that:</p>
            <ul>
              <li>The tokens you create comply with all applicable laws and regulations in all relevant jurisdictions, including but not limited to securities laws, consumer protection laws, and crypto-asset regulations.</li>
              <li>Any subsequent activities related to your created tokens, including public offerings, sales, marketing, or distribution, are conducted in full compliance with all legal requirements.</li>
              <li>You have obtained all necessary legal and regulatory advice regarding your token creation and related activities.</li>
            </ul>
            <p>SoulMinter does not endorse, validate, or approve the legality or regulatory compliance of any token created on its Platform. Our service is limited to providing the technical means for token generation.</p>
          </section>
          <section>
            <h2>6. External Links Disclaimer</h2>
            <p>The Platform may contain links to external websites that are not provided or maintained by or in any way affiliated with SoulMinter. Please note that SoulMinter does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
          </section>
          <section>
            <h2>7. Limitation of Liability</h2>
            <p>As further detailed in our Terms of Service, SoulMinter, its affiliates, directors, employees, agents, suppliers, or licensors shall not be liable for any direct, indirect, punitive, incidental, special, consequential, or exemplary damages, including without limitation damages for loss of profits, goodwill, use, data, or other intangible losses, arising out of or relating to your use of, or inability to use, the Platform or any crypto-assets created thereon.</p>
          </section>
          <section>
            <h2>8. Changes to This Disclaimer</h2>
            <p>We may update this Disclaimer from time to time. We will notify you of any changes by posting the new Disclaimer on this page and updating the &quot;Last Updated&quot; date. You are advised to review this Disclaimer periodically for any changes. Changes to this Disclaimer are effective when they are posted on this page.</p>
          </section>
          <section>
            <h2>9. Contact Us</h2>
            <p>If you have any questions about this Disclaimer, please contact us:<br />By email: <a href="mailto:main@soulminter.io">main@soulminter.io</a></p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Disclaimer; 