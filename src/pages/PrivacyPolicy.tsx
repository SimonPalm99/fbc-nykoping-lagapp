import React from "react";
import { useTheme } from "../context/ThemeContext";

const PrivacyPolicy: React.FC = () => {
  const { isDark } = useTheme();
  const styles = {
    gradients: {
      body: isDark
        ? "linear-gradient(135deg, #0A0A0A 0%, #0D1B0D 30%, #1B2E1B 100%)"
        : "linear-gradient(135deg, #FAFAFA 0%, #F1F8E9 30%, #E8F5E9 100%)",
    },
    cardBackground: isDark ? "rgba(16, 32, 16, 0.97)" : "#FFFFFF",
    textPrimary: isDark ? "#F1F8E9" : "#1B5E20",
    textSecondary: isDark ? "#C8E6C9" : "#4A5568",
    primaryGreen: "#2E7D32",
    fbcGold: "#FFB300",
  };

  return (
    <div style={{ minHeight: "100vh", background: styles.gradients.body, color: styles.textPrimary, fontFamily: "inherit", padding: "2rem 0", position: "relative" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", background: styles.cardBackground, borderRadius: "1.2rem", boxShadow: "0 4px 16px rgba(46, 125, 50, 0.18)", border: `2px solid ${styles.primaryGreen}`, padding: "2.5rem 2rem", position: "relative" }}>
        <h1 style={{ fontWeight: 900, fontSize: "2rem", color: styles.primaryGreen, marginBottom: "1.5rem", textAlign: "center" }}>
          Integritetspolicy – Hantering av personuppgifter
        </h1>
        <p style={{ fontSize: "1.15rem", color: styles.textSecondary, marginBottom: "1.5rem" }}>
          Din integritet är av yttersta vikt för oss på FBC Nyköping. Vi strävar efter att skydda dina personuppgifter och hantera dem med största respekt och enligt gällande lagstiftning (GDPR). Denna policy förklarar i detalj hur vi samlar in, använder, lagrar och skyddar dina uppgifter när du använder vår lagapp.
        </p>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>1. Vilka personuppgifter samlas in?</h2>
        <ul style={{ fontSize: "1.05rem", color: styles.textSecondary, marginBottom: "1.2rem" }}>
          <li><b>Identitetsuppgifter:</b> Namn, kontaktuppgifter, profilbild, födelsedatum.</li>
          <li><b>Lagrelaterad information:</b> Deltagande i aktiviteter, frånvaroanmälningar, roller, statistik.</li>
          <li><b>Kommunikation:</b> Foruminlägg, meddelanden, kommentarer.</li>
          <li><b>Teknisk data:</b> IP-adress, enhet, webbläsare, inloggningstider.</li>
        </ul>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>2. Syfte med insamlingen</h2>
        <ul style={{ fontSize: "1.05rem", color: styles.textSecondary, marginBottom: "1.2rem" }}>
          <li>Administrera lagets verksamhet, aktiviteter och kommunikation.</li>
          <li>Möjliggöra funktioner som frånvaroanmälan, forum, statistik och ledarportal.</li>
          <li>Förbättra användarupplevelsen, säkerheten och tillgängligheten.</li>
          <li>Följa lagkrav och säkerställa korrekt hantering av personuppgifter.</li>
        </ul>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>3. Rättslig grund</h2>
        <ul style={{ fontSize: "1.05rem", color: styles.textSecondary, marginBottom: "1.2rem" }}>
          <li>Samtycke: Du ger samtycke till behandling av dina uppgifter vid registrering.</li>
          <li>Avtal: Hantering av uppgifter krävs för att du ska kunna använda appen.</li>
          <li>Rättslig förpliktelse: Vissa uppgifter måste sparas enligt lag.</li>
        </ul>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>1. Vilka uppgifter samlas in?</h2>
        <ul style={{ fontSize: "1.05rem", color: styles.textSecondary, marginBottom: "1.2rem" }}>
          <li>Namn, kontaktuppgifter, profilinformation</li>
          <li>Aktivitetsdeltagande, frånvaroanmälningar, foruminlägg</li>
          <li>Teknisk information (IP-adress, enhet, webbläsare)</li>
        </ul>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>2. Hur används uppgifterna?</h2>
        <ul style={{ fontSize: "1.05rem", color: styles.textSecondary, marginBottom: "1.2rem" }}>
          <li>För att administrera lagets verksamhet och kommunikation</li>
          <li>För att möjliggöra funktioner som frånvaroanmälan, forum och statistik</li>
          <li>För att förbättra användarupplevelsen och säkerheten</li>
        </ul>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>4. Vem har tillgång till dina uppgifter?</h2>
        <ul style={{ fontSize: "1.05rem", color: styles.textSecondary, marginBottom: "1.2rem" }}>
          <li>Endast behöriga ledare och administratörer i FBC Nyköping har tillgång till personuppgifter.</li>
          <li>Uppgifter delas aldrig med tredje part utan uttryckligt samtycke, utom när det krävs enligt lag.</li>
          <li>All åtkomst loggas och granskas regelbundet.</li>
        </ul>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>5. Hur lagras och skyddas dina uppgifter?</h2>
        <ul style={{ fontSize: "1.05rem", color: styles.textSecondary, marginBottom: "1.2rem" }}>
          <li>Uppgifterna lagras säkert i krypterad databas med begränsad åtkomst.</li>
          <li>All kommunikation med appen är krypterad (HTTPS).</li>
          <li>Regelbunden backup, säkerhetsuppdateringar och granskning av systemet.</li>
          <li>Behörighetskontroller och loggning av all åtkomst.</li>
        </ul>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>6. Dina rättigheter enligt GDPR</h2>
        <ul style={{ fontSize: "1.05rem", color: styles.textSecondary, marginBottom: "1.2rem" }}>
          <li>Rätt till tillgång: Du kan begära utdrag av dina personuppgifter.</li>
          <li>Rätt till rättelse: Du kan begära att felaktiga uppgifter rättas.</li>
          <li>Rätt till radering: Du kan begära att dina uppgifter raderas.</li>
          <li>Rätt till begränsning: Du kan begära att viss behandling begränsas.</li>
          <li>Rätt till dataportabilitet: Du kan få ut dina uppgifter i ett strukturerat format.</li>
          <li>Rätt att invända: Du kan invända mot viss behandling.</li>
        </ul>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>7. Kontakt och frågor</h2>
        <p style={{ fontSize: "1.05rem", color: styles.textSecondary }}>
          Vid frågor om personuppgiftshantering, kontakta lagets ledare eller administratör. Du kan även vända dig till Datainspektionen om du anser att dina rättigheter inte respekteras.
        </p>
        <div style={{ marginTop: "2.5rem", textAlign: "center", color: styles.textSecondary, fontSize: "0.95rem" }}>
          Senast uppdaterad: 16 september 2025<br />
          Denna policy kan komma att uppdateras vid behov. Vi rekommenderar att du läser igenom den regelbundet.
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
