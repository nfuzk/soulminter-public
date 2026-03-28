import { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FEATURES } from "../../config";
import styles from "./styles.module.css";

// Chart: permanent path (fixed points, no random).
const CHART_PATH_POINTS: { x: number; y: number }[] = [
  { x: 0, y: 368 }, { x: 8, y: 365 }, { x: 16, y: 382 }, { x: 24, y: 370 },
  { x: 32, y: 355 }, { x: 40, y: 361 }, { x: 48, y: 342 }, { x: 57, y: 329 },
  { x: 65, y: 348 }, { x: 73, y: 355 }, { x: 81, y: 346 }, { x: 89, y: 347 },
  { x: 97, y: 325 }, { x: 105, y: 328 }, { x: 113, y: 306 }, { x: 121, y: 311 },
  { x: 129, y: 301 }, { x: 137, y: 324 }, { x: 145, y: 277 }, { x: 154, y: 276 },
  { x: 162, y: 309 }, { x: 170, y: 305 }, { x: 178, y: 293 }, { x: 186, y: 277 },
  { x: 194, y: 249 }, { x: 202, y: 263 }, { x: 210, y: 272 }, { x: 218, y: 250 },
  { x: 226, y: 274 }, { x: 234, y: 246 }, { x: 242, y: 269 }, { x: 251, y: 248 },
  { x: 259, y: 269 }, { x: 267, y: 270 }, { x: 275, y: 289 }, { x: 283, y: 264 },
  { x: 291, y: 258 }, { x: 299, y: 281 }, { x: 307, y: 291 }, { x: 315, y: 282 },
  { x: 323, y: 246 }, { x: 331, y: 266 }, { x: 339, y: 238 }, { x: 347, y: 254 },
  { x: 356, y: 257 }, { x: 364, y: 269 }, { x: 372, y: 257 }, { x: 380, y: 266 },
  { x: 388, y: 260 }, { x: 396, y: 277 }, { x: 404, y: 275 }, { x: 412, y: 276 },
  { x: 420, y: 220 }, { x: 428, y: 260 }, { x: 436, y: 206 }, { x: 444, y: 227 },
  { x: 453, y: 218 }, { x: 461, y: 221 }, { x: 469, y: 223 }, { x: 477, y: 219 },
  { x: 485, y: 192 }, { x: 493, y: 180 }, { x: 501, y: 178 }, { x: 509, y: 166 },
  { x: 517, y: 180 }, { x: 525, y: 130 }, { x: 533, y: 132 }, { x: 541, y: 136 },
  { x: 549, y: 142 }, { x: 558, y: 103 }, { x: 566, y: 93 }, { x: 574, y: 104 },
  { x: 582, y: 110 }, { x: 590, y: 82 }, { x: 598, y: 54 }, { x: 606, y: 51 },
  { x: 614, y: 94 }, { x: 622, y: 104 }, { x: 630, y: 91 }, { x: 638, y: 65 },
  { x: 646, y: 77 }, { x: 655, y: 75 }, { x: 663, y: 42 }, { x: 671, y: 46 },
  { x: 679, y: 38 }, { x: 687, y: 55 }, { x: 695, y: 75 }, { x: 703, y: 59 },
  { x: 711, y: 35 }, { x: 719, y: 88 }, { x: 727, y: 22 }, { x: 735, y: 60 },
  { x: 743, y: 38 }, { x: 752, y: 26 }, { x: 760, y: 17 }, { x: 768, y: 48 },
  { x: 776, y: 72 }, { x: 784, y: 33 }, { x: 792, y: 68 }, { x: 800, y: 58 },
];

const CHART_PATH_D = CHART_PATH_POINTS.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

const FEATURE_CARDS_DATA = [
  { icon: "🔒", title: "Secure & Immutable", body: "Mint and freeze authorities can be revoked for free, ensuring maximum security and trust for your holders.", link: null as { href: string; text: string } | null },
  { icon: "💻", title: "No Code Needed", body: "Forget complex programming. Our intuitive interface allows anyone to generate a Solana token with just a few clicks.", link: null },
  { icon: "💰", title: "Ultra-Low Fees", body: "Launch your token for just 0.2 SOL, one of the most competitive rates available. Get started without breaking the bank.", link: null },
  { icon: "🎯", title: "Earn While You Share", body: "Join our affiliate program and earn 50% commission (0.1 SOL) for every successful referral. Turn your network into passive income with lifetime earnings. ", link: { href: "/affiliate", text: "Join our affiliate program" } },
  { icon: "⚙️", title: "Advanced Customization", body: "Custom mint addresses and social links. Make your token truly unique with professional branding. ", link: { href: "/create", text: "Try our token creation tool" } },
  { icon: "🌐", title: "Decentralized Metadata Storage", body: "Your token metadata is routed to decentralized storage, using Lighthouse as the primary backend with automatic image upload and Pinata/Arweave as fallbacks.", link: null },
];

type FaqItem = {
  id: string;
  question: string;
  answer: JSX.Element;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-soulminter",
    question: "What is SoulMinter and how does it work?",
    answer: (
      <p>
        SoulMinter is a no-code platform that allows anyone to create Solana tokens instantly without any programming
        knowledge. We simplify the complex process of token creation by providing an intuitive interface where you can
        configure your token&apos;s name, symbol, supply, and metadata with just a few clicks. The entire process takes
        minutes, and your token can be deployed on the Solana blockchain with full immutability and security.
      </p>
    ),
  },
  {
    id: "how-much-does-it-cost",
    question: "How much does it cost to create a Solana token?",
    answer: (
      <p>
        Creating a Solana token with SoulMinter costs only 0.2 SOL (approximately $20-40 depending on SOL price),
        making it one of the most affordable token creation services available. This fee covers the platform usage and
        includes optional free authority revocation for maximum security. Additional network fees may apply for
        blockchain transactions, but these are minimal on the Solana network.
      </p>
    ),
  },
  {
    id: "security-features",
    question: "What are the security features of tokens created with SoulMinter?",
    answer: (
      <p>
        Security is our top priority. All tokens created through SoulMinter can have their mint, freeze and update
        authorities revoked for free, ensuring maximum security and trust for token holders. This means once authorities
        are revoked, no one can mint new tokens or freeze existing ones, making your token completely immutable and
        secure. Additionally, all metadata is stored using decentralized storage, with Lighthouse as the primary backend and Pinata/Arweave as fallbacks, ensuring permanent and
        tamper-proof storage. We never store your private keys, the platform is completely non-custodial. For more
        information{" "}
        <Link href="/disclaimer" className="text-purple-400 hover:text-purple-300 underline">
          read our security disclaimer
        </Link>
        .
      </p>
    ),
  },
  {
    id: "need-programming-skills",
    question: "Do I need programming skills to use SoulMinter?",
    answer: (
      <p>
        Absolutely not! SoulMinter is designed specifically for users without any programming experience. Our intuitive
        interface guides you through the entire process step-by-step. You simply need to connect your Solana wallet,
        fill in your token details (name, symbol, supply, description), and confirm the transaction. No coding, no
        complex configurations, no technical knowledge required.
      </p>
    ),
  },
  {
    id: "supported-wallets",
    question: "What wallets are supported for token creation?",
    answer: (
      <p>
        SoulMinter supports all major Solana wallets including Phantom, Solflare, Sollet, and other Wallet Adapter
        compatible wallets. You can connect using any of these popular wallets to create your token. For the best
        experience, we recommend using Phantom or Solflare as they have been thoroughly tested with the platform.
      </p>
    ),
  },
  {
    id: "affiliate-program",
    question: "How does the affiliate program work?",
    answer: (
      <p>
        Our affiliate program allows you to earn 50% commission (0.1 SOL) for every successful referral. When someone
        creates a token using your unique referral link, you earn commissions for life. This creates a sustainable
        passive income stream as you help others launch their projects. The more you share, the more you earn, and your
        earnings never expire.{" "}
        <Link href="/affiliate-faq" className="text-purple-400 hover:text-purple-300 underline">
          Learn more about our affiliate program
        </Link>
        .
      </p>
    ),
  },
  {
    id: "customize-metadata",
    question: "Can I customize my token's metadata and branding?",
    answer: (
      <p>
        Yes! SoulMinter offers extensive customization options including custom token names, symbols, descriptions,
        logos, and social media links. You can also set custom mint addresses and vanity patterns to make your token
        truly unique. All metadata is automatically uploaded to decentralized storage, using Lighthouse as the primary backend with Pinata/Arweave fallbacks, ensuring
        your token information is always accessible and tamper-proof.
      </p>
    ),
  },
  {
    id: "after-creation",
    question: "What happens after I create my token?",
    answer: (
      <p>
        Once your token is created, you&apos;ll receive the token mint address and can immediately start using it. You
        can add it to your wallet, create liquidity pools, list it on decentralized exchanges, or use it for your
        project. The token will be fully functional on the Solana blockchain with all standard SPL token features. You
        can also track your token&apos;s performance and manage it through various Solana ecosystem tools.
      </p>
    ),
  },
];

export const HomeView: FC = ({}) => {
  const router = useRouter();
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(2); // start on "Ultra-Low Fees"
  const [openFaqIds, setOpenFaqIds] = useState<Set<string>>(() => new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const touchStartX = useRef<number>(0);

  const featureCardsToShow = FEATURES.ENABLE_AFFILIATE
    ? FEATURE_CARDS_DATA
    : FEATURE_CARDS_DATA.filter((c) => c.title !== "Earn While You Share");
  const featureCardsCount = featureCardsToShow.length;
  const safeCardIndex = Math.min(activeCardIndex, featureCardsCount - 1);

  const faqItemsToShow = FEATURES.ENABLE_AFFILIATE
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((item) => item.id !== "affiliate-program");

  /** CodePen-style carousel positions: data-pos in [-2,-1,0,1,2] based on active index. */
  const getCarouselPos = (index: number, activeIndex: number, total: number): number => {
    let diff = index - activeIndex;
    const half = Math.floor(total / 2);
    if (diff > half) {
      diff -= total;
    }
    if (diff < -half) {
      diff += total;
    }
    if (diff > 2) {
      return 2;
    }
    if (diff < -2) {
      return -2;
    }
    return diff;
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {return;}
    
    // Initialize Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all feature items and step items
    const featureItems = document.querySelectorAll(`.${styles.featureItem}`);
    const stepItems = document.querySelectorAll(`.${styles.stepCard}`);

    featureItems.forEach((item, index) => {
      item.id = `feature-${index}`;
      observerRef.current?.observe(item);
    });

    stepItems.forEach((item, index) => {
      item.id = `step-${index}`;
      observerRef.current?.observe(item);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isMounted]);

  const handleCreateClick = () => {
    router.push('/create');
  };

  const goPrev = () => setActiveCardIndex((i) => (i - 1 + featureCardsCount) % featureCardsCount);
  const goNext = () => setActiveCardIndex((i) => (i + 1) % featureCardsCount);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40) {
      goPrev();
    } else if (delta < -40) {
      goNext();
    }
  };

  return (
    <div className={styles.homeContainer}>
      <main>
        <section id="hero" className={styles.hero}>
          <div className={styles.heroBg} aria-hidden="true">
            <svg className={styles.heroLineSvg} viewBox="0 0 800 400" preserveAspectRatio="xMinYMid slice" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="heroLineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="var(--primary-color)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0.4" />
                </linearGradient>
                <filter id="heroGlow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Chart contour: extreme volatility – irregular runs, near-vertical moves, dense zigzag */}
              <path
                className={styles.heroLinePath}
                d={CHART_PATH_D}
                fill="none"
                stroke="url(#heroLineGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#heroGlow)"
              />
              <path
                className={styles.heroLinePath}
                d={CHART_PATH_D}
                fill="none"
                stroke="var(--primary-color)"
                strokeWidth="1"
                strokeOpacity="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className={styles.heroGradientOrb} />
          </div>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Launch your solana token<br/>in minutes</h1>
            <p className={styles.subtitle}>
              Create secure, immutable tokens with optional free authority revocation and custom mint address. Our
              platform makes it easy for anyone to create SPL tokens without writing a single line of code. Create your
              own for just 0.2 SOL, everything included, no drip-pricing.
            </p>
            <button 
              onClick={handleCreateClick}
              className={`${styles.btn} ${styles.btnPrimary} ${styles.pulse}`}
              aria-label="Create a new Solana token"
            >
              Create Token
            </button>
          </div>
        </section>


        <section id="features" className={styles.features}>
          <div className={styles.container}>
            <h2>Why Choose SoulMinter?</h2>
            <div
              className={styles.featuresCarousel}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              role="region"
              aria-roledescription="carousel"
              aria-label="Feature cards"
            >
              <button
                type="button"
                className={styles.carouselArrow}
                onClick={goPrev}
                aria-label="Previous card"
              >
                <span aria-hidden>‹</span>
              </button>
              <button
                type="button"
                className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
                onClick={goNext}
                aria-label="Next card"
              >
                <span aria-hidden>›</span>
              </button>
              <div className={styles.carousel}>
                <ul className={styles.carouselList} role="list">
                  {featureCardsToShow.map((card, index) => {
                    const pos = getCarouselPos(index, safeCardIndex, featureCardsCount);
                    const isActive = pos === 0;
                    return (
                      <li
                        key={card.title}
                        className={styles.carouselItem}
                        data-pos={pos}
                        onClick={() => {
                          if (!isActive) {
                            setActiveCardIndex(index);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (!isActive && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            setActiveCardIndex(index);
                          }
                        }}
                        role="button"
                        tabIndex={isActive ? 0 : -1}
                        aria-label={isActive ? `Card ${index + 1} of ${featureCardsCount}` : `Go to feature card ${index + 1}`}
                      >
                        <div className={styles.carouselItemContent}>
                          <h3><span className={styles.icon}>{card.icon}</span> {card.title}</h3>
                          <p>
                            {card.body}
                            {card.link && <Link href={card.link.href} className="text-purple-400 hover:text-purple-300 underline" onClick={(e) => e.stopPropagation()}>{card.link.text}</Link>}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className={styles.carouselDots} role="tablist" aria-label="Card navigation">
                {Array.from({ length: featureCardsCount }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === safeCardIndex}
                    aria-label={`Go to card ${i + 1}`}
                    className={`${styles.carouselDot} ${i === safeCardIndex ? styles.carouselDotActive : ''}`}
                    onClick={() => setActiveCardIndex(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className={styles.howItWorks}>
          <div className={styles.container}>
            <div className={styles.howItWorksHeader}>
              <h2>Simple Steps to Your Token</h2>
              <p className={styles.howItWorksSubtitle}>
                Creating a Solana token has never been easier. Follow these four simple steps to launch your project on the blockchain in minutes.
              </p>
            </div>
            <ol className={styles.stepsList} role="list">
              {[
                "Connect your Solana Wallet (Phantom, Solflare, etc.) to get started with the token creation process.",
                "Fill in your token details including Name, Symbol, Decimals, and Supply to customize your token.",
                "Confirm the transaction with our low 0.2 SOL fee plus minimal network fees for deployment.",
                "Receive your token instantly! Optionally revoke authorities for free to ensure maximum security.",
              ].map((text, index) => (
                <li
                  key={index}
                  className={`${styles.stepCard} ${isMounted && visibleItems.has(`step-${index}`) ? styles.stepItemVisible : ""}`}
                  id={`step-${index}`}
                >
                  <span className={styles.stepNumber} aria-hidden="true">{index + 1}</span>
                  <span className={styles.stepText}>{text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {FEATURES.ENABLE_AFFILIATE && (
          <section id="affiliate" className={styles.affiliate}>
            <div className={styles.container}>
              <h2>Join Our Affiliate Program</h2>
              <p>
                Share SoulMinter and earn! Get 50% commission (0.1 SOL) for every token created
                through your unique referral link. Help others launch their projects and get rewarded for life with sustainable passive income. <Link href="/affiliate-terms" className="text-purple-400 hover:text-purple-300 underline">Read our affiliate terms</Link>.
              </p>
              <button 
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => router.push('/affiliate')}
                aria-label="Go to affiliate dashboard"
              >
                Affiliate Dashboard
              </button>
            </div>
          </section>
        )}

        <section id="faq" className={styles.faq}>
          <div className={styles.container}>
            <div className={styles.faqHeader}>
              <span className={styles.faqLabelPill}>FAQ</span>
              <h2>Frequently Asked Questions</h2>
              <p className={styles.faqSubtitle}>
                Quick answers to common questions about SoulMinter and launching your Solana token.
              </p>
            </div>
            <div className={styles.faqGrid} role="list">
              {[faqItemsToShow.filter((_, i) => i % 2 === 0), faqItemsToShow.filter((_, i) => i % 2 === 1)].map((columnItems, colIndex) => (
                <div key={colIndex} className={styles.faqColumn} role="list">
                  {columnItems.map((item) => {
                    const isOpen = openFaqIds.has(item.id);
                    return (
                      <div key={item.id} className={styles.faqItem} role="listitem">
                        <button
                          type="button"
                          className={styles.faqHeaderRow}
                          onClick={() => {
                            setOpenFaqIds((prev) => {
                              const next = new Set(prev);
                              if (next.has(item.id)) {
                                next.delete(item.id);
                              } else {
                                next.add(item.id);
                              }
                              return next;
                            });
                          }}
                          aria-expanded={isOpen}
                          aria-controls={`faq-body-${item.id}`}
                        >
                          <span className={styles.faqQuestion}>{item.question}</span>
                          <span className={styles.faqToggleIcon} aria-hidden="true">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        <div
                          id={`faq-body-${item.id}`}
                          className={`${styles.faqBody} ${isOpen ? styles.faqBodyOpen : ""}`}
                        >
                          <div className={styles.faqBodyInner}>{item.answer}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className={styles.cta}>
          <div className={styles.container}>
            <h2 className={styles.title}>Ready to Create Your Solana Token?</h2>
            <p>Connect your wallet and launch your project on the Solana blockchain today!</p>
            <button 
              onClick={handleCreateClick}
              className={`${styles.btn} ${styles.btnPrimary} ${styles.pulse}`}
              aria-label="Create a new Solana token"
            >
              Create Token
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
