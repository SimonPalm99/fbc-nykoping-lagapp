import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { statisticsAPI } from "../services/apiService";

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
    }
});

const Statistics: React.FC = () => {
    const { isDark } = useTheme();
    const { user: authUser } = useUser();
    const styles = getStyles(isDark);
    const [personalStats, setPersonalStats] = useState<{gamesPlayed:number; goals:number; assists:number; penalties:number; attendance:number}>({gamesPlayed:0, goals:0, assists:0, penalties:0, attendance:0});
    const [teamStats, setTeamStats] = useState<{gamesPlayed:number; goals:number; assists:number; penalties:number; attendance:number; topScorers?:any[]}>({gamesPlayed:0, goals:0, assists:0, penalties:0, attendance:0, topScorers:[]});
    const [activeTab, setActiveTab] = useState<'personligt'|'laget'>('personligt');

    useEffect(() => {
        // Hämta personlig statistik
        if (authUser?.id) {
            statisticsAPI.getPersonal(authUser.id).then((res: { success: boolean; data?: { gamesPlayed?: number; goals?: number; assists?: number; penalties?: number; attendance?: number } }) => {
                if (res.success && res.data) {
                    setPersonalStats({
                        gamesPlayed: res.data.gamesPlayed ?? 0,
                        goals: res.data.goals ?? 0,
                        assists: res.data.assists ?? 0,
                        penalties: res.data.penalties ?? 0,
                        attendance: res.data.attendance ?? 0
                    });
                }
            });
        }
        // Hämta lagstatistik
        statisticsAPI.getTeam().then((res: { success: boolean; data?: { gamesPlayed?: number; goals?: number; assists?: number; penalties?: number; attendance?: number; topScorers?: any[] } }) => {
            if (res.success && res.data) {
                setTeamStats({
                    gamesPlayed: res.data.gamesPlayed ?? 0,
                    goals: res.data.goals ?? 0,
                    assists: res.data.assists ?? 0,
                    penalties: res.data.penalties ?? 0,
                    attendance: res.data.attendance ?? 0,
                    topScorers: res.data.topScorers ?? []
                });
            }
        });
    }, [authUser?.id]);

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
                    Statistik
                </div>
                <div style={{ width: "100%", textAlign: "center", color: styles.textSecondary, fontSize: "1.05rem", marginBottom: "0.2rem" }}>
                    Se lagets och din personliga statistik. Jämför prestationer och följ utvecklingen!
                </div>
            </header>
            {/* Tabs för personligt/laget */}
            <div style={{ maxWidth: 900, margin: "2rem auto 1.5rem auto", display: "flex", justifyContent: "center", gap: "1.2rem" }}>
                <button onClick={() => setActiveTab('personligt')} style={{ fontWeight: 700, fontSize: "1.08rem", color: activeTab==='personligt'?styles.primaryGreen:styles.textSecondary, background: "#fff", borderRadius: "10px", boxShadow: "0 2px 12px rgba(46,125,50,0.10)", padding: "0.7rem 1.2rem", border: `2px solid ${activeTab==='personligt'?styles.primaryGreen:styles.textSecondary}` }}>Personligt</button>
                <button onClick={() => setActiveTab('laget')} style={{ fontWeight: 700, fontSize: "1.08rem", color: activeTab==='laget'?styles.primaryGreen:styles.textSecondary, background: "#fff", borderRadius: "10px", boxShadow: "0 2px 12px rgba(46,125,50,0.10)", padding: "0.7rem 1.2rem", border: `2px solid ${activeTab==='laget'?styles.primaryGreen:styles.textSecondary}` }}>Laget</button>
            </div>
            {/* Statistik-kort */}
            <section style={{ maxWidth: 900, margin: "0 auto 2rem auto", padding: "0 1rem" }}>
                {activeTab === 'personligt' ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center" }}>
                        <StatCard label="Matcher" value={personalStats.gamesPlayed} icon="🏆" color={styles.primaryGreen} />
                        <StatCard label="Mål" value={personalStats.goals} icon="🥅" color={styles.fbcGold} />
                        <StatCard label="Assist" value={personalStats.assists} icon="🎯" color={styles.accentGreen} />
                        <StatCard label="Utvisningar" value={personalStats.penalties} icon="🚫" color="#e53935" />
                        <StatCard label="Närvaro" value={personalStats.attendance} icon="✅" color={styles.primaryGreen} />
                    </div>
                ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center" }}>
                        <StatCard label="Matcher" value={teamStats.gamesPlayed} icon="🏆" color={styles.primaryGreen} />
                        <StatCard label="Mål" value={teamStats.goals} icon="🥅" color={styles.fbcGold} />
                        <StatCard label="Assist" value={teamStats.assists} icon="🎯" color={styles.accentGreen} />
                        <StatCard label="Utvisningar" value={teamStats.penalties} icon="🚫" color="#e53935" />
                        <StatCard label="Närvaro" value={teamStats.attendance} icon="✅" color={styles.primaryGreen} />
                        {/* Toppskyttar */}
                        {teamStats.topScorers && teamStats.topScorers.length > 0 && (
                            <div style={{ width: "100%", marginTop: "2rem" }}>
                                <div style={{ fontWeight: 700, fontSize: "1.13rem", color: styles.primaryGreen, marginBottom: "0.7rem" }}>Toppskyttar</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                                    {teamStats.topScorers.map((scorer:any, idx:number) => (
                                        <div key={scorer.id || idx} style={{ background: styles.cardBackground, borderRadius: "0.8rem", boxShadow: "0 2px 8px rgba(46,125,50,0.07)", padding: "0.7rem 1.2rem", display: "flex", alignItems: "center", gap: "1.2rem", border: `1.5px solid ${styles.primaryGreen}` }}>
                                            <span style={{ fontWeight: 700, color: styles.primaryGreen, fontSize: "1.05rem", minWidth: 32 }}>{idx+1}.</span>
                                            <span style={{ fontWeight: 700, color: styles.textPrimary, fontSize: "1.05rem" }}>{scorer.name}</span>
                                            <span style={{ fontWeight: 700, color: styles.fbcGold, fontSize: "1.05rem" }}>⚽ {scorer.goals}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
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

// Statistik-kort komponent
const StatCard: React.FC<{ label: string; value: number; icon: string; color: string }> = ({ label, value, icon, color }) => (
    <div style={{
        minWidth: 120,
        textAlign: "center",
        background: "#fff",
        borderRadius: "0.8rem",
        boxShadow: "0 2px 8px rgba(46,125,50,0.07)",
        padding: "1.1rem 0.7rem",
        position: "relative",
        border: `1.5px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        cursor: "pointer"
    }}>
        <span style={{ fontSize: "2.1rem", marginBottom: "0.2rem", color }}>{icon}</span>
        <div style={{ fontWeight: 700, color, fontSize: "1.13rem", marginBottom: "0.2rem", letterSpacing: "0.5px" }}>{label}</div>
        <div style={{ fontSize: "1.45rem", fontWeight: 900, color: "#222" }}>{value}</div>
    </div>
);

export default Statistics;
