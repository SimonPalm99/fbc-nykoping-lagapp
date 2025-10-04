import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { statisticsAPI } from "../services/apiService";
import styles from "./Statistics.module.css";

const PRIMARY_GREEN = "#2E7D32";
const ACCENT_GREEN = "#4CAF50";
const FBC_GOLD = "#FFB300";


const Statistics: React.FC = () => {
    const { user: authUser } = useUser();
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
        <div className={styles.root}>
            <div className={styles.gradientTop} />
            <header className={styles.header}>
                <div className={styles.headerTitle}>Statistik</div>
                <div className={styles.headerSubtitle}>
                    Se lagets och din personliga statistik. Jämför prestationer och följ utvecklingen!
                </div>
            </header>
            <div className={styles.tabs}>
                <button
                    onClick={() => setActiveTab('personligt')}
                    className={activeTab === 'personligt' ? `${styles.tabBtn} ${styles.tabBtnActive}` : styles.tabBtn}
                >
                    Personligt
                </button>
                <button
                    onClick={() => setActiveTab('laget')}
                    className={activeTab === 'laget' ? `${styles.tabBtn} ${styles.tabBtnActive}` : styles.tabBtn}
                >
                    Laget
                </button>
            </div>
            <section className={styles.section}>
                {activeTab === 'personligt' ? (
                    <div className={styles.statCards}>
                        <StatCard label="Matcher" value={personalStats.gamesPlayed} icon="🏆" color={PRIMARY_GREEN} />
                        <StatCard label="Mål" value={personalStats.goals} icon="🥅" color={FBC_GOLD} />
                        <StatCard label="Assist" value={personalStats.assists} icon="🎯" color={ACCENT_GREEN} />
                        <StatCard label="Utvisningar" value={personalStats.penalties} icon="🚫" color="#e53935" />
                        <StatCard label="Närvaro" value={personalStats.attendance} icon="✅" color={PRIMARY_GREEN} />
                    </div>
                ) : (
                    <div className={styles.statCards}>
                        <StatCard label="Matcher" value={teamStats.gamesPlayed} icon="🏆" color={PRIMARY_GREEN} />
                        <StatCard label="Mål" value={teamStats.goals} icon="🥅" color={FBC_GOLD} />
                        <StatCard label="Assist" value={teamStats.assists} icon="🎯" color={ACCENT_GREEN} />
                        <StatCard label="Utvisningar" value={teamStats.penalties} icon="🚫" color="#e53935" />
                        <StatCard label="Närvaro" value={teamStats.attendance} icon="✅" color={PRIMARY_GREEN} />
                        {/* Toppskyttar */}
                        {teamStats.topScorers && teamStats.topScorers.length > 0 && (
                            <div className={styles.topScorers}>
                                <div className={styles.topScorersTitle}>Toppskyttar</div>
                                <div className={styles.topScorersList}>
                                    {teamStats.topScorers.map((scorer:any, idx:number) => (
                                        <div key={scorer.id || idx} className={styles.topScorerCard}>
                                            <span className={styles.topScorerRank}>{idx+1}.</span>
                                            <span className={styles.topScorerName}>{scorer.name}</span>
                                            <span className={styles.topScorerGoals}>⚽ {scorer.goals}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
            <footer className={styles.footer}>
                <div className={styles.footerCopyright}>
                    &copy; {new Date().getFullYear()} FBC - Alla rättigheter förbehållna.
                </div>
                <div className={styles.footerLinks}>
                    <a href="/privacy-policy" className={styles.footerLink}>
                        Policy för personuppgifter
                    </a>
                    <a href="/terms-of-service" className={styles.footerLink}>
                        Användarvillkor
                    </a>
                    <a href="/cookie-policy" className={styles.footerLink}>
                        Cookiepolicy
                    </a>
                </div>
            </footer>
        </div>
    );
};

// Statistik-kort komponent
const StatCard: React.FC<{ label: string; value: number; icon: string; color: string }> = ({ label, value, icon, color }) => {
    // Use inline border color, but for icon/label, use color classes if needed
    return (
        <div className={styles.statCard} data-border={color}>
            <span className={styles.statIcon} data-color={color}>{icon}</span>
            <div className={styles.statLabel} data-color={color}>{label}</div>
            <div className={styles.statValue}>{value}</div>
        </div>
    );
};

export default Statistics;
