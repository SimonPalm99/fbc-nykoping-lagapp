import React, { useMemo } from "react";
import styles from "./TrainingLogStats.module.css";
import { TrainingLog } from "../../types/user";

interface TrainingLogStatsProps {
  logs: TrainingLog[];
  timeframe?: "week" | "month" | "season" | "all";
}

export const TrainingLogStats: React.FC<TrainingLogStatsProps> = ({
  logs,
  timeframe = "month"
}) => {
  const stats = useMemo(() => {
    if (!logs || logs.length === 0) return null;

    const now = new Date();
    let filteredLogs = logs;

    // Filtrera efter tidsram
    if (timeframe !== "all") {
      const cutoffDate = new Date();
      switch (timeframe) {
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "season":
          cutoffDate.setMonth(now.getMonth() - 6); // Säsong = 6 månader
          break;
      }
      filteredLogs = logs.filter(log => new Date(log.date) >= cutoffDate);
    }

    if (filteredLogs.length === 0) return null;

    // Beräkna grundläggande statistik
    const totalSessions = filteredLogs.length;
    const totalMinutes = filteredLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const averageDuration = Math.round(totalMinutes / totalSessions);
    const averageIntensity = filteredLogs.reduce((sum, log) => sum + (log.intensity || 0), 0) / totalSessions;
    const averageFeeling = filteredLogs.reduce((sum, log) => sum + (log.feeling || 0), 0) / totalSessions;

    // Räkna färdigheter
    const skillsCount: Record<string, number> = {};
    filteredLogs.forEach(log => {
      log.skills?.forEach(skill => {
        skillsCount[skill] = (skillsCount[skill] || 0) + 1;
      });
    });
    const topSkills = Object.entries(skillsCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    // Samla statistik
    const totalStats = filteredLogs.reduce((acc, log) => {
      if (log.stats) {
        acc.goals += log.stats.goals || 0;
        acc.assists += log.stats.assists || 0;
        acc.shots += log.stats.shots || 0;
      }
      return acc;
    }, { goals: 0, assists: 0, shots: 0 });

    // Intensitetsfördelning
    const intensityDistribution = Array.from({length: 5}, (_, i) => {
      const level = i + 1;
      const count = filteredLogs.filter(log => log.intensity === level).length;
      return { level, count, percentage: (count / totalSessions) * 100 };
    });

    // Streak-beräkning (senaste dagarna i rad)
    const sortedLogs = [...filteredLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let currentStreak = 0;
    let lastDate = new Date();
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      const diffDays = Math.floor((lastDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        currentStreak++;
        lastDate = logDate;
      } else {
        break;
      }
    }

    return {
      totalSessions,
      totalMinutes,
      averageDuration,
      averageIntensity: Math.round(averageIntensity * 10) / 10,
      averageFeeling: Math.round(averageFeeling * 10) / 10,
      topSkills,
      totalStats,
      intensityDistribution,
      currentStreak
    };
  }, [logs, timeframe]);

  if (!stats) {
    return (
      <div className={styles["ingen-data-kort"]}>
        <div className={styles["ingen-data-ikon"]}>📊</div>
        <h3 className={styles["ingen-data-titel"]}>Ingen träningsdata</h3>
        <p className={styles["ingen-data-text"]}>Lägg till träningsloggar för att se statistik</p>
      </div>
    );
  }

  const timeframeLabels = {
    week: "Denna vecka",
    month: "Denna månad", 
    season: "Denna säsong",
    all: "Totalt"
  };

  const intensityLabels = ["Lätt", "Låg", "Medel", "Hög", "Max"];
  // intensityColors borttagen, hanteras via CSS-klasser

  return (
    <div className={styles["statistik-kort"]}>
      <h3 className={styles["statistik-titel"]}>
        📊 Träningsstatistik - {timeframeLabels[timeframe]}
      </h3>

      {/* Grundläggande statistik */}
      <div className={styles["statistik-grid"]}>
        <div className={styles["statistik-sektion"]}>
          <div className={`${styles["statistik-varde"]} ${styles["statistik-varde-traningar"]}`}>{stats.totalSessions}</div>
          <div className={styles["statistik-label"]}>🏃‍♂️ Träningar</div>
        </div>
        <div className={styles["statistik-sektion"]}>
          <div className={`${styles["statistik-varde"]} ${styles["statistik-varde-tid"]}`}>{Math.round(stats.totalMinutes / 60)}h</div>
          <div className={styles["statistik-label"]}>⏱️ Total tid</div>
        </div>
        <div className={styles["statistik-sektion"]}>
          <div className={`${styles["statistik-varde"]} ${styles["statistik-varde-snitt"]}`}>{stats.averageDuration}m</div>
          <div className={styles["statistik-label"]}>📊 Snitt/träning</div>
        </div>
        <div className={styles["statistik-sektion"]}>
          <div className={`${styles["statistik-varde"]} ${styles["statistik-varde-streak"]}`}>{stats.currentStreak}</div>
          <div className={styles["statistik-label"]}>🔥 Dagars streak</div>
        </div>
      </div>

      {/* Intensitet och känsla */}
      <div className={styles["intensitet-kansla-grid"]}>
        <div>
          <h4 className={styles["intensitet-titel"]}>⚡ Genomsnittlig intensitet</h4>
          <div className={styles["intensitet-kort"]}>
            <div className={`${styles["intensitet-varde"]} ${styles[`intensity-level-${Math.round(stats.averageIntensity)}`]}`}>{stats.averageIntensity}</div>
            <div className={styles["intensitet-label"]}>{intensityLabels[Math.round(stats.averageIntensity) - 1]}</div>
          </div>
        </div>
        <div>
          <h4 className={styles["kansla-titel"]}>😊 Genomsnittlig känsla</h4>
          <div className={styles["kansla-kort"]}>
            <div className={styles["kansla-ikon"]}>
              {stats.averageFeeling >= 4.5 ? "🤩" : 
               stats.averageFeeling >= 3.5 ? "😊" :
               stats.averageFeeling >= 2.5 ? "😐" : 
               stats.averageFeeling >= 1.5 ? "😕" : "😰"}
            </div>
            <div className={styles["kansla-varde"]}>{stats.averageFeeling}/5</div>
          </div>
        </div>
      </div>

      {/* Mest tränade färdigheter */}
      {stats.topSkills.length > 0 && (
        <div className={styles["fardigheter-sektion"]}>
          <h4 className={styles["fardigheter-titel"]}>🎯 Mest tränade färdigheter</h4>
          <div className={styles["fardigheter-lista"]}>
            {stats.topSkills.map(([skill, count], index) => (
              <div
                key={skill}
                className={`${styles["fardighet-kort"]}${index === 0 ? " " + styles["fardighet-topp"] : ""}`}
              >
                <span className={`${styles["fardighet-namn"]}${index === 0 ? " " + styles["fardighet-namn-topp"] : ""}`}>{skill}</span>
                <span className={`${styles["fardighet-count"]}${index === 0 ? " " + styles["fardighet-count-topp"] : ""}`}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prestation */}
      {(stats.totalStats.goals > 0 || stats.totalStats.assists > 0 || stats.totalStats.shots > 0) && (
        <div className={styles["prestation-sektion"]}>
          <h4 className={styles["prestation-titel"]}>🏆 Prestation</h4>
          <div className={styles["prestation-grid"]}>
            {stats.totalStats.goals > 0 && (
              <div className={`${styles["prestation-kort"]} ${styles["prestation-mal"]}`}>
                <div className={`${styles["prestation-varde"]} ${styles["prestation-varde-mal"]}`}>{stats.totalStats.goals}</div>
                <div className={styles["prestation-label"]}>⚽ Mål</div>
              </div>
            )}
            {stats.totalStats.assists > 0 && (
              <div className={`${styles["prestation-kort"]} ${styles["prestation-assist"]}`}>
                <div className={`${styles["prestation-varde"]} ${styles["prestation-varde-assist"]}`}>{stats.totalStats.assists}</div>
                <div className={styles["prestation-label"]}>🎯 Assist</div>
              </div>
            )}
            {stats.totalStats.shots > 0 && (
              <div className={`${styles["prestation-kort"]} ${styles["prestation-skott"]}`}>
                <div className={`${styles["prestation-varde"]} ${styles["prestation-varde-skott"]}`}>{stats.totalStats.shots}</div>
                <div className={styles["prestation-label"]}>🏒 Skott</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
