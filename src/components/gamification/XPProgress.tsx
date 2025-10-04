import React from "react";

interface Props {
  userId: string;
}

const XPProgress: React.FC<Props> = ({ userId }) => {
  // Här kan du hämta/anpassa XP-data baserat på userId
  // Nedan är statiskt exempel
  const xp = 1234;
  const xpForNextLevel = 1500;
  const percent = Math.min((xp / xpForNextLevel) * 100, 100);
  // Importera CSS-modul
  // @ts-ignore
  const styles = require('./XPProgress.module.css');
  // Skapa en dynamisk klass för progressbarens bredd
  const progressBarWidthClass = `${styles.xpProgressBarWidth}-${Math.round(percent)}`;

  return (
    <section className={styles.xpProgressSection}>
      <h3 className={styles.xpProgressTitle}>XP-progress för användare: {userId}</h3>
      <div>
        <span className={styles.xpProgressScore}>Poäng: {xp} / {xpForNextLevel}</span>
        <div className={styles.xpProgressWrapper}>
          <div
            className={`${styles.xpProgressBar} ${progressBarWidthClass}`}
          ></div>
        </div>
        <span className={styles.xpProgressPercent}>{percent.toFixed(1)}%</span>
      </div>
    </section>
  );
};

export default XPProgress;