import React, { useState, useEffect } from 'react';

interface PlayerComparison {
  playerId: string;
  name: string;
  currentSeason: any;
  lastSeason: any;
  improvement: {
    goals: number;
    assists: number;
    points: number;
    consistency: number;
  };
  ranking: {
    current: number;
    previous: number;
    change: number;
  };
}

interface TeamComparison {
  category: string;
  current: number;
  previous: number;
  improvement: number;
  bestInHistory: number;
  isRecord: boolean;
}

interface OpponentComparison {
  opponent: string;
  totalMeetings: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  lastMeeting: {
    date: string;
    result: string;
    score: string;
  };
  recentForm: string[]; // ['W', 'L', 'W', 'D', 'W']
}

const AdvancedComparisons: React.FC = () => {
  
  const [selectedTab, setSelectedTab] = useState<'players' | 'team' | 'opponents' | 'timeline'>('players');
  const [playerComparisons, setPlayerComparisons] = useState<PlayerComparison[]>([]);
  const [teamComparisons, setTeamComparisons] = useState<TeamComparison[]>([]);
  const [opponentComparisons, setOpponentComparisons] = useState<OpponentComparison[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  useEffect(() => {
    // Mock data för spelarjämförelser
    setPlayerComparisons([
      {
        playerId: "1",
        name: "Simon Andersson",
        currentSeason: { goals: 12, assists: 8, points: 20, games: 18 },
        lastSeason: { goals: 8, assists: 6, points: 14, games: 20 },
        improvement: { goals: 50, assists: 33, points: 43, consistency: 15 },
        ranking: { current: 4, previous: 6, change: 2 }
      },
      {
        playerId: "2", 
        name: "Anna Svensson",
        currentSeason: { goals: 15, assists: 12, points: 27, games: 19 },
        lastSeason: { goals: 12, assists: 8, points: 20, games: 18 },
        improvement: { goals: 25, assists: 50, points: 35, consistency: 20 },
        ranking: { current: 1, previous: 2, change: 1 }
      },
      {
        playerId: "3",
        name: "Erik Nilsson", 
        currentSeason: { goals: 3, assists: 15, points: 18, games: 17 },
        lastSeason: { goals: 5, assists: 10, points: 15, games: 19 },
        improvement: { goals: -40, assists: 50, points: 20, consistency: 10 },
        ranking: { current: 5, previous: 4, change: -1 }
      },
      {
        playerId: "4",
        name: "Lisa Johansson",
        currentSeason: { goals: 9, assists: 7, points: 16, games: 16 },
        lastSeason: { goals: 6, assists: 4, points: 10, games: 15 },
        improvement: { goals: 50, assists: 75, points: 60, consistency: 25 },
        ranking: { current: 6, previous: 8, change: 2 }
      }
    ]);

    // Mock data för lagjämförelser
    setTeamComparisons([
      {
        category: "Mål per match",
        current: 3.72,
        previous: 3.15,
        improvement: 18.1,
        bestInHistory: 4.2,
        isRecord: false
      },
      {
        category: "Insläppta mål per match", 
        current: 2.25,
        previous: 2.8,
        improvement: -19.6,
        bestInHistory: 1.8,
        isRecord: false
      },
      {
        category: "Powerplay %",
        current: 22.5,
        previous: 18.3,
        improvement: 23.0,
        bestInHistory: 25.1,
        isRecord: false
      },
      {
        category: "Vinstprocent",
        current: 60.0,
        previous: 45.0,
        improvement: 33.3,
        bestInHistory: 65.2,
        isRecord: false
      },
      {
        category: "Skott per match",
        current: 28.4,
        previous: 25.1,
        improvement: 13.1,
        bestInHistory: 32.1,
        isRecord: false
      }
    ]);

    // Mock data för motståndarjämförelser
    setOpponentComparisons([
      {
        opponent: "Västerås IBK",
        totalMeetings: 12,
        wins: 8,
        losses: 3,
        draws: 1,
        winRate: 66.7,
        lastMeeting: {
          date: "2025-06-20",
          result: "W",
          score: "4-2"
        },
        recentForm: ['W', 'W', 'L', 'W', 'D']
      },
      {
        opponent: "Stockholm IBF",
        totalMeetings: 15,
        wins: 6,
        losses: 8,
        draws: 1,
        winRate: 40.0,
        lastMeeting: {
          date: "2025-06-15",
          result: "L",
          score: "1-3"
        },
        recentForm: ['L', 'W', 'L', 'L', 'W']
      },
      {
        opponent: "AIK Innebandyförening",
        totalMeetings: 8,
        wins: 5,
        losses: 2,
        draws: 1,
        winRate: 62.5,
        lastMeeting: {
          date: "2025-05-28",
          result: "W",
          score: "3-1"
        },
        recentForm: ['W', 'L', 'W', 'W', 'D']
      }
    ]);
  }, []);

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId].slice(0, 3) // Max 3 spelare
    );
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 20) return "#10b981";
    if (improvement > 0) return "#f59e0b";
    if (improvement > -20) return "#ef4444";
    return "#dc2626";
  };

  const getFormIcon = (result: string) => {
    switch (result) {
      case 'W': return '🟢';
      case 'L': return '🔴';
      case 'D': return '🟡';
      default: return '⚪';
    }
  };

  const tabs = [
    { id: 'players', name: 'Spelarjämförelse', icon: '👥' },
    { id: 'team', name: 'Lagjämförelse', icon: '🏆' },
    { id: 'opponents', name: 'Motståndare', icon: '⚔️' },
    { id: 'timeline', name: 'Tidslinje', icon: '📅' }
  ];

  return (
    <div style={{
      background: "#1a202c",
      padding: "20px",
      borderRadius: "12px",
      color: "#fff"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>
          📊 Avancerade Jämförelser
        </h2>
        <p style={{ margin: "4px 0 0 0", color: "#a0aec0" }}>
          Jämför prestationer över tid och mellan spelare, lag och motståndare
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "20px",
        borderBottom: "1px solid #4a5568",
        paddingBottom: "12px"
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            style={{
              padding: "8px 16px",
              background: selectedTab === tab.id ? "#3b82f6" : "transparent",
              border: "none",
              borderRadius: "6px",
              color: selectedTab === tab.id ? "#fff" : "#a0aec0",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Players Comparison Tab */}
      {selectedTab === 'players' && (
        <div>
          <div style={{
            background: "#2d3748",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0" }}>Välj spelare att jämföra (max 3)</h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "8px"
            }}>
              {playerComparisons.map(player => (
                <button
                  key={player.playerId}
                  onClick={() => togglePlayerSelection(player.playerId)}
                  style={{
                    padding: "8px 12px",
                    background: selectedPlayers.includes(player.playerId) ? "#3b82f6" : "#1a202c",
                    border: selectedPlayers.includes(player.playerId) ? "2px solid #60a5fa" : "1px solid #4a5568",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                >
                  {player.name}
                </button>
              ))}
            </div>
          </div>

          {selectedPlayers.length > 0 && (
            <div style={{
              background: "#2d3748",
              padding: "16px",
              borderRadius: "8px"
            }}>
              <h3 style={{ margin: "0 0 16px 0" }}>📈 Jämförelse - Aktuell vs Föregående säsong</h3>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #4a5568" }}>
                      <th style={{ padding: "12px", textAlign: "left" }}>Spelare</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Mål (Δ)</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Assists (Δ)</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Poäng (Δ)</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Ranking</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Förbättring</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerComparisons
                      .filter(p => selectedPlayers.includes(p.playerId))
                      .map(player => (
                        <tr key={player.playerId} style={{ borderBottom: "1px solid #4a5568" }}>
                          <td style={{ padding: "12px", fontWeight: "600" }}>
                            {player.name}
                          </td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <div>{player.currentSeason.goals}</div>
                            <div style={{ 
                              fontSize: "12px", 
                              color: getImprovementColor(player.improvement.goals)
                            }}>
                              ({player.improvement.goals > 0 ? "+" : ""}{player.improvement.goals}%)
                            </div>
                          </td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <div>{player.currentSeason.assists}</div>
                            <div style={{ 
                              fontSize: "12px", 
                              color: getImprovementColor(player.improvement.assists)
                            }}>
                              ({player.improvement.assists > 0 ? "+" : ""}{player.improvement.assists}%)
                            </div>
                          </td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <div style={{ fontWeight: "700" }}>{player.currentSeason.points}</div>
                            <div style={{ 
                              fontSize: "12px", 
                              color: getImprovementColor(player.improvement.points)
                            }}>
                              ({player.improvement.points > 0 ? "+" : ""}{player.improvement.points}%)
                            </div>
                          </td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <div style={{ fontWeight: "600" }}>#{player.ranking.current}</div>
                            <div style={{ 
                              fontSize: "12px", 
                              color: player.ranking.change > 0 ? "#10b981" : player.ranking.change < 0 ? "#ef4444" : "#a0aec0"
                            }}>
                              {player.ranking.change > 0 ? "↗" : player.ranking.change < 0 ? "↘" : "→"} 
                              {Math.abs(player.ranking.change)}
                            </div>
                          </td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <div style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              background: getImprovementColor(player.improvement.consistency),
                              fontSize: "12px",
                              fontWeight: "600"
                            }}>
                              {player.improvement.consistency > 0 ? "+" : ""}{player.improvement.consistency}%
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Team Comparison Tab */}
      {selectedTab === 'team' && (
        <div>
          <h3 style={{ margin: "0 0 16px 0" }}>🏆 Lagets utveckling över tid</h3>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px"
          }}>
            {teamComparisons.map((comparison, index) => (
              <div 
                key={index}
                style={{
                  background: "#2d3748",
                  padding: "16px",
                  borderRadius: "8px",
                  border: comparison.isRecord ? "2px solid #f59e0b" : "1px solid #4a5568"
                }}
              >
                <h4 style={{ 
                  margin: "0 0 12px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  {comparison.category}
                  {comparison.isRecord && <span>🏆</span>}
                </h4>
                
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "12px"
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: "#3b82f6" }}>
                      {comparison.current}
                    </div>
                    <div style={{ fontSize: "12px", color: "#a0aec0" }}>Aktuell säsong</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "16px", color: "#a0aec0" }}>
                      {comparison.previous}
                    </div>
                    <div style={{ fontSize: "12px", color: "#a0aec0" }}>Förra säsongen</div>
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px",
                  background: "#1a202c",
                  borderRadius: "4px"
                }}>
                  <span style={{ fontSize: "12px" }}>Förbättring:</span>
                  <span style={{
                    fontWeight: "600",
                    color: getImprovementColor(comparison.improvement)
                  }}>
                    {comparison.improvement > 0 ? "+" : ""}{comparison.improvement.toFixed(1)}%
                  </span>
                </div>

                <div style={{
                  fontSize: "11px",
                  color: "#718096",
                  marginTop: "8px",
                  textAlign: "center"
                }}>
                  Bäst genom tiderna: {comparison.bestInHistory}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opponents Comparison Tab */}
      {selectedTab === 'opponents' && (
        <div>
          <h3 style={{ margin: "0 0 16px 0" }}>⚔️ Statistik mot motståndare</h3>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "16px"
          }}>
            {opponentComparisons.map((opponent, index) => (
              <div 
                key={index}
                style={{
                  background: "#2d3748",
                  padding: "16px",
                  borderRadius: "8px"
                }}
              >
                <h4 style={{ margin: "0 0 12px 0", fontWeight: "700" }}>
                  {opponent.opponent}
                </h4>
                
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "8px",
                  marginBottom: "12px"
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#10b981" }}>
                      {opponent.wins}
                    </div>
                    <div style={{ fontSize: "10px", color: "#a0aec0" }}>Vinster</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#ef4444" }}>
                      {opponent.losses}
                    </div>
                    <div style={{ fontSize: "10px", color: "#a0aec0" }}>Förluster</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#f59e0b" }}>
                      {opponent.draws}
                    </div>
                    <div style={{ fontSize: "10px", color: "#a0aec0" }}>Oavgjorda</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#3b82f6" }}>
                      {opponent.winRate.toFixed(0)}%
                    </div>
                    <div style={{ fontSize: "10px", color: "#a0aec0" }}>Vinstprocent</div>
                  </div>
                </div>

                <div style={{
                  background: "#1a202c",
                  padding: "8px",
                  borderRadius: "4px",
                  marginBottom: "8px"
                }}>
                  <div style={{ fontSize: "12px", color: "#a0aec0" }}>Senaste mötet:</div>
                  <div style={{ fontWeight: "600" }}>
                    {new Date(opponent.lastMeeting.date).toLocaleDateString('sv-SE')} - 
                    {opponent.lastMeeting.result === 'W' ? ' Vinst ' : opponent.lastMeeting.result === 'L' ? ' Förlust ' : ' Oavgjort '}
                    ({opponent.lastMeeting.score})
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "12px", color: "#a0aec0", marginBottom: "4px" }}>
                    Senaste form (5 matcher):
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {opponent.recentForm.map((result, i) => (
                      <span key={i} style={{ fontSize: "16px" }}>
                        {getFormIcon(result)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {selectedTab === 'timeline' && (
        <div>
          <h3 style={{ margin: "0 0 16px 0" }}>📅 Säsongstidslinje</h3>
          
          <div style={{
            background: "#2d3748",
            padding: "16px",
            borderRadius: "8px"
          }}>
            <div style={{ color: "#a0aec0" }}>
              <p>Här kommer en interaktiv tidslinje som visar:</p>
              <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                <li>Säsongens viktiga händelser och milstolpar</li>
                <li>Prestationsutveckling över tid</li>
                <li>Jämförelser mellan olika månader/perioder</li>
                <li>Trendanalys för lag och individuella spelare</li>
                <li>Automatiska "före och efter"-jämförelser</li>
              </ul>
              <p style={{ marginTop: "12px", fontStyle: "italic" }}>
                Implementeras i nästa version med interaktiva grafer och detaljerade trendanalyser.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedComparisons;
