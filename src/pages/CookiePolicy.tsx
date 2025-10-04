import React from "react";
// import { useTheme } from "../context/ThemeContext"; // Removed unused import
import css from "./CookiePolicy.module.css";

const CookiePolicy: React.FC = () => {
  // const { isDark } = useTheme(); // Removed unused isDark

  // Dynamisk färg och bakgrund via ThemeContext
  return (
    <div className={css.root}>
      <div className={css.card}>
        <h1 className={css.heading}>
          Cookiepolicy – Information om cookies
        </h1>
        <p className={css.paragraph}>
          Vi använder cookies för att ge dig en trygg, smidig och personlig upplevelse i FBC Nyköpings lagapp. Här förklarar vi i detalj hur cookies fungerar, varför de används och hur du kan hantera dem.
        </p>
        <h2 className={css.sectionTitle}>1. Vad är cookies?</h2>
        <ul className={css.list}>
          <li>Cookies är små textfiler som lagras på din dator, mobil eller surfplatta när du besöker en webbplats.</li>
          <li>De används för att spara inställningar, hålla dig inloggad, analysera användning och förbättra tjänsten.</li>
          <li>Det finns olika typer av cookies: sessionscookies, permanenta cookies och tredjepartscookies.</li>
        </ul>
        <h2 className={css.sectionTitle}>2. Vilka cookies använder vi?</h2>
        <ul className={css.list}>
          <li><b>Nödvändiga cookies:</b> Krävs för att appen ska fungera, t.ex. inloggning och säkerhet.</li>
          <li><b>Sessionscookies:</b> Håller dig inloggad och sparar tillfälliga inställningar.</li>
          <li><b>Analyscookies:</b> Hjälper oss att förstå hur appen används och förbättra funktioner (anonymiserad data).</li>
        </ul>
        <h2 className={css.sectionTitle}>3. Hur kan du hantera cookies?</h2>
        <ul className={css.list}>
          <li>Du kan blockera, radera eller begränsa cookies via din webbläsares inställningar.</li>
          <li>Du kan även välja att surfa i privat läge för att undvika lagring av cookies.</li>
          <li>Observera att vissa funktioner i appen kan sluta fungera om du blockerar cookies.</li>
        </ul>
        <h2 className={css.sectionTitle}>4. Tredjepartscookies och delning</h2>
        <ul className={css.list}>
          <li>Vi använder inte tredjepartscookies för marknadsföring eller spårning.</li>
          <li>Vi delar aldrig cookies eller data med tredje part.</li>
        </ul>
        <div className={css.updated}>
          Senast uppdaterad: 16 september 2025<br />
          Denna cookiepolicy kan komma att uppdateras vid behov. Vi rekommenderar att du läser igenom den regelbundet.
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
