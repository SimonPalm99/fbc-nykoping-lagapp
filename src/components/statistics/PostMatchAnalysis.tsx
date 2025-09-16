import React, { useState } from "react";
import { StatisticEvent } from "../../types/statistics";
import MatchStats from "./MatchStats";

interface Props {
  matchId: string;
  matchTitle: string;
  matchDate: string;
  opponent: string;
  finalScore: { home: number; away: number };
  events: StatisticEvent[];
  players: Array<{
    id: string;
    name: string;
    jerseyNumber: number;
    position: string;
    isGoalkeeper: boolean;
  }>;
  onExportReport?: (matchId: string) => void;
}

const PostMatchAnalysis: React.FC<Props> = ({
  matchId,
  matchTitle,
  matchDate,
  opponent,
  finalScore,
  events,
  players,
  onExportReport
}) => {
  const [selectedTab, setSelectedTab] = useState<"summary" | "detailed" | "video">("summary");

  // Beräkna matchsammanfattning
  const matchSummary = {
    duration: "60:00", // Detta skulle komma från faktiska data
    goals: events.filter(e => e.type === "mål").length,
    shots: events.filter(e => e.type === "skott" || e.type === "mål").length,
    saves: events.filter(e => e.type === "räddning").length,
    penalties: events.filter(e => e.type === "utvisning").length,
    powerplayGoals: events.filter(e => e.type === "mål" && e.onIce && e.onIce.length > 10).length,
    powerplayChances: events.filter(e => e.type === "utvisning").length,
    mvp: events.length > 0 ? getMatchMVP() : null
  };

  function getMatchMVP() {
    const playerStats = players.map(player => {
      const playerEvents = events.filter(e => e.userId === player.id);
      const goals = playerEvents.filter(e => e.type === "mål").length;
      const assists = playerEvents.filter(e => e.type === "assist").length;
      const points = goals + assists;
      
      return {
        ...player,
        points,
        goals,
        assists
      };
    });

    return playerStats.reduce((prev, current) => 
      (prev.points > current.points) ? prev : current
    );
  }

  const videoEvents = events.filter(e => e.videoTimestamp);

  const tabs = [
    { id: "summary", name: "Sammanfattning", icon: "📊" },
    { id: "detailed", name: "Detaljerat", icon: "📋" },
    { id: "video", name: `Video (${videoEvents.length})`, icon: "🎥" }
  ];

  return (
    <div style={{ 
      background: "#1a202c", 
      padding: "20px", 
      borderRadius: "12px",
      color: "#fff"
    }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem", fontWeight: "700" }}>
            {matchTitle}
          </h2>
          <div style={{ color: "#a0aec0", fontSize: "14px" }}>
            {new Date(matchDate).toLocaleDateString("sv-SE")} vs {opponent}
          </div>
          <div style={{ 
            fontSize: "24px", 
            fontWeight: "bold", 
            marginTop: "8px",
            color: finalScore.home > finalScore.away ? "#10b981" : 
                  finalScore.home < finalScore.away ? "#ef4444" : "#f59e0b"
          }}>
            {finalScore.home} - {finalScore.away}
            <span style={{ 
              fontSize: "14px", 
              marginLeft: "8px",
              color: "#a0aec0",
              fontWeight: "normal"
            }}>
              {finalScore.home > finalScore.away ? "(Vinst)" : 
               finalScore.home < finalScore.away ? "(Förlust)" : "(Oavgjort)"}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {onExportReport && (
            <button
              onClick={() => onExportReport(matchId)}
              style={{
                padding: "8px 16px",
                background: "#3b82f6",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              📄 Exportera rapport
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: "flex", 
        gap: "8px", 
        marginBottom: "20px",
        borderBottom: "1px solid #4a5568",
        paddingBottom: "10px"
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            style={{
              padding: "8px 16px",
              background: selectedTab === tab.id ? "#3b82f6" : "#4a5568",
              border: "none",
              borderRadius: "6px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: selectedTab === tab.id ? "600" : "normal"
            }}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Sammanfattning */}
      {selectedTab === "summary" && (
        <div>
          {/* Snabbstatistik */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "16px",
            marginBottom: "24px"
          }}>
            <div style={{ 
              background: "#2d3748", 
              padding: "16px", 
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>
                {matchSummary.goals}
              </div>
              <div style={{ fontSize: "12px", color: "#a0aec0" }}>Mål</div>
            </div>
            <div style={{ 
              background: "#2d3748", 
              padding: "16px", 
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#3b82f6" }}>
                {matchSummary.shots}
              </div>
              <div style={{ fontSize: "12px", color: "#a0aec0" }}>Skott</div>
            </div>
            <div style={{ 
              background: "#2d3748", 
              padding: "16px", 
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#8b5cf6" }}>
                {matchSummary.saves}
              </div>
              <div style={{ fontSize: "12px", color: "#a0aec0" }}>Räddningar</div>
            </div>
            <div style={{ 
              background: "#2d3748", 
              padding: "16px", 
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ef4444" }}>
                {matchSummary.penalties}
              </div>
              <div style={{ fontSize: "12px", color: "#a0aec0" }}>Utvisningar</div>
            </div>
          </div>

          {/* MVP och Nyckelspelare */}
          {matchSummary.mvp && (
            <div style={{ 
              background: "#2d3748", 
              padding: "20px", 
              borderRadius: "8px",
              marginBottom: "20px"
            }}>
              <h3 style={{ margin: "0 0 16px 0", color: "#f59e0b" }}>
                🏆 Match MVP
              </h3>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "16px",
                padding: "16px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                borderRadius: "8px"
              }}>
                <div style={{ 
                  width: "60px", 
                  height: "60px", 
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#d97706"
                }}>
                  #{matchSummary.mvp.jerseyNumber}
                </div>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: "#fff" }}>
                    {matchSummary.mvp.name}
                  </div>
                  <div style={{ color: "#fef3c7", fontSize: "14px" }}>
                    {matchSummary.mvp.position}
                  </div>
                  <div style={{ color: "#fff", fontWeight: "600", marginTop: "4px" }}>
                    {matchSummary.mvp.goals} mål, {matchSummary.mvp.assists} assist = {matchSummary.mvp.points} poäng
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Specialteams */}
          <div style={{ 
            background: "#2d3748", 
            padding: "20px", 
            borderRadius: "8px",
            marginBottom: "20px"
          }}>
            <h3 style={{ margin: "0 0 16px 0" }}>⚡ Specialteams</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  padding: "8px",
                  background: "#1a202c",
                  borderRadius: "6px"
                }}>
                  <span>Powerplay-mål</span>
                  <span style={{ color: "#10b981", fontWeight: "600" }}>
                    {matchSummary.powerplayGoals}
                  </span>
                </div>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  padding: "8px",
                  background: "#1a202c",
                  borderRadius: "6px",
                  marginTop: "4px"
                }}>
                  <span>Powerplay-chanser</span>
                  <span style={{ fontWeight: "600" }}>
                    {matchSummary.powerplayChances}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  padding: "8px",
                  background: "#1a202c",
                  borderRadius: "6px"
                }}>
                  <span>PP-effektivitet</span>
                  <span style={{ color: "#3b82f6", fontWeight: "600" }}>
                    {matchSummary.powerplayChances > 0 ? 
                      ((matchSummary.powerplayGoals / matchSummary.powerplayChances) * 100).toFixed(1) + "%" 
                      : "0%"
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tidslinje med viktiga händelser */}
          <div style={{ 
            background: "#2d3748", 
            padding: "20px", 
            borderRadius: "8px"
          }}>
            <h3 style={{ margin: "0 0 16px 0" }}>📅 Matchens viktiga händelser</h3>
            <div style={{ 
              maxHeight: "300px", 
              overflowY: "auto"
            }}>
              {events
                .filter(e => e.type === "mål" || e.type === "utvisning")
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(event => {
                  const player = players.find(p => p.id === event.userId);
                  return (
                    <div
                      key={event.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        margin: "8px 0",
                        background: "#1a202c",
                        borderRadius: "6px",
                        borderLeft: `4px solid ${event.type === "mål" ? "#10b981" : "#ef4444"}`
                      }}
                    >
                      <span style={{ 
                        fontWeight: "bold", 
                        background: "#4a5568", 
                        padding: "4px 8px", 
                        borderRadius: "4px",
                        fontSize: "12px",
                        minWidth: "50px",
                        textAlign: "center"
                      }}>
                        {event.time}
                      </span>
                      <span style={{ 
                        fontSize: "16px",
                        color: event.type === "mål" ? "#10b981" : "#ef4444"
                      }}>
                        {event.type === "mål" ? "⚽" : "🟨"}
                      </span>
                      <div>
                        <div style={{ fontWeight: "600" }}>
                          {event.type === "mål" ? "MÅL" : "UTVISNING"} - #{player?.jerseyNumber} {player?.name}
                        </div>
                        {event.comment && (
                          <div style={{ 
                            fontSize: "12px", 
                            color: "#a0aec0",
                            fontStyle: "italic"
                          }}>
                            {event.comment}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Detaljerad statistik */}
      {selectedTab === "detailed" && (
        <MatchStats
          events={events}
          players={players}
        />
      )}

      {/* Video-sektion */}
      {selectedTab === "video" && (
        <div>
          {videoEvents.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "40px",
              color: "#a0aec0"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎥</div>
              <h3>Inga videoklipp länkade</h3>
              <p>Länka videoklipp till händelser för att se dem här</p>
            </div>
          ) : (
            <div>
              <h3 style={{ marginBottom: "16px" }}>🎥 Länkade videoklipp ({videoEvents.length})</h3>
              <div style={{ display: "grid", gap: "16px" }}>
                {videoEvents.map(event => {
                  const player = players.find(p => p.id === event.userId);
                  return (
                    <div
                      key={event.id}
                      style={{
                        background: "#2d3748",
                        padding: "16px",
                        borderRadius: "8px",
                        border: "1px solid #10b981"
                      }}
                    >
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px"
                      }}>
                        <div>
                          <span style={{ 
                            fontWeight: "bold",
                            background: "#4a5568",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "12px"
                          }}>
                            {event.time}
                          </span>
                          <span style={{ marginLeft: "8px", fontWeight: "600" }}>
                            {event.type} - #{player?.jerseyNumber} {player?.name}
                          </span>
                        </div>
                        <span style={{ 
                          background: "#10b981",
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600"
                        }}>
                          📹 {event.videoTimestamp}
                        </span>
                      </div>
                      {event.comment && (
                        <div style={{ 
                          fontSize: "14px", 
                          color: "#a0aec0",
                          fontStyle: "italic"
                        }}>
                          "{event.comment}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostMatchAnalysis;
