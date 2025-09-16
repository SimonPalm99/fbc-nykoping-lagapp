import React, { useMemo } from "react";
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
      <div style={{
        background: "#0f0f0f",
        borderRadius: "16px",
        padding: "2rem",
        textAlign: "center",
        border: "1px solid #333"
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📊</div>
        <h3 style={{
          fontSize: "1.25rem",
          fontWeight: "600",
          color: "#e2e8f0",
          marginBottom: "0.5rem"
        }}>
          Ingen träningsdata
        </h3>
        <p style={{
          color: "#9ca3af",
          fontSize: "0.875rem"
        }}>
          Lägg till träningsloggar för att se statistik
        </p>
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
  const intensityColors = ["#10b981", "#84cc16", "#f59e0b", "#f97316", "#ef4444"];

  return (
    <div style={{
      background: "linear-gradient(135deg, #1a1a1a, #262626)",
      borderRadius: "16px",
      padding: "2rem",
      border: "1px solid #333",
      boxShadow: "0 4px 16px rgba(0,0,0,0.4)"
    }}>
      <h3 style={{
        fontSize: "1.5rem",
        fontWeight: "700",
        color: "#b8f27c",
        marginBottom: "2rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem"
      }}>
        📊 Träningsstatistik - {timeframeLabels[timeframe]}
      </h3>

      {/* Grundläggande statistik */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <div style={{
          background: "#0f0f0f",
          padding: "1.5rem",
          borderRadius: "12px",
          textAlign: "center",
          border: "1px solid #333"
        }}>
          <div style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#b8f27c",
            marginBottom: "0.5rem"
          }}>
            {stats.totalSessions}
          </div>
          <div style={{
            fontSize: "0.875rem",
            color: "#9ca3af",
            fontWeight: "600"
          }}>
            🏃‍♂️ Träningar
          </div>
        </div>

        <div style={{
          background: "#0f0f0f",
          padding: "1.5rem",
          borderRadius: "12px",
          textAlign: "center",
          border: "1px solid #333"
        }}>
          <div style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#22c55e",
            marginBottom: "0.5rem"
          }}>
            {Math.round(stats.totalMinutes / 60)}h
          </div>
          <div style={{
            fontSize: "0.875rem",
            color: "#9ca3af",
            fontWeight: "600"
          }}>
            ⏱️ Total tid
          </div>
        </div>

        <div style={{
          background: "#0f0f0f",
          padding: "1.5rem",
          borderRadius: "12px",
          textAlign: "center",
          border: "1px solid #333"
        }}>
          <div style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#f59e0b",
            marginBottom: "0.5rem"
          }}>
            {stats.averageDuration}m
          </div>
          <div style={{
            fontSize: "0.875rem",
            color: "#9ca3af",
            fontWeight: "600"
          }}>
            📊 Snitt/träning
          </div>
        </div>

        <div style={{
          background: "#0f0f0f",
          padding: "1.5rem",
          borderRadius: "12px",
          textAlign: "center",
          border: "1px solid #333"
        }}>
          <div style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#8b5cf6",
            marginBottom: "0.5rem"
          }}>
            {stats.currentStreak}
          </div>
          <div style={{
            fontSize: "0.875rem",
            color: "#9ca3af",
            fontWeight: "600"
          }}>
            🔥 Dagars streak
          </div>
        </div>
      </div>

      {/* Intensitet och känsla */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "2rem",
        marginBottom: "2rem"
      }}>
        <div>
          <h4 style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            color: "#e2e8f0",
            marginBottom: "1rem"
          }}>
            ⚡ Genomsnittlig intensitet
          </h4>
          <div style={{
            background: "#0f0f0f",
            padding: "1.5rem",
            borderRadius: "12px",
            textAlign: "center",
            border: "1px solid #333"
          }}>
            <div style={{
              fontSize: "3rem",
              fontWeight: "700",
              color: intensityColors[Math.round(stats.averageIntensity) - 1],
              marginBottom: "0.5rem"
            }}>
              {stats.averageIntensity}
            </div>
            <div style={{
              fontSize: "0.875rem",
              color: "#9ca3af"
            }}>
              {intensityLabels[Math.round(stats.averageIntensity) - 1]}
            </div>
          </div>
        </div>

        <div>
          <h4 style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            color: "#e2e8f0",
            marginBottom: "1rem"
          }}>
            😊 Genomsnittlig känsla
          </h4>
          <div style={{
            background: "#0f0f0f",
            padding: "1.5rem",
            borderRadius: "12px",
            textAlign: "center",
            border: "1px solid #333"
          }}>
            <div style={{
              fontSize: "3rem",
              marginBottom: "0.5rem"
            }}>
              {stats.averageFeeling >= 4.5 ? "🤩" : 
               stats.averageFeeling >= 3.5 ? "😊" :
               stats.averageFeeling >= 2.5 ? "😐" : 
               stats.averageFeeling >= 1.5 ? "😕" : "😰"}
            </div>
            <div style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              color: "#b8f27c"
            }}>
              {stats.averageFeeling}/5
            </div>
          </div>
        </div>
      </div>

      {/* Mest tränade färdigheter */}
      {stats.topSkills.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <h4 style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            color: "#e2e8f0",
            marginBottom: "1rem"
          }}>
            🎯 Mest tränade färdigheter
          </h4>
          <div style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap"
          }}>
            {stats.topSkills.map(([skill, count], index) => (
              <div
                key={skill}
                style={{
                  background: index === 0 ? "#b8f27c20" : "#0f0f0f",
                  border: index === 0 ? "1px solid #b8f27c" : "1px solid #333",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <span style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: index === 0 ? "#b8f27c" : "#e2e8f0"
                }}>
                  {skill}
                </span>
                <span style={{
                  background: index === 0 ? "#b8f27c" : "#374151",
                  color: index === 0 ? "#000" : "#e2e8f0",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: "600"
                }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prestation */}
      {(stats.totalStats.goals > 0 || stats.totalStats.assists > 0 || stats.totalStats.shots > 0) && (
        <div>
          <h4 style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            color: "#e2e8f0",
            marginBottom: "1rem"
          }}>
            🏆 Prestation
          </h4>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "1rem"
          }}>
            {stats.totalStats.goals > 0 && (
              <div style={{
                background: "#0f0f0f",
                padding: "1rem",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #333"
              }}>
                <div style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#22c55e",
                  marginBottom: "0.25rem"
                }}>
                  {stats.totalStats.goals}
                </div>
                <div style={{
                  fontSize: "0.75rem",
                  color: "#9ca3af"
                }}>
                  ⚽ Mål
                </div>
              </div>
            )}
            {stats.totalStats.assists > 0 && (
              <div style={{
                background: "#0f0f0f",
                padding: "1rem",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #333"
              }}>
                <div style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#f59e0b",
                  marginBottom: "0.25rem"
                }}>
                  {stats.totalStats.assists}
                </div>
                <div style={{
                  fontSize: "0.75rem",
                  color: "#9ca3af"
                }}>
                  🎯 Assist
                </div>
              </div>
            )}
            {stats.totalStats.shots > 0 && (
              <div style={{
                background: "#0f0f0f",
                padding: "1rem",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #333"
              }}>
                <div style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#8b5cf6",
                  marginBottom: "0.25rem"
                }}>
                  {stats.totalStats.shots}
                </div>
                <div style={{
                  fontSize: "0.75rem",
                  color: "#9ca3af"
                }}>
                  🏒 Skott
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
