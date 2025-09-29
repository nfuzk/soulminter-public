import type { NextPage } from "next";
import Head from "next/head";
import styles from "./styles.module.css";

const siteUrl = "https://soulminter.io/privacy";
const siteTitle = "Privacy Policy – SoulMinter";
const siteDescription = "Privacy Policy for SoulMinter - Learn how we protect your privacy and handle data when creating Solana tokens.";

const Privacy: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content="SoulMinter privacy policy, data protection, user privacy, token creator privacy, Solana privacy, crypto privacy policy, blockchain privacy" />
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
        <div className={styles.content}>
          <div className={styles.lastUpdated}>Last Updated: September 2025</div>
          <section>
            <h2>1. Our Commitment to Your Privacy and Data Minimization</h2>
            <p>At SoulMinter (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), your privacy is paramount. This Privacy Policy outlines our practices regarding the collection, use, and processing of information when you use our web-based platform (the &quot;Platform&quot;) to create custom tokens on the Solana blockchain. Our platform is built on the principle of data minimization, meaning we primarily interact with information essential for the technical operation of our service, which includes public blockchain data, technical identifiers, and certain usage data collected via analytics.</p>
            <p>We are committed to transparency and compliance with global data protection principles, including the General Data Protection Regulation (GDPR) (EU) 2016/679 and the California Consumer Privacy Act (CCPA). While our core service is designed to operate without collecting directly identifiable personal data, we acknowledge that certain technical information and analytics data may be considered personal data under these regulations. This policy explains how we handle such information and your rights concerning it.</p>
            <p>By using the Platform, you acknowledge and agree to the practices described in this Privacy Policy. If you do not agree with these practices, please do not use the Platform.</p>
          </section>
          <section>
            <h2>2. Who We Are (and What We Are Not)</h2>
            <p>SoulMinter provides a technical tool for interacting with the Solana blockchain. We are not a data controller in the traditional sense for personal data that directly identifies you, as our primary operations do not involve determining the purposes and means of processing such data. However, with the introduction of analytics and other technical data collection, we recognize our responsibilities under applicable data protection laws regarding this information.</p>
            <p>For any questions regarding our data practices or this policy, you can contact us at:<br />SoulMinter Email: <a href="mailto:main@soulminter.io">main@soulminter.io</a></p>
          </section>
          <section>
            <h2>3. Information We Interact With (Public, Technical, and Analytics Data)</h2>
            <p>SoulMinter is engineered to function with minimal collection of personal data. We interact with the following types of information, which are either publicly available on the blockchain, are technical details necessary for the service, or are collected for analytics purposes to improve our service. Where such information could be considered personal data under applicable laws, we process it with due regard for your privacy rights.</p>
            
            <h3>3.1. Public Wallet Addresses</h3>
            <p>When you connect your Solana-compatible wallet to the Platform, your public wallet address is transmitted. This is a public identifier on the blockchain, essential for enabling your interaction with the Solana network to create tokens and for the functionality of our affiliate program. We never collect, store, or have access to your private keys, seed phrases, or any other sensitive wallet information. Your wallet remains entirely under your control.</p>
            
            <h3>3.2. Token Creation Details</h3>
            <p>Information you provide to create a token, such as the token name, symbol, number of decimals, initial supply, and any optional metadata (e.g., description, website URL, social media links), is used to generate the token on the blockchain. This information is inherently public, as it forms part of the token&apos;s on-chain identity and metadata, and is generally not considered personal data.</p>
            
            <h3>3.3. Technical Connection Information</h3>
            <p>When you access the Platform, certain technical information is automatically transmitted:</p>
            <ul>
              <li><b>IP Addresses:</b> Your IP address is used solely for immediate security purposes, such as real-time rate limiting to prevent abuse and denial-of-service attacks, and for general service stability. We do not store IP addresses in a way that links them to individual users, nor do we use them to identify you, track your browsing habits, or for marketing purposes.</li>
              <li><b>Blockchain Transaction Data:</b> All details of transactions you initiate on the Solana blockchain through our Platform (e.g., token creation transactions, fee payments, affiliate commission transfers) are publicly available and permanently recorded on the Solana blockchain. SoulMinter does not control the Solana blockchain, and all data on the blockchain is public and immutable.</li>
              <li><b>Aggregated Usage Data:</b> We may gather anonymized and aggregated data about how the Platform is used (e.g., total number of tokens created, most frequently used features). This data cannot be linked back to any individual and is used purely for statistical analysis to improve our service.</li>
            </ul>
            
            <h3>3.4. Analytics Data (Vercel Analytics)</h3>
            <p>We use Vercel Analytics to collect information about how users interact with our Platform. This service helps us understand user behavior, identify areas for improvement, and optimize the user experience. Vercel Analytics is designed to be privacy-friendly and primarily collects anonymized data. However, certain technical identifiers or usage patterns collected by Vercel Analytics may, in some jurisdictions, be considered personal data. The data collected includes, but is not limited to, page views, unique visitors, and session duration. Vercel Analytics does not use traditional cookies for tracking; instead, it relies on privacy-preserving methods to gather insights.</p>
            
            <h3>3.5. Information from Third-Party Service Providers</h3>
            <p>We integrate with various third-party services that may interact with your device or browser. These services may set cookies or use other local storage mechanisms for their functionality. This includes:</p>
            <ul>
              <li><b>Google Fonts:</b> Used for font loading optimization. Google Fonts may set cookies or use other local storage mechanisms to improve performance and deliver fonts efficiently.</li>
              <li><b>arDrive (Arweave):</b> Used for storing token metadata. arDrive leverages the Arweave network for permanent, decentralized storage. arDrive may set cookies or use other local storage mechanisms related to file upload and storage services.</li>
              <li><b>Solana RPC Endpoints:</b> When interacting with the Solana blockchain, various Solana API endpoints may set cookies or use other local storage mechanisms necessary for communication and transaction processing.</li>
              <li><b>Wallet Providers (e.g., Phantom, Solflare):</b> When you connect your wallet, these providers may set cookies or use other local storage mechanisms to manage connection states and facilitate interactions with their services.</li>
            </ul>
          </section>
          <section>
            <h2>4. How We Use Information</h2>
            <p>Our use of information is strictly limited to the following technical, operational, and analytical purposes:</p>
            <ul>
              <li><b>To Facilitate Token Creation:</b> We use the public wallet address and token creation parameters you provide to enable the creation of tokens on the Solana blockchain as per your instructions.</li>
              <li><b>To Manage the Affiliate Program:</b> We use public wallet addresses, referral data, and referrer cookies to track referrals and facilitate the direct, on-chain distribution of affiliate commissions, as designed by the Solana program. Referrer cookies help ensure that if a user navigates the site and later connects their wallet, the affiliate relationship is correctly attributed. This process does not involve the processing of personal data by SoulMinter beyond public wallet addresses and a referrer identifier stored in the cookie.</li>
              <li><b>To Ensure Platform Security:</b> IP addresses are used for real-time rate limiting and abuse prevention. This is a technical security measure and does not involve personal data processing or storage for identification purposes.</li>
              <li><b>To Improve Service Functionality and User Experience:</b> Aggregated and anonymized usage data, including insights from Vercel Analytics, helps us understand general platform usage patterns, identify areas for improvement, and enhance functionality and user experience.</li>
              <li><b>To Provide Essential Service Functionality:</b> Certain information stored locally (e.g., <code>walletName</code>, <code>wallet-adapter-react-connection</code>, <code>autoConnect</code> in <code>localStorage</code>) is used to remember your preferences and maintain your session for essential platform functionality. These are not traditional cookies but serve similar functional purposes.</li>
            </ul>
          </section>
          <section>
            <h2>5. Data Storage and Security</h2>
            <ul>
              <li><b>No Directly Identifiable Personal Data Storage:</b> SoulMinter is designed to minimize the storage of directly identifiable personal data. We do not store personal data such as names, email addresses, or physical addresses.</li>
              <li><b>Blockchain Data:</b> Information recorded on the Solana blockchain (e.g., token creation details, transaction IDs) is immutable and publicly accessible. This data is not controlled by SoulMinter.</li>
              <li><b>Arweave for Metadata:</b> Token metadata (including descriptions and images) is stored on the Arweave network via arDrive. Arweave is a decentralized, permanent storage network, meaning data is distributed across multiple nodes and is publicly accessible via its content hash. This is not personal data.</li>
              <li><b>No Private Key Storage:</b> SoulMinter never collects, stores, or has access to your private keys or seed phrases. All blockchain interactions are performed directly by your connected wallet.</li>
              <li><b>Security Measures:</b> We implement appropriate technical and organizational measures to protect the information we interact with against unauthorized access, alteration, disclosure, or destruction. This includes secure coding practices, access controls, and regular security assessments.</li>
            </ul>
          </section>
          <section>
            <h2>6. Information Sharing and Disclosure</h2>
            <p>Because SoulMinter minimizes the collection and storage of directly identifiable personal data, we have no such data to sell, rent, or trade to third parties. Any information we interact with (public wallet addresses, token parameters, technical connection data, and analytics data) is handled as follows:</p>
            <ul>
              <li><b>Public Blockchain:</b> All token creation and transaction data is publicly recorded on the Solana blockchain, which is a transparent and immutable ledger.</li>
              <li><b>Service Providers:</b> We use third-party services (e.g., Vercel for hosting and analytics, arDrive for Arweave storage, cloud hosting providers for server infrastructure) that process technical data necessary for the Platform&apos;s operation. These providers are selected based on their commitment to security and data protection. While they may process technical information or usage data, they do not receive directly identifiable personal data from SoulMinter.</li>
              <li><b>Legal Compliance:</b> In rare circumstances, we may be compelled by law to disclose technical information (e.g., IP addresses for specific security investigations) if required by a valid legal process. However, as we do not link this information to personal identities, such disclosures would not involve directly identifiable personal data.</li>
            </ul>
          </section>
          <section>
            <h2>7. International Data Transfers</h2>
            <p>As SoulMinter operates globally and utilizes service providers that may be located in different jurisdictions (e.g., Vercel&apos;s infrastructure), technical information and analytics data may be transferred to, and processed in, countries outside of your residence, including the United States. We ensure that any such transfers comply with applicable data protection laws by relying on appropriate safeguards, such as standard contractual clauses approved by relevant authorities, or by ensuring that the service providers are certified under recognized data transfer frameworks.</p>
          </section>
          <section>
            <h2>8. Your Data Protection Rights</h2>
            <p>While SoulMinter primarily operates without collecting directly identifiable personal data, we acknowledge that certain technical information and analytics data may be considered personal data under regulations like GDPR and CCPA. Therefore, you may have the following rights concerning your data:</p>
            <ul>
              <li><b>Right to Information/Access:</b> You have the right to know what information we interact with and how it is used. This Privacy Policy serves to provide this information.</li>
              <li><b>Right to Object to Processing:</b> You have the right to object to the processing of your data for certain purposes, such as analytics. You can manage your cookie preferences and opt-out of non-essential data collection through our cookie consent mechanism.</li>
              <li><b>Right to Deletion/Erasure:</b> While we do not store directly identifiable personal data, if you believe we hold any information that should be deleted, please contact us.</li>
            </ul>
            <p>To exercise any of these rights, or if you have any questions about our data practices, please contact us at <a href="mailto:main@soulminter.io">main@soulminter.io</a>. We will investigate any such claims thoroughly and transparently.</p>
          </section>
          <section>
            <h2>9. Cookies and Other Local Storage Technologies</h2>
            <p>We use cookies and other local storage technologies (such as <code>localStorage</code>) to ensure the proper functioning of our Platform and to collect analytics data. This section explains the types of technologies we use and how you can manage your preferences.</p>
            
            <h3>9.1. What are Cookies and Local Storage?</h3>
            <ul>
              <li><b>Cookies:</b> Small text files stored on your device by your web browser. They are widely used to make websites work or to improve their efficiency, as well as to provide reporting information.</li>
              <li><b>Local Storage (e.g., <code>localStorage</code>):</b> A web storage feature that allows websites to store data directly in the browser. Unlike cookies, data in <code>localStorage</code> does not automatically expire and is not sent to the server with every HTTP request.</li>
            </ul>
            
            <h3>9.2. How We Use Them</h3>
            <p>We categorize the cookies and local storage items we use as follows:</p>
            <ul>
              <li><b>Essential/Functional:</b> These are strictly necessary for the operation of our Platform and to provide the services you request. They enable core functionalities like wallet connection state (<code>walletName</code>, <code>wallet-adapter-react-connection</code>, <code>autoConnect</code> in <code>localStorage</code>) and basic Next.js framework functions. These do not require your consent as they are essential for the service to function.</li>
              <li><b>Affiliate Tracking:</b> We use cookies to remember referrer addresses. This ensures that if a user navigates the site and later connects their wallet, the affiliate relationship is correctly attributed. This cookie is essential for the functionality of our affiliate program and does not store personal data directly, but rather a referrer identifier. Your consent is required for these technologies.</li>
              <li><b>Analytics:</b> We use Vercel Analytics, which may set cookies or use other privacy-preserving methods to collect anonymized data about your usage of the Platform. This helps us understand how our Platform is used and allows us to improve it. Your consent is required for these technologies.</li>
              <li><b>Third-Party:</b> Our Platform integrates with third-party services (e.g., Google Fonts, arDrive, Solana RPC endpoints, wallet providers) that may set their own cookies or use local storage mechanisms. These are used to provide their respective services and may collect data according to their own privacy policies. Your consent is required for these technologies.</li>
            </ul>
            
            <h3>9.3. Your Cookie Consent and Management</h3>
            <p>Upon your first visit to our Platform, you will be presented with a cookie consent banner. This banner will provide you with clear information about the types of cookies and local storage technologies we use and allow you to:</p>
            <ul>
              <li><b>Accept All:</b> Consent to the use of all cookies and local storage technologies.</li>
              <li><b>Manage Preferences:</b> Customize your preferences by enabling or disabling specific categories of non-essential cookies (e.g., analytics, third-party). You will always have the option to opt-out of non-essential cookies.</li>
            </ul>
            <p>You can change your cookie preferences at any time by accessing the cookie settings link, typically found in the footer of our website. Please note that disabling certain cookies may affect the functionality of the Platform.</p>
          </section>
          <section>
            <h2>10. Links to Other Sites</h2>
            <p>Our Platform may contain links to other sites not operated by us. We strongly advise you to review the Privacy Policy of every site you visit, as we have no control over and assume no responsibility for their content, privacy policies, or practices.</p>
          </section>
          <section>
            <h2>11. Children&apos;s Privacy</h2>
            <p>Our Service is not intended for anyone under the age of 13 (&quot;Children&quot;). We do not knowingly collect any personal data from anyone under 13, as our system is designed not to collect directly identifiable personal data from any user. If you are a parent or guardian and believe that any personal data related to your child has been inadvertently processed by our Platform (which should not occur), please contact us immediately.</p>
          </section>
          <section>
            <h2>12. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. You are advised to review this Privacy Policy periodically. Changes are effective when posted.</p>
          </section>
          <section>
            <h2>13. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
            <p>By email: <a href="mailto:main@soulminter.io">main@soulminter.io</a></p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
