import { CreateToken } from "components/CreateToken";
import { FC, useState } from "react";
import styles from "./styles.module.css";

type CreateFaqItem = { id: string; question: string; answer: JSX.Element };

const CREATE_FAQ_ITEMS: CreateFaqItem[] = [
  {
    id: "spl-token-tool",
    question: "What is the SPL token creation tool?",
    answer: (
      <p>
        The SPL token creation tool is SoulMinter&apos;s no-code interface for creating SPL (Solana Program Library) tokens.
        SPL tokens are the standard token type on Solana. You can set the name, symbol, supply, decimals, and metadata and
        many more properties of the token, then deploy it on the Solana blockchain in minutes.
      </p>
    ),
  },
  {
    id: "wallets-supported",
    question: "Which wallets are supported?",
    answer: (
      <p>
        SoulMinter works with Solana wallets that support the standard Wallet Standard / Phantom-style connection, including
        Phantom, Solflare, Backpack, and other browser and mobile wallets. The app has been thoroughly tested with Solflare
        and Phantom, use these for the best experience.
      </p>
    ),
  },
  {
    id: "token-creation-cost",
    question: "How much does token creation cost?",
    answer: (
      <p>
        Creating a token with SoulMinter costs 0.2 SOL (platform fee) plus small Solana network fees for the transaction.
        Every additional feature like authority revocation and custom mint address is INCLUDED in the fee. We strictly
        believe in fair pricing and do our best to avoid dubious practices like drip-pricing (used by many of our
        competitors).
      </p>
    ),
  },
  {
    id: "is-it-safe",
    question: "Is creating a token with SoulMinter safe?",
    answer: (
      <p>
        Yes. Tokens are created via standard Solana programs. You keep full control of your wallet and sign only the
        creation and optional revocation transactions. We never hold your keys. You can revoke mint and freeze authorities
        for free to make the token supply and metadata immutable.
      </p>
    ),
  },
  {
    id: "decimals",
    question: "What are decimals?",
    answer: (
      <p>
        Decimals define how divisible your token is. For example, with 9 decimals (Solana&apos;s common choice), 1 token is
        stored as 1,000,000,000 base units. With 0 decimals, 1 token is exactly 1 unit—no fractions. More decimals allow
        finer pricing (e.g. 0.000000001 tokens); fewer decimals keep whole numbers only.
      </p>
    ),
  },
  {
    id: "mint-authority",
    question: "What is mint authority?",
    answer: (
      <p>
        Mint authority is the right to create new tokens (mint) for your token. As long as it&apos;s not revoked, the holder
        can increase the total supply. Revoking mint authority makes the maximum supply fixed forever. SoulMinter lets you
        revoke it for free after creation.
      </p>
    ),
  },
  {
    id: "freeze-authority",
    question: "What is freeze authority?",
    answer: (
      <p>
        Freeze authority allows the holder to freeze token accounts, preventing transfers. Revoking it means no one can
        freeze accounts. SoulMinter offers free revocation of freeze authority so your token cannot be frozen by anyone.
      </p>
    ),
  },
  {
    id: "update-authority",
    question: "What does it mean to make metadata immutable (What is update authority)?",
    answer: (
      <p>
        Update authority controls who can change the token&apos;s metadata (name, symbol, URI). As long as it exists, metadata
        can be edited. Making metadata immutable means revoking or transferring that authority so no one can change it
        anymore—your token&apos;s name, symbol, and link stay fixed on-chain.
      </p>
    ),
  },
  {
    id: "custom-mint-address",
    question: "What is a custom mint address?",
    answer: (
      <p>
        By default, the mint address is generated randomly at creation. A custom mint address lets you choose a specific
        set of letters/numbers for your token&apos;s mint address. This is useful for branding and building trust. Please
        note that it may take some time for these custom addresses to be generated.
      </p>
    ),
  },
];

export const CreateView: FC = ({}) => {
  const [openFaqIds, setOpenFaqIds] = useState<Set<string>>(new Set());

  return (
    <div className={styles.createContainer}>
      {/* Animated Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.floatingOrb} style={{ '--delay': '0s' } as any}></div>
        <div className={styles.floatingOrb} style={{ '--delay': '2s' } as any}></div>
        <div className={styles.floatingOrb} style={{ '--delay': '4s' } as any}></div>
        <div className={styles.floatingOrb} style={{ '--delay': '6s' } as any}></div>
        <div className={styles.floatingOrb} style={{ '--delay': '8s' } as any}></div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Create Your Solana Token</h2>
              <p className={styles.formSubtitle}>
                Fill in the details below to create your custom Solana token
              </p>
            </div>
            <div className={styles.formContent}>
              <CreateToken />
            </div>
          </div>

          <section id="create-faq" className={styles.createFaq} aria-labelledby="create-faq-title">
            <h2 id="create-faq-title" className={styles.createFaqTitle}>Frequently Asked Questions</h2>
            <p className={styles.createFaqSubtitle}>
              Common questions about the token creation tool
            </p>
            <div className={styles.createFaqList} role="list">
              {CREATE_FAQ_ITEMS.map((item) => {
                const isOpen = openFaqIds.has(item.id);
                return (
                  <div key={item.id} className={styles.createFaqItem} role="listitem">
                    <button
                      type="button"
                      className={styles.createFaqHeaderRow}
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
                      aria-controls={`create-faq-body-${item.id}`}
                    >
                      <span className={styles.createFaqQuestion}>{item.question}</span>
                      <span className={styles.createFaqToggleIcon} aria-hidden="true">{isOpen ? "−" : "+"}</span>
                    </button>
                    <div
                      id={`create-faq-body-${item.id}`}
                      className={`${styles.createFaqBody} ${isOpen ? styles.createFaqBodyOpen : ""}`}
                    >
                      <div className={styles.createFaqBodyInner}>{item.answer}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
