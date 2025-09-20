import { CreateToken } from "components/CreateToken";
import { FC, useState, useEffect } from "react";
import styles from "./styles.module.css";

export const CreateView: FC = ({}) => {
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
        </div>
      </div>
    </div>
  );
};
