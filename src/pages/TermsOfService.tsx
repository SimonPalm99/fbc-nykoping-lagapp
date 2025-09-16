import React from "react";
import { useTheme } from "../context/ThemeContext";

const TermsOfService: React.FC = () => {
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
          Användarvillkor – FBC Nyköping Lagapp
        </h1>
        <p style={{ fontSize: "1.15rem", color: styles.textSecondary, marginBottom: "1.5rem" }}>
          Genom att använda FBC Nyköpings lagapp godkänner du dessa användarvillkor. Villkoren är utformade för att skydda dig som användare och säkerställa en trygg, respektfull och laglig användning av tjänsten. Läs noggrant igenom vad som gäller för dig som användare.
        </p>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>1. Ansvar och uppförande</h2>
        <ul style={{ fontSize: "1.05rem", color: styles.textSecondary, marginBottom: "1.2rem" }}>
          <li>Du ansvarar för att dina personuppgifter och profilinformation är korrekta och uppdaterade.</li>
          <li>Du får inte sprida olämpligt, kränkande, diskriminerande eller olagligt innehåll.</li>
          <li>Respektera andra användare, lagets regler och svensk lagstiftning.</li>
          <li>Missbruk av appen kan leda till avstängning eller radering av konto.</li>
        </ul>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>2. Dataskydd och integritet</h2>
        <ul style={{ fontSize: "1.05rem", color: styles.textSecondary, marginBottom: "1.2rem" }}>
          <li>Personuppgifter hanteras enligt GDPR och vår integritetspolicy.</li>
          <li>Du har rätt att begära utdrag, rättelse eller radering av dina uppgifter.</li>
        </ul>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>3. Ansvarsbegränsning</h2>
        <ul style={{ fontSize: "1.05rem", color: styles.textSecondary, marginBottom: "1.2rem" }}>
          <li>FBC Nyköping ansvarar inte för tekniska fel, driftstörningar eller förlust av data.</li>
          <li>Appen kan uppdateras, ändras eller stängas ner utan förvarning.</li>
          <li>Vi strävar efter hög säkerhet men kan inte garantera fullständig tillgänglighet eller skydd mot alla risker.</li>
        </ul>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>4. Ändringar av villkor</h2>
        <ul style={{ fontSize: "1.05rem", color: styles.textSecondary, marginBottom: "1.2rem" }}>
          <li>Villkoren kan ändras vid behov. Du informeras om viktiga ändringar via appen.</li>
          <li>Det är ditt ansvar att hålla dig uppdaterad om gällande villkor.</li>
        </ul>
        <div style={{ marginTop: "2.5rem", textAlign: "center", color: styles.textSecondary, fontSize: "0.95rem" }}>
          Senast uppdaterad: 16 september 2025<br />
          Dessa användarvillkor kan komma att uppdateras vid behov. Vi rekommenderar att du läser igenom dem regelbundet.
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
