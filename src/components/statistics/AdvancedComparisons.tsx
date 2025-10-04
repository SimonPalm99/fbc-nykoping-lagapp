
import React, { useState, useEffect } from 'react';

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
  recentForm: string[];
}

interface PlayerComparison {
  playerId: string;
  name: string;
  currentSeason: {
    goals: number;
    assists: number;
    points: number;
    games: number;
  };
  lastSeason: {
    goals: number;
    assists: number;
    points: number;
    games: number;
  };
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
  recentForm: string[];
}

const AdvancedComparisons: React.FC = () => {
  // Dynamiska klassnamn för färger
    const getImprovementColorClass = (improvement: number) => {
      if (improvement > 20) return "farg-gron";
      if (improvement > 0) return "farg-orange";
      if (improvement > -20) return "farg-rod";
      return "farg-morkrod";
    };

    const getImprovementBgClass = (improvement: number) => {
      if (improvement > 20) return "bg-gron";
      if (improvement > 0) return "bg-orange";
      if (improvement > -20) return "bg-rod";
      return "bg-morkrod";
    };

    const getRankingChangeClass = (change: number) => {
      if (change > 0) return "farg-gron";
      if (change < 0) return "farg-rod";
      return "farg-gragul";
    };
  
  const [selectedTab, setSelectedTab] = useState<'players' | 'team' | 'opponents' | 'timeline'>('players');
  const [playerComparisons, setPlayerComparisons] = useState<PlayerComparison[]>([]);
  // teamComparisons används i JSX för lagjämförelse-tabben. Lint-varning kan ignoreras.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        ranking: { current: 4, previous: 6, change: 2 },
        recentForm: ["W", "L", "W", "W", "D"]
      },
      {
        playerId: "2", 
        name: "Anna Svensson",
        currentSeason: { goals: 15, assists: 12, points: 27, games: 19 },
        lastSeason: { goals: 12, assists: 8, points: 20, games: 18 },
        improvement: { goals: 25, assists: 50, points: 35, consistency: 20 },
        ranking: { current: 1, previous: 2, change: 1 },
        recentForm: ["W", "W", "D", "L", "W"]
      },
      {
        playerId: "3",
        name: "Erik Nilsson", 
        currentSeason: { goals: 3, assists: 15, points: 18, games: 17 },
        lastSeason: { goals: 5, assists: 10, points: 15, games: 19 },
        improvement: { goals: -40, assists: 50, points: 20, consistency: 10 },
        ranking: { current: 5, previous: 4, change: -1 },
        recentForm: ["L", "W", "L", "D", "W"]
      },
      {
        playerId: "4",
        name: "Lisa Johansson",
        currentSeason: { goals: 9, assists: 7, points: 16, games: 16 },
        lastSeason: { goals: 6, assists: 4, points: 10, games: 15 },
        improvement: { goals: 50, assists: 75, points: 60, consistency: 25 },
        ranking: { current: 6, previous: 8, change: 2 },
        recentForm: ["W", "W", "W", "L", "D"]
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
  <div className="wrapper">
    {/* Header */}
    <div className="header">
      <h2 className="titel">📊 Avancerade Jämförelser</h2>
      <p className="beskrivning">Jämför prestationer över tid och mellan spelare, lag och motståndare</p>
    </div>

    {/* Tabs */}
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedTab(tab.id as any)}
          className={`tabKnapp${selectedTab === tab.id ? ' tabKnappAktiv' : ''}`}
        >
          <span>{tab.icon}</span>
          {tab.name}
        </button>
      ))}
    </div>

    {/* Players Comparison Tab */}
    {selectedTab === 'players' && (
      <div>
        <div className="valSpelareBox">
          <h3 className="valSpelareRubrik">Välj spelare att jämföra (max 3)</h3>
          <div className="valSpelareGrid">
            {playerComparisons.map(player => (
              <button
                key={player.playerId}
                onClick={() => togglePlayerSelection(player.playerId)}
                className={`spelareKnapp${selectedPlayers.includes(player.playerId) ? ' spelareKnappVald' : ''}`}
              >
                {player.name}
              </button>
            ))}
          </div>
        </div>

        {selectedPlayers.length > 0 && (
          <div className="jamforelseBox">
            <h3 className="jamforelseRubrik">📈 Jämförelse - Aktuell vs Föregående säsong</h3>
            <div className="tabellScroll">
              <table className="tabell">
                <thead>
                  <tr className="tabellTr">
                    <th className="tabellTh">Spelare</th>
                    <th className="tabellTh tabellThCenter">Mål (Δ)</th>
                    <th className="tabellTh tabellThCenter">Assists (Δ)</th>
                    <th className="tabellTh tabellThCenter">Poäng (Δ)</th>
                    <th className="tabellTh tabellThCenter">Ranking</th>
                    <th className="tabellTh tabellThCenter">Förbättring</th>
                  </tr>
                </thead>
                <tbody>
                  {playerComparisons
                    .filter(p => selectedPlayers.includes(p.playerId))
                    .map(player => (
                      <tr key={player.playerId} className="tabellTr">
                        <td className="tabellTd tabellRanking">{player.name}</td>
                        <td className="tabellTd tabellTdCenter">
                          <div>{player.currentSeason.goals}</div>
                          <div className={`tabellRankingChange ${getImprovementColorClass(player.improvement.goals)}`}>
                            ({player.improvement.goals > 0 ? "+" : ""}{player.improvement.goals}%)
                          </div>
                        </td>
                        <td className="tabellTd tabellTdCenter">
                          <div>{player.currentSeason.assists}</div>
                          <div className={`tabellRankingChange ${getImprovementColorClass(player.improvement.assists)}`}>
                            ({player.improvement.assists > 0 ? "+" : ""}{player.improvement.assists}%)
                          </div>
                        </td>
                        <td className="tabellTd tabellTdCenter">
                          <div className="tabellPoang">{player.currentSeason.points}</div>
                          <div className={`tabellRankingChange ${getImprovementColorClass(player.improvement.points)}`}>
                            ({player.improvement.points > 0 ? "+" : ""}{player.improvement.points}%)
                          </div>
                        </td>
                        <td className="tabellTd tabellTdCenter">
                          <div className="tabellRanking">#{player.ranking.current}</div>
                          <div className={`tabellRankingChange ${getRankingChangeClass(player.ranking.change)}`}>
                            {player.ranking.change > 0 ? "↗" : player.ranking.change < 0 ? "↘" : "→"} 
                            {Math.abs(player.ranking.change)}
                          </div>
                        </td>
                        <td className="tabellTd tabellTdCenter">
                          <div className={`konsistensBox ${getImprovementBgClass(player.improvement.consistency)}`}>
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
          <h3 className="lagRubrik">🏆 Lagjämförelse</h3>
          <div className="tabellScroll">
            <table className="tabell">
              <thead>
                <tr className="tabellTr">
                  <th className="tabellTh">Kategori</th>
                  <th className="tabellTh tabellThCenter">Nuvarande</th>
                  <th className="tabellTh tabellThCenter">Föregående</th>
                  <th className="tabellTh tabellThCenter">Förbättring</th>
                  <th className="tabellTh tabellThCenter">Bäst i historien</th>
                  <th className="tabellTh tabellThCenter">Rekord?</th>
                </tr>
              </thead>
              <tbody>
                {teamComparisons.map((team, idx) => (
                  <tr key={idx} className="tabellTr">
                    <td className="tabellTd">{team.category}</td>
                    <td className="tabellTd tabellTdCenter">{team.current}</td>
                    <td className="tabellTd tabellTdCenter">{team.previous}</td>
                    <td className={`tabellTd tabellTdCenter ${getImprovementColorClass(team.improvement)}`}>
                      {team.improvement > 0 ? "+" : ""}{team.improvement}%
                    </td>
                    <td className="tabellTd tabellTdCenter">{team.bestInHistory}</td>
                    <td className="tabellTd tabellTdCenter">
                      {team.isRecord ? "🏅" : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Opponents Comparison Tab */}
      {selectedTab === 'opponents' && (
        <div>
          <h3 className="motRubrik">⚔️ Statistik mot motståndare</h3>
          <div className="motGrid">
            {opponentComparisons.map((opponent, index) => (
              <div 
                key={index}
                className="motKort"
              >
                <h4 className="motKortRubrik">{opponent.opponent}</h4>
                <div className="motKortGrid">
                  <div className="motKortVinster">
                    {opponent.wins}
                    <div className="motKortLabel">Vinster</div>
                  </div>
                  <div className="motKortForluster">
                    {opponent.losses}
                    <div className="motKortLabel">Förluster</div>
                  </div>
                  <div className="motKortOavgjorda">
                    {opponent.draws}
                    <div className="motKortLabel">Oavgjorda</div>
                  </div>
                  <div className="motKortVinstprocent">
                    {opponent.winRate.toFixed(0)}%
                    <div className="motKortLabel">Vinstprocent</div>
                  </div>
                </div>
                <div className="motKortSenaste">
                  <div className="motKortSenasteLabel">Senaste mötet:</div>
                  <div className="motKortSenasteVarde">
                    {new Date(opponent.lastMeeting.date).toLocaleDateString('sv-SE')} - 
                    {opponent.lastMeeting.result === 'W' ? ' Vinst ' : opponent.lastMeeting.result === 'L' ? ' Förlust ' : ' Oavgjort '}
                    ({opponent.lastMeeting.score})
                  </div>
                </div>
                <div>
                  <div className="motKortForm">Senaste form (5 matcher):</div>
                  <div className="motKortFormIkoner">
                    {opponent.recentForm.map((result, i) => (
                      <span key={i} className="motKortFormIkon">
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
          <h3 className="tidslinjeRubrik">📅 Säsongstidslinje</h3>
          <div className="tidslinjeBox">
            <div className="tidslinjeText">
              <p>Här kommer en interaktiv tidslinje som visar:</p>
              <ul className="tidslinjeLista">
                <li>Säsongens viktiga händelser och milstolpar</li>
                <li>Prestationsutveckling över tid</li>
                <li>Jämförelser mellan olika månader/perioder</li>
                <li>Trendanalys för lag och individuella spelare</li>
                <li>Automatiska "före och efter"-jämförelser</li>
              </ul>
              <p className="tidslinjeP">
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
