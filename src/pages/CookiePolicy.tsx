import React from "react";
import { useTheme } from "../context/ThemeContext";

const CookiePolicy: React.FC = () => {
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
          Cookiepolicy – Information om cookies
        </h1>
        <p style={{ fontSize: "1.15rem", color: styles.textSecondary, marginBottom: "1.5rem" }}>
          Vi använder cookies för att ge dig en trygg, smidig och personlig upplevelse i FBC Nyköpings lagapp. Här förklarar vi i detalj hur cookies fungerar, varför de används och hur du kan hantera dem.
        </p>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>1. Vad är cookies?</h2>
        <ul style={{ fontSize: "1.05rem", color: styles.textSecondary, marginBottom: "1.2rem" }}>
          <li>Cookies är små textfiler som lagras på din dator, mobil eller surfplatta när du besöker en webbplats.</li>
          <li>De används för att spara inställningar, hålla dig inloggad, analysera användning och förbättra tjänsten.</li>
          <li>Det finns olika typer av cookies: sessionscookies, permanenta cookies och tredjepartscookies.</li>
        </ul>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>2. Vilka cookies använder vi?</h2>
        <ul style={{ fontSize: "1.05rem", color: styles.textSecondary, marginBottom: "1.2rem" }}>
          <li><b>Nödvändiga cookies:</b> Krävs för att appen ska fungera, t.ex. inloggning och säkerhet.</li>
          <li><b>Sessionscookies:</b> Håller dig inloggad och sparar tillfälliga inställningar.</li>
          <li><b>Analyscookies:</b> Hjälper oss att förstå hur appen används och förbättra funktioner (anonymiserad data).</li>
        </ul>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>3. Hur kan du hantera cookies?</h2>
        <ul style={{ fontSize: "1.05rem", color: styles.textSecondary, marginBottom: "1.2rem" }}>
          <li>Du kan blockera, radera eller begränsa cookies via din webbläsares inställningar.</li>
          <li>Du kan även välja att surfa i privat läge för att undvika lagring av cookies.</li>
          <li>Observera att vissa funktioner i appen kan sluta fungera om du blockerar cookies.</li>
        </ul>
        <h2 style={{ color: styles.primaryGreen, fontSize: "1.25rem", marginTop: "1.5rem" }}>4. Tredjepartscookies och delning</h2>
        <ul style={{ fontSize: "1.05rem", color: styles.textSecondary, marginBottom: "1.2rem" }}>
          <li>Vi använder inte tredjepartscookies för marknadsföring eller spårning.</li>
          <li>Vi delar aldrig cookies eller data med tredje part.</li>
        </ul>
        <div style={{ marginTop: "2.5rem", textAlign: "center", color: styles.textSecondary, fontSize: "0.95rem" }}>
          Senast uppdaterad: 16 september 2025<br />
          Denna cookiepolicy kan komma att uppdateras vid behov. Vi rekommenderar att du läser igenom den regelbundet.
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
