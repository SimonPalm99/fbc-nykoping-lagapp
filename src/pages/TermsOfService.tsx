import React from "react";
import { useTheme } from "../context/ThemeContext";
import styles from "./TermsOfService.module.css";

const TermsOfService: React.FC = () => {
  const { isDark } = useTheme();
  const theme = isDark ? "dark" : "light";

  return (
    <div className={styles["tos-root"]} data-theme={theme}>
      <div className={styles["tos-card"]}>
        <h1 className={styles["tos-title"]}>
          Användarvillkor – FBC Nyköping Lagapp
        </h1>
        <p className={styles["tos-paragraph"]}>
          Genom att använda FBC Nyköpings lagapp godkänner du dessa användarvillkor. Villkoren är utformade för att skydda dig som användare och säkerställa en trygg, respektfull och laglig användning av tjänsten. Läs noggrant igenom vad som gäller för dig som användare.
        </p>
        <h2 className={styles["tos-section-title"]}>1. Ansvar och uppförande</h2>
        <ul className={styles["tos-list"]}>
          <li>Du ansvarar för att dina personuppgifter och profilinformation är korrekta och uppdaterade.</li>
          <li>Du får inte sprida olämpligt, kränkande, diskriminerande eller olagligt innehåll.</li>
          <li>Respektera andra användare, lagets regler och svensk lagstiftning.</li>
          <li>Missbruk av appen kan leda till avstängning eller radering av konto.</li>
        </ul>
        <h2 className={styles["tos-section-title"]}>2. Dataskydd och integritet</h2>
        <ul className={styles["tos-list"]}>
          <li>Personuppgifter hanteras enligt GDPR och vår integritetspolicy.</li>
          <li>Du har rätt att begära utdrag, rättelse eller radering av dina uppgifter.</li>
        </ul>
        <h2 className={styles["tos-section-title"]}>3. Ansvarsbegränsning</h2>
        <ul className={styles["tos-list"]}>
          <li>FBC Nyköping ansvarar inte för tekniska fel, driftstörningar eller förlust av data.</li>
          <li>Appen kan uppdateras, ändras eller stängas ner utan förvarning.</li>
          <li>Vi strävar efter hög säkerhet men kan inte garantera fullständig tillgänglighet eller skydd mot alla risker.</li>
        </ul>
        <h2 className={styles["tos-section-title"]}>4. Ändringar av villkor</h2>
        <ul className={styles["tos-list"]}>
          <li>Villkoren kan ändras vid behov. Du informeras om viktiga ändringar via appen.</li>
          <li>Det är ditt ansvar att hålla dig uppdaterad om gällande villkor.</li>
        </ul>
        <div className={styles["tos-updated"]}>
          Senast uppdaterad: 16 september 2025<br />
          Dessa användarvillkor kan komma att uppdateras vid behov. Vi rekommenderar att du läser igenom dem regelbundet.
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
