import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

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
  }, []);

  const getPlayerName = (playerId: string) => {
    const players = [
      { id: '1', name: 'Simon Andersson' },
      { id: '2', name: 'Anna Svensson' },
      { id: '3', name: 'Mikael Berg' },
      { id: '4', name: 'Lisa Johansson' }
    ];
    return players.find(p => p.id === playerId)?.name || 'Okänd spelare';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#64748b';
      case 'uncommon': return '#10b981';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const getRarityGlow = (rarity: string) => {
    const color = getRarityColor(rarity);
    return `0 0 20px ${color}40, 0 0 40px ${color}20`;
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
    <div style={{
      background: "#1a202c",
      padding: "20px",
      borderRadius: "12px",
      color: "#fff",
      position: "relative"
    }}>
      {/* Celebration Overlay */}
      {celebratingAchievement && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          animation: "fadeIn 0.5s ease-in"
        }}>
          <div style={{
            background: "linear-gradient(135deg, #1a202c, #2d3748)",
            padding: "40px",
            borderRadius: "20px",
            textAlign: "center",
            border: `3px solid ${getRarityColor(celebratingAchievement.rarity)}`,
            boxShadow: getRarityGlow(celebratingAchievement.rarity),
            animation: "pulse 2s infinite"
          }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>
              {celebratingAchievement.celebrationIcon}
            </div>
            <h2 style={{ 
              margin: "0 0 8px 0", 
              color: getRarityColor(celebratingAchievement.rarity),
              fontSize: "28px",
              fontWeight: "bold"
            }}>
              {celebratingAchievement.title}
            </h2>
            <p style={{ 
              margin: "0 0 16px 0", 
              color: "#a0aec0",
              fontSize: "16px"
            }}>
              {celebratingAchievement.description}
            </p>
            <div style={{
              background: getRarityColor(celebratingAchievement.rarity),
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "20px",
              textTransform: "uppercase"
            }}>
              {celebratingAchievement.rarity} Achievement
            </div>
            <button
              onClick={() => setCelebratingAchievement(null)}
              style={{
                padding: "12px 24px",
                background: "#3b82f6",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Fantastiskt! 🎉
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>
          🏆 Rekord & Milstolpar
        </h2>
        <p style={{ margin: "4px 0 0 0", color: "#a0aec0" }}>
          Fira framgångar och följ prestationshistorik
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

      {/* Filters */}
      <div style={{
        background: "#2d3748",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "20px",
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#a0aec0" }}>
            Kategori
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: "6px",
              background: "#1a202c",
              border: "1px solid #4a5568",
              borderRadius: "4px",
              color: "#fff",
              fontSize: "14px"
            }}
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
          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#a0aec0" }}>
            Sällsynthet
          </label>
          <select
            value={filterRarity}
            onChange={(e) => setFilterRarity(e.target.value)}
            style={{
              padding: "6px",
              background: "#1a202c",
              border: "1px solid #4a5568",
              borderRadius: "4px",
              color: "#fff",
              fontSize: "14px"
            }}
          >
            <option value="all">Alla nivåer</option>
            <option value="common">Vanlig</option>
            <option value="uncommon">Ovanlig</option>
            <option value="rare">Sällsynt</option>
            <option value="epic">Episk</option>
            <option value="legendary">Legendarisk</option>
          </select>
        </div>

        <div style={{ marginLeft: "auto", fontSize: "14px", color: "#a0aec0" }}>
          {filteredAchievements.length} achievements
        </div>
      </div>

      {/* Achievements Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "16px"
      }}>
        {filteredAchievements.map(achievement => (
          <div
            key={achievement.id}
            style={{
              background: "linear-gradient(135deg, #2d3748, #1a202c)",
              padding: "20px",
              borderRadius: "12px",
              border: `2px solid ${getRarityColor(achievement.rarity)}`,
              boxShadow: achievement.rarity === 'legendary' || achievement.rarity === 'epic' 
                ? getRarityGlow(achievement.rarity) 
                : "none",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Rarity indicator */}
            <div style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: getRarityColor(achievement.rarity),
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "10px",
              fontWeight: "600",
              textTransform: "uppercase"
            }}>
              {achievement.rarity}
            </div>

            {/* Achievement icon */}
            <div style={{
              fontSize: "48px",
              textAlign: "center",
              marginBottom: "12px"
            }}>
              {achievement.celebrationIcon}
            </div>

            {/* Title and description */}
            <h3 style={{
              margin: "0 0 8px 0",
              color: getRarityColor(achievement.rarity),
              fontWeight: "700",
              fontSize: "18px",
              textAlign: "center"
            }}>
              {achievement.title}
            </h3>

            <p style={{
              margin: "0 0 12px 0",
              color: "#a0aec0",
              fontSize: "14px",
              textAlign: "center",
              lineHeight: "1.4"
            }}>
              {achievement.description}
            </p>

            {/* Player and value */}
            <div style={{
              background: "#1a202c",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "12px"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px"
              }}>
                <span style={{ fontWeight: "600", color: "#fff" }}>
                  {getPlayerName(achievement.playerId)}
                </span>
                <span style={{
                  color: getRarityColor(achievement.rarity),
                  fontWeight: "700",
                  fontSize: "18px"
                }}>
                  {achievement.value} {achievement.unit}
                </span>
              </div>
              
              <div style={{
                fontSize: "12px",
                color: "#718096"
              }}>
                {achievement.seasonContext}
              </div>
            </div>

            {/* Badges */}
            <div style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginBottom: "8px"
            }}>
              {achievement.isPersonalBest && (
                <span style={{
                  background: "#10b981",
                  color: "#fff",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: "600"
                }}>
                  🏅 Personbästa
                </span>
              )}
              {achievement.isTeamRecord && (
                <span style={{
                  background: "#f59e0b",
                  color: "#fff",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: "600"
                }}>
                  🏆 Klubbrekord
                </span>
              )}
              {achievement.isLeagueRecord && (
                <span style={{
                  background: "#8b5cf6",
                  color: "#fff",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: "600"
                }}>
                  🌟 Ligrekord
                </span>
              )}
            </div>

            {/* Date */}
            <div style={{
              fontSize: "11px",
              color: "#64748b",
              textAlign: "right"
            }}>
              {new Date(achievement.dateAchieved).toLocaleDateString('sv-SE')}
            </div>

            {/* Celebrate button */}
            {achievement.playerId === user?.id && (
              <button
                onClick={() => setCelebratingAchievement(achievement)}
                style={{
                  position: "absolute",
                  bottom: "12px",
                  left: "12px",
                  padding: "4px 8px",
                  background: "rgba(59, 130, 246, 0.8)",
                  border: "none",
                  borderRadius: "4px",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontWeight: "600"
                }}
              >
                🎉 Fira igen
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "40px",
          color: "#a0aec0"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏆</div>
          <h3 style={{ margin: "0 0 8px 0" }}>Inga achievements hittades</h3>
          <p style={{ margin: 0 }}>
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
