import React, { useState, useCallback, useEffect } from 'react';
import { User } from '../../types/user';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import SportIcon from '../ui/SportIcon';
import { ProfileHeaderSkeleton, ProfileStatsSkeleton, ProfileBadgesSkeleton } from '../layout/SkeletonLoader';

interface ModernProfileDashboardProps {
  user: User;
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
  onEdit?: () => void;
  onUpdateUser?: (user: User) => void;
}

const ModernProfileDashboard: React.FC<ModernProfileDashboardProps> = ({ 
  user, 
  isOwnProfile = true, 
  onEditProfile,
  onEdit
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'badges' | 'training' | 'history'>('overview');
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Hantera både onEditProfile och onEdit
  const handleEdit = useCallback(() => {
    if (onEditProfile) onEditProfile();
    if (onEdit) onEdit();
  }, [onEditProfile, onEdit]);

  // Simulate data loading
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, isRefresh ? 1000 : 1500));
    
    if (isRefresh) {
      setRefreshing(false);
    } else {
      setLoading(false);
    }
  }, []);

  // Pull to refresh functionality
  const handleRefresh = useCallback(async () => {
    await loadData(true);
  }, [loadData]);

  // Hook for pull-to-refresh
  usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    enabled: true
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Parallax effect for hero section
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-bg');
      
      parallaxElements.forEach((element) => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getRarityColor = useCallback((rarity: string) => {
    switch (rarity) {
      case 'common': return '#6b7280';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  }, []);

  const formatPercentage = useCallback((value: number) => {
    return `${value.toFixed(1)}%`;
  }, []);

  const calculateAge = useCallback((birthday: string) => {
    const birth = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }, []);

  const getFormLevel = useCallback(() => {
    const recentPoints = user.statistics.points;
    const gamesPlayed = user.statistics.gamesPlayed;
    
    if (gamesPlayed === 0) return 3;
    
    const pointsPerGame = recentPoints / gamesPlayed;
    if (pointsPerGame >= 2) return 5;
    if (pointsPerGame >= 1.5) return 4;
    if (pointsPerGame >= 1) return 3;
    if (pointsPerGame >= 0.5) return 2;
    return 1;
  }, [user.statistics]);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  return (
    <div className="profile-container pull-to-refresh" style={{ 
      background: "var(--background-gradient)", 
      color: "var(--text-primary)",
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 20% 80%, rgba(26, 77, 114, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(46, 125, 50, 0.1) 0%, transparent 50%)",
        pointerEvents: "none",
        zIndex: 0
      }} />
      
      {/* Pull to Refresh Indicator */}
      {refreshing && (
        <div className="pull-indicator visible" style={{
          background: "rgba(46, 125, 50, 0.95)",
          color: "#fff",
          padding: "0.75rem 1.5rem",
          borderRadius: "20px",
          fontSize: "0.9rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          backdropFilter: "blur(15px)",
          boxShadow: "0 8px 32px rgba(46, 125, 50, 0.4)",
          border: "1px solid rgba(255,255,255,0.2)",
          zIndex: 1000
        }}>
          <div style={{
            width: "16px",
            height: "16px",
            border: "2px solid rgba(255,255,255,0.3)",
            borderTop: "2px solid #fff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          Uppdaterar profil...
        </div>
      )}
      {/* Hero Sektion - Profil Header */}
      <header style={{
        background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)",
        color: "#fff",
        padding: "2rem 1rem 1.5rem 1rem",
        position: "relative",
        overflow: "hidden",
        zIndex: 1
      }}>
        {/* Parallax Background decorations */}
        <div className="parallax-bg" style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          borderRadius: "50%"
        }} />
        
        <div className="parallax-bg" style={{
          position: "absolute",
          top: "-50px",
          left: "-150px",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          borderRadius: "50%"
        }} />

        {loading ? (
          <ProfileHeaderSkeleton />
        ) : (
          <div style={{ 
            display: "flex", 
            gap: "2rem", 
            alignItems: "flex-start",
            position: "relative",
            zIndex: 2,
            animation: "fadeIn 0.8s ease-out"
          }}>
            {/* Profile Avatar with hover effects */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border: "4px solid rgba(255,255,255,0.3)",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05) rotate(2deg)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
              }}>
                {user.profileImageUrl && !imageError ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt={user.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, var(--fbc-primary), var(--fbc-secondary))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: "#fff",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                  }}>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              
              {/* Role badge */}
              {(user.role === 'leader' || user.role === 'admin') && (
                <div style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  width: "35px",
                  height: "35px",
                  background: user.role === 'admin' 
                    ? "linear-gradient(135deg, #FF6B35, #F7931E)" 
                    : "linear-gradient(135deg, #FFD700, #FFA500)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px solid #fff",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                  animation: "pulse 2s infinite"
                }}>
                  <SportIcon 
                    type={user.role === 'admin' ? 'settings' : 'awards'} 
                    size={18} 
                    color="#fff" 
                  />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div style={{ flex: 1 }}>
              <h1 style={{ 
                fontSize: "2.2rem", 
                fontWeight: 800, 
                margin: "0 0 0.5rem 0",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                animation: "fadeIn 0.8s ease-out 0.2s both"
              }}>
                {user.name}
              </h1>
              
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "1rem", 
                marginBottom: "1.5rem",
                flexWrap: "wrap",
                animation: "fadeIn 0.8s ease-out 0.4s both"
              }}>
                <div style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <span style={{ fontSize: "1.5rem" }}>#{user.jerseyNumber}</span>
                </div>
                
                <div style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <SportIcon type="profile" size={16} color="#fff" />
                  {user.favoritePosition}
                </div>
                
                <div style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <SportIcon type="matches" size={16} color="#fff" />
                  {calculateAge(user.birthday)} år
                </div>
              </div>

              {/* Quick Stats */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
                gap: "1rem",
                marginBottom: "1.5rem",
                animation: "fadeIn 0.8s ease-out 0.6s both"
              }}>
                {[
                  { label: "Matcher", value: user.statistics.gamesPlayed, icon: "matches", color: "#1976D2" },
                  { label: "Mål", value: user.statistics.goals, icon: "goals", color: "#FF9800" },
                  { label: "Assist", value: user.statistics.assists, icon: "assists", color: "#9C27B0" },
                  { label: "Poäng", value: user.statistics.points, icon: "stats", color: "#2E7D32" },
                  { label: "Badges", value: user.badges.length, icon: "awards", color: "#F59E0B" }
                ].map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      textAlign: "center",
                      padding: "1rem 0.5rem",
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      animation: `fadeIn 0.6s ease-out ${(index + 1) * 0.1}s both`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                    }}
                  >
                    <div style={{ 
                      fontSize: "1.8rem", 
                      fontWeight: 800, 
                      marginBottom: "0.25rem",
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ 
                      fontSize: "0.8rem", 
                      opacity: 0.9,
                      fontWeight: 600,
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* About section */}
              {user.about && (
                <div style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  animation: "fadeIn 0.8s ease-out 0.8s both"
                }}>
                  <p style={{ 
                    fontSize: "0.95rem", 
                    fontStyle: "italic",
                    margin: 0,
                    lineHeight: 1.4,
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                  }}>
                    "{user.about}"
                  </p>
                </div>
              )}

              {/* Edit button */}
              {isOwnProfile && (
                <button
                  onClick={handleEdit}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderRadius: "12px",
                    padding: "0.75rem 1.5rem",
                    color: "#fff",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    animation: "fadeIn 0.8s ease-out 1s both"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <SportIcon type="settings" size={18} color="#fff" />
                  Redigera profil
                </button>
              )}
            </div>
          </div>
        )}

        {/* Approval notice */}
  {!user.isApproved && user.role === 'player' && (
          <div style={{
            background: "rgba(245, 158, 11, 0.9)",
            color: "#fff",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            marginTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            animation: "fadeIn 0.8s ease-out 1.2s both"
          }}>
            <SportIcon type="settings" size={20} color="#fff" />
            <strong>Väntar på godkännande från ledare</strong>
          </div>
        )}
      </header>

      {/* Navigation Tabs */}
      <section style={{ margin: "2rem 0 1rem 0" }}>
        <div style={{ 
          display: "flex", 
          gap: "0.75rem", 
          padding: "0 1rem",
          overflowX: "auto",
          marginBottom: "2rem"
        }}>
          {[
            { id: 'overview', label: 'Översikt', icon: 'overview' },
            { id: 'stats', label: 'Statistik', icon: 'stats' },
            { id: 'badges', label: 'Utmärkelser', icon: 'awards' },
            ...(isOwnProfile ? [{ id: 'training', label: 'Träning', icon: 'training' }] : []),
            { id: 'history', label: 'Historik', icon: 'matches' }
          ].map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id 
                  ? "linear-gradient(135deg, var(--fbc-primary) 0%, var(--fbc-primary-light) 100%)"
                  : "var(--card-background)",
                color: activeTab === tab.id ? "#fff" : "var(--text-primary)",
                border: activeTab === tab.id ? "none" : "1px solid var(--border-color)",
                borderRadius: "16px",
                padding: "0.75rem 1.25rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                whiteSpace: "nowrap",
                boxShadow: activeTab === tab.id ? "0 4px 16px rgba(26, 77, 114, 0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
                animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
                transform: "translateY(0)"
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = "var(--hover-background)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = "var(--card-background)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <SportIcon type={tab.icon as any} size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tab Content */}
      <div style={{ padding: "0 1rem" }}>
        {activeTab === 'overview' && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {loading ? (
              <>
                <ProfileStatsSkeleton />
                <ProfileBadgesSkeleton />
              </>
            ) : (
              <>
                {/* Quick Actions - samma stil som startsidans snabblänkar */}
                <section style={{ margin: "0 0 1rem 0" }}>
                  <h3 style={{ 
                    color: "var(--text-primary)", 
                    fontWeight: 700, 
                    fontSize: "1.2rem", 
                    margin: "0 0 1rem 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <SportIcon type="overview" size={20} color="var(--fbc-primary)" />
                    Snabbåtkomst
                  </h3>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "0.75rem"
                  }}>
                    {[
                      { id: 'edit', label: 'Redigera', desc: 'Uppdatera profil', icon: '⚙️', color: '#1976D2', action: handleEdit },
                      { id: 'stats', label: 'Statistik', desc: 'Se detaljerat', icon: '📊', color: '#2E7D32', action: () => setActiveTab('stats') },
                      { id: 'badges', label: 'Utmärkelser', desc: 'Visa alla badges', icon: '🏆', color: '#F59E0B', action: () => setActiveTab('badges') },
                      { id: 'training', label: 'Träningslogg', desc: 'Se träningar', icon: '💪', color: '#9C27B0', action: () => setActiveTab('training') }
                    ].map((item, index) => (
                      <button
                        key={item.id}
                        onClick={item.action}
                        style={{
                          background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 100%)`,
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          borderRadius: "16px",
                          padding: "1rem 0.75rem",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: `0 4px 16px ${item.color}25`,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.5rem",
                          textAlign: "center",
                          transition: "all 0.3s ease",
                          position: "relative",
                          overflow: "hidden",
                          animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
                          transform: "translateY(0)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                          e.currentTarget.style.boxShadow = `0 8px 32px ${item.color}35`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow = `0 4px 16px ${item.color}25`;
                        }}
                      >
                        <div style={{ 
                          fontSize: "1.5rem", 
                          marginBottom: "0.25rem",
                          transition: "transform 0.3s ease"
                        }}>
                          {item.icon}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: "0.7rem", opacity: 0.9, lineHeight: 1.2 }}>
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Emergency Contacts */}
                {user.iceContacts && user.iceContacts.length > 0 && (
                  <section style={{ margin: "0 0 1rem 0" }}>
                    <h3 style={{ 
                      color: "var(--text-primary)", 
                      fontWeight: 700, 
                      fontSize: "1.2rem", 
                      margin: "0 0 1rem 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      <SportIcon type="health" size={20} color="var(--fbc-primary)" />
                      Nödkontakter
                    </h3>
                    <div style={{ 
                      display: "flex", 
                      flexDirection: "column",
                      gap: "0.75rem"
                    }}>
                      {user.iceContacts.map((contact, index) => (
                        <div key={index} style={{
                          background: "var(--card-background)",
                          borderRadius: "16px",
                          padding: "1.5rem",
                          border: "1px solid var(--border-color)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          transition: "all 0.3s ease",
                          animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                        }}>
                          <div style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            background: contact.isPrimary ? "linear-gradient(135deg, #F44336, #FF5722)" : "linear-gradient(135deg, #2196F3, #03A9F4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.2rem",
                            color: "#fff",
                            fontWeight: "bold"
                          }}>
                            👤
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontWeight: 700,
                              color: "var(--text-primary)",
                              marginBottom: "0.25rem",
                              fontSize: "1.1rem"
                            }}>
                              {contact.name}
                            </div>
                            <div style={{
                              color: "var(--text-secondary)",
                              fontSize: "0.9rem",
                              marginBottom: "0.25rem"
                            }}>
                              {contact.relation} • {contact.phone}
                            </div>
                            {contact.isPrimary && (
                              <div style={{
                                background: "var(--fbc-primary)",
                                color: "#fff",
                                fontSize: "0.7rem",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "8px",
                                display: "inline-block",
                                fontWeight: 600
                              }}>
                                Primär kontakt
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Personal Goals Progress */}
                {user.milestones && user.milestones.length > 0 && (
                  <section style={{ margin: "0 0 1rem 0" }}>
                    <h3 style={{ 
                      color: "var(--text-primary)", 
                      fontWeight: 700, 
                      fontSize: "1.2rem", 
                      margin: "0 0 1rem 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      <SportIcon type="goals" size={20} color="var(--fbc-primary)" />
                      Personliga mål
                    </h3>
                    <div style={{ 
                      display: "flex", 
                      flexDirection: "column",
                      gap: "0.75rem"
                    }}>
                      {user.milestones.map((milestone, index) => (
                        <div key={milestone.id} style={{
                          background: "var(--card-background)",
                          borderRadius: "16px",
                          padding: "1.5rem",
                          border: "1px solid var(--border-color)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          transition: "all 0.3s ease",
                          animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                        }}>
                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "1rem"
                          }}>
                            <div>
                              <div style={{
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                marginBottom: "0.25rem",
                                fontSize: "1.1rem"
                              }}>
                                {milestone.name}
                              </div>
                              <div style={{
                                color: "var(--text-secondary)",
                                fontSize: "0.9rem"
                              }}>
                                {milestone.description}
                              </div>
                            </div>
                            <div style={{
                              background: milestone.completed ? "#4CAF50" : "var(--fbc-primary)",
                              color: "#fff",
                              fontSize: "0.8rem",
                              padding: "0.5rem 0.75rem",
                              borderRadius: "12px",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem"
                            }}>
                              {milestone.completed ? "✓" : "⏳"} {milestone.current}/{milestone.target}
                            </div>
                          </div>
                          <div style={{
                            background: "var(--bg-tertiary)",
                            borderRadius: "10px",
                            height: "8px",
                            overflow: "hidden"
                          }}>
                            <div style={{
                              width: `${Math.min((milestone.current / milestone.target) * 100, 100)}%`,
                              height: "100%",
                              background: milestone.completed 
                                ? "linear-gradient(90deg, #4CAF50, #8BC34A)"
                                : "linear-gradient(90deg, var(--fbc-primary), var(--fbc-primary-light))",
                              transition: "width 0.8s ease-out",
                              borderRadius: "10px"
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Recent Activity Feed */}
                <section style={{ margin: "0 0 1rem 0" }}>
                  <h3 style={{ 
                    color: "var(--text-primary)", 
                    fontWeight: 700, 
                    fontSize: "1.2rem", 
                    margin: "0 0 1rem 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <SportIcon type="forum" size={20} color="var(--fbc-primary)" />
                    Senaste aktivitet
                  </h3>
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column",
                    gap: "0.75rem"
                  }}>
                    {[
                      {
                        id: '1',
                        type: 'training',
                        title: 'Träning genomförd',
                        description: 'Deltog i träning med bra känsla',
                        time: '2 tim sedan',
                        icon: '💪',
                        color: '#1976D2'
                      },
                      {
                        id: '2',
                        type: 'badge',
                        title: 'Ny utmärkelse',
                        description: 'Fick "Träningsviljan" badge',
                        time: '1 dag sedan',
                        icon: '🏆',
                        color: '#F59E0B'
                      },
                      {
                        id: '3',
                        type: 'match',
                        title: 'Match spelad',
                        description: 'FBC Nyköping vs Växjö IBK: 6-4',
                        time: '3 dagar sedan',
                        icon: '🏒',
                        color: '#2E7D32'
                      }
                    ].map((activity, index) => (
                      <div key={activity.id} style={{
                        background: "var(--card-background)",
                        borderRadius: "16px",
                        padding: "1.5rem",
                        border: "1px solid var(--border-color)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        transition: "all 0.3s ease",
                        animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                        e.currentTarget.style.borderColor = activity.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                        e.currentTarget.style.borderColor = "var(--border-color)";
                      }}>
                        <div style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "12px",
                          background: `linear-gradient(135deg, ${activity.color}, ${activity.color}cc)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.2rem",
                          flexShrink: 0,
                          transition: "transform 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                        }}>
                          {activity.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "0.5rem"
                          }}>
                            <div style={{
                              fontWeight: 700,
                              color: "var(--text-primary)",
                              fontSize: "1.1rem"
                            }}>
                              {activity.title}
                            </div>
                            <div style={{
                              color: "var(--text-secondary)",
                              fontSize: "0.85rem",
                              fontWeight: 500
                            }}>
                              {activity.time}
                            </div>
                          </div>
                          <div style={{
                            color: "var(--text-secondary)",
                            fontSize: "0.9rem",
                            lineHeight: 1.4
                          }}>
                            {activity.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Quick Stats Overview */}
                <section style={{ margin: "0 0 1rem 0" }}>
                  <h3 style={{ 
                    color: "var(--text-primary)", 
                    fontWeight: 700, 
                    fontSize: "1.2rem", 
                    margin: "0 0 1rem 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <SportIcon type="stats" size={20} color="var(--fbc-primary)" />
                    Snabbstatistik
                  </h3>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "0.75rem"
                  }}>
                    {[
                      { label: "Matcher", value: user.statistics.gamesPlayed, icon: "🏒", color: "#1976D2" },
                      { label: "Mål", value: user.statistics.goals, icon: "⚽", color: "#FF9800" },
                      { label: "Assist", value: user.statistics.assists, icon: "🎯", color: "#9C27B0" },
                      { label: "Poäng", value: user.statistics.points, icon: "⭐", color: "#2E7D32" }
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="profile-stat-card"
                        style={{
                          background: "var(--card-background)",
                          borderRadius: "16px",
                          padding: "1.25rem",
                          border: "1px solid var(--border-color)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          textAlign: "center",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
                          transform: "translateY(0)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                          e.currentTarget.style.borderColor = stat.color;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                          e.currentTarget.style.borderColor = "var(--border-color)";
                        }}
                      >
                        <div style={{ 
                          fontSize: "1.8rem", 
                          marginBottom: "0.5rem",
                          transition: "transform 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.2) rotate(10deg)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                        }}>
                          {stat.icon}
                        </div>
                        <div style={{ 
                          fontSize: "1.8rem", 
                          fontWeight: 800, 
                          color: stat.color,
                          marginBottom: "0.25rem",
                          textShadow: `0 2px 8px ${stat.color}40`
                        }}>
                          {stat.value}
                        </div>
                        <div style={{ 
                          fontSize: "0.9rem", 
                          color: "var(--text-secondary)",
                          fontWeight: 600
                        }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Recent Performance Card */}
                <div style={{
                  background: "var(--card-background)",
                  borderRadius: "20px",
                  padding: "2rem",
                  border: "1px solid var(--border-color)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  animation: "fadeIn 0.8s ease-out"
                }}>
                  <h3 style={{ 
                    color: "var(--text-primary)", 
                    fontWeight: 700, 
                    fontSize: "1.4rem", 
                    margin: "0 0 1.5rem 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <SportIcon type="stats" size={24} color="var(--fbc-primary)" />
                    Senaste prestationer
                  </h3>
                  
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1.5rem"
                  }}>
                    {[
                      { 
                        label: "Form", 
                        value: getFormLevel(),
                        maxValue: 5,
                        icon: "health",
                        color: "#2E7D32",
                        type: "stars"
                      },
                      { 
                        label: "Träningar i följd", 
                        value: user.achievements.consecutiveTrainings,
                        icon: "training",
                        color: "#1976D2",
                        type: "number"
                      },
                      { 
                        label: "MVP-röster", 
                        value: user.achievements.mvpVotes,
                        icon: "awards",
                        color: "#F59E0B",
                        type: "number"
                      },
                      { 
                        label: "Poäng/match", 
                        value: user.statistics.gamesPlayed > 0 
                          ? (user.statistics.points / user.statistics.gamesPlayed).toFixed(2)
                          : '0.00',
                        icon: "goals",
                        color: "#9C27B0",
                        type: "decimal"
                      }
                    ].map((stat, index) => (
                      <div
                        key={index}
                        style={{
                          background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}08)`,
                          borderRadius: "16px",
                          padding: "1.5rem",
                          border: `1px solid ${stat.color}30`,
                          textAlign: "center",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          animation: `fadeIn 0.8s ease-out ${index * 0.1}s both`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                          e.currentTarget.style.background = `linear-gradient(135deg, ${stat.color}25, ${stat.color}15)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0) scale(1)";
                          e.currentTarget.style.background = `linear-gradient(135deg, ${stat.color}15, ${stat.color}08)`;
                        }}
                      >
                        <div style={{ 
                          display: "flex", 
                          justifyContent: "center", 
                          marginBottom: "1rem",
                          transform: "scale(1)",
                          transition: "transform 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                        }}>
                          <SportIcon type={stat.icon as any} size={32} color={stat.color} />
                        </div>
                        
                        <div style={{ 
                          fontSize: "1.8rem", 
                          fontWeight: 800, 
                          color: stat.color,
                          marginBottom: "0.5rem"
                        }}>
                          {stat.type === "stars" ? (
                            <div style={{ display: "flex", justifyContent: "center", gap: "0.25rem" }}>
                              {Array.from({length: 5}).map((_, i) => (
                                <span 
                                  key={i} 
                                  style={{
                                    color: i < Number(stat.value) ? stat.color : "var(--border-color)",
                                    fontSize: "1.5rem",
                                    transition: "color 0.3s ease"
                                  }}
                                >
                                  ⭐
                                </span>
                              ))}
                            </div>
                          ) : (
                            stat.value
                          )}
                        </div>
                        
                        <div style={{ 
                          fontSize: "0.9rem", 
                          color: "var(--text-secondary)",
                          fontWeight: 600
                        }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Latest Badges Card */}
                <div style={{
                  background: "var(--card-background)",
                  borderRadius: "20px",
                  padding: "2rem",
                  border: "1px solid var(--border-color)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  animation: "fadeIn 0.8s ease-out 0.4s both"
                }}>
                  <h3 style={{ 
                    color: "var(--text-primary)", 
                    fontWeight: 700, 
                    fontSize: "1.4rem", 
                    margin: "0 0 1.5rem 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <SportIcon type="awards" size={24} color="var(--fbc-primary)" />
                    Senaste utmärkelser
                  </h3>
                  
                  {user.badges.length > 0 ? (
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "1rem"
                    }}>
                      {user.badges.slice(-3).map((badge, index) => (
                        <div 
                          key={badge.id}
                          style={{
                            background: "var(--bg-tertiary)",
                            borderRadius: "16px",
                            padding: "1.5rem",
                            border: `2px solid ${getRarityColor(badge.rarity)}`,
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            animation: `fadeIn 0.8s ease-out ${index * 0.1}s both`
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                            e.currentTarget.style.boxShadow = `0 8px 25px ${getRarityColor(badge.rarity)}30`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0) scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <div style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${getRarityColor(badge.rarity)}, ${getRarityColor(badge.rarity)}cc)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.5rem",
                            boxShadow: `0 4px 16px ${getRarityColor(badge.rarity)}40`,
                            transition: "transform 0.3s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.1) rotate(10deg)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                          }}>
                            <SportIcon type="awards" size={32} color="#fff" />
                          </div>
                          
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontWeight: 700, 
                              color: "var(--text-primary)",
                              marginBottom: "0.25rem",
                              fontSize: "1.1rem"
                            }}>
                              {badge.name}
                            </div>
                            <div style={{ 
                              fontSize: "0.85rem", 
                              color: "var(--text-secondary)",
                              marginBottom: "0.5rem"
                            }}>
                              {badge.description}
                            </div>
                            <div style={{ 
                              fontSize: "0.8rem", 
                              color: getRarityColor(badge.rarity),
                              fontWeight: 600
                            }}>
                              {formatDate(badge.dateEarned)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      textAlign: "center",
                      padding: "3rem 2rem",
                      color: "var(--text-secondary)"
                    }}>
                      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
                        <SportIcon type="goals" size={64} color="var(--border-color)" />
                      </div>
                      <h4 style={{ 
                        color: "var(--text-primary)", 
                        marginBottom: "0.5rem",
                        fontSize: "1.2rem"
                      }}>
                        Inga utmärkelser än
                      </h4>
                      <p style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
                        Fortsätt träna hårt och delta i matcher för att tjäna dina första badges!
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {loading ? (
              <ProfileStatsSkeleton />
            ) : (
              <div style={{
                background: "var(--card-background)",
                borderRadius: "20px",
                padding: "2rem",
                border: "1px solid var(--border-color)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                animation: "fadeIn 0.8s ease-out"
              }}>
                <h3 style={{ 
                  color: "var(--text-primary)", 
                  fontWeight: 700, 
                  fontSize: "1.4rem", 
                  margin: "0 0 2rem 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <SportIcon type="stats" size={24} color="var(--fbc-primary)" />
                  Detaljerad statistik
                </h3>
                
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1.5rem"
                }}>
                  {[
                    { label: "Matcher spelade", value: user.statistics.gamesPlayed, icon: "matches", color: "#1976D2" },
                    { label: "Mål", value: user.statistics.goals, icon: "goals", color: "#FF9800" },
                    { label: "Assist", value: user.statistics.assists, icon: "assists", color: "#9C27B0" },
                    { label: "Poäng", value: user.statistics.points, icon: "stats", color: "#2E7D32" },
                    { label: "Skott", value: user.statistics.shots, icon: "match", color: "#F44336" },
                    { label: "Skott %", value: user.statistics.shotPercentage > 0 ? formatPercentage(user.statistics.shotPercentage) : "0.0%", icon: "goals", color: "#E91E63" }
                  ].map((stat, index) => (
                    <div
                      key={index}
                      style={{
                        background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}08)`,
                        borderRadius: "16px",
                        padding: "1.5rem",
                        border: `1px solid ${stat.color}30`,
                        textAlign: "center",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        animation: `fadeIn 0.8s ease-out ${index * 0.1}s both`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                        e.currentTarget.style.background = `linear-gradient(135deg, ${stat.color}25, ${stat.color}15)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                        e.currentTarget.style.background = `linear-gradient(135deg, ${stat.color}15, ${stat.color}08)`;
                      }}
                    >
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "center", 
                        marginBottom: "1rem",
                        transform: "scale(1)",
                        transition: "transform 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                      }}>
                        <SportIcon type={stat.icon as any} size={32} color={stat.color} />
                      </div>
                      
                      <div style={{ 
                        fontSize: "2rem", 
                        fontWeight: 800, 
                        color: stat.color,
                        marginBottom: "0.5rem"
                      }}>
                        {stat.value}
                      </div>
                      
                      <div style={{ 
                        fontSize: "0.9rem", 
                        color: "var(--text-secondary)",
                        fontWeight: 600
                      }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {loading ? (
              <ProfileBadgesSkeleton />
            ) : (
              <div style={{
                background: "var(--card-background)",
                borderRadius: "20px",
                padding: "2rem",
                border: "1px solid var(--border-color)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                animation: "fadeIn 0.8s ease-out"
              }}>
                <h3 style={{ 
                  color: "var(--text-primary)", 
                  fontWeight: 700, 
                  fontSize: "1.4rem", 
                  margin: "0 0 2rem 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <SportIcon type="awards" size={24} color="var(--fbc-primary)" />
                  Alla utmärkelser ({user.badges.length})
                </h3>
                
                {user.badges.length > 0 ? (
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem"
                  }}>
                    {user.badges.map((badge, index) => (
                      <div 
                        key={badge.id}
                        style={{
                          background: "var(--bg-tertiary)",
                          borderRadius: "16px",
                          padding: "2rem",
                          border: `2px solid ${getRarityColor(badge.rarity)}`,
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          animation: `fadeIn 0.8s ease-out ${index * 0.05}s both`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                          e.currentTarget.style.boxShadow = `0 12px 35px ${getRarityColor(badge.rarity)}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                          <div style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${getRarityColor(badge.rarity)}, ${getRarityColor(badge.rarity)}cc)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto",
                            boxShadow: `0 8px 25px ${getRarityColor(badge.rarity)}50`,
                            transition: "transform 0.3s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.1) rotate(10deg)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                          }}>
                            <SportIcon type="awards" size={40} color="#fff" />
                          </div>
                        </div>
                        
                        <div style={{ textAlign: "center" }}>
                          <div style={{ 
                            fontWeight: 700, 
                            color: "var(--text-primary)",
                            marginBottom: "0.5rem",
                            fontSize: "1.2rem"
                          }}>
                            {badge.name}
                          </div>
                          <div style={{ 
                            fontSize: "0.9rem", 
                            color: "var(--text-secondary)",
                            marginBottom: "1rem",
                            lineHeight: 1.4
                          }}>
                            {badge.description}
                          </div>
                          <div style={{
                            display: "inline-block",
                            background: getRarityColor(badge.rarity),
                            color: "#fff",
                            padding: "0.5rem 1rem",
                            borderRadius: "20px",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            marginBottom: "0.5rem"
                          }}>
                            {badge.rarity.toUpperCase()}
                          </div>
                          <div style={{ 
                            fontSize: "0.85rem", 
                            color: "var(--text-secondary)",
                            fontWeight: 500
                          }}>
                            Uppnådd: {formatDate(badge.dateEarned)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: "center",
                    padding: "4rem 2rem",
                    color: "var(--text-secondary)"
                  }}>
                    <div style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>
                      <SportIcon type="goals" size={80} color="var(--border-color)" />
                    </div>
                    <h4 style={{ 
                      color: "var(--text-primary)", 
                      marginBottom: "1rem",
                      fontSize: "1.5rem"
                    }}>
                      Inga utmärkelser än
                    </h4>
                    <p style={{ fontSize: "1rem", lineHeight: 1.6, maxWidth: "400px", margin: "0 auto" }}>
                      Fortsätt träna hårt, delta i matcher och hjälp laget för att tjäna dina första badges!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Training Tab (only for own profile) */}
        {activeTab === 'training' && isOwnProfile && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{
              background: "var(--card-background)",
              borderRadius: "20px",
              padding: "2rem",
              border: "1px solid var(--border-color)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              animation: "fadeIn 0.8s ease-out"
            }}>
              <h3 style={{ 
                color: "var(--text-primary)", 
                fontWeight: 700, 
                fontSize: "1.4rem", 
                margin: "0 0 2rem 0",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <SportIcon type="training" size={24} color="var(--fbc-primary)" />
                Träningslogg
              </h3>
              
              {user.trainingLogs.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {user.trainingLogs.slice(0, 5).map((log, index) => (
                    <div 
                      key={log.id}
                      style={{
                        background: "var(--card-background)",
                        borderRadius: "16px",
                        padding: "1.5rem",
                        border: "1px solid var(--border-color)",
                        transition: "all 0.3s ease",
                        animation: `fadeIn 0.8s ease-out ${index * 0.1}s both`,
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                        e.currentTarget.style.borderColor = "var(--fbc-primary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                        e.currentTarget.style.borderColor = "var(--border-color)";
                      }}
                    >
                      <div style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, var(--fbc-primary), var(--fbc-primary-light))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                        flexShrink: 0,
                        transition: "transform 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                      }}>
                        💪
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "0.5rem"
                        }}>
                          <div style={{
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            fontSize: "1.1rem"
                          }}>
                            Träningspass
                          </div>
                          <div style={{
                            color: "var(--text-secondary)",
                            fontSize: "0.9rem",
                            fontWeight: 500
                          }}>
                            {formatDate(log.date)}
                          </div>
                        </div>
                        <div style={{
                          display: "flex",
                          gap: "1rem",
                          marginBottom: "0.5rem"
                        }}>
                          <div style={{
                            background: "var(--fbc-primary)",
                            color: "#fff",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                            fontWeight: 600
                          }}>
                            {log.duration} min
                          </div>
                          <div style={{
                            background: "var(--bg-tertiary)",
                            color: "var(--text-secondary)",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                            fontWeight: 600
                          }}>
                            {log.feeling}
                          </div>
                        </div>
                        {log.note && (
                          <div style={{
                            fontSize: "0.9rem",
                            color: "var(--text-secondary)",
                            lineHeight: 1.4
                          }}>
                            {log.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: "center",
                  padding: "3rem 2rem",
                  color: "var(--text-secondary)"
                }}>
                  <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
                    <SportIcon type="training" size={64} color="var(--border-color)" />
                  </div>
                  <h4 style={{ 
                    color: "var(--text-primary)", 
                    marginBottom: "0.5rem",
                    fontSize: "1.2rem"
                  }}>
                    Ingen träningslogg än
                  </h4>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
                    Börja logga dina träningar för att följa din utveckling!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{
              background: "var(--card-background)",
              borderRadius: "20px",
              padding: "2rem",
              border: "1px solid var(--border-color)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              animation: "fadeIn 0.8s ease-out"
            }}>
              <h3 style={{ 
                color: "var(--text-primary)", 
                fontWeight: 700, 
                fontSize: "1.4rem", 
                margin: "0 0 2rem 0",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <SportIcon type="matches" size={24} color="var(--fbc-primary)" />
                Klubbhistorik
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {user.clubHistory.map((club, index) => (
                  <div 
                    key={club.id}
                    style={{
                      background: "var(--card-background)",
                      borderRadius: "16px",
                      padding: "1.5rem",
                      border: "1px solid var(--border-color)",
                      transition: "all 0.3s ease",
                      animation: `fadeIn 0.8s ease-out ${index * 0.1}s both`,
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                      e.currentTarget.style.borderColor = "var(--fbc-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                      e.currentTarget.style.borderColor = "var(--border-color)";
                    }}
                  >
                    <div style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, var(--fbc-primary), var(--fbc-primary-light))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      flexShrink: 0,
                      transition: "transform 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                    }}>
                      🏒
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.5rem"
                      }}>
                        <div style={{
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          fontSize: "1.1rem"
                        }}>
                          {club.clubName}
                        </div>
                        <div style={{
                          background: "var(--fbc-primary)",
                          color: "#fff",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          fontWeight: 600
                        }}>
                          {club.season}
                        </div>
                      </div>
                      <div style={{
                        display: "flex",
                        gap: "1rem",
                        marginBottom: "0.5rem"
                      }}>
                        <div style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.9rem"
                        }}>
                          📍 {club.league}
                        </div>
                        <div style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.9rem"
                        }}>
                          👤 {club.position}
                        </div>
                      </div>
                      {club.achievements && club.achievements.length > 0 && (
                        <div style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap"
                        }}>
                          {club.achievements.map((achievement, i) => (
                            <div key={i} style={{
                              background: "var(--bg-tertiary)",
                              color: "var(--text-secondary)",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "6px",
                              fontSize: "0.7rem",
                              fontWeight: 600
                            }}>
                              🏆 {achievement}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button - Quick Edit */}
      {isOwnProfile && (
        <button
          onClick={handleEdit}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--fbc-primary), var(--fbc-primary-light))",
            border: "none",
            color: "#fff",
            fontSize: "1.5rem",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(26, 77, 114, 0.3)",
            zIndex: 1000,
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 1s ease-out 2s both"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1) rotate(10deg)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(26, 77, 114, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) rotate(0deg)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(26, 77, 114, 0.3)";
          }}
        >
          ⚙️
        </button>
      )}

      {/* Footer */}
      <footer style={{
        margin: "3rem 0 2rem 0",
        padding: "2rem 1rem",
        background: "var(--card-background)",
        borderTop: "1px solid var(--border-color)",
        borderRadius: "2rem 2rem 0 0"
      }}>
        <div style={{ textAlign: "center" }}>
          <img 
            src="/fbc-logo.jpg" 
            alt="FBC Nyköping" 
            style={{ 
              width: 48, 
              height: 48, 
              borderRadius: "50%",
              marginBottom: "1rem",
              border: "2px solid var(--border-color)"
            }} 
          />
          <div style={{ 
            color: "var(--text-primary)", 
            fontWeight: 700, 
            fontSize: "1.1rem",
            marginBottom: "0.5rem"
          }}>
            FBC Nyköping
          </div>
          <div style={{ 
            color: "var(--text-secondary)", 
            fontSize: "0.85rem",
            lineHeight: 1.4
          }}>
            Din personliga spelarprofil i FBC Nyköping lagapp
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernProfileDashboard;
