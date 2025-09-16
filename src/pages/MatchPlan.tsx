import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTitle } from "../hooks/useTitle";
import MatchPlanView from "../components/matchplan/MatchPlanView";
import { matchAPI } from "../services/apiService";
import MatchPlanCreator from "../components/matchplan/MatchPlanCreator";
import PlaybookView from "../components/matchplan/PlaybookView";
// import LiveMatchTracker from "../components/ui/LiveMatchTracker";
import { useLive } from "../context/LiveContext";
import { useToast } from "../components/ui/Toast";
import { usePullToRefresh } from "../hooks/usePullToRefresh";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  status: 'scheduled' | 'live' | 'completed';
  homeScore?: number;
  awayScore?: number;
}

const MatchPlanPage: React.FC = () => {
  useTitle("Matchplanering | FBC Nyköping");
  const { user, isLeader } = useAuth();
  const { liveMatch, isConnected } = useLive();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'completed' | 'planner' | 'playbook'>('upcoming');
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [playbookMatchPlan, setPlaybookMatchPlan] = useState<any>(null);

  const loadMatches = async () => {
    setIsLoading(true);
    const res = await matchAPI.getAll();
    if (res.success && Array.isArray(res.data)) {
      setMatches(res.data);
    } else {
      setMatches([]);
    }
    setIsLoading(false);
  };

  // Pull to refresh functionality
  const { containerRef, isRefreshing, isPulling, pullIndicatorStyle, isOverThreshold } = usePullToRefresh({
    onRefresh: loadMatches,
    enabled: true
  });

  useEffect(() => {
    loadMatches();
  }, []);

  const upcomingMatches = matches.filter(m => m.status === 'scheduled');
  const completedMatches = matches.filter(m => m.status === 'completed');

  // Modern FBC styles with glassmorphism and gradients
  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "var(--background-gradient)",
    color: "var(--text-primary)",
    position: "relative",
    overflow: "hidden"
  };

  const parallaxStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "200vh",
    background: `
      radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 60%, rgba(255, 119, 198, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(255, 206, 84, 0.2) 0%, transparent 50%)
    `,
    animation: "parallaxFloat 20s ease-in-out infinite",
    zIndex: 0
  };

  const contentStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 1,
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1rem",
    paddingBottom: "6rem"
  };

  const headerStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "24px",
    padding: "3rem 2rem",
    marginBottom: "2rem",
    textAlign: "center",
    position: "relative",
    overflow: "hidden"
  };

  const tabsStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    marginBottom: "2rem",
    padding: "1rem",
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.08)"
  };

  const tabStyle: React.CSSProperties = {
    padding: "0.875rem 1.5rem",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.05)",
    color: "var(--text-secondary)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "500",
    fontSize: "0.9rem",
    whiteSpace: "nowrap"
  };

  const activeTabStyle: React.CSSProperties = {
    ...tabStyle,
    background: "var(--fbc-gradient)",
    color: "#ffffff",
    borderColor: "var(--fbc-secondary)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 32px rgba(245, 158, 11, 0.3)"
  };

  const matchCardStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    padding: "1.5rem",
    marginBottom: "1rem",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden"
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "1.5rem"
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={parallaxStyle} />
        <div style={contentStyle}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: "1.5rem"
          }}>
            <div style={{
              width: "60px",
              height: "60px",
              border: "3px solid rgba(255, 255, 255, 0.2)",
              borderTop: "3px solid var(--fbc-secondary)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <div style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "2rem",
              textAlign: "center"
            }}>
              <h2 style={{ 
                fontSize: "1.5rem", 
                fontWeight: "600", 
                margin: "0 0 0.5rem 0" 
              }}>
                Laddar matchplanering...
              </h2>
              <p style={{ 
                color: "var(--text-secondary)", 
                margin: 0 
              }}>
                Hämtar kommande och avslutade matcher
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} ref={containerRef}>
      <div style={parallaxStyle} />
      
      {/* Pull to refresh indicator */}
      {isPulling && (
        <div style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          zIndex: 1000,
          ...pullIndicatorStyle,
          transform: `translateX(-50%) ${pullIndicatorStyle.transform}`
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "50%",
            padding: "0.75rem",
            color: isOverThreshold ? "var(--fbc-secondary)" : "var(--text-secondary)"
          }}>
            {isOverThreshold ? "⬇️" : "⬆️"}
          </div>
        </div>
      )}

      <div style={contentStyle}>
        {/* Header */}
        <header style={headerStyle}>
          <div style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            right: "-50%",
            bottom: "-50%",
            background: "var(--fbc-gradient)",
            opacity: 0.1,
            borderRadius: "50%",
            animation: "rotate 20s linear infinite"
          }} />
          <h1 style={{ 
            fontSize: "clamp(2rem, 5vw, 3rem)", 
            margin: "0 0 1rem 0",
            fontWeight: "700",
            background: "var(--fbc-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            position: "relative",
            zIndex: 1
          }}>
            🏒 Matchplanering
          </h1>
          <p style={{ 
            fontSize: "1.125rem", 
            opacity: 0.9,
            margin: 0,
            position: "relative",
            zIndex: 1
          }}>
            Hantera kommande matcher och följ live-resultat
          </p>
        </header>

        {/* Live Match Tracker - Tillfälligt borttagen */}
        {/* {(liveMatch || isLeader()) && (
          <section style={{ marginBottom: '2rem' }}>
            <LiveMatchTracker />
          </section>
        )} */}

        {/* Connection Status */}
        <div style={{
          background: isConnected ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${isConnected ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
          color: isConnected ? "#10b981" : "#ef4444",
          padding: "1rem 1.5rem",
          borderRadius: "12px",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          fontSize: "0.9rem",
          fontWeight: "500"
        }}>
          <span style={{ fontSize: "1.2rem" }}>
            {isConnected ? "🟢" : "🔴"}
          </span>
          {isConnected ? "Ansluten till live-uppdateringar" : "Inte ansluten till live-servern"}
        </div>

        {/* Tabs */}
        <div style={tabsStyle}>
          <button
            style={activeTab === 'upcoming' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('upcoming')}
          >
            📅 Kommande matcher ({upcomingMatches.length})
          </button>
          <button
            style={activeTab === 'live' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('live')}
          >
            🔴 Live {liveMatch ? '(1)' : '(0)'}
          </button>
          <button
            style={activeTab === 'completed' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('completed')}
          >
            ✅ Avslutade ({completedMatches.length})
          </button>
          {isLeader() && (
            <button
              style={activeTab === 'planner' ? activeTabStyle : tabStyle}
              onClick={() => setActiveTab('planner')}
            >
              🎯 Matchplanering
            </button>
          )}
          <button
            style={activeTab === 'playbook' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('playbook')}
          >
            📖 Playbook
          </button>
        </div>

        {/* Refreshing indicator */}
        {isRefreshing && (
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "1rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.9rem"
          }}>
            <div style={{
              width: "20px",
              height: "20px",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              borderTop: "2px solid var(--fbc-secondary)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            Uppdaterar matcher...
          </div>
        )}

        {/* Content */}
        {activeTab === 'upcoming' && (
          <section>
            <h2 style={{ 
              color: "var(--text-primary)", 
              marginBottom: "2rem",
              fontSize: "1.8rem",
              fontWeight: "600",
              textAlign: "center"
            }}>
              📅 Kommande matcher
            </h2>
            {upcomingMatches.length === 0 ? (
              <div style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "4rem 2rem",
                textAlign: "center",
                color: "var(--text-secondary)"
              }}>
                <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>📅</span>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Inga kommande matcher
                </h3>
                <p style={{ margin: 0, opacity: 0.8 }}>
                  Schemalagda matcher visas här när de blir tillgängliga
                </p>
              </div>
            ) : (
              <div style={gridStyle}>
                {upcomingMatches.map(match => (
                  <div 
                    key={match.id} 
                    style={{
                      ...matchCardStyle,
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1.5rem"
                    }}>
                      <span style={{
                        background: "var(--fbc-gradient)",
                        color: "#ffffff",
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        📅 Kommande
                      </span>
                      <span style={{ 
                        color: "var(--text-secondary)", 
                        fontSize: "0.9rem",
                        fontWeight: "500"
                      }}>
                        {new Date(match.date).toLocaleDateString('sv-SE')} {match.time}
                      </span>
                    </div>
                    
                    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem"
                      }}>
                        <div style={{ flex: 1, textAlign: "center" }}>
                          <div style={{
                            color: "var(--text-primary)",
                            fontWeight: "700",
                            fontSize: "1.1rem",
                            marginBottom: "0.5rem"
                          }}>
                            {match.homeTeam}
                          </div>
                          <div style={{
                            width: "40px",
                            height: "40px",
                            background: "var(--fbc-gradient)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto",
                            fontSize: "1.2rem"
                          }}>
                            🏒
                          </div>
                        </div>
                        
                        <div style={{
                          color: "var(--fbc-secondary)",
                          fontSize: "2rem",
                          fontWeight: "bold",
                          margin: "0 1rem"
                        }}>
                          VS
                        </div>
                        
                        <div style={{ flex: 1, textAlign: "center" }}>
                          <div style={{
                            color: "var(--text-primary)",
                            fontWeight: "700",
                            fontSize: "1.1rem",
                            marginBottom: "0.5rem"
                          }}>
                            {match.awayTeam}
                          </div>
                          <div style={{
                            width: "40px",
                            height: "40px",
                            background: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto",
                            fontSize: "1.2rem",
                            border: "2px solid var(--fbc-secondary)"
                          }}>
                            🥅
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                      marginBottom: "1.5rem",
                      padding: "0.75rem",
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.05)"
                    }}>
                      <span>📍</span>
                      <span style={{ fontWeight: "500" }}>{match.venue}</span>
                    </div>

                    {isLeader() && (
                      <div style={{
                        display: "flex",
                        gap: "0.75rem",
                        marginBottom: "1rem"
                      }}>
                        <button
                          style={{
                            flex: 1,
                            padding: "0.75rem",
                            background: "var(--fbc-gradient)",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)"
                          }}
                          onClick={() => {
                            setSelectedMatchId(match.id);
                            setActiveTab('planner');
                            toast.success('Matchplanering öppnad!');
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 25px rgba(245, 158, 11, 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 15px rgba(245, 158, 11, 0.3)";
                          }}
                        >
                          📋 Planera match
                        </button>
                        <button
                          style={{
                            flex: 1,
                            padding: "0.75rem",
                            background: "linear-gradient(135deg, #ef4444, #dc2626)",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)"
                          }}
                          onClick={() => {
                            // startLiveMatch(match.id);
                            toast.success('Live-match startad!');
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 25px rgba(239, 68, 68, 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)";
                          }}
                        >
                          🔴 Starta Live
                        </button>
                      </div>
                    )}

                    {/* Playbook-knapp för alla */}
                    <button
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)"
                      }}
                      onClick={() => {
                        // Mock matchplan för demo
                        const mockMatchPlan = {
                          id: match.id,
                          matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
                          opponent: match.awayTeam,
                          date: match.date,
                          venue: match.venue,
                          formations: [
                            {
                              id: "1",
                              name: "5v5 Standard",
                              type: "5v5" as const,
                              description: "Vår standardformation för jämnt spel",
                              players: [],
                              isDefault: true
                            }
                          ],
                          tactics: [
                            {
                              id: "1",
                              title: "Hög press",
                              description: "Pressa högt upp i deras zon för att skapa turnover",
                              priority: "high" as const,
                              category: "offense" as const
                            }
                          ],
                          coachNotes: "Fokusera på snabba omställningar och hårt tryck på pucken.",
                          playerInstructions: {},
                          specialPlays: ["Powerplay variant A", "Penalty kill box"],
                          keys: ["Vinna bortslag", "Hålla pucken", "Snabba omställningar"],
                          published: true,
                          confirmedBy: ["1", "2", "3"]
                        };
                        setPlaybookMatchPlan(mockMatchPlan);
                        setActiveTab('playbook');
                        toast.success('Playbook öppnad!');
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 25px rgba(139, 92, 246, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 15px rgba(139, 92, 246, 0.3)";
                      }}
                    >
                      📖 Visa Playbook
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'live' && (
          <section>
            <h2 style={{ 
              color: "var(--text-primary)", 
              marginBottom: "2rem",
              fontSize: "1.8rem",
              fontWeight: "600",
              textAlign: "center"
            }}>
              🔴 Live-matcher
            </h2>
            {!liveMatch ? (
              <div style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "4rem 2rem",
                textAlign: "center",
                color: "var(--text-secondary)"
              }}>
                <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>🔴</span>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
                  Ingen pågående live-match
                </h3>
                <p style={{ margin: "0 0 2rem 0", opacity: 0.8 }}>
                  Starta en live-match för att följa resultat i realtid
                </p>
                {isLeader() && (
                  <button
                    style={{
                      padding: "1rem 2rem",
                      background: "var(--fbc-gradient)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)"
                    }}
                    onClick={() => {
                      toast.info('Live-match funktionalitet i LiveMatchTracker ovan');
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 25px rgba(245, 158, 11, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(245, 158, 11, 0.3)";
                    }}
                  >
                    🔴 Starta Live-match
                  </button>
                )}
              </div>
            ) : (
              <div style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "2rem",
                textAlign: "center"
              }}>
                <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "1.1rem" }}>
                  Live-matchen visas i spårningspanelen ovan
                </p>
              </div>
            )}
          </section>
        )}

        {activeTab === 'completed' && (
          <section>
            <h2 style={{ 
              color: "var(--text-primary)", 
              marginBottom: "2rem",
              fontSize: "1.8rem",
              fontWeight: "600",
              textAlign: "center"
            }}>
              ✅ Avslutade matcher
            </h2>
            {completedMatches.length === 0 ? (
              <div style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "4rem 2rem",
                textAlign: "center",
                color: "var(--text-secondary)"
              }}>
                <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>📋</span>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Inga avslutade matcher
                </h3>
                <p style={{ margin: 0, opacity: 0.8 }}>
                  Spelade matcher och resultat visas här
                </p>
              </div>
            ) : (
              <div style={gridStyle}>
                {completedMatches.map(match => (
                  <div 
                    key={match.id} 
                    style={{
                      ...matchCardStyle,
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1.5rem"
                    }}>
                      <span style={{
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        color: "#ffffff",
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        ✅ Avslutad
                      </span>
                      <span style={{ 
                        color: "var(--text-secondary)", 
                        fontSize: "0.9rem",
                        fontWeight: "500"
                      }}>
                        {new Date(match.date).toLocaleDateString('sv-SE')}
                      </span>
                    </div>
                    
                    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem"
                      }}>
                        <div style={{ flex: 1, textAlign: "center" }}>
                          <div style={{
                            color: "var(--text-primary)",
                            fontWeight: "700",
                            fontSize: "1.1rem",
                            marginBottom: "0.5rem"
                          }}>
                            {match.homeTeam}
                          </div>
                          <div style={{
                            fontSize: "2.5rem",
                            fontWeight: "bold",
                            color: match.homeScore! > match.awayScore! ? "#10b981" : "#ef4444",
                            marginBottom: "0.5rem"
                          }}>
                            {match.homeScore}
                          </div>
                          <div style={{
                            width: "40px",
                            height: "40px",
                            background: match.homeScore! > match.awayScore! ? 
                              "linear-gradient(135deg, #10b981, #059669)" : 
                              "rgba(239, 68, 68, 0.2)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto",
                            fontSize: "1.2rem",
                            color: match.homeScore! > match.awayScore! ? "#ffffff" : "#ef4444"
                          }}>
                            {match.homeScore! > match.awayScore! ? "🏆" : "😔"}
                          </div>
                        </div>
                        
                        <div style={{
                          color: "var(--text-secondary)",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          margin: "0 1rem"
                        }}>
                          -
                        </div>
                        
                        <div style={{ flex: 1, textAlign: "center" }}>
                          <div style={{
                            color: "var(--text-primary)",
                            fontWeight: "700",
                            fontSize: "1.1rem",
                            marginBottom: "0.5rem"
                          }}>
                            {match.awayTeam}
                          </div>
                          <div style={{
                            fontSize: "2.5rem",
                            fontWeight: "bold",
                            color: match.awayScore! > match.homeScore! ? "#10b981" : "#ef4444",
                            marginBottom: "0.5rem"
                          }}>
                            {match.awayScore}
                          </div>
                          <div style={{
                            width: "40px",
                            height: "40px",
                            background: match.awayScore! > match.homeScore! ? 
                              "linear-gradient(135deg, #10b981, #059669)" : 
                              "rgba(239, 68, 68, 0.2)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto",
                            fontSize: "1.2rem",
                            color: match.awayScore! > match.homeScore! ? "#ffffff" : "#ef4444"
                          }}>
                            {match.awayScore! > match.homeScore! ? "🏆" : "😔"}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                      padding: "0.75rem",
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.05)"
                    }}>
                      <span>📍</span>
                      <span style={{ fontWeight: "500" }}>{match.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'planner' && isLeader() && (
          <section>
            <h2 style={{ 
              color: "var(--text-primary)", 
              marginBottom: "2rem",
              fontSize: "1.8rem",
              fontWeight: "600",
              textAlign: "center"
            }}>
              🎯 Matchplanering
            </h2>
            <p style={{ 
              color: "var(--text-secondary)", 
              marginBottom: "2rem",
              fontSize: "1.1rem",
              textAlign: "center",
              opacity: 0.9
            }}>
              Skapa detaljerade matchplaner med formationer, taktik och spelarinstruktioner
            </p>
            
            {selectedMatchId ? (
              <div style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "2rem",
                marginBottom: "2rem",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute",
                  top: "-50%",
                  left: "-50%",
                  right: "-50%",
                  bottom: "-50%",
                  background: "var(--fbc-gradient)",
                  opacity: 0.05,
                  borderRadius: "50%",
                  animation: "rotate 20s linear infinite"
                }} />
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                  position: "relative",
                  zIndex: 1
                }}>
                  <h3 style={{ 
                    color: "var(--text-primary)", 
                    margin: 0,
                    fontSize: "1.3rem",
                    fontWeight: "600"
                  }}>
                    Match: {matches.find(m => m.id === selectedMatchId)?.homeTeam} vs {matches.find(m => m.id === selectedMatchId)?.awayTeam}
                  </h3>
                  <button
                    style={{
                      background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      padding: "0.75rem 1.5rem",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)"
                    }}
                    onClick={() => {
                      setSelectedMatchId(null);
                      toast.info('Matchplanering avslutad');
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 25px rgba(239, 68, 68, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)";
                    }}
                  >
                    ✕ Stäng planering
                  </button>
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <MatchPlanCreator 
                    matchId={selectedMatchId}
                    initialMatchTitle={`${matches.find(m => m.id === selectedMatchId)?.homeTeam} vs ${matches.find(m => m.id === selectedMatchId)?.awayTeam}`}
                    initialOpponent={matches.find(m => m.id === selectedMatchId)?.awayTeam || ''}
                    initialDate={matches.find(m => m.id === selectedMatchId)?.date || ''}
                    initialVenue={matches.find(m => m.id === selectedMatchId)?.venue || ''}
                    onSave={(plan) => {
                      console.log('Matchplan sparad:', plan);
                      toast.success('Matchplan sparad!');
                      setSelectedMatchId(null);
                    }}
                    onCancel={() => {
                      setSelectedMatchId(null);
                      toast.info('Matchplanering avbruten');
                    }}
                  />
                </div>
              </div>
            ) : (
              <div style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "4rem 2rem",
                textAlign: "center",
                color: "var(--text-secondary)",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute",
                  top: "-50%",
                  left: "-50%",
                  right: "-50%",
                  bottom: "-50%",
                  background: "var(--fbc-gradient)",
                  opacity: 0.05,
                  borderRadius: "50%",
                  animation: "rotate 20s linear infinite"
                }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>🎯</span>
                  <h3 style={{ 
                    color: "var(--text-primary)", 
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                    fontWeight: "600"
                  }}>
                    Välj en match att planera
                  </h3>
                  <p style={{ marginBottom: "2rem", fontSize: "1.1rem", opacity: 0.8 }}>
                    Gå till "Kommande matcher" och klicka på "📋 Planera match" för att skapa en detaljerad matchplan
                  </p>
                  <button
                    style={{
                      background: "var(--fbc-gradient)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      padding: "1rem 2rem",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)"
                    }}
                    onClick={() => setActiveTab('upcoming')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 25px rgba(245, 158, 11, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(245, 158, 11, 0.3)";
                    }}
                  >
                    📅 Visa kommande matcher
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === 'playbook' && (
          <section>
            {playbookMatchPlan && user?.id ? (
              <div style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "2rem",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute",
                  top: "-50%",
                  left: "-50%",
                  right: "-50%",
                  bottom: "-50%",
                  background: "var(--fbc-gradient)",
                  opacity: 0.05,
                  borderRadius: "50%",
                  animation: "rotate 20s linear infinite"
                }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <PlaybookView
                    matchPlan={playbookMatchPlan}
                    readonly={!isLeader()}
                    playerId={user.id}
                    onConfirm={() => {
                      // Uppdatera bekräftelse-status
                      setPlaybookMatchPlan((prev: any) => ({
                        ...prev,
                        confirmedBy: [...prev.confirmedBy, user?.id].filter((id, index, arr) => arr.indexOf(id) === index)
                      }));
                    }}
                  />
                </div>
              </div>
            ) : (
              <div style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "4rem 2rem",
                textAlign: "center",
                color: "var(--text-secondary)",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute",
                  top: "-50%",
                  left: "-50%",
                  right: "-50%",
                  bottom: "-50%",
                  background: "var(--fbc-gradient)",
                  opacity: 0.05,
                  borderRadius: "50%",
                  animation: "rotate 20s linear infinite"
                }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>📖</span>
                  <h3 style={{ 
                    color: "var(--text-primary)", 
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                    fontWeight: "600"
                  }}>
                    Välj en match för att visa playbook
                  </h3>
                  <p style={{ marginBottom: "2rem", fontSize: "1.1rem", opacity: 0.8 }}>
                    Gå till "Kommande matcher" och klicka på "📖 Visa Playbook" för att se matchplanen
                  </p>
                  <button
                    style={{
                      background: "var(--fbc-gradient)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      padding: "1rem 2rem",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)"
                    }}
                    onClick={() => setActiveTab('upcoming')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 25px rgba(245, 158, 11, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(245, 158, 11, 0.3)";
                    }}
                  >
                    📅 Visa kommande matcher
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Traditional Match Planning */}
        {isLeader() && activeTab !== 'planner' && activeTab !== 'playbook' && (
          <section style={{ marginTop: "3rem" }}>
            <h2 style={{ 
              color: "var(--text-primary)", 
              marginBottom: "2rem",
              fontSize: "1.8rem",
              fontWeight: "600",
              textAlign: "center"
            }}>
              📋 Traditionell Matchplanering
            </h2>
            <div style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              padding: "2rem",
              overflow: "hidden"
            }}>
              <MatchPlanView activityId="match-current" isLeader={true} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MatchPlanPage;