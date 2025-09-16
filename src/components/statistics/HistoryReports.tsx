import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStatistics } from '../../context/StatisticsContext';

interface HistoryFilters {
  timeframe: 'season' | 'month' | 'week' | 'custom';
  playerFilter: string;
  category: 'goals' | 'assists' | 'points' | 'saves' | 'all';
  formation: 'all' | '5v5' | 'powerplay' | 'penalty';
  opponentFilter: string;
}

interface Milestone {
  id: string;
  playerId: string;
  type: 'goals' | 'assists' | 'points' | 'games' | 'saves' | 'special';
  achievement: string;
  value: number;
  date: string;
  isRecent?: boolean;
}

interface Award {
  id: string;
  playerId: string;
  type: 'mvp_game' | 'mvp_week' | 'mvp_month' | 'top_scorer' | 'best_defense' | 'best_goalkeeper';
  title: string;
  description: string;
  period: string;
  date: string;
  stats?: any;
}

const HistoryReports: React.FC = () => {
  const { user, isLeader } = useAuth();
  const { getPerformanceTrends } = useStatistics();
  
  const [selectedTab, setSelectedTab] = useState<'reports' | 'trends' | 'milestones' | 'awards'>('reports');
  const [filters, setFilters] = useState<HistoryFilters>({
    timeframe: 'season',
    playerFilter: 'all',
    category: 'all',
    formation: 'all',
    opponentFilter: 'all'
  });
  
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [reportData, setReportData] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Mock data för milstolpar
  useEffect(() => {
    setMilestones([
      {
        id: "m1",
        playerId: "2",
        type: "goals",
        achievement: "50 mål",
        value: 50,
        date: "2025-06-20",
        isRecent: true
      },
      {
        id: "m2", 
        playerId: "1",
        type: "points",
        achievement: "100 poäng",
        value: 100,
        date: "2025-06-15",
        isRecent: true
      },
      {
        id: "m3",
        playerId: "3",
        type: "saves",
        achievement: "500 räddningar", 
        value: 500,
        date: "2025-06-10"
      },
      {
        id: "m4",
        playerId: "1",
        type: "games",
        achievement: "100 matcher",
        value: 100,
        date: "2025-05-28"
      },
      {
        id: "m5",
        playerId: "4",
        type: "special",
        achievement: "Hat-trick",
        value: 3,
        date: "2025-06-18",
        isRecent: true
      }
    ]);

    setAwards([
      {
        id: "a1",
        playerId: "2",
        type: "mvp_month",
        title: "Månadens spelare - Juni",
        description: "15 mål och 8 assists på 8 matcher",
        period: "Juni 2025",
        date: "2025-06-28"
      },
      {
        id: "a2",
        playerId: "1", 
        type: "mvp_week",
        title: "Veckans spelare - v25",
        description: "4 poäng i 2 matcher",
        period: "Vecka 25",
        date: "2025-06-22"
      },
      {
        id: "a3",
        playerId: "3",
        type: "best_goalkeeper",
        title: "Bästa målvakt - Maj",
        description: "94% räddningsprocent",
        period: "Maj 2025", 
        date: "2025-05-31"
      }
    ]);
  }, []);

  const generateReport = async () => {
    setIsGeneratingReport(true);
    
    // Simulera report generation
    setTimeout(() => {
      setReportData({
        period: filters.timeframe,
        totalMatches: 18,
        totalGoals: 67,
        totalAssists: 45,
        topScorer: { name: "Anna Svensson", goals: 15 },
        topAssister: { name: "Erik Nilsson", assists: 15 },
        mvp: { name: "Anna Svensson", points: 27 },
        bestRecord: "12 raka vinster (Feb-Apr)",
        teamRecord: "3-0 vinst mot Hammarby",
        playerRecords: [
          { player: "Simon Andersson", record: "5 assists på en match" },
          { player: "Lisa Johansson", record: "Hat-trick på 4:32" }
        ]
      });
      setIsGeneratingReport(false);
    }, 1500);
  };

  const exportToPDF = () => {
    // Här skulle vi implementera PDF-export
    alert('PDF-export kommer snart! 📄');
  };

  const tabs = [
    { id: 'reports', name: 'Rapporter', icon: '📊' },
    { id: 'trends', name: 'Trender', icon: '📈' },
    { id: 'milestones', name: 'Milstolpar', icon: '🏆' },
    { id: 'awards', name: 'Utmärkelser', icon: '🥇' }
  ];

  const getPlayerName = (playerId: string) => {
    const mockPlayers = [
      { id: "1", name: "Simon Andersson" },
      { id: "2", name: "Anna Svensson" },
      { id: "3", name: "Mikael Berg" },
      { id: "4", name: "Lisa Johansson" }
    ];
    return mockPlayers.find(p => p.id === playerId)?.name || "Okänd spelare";
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'goals': return '⚽';
      case 'assists': return '🎯';
      case 'points': return '📊';
      case 'saves': return '🥅';
      case 'games': return '🏒';
      case 'special': return '⭐';
      default: return '🏆';
    }
  };

  const getAwardIcon = (type: string) => {
    switch (type) {
      case 'mvp_game': return '👑';
      case 'mvp_week': return '🌟';
      case 'mvp_month': return '🥇';
      case 'top_scorer': return '⚽';
      case 'best_defense': return '🛡️';
      case 'best_goalkeeper': return '🥅';
      default: return '🏆';
    }
  };

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
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>
            📈 Historik & Avancerad Statistik
          </h2>
          <p style={{ margin: "4px 0 0 0", color: "#a0aec0" }}>
            Omfattande rapporter, trender och prestationsanalys
          </p>
        </div>
        {isLeader() && (
          <button
            onClick={exportToPDF}
            style={{
              padding: "8px 16px",
              background: "#10b981",
              border: "none",
              borderRadius: "6px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            📄 Exportera PDF
          </button>
        )}
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

      {/* Reports Tab */}
      {selectedTab === 'reports' && (
        <div>
          {/* Filters */}
          <div style={{
            background: "#2d3748",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "20px"
          }}>
            <h3 style={{ margin: "0 0 12px 0" }}>🔍 Filtrera rapporter</h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px"
            }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#a0aec0" }}>
                  Tidsperiod
                </label>
                <select
                  value={filters.timeframe}
                  onChange={(e) => setFilters({...filters, timeframe: e.target.value as any})}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "#1a202c",
                    border: "1px solid #4a5568",
                    borderRadius: "4px",
                    color: "#fff"
                  }}
                >
                  <option value="season">Hela säsongen</option>
                  <option value="month">Senaste månaden</option>
                  <option value="week">Senaste veckan</option>
                  <option value="custom">Anpassad period</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#a0aec0" }}>
                  Kategori
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value as any})}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "#1a202c",
                    border: "1px solid #4a5568",
                    borderRadius: "4px",
                    color: "#fff"
                  }}
                >
                  <option value="all">Alla kategorier</option>
                  <option value="goals">Mål</option>
                  <option value="assists">Assists</option>
                  <option value="points">Poäng</option>
                  <option value="saves">Räddningar</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#a0aec0" }}>
                  Formation
                </label>
                <select
                  value={filters.formation}
                  onChange={(e) => setFilters({...filters, formation: e.target.value as any})}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "#1a202c",
                    border: "1px solid #4a5568",
                    borderRadius: "4px",
                    color: "#fff"
                  }}
                >
                  <option value="all">Alla formationer</option>
                  <option value="5v5">5v5</option>
                  <option value="powerplay">Powerplay</option>
                  <option value="penalty">Boxplay</option>
                </select>
              </div>
            </div>

            <button
              onClick={generateReport}
              disabled={isGeneratingReport}
              style={{
                marginTop: "12px",
                padding: "8px 16px",
                background: isGeneratingReport ? "#4a5568" : "#3b82f6",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                cursor: isGeneratingReport ? "not-allowed" : "pointer",
                fontWeight: "600"
              }}
            >
              {isGeneratingReport ? "⏳ Genererar..." : "📊 Generera rapport"}
            </button>
          </div>

          {/* Report Results */}
          {reportData && (
            <div style={{
              background: "#2d3748",
              padding: "20px",
              borderRadius: "8px"
            }}>
              <h3 style={{ margin: "0 0 16px 0" }}>📋 Säsongsrapport 2024/25</h3>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
                marginBottom: "20px"
              }}>
                <div style={{ background: "#1a202c", padding: "16px", borderRadius: "6px" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>
                    {reportData.totalMatches}
                  </div>
                  <div style={{ color: "#a0aec0" }}>Spelade matcher</div>
                </div>
                
                <div style={{ background: "#1a202c", padding: "16px", borderRadius: "6px" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}>
                    {reportData.totalGoals}
                  </div>
                  <div style={{ color: "#a0aec0" }}>Totalt mål</div>
                </div>
                
                <div style={{ background: "#1a202c", padding: "16px", borderRadius: "6px" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>
                    {reportData.totalAssists}
                  </div>
                  <div style={{ color: "#a0aec0" }}>Totalt assists</div>
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "16px"
              }}>
                <div style={{ background: "#1a202c", padding: "16px", borderRadius: "6px" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#10b981" }}>🥇 Topprestationer</h4>
                  <div style={{ fontSize: "14px" }}>
                    <div style={{ marginBottom: "8px" }}>
                      <strong>Skyttekung:</strong> {reportData.topScorer.name} ({reportData.topScorer.goals} mål)
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <strong>Flest assists:</strong> {reportData.topAssister.name} ({reportData.topAssister.assists} assist)
                    </div>
                    <div>
                      <strong>MVP:</strong> {reportData.mvp.name} ({reportData.mvp.points} poäng)
                    </div>
                  </div>
                </div>

                <div style={{ background: "#1a202c", padding: "16px", borderRadius: "6px" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#f59e0b" }}>📊 Rekord & Milstolpar</h4>
                  <div style={{ fontSize: "14px" }}>
                    <div style={{ marginBottom: "8px" }}>
                      <strong>Bästa serie:</strong> {reportData.bestRecord}
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <strong>Största vinst:</strong> {reportData.teamRecord}
                    </div>
                    {reportData.playerRecords.map((record: any, index: number) => (
                      <div key={index} style={{ marginBottom: "8px" }}>
                        <strong>{record.player}:</strong> {record.record}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trends Tab */}
      {selectedTab === 'trends' && (
        <div>
          <h3 style={{ margin: "0 0 16px 0" }}>📈 Prestationstrender</h3>
          
          {user && (
            <div style={{
              background: "#2d3748",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "16px"
            }}>
              <h4 style={{ margin: "0 0 12px 0" }}>Din personliga trend</h4>
              {(() => {
                const trends = getPerformanceTrends(user.id);
                return (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "12px"
                  }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "20px", fontWeight: "bold", color: "#3b82f6" }}>
                        {trends.seasonAverage.toFixed(1)}
                      </div>
                      <div style={{ fontSize: "12px", color: "#a0aec0" }}>Snitt/match</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>
                        {trends.bestGame}
                      </div>
                      <div style={{ fontSize: "12px", color: "#a0aec0" }}>Bästa match</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "20px", fontWeight: "bold", color: "#f59e0b" }}>
                        {trends.consistency.toFixed(0)}%
                      </div>
                      <div style={{ fontSize: "12px", color: "#a0aec0" }}>Konsistens</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ 
                        fontSize: "20px", 
                        fontWeight: "bold", 
                        color: trends.improvement > 0 ? "#10b981" : "#ef4444" 
                      }}>
                        {trends.improvement > 0 ? "+" : ""}{trends.improvement.toFixed(1)}%
                      </div>
                      <div style={{ fontSize: "12px", color: "#a0aec0" }}>Förbättring</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <div style={{
            background: "#2d3748",
            padding: "16px",
            borderRadius: "8px"
          }}>
            <h4 style={{ margin: "0 0 12px 0" }}>🏆 Lagstatistik-trender</h4>
            <div style={{ color: "#a0aec0" }}>
              Här kommer detaljerade trendanalyser för laget över tid...
            </div>
          </div>
        </div>
      )}

      {/* Milestones Tab */}
      {selectedTab === 'milestones' && (
        <div>
          <h3 style={{ margin: "0 0 16px 0" }}>🏆 Milstolpar & Rekord</h3>
          
          {/* Recent Milestones */}
          <div style={{
            background: "#2d3748", 
            padding: "16px", 
            borderRadius: "8px",
            marginBottom: "16px"
          }}>
            <h4 style={{ margin: "0 0 12px 0", color: "#10b981" }}>🎉 Senaste milstolpar</h4>
            {milestones
              .filter(m => m.isRecent)
              .map(milestone => (
                <div 
                  key={milestone.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    background: "#1a202c",
                    borderRadius: "6px",
                    marginBottom: "8px",
                    border: "2px solid #10b981"
                  }}
                >
                  <span style={{ fontSize: "24px" }}>
                    {getMilestoneIcon(milestone.type)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600" }}>
                      {getPlayerName(milestone.playerId)} - {milestone.achievement}
                    </div>
                    <div style={{ fontSize: "12px", color: "#a0aec0" }}>
                      {new Date(milestone.date).toLocaleDateString('sv-SE')}
                    </div>
                  </div>
                  <div style={{
                    background: "#10b981",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>
                    NYT!
                  </div>
                </div>
              ))}
          </div>

          {/* All Milestones */}
          <div style={{
            background: "#2d3748",
            padding: "16px", 
            borderRadius: "8px"
          }}>
            <h4 style={{ margin: "0 0 12px 0" }}>📊 Alla milstolpar</h4>
            {milestones.map(milestone => (
              <div 
                key={milestone.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  background: "#1a202c",
                  borderRadius: "6px",
                  marginBottom: "8px"
                }}
              >
                <span style={{ fontSize: "20px" }}>
                  {getMilestoneIcon(milestone.type)}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600" }}>
                    {getPlayerName(milestone.playerId)} - {milestone.achievement}
                  </div>
                  <div style={{ fontSize: "12px", color: "#a0aec0" }}>
                    {new Date(milestone.date).toLocaleDateString('sv-SE')}
                  </div>
                </div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#3b82f6" }}>
                  {milestone.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awards Tab */}
      {selectedTab === 'awards' && (
        <div>
          <h3 style={{ margin: "0 0 16px 0" }}>🥇 Utmärkelser & MVP</h3>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px"
          }}>
            {awards.map(award => (
              <div 
                key={award.id}
                style={{
                  background: "#2d3748",
                  padding: "16px",
                  borderRadius: "8px",
                  border: award.type.includes('mvp') ? "2px solid #f59e0b" : "1px solid #4a5568"
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px"
                }}>
                  <span style={{ fontSize: "24px" }}>
                    {getAwardIcon(award.type)}
                  </span>
                  <div style={{ fontWeight: "600", color: "#f59e0b" }}>
                    {award.title}
                  </div>
                </div>
                
                <div style={{ marginBottom: "8px" }}>
                  <strong>{getPlayerName(award.playerId)}</strong>
                </div>
                
                <div style={{ 
                  fontSize: "14px", 
                  color: "#a0aec0",
                  marginBottom: "8px"
                }}>
                  {award.description}
                </div>
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "12px",
                  color: "#718096"
                }}>
                  <span>{award.period}</span>
                  <span>{new Date(award.date).toLocaleDateString('sv-SE')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* MVP Voting Section */}
          {isLeader() && (
            <div style={{
              background: "#2d3748",
              padding: "16px",
              borderRadius: "8px",
              marginTop: "20px"
            }}>
              <h4 style={{ margin: "0 0 12px 0" }}>👑 Nominera veckans spelare</h4>
              <div style={{
                display: "flex",
                gap: "12px",
                alignItems: "center"
              }}>
                <select
                  style={{
                    flex: 1,
                    padding: "8px",
                    background: "#1a202c",
                    border: "1px solid #4a5568",
                    borderRadius: "4px",
                    color: "#fff"
                  }}
                >
                  <option value="">Välj spelare...</option>
                  <option value="1">Simon Andersson</option>
                  <option value="2">Anna Svensson</option>
                  <option value="3">Mikael Berg</option>
                  <option value="4">Lisa Johansson</option>
                </select>
                <button
                  style={{
                    padding: "8px 16px",
                    background: "#f59e0b",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Nominera
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryReports;
