
import styles from './HistoryReports.module.css';
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
        achievement: "200 matcher",
        value: 200,
        date: "2025-06-05"
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
      }
    ]);
  }, []);

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

  const exportToPDF = () => {
    alert('PDF-export kommer snart! 📄');
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setReportData({
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

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>📈 Historik & Avancerad Statistik</h2>
          <p className={styles.subtitle}>Omfattande rapporter, trender och prestationsanalys</p>
        </div>
  {isLeader() && (
          <button onClick={exportToPDF} className={styles.pdfBtn}>📄 Exportera PDF</button>
        )}
      </div>
      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={selectedTab === tab.id ? `${styles.tabBtn} ${styles.tabBtnActive}` : styles.tabBtn}
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
          <div className={styles.filters}>
            <h3 className={styles.filtersTitle}>🔍 Filtrera rapporter</h3>
            <div className={styles.filtersGrid}>
              <div>
                <label className={styles.label}>Tidsperiod</label>
                <select
                  value={filters.timeframe}
                  onChange={(e) => setFilters({...filters, timeframe: e.target.value as any})}
                  className={styles.select}
                  title="Välj tidsperiod"
                >
                  <option value="season">Hela säsongen</option>
                  <option value="month">Senaste månaden</option>
                  <option value="week">Senaste veckan</option>
                  <option value="custom">Anpassad period</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>Kategori</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value as any})}
                  className={styles.select}
                  title="Välj kategori"
                >
                  <option value="all">Alla kategorier</option>
                  <option value="goals">Mål</option>
                  <option value="assists">Assists</option>
                  <option value="points">Poäng</option>
                  <option value="saves">Räddningar</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>Formation</label>
                <select
                  value={filters.formation}
                  onChange={(e) => setFilters({...filters, formation: e.target.value as any})}
                  className={styles.select}
                  title="Välj formation"
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
              className={isGeneratingReport ? `${styles.generateBtn} ${styles.generateBtnDisabled}` : styles.generateBtn}
            >
              {isGeneratingReport ? "⏳ Genererar..." : "📊 Generera rapport"}
            </button>
          </div>
          {/* Report Results */}
          {reportData && (
            <div className={styles.report}>
              <h3 className={styles.reportTitle}>📋 Säsongsrapport 2024/25</h3>
              <div className={styles.reportGrid}>
                <div className={styles.reportCard}>
                  <div className={`${styles.reportCardNumber} ${styles.green}`}>{reportData.totalMatches}</div>
                  <div className={styles.reportCardLabel}>Spelade matcher</div>
                </div>
                <div className={styles.reportCard}>
                  <div className={`${styles.reportCardNumber} ${styles.blue}`}>{reportData.totalGoals}</div>
                  <div className={styles.reportCardLabel}>Totalt mål</div>
                </div>
                <div className={styles.reportCard}>
                  <div className={`${styles.reportCardNumber} ${styles.orange}`}>{reportData.totalAssists}</div>
                  <div className={styles.reportCardLabel}>Totalt assists</div>
                </div>
              </div>
              <div className={styles.topGrid}>
                <div className={styles.topCard}>
                  <h4 className={styles.topTitle}>🥇 Topprestationer</h4>
                  <div className={styles.topText}>
                    <div className={styles.topTextItem}><strong>Skyttekung:</strong> {reportData.topScorer.name} ({reportData.topScorer.goals} mål)</div>
                    <div className={styles.topTextItem}><strong>Flest assists:</strong> {reportData.topAssister.name} ({reportData.topAssister.assists} assist)</div>
                    <div><strong>MVP:</strong> {reportData.mvp.name} ({reportData.mvp.points} poäng)</div>
                  </div>
                </div>
                <div className={styles.topCard}>
                  <h4 className={styles.topTitle}>📊 Rekord & Milstolpar</h4>
                  <div className={styles.topText}>
                    <div className={styles.topTextItem}><strong>Bästa serie:</strong> {reportData.bestRecord}</div>
                    <div className={styles.topTextItem}><strong>Största vinst:</strong> {reportData.teamRecord}</div>
                    {reportData.playerRecords.map((record: any, index: number) => (
                      <div key={index} className={styles.topTextItem}><strong>{record.player}:</strong> {record.record}</div>
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
          <h3 className={styles.trendTitle}>📈 Prestationstrender</h3>
          {user && (
            <div className={styles.trendSection}>
              <h4 className={styles.trendSectionTitle}>Din personliga trend</h4>
              {(() => {
                const trends = getPerformanceTrends(user.id);
                return (
                  <div className={styles.trendGrid}>
                    <div className={styles.trendItem}>
                      <div className={`${styles.trendValue} ${styles.trendBlue}`}>{trends.seasonAverage.toFixed(1)}</div>
                      <div className={styles.trendLabel}>Snitt/match</div>
                    </div>
                    <div className={styles.trendItem}>
                      <div className={`${styles.trendValue} ${styles.trendGreen}`}>{trends.bestGame}</div>
                      <div className={styles.trendLabel}>Bästa match</div>
                    </div>
                    <div className={styles.trendItem}>
                      <div className={`${styles.trendValue} ${styles.trendOrange}`}>{trends.consistency.toFixed(0)}%</div>
                      <div className={styles.trendLabel}>Konsistens</div>
                    </div>
                    <div className={styles.trendItem}>
                      <div className={`${styles.trendValue} ${trends.improvement > 0 ? styles.trendGreen : styles.trendRed}`}>{trends.improvement > 0 ? "+" : ""}{trends.improvement.toFixed(1)}%</div>
                      <div className={styles.trendLabel}>Förbättring</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
          <div className={styles.trendTeamSection}>
            <h4 className={styles.trendTeamTitle}>🏆 Lagstatistik-trender</h4>
            <div className={styles.trendTeamText}>Här kommer detaljerade trendanalyser för laget över tid...</div>
          </div>
        </div>
      )}
      {/* Milestones Tab */}
      {selectedTab === 'milestones' && (
        <div>
          <h3 className={styles.milestoneTitle}>🏆 Milstolpar & Rekord</h3>
          {/* Recent Milestones */}
          <div className={styles.milestoneRecent}>
            <h4 className={styles.milestoneRecentTitle}>🎉 Senaste milstolpar</h4>
            {milestones.filter(m => m.isRecent).map(milestone => (
              <div key={milestone.id} className={styles.milestoneItem}>
                <span className={styles.milestoneIcon}>{getMilestoneIcon(milestone.type)}</span>
                <div className={styles.milestoneFlex}>
                  <div className={styles.milestonePlayer}>{getPlayerName(milestone.playerId)} - {milestone.achievement}</div>
                  <div className={styles.milestoneDate}>{new Date(milestone.date).toLocaleDateString('sv-SE')}</div>
                </div>
                <div className={styles.milestoneNew}>NYT!</div>
              </div>
            ))}
          </div>
          {/* All Milestones */}
          <div className={styles.milestoneAll}>
            <h4 className={styles.milestoneAllTitle}>📊 Alla milstolpar</h4>
            {milestones.map(milestone => (
              <div key={milestone.id} className={styles.milestoneItem}>
                <span className={styles.milestoneIcon}>{getMilestoneIcon(milestone.type)}</span>
                <div className={styles.milestoneFlex}>
                  <div className={styles.milestonePlayer}>{getPlayerName(milestone.playerId)} - {milestone.achievement}</div>
                  <div className={styles.milestoneDate}>{new Date(milestone.date).toLocaleDateString('sv-SE')}</div>
                </div>
                <div className={styles.milestoneValue}>{milestone.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Awards Tab */}
      {selectedTab === 'awards' && (
        <div>
          <h3 className={styles.awardMainTitle}>🥇 Utmärkelser & MVP</h3>
          <div className={styles.awardsGrid}>
            {awards.map(award => (
              <div key={award.id} className={award.type.includes('mvp') ? `${styles.awardCard} ${styles.awardCardMvp}` : styles.awardCard}>
                <div className={styles.awardHeader}>
                  <span className={styles.awardIcon}>{getAwardIcon(award.type)}</span>
                  <div className={styles.awardTitle}>{award.title}</div>
                </div>
                <div className={styles.awardPlayer}><strong>{getPlayerName(award.playerId)}</strong></div>
                <div className={styles.awardDesc}>{award.description}</div>
                <div className={styles.awardFooter}>
                  <span>{award.period}</span>
                  <span>{new Date(award.date).toLocaleDateString('sv-SE')}</span>
                </div>
              </div>
            ))}
          </div>
          {/* MVP Voting Section */}
          {isLeader() && (
            <div className={styles.mvpSection}>
              <h4 className={styles.mvpTitle}>👑 Nominera veckans spelare</h4>
              <div className={styles.mvpRow}>
                <select className={styles.mvpSelect} title="Välj spelare att nominera">
                  <option value="">Välj spelare...</option>
                  <option value="1">Simon Andersson</option>
                  <option value="2">Anna Svensson</option>
                  <option value="3">Mikael Berg</option>
                  <option value="4">Lisa Johansson</option>
                </select>
                <button className={styles.mvpBtn}>Nominera</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default HistoryReports;
