import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTitle } from "../hooks/useTitle";
import MatchPlanView from "../components/matchplan/MatchPlanView";
import { matchAPI } from "../services/apiService";
import MatchPlanCreator from "../components/matchplan/MatchPlanCreator";
import PlaybookView from "../components/matchplan/PlaybookView";
import { useLive } from "../context/LiveContext";
import { useToast } from "../components/ui/Toast";
import { usePullToRefresh } from "../hooks/usePullToRefresh";
import styles from "./MatchPlan.module.css";
/*
  Add the following to MatchPlan.module.css:

  .tabButton {
    background: rgba(255,255,255,0.05);
    color: var(--text-primary);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: none;
  }
  .activeTabButton {
    background: var(--fbc-gradient);
    color: #fff;
    border: 1px solid var(--fbc-secondary);
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  }
  .sectionTitle {
    color: var(--text-primary);
    margin-bottom: 2rem;
    font-size: 1.8rem;
    font-weight: 600;
    text-align: center;
  }
  .noLiveMatchBox {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 4rem 2rem;
    text-align: center;
    color: var(--text-secondary);
  }
*/

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
  const auth = useAuth();
  const user = auth?.user;
  const { isConnected, liveMatch } = useLive();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'completed' | 'planner' | 'playbook'>('upcoming');
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [playbookMatchPlan, setPlaybookMatchPlan] = useState<any>(null);

  // Helper to check if user is a leader
  function isLeader() {
    return user && (user.role === "leader" || user.role === "admin");
  }

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
  const { containerRef } = usePullToRefresh({
    onRefresh: loadMatches,
    enabled: true
  });

  useEffect(() => {
    loadMatches();
  }, []);

  const upcomingMatches = matches.filter(m => m.status === 'scheduled');
  const completedMatches = matches.filter(m => m.status === 'completed');



  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.parallax} />
        <div className={styles.content}>
          <div className={styles.loadingWrapper}>
            <div className={styles.loadingSpinner} />
            <div className={styles.loadingBox}>
              <h2 className={styles.loadingTitle}>Laddar matchplanering...</h2>
              <p className={styles.loadingText}>Hämtar kommande och avslutade matcher</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Inline styles for tabs and tab buttons
  // Moved tabsStyle to CSS module as .tabs
  // Tab button styles are now in MatchPlan.module.css

  return (
    <div className={styles.container} ref={containerRef}>
        {/* 
        <button
          className={`${styles.tabButton} ${activeTab === 'upcoming' ? styles.activeTabButton : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          📅 Kommande matcher ({upcomingMatches.length})
        </button>
          <LiveMatchTracker />
        </section>
        */}

        {/* Connection Status */}
        <div
          className={`${styles.connectionStatus} ${isConnected ? styles.connected : styles.disconnected}`}
        >
          <span className={styles.connectionStatusIcon}>
            {isConnected ? "🟢" : "🔴"}
          </span>
          {isConnected ? "Ansluten till live-uppdateringar" : "Inte ansluten till live-servern"}
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${activeTab === 'upcoming' ? styles.activeTabButton : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            📅 Kommande matcher ({upcomingMatches.length})
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'live' ? styles.activeTabButton : ''}`}
            onClick={() => setActiveTab('live')}
          >
            🔴 Live {liveMatch ? '(1)' : '(0)'}
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'completed' ? styles.activeTabButton : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            ✅ Avslutade ({completedMatches.length})
          </button>
          {isLeader() && (
            <button
              className={`${styles.tabButton} ${activeTab === 'planner' ? styles.activeTabButton : ''}`}
              onClick={() => setActiveTab('planner')}
            >
              🎯 Matchplanering
            </button>
          )}
          <button
            className={`${styles.tabButton} ${activeTab === 'playbook' ? styles.activeTabButton : ''}`}
            onClick={() => setActiveTab('playbook')}
          >
            📖 Playbook
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'live' && (
          <section>
            <div className={styles.noLiveMatchBox}>
              {!liveMatch ? (
                <div className={styles.noLiveMatchInner}>
                  <span className={styles.noLiveMatchIcon}>🔴</span>
                  <h3 className={styles.noLiveMatchTitle}>
                    Ingen pågående live-match
                  </h3>
                  <p className={styles.noLiveMatchText}>
                    Starta en live-match för att följa resultat i realtid
                  </p>
                  {isLeader() && (
                    <button className={styles.liveButton}
                      onClick={() => {
                        toast.info('Live-match funktionalitet i LiveMatchTracker ovan');
                      }}
                    >
                      🔴 Starta Live-match
                    </button>
                  )}
                </div>
              ) : (
                <div className={styles.noLiveMatchInner}>
                  <p className={styles.noLiveMatchText}>
                    Live-matchen visas i spårningspanelen ovan
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'completed' && (
          <section>
            <h2 className={styles.sectionTitle}>
              ✅ Avslutade matcher
            </h2>
            {completedMatches.length === 0 ? (
              <div className={styles.noCompletedMatchBox}>
                <span className={styles.noCompletedMatchIcon}>📋</span>
                <h3 className={styles.noCompletedMatchTitle}>
                  Inga avslutade matcher
                </h3>
                <p className={styles.noCompletedMatchText}>
                  Spelade matcher och resultat visas här
                </p>
              </div>
            ) : (
              <div className={styles.completedGrid}>
                {completedMatches.map(match => (
                  <div 
                    key={match.id} 
                    className={styles.completedMatchCard}
                  >
                    <div className={styles.completedMatchHeader}>
                      <span className={styles.completedMatchStatus}>
                        ✅ Avslutad
                      </span>
                      <span className={styles.completedMatchDate}>
                        {new Date(match.date).toLocaleDateString('sv-SE')}
                      </span>
                    </div>
                    <div className={styles.completedMatchTeams}>
                      <div className={styles.completedMatchTeamsInner}>
                        <div className={styles.completedMatchTeam}>
                          <div className={styles.completedMatchTeamName}>
                            {match.homeTeam}
                          </div>
                          <div className={styles.completedMatchScore + ' ' + (match.homeScore! > match.awayScore! ? styles.win : styles.lose)}>
                            {match.homeScore}
                          </div>
                          <div className={styles.completedMatchTrophy + ' ' + (match.homeScore! > match.awayScore! ? styles.win : styles.lose)}>
                            {match.homeScore! > match.awayScore! ? "🏆" : "😔"}
                          </div>
                        </div>
                        <div className={styles.completedMatchDash}>-</div>
                        <div className={styles.completedMatchTeam}>
                          <div className={styles.completedMatchTeamName}>
                            {match.awayTeam}
                          </div>
                          <div className={styles.completedMatchScore + ' ' + (match.awayScore! > match.homeScore! ? styles.win : styles.lose)}>
                            {match.awayScore}
                          </div>
                          <div className={styles.completedMatchTrophy + ' ' + (match.awayScore! > match.homeScore! ? styles.win : styles.lose)}>
                            {match.awayScore! > match.homeScore! ? "🏆" : "😔"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.completedMatchVenueBox}>
                      <span>📍</span>
                      <span className={styles.completedMatchVenue}>{match.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'planner' && isLeader() && (
          <section>
            <h2 className={styles.sectionTitle}>
              🎯 Matchplanering
            </h2>
            <p className={styles.sectionSubtitle}>
              Skapa detaljerade matchplaner med formationer, taktik och spelarinstruktioner
            </p>
            {selectedMatchId ? (
              <div className={styles.plannerBox}>
                <div className={styles.plannerBg} />
                <div className={styles.plannerHeader}>
                  <h3 className={styles.plannerTitle}>
                    Match: {matches.find(m => m.id === selectedMatchId)?.homeTeam} vs {matches.find(m => m.id === selectedMatchId)?.awayTeam}
                  </h3>
                  <button className={styles.plannerCloseBtn}
                    onClick={() => {
                      setSelectedMatchId(null);
                      toast.info('Matchplanering avslutad');
                    }}
                  >
                    ✕ Stäng planering
                  </button>
                </div>
                <div className={styles.plannerContent}>
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
              <div className={styles.plannerBoxEmpty}>
                <div className={styles.plannerBg} />
                <div className={styles.plannerContentEmpty}>
                  <span className={styles.plannerIcon}>🎯</span>
                  <h3 className={styles.plannerEmptyTitle}>
                    Välj en match att planera
                  </h3>
                  <p className={styles.plannerEmptyText}>
                    Gå till "Kommande matcher" och klicka på "📋 Planera match" för att skapa en detaljerad matchplan
                  </p>
                  <button className={styles.plannerEmptyBtn}
                    onClick={() => setActiveTab('upcoming')}
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
              <div className={styles.playbookBox}>
                <div className={styles.playbookBg} />
                <div className={styles.playbookContent}>
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
              <div className={styles.playbookBoxEmpty}>
                <div className={styles.playbookBg} />
                <div className={styles.playbookContentEmpty}>
                  <span className={styles.playbookIcon}>📖</span>
                  <h3 className={styles.playbookEmptyTitle}>
                    Välj en match för att visa playbook
                  </h3>
                  <p className={styles.playbookEmptyText}>
                    Gå till "Kommande matcher" och klicka på "📖 Visa Playbook" för att se matchplanen
                  </p>
                  <button className={styles.playbookEmptyBtn}
                    onClick={() => setActiveTab('upcoming')}
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
          <section className={styles.traditionalSection}>
            <h2 className={styles.sectionTitle}>
              📋 Traditionell Matchplanering
            </h2>
            <div className={styles.traditionalBox}>
              <MatchPlanView activityId="match-current" isLeader={true} />
            </div>
          </section>
        )}
      </div>
  );
};

export default MatchPlanPage;