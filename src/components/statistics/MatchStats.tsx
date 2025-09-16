import React, { useState } from "react";
import { StatisticEvent } from "../../types/statistics";

interface Props {
  events: StatisticEvent[];
  players: Array<{
    id: string;
    name: string;
    jerseyNumber: number;
    position: string;
    isGoalkeeper: boolean;
  }>;
  onVideoLink?: (eventId: string, videoUrl: string, timestamp: string) => void;
}

interface PlayerStats {
  userId: string;
  name: string;
  jerseyNumber: number;
  position: string;
  goals: number;
  assists: number;
  gamesPlayed: number;
  penalties: number;
  blocks: number;
  shots: number;
  saves: number;
  shotPercentage: number;
  timeOnIce: number;
  plusMinus: number;
  savePercentage?: number;
}

const MatchStats: React.FC<Props> = ({ events, players, onVideoLink }) => {
  const [selectedTab, setSelectedTab] = useState<"overview" | "players" | "events" | "formations">("overview");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [videoLinkModal, setVideoLinkModal] = useState<{ eventId: string; isOpen: boolean }>({ eventId: "", isOpen: false });
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTimestamp, setVideoTimestamp] = useState("");

  // Beräkna spelarstatistik
  const calculatePlayerStats = (): PlayerStats[] => {
    return players.map(player => {
      const playerEvents = events.filter(e => e.userId === player.id);
      const goals = playerEvents.filter(e => e.type === "mål").length;
      const assists = playerEvents.filter(e => e.type === "assist").length;
      const shots = playerEvents.filter(e => e.type === "skott").length;
      const saves = playerEvents.filter(e => e.type === "räddning").length;
      const blocks = playerEvents.filter(e => e.type === "block").length;
      const penalties = playerEvents.filter(e => e.type === "utvisning").length;

      // Beräkna +/-
      const goalsFor = events.filter(e => 
        e.type === "mål" && e.onIce?.includes(player.id)
      ).length;
      const goalsAgainst = events.filter(e => 
        e.type === "mål" && !e.onIce?.includes(player.id) && e.onIce && e.onIce.length > 0
      ).length;

      return {
        userId: player.id,
        name: player.name,
        jerseyNumber: player.jerseyNumber,
        position: player.position,
        goals,
        assists,
        gamesPlayed: 1, // Detta är en match
        penalties,
        blocks,
        shots: shots + goals, // Skott inkluderar mål
        saves,
        shotPercentage: (shots + goals) > 0 ? (goals / (shots + goals)) * 100 : 0,
        savePercentage: player.isGoalkeeper && saves > 0 ? (saves / (saves + goalsAgainst)) * 100 : 0,
        timeOnIce: 0, // Skulle beräknas från faktisk speltid
        plusMinus: goalsFor - goalsAgainst
      };
    });
  };

  const playerStats = calculatePlayerStats();

  // Beräkna lagstatistik
  const teamStats = {
    goals: events.filter(e => e.type === "mål").length,
    shots: events.filter(e => e.type === "skott" || e.type === "mål").length,
    penalties: events.filter(e => e.type === "utvisning").length,
    blocks: events.filter(e => e.type === "block").length,
    saves: events.filter(e => e.type === "räddning").length
  };

  // Gruppera händelser per spelläge
  const formationStats = {
    "5v5": events.filter(e => e.onIce?.length === 10).length,
    "powerplay": events.filter(e => e.onIce?.length === 11).length,
    "penalty": events.filter(e => e.onIce?.length === 9).length
  };

  const handleVideoLink = () => {
    if (videoUrl && videoTimestamp && onVideoLink) {
      onVideoLink(videoLinkModal.eventId, videoUrl, videoTimestamp);
      setVideoLinkModal({ eventId: "", isOpen: false });
      setVideoUrl("");
      setVideoTimestamp("");
    }
  };

  const tabs = [
    { id: "overview", name: "Översikt", icon: "📊" },
    { id: "players", name: "Spelare", icon: "👥" },
    { id: "events", name: "Händelser", icon: "📋" },
    { id: "formations", name: "Formationer", icon: "⚡" }
  ];

  return (
    <div style={{ 
      background: "#1a202c", 
      padding: "20px", 
      borderRadius: "12px",
      color: "#fff"
    }}>
      <h3 style={{ marginBottom: "20px" }}>📈 Matchstatistik</h3>

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

      {/* Översikt */}
      {selectedTab === "overview" && (
        <div>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "16px",
            marginBottom: "20px"
          }}>
            <div style={{ 
              background: "#2d3748", 
              padding: "16px", 
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>
                {teamStats.goals}
              </div>
              <div>Mål</div>
            </div>
            <div style={{ 
              background: "#2d3748", 
              padding: "16px", 
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}>
                {teamStats.shots}
              </div>
              <div>Skott</div>
            </div>
            <div style={{ 
              background: "#2d3748", 
              padding: "16px", 
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ef4444" }}>
                {teamStats.penalties}
              </div>
              <div>Utvisningar</div>
            </div>
            <div style={{ 
              background: "#2d3748", 
              padding: "16px", 
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#8b5cf6" }}>
                {teamStats.saves}
              </div>
              <div>Räddningar</div>
            </div>
          </div>

          <div style={{ 
            background: "#2d3748", 
            padding: "16px", 
            borderRadius: "8px"
          }}>
            <h4 style={{ marginBottom: "10px" }}>🏆 Toppscorare denna match:</h4>
            {playerStats
              .filter(p => p.goals + p.assists > 0)
              .sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists))
              .slice(0, 3)
              .map((player, index) => (
                <div 
                  key={player.userId}
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    padding: "8px",
                    background: index === 0 ? "#3b82f6" : "#4a5568",
                    borderRadius: "6px",
                    marginBottom: "4px"
                  }}
                >
                  <span>#{player.jerseyNumber} {player.name}</span>
                  <span>{player.goals}+{player.assists} = {player.goals + player.assists}p</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Spelare */}
      {selectedTab === "players" && (
        <div>
          <div style={{ 
            background: "#2d3748", 
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <div style={{ 
              overflowX: "auto"
            }}>
              <table style={{ 
                width: "100%", 
                borderCollapse: "collapse",
                fontSize: "14px"
              }}>
                <thead>
                  <tr style={{ background: "#1a202c" }}>
                    <th style={{ padding: "12px 8px", textAlign: "left" }}>#</th>
                    <th style={{ padding: "12px 8px", textAlign: "left" }}>Spelare</th>
                    <th style={{ padding: "12px 8px", textAlign: "center" }}>Mål</th>
                    <th style={{ padding: "12px 8px", textAlign: "center" }}>Assist</th>
                    <th style={{ padding: "12px 8px", textAlign: "center" }}>Poäng</th>
                    <th style={{ padding: "12px 8px", textAlign: "center" }}>Skott</th>
                    <th style={{ padding: "12px 8px", textAlign: "center" }}>Skott%</th>
                    <th style={{ padding: "12px 8px", textAlign: "center" }}>+/-</th>
                    <th style={{ padding: "12px 8px", textAlign: "center" }}>Block</th>
                    <th style={{ padding: "12px 8px", textAlign: "center" }}>Utv</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats
                    .sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists))
                    .map(player => (
                      <tr 
                        key={player.userId}
                        style={{ 
                          borderBottom: "1px solid #4a5568",
                          cursor: "pointer"
                        }}
                        onClick={() => setSelectedPlayer(selectedPlayer === player.userId ? null : player.userId)}
                      >
                        <td style={{ padding: "8px" }}>{player.jerseyNumber}</td>
                        <td style={{ padding: "8px" }}>
                          <div>
                            <div style={{ fontWeight: "600" }}>{player.name}</div>
                            <div style={{ fontSize: "12px", color: "#a0aec0" }}>{player.position}</div>
                          </div>
                        </td>
                        <td style={{ padding: "8px", textAlign: "center", color: "#10b981", fontWeight: "600" }}>
                          {player.goals}
                        </td>
                        <td style={{ padding: "8px", textAlign: "center", color: "#3b82f6", fontWeight: "600" }}>
                          {player.assists}
                        </td>
                        <td style={{ padding: "8px", textAlign: "center", fontWeight: "600" }}>
                          {player.goals + player.assists}
                        </td>
                        <td style={{ padding: "8px", textAlign: "center" }}>{player.shots}</td>
                        <td style={{ padding: "8px", textAlign: "center" }}>
                          {player.shotPercentage.toFixed(1)}%
                        </td>
                        <td style={{ 
                          padding: "8px", 
                          textAlign: "center",
                          color: player.plusMinus > 0 ? "#10b981" : player.plusMinus < 0 ? "#ef4444" : "#a0aec0"
                        }}>
                          {player.plusMinus > 0 ? "+" : ""}{player.plusMinus}
                        </td>
                        <td style={{ padding: "8px", textAlign: "center" }}>{player.blocks}</td>
                        <td style={{ padding: "8px", textAlign: "center", color: "#ef4444" }}>
                          {player.penalties}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Målvaktsstatistik */}
          {playerStats.some(p => p.saves && p.saves > 0) && (
            <div style={{ 
              marginTop: "20px",
              background: "#2d3748", 
              padding: "16px", 
              borderRadius: "8px"
            }}>
              <h4 style={{ marginBottom: "10px" }}>🥅 Målvaktsstatistik:</h4>
              {playerStats
                .filter(p => p.saves && p.saves > 0)
                .map(goalie => (
                  <div 
                    key={goalie.userId}
                    style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      padding: "8px",
                      background: "#1a202c",
                      borderRadius: "6px",
                      marginBottom: "8px"
                    }}
                  >
                    <span>#{goalie.jerseyNumber} {goalie.name}</span>
                    <span>
                      {goalie.saves} räddningar ({goalie.savePercentage?.toFixed(1)}%)
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Händelser */}
      {selectedTab === "events" && (
        <div>
          <div style={{ 
            background: "#2d3748", 
            borderRadius: "8px",
            padding: "16px"
          }}>
            <h4 style={{ marginBottom: "10px" }}>⏱️ Händelseförloppning:</h4>
            <div style={{ 
              maxHeight: "400px", 
              overflowY: "auto"
            }}>
              {events.length === 0 ? (
                <p style={{ color: "#a0aec0", textAlign: "center" }}>
                  Inga händelser registrerade
                </p>
              ) : (
                events.map(event => {
                  const player = players.find(p => p.id === event.userId);
                  return (
                    <div
                      key={event.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px",
                        margin: "8px 0",
                        background: "#1a202c",
                        borderRadius: "6px",
                        border: event.videoTimestamp ? "1px solid #10b981" : "none"
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ 
                            fontWeight: "bold", 
                            background: "#4a5568", 
                            padding: "2px 6px", 
                            borderRadius: "4px",
                            fontSize: "12px"
                          }}>
                            {event.time}
                          </span>
                          <span style={{ fontWeight: "600" }}>{event.type}</span>
                          <span>#{player?.jerseyNumber} {player?.name}</span>
                          {event.videoTimestamp && (
                            <span style={{ 
                              background: "#10b981", 
                              color: "#fff", 
                              padding: "2px 6px", 
                              borderRadius: "4px",
                              fontSize: "10px"
                            }}>
                              📹 VIDEO
                            </span>
                          )}
                        </div>
                        {event.comment && (
                          <div style={{ 
                            fontSize: "12px", 
                            color: "#a0aec0", 
                            marginTop: "4px",
                            fontStyle: "italic"
                          }}>
                            "{event.comment}"
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: "flex", gap: "8px" }}>
                        {!event.videoTimestamp && onVideoLink && (
                          <button
                            onClick={() => setVideoLinkModal({ eventId: event.id, isOpen: true })}
                            style={{
                              background: "#3b82f6",
                              border: "none",
                              borderRadius: "4px",
                              color: "#fff",
                              cursor: "pointer",
                              padding: "4px 8px",
                              fontSize: "12px"
                            }}
                          >
                            📹 Länka video
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Formationer */}
      {selectedTab === "formations" && (
        <div>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "20px"
          }}>
            <div style={{ 
              background: "#2d3748", 
              padding: "16px", 
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}>
                {formationStats["5v5"]}
              </div>
              <div>5v5 händelser</div>
            </div>
            <div style={{ 
              background: "#2d3748", 
              padding: "16px", 
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>
                {formationStats.powerplay}
              </div>
              <div>Powerplay händelser</div>
            </div>
            <div style={{ 
              background: "#2d3748", 
              padding: "16px", 
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ef4444" }}>
                {formationStats.penalty}
              </div>
              <div>Boxplay händelser</div>
            </div>
          </div>

          <div style={{ 
            background: "#2d3748", 
            padding: "16px", 
            borderRadius: "8px"
          }}>
            <h4 style={{ marginBottom: "10px" }}>⚡ Specialteams-effektivitet:</h4>
            <div style={{ display: "grid", gap: "8px" }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                padding: "8px",
                background: "#1a202c",
                borderRadius: "6px"
              }}>
                <span>Powerplay-mål</span>
                <span style={{ color: "#10b981", fontWeight: "600" }}>
                  {events.filter(e => e.type === "mål" && e.onIce && e.onIce.length > 10).length}
                </span>
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                padding: "8px",
                background: "#1a202c",
                borderRadius: "6px"
              }}>
                <span>Boxplay-mål emot</span>
                <span style={{ color: "#ef4444", fontWeight: "600" }}>
                  {events.filter(e => e.type === "mål" && e.onIce && e.onIce.length < 10).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Link Modal */}
      {videoLinkModal.isOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#1a202c",
            padding: "24px",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "500px"
          }}>
            <h3 style={{ marginBottom: "16px" }}>📹 Länka videoklipp</h3>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>Video URL:</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://..."
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "#2d3748",
                  border: "1px solid #4a5568",
                  borderRadius: "6px",
                  color: "#fff"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>Tidsstämpel (mm:ss):</label>
              <input
                type="text"
                value={videoTimestamp}
                onChange={(e) => setVideoTimestamp(e.target.value)}
                placeholder="12:34"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "#2d3748",
                  border: "1px solid #4a5568",
                  borderRadius: "6px",
                  color: "#fff"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setVideoLinkModal({ eventId: "", isOpen: false })}
                style={{
                  padding: "8px 16px",
                  background: "#6b7280",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                Avbryt
              </button>
              <button
                onClick={handleVideoLink}
                disabled={!videoUrl || !videoTimestamp}
                style={{
                  padding: "8px 16px",
                  background: !videoUrl || !videoTimestamp ? "#4a5568" : "#10b981",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  cursor: !videoUrl || !videoTimestamp ? "not-allowed" : "pointer"
                }}
              >
                Länka
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchStats;
