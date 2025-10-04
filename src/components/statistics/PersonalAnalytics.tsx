import React, { useState } from 'react';
import { useStatistics } from '../../context/StatisticsContext';
import { useAuth } from '../../context/AuthContext';

import styles from './PersonalAnalytics.module.css';

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  trend?: number;
  subtitle?: string;
}

const PersonalAnalytics: React.FC = () => {
  const [selectedStat, setSelectedStat] = useState<'points' | 'goals' | 'assists'>('points');
  
  const { 
    getSummaryForUser, 
    getPerformanceTrends, 
    getRecentGamesForUser,
    getLeaderboard 
  } = useStatistics();
  
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Logga in för att se din personliga analys</p>
      </div>
    );
  }

  const stats = getSummaryForUser(user.id);
  const trends = getPerformanceTrends(user.id);
  const recentGames = getRecentGamesForUser(user.id, 5);
  const leaderboard = getLeaderboard(selectedStat);
  const userRank = leaderboard.find(item => item.userId === user.id);

  const statCards: StatCard[] = [
    {
      title: 'Poäng',
      value: stats.points,
      icon: '🎯',
      trend: trends.improvement,
      subtitle: `${stats.goals}G + ${stats.assists}A`
    },
    {
      title: 'Matcher',
      value: stats.gamesPlayed,
      icon: '🏒',
      subtitle: 'Spelade'
    },
    {
      title: 'Skott %',
      value: `${stats.shotPercentage.toFixed(1)}%`,
      icon: '🥅',
      subtitle: `${stats.shotsOnGoal}/${stats.shots}`
    },
    {
      title: '+/-',
      value: stats.plusMinus > 0 ? `+${stats.plusMinus}` : stats.plusMinus,
      icon: stats.plusMinus >= 0 ? '📈' : '📉',
      trend: stats.plusMinus
    },
    {
      title: 'Istid',
      value: `${stats.avgTimeOnIce.toFixed(1)}min`,
      icon: '⏱️',
      subtitle: 'Per match'
    },
    {
      title: 'Faceoff %',
      value: `${stats.faceoffPercentage.toFixed(1)}%`,
      icon: '🏴',
      subtitle: `${stats.faceoffWins}/${stats.faceoffTotal}`
    }
  ];

  const getPerformanceGrade = (): { grade: string; color: string; description: string } => {
    const pointsPerGame = stats.gamesPlayed > 0 ? stats.points / stats.gamesPlayed : 0;
    
    if (pointsPerGame >= 2) return { grade: 'A+', color: 'text-green-600', description: 'Exceptionell' };
    if (pointsPerGame >= 1.5) return { grade: 'A', color: 'text-green-500', description: 'Mycket bra' };
    if (pointsPerGame >= 1) return { grade: 'B+', color: 'text-blue-500', description: 'Bra' };
    if (pointsPerGame >= 0.7) return { grade: 'B', color: 'text-blue-400', description: 'Genomsnitt' };
    if (pointsPerGame >= 0.5) return { grade: 'C+', color: 'text-yellow-500', description: 'Under genomsnitt' };
    return { grade: 'C', color: 'text-orange-500', description: 'Förbättring krävs' };
  };

  const performanceGrade = getPerformanceGrade();

  const getConsistencyText = (consistency: number): { text: string; color: string } => {
    if (consistency >= 80) return { text: 'Mycket konsekvent', color: 'text-green-600' };
    if (consistency >= 60) return { text: 'Konsekvent', color: 'text-blue-500' };
    if (consistency >= 40) return { text: 'Något inkonsekvent', color: 'text-yellow-500' };
    return { text: 'Inkonsekvent', color: 'text-orange-500' };
  };

  const consistencyInfo = getConsistencyText(trends.consistency);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Din Prestationsanalys</h2>
            <p className="text-blue-100">Säsong 2024/25 • {stats.gamesPlayed} matcher</p>
          </div>
          
          <div className="text-center">
            <div className={`text-4xl font-bold ${performanceGrade.color} bg-white bg-opacity-20 rounded-lg p-4`}>
              {performanceGrade.grade}
            </div>
            <p className="text-sm mt-2">{performanceGrade.description}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{card.icon}</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </span>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {card.value}
            </div>
            
            {card.subtitle && (
              <p className="text-xs text-gray-500">{card.subtitle}</p>
            )}
            
            {card.trend !== undefined && (
              <div className={`text-xs mt-1 ${
                card.trend > 0 ? 'text-green-500' : 
                card.trend < 0 ? 'text-red-500' : 'text-gray-500'
              }`}>
                {card.trend > 0 ? '↗' : card.trend < 0 ? '↘' : '→'} 
                {Math.abs(card.trend).toFixed(1)}%
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trends */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Prestationstrend
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{trends.seasonAverage.toFixed(1)}</div>
              <div className="text-sm text-gray-500">Snitt per match</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{trends.bestGame}</div>
              <div className="text-sm text-gray-500">Bästa match</div>
            </div>
          </div>

          {/* Last 5 Games Chart */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senaste 5 matcherna (poäng)
            </h4>
            <div className="flex items-end justify-between h-20 gap-2">
              {trends.last5Games.map((points, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  {(() => {
                    const maxBarHeight = 60;
                    const minBarHeight = 10;
                    const rawHeight = Math.max(minBarHeight, (points / Math.max(...trends.last5Games, 1)) * maxBarHeight);
                    const roundedHeight = Math.round(rawHeight / 5) * 5;
                    const barClass = styles[`chartBarHeight${roundedHeight}`] || styles.chartBarHeight10;
                    return (
                      <div
                        className={`bg-blue-500 rounded-t w-full min-h-1 ${barClass}`}
                      />
                    );
                  })()}
                  <span className="text-xs text-gray-500 mt-1">{points}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Konsistens: </span>
              <span className={consistencyInfo.color}>
                {consistencyInfo.text}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Förbättring: </span>
              <span className={trends.improvement > 0 ? 'text-green-500' : 'text-red-500'}>
                {trends.improvement > 0 ? '+' : ''}{trends.improvement.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* League Position */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Lagets Ranking
          </h3>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">
                #{userRank?.rank || '-'}
              </div>
              <div className="text-sm text-gray-500">
                {selectedStat === 'points' ? 'Poäng' : 
                 selectedStat === 'goals' ? 'Mål' : 'Assists'}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="statSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Välj statistiktyp
              </label>
              <select
                id="statSelect"
                aria-label="Välj statistiktyp"
                value={selectedStat}
                onChange={(e) => setSelectedStat(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700"
              >
                <option value="points">Poäng</option>
                <option value="goals">Mål</option>
                <option value="assists">Assists</option>
              </select>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <div>Bäst i laget: {leaderboard[0]?.value || 0}</div>
              <div>Ditt värde: {userRank?.value || 0}</div>
              <div>
                Skillnad: {userRank ? (leaderboard[0]?.value || 0) - userRank.value : 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Games */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Senaste Matcherna
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2">Datum</th>
                <th className="text-left py-2">Motståndare</th>
                <th className="text-center py-2">Resultat</th>
                <th className="text-center py-2">P</th>
                <th className="text-center py-2">M</th>
                <th className="text-center py-2">A</th>
                <th className="text-center py-2">+/-</th>
                <th className="text-center py-2">Skott</th>
              </tr>
            </thead>
            <tbody>
              {recentGames.map((game) => (
                <tr key={game.gameId} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-2">
                    {new Date(game.date).toLocaleDateString('sv-SE')}
                  </td>
                  <td className="py-2">
                    {game.isHome ? 'vs' : '@'} {game.opponent}
                  </td>
                  <td className="text-center py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      game.result === 'win' ? 'bg-green-100 text-green-800' :
                      game.result === 'loss' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {game.goalsFor}-{game.goalsAgainst}
                    </span>
                  </td>
                  <td className="text-center py-2 font-medium">
                    {game.personalStats.points}
                  </td>
                  <td className="text-center py-2">{game.personalStats.goals}</td>
                  <td className="text-center py-2">{game.personalStats.assists}</td>
                  <td className={`text-center py-2 ${
                    game.personalStats.plusMinus > 0 ? 'text-green-600' :
                    game.personalStats.plusMinus < 0 ? 'text-red-600' : ''
                  }`}>
                    {game.personalStats.plusMinus > 0 ? '+' : ''}{game.personalStats.plusMinus}
                  </td>
                  <td className="text-center py-2">
                    {game.personalStats.shotsOnGoal}/{game.personalStats.shots}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {recentGames.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Inga matcher spelade än denna säsong
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalAnalytics;
