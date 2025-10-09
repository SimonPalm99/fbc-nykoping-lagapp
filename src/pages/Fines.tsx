import React from 'react';
import styles from './Fines.module.css';

// Ikoner

// Fine type is now imported from types/fine.ts


// Rätta getTopFinedPlayers för att undvika 'Object is possibly undefined'
// Remove duplicate getTopFinedPlayers. If needed, reimplement using correct Fine type.

const Fines: React.FC = () => {



  return (
    <div className={styles.root}>
      <div className={styles.backBtnWrap}>
        <button
          className={styles.backBtn}
          onClick={() => window.location.href = '/'}
        >
          Tillbaka
        </button>
      </div>
      <div className={styles.finesContainer}>
        <div className={styles.finesHeader}>
          <img src="/fbc-logo.jpg" alt="FBC Nyköping" className={styles.finesHeaderLogo} />
          <span className={styles.finesTitle}>Böter & Lagkassa</span>
        </div>
        <div className={styles.finesGrid}>
          {/* Personliga böter */}
          <section className={styles.finesSection}>
            <h2 className={styles.finesSectionTitle}>Mina böter</h2>
            {/* Lista personliga böter med tilldelare */}
            {/* Exempel på obetald böter med visuell indikator och tilldelare */}
            <div>
              <span className={styles.fineUnpaid}>Obetald</span>
              <span>Träningsmiss – 50 kr</span>
              <span className={styles.fineAssigner}>Tilldelad av: Ledare</span>
            </div>
            {/* Ingen möjlighet att lägga till böter på sig själv */}
          </section>
          {/* Lagkassa */}
          <section className={styles.finesSection}>
            <h2 className={styles.finesSectionTitle}>Lagkassa</h2>
            {/* TODO: Visa saldo och transaktioner */}
            <div className={styles.finesCashRow}>
              <span className={styles.finesCashLabel}>Saldo:</span>
              <span className={styles.finesCashValue}>0 kr</span>
            </div>
            {/* Progress bar för lagkassa */}
            <div className={styles.cashProgressBar}>
              <div className={styles.cashProgress + ' ' + styles.progress30}></div>
            </div>
            {/* TODO: Formulär för insättning/uttag */}
          </section>
          {/* Lagregler */}
          <section className={styles.finesSection}>
            <h2 className={styles.finesSectionTitle}>Lagregler</h2>
            {/* TODO: Lista och hantera lagregler */}
            <button className={styles.finesAddRuleBtn}>Lägg till regel</button>
          </section>
          {/* Laglista med böter */}
          <section className={styles.finesSection}>
            <h2 className={styles.finesSectionTitle}>Alla med böter</h2>
            {/* TODO: Lista alla spelare med böter */}
            {/* Knapp för att lägga till böter på andra */}
            <button className={styles.finesAddBtn + ' ' + styles.addPlayerBtn}>Lägg till böter på spelare</button>
            {/* Popup för att välja spelare, regel och kommentar kommer här */}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Fines;
