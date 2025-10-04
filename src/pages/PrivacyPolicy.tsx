
import React from "react";
import { useTheme } from "../context/ThemeContext";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy: React.FC = () => {
  const { isDark } = useTheme();
  // Set CSS variables for theme
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--background-gradient', isDark
      ? 'linear-gradient(135deg, #0A0A0A 0%, #0D1B0D 30%, #1B2E1B 100%)'
      : 'linear-gradient(135deg, #FAFAFA 0%, #F1F8E9 30%, #E8F5E9 100%)');
    root.style.setProperty('--card-background', isDark ? 'rgba(16, 32, 16, 0.97)' : '#FFFFFF');
    root.style.setProperty('--text-primary', isDark ? '#F1F8E9' : '#1B5E20');
    root.style.setProperty('--text-secondary', isDark ? '#C8E6C9' : '#4A5568');
    root.style.setProperty('--primary-green', '#2E7D32');
    root.style.setProperty('--fbc-gold', '#FFB300');
  }, [isDark]);

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Integritetspolicy – Hantering av personuppgifter
        </h1>
        <p className={styles.subtitle}>
          Din integritet är av yttersta vikt för oss på FBC Nyköping. Vi strävar efter att skydda dina personuppgifter och hantera dem med största respekt och enligt gällande lagstiftning (GDPR). Denna policy förklarar i detalj hur vi samlar in, använder, lagrar och skyddar dina uppgifter när du använder vår lagapp.
        </p>
        <h2 className={styles.sectionTitle}>1. Vilka personuppgifter samlas in?</h2>
        <ul className={styles.list}>
          <li><b>Identitetsuppgifter:</b> Namn, kontaktuppgifter, profilbild, födelsedatum.</li>
          <li><b>Lagrelaterad information:</b> Deltagande i aktiviteter, frånvaroanmälningar, roller, statistik.</li>
          <li><b>Kommunikation:</b> Foruminlägg, meddelanden, kommentarer.</li>
          <li><b>Teknisk data:</b> IP-adress, enhet, webbläsare, inloggningstider.</li>
        </ul>
  <h2 className={styles.sectionTitle}>2. Syfte med insamlingen</h2>
  <ul className={styles.list}>
          <li>Administrera lagets verksamhet, aktiviteter och kommunikation.</li>
          <li>Möjliggöra funktioner som frånvaroanmälan, forum, statistik och ledarportal.</li>
          <li>Förbättra användarupplevelsen, säkerheten och tillgängligheten.</li>
          <li>Följa lagkrav och säkerställa korrekt hantering av personuppgifter.</li>
        </ul>
  <h2 className={styles.sectionTitle}>3. Rättslig grund</h2>
  <ul className={styles.list}>
          <li>Samtycke: Du ger samtycke till behandling av dina uppgifter vid registrering.</li>
          <li>Avtal: Hantering av uppgifter krävs för att du ska kunna använda appen.</li>
          <li>Rättslig förpliktelse: Vissa uppgifter måste sparas enligt lag.</li>
        </ul>
  <h2 className={styles.sectionTitle}>1. Vilka uppgifter samlas in?</h2>
  <ul className={styles.list}>
          <li>Namn, kontaktuppgifter, profilinformation</li>
          <li>Aktivitetsdeltagande, frånvaroanmälningar, foruminlägg</li>
          <li>Teknisk information (IP-adress, enhet, webbläsare)</li>
        </ul>
  <h2 className={styles.sectionTitle}>2. Hur används uppgifterna?</h2>
  <ul className={styles.list}>
          <li>För att administrera lagets verksamhet och kommunikation</li>
          <li>För att möjliggöra funktioner som frånvaroanmälan, forum och statistik</li>
          <li>För att förbättra användarupplevelsen och säkerheten</li>
        </ul>
  <h2 className={styles.sectionTitle}>4. Vem har tillgång till dina uppgifter?</h2>
  <ul className={styles.list}>
          <li>Endast behöriga ledare och administratörer i FBC Nyköping har tillgång till personuppgifter.</li>
          <li>Uppgifter delas aldrig med tredje part utan uttryckligt samtycke, utom när det krävs enligt lag.</li>
          <li>All åtkomst loggas och granskas regelbundet.</li>
        </ul>
  <h2 className={styles.sectionTitle}>5. Hur lagras och skyddas dina uppgifter?</h2>
  <ul className={styles.list}>
          <li>Uppgifterna lagras säkert i krypterad databas med begränsad åtkomst.</li>
          <li>All kommunikation med appen är krypterad (HTTPS).</li>
          <li>Regelbunden backup, säkerhetsuppdateringar och granskning av systemet.</li>
          <li>Behörighetskontroller och loggning av all åtkomst.</li>
        </ul>
  <h2 className={styles.sectionTitle}>6. Dina rättigheter enligt GDPR</h2>
  <ul className={styles.list}>
          <li>Rätt till tillgång: Du kan begära utdrag av dina personuppgifter.</li>
          <li>Rätt till rättelse: Du kan begära att felaktiga uppgifter rättas.</li>
          <li>Rätt till radering: Du kan begära att dina uppgifter raderas.</li>
          <li>Rätt till begränsning: Du kan begära att viss behandling begränsas.</li>
          <li>Rätt till dataportabilitet: Du kan få ut dina uppgifter i ett strukturerat format.</li>
          <li>Rätt att invända: Du kan invända mot viss behandling.</li>
        </ul>
  <h2 className={styles.sectionTitle}>7. Kontakt och frågor</h2>
  <p className={styles.contact}>
          Vid frågor om personuppgiftshantering, kontakta lagets ledare eller administratör. Du kan även vända dig till Datainspektionen om du anser att dina rättigheter inte respekteras.
        </p>
  <div className={styles.updated}>
          Senast uppdaterad: 16 september 2025<br />
          Denna policy kan komma att uppdateras vid behov. Vi rekommenderar att du läser igenom den regelbundet.
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
