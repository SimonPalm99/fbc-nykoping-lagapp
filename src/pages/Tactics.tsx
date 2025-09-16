import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { tacticsAPI, exercisesAPI, analysisAPI } from "../services/apiService";

const getStyles = (isDark: boolean) => ({
  primaryGreen: "#2E7D32",
  accentGreen: "#4CAF50",
  fbcGold: "#FFB300",
  cardBackground: isDark ? "rgba(16, 32, 16, 0.97)" : "#FFFFFF",
  textPrimary: isDark ? "#F1F8E9" : "#1B5E20",
  textSecondary: isDark ? "#C8E6C9" : "#4A5568",
  gradients: {
    body: isDark
      ? "linear-gradient(135deg, #0A0A0A 0%, #0D1B0D 30%, #1B2E1B 100%)"
      : "linear-gradient(135deg, #FAFAFA 0%, #F1F8E9 30%, #E8F5E9 100%)",
    cardHover: isDark
      ? "linear-gradient(135deg, rgba(46, 125, 50, 0.25) 0%, rgba(56, 142, 60, 0.25) 100%)"
      : "linear-gradient(135deg, rgba(46, 125, 50, 0.07) 0%, rgba(56, 142, 60, 0.07) 100%)",
  },
});

interface Tactic {
  id: string;
  title: string;
  description: string;
  updated?: string;
  tags?: string[];
  category?: string;
}
interface Exercise {
  id: string;
  title: string;
  description: string;
  updated?: string;
  tags?: string[];
  level?: string;
  image?: string;
}
interface Analysis {
  id: string;
  match: string;
  date: string;
  summary: string;
  keyMoments?: string[];
}


const Tactics: React.FC = () => {
  const { isDark } = useTheme();
  const styles = getStyles(isDark);
  const [activeTab, setActiveTab] = useState<'taktiker'|'ovningar'|'analyser'>('taktiker');

  // Riktig data från API
  const [tactics, setTactics] = useState<Tactic[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  // Laddar data vid sidstart
  useEffect(() => {
    tacticsAPI.getAll().then((res: { success: boolean; data?: Tactic[] }) => {
      if (res.success && res.data) setTactics(res.data);
    });
    exercisesAPI.getAll().then((res: { success: boolean; data?: Exercise[] }) => {
      if (res.success && res.data) setExercises(res.data);
    });
    analysisAPI.getAll().then((res: { success: boolean; data?: Analysis[] }) => {
      if (res.success && res.data) setAnalyses(res.data);
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: styles.gradients.body, color: styles.textPrimary, fontFamily: "inherit", padding: "1.2rem 0", position: "relative", overflow: "hidden" }}>
      {/* Grön gradient-overlay överst */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 180, background: "linear-gradient(135deg, #22c55e 0%, #0a0a0a 100%)", opacity: 0.18, zIndex: 0, pointerEvents: "none" }} />
      {/* Header */}
      <header style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "0.3rem 0.5rem 0.2rem 0.5rem",
        borderBottom: `2px solid ${styles.primaryGreen}`,
        background: "linear-gradient(120deg, #2E7D32 0%, #388E3C 100%)",
        borderRadius: "0 0 1rem 1rem",
        boxShadow: "0 2px 8px rgba(46, 125, 50, 0.10)",
        position: "relative",
        overflow: "hidden",
        minHeight: "56px"
      }}>
        <div style={{ width: "100%", textAlign: "center", fontWeight: 900, fontSize: "1.35rem", color: "#fff", letterSpacing: "1px", textShadow: "0 2px 8px #2E7D32, 0 0px 2px #000", marginBottom: "0.3rem", zIndex: 2 }}>
          Taktik & Övningar
        </div>
        <div style={{ width: "100%", textAlign: "center", color: styles.textSecondary, fontSize: "1.05rem", marginBottom: "0.2rem" }}>
          Här hittar du lagets taktiker, övningar och analyser från matcherna. Ledarna publicerar allt viktigt material här!
        </div>
      </header>
      {/* Tabs för navigation */}
      <div style={{ maxWidth: 900, margin: "2rem auto 1.5rem auto", display: "flex", justifyContent: "center", gap: "1.2rem" }}>
  <button onClick={() => setActiveTab('taktiker')} style={{ fontWeight: 700, fontSize: "1.08rem", color: activeTab==='taktiker'?styles.primaryGreen:styles.textSecondary, background: "#fff", borderRadius: "10px", boxShadow: "0 2px 12px rgba(46,125,50,0.10)", padding: "0.7rem 1.2rem", border: `2px solid ${activeTab==='taktiker'?styles.primaryGreen:styles.textSecondary}` }}>Taktiker</button>
  <button onClick={() => setActiveTab('ovningar')} style={{ fontWeight: 700, fontSize: "1.08rem", color: activeTab==='ovningar'?styles.primaryGreen:styles.textSecondary, background: "#fff", borderRadius: "10px", boxShadow: "0 2px 12px rgba(46,125,50,0.10)", padding: "0.7rem 1.2rem", border: `2px solid ${activeTab==='ovningar'?styles.primaryGreen:styles.textSecondary}` }}>Övningar</button>
  <button onClick={() => setActiveTab('analyser')} style={{ fontWeight: 700, fontSize: "1.08rem", color: activeTab==='analyser'?styles.primaryGreen:styles.textSecondary, background: "#fff", borderRadius: "10px", boxShadow: "0 2px 12px rgba(46,125,50,0.10)", padding: "0.7rem 1.2rem", border: `2px solid ${activeTab==='analyser'?styles.primaryGreen:styles.textSecondary}` }}>Analyser</button>
      </div>
      {/* Innehåll */}
      <section style={{ maxWidth: 900, margin: "0 auto 2rem auto", padding: "0 1rem" }}>
        {/* Taktiker */}
        {activeTab === 'taktiker' && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {tactics.length === 0 ? (
              <div style={{ color: styles.textSecondary }}>Inga taktiker ännu.</div>
            ) : (
              tactics.map((t) => (
                <div key={t.id} style={{ background: styles.cardBackground, borderRadius: "1.2rem", boxShadow: "0 4px 16px rgba(46, 125, 50, 0.18)", border: `2px solid ${styles.primaryGreen}`, padding: "1.2rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.7rem", position: "relative" }}>
                  <div style={{ fontWeight: 700, fontSize: "1.15rem", color: styles.primaryGreen }}>{t.title}</div>
                  <div style={{ color: styles.textSecondary, fontSize: "0.98rem" }}>{t.description}</div>
                  {/* ...taggar, kategori, ledare, kommentarer, favoriter... */}
                  <div style={{ color: styles.textSecondary, fontSize: "0.85rem", marginTop: "0.2rem" }}>Senast uppdaterad: {t.updated}</div>
                </div>
              ))
            )}
          </div>
        )}
        {/* Övningar */}
        {activeTab === 'ovningar' && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {exercises.length === 0 ? (
              <div style={{ color: styles.textSecondary }}>Inga övningar ännu.</div>
            ) : (
              exercises.map((e) => (
                <div key={e.id} style={{ background: styles.cardBackground, borderRadius: "1.2rem", boxShadow: "0 4px 16px rgba(46, 125, 50, 0.18)", border: `2px solid ${styles.primaryGreen}`, padding: "1.2rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.7rem", position: "relative" }}>
                  <div style={{ fontWeight: 700, fontSize: "1.15rem", color: styles.primaryGreen }}>{e.title}</div>
                  <div style={{ color: styles.textSecondary, fontSize: "0.98rem" }}>{e.description}</div>
                  {/* ...taggar, nivå, bild, ledare, kommentarer, favoriter... */}
                  <div style={{ color: styles.textSecondary, fontSize: "0.85rem", marginTop: "0.2rem" }}>Senast uppdaterad: {e.updated}</div>
                  {e.image && <img src={e.image} alt={e.title} style={{ maxWidth: "100%", borderRadius: 10, marginTop: "0.5rem" }} />}
                </div>
              ))
            )}
          </div>
        )}
        {/* Analyser */}
        {activeTab === 'analyser' && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {analyses.length === 0 ? (
              <div style={{ color: styles.textSecondary }}>Inga analyser ännu.</div>
            ) : (
              analyses.map((a) => (
                <div key={a.id} style={{ background: styles.cardBackground, borderRadius: "1.2rem", boxShadow: "0 4px 16px rgba(46, 125, 50, 0.18)", border: `2px solid ${styles.primaryGreen}`, padding: "1.2rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.7rem", position: "relative" }}>
                  <div style={{ fontWeight: 700, fontSize: "1.15rem", color: styles.primaryGreen }}>{a.match}</div>
                  <div style={{ color: styles.textSecondary, fontSize: "0.98rem" }}>{a.summary}</div>
                  <div style={{ color: styles.textSecondary, fontSize: "0.85rem", marginTop: "0.2rem" }}>Datum: {a.date}</div>
                  <div style={{ marginTop: "0.5rem" }}>
                    <div style={{ fontWeight: 600, color: styles.primaryGreen, fontSize: "0.95rem" }}>Nyckelsituationer:</div>
                    <ul style={{ margin: 0, paddingLeft: "1.2rem", color: styles.textSecondary, fontSize: "0.95rem" }}>
                      {a.keyMoments?.map((m, idx) => <li key={idx}>{m}</li>)}
                    </ul>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {/* Material */}
      </section>
      {/* Footer */}
      <footer style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem", borderTop: `2px solid ${styles.primaryGreen}`, display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", fontSize: "0.9rem", color: styles.textSecondary }}>
        <div style={{ textAlign: "center" }}>
          &copy; {new Date().getFullYear()} FBC - Alla rättigheter förbehållna.
        </div>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          <a href="/privacy-policy" style={{ color: styles.textSecondary, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#FFB300"} onMouseLeave={e => e.currentTarget.style.color = styles.textSecondary}>
            Policy för personuppgifter
          </a>
          <a href="/terms-of-service" style={{ color: styles.textSecondary, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#FFB300"} onMouseLeave={e => e.currentTarget.style.color = styles.textSecondary}>
            Användarvillkor
          </a>
          <a href="/cookie-policy" style={{ color: styles.textSecondary, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#FFB300"} onMouseLeave={e => e.currentTarget.style.color = styles.textSecondary}>
            Cookiepolicy
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Tactics;
