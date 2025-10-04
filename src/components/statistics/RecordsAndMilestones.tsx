import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

import styles from './RecordsAndMilestones.module.css';

interface Achievement {
  id: string;
  playerId: string;
  type: 'milestone' | 'record' | 'streak' | 'performance' | 'team_contribution';
  category: 'goals' | 'assists' | 'points' | 'saves' | 'games' | 'special';
  title: string;
  description: string;
  value: number;
  unit: string;
  dateAchieved: string;
  isPersonalBest: boolean;
  isTeamRecord: boolean;
  isLeagueRecord: boolean;
  seasonContext: string;
  celebrationIcon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

const RecordsAndMilestones: React.FC = () => {
  const { user } = useAuth();
  
  const [selectedTab, setSelectedTab] = useState<'recent' | 'personal' | 'team' | 'league'>('recent');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [celebratingAchievement, setCelebratingAchievement] = useState<Achievement | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRarity, setFilterRarity] = useState<string>('all');

  useEffect(() => {
    // Mock achievements data
    setAchievements([
      {
        id: 'a1',
        playerId: '2',
        type: 'milestone',
        category: 'goals',
        title: '50 Mål i Karriären!',
        description: 'Anna Svensson når den magiska 50-målsgränsen',
        value: 50,
        unit: 'mål',
        dateAchieved: '2025-06-20',
        isPersonalBest: true,
        isTeamRecord: false,
        isLeagueRecord: false,
        seasonContext: 'Säsong 2024/25',
        celebrationIcon: '⚽',
        rarity: 'epic'
      },
      {
        id: 'a2',
        playerId: '1',
        type: 'record',
        category: 'points',
        title: 'Säsongens Poängkung!',
        description: 'Simon Andersson slår klubbrekord med 100 poäng på en säsong',
        value: 100,
        unit: 'poäng',
        dateAchieved: '2025-06-15',
        isPersonalBest: true,
        isTeamRecord: true,
        isLeagueRecord: false,
        seasonContext: 'Säsong 2024/25',
        celebrationIcon: '👑',
        rarity: 'legendary'
      },
      {
        id: 'a3',
        playerId: '3',
        type: 'streak',
        category: 'saves',
        title: 'Obesegrad i 5 Matcher!',
        description: 'Mikael Berg håller nollan 5 matcher i rad',
        value: 5,
        unit: 'matcher',
        dateAchieved: '2025-06-18',
        isPersonalBest: true,
        isTeamRecord: false,
        isLeagueRecord: false,
        seasonContext: 'Juni 2025',
        celebrationIcon: '🥅',
        rarity: 'rare'
      },
      {
        id: 'a4',
        playerId: '4',
        type: 'performance',
        category: 'special',
        title: 'Hat-trick Hjälte!',
        description: 'Lisa Johansson gör hat-trick på bara 4:32',
        value: 3,
        unit: 'mål på 4:32',
        dateAchieved: '2025-06-18',
        isPersonalBest: true,
        isTeamRecord: true,
        isLeagueRecord: true,
        seasonContext: 'vs Hammarby IBK',
        celebrationIcon: '⭐',
        rarity: 'legendary'
      },
      {
        id: 'a5',
        playerId: '1',
        type: 'milestone',
        category: 'games',
        title: '100 Matcher för Klubben!',
        description: 'Simon Andersson når 100 spelade matcher',
        value: 100,
        unit: 'matcher',
        dateAchieved: '2025-05-28',
        isPersonalBest: true,
        isTeamRecord: false,
        isLeagueRecord: false,
        seasonContext: 'Karriär',
        celebrationIcon: '🏒',
        rarity: 'epic'
      },
      {
        id: 'a6',
        playerId: '2',
        type: 'team_contribution',
        category: 'assists',
        title: 'Passningsmaskin!',
        description: 'Anna Svensson når 75 assists i karriären',
        value: 75,
        unit: 'assists',
        dateAchieved: '2025-06-10',
        isPersonalBest: true,
        isTeamRecord: false,
        isLeagueRecord: false,
        seasonContext: 'Karriär',
        celebrationIcon: '🎯',
        rarity: 'rare'
      }
    ]);

    // Auto-celebrate recent achievements
    const recentAchievements = achievements.filter(a => {
      const achievedDate = new Date(a.dateAchieved);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return achievedDate >= threeDaysAgo;
    });

    if (recentAchievements.length > 0) {
      setTimeout(() => {
        const firstAchievement = recentAchievements[0];
        if (firstAchievement) {
          setCelebratingAchievement(firstAchievement);
        }
      }, 1000);
    }
  }, [achievements]);

  const getPlayerName = (playerId: string) => {
    const players = [
      { id: '1', name: 'Simon Andersson' },
      { id: '2', name: 'Anna Svensson' },
      { id: '3', name: 'Mikael Berg' },
      { id: '4', name: 'Lisa Johansson' }
    ];
    return players.find(p => p.id === playerId)?.name || 'Okänd spelare';
  };



  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = filterCategory === 'all' || achievement.category === filterCategory;
    const rarityMatch = filterRarity === 'all' || achievement.rarity === filterRarity;
    
    switch (selectedTab) {
      case 'recent':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(achievement.dateAchieved) >= weekAgo && categoryMatch && rarityMatch;
      case 'personal':
        return achievement.playerId === user?.id && categoryMatch && rarityMatch;
      case 'team':
        return achievement.isTeamRecord && categoryMatch && rarityMatch;
      case 'league':
        return achievement.isLeagueRecord && categoryMatch && rarityMatch;
      default:
        return categoryMatch && rarityMatch;
    }
  });

  const tabs = [
    { id: 'recent', name: 'Senaste Veckan', icon: '🔥' },
    { id: 'personal', name: 'Mina Rekord', icon: '👤' },
    { id: 'team', name: 'Klubbrekord', icon: '🏆' },
    { id: 'league', name: 'Ligrekord', icon: '🌟' }
  ];

  return (
    <div className={styles.container}>
      {/* Celebration Overlay */}
      {celebratingAchievement && (
        <div className={styles.celebrationOverlay}>
          <div
            className={`${styles.celebrationModal} ${styles[`rarity-${celebratingAchievement.rarity}`]}`}
          >
            <div className={styles.celebrationIcon}>{celebratingAchievement.celebrationIcon}</div>
            <h2
              className={`${styles.celebrationTitle} ${styles[`rarity-${celebratingAchievement.rarity}`]}`}
            >
              {celebratingAchievement.title}
            </h2>
            <p className={styles.celebrationDesc}>{celebratingAchievement.description}</p>
            <div
              className={`${styles.celebrationRarity} ${styles[`rarity-bg-${celebratingAchievement.rarity}`]}`}
            >
              {celebratingAchievement.rarity} Achievement
            </div>
            <button
              onClick={() => setCelebratingAchievement(null)}
              className={styles.celebrationButton}
            >
              Fantastiskt! 🎉
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={styles.headerWrapper}>
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>🏆 Rekord & Milstolpar</h2>
          <p className={styles.headerDesc}>Fira framgångar och följ prestationshistorik</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={selectedTab === tab.id ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div>
          <label className={styles.filterLabel}>Kategori</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filtrera på kategori"
            title="Filtrera på kategori"
          >
            <option value="all">Alla kategorier</option>
            <option value="goals">Mål</option>
            <option value="assists">Assists</option>
            <option value="points">Poäng</option>
            <option value="saves">Räddningar</option>
            <option value="games">Matcher</option>
            <option value="special">Speciella</option>
          </select>
        </div>
        <div>
          <label className={styles.filterLabel}>Sällsynthet</label>
          <select
            value={filterRarity}
            onChange={(e) => setFilterRarity(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filtrera på sällsynthet"
            title="Filtrera på sällsynthet"
          >
            <option value="all">Alla nivåer</option>
            <option value="common">Vanlig</option>
            <option value="uncommon">Ovanlig</option>
            <option value="rare">Sällsynt</option>
            <option value="epic">Episk</option>
            <option value="legendary">Legendarisk</option>
          </select>
        </div>
        <div>
          <span className={styles.filterCount}>{filteredAchievements.length} achievements</span>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className={styles.achievementsGrid}>
        {filteredAchievements.map(achievement => (
          <div
            key={achievement.id}
            className={`${styles.achievementCard} ${styles[`rarity-${achievement.rarity}`]}`}
          >
            {/* Rarity indicator */}
            <div
              className={`${styles.rarityIndicator} ${styles[`rarity-bg-${achievement.rarity}`]}`}
            >
              {achievement.rarity}
            </div>

            {/* Achievement icon */}
            <div className={styles.achievementIcon}>
              {achievement.celebrationIcon}
            </div>

            {/* Title and description */}
            <h3
              className={`${styles.achievementTitle} ${styles[`rarity-color-${achievement.rarity}`]}`}
            >
              {achievement.title}
            </h3>

            <p className={styles.achievementDesc}>
              {achievement.description}
            </p>

            {/* Player and value */}
            <div className={styles.achievementInfo}>
              <div className={styles.achievementInfoRow}>
                <span className={styles.achievementPlayer}>{getPlayerName(achievement.playerId)}</span>
                <span className={`${styles.achievementValue} ${styles[`rarity-color-${achievement.rarity}`]}`}>{achievement.value} {achievement.unit}</span>
              </div>
              <div className={styles.achievementContext}>
                {achievement.seasonContext}
              </div>
            </div>

            {/* Badges */}
            <div className={styles.badges}>
              {achievement.isPersonalBest && (
                <span className={`${styles.badge} ${styles.badgePersonal}`}>🏅 Personbästa</span>
              )}
              {achievement.isTeamRecord && (
                <span className={`${styles.badge} ${styles.badgeTeam}`}>🏆 Klubbrekord</span>
              )}
              {achievement.isLeagueRecord && (
                <span className={`${styles.badge} ${styles.badgeLeague}`}>🌟 Ligrekord</span>
              )}
            </div>

            {/* Date */}
            <div className={styles.achievementDate}>
              {new Date(achievement.dateAchieved).toLocaleDateString('sv-SE')}
            </div>

            {/* Celebrate button */}
            {achievement.playerId === user?.id && (
              <button
                onClick={() => setCelebratingAchievement(achievement)}
                className={styles.celebrateButton}
              >
                🎉 Fira igen
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏆</div>
          <h3 className={styles.emptyTitle}>Inga achievements hittades</h3>
          <p className={styles.emptyDesc}>
            Fortsätt spela för att låsa upp nya rekord och milstolpar!
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default RecordsAndMilestones;
