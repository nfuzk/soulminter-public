import type { NextPage } from "next";
import Head from "next/head";
import styles from "./styles.module.css";

const siteUrl = "https://soulminter.io/tos";
const siteTitle = "Terms of Service – SoulMinter";
const siteDescription = "Terms of Service for SoulMinter - Learn about the terms and conditions for using SoulMinter to create Solana tokens.";

const Terms: NextPage = () => {
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
        <h1 className={styles.title}>SoulMinter Terms of Service</h1>
        <div className={styles.content}>
          <div className={styles.lastUpdated}>Last Updated: September 15, 2025</div>
          <section>
            <h2>1. Introduction and Acceptance of Terms</h2>
            <p>Welcome to SoulMinter.io (the &quot;Platform&quot;), a web-based service that facilitates the creation of custom tokens on the Solana blockchain. These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and SoulMinter (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), governing your access to and use of the Platform and its services. By accessing, browsing, or using any part of the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms, our Privacy Policy, and our Disclaimer, all of which are incorporated herein by reference. If you do not agree to these Terms, you must not access or use the Platform.</p>
            <p><b>IMPORTANT NOTICE:</b> These Terms contain provisions that govern how disputes between you and SoulMinter are resolved, including a mandatory arbitration provision and a waiver of class action rights. Please read these Terms carefully before using the Platform.</p>
          </section>
          <section>
            <h2>2. Nature of the Service</h2>
            <p>SoulMinter provides a non-custodial, technical tool that enables users to interact with the Solana blockchain to create custom SPL (Solana Program Library) tokens. Our service is limited to providing the software interface and infrastructure to facilitate on-chain token creation based on parameters you provide. We do not:</p>
            <ul>
              <li><b>Provide Financial, Investment, or Legal Advice:</b> SoulMinter is not a financial institution, investment advisor, broker, or legal counsel. Any information provided on the Platform, including descriptions of token functionalities or general market information, is for informational purposes only and does not constitute financial, investment, legal, or tax advice. You are solely responsible for conducting your own due diligence and consulting with qualified professionals before making any decisions related to crypto-assets or using our services.</li>
              <li><b>Operate as a Crypto-Asset Exchange or Trading Platform:</b> SoulMinter does not facilitate the exchange of crypto-assets for fiat currency or other crypto-assets, nor does it operate a secondary market for trading tokens created on our Platform. We do not provide order matching, price discovery, or any other services typically associated with crypto-asset exchanges.</li>
              <li><b>Act as a Custodian of Crypto-Assets:</b> SoulMinter does not take custody of your private keys, wallet, or any crypto-assets, including the tokens you create using our Platform. You retain full and exclusive control over your wallet and all associated assets at all times. We do not have access to your funds or the ability to transfer them.</li>
              <li><b>Guarantee Token Value or Performance:</b> We do not make any representations or warranties regarding the future value, liquidity, or performance of any tokens created using our Platform. The value of crypto-assets is highly volatile and can result in significant losses.</li>
              <li><b>Endorse or Validate User-Created Tokens:</b> The creation of a token on our Platform does not imply any endorsement, validation, or approval by SoulMinter of the token, its underlying project, or its compliance with any laws or regulations. You are solely responsible for the tokens you create and any activities associated with them.</li>
            </ul>
          </section>
          <section>
            <h2>3. User Eligibility and Representations</h2>
            <p>By using the Platform, you represent and warrant that:</p>
            <ul>
              <li>You are at least 18 years of age and have the legal capacity to enter into these Terms.</li>
              <li>You are not located in, or a citizen or resident of, any jurisdiction where the use of our services is prohibited by law or where SoulMinter is prohibited from offering its services.</li>
              <li>You will comply with all applicable laws, regulations, and governmental policies in your jurisdiction regarding the use of crypto-assets and our services, including but not limited to anti-money laundering (AML), counter-terrorism financing (CTF), securities laws, and consumer protection laws.</li>
              <li>You will use the Platform only for lawful purposes and in accordance with these Terms.</li>
              <li>All information you provide to us is true, accurate, complete, and current.</li>
            </ul>
          </section>
          <section>
            <h2>4. User Responsibilities and Prohibited Conduct</h2>
            <h3>4.1. General Responsibilities</h3>
            <p>As a User of SoulMinter, you are solely responsible for:</p>
            <ul>
              <li><b>Wallet Security:</b> Maintaining the security and confidentiality of your Solana-compatible wallet, including your private keys and seed phrases. SoulMinter is not responsible for any loss or theft of your crypto-assets resulting from your failure to secure your wallet.</li>
              <li><b>Accuracy of Information:</b> Ensuring the accuracy and completeness of all information you provide for token creation, including token name, symbol, decimals, supply, and metadata. You bear all risks associated with inaccurate or misleading information.</li>
              <li><b>Compliance of Created Tokens:</b> Ensuring that any tokens you create using the Platform, and any subsequent activities related to those tokens (e.g., public offerings, sales, distribution, marketing), comply with all applicable laws and regulations in all relevant jurisdictions. This includes, but is not limited to, securities laws, consumer protection laws, and crypto-asset regulations. <b>SoulMinter expressly disclaims any responsibility for the legal or regulatory compliance of tokens created by users on the Platform. You acknowledge and agree that SoulMinter has no obligation to monitor or verify the legality or compliance of any tokens created by you.</b></li>
              <li><b>Tax Obligations:</b> Determining and paying any taxes applicable to your activities on the Platform, including token creation fees, affiliate commissions, and any gains derived from crypto-assets.</li>
              <li><b>Due Diligence:</b> Conducting your own independent research and due diligence on the legal, regulatory, financial, and technical aspects of crypto-assets and the Solana blockchain before using our services.</li>
            </ul>
            
            <h3>4.2. Prohibited Conduct</h3>
            <p>You agree not to engage in, or attempt to engage in, any of the following prohibited activities:</p>
            <ul>
              <li><b>Illegal Activities:</b> Using the Platform for any illegal purpose, including but not limited to money laundering, terrorist financing, fraud, market manipulation, or any activity that violates applicable laws or regulations.</li>
              <li><b>Harmful Content:</b> Creating tokens or metadata that are unlawful, defamatory, obscene, pornographic, indecent, abusive, harassing, violent, hateful, inflammatory, or otherwise objectionable.</li>
              <li><b>Intellectual Property Infringement:</b> Creating tokens or metadata that infringe upon the intellectual property rights of others, including copyrights, trademarks, or patents.</li>
              <li><b>Misleading or Deceptive Practices:</b> Creating tokens with misleading names, symbols, or descriptions, or engaging in any deceptive practices intended to defraud or mislead other users or the public.</li>
              <li><b>System Abuse:</b> Interfering with or disrupting the integrity or performance of the Platform or its underlying infrastructure, including introducing viruses, worms, or other malicious code.</li>
              <li><b>Unauthorized Access:</b> Attempting to gain unauthorized access to any part of the Platform, other users&apos; accounts, or the Solana blockchain.</li>
              <li><b>Circumvention of Controls:</b> Attempting to circumvent any security or access control measures implemented by SoulMinter.</li>
              <li><b>Commercial Use without Authorization:</b> Using the Platform for any commercial purpose not expressly permitted by these Terms.</li>
              <li><b>Resale of Services:</b> Reselling or sublicensing any part of the Platform&apos;s services without our prior written consent.</li>
              <li><b>Data Scraping:</b> Using any automated system or software to extract data from the Platform for commercial purposes without our express written consent.</li>
            </ul>
            <p><b>SoulMinter reserves the right, but is not obligated, to monitor user activity and content on the Platform. However, given the technical and non-custodial nature of our service and our minimal data collection, we cannot actively prevent or be held liable for all instances of prohibited conduct or malicious use by users. You acknowledge that you use the Platform at your own risk and are solely responsible for your actions and the compliance of your created tokens. SoulMinter shall not be liable for any damages or losses arising from your engagement in prohibited conduct or malicious use of the Platform.</b> If we determine, in our sole discretion, that you have engaged in any prohibited conduct, we may, without notice, suspend or terminate your access to the Platform and take any other action deemed appropriate, including reporting to relevant authorities.</p>
          </section>
          <section>
            <h2>5. Fees and Payments</h2>
            <p>SoulMinter charges a fee for the token creation service, which is clearly displayed on the Platform at the time of creation. By proceeding with token creation, you agree to pay the specified fee. Please note:</p>
            <ul>
              <li><b>Non-Refundable:</b> All fees paid for token creation are non-refundable once the transaction is successfully processed on the Solana blockchain.</li>
              <li><b>Fee Changes:</b> We reserve the right to change our fees at any time. Any changes will be effective immediately upon posting on the Platform. It is your responsibility to review the current fees before initiating a token creation.</li>
              <li><b>Network Costs:</b> The fee covers our service costs and network transaction fees (gas fees) associated with the Solana blockchain. You acknowledge that blockchain transaction fees are dynamic and outside of our control.</li>
              <li><b>Affiliate Commission:</b> A portion of the token creation fee may be allocated as an affiliate commission to a referring user, as detailed in our Affiliate Program terms. This is a marketing incentive and not a financial service provided by SoulMinter.</li>
            </ul>
          </section>
          <section>
            <h2>6. Intellectual Property</h2>
            <h3>6.1. User-Generated Content</h3>
            <p>You retain all intellectual property rights in the content you create and upload to the Platform, including token names, symbols, descriptions, and images (collectively, &quot;User Content&quot;). By uploading User Content, you grant SoulMinter a worldwide, non-exclusive, royalty-free, transferable, and sublicensable license to use, reproduce, distribute, prepare derivative works of, display, and perform your User Content in connection with the operation and promotion of the Platform and our services. You represent and warrant that you have all necessary rights to grant this license and that your User Content does not infringe upon the rights of any third party.</p>
          </section>
          <section>
            <h2>7. Disclaimers and Limitation of Liability</h2>
            <h3>7.1. Disclaimers</h3>
            <p>THE PLATFORM AND ITS SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE. SOULMINTER DOES NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, SECURE, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. WE DO NOT WARRANT THAT THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE.</p>
            <p>YOU ACKNOWLEDGE AND AGREE THAT THE USE OF CRYPTO-ASSETS AND THE SOLANA BLOCKCHAIN INVOLVES SIGNIFICANT RISKS, INCLUDING BUT NOT LIMITED TO:</p>
            <ul>
              <li><b>Volatility:</b> The value of crypto-assets can be extremely volatile and may result in substantial losses.</li>
              <li><b>Regulatory Risk:</b> The regulatory landscape for crypto-assets is uncertain and subject to rapid change, which may impact the legality or viability of certain crypto-assets or services.</li>
              <li><b>Technological Risk:</b> Risks associated with the Solana blockchain, smart contracts, and other underlying technologies, including bugs, exploits, or network congestion.</li>
              <li><b>Security Risk:</b> Risks of cyberattacks, hacking, or other security breaches that may result in the loss of your crypto-assets.</li>
              <li><b>Liquidity Risk:</b> The market for certain crypto-assets may be illiquid, making it difficult to sell them at a desired price.</li>
            </ul>
            <p>YOU ARE SOLELY RESPONSIBLE FOR ASSESSING AND BEARING THE RISKS ASSOCIATED WITH THE USE OF THE PLATFORM AND THE CREATION OF CRYPTO-ASSETS.</p>
            
            <h3>7.2. Limitation of Liability</h3>
            <p>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SOULMINTER, ITS AFFILIATES, DIRECTORS, EMPLOYEES, AGENTS, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THE PLATFORM OR ANY CRYPTO-ASSETS CREATED THEREON. THIS LIMITATION OF LIABILITY APPLIES WHETHER THE ALLEGED LIABILITY IS BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR ANY OTHER BASIS, EVEN IF SOULMINTER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.</p>
            <p>IN NO EVENT SHALL SOULMINTER&apos;S AGGREGATE LIABILITY FOR ALL CLAIMS RELATING TO THE PLATFORM EXCEED THE GREATER OF (A) THE AMOUNT OF FEES PAID BY YOU TO SOULMINTER FOR THE TOKEN CREATION SERVICE IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS (USD $100.00).</p>
            <p>SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.</p>
          </section>
          <section>
            <h2>8. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless SoulMinter, its affiliates, directors, employees, agents, suppliers, and licensors from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising out of or relating to:</p>
            <ul>
              <li>Your access to or use of the Platform;</li>
              <li>Your User Content, including any claims that your User Content infringes or violates the intellectual property rights or other rights of any third party;</li>
              <li>Any tokens you create using the Platform, including any claims related to their legality, functionality, or any losses incurred by third parties due to your tokens;</li>
              <li>Your violation of these Terms or any applicable laws or regulations;</li>
              <li>Your negligence or willful misconduct.</li>
            </ul>
          </section>
          <section>
            <h2>9. Governing Law and Dispute Resolution</h2>
            <h3>9.1. Governing Law</h3>
            <p>These Terms shall be governed by and construed in accordance with the laws of a jurisdiction to be determined by SoulMinter, without regard to its conflict of law principles. This choice of law does not limit any consumer protection rights that you may be entitled to in your country of residence under the laws of that country.</p>
            
            <h3>9.2. Arbitration Agreement</h3>
            <p>Any dispute, controversy, or claim arising out of or relating to these Terms or the breach, termination, or validity thereof, shall be finally settled by arbitration in accordance with the rules of a recognized international arbitration institution (e.g., the International Chamber of Commerce (ICC) or the London Court of International Arbitration (LCIA)). The arbitration shall be conducted in a major international city, and the language of the arbitration shall be English. The number of arbitrators shall be one. The award rendered by the arbitrator shall be final and binding upon the parties and may be entered in any court having jurisdiction thereof.</p>
            
            <h3>9.3. Class Action Waiver</h3>
            <p>YOU AGREE THAT YOU MAY BRING CLAIMS AGAINST SOULMINTER ONLY IN YOUR INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. Unless both you and SoulMinter agree otherwise, the arbitrator may not consolidate more than one person&apos;s claims, and may not otherwise preside over any form of a representative or class proceeding.</p>
          </section>
          <section>
            <h2>10. Termination</h2>
            <p>We may terminate or suspend your access to the Platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the Platform will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
          </section>
          <section>
            <h2>11. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Platform after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you must stop using the Platform.</p>
          </section>
          <section>
            <h2>12. Miscellaneous</h2>
            <h3>12.1. Entire Agreement</h3>
            <p>These Terms, together with our Privacy Policy and Disclaimer, constitute the entire agreement between you and SoulMinter regarding your use of the Platform and supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, regarding the Platform.</p>
            
            <h3>12.2. Severability</h3>
            <p>If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. The invalid or unenforceable provision will be replaced by a valid and enforceable provision that most closely matches the intent of the original provision.</p>
            
            <h3>12.3. Assignment</h3>
            <p>You may not assign or transfer these Terms, by operation of law or otherwise, without our prior written consent. Any attempt by you to assign or transfer these Terms, without such consent, will be null and void. We may freely assign or transfer these Terms without restriction.</p>
            
            <h3>12.4. Waiver</h3>
            <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. The exercise by either party of any of its remedies under these Terms will be without prejudice to its other remedies under these Terms or otherwise.</p>
            
            <h3>12.5. Force Majeure</h3>
            <p>SoulMinter shall not be liable for any delay or failure to perform resulting from causes outside its reasonable control, including, without limitation, acts of God, wars, terrorism, riots, embargoes, acts of civil or military authorities, fires, floods, accidents, strikes, or shortages of transportation facilities, fuel, energy, labor, or materials.</p>
          </section>
          <section>
            <h2>13. Contact Information</h2>
            <p>For any questions about these Terms, please contact us at:</p>
            <p>Email: <a href="mailto:main@soulminter.io">main@soulminter.io</a></p>
            <p><b>SoulMinter</b><br /><b>online-only</b><br /><b>soulminter.io</b></p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Terms;
