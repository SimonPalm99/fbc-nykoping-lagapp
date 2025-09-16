import React, { useState, useCallback, useEffect } from 'react';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import SportIcon from '../ui/SportIcon';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Enhanced interfaces for better type safety
interface PlayerStats {
  id: string;
  name: string;
  jerseyNumber: number;
  position: string;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  shots: number;
  shotPercentage: number;
  plusMinus: number;
  penaltyMinutes: number;
  blocks: number;
  rating: number;
  age: number;
  height: number;
  weight: number;
  saves?: number;
  savePercentage?: number;
}

interface TeamStats {
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  position: number;
  winPercentage: number;
  form: string[];
  powerPlayPercentage: number;
  penaltyKillPercentage: number;
  shotsFor: number;
  shotsAgainst: number;
  faceoffPercentage: number;
}

interface LoadingStates {
  overview: boolean;
  players: boolean;
  team: boolean;
  charts: boolean;
  refreshing: boolean;
}

interface GameResult {
  date: string;
  opponent: string;
  homeAway: 'home' | 'away';
  result: 'W' | 'L' | 'D';
  goalsFor: number;
  goalsAgainst: number;
  attendance?: number;
}

// TrendData interface removed as it was unused

const ModernStatistics: React.FC = () => {
  // const { user } = useAuth(); // Commented out as unused
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'team' | 'trends' | 'compare'>('overview');
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    overview: true,
    players: true,
    team: true,
    charts: true,
    refreshing: false
  });
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [sortBy, setSortBy] = useState<keyof PlayerStats>('points');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [recentGames] = useState<GameResult[]>([]); // Removed setter as unused
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  // const chartRef = useRef<any>(null); // Removed as unused

  // Mock data för statistik
  const mockPlayerStats: PlayerStats[] = [
    {
      id: "1",
      name: "Anna Svensson",
      jerseyNumber: 7,
      position: "Forward",
      gamesPlayed: 19,
      goals: 15,
      assists: 12,
      points: 27,
      shots: 89,
      shotPercentage: 16.9,
      plusMinus: 12,
      penaltyMinutes: 4,
      blocks: 8,
      rating: 8.7,
      age: 24,
      height: 168,
      weight: 62
    },
    {
      id: "2",
      name: "Simon Andersson",
      jerseyNumber: 15,
      position: "Forward",
      gamesPlayed: 18,
      goals: 12,
      assists: 8,
      points: 20,
      shots: 67,
      shotPercentage: 17.9,
      plusMinus: 7,
      penaltyMinutes: 6,
      blocks: 15,
      rating: 8.2,
      age: 22,
      height: 175,
      weight: 73
    },
    {
      id: "3",
      name: "Erik Nilsson",
      jerseyNumber: 4,
      position: "Back",
      gamesPlayed: 17,
      goals: 3,
      assists: 15,
      points: 18,
      shots: 34,
      shotPercentage: 8.8,
      plusMinus: 9,
      penaltyMinutes: 12,
      blocks: 28,
      rating: 7.9,
      age: 26,
      height: 182,
      weight: 78
    },
    {
      id: "4",
      name: "Lisa Johansson",
      jerseyNumber: 21,
      position: "Forward",
      gamesPlayed: 16,
      goals: 9,
      assists: 7,
      points: 16,
      shots: 52,
      shotPercentage: 17.3,
      plusMinus: 4,
      penaltyMinutes: 8,
      blocks: 12,
      rating: 7.6,
      age: 23,
      height: 165,
      weight: 58
    },
    {
      id: "5",
      name: "Mikael Berg",
      jerseyNumber: 1,
      position: "Målvakt",
      gamesPlayed: 15,
      goals: 0,
      assists: 2,
      points: 2,
      shots: 0,
      shotPercentage: 0,
      plusMinus: 0,
      penaltyMinutes: 2,
      blocks: 187,
      rating: 8.5,
      age: 28,
      height: 185,
      weight: 82,
      saves: 432,
      savePercentage: 92.3
    },
    {
      id: "6",
      name: "Maria Lindqvist",
      jerseyNumber: 11,
      position: "Forward",
      gamesPlayed: 19,
      goals: 8,
      assists: 13,
      points: 21,
      shots: 61,
      shotPercentage: 13.1,
      plusMinus: 8,
      penaltyMinutes: 6,
      blocks: 9,
      rating: 7.8,
      age: 25,
      height: 170,
      weight: 65
    },
    {
      id: "7",
      name: "Jonas Petersson",
      jerseyNumber: 23,
      position: "Back",
      gamesPlayed: 18,
      goals: 2,
      assists: 9,
      points: 11,
      shots: 28,
      shotPercentage: 7.1,
      plusMinus: 5,
      penaltyMinutes: 18,
      blocks: 35,
      rating: 7.2,
      age: 29,
      height: 180,
      weight: 79
    }
  ];

  const mockTeamStats: TeamStats = {
    gamesPlayed: 20,
    wins: 12,
    draws: 2,
    losses: 6,
    points: 38,
    goalsFor: 67,
    goalsAgainst: 45,
    goalDifference: 22,
    position: 3,
    winPercentage: 60,
    form: ['W', 'W', 'L', 'W', 'D'],
    powerPlayPercentage: 22.4,
    penaltyKillPercentage: 84.2,
    shotsFor: 542,
    shotsAgainst: 478,
    faceoffPercentage: 52.8
  };

  // Mock data commented out as unused
  /*
  const mockRecentGames: GameResult[] = [
    { date: '2025-06-28', opponent: 'IK Sirius', homeAway: 'home', result: 'W', goalsFor: 4, goalsAgainst: 2, attendance: 1250 },
    { date: '2025-06-25', opponent: 'Västerås SK', homeAway: 'away', result: 'W', goalsFor: 3, goalsAgainst: 1 },
    { date: '2025-06-22', opponent: 'Täby FC', homeAway: 'home', result: 'L', goalsFor: 1, goalsAgainst: 3, attendance: 980 },
    { date: '2025-06-19', opponent: 'AIK', homeAway: 'away', result: 'W', goalsFor: 2, goalsAgainst: 0 },
    { date: '2025-06-16', opponent: 'Hammarby IF', homeAway: 'home', result: 'D', goalsFor: 2, goalsAgainst: 2, attendance: 1420 },
    { date: '2025-06-13', opponent: 'Djurgården', homeAway: 'away', result: 'L', goalsFor: 0, goalsAgainst: 2 },
    { date: '2025-06-10', opponent: 'IFK Stockholm', homeAway: 'home', result: 'W', goalsFor: 5, goalsAgainst: 1, attendance: 1105 },
    { date: '2025-06-07', opponent: 'Stockholms Innebandy', homeAway: 'away', result: 'W', goalsFor: 3, goalsAgainst: 2 }
  ];
  */

  // Simulate data loading
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setLoadingStates(prev => ({ ...prev, refreshing: true }));
    }
    
    // Simulate API calls
    await new Promise(resolve => setTimeout(resolve, isRefresh ? 1000 : 1500));
    
    setPlayerStats(mockPlayerStats);
    setTeamStats(mockTeamStats);
    
    if (isRefresh) {
      setLoadingStates({
        overview: false,
        players: false,
        team: false,
        charts: false,
        refreshing: false
      });
    } else {
      setLoadingStates({
        overview: false,
        players: false,
        team: false,
        charts: false,
        refreshing: false
      });
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

  // Parallax effect
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

  const sortPlayers = useCallback((key: keyof PlayerStats) => {
    const newOrder = sortBy === key && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(key);
    setSortOrder(newOrder);
    
    const sorted = [...playerStats].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return newOrder === 'desc' ? bVal - aVal : aVal - bVal;
      }
      
      return newOrder === 'desc' 
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal));
    });
    
    setPlayerStats(sorted);
  }, [playerStats, sortBy, sortOrder]);

  const filteredPlayers = useCallback(() => {
    return playerStats.filter(player => {
      const matchesPosition = selectedPosition === 'all' || player.position === selectedPosition;
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPosition && matchesSearch;
    });
  }, [playerStats, selectedPosition, searchTerm]);

  const togglePlayerSelection = useCallback((playerId: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId].slice(0, 3) // Max 3 players for comparison
    );
  }, []);

  const getPositionIcon = useCallback((position: string) => {
    switch (position.toLowerCase()) {
      case 'målvakt': return '🥅';
      case 'back': return '🛡️';
      case 'forward': return '⚡';
      default: return '🏒';
    }
  }, []);

  const getFormIcon = useCallback((result: string) => {
    switch (result) {
      case 'W': return '✅';
      case 'D': return '🟡';
      case 'L': return '❌';
      default: return '⚪';
    }
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  };

  // Removed unused getGreeting function
  /*
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "God morgon";
    if (hour < 18) return "God dag";
    return "God kväll";
  };
  */

  // Chart data generation functions
  const getTeamPerformanceData = () => {
    const labels = recentGames.slice(0, 8).reverse().map(game => {
      const date = new Date(game.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    
    const goalsFor = recentGames.slice(0, 8).reverse().map(game => game.goalsFor);
    const goalsAgainst = recentGames.slice(0, 8).reverse().map(game => game.goalsAgainst);
    
    return {
      labels,
      datasets: [
        {
          label: 'Gjorda mål',
          data: goalsFor,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Insläppta mål',
          data: goalsAgainst,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const getPlayerPointsData = () => {
    const topPlayers = playerStats.slice(0, 6);
    
    return {
      labels: topPlayers.map(p => p.name.split(' ')[0]),
      datasets: [
        {
          label: 'Mål',
          data: topPlayers.map(p => p.goals),
          backgroundColor: '#10B981',
          borderColor: '#059669',
          borderWidth: 2
        },
        {
          label: 'Assist',
          data: topPlayers.map(p => p.assists),
          backgroundColor: '#3B82F6',
          borderColor: '#2563EB',
          borderWidth: 2
        }
      ]
    };
  };

  const getPositionDistribution = () => {
    const positions = playerStats.reduce((acc, player) => {
      acc[player.position] = (acc[player.position] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(positions),
      datasets: [
        {
          data: Object.values(positions),
          backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
          borderColor: '#fff',
          borderWidth: 2
        }
      ]
    };
  };

  const getPlayerRadarData = (playerId: string) => {
    const player = playerStats.find(p => p.id === playerId);
    if (!player) return null;

    return {
      labels: ['Mål', 'Assist', 'Skott', 'Teknik', 'Försvar', 'Fys'],
      datasets: [
        {
          label: player.name,
          data: [
            (player.goals / Math.max(...playerStats.map(p => p.goals))) * 10,
            (player.assists / Math.max(...playerStats.map(p => p.assists))) * 10,
            (player.shots / Math.max(...playerStats.map(p => p.shots))) * 10,
            player.rating,
            (player.blocks / Math.max(...playerStats.map(p => p.blocks))) * 10,
            Math.min(player.gamesPlayed / 20 * 10, 10)
          ],
          backgroundColor: 'rgba(26, 77, 114, 0.2)',
          borderColor: 'var(--fbc-primary)',
          pointBackgroundColor: 'var(--fbc-primary)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'var(--fbc-primary)'
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'var(--text-primary)',
          font: {
            family: 'var(--font-family)'
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'var(--text-secondary)'
        },
        grid: {
          color: 'var(--border-primary)'
        }
      },
      y: {
        ticks: {
          color: 'var(--text-secondary)'
        },
        grid: {
          color: 'var(--border-primary)'
        }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'var(--text-primary)',
          font: {
            family: 'var(--font-family)'
          }
        }
      }
    },
    scales: {
      r: {
        angleLines: {
          color: 'var(--border-primary)'
        },
        grid: {
          color: 'var(--border-primary)'
        },
        pointLabels: {
          color: 'var(--text-secondary)'
        },
        ticks: {
          color: 'var(--text-secondary)',
          backdropColor: 'transparent'
        },
        min: 0,
        max: 10
      }
    }
  };

  return (
    <div className="statistics-container pull-to-refresh" style={{ 
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
      {loadingStates.refreshing && (
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
          Uppdaterar statistik...
        </div>
      )}

      {/* Hero Sektion - Statistics Header */}
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

        {/* Welcome Message */}
        <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
          <h1 style={{ 
            fontSize: "1.8rem", 
            fontWeight: 800, 
            margin: "0 0 0.5rem 0",
            textShadow: "0 2px 8px rgba(0,0,0,0.3)"
          }}>
            📊 Statistik & Analys
          </h1>
          <p style={{ 
            fontSize: "1rem", 
            opacity: 0.9, 
            margin: "0 0 0.75rem 0",
            textShadow: "0 1px 4px rgba(0,0,0,0.3)"
          }}>
            FBC Nyköping - Säsong 2024/25
          </p>
          <div style={{ 
            fontSize: "0.9rem", 
            opacity: 0.8,
            fontWeight: 500
          }}>
            📅 Onsdag 3 juli • 🕐 {getCurrentTime()}
          </div>
        </div>
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
            { id: 'players', label: 'Spelare', icon: 'profile' },
            { id: 'team', label: 'Lag', icon: 'awards' },
            { id: 'trends', label: 'Trender', icon: 'stats' },
            { id: 'compare', label: 'Jämför', icon: 'matches' }
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
      <div style={{ padding: "0 1rem", position: "relative", zIndex: 1 }}>
        {activeTab === 'overview' && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {loadingStates.overview ? (
              <div style={{
                background: 'var(--card-background)',
                borderRadius: '16px',
                padding: '3rem',
                border: '1px solid var(--border-color)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid rgba(26, 77, 114, 0.3)',
                  borderTop: '3px solid var(--fbc-primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem auto'
                }} />
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  Laddar statistik...
                </p>
              </div>
            ) : (
              <>
                {/* Team Quick Stats */}
                {teamStats && (
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
                      <SportIcon type="awards" size={20} color="var(--fbc-primary)" />
                      Lagstatistik
                    </h3>
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: "0.75rem"
                    }}>
                      {[
                        { 
                          label: "Tabellplats", 
                          value: `#${teamStats.position}`, 
                          icon: "🏆", 
                          color: "#F59E0B",
                          suffix: ""
                        },
                        { 
                          label: "Vinster", 
                          value: teamStats.wins, 
                          icon: "✅", 
                          color: "#10B981",
                          suffix: `/${teamStats.gamesPlayed}`
                        },
                        { 
                          label: "Poäng", 
                          value: teamStats.points, 
                          icon: "⭐", 
                          color: "#1976D2",
                          suffix: "p"
                        },
                        { 
                          label: "Målskillnad", 
                          value: teamStats.goalDifference > 0 ? `+${teamStats.goalDifference}` : teamStats.goalDifference, 
                          icon: "⚽", 
                          color: teamStats.goalDifference > 0 ? "#10B981" : "#EF4444",
                          suffix: ""
                        }
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
                            {stat.value}{stat.suffix}
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
                )}

                {/* Top Performers */}
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
                    Bästa spelarna
                  </h3>
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column",
                    gap: "0.75rem"
                  }}>
                    {playerStats
                      .sort((a, b) => b.points - a.points)
                      .slice(0, 3)
                      .map((player, index) => (
                      <div key={player.id} style={{
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
                        e.currentTarget.style.borderColor = "var(--fbc-primary)";
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
                          background: index === 0 ? "linear-gradient(135deg, #F59E0B, #FBBF24)" :
                                     index === 1 ? "linear-gradient(135deg, #9CA3AF, #D1D5DB)" :
                                     "linear-gradient(135deg, #CD7C2F, #F59E0B)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.2rem",
                          color: "#fff",
                          fontWeight: "bold",
                          flexShrink: 0,
                          transition: "transform 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                        }}>
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "0.5rem"
                          }}>
                            <div>
                              <div style={{
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                fontSize: "1.1rem"
                              }}>
                                #{player.jerseyNumber} {player.name}
                              </div>
                              <div style={{
                                color: "var(--text-secondary)",
                                fontSize: "0.9rem"
                              }}>
                                {getPositionIcon(player.position)} {player.position}
                              </div>
                            </div>
                            <div style={{
                              background: "var(--fbc-primary)",
                              color: "#fff",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "8px",
                              fontSize: "0.8rem",
                              fontWeight: 600
                            }}>
                              {player.points} poäng
                            </div>
                          </div>
                          <div style={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "0.9rem",
                            color: "var(--text-secondary)"
                          }}>
                            <span>⚽ {player.goals}</span>
                            <span>🎯 {player.assists}</span>
                            <span>🏒 {player.gamesPlayed} matcher</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Team Form */}
                {teamStats && (
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
                      <SportIcon type="matches" size={20} color="var(--fbc-primary)" />
                      Senaste formen
                    </h3>
                    <div style={{
                      background: "var(--card-background)",
                      borderRadius: "16px",
                      padding: "1.5rem",
                      border: "1px solid var(--border-color)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "0.5rem",
                        marginBottom: "1rem"
                      }}>
                        {teamStats.form.map((result, index) => (
                          <div key={index} style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: result === 'W' ? "#10B981" : 
                                       result === 'D' ? "#F59E0B" : "#EF4444",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
                          }}>
                            {getFormIcon(result)}
                          </div>
                        ))}
                      </div>
                      <div style={{
                        textAlign: "center",
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem"
                      }}>
                        Senaste 5 matcherna • {teamStats.winPercentage}% vinster
                      </div>
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}

        {/* SPELARE TAB */}
        {activeTab === 'players' && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {loadingStates.players ? (
              <div style={{
                background: 'var(--card-background)',
                borderRadius: '16px',
                padding: '3rem',
                border: '1px solid var(--border-color)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid rgba(26, 77, 114, 0.3)',
                  borderTop: '3px solid var(--fbc-primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem auto'
                }} />
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  Laddar spelarstatistik...
                </p>
              </div>
            ) : (
              <>
                {/* Search and Filters */}
                <section style={{ margin: "0 0 1rem 0" }}>
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    background: "var(--card-background)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    border: "1px solid var(--border-color)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}>
                    <h3 style={{ 
                      color: "var(--text-primary)", 
                      fontWeight: 700, 
                      fontSize: "1.2rem", 
                      margin: "0",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      <SportIcon type="settings" size={20} color="var(--fbc-primary)" />
                      Sök & Filtrera
                    </h3>
                    
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                      <input
                        type="text"
                        placeholder="Sök spelare..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          flex: 1,
                          minWidth: "200px",
                          padding: "0.75rem 1rem",
                          borderRadius: "12px",
                          border: "1px solid var(--border-color)",
                          background: "var(--bg-tertiary)",
                          color: "var(--text-primary)",
                          fontSize: "0.9rem"
                        }}
                      />
                      
                      <select
                        value={selectedPosition}
                        onChange={(e) => setSelectedPosition(e.target.value)}
                        style={{
                          padding: "0.75rem 1rem",
                          borderRadius: "12px",
                          border: "1px solid var(--border-color)",
                          background: "var(--bg-tertiary)",
                          color: "var(--text-primary)",
                          fontSize: "0.9rem",
                          minWidth: "150px"
                        }}
                      >
                        <option value="all">Alla positioner</option>
                        <option value="Forward">Forward</option>
                        <option value="Back">Back</option>
                        <option value="Målvakt">Målvakt</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Player Statistics Chart */}
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
                    Spelarprestanda
                  </h3>
                  <div style={{
                    background: "var(--card-background)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    border: "1px solid var(--border-color)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    height: "350px"
                  }}>
                    <Bar data={getPlayerPointsData()} options={chartOptions} />
                  </div>
                </section>

                {/* Player Table */}
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
                    <SportIcon type="profile" size={20} color="var(--fbc-primary)" />
                    Spelarstatistik
                  </h3>
                  
                  <div style={{
                    background: "var(--card-background)",
                    borderRadius: "16px",
                    border: "1px solid var(--border-color)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    overflow: "hidden"
                  }}>
                    {/* Table Header */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "60px 1fr 80px 60px 60px 60px 80px",
                      padding: "1rem",
                      background: "var(--bg-tertiary)",
                      borderBottom: "1px solid var(--border-color)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--text-secondary)"
                    }}>
                      <div onClick={() => sortPlayers('jerseyNumber')} style={{ cursor: "pointer" }}>#</div>
                      <div onClick={() => sortPlayers('name')} style={{ cursor: "pointer" }}>Spelare</div>
                      <div onClick={() => sortPlayers('points')} style={{ cursor: "pointer", textAlign: "center" }}>
                        Poäng {sortBy === 'points' && (sortOrder === 'desc' ? '↓' : '↑')}
                      </div>
                      <div onClick={() => sortPlayers('goals')} style={{ cursor: "pointer", textAlign: "center" }}>
                        Mål {sortBy === 'goals' && (sortOrder === 'desc' ? '↓' : '↑')}
                      </div>
                      <div onClick={() => sortPlayers('assists')} style={{ cursor: "pointer", textAlign: "center" }}>
                        Ass {sortBy === 'assists' && (sortOrder === 'desc' ? '↓' : '↑')}
                      </div>
                      <div onClick={() => sortPlayers('gamesPlayed')} style={{ cursor: "pointer", textAlign: "center" }}>
                        Matcher
                      </div>
                      <div onClick={() => sortPlayers('rating')} style={{ cursor: "pointer", textAlign: "center" }}>
                        Betyg {sortBy === 'rating' && (sortOrder === 'desc' ? '↓' : '↑')}
                      </div>
                    </div>

                    {/* Table Body */}
                    <div style={{ maxHeight: "400px", overflow: "auto" }}>
                      {filteredPlayers().map((player, index) => (
                        <div
                          key={player.id}
                          onClick={() => togglePlayerSelection(player.id)}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "60px 1fr 80px 60px 60px 60px 80px",
                            padding: "1rem",
                            borderBottom: index < filteredPlayers().length - 1 ? "1px solid var(--border-color)" : "none",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            background: selectedPlayers.includes(player.id) ? "rgba(26, 77, 114, 0.1)" : "transparent",
                            animation: `fadeIn 0.6s ease-out ${index * 0.05}s both`
                          }}
                          onMouseEnter={(e) => {
                            if (!selectedPlayers.includes(player.id)) {
                              e.currentTarget.style.background = "var(--hover-background)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!selectedPlayers.includes(player.id)) {
                              e.currentTarget.style.background = "transparent";
                            }
                          }}
                        >
                          <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            fontSize: "0.9rem", 
                            fontWeight: 600,
                            color: "var(--fbc-primary)"
                          }}>
                            #{player.jerseyNumber}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{
                              width: "35px",
                              height: "35px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, var(--fbc-primary), var(--fbc-primary-light))",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontSize: "0.8rem",
                              fontWeight: "bold"
                            }}>
                              {getPositionIcon(player.position)}
                            </div>
                            <div>
                              <div style={{
                                fontWeight: 600,
                                color: "var(--text-primary)",
                                fontSize: "0.9rem"
                              }}>
                                {player.name}
                              </div>
                              <div style={{
                                color: "var(--text-secondary)",
                                fontSize: "0.8rem"
                              }}>
                                {player.position}
                              </div>
                            </div>
                          </div>
                          <div style={{ 
                            textAlign: "center", 
                            fontWeight: 700,
                            color: "var(--fbc-secondary)",
                            fontSize: "1rem"
                          }}>
                            {player.points}
                          </div>
                          <div style={{ textAlign: "center", color: "var(--text-primary)" }}>{player.goals}</div>
                          <div style={{ textAlign: "center", color: "var(--text-primary)" }}>{player.assists}</div>
                          <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>{player.gamesPlayed}</div>
                          <div style={{ 
                            textAlign: "center", 
                            fontWeight: 600,
                            color: player.rating >= 8 ? "#10B981" : player.rating >= 7 ? "#F59E0B" : "#EF4444"
                          }}>
                            {player.rating.toFixed(1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Position Distribution */}
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
                    <SportIcon type="awards" size={20} color="var(--fbc-primary)" />
                    Positionsfördelning
                  </h3>
                  <div style={{
                    background: "var(--card-background)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    border: "1px solid var(--border-color)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    height: "300px"
                  }}>
                    <Doughnut data={getPositionDistribution()} options={chartOptions} />
                  </div>
                </section>
              </>
            )}
          </div>
        )}

        {/* LAG TAB */}
        {activeTab === 'team' && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {loadingStates.team ? (
              <div style={{
                background: 'var(--card-background)',
                borderRadius: '16px',
                padding: '3rem',
                border: '1px solid var(--border-color)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid rgba(26, 77, 114, 0.3)',
                  borderTop: '3px solid var(--fbc-primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem auto'
                }} />
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  Laddar lagstatistik...
                </p>
              </div>
            ) : (
              <>
                {/* Team Performance Metrics */}
                {teamStats && (
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
                      <SportIcon type="awards" size={20} color="var(--fbc-primary)" />
                      Avancerad lagstatistik
                    </h3>
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "1rem"
                    }}>
                      {[
                        { 
                          label: "Powerplay", 
                          value: `${teamStats.powerPlayPercentage}%`, 
                          icon: "⚡", 
                          color: "#F59E0B",
                          description: "Numerärt överläge"
                        },
                        { 
                          label: "Boxplay", 
                          value: `${teamStats.penaltyKillPercentage}%`, 
                          icon: "🛡️", 
                          color: "#10B981",
                          description: "Numerärt underläge"
                        },
                        { 
                          label: "Skottkvot", 
                          value: `${((teamStats.goalsFor / teamStats.shotsFor) * 100).toFixed(1)}%`, 
                          icon: "🎯", 
                          color: "#3B82F6",
                          description: "Måleffektivitet"
                        },
                        { 
                          label: "Målvaktsräddning", 
                          value: `${(((teamStats.shotsAgainst - teamStats.goalsAgainst) / teamStats.shotsAgainst) * 100).toFixed(1)}%`, 
                          icon: "🥅", 
                          color: "#8B5CF6",
                          description: "Räddningsprocent"
                        },
                        { 
                          label: "Skottbalans", 
                          value: `+${teamStats.shotsFor - teamStats.shotsAgainst}`, 
                          icon: "📊", 
                          color: teamStats.shotsFor > teamStats.shotsAgainst ? "#10B981" : "#EF4444",
                          description: "Skott för/emot"
                        },
                        { 
                          label: "Faceoff", 
                          value: `${teamStats.faceoffPercentage}%`, 
                          icon: "🏒", 
                          color: "#CD7C2F",
                          description: "Inspelsvinster"
                        }
                      ].map((stat, index) => (
                        <div
                          key={index}
                          style={{
                            background: "var(--card-background)",
                            borderRadius: "16px",
                            padding: "1.5rem",
                            border: "1px solid var(--border-color)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
                            fontSize: "2rem", 
                            marginBottom: "0.75rem",
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
                            fontSize: "2rem", 
                            fontWeight: 800, 
                            color: stat.color,
                            marginBottom: "0.5rem",
                            textShadow: `0 2px 8px ${stat.color}40`
                          }}>
                            {stat.value}
                          </div>
                          <div style={{ 
                            fontSize: "1rem", 
                            color: "var(--text-primary)",
                            fontWeight: 600,
                            marginBottom: "0.25rem"
                          }}>
                            {stat.label}
                          </div>
                          <div style={{ 
                            fontSize: "0.8rem", 
                            color: "var(--text-secondary)"
                          }}>
                            {stat.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Recent Games */}
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
                    <SportIcon type="matches" size={20} color="var(--fbc-primary)" />
                    Senaste matcherna
                  </h3>
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column",
                    gap: "0.75rem"
                  }}>
                    {recentGames.slice(0, 5).map((game, index) => (
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
                        animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                        e.currentTarget.style.borderColor = game.result === 'W' ? "#10B981" : game.result === 'L' ? "#EF4444" : "#F59E0B";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                        e.currentTarget.style.borderColor = "var(--border-color)";
                      }}>
                        <div style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          background: game.result === 'W' ? "#10B981" : 
                                     game.result === 'D' ? "#F59E0B" : "#EF4444",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          flexShrink: 0
                        }}>
                          {getFormIcon(game.result)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "0.5rem"
                          }}>
                            <div>
                              <div style={{
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                fontSize: "1.1rem"
                              }}>
                                {game.homeAway === 'home' ? 'Hemma vs' : 'Borta mot'} {game.opponent}
                              </div>
                              <div style={{
                                color: "var(--text-secondary)",
                                fontSize: "0.9rem"
                              }}>
                                {new Date(game.date).toLocaleDateString('sv-SE')}
                              </div>
                            </div>
                            <div style={{
                              background: game.result === 'W' ? "#10B981" : 
                                         game.result === 'D' ? "#F59E0B" : "#EF4444",
                              color: "#fff",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "8px",
                              fontSize: "0.9rem",
                              fontWeight: 600
                            }}>
                              {game.goalsFor}-{game.goalsAgainst}
                            </div>
                          </div>
                          <div style={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "0.9rem",
                            color: "var(--text-secondary)"
                          }}>
                            <span>🏠 {game.homeAway === 'home' ? 'Hemma' : 'Borta'}</span>
                            {game.attendance && <span>👥 {game.attendance} åskådare</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Performance Chart */}
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
                    Prestanda över tid
                  </h3>
                  <div style={{
                    background: "var(--card-background)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    border: "1px solid var(--border-color)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    height: "350px"
                  }}>
                    <Line data={getTeamPerformanceData()} options={chartOptions} />
                  </div>
                </section>
              </>
            )}
          </div>
        )}

        {/* TRENDER TAB */}
        {activeTab === 'trends' && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {loadingStates.charts ? (
              <div style={{
                background: 'var(--card-background)',
                borderRadius: '16px',
                padding: '3rem',
                border: '1px solid var(--border-color)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid rgba(26, 77, 114, 0.3)',
                  borderTop: '3px solid var(--fbc-primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem auto'
                }} />
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  Laddar trenddata...
                </p>
              </div>
            ) : (
              <>
                {/* Trend Charts Grid */}
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
                    Trendanalys
                  </h3>
                  
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                    gap: "1.5rem"
                  }}>
                    {/* Goals Trend */}
                    <div style={{
                      background: "var(--card-background)",
                      borderRadius: "16px",
                      padding: "1.5rem",
                      border: "1px solid var(--border-color)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      height: "300px"
                    }}>
                      <h4 style={{ 
                        fontSize: "1rem", 
                        fontWeight: 600, 
                        margin: "0 0 1rem 0",
                        color: "var(--text-primary)"
                      }}>
                        Måltrend per match
                      </h4>
                      <Line data={getTeamPerformanceData()} options={chartOptions} />
                    </div>

                    {/* Player Performance */}
                    <div style={{
                      background: "var(--card-background)",
                      borderRadius: "16px",
                      padding: "1.5rem",
                      border: "1px solid var(--border-color)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      height: "300px"
                    }}>
                      <h4 style={{ 
                        fontSize: "1rem", 
                        fontWeight: 600, 
                        margin: "0 0 1rem 0",
                        color: "var(--text-primary)"
                      }}>
                        Toppspelare poäng
                      </h4>
                      <Bar data={getPlayerPointsData()} options={chartOptions} />
                    </div>
                  </div>
                </section>

                {/* Performance Metrics */}
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
                    <SportIcon type="matches" size={20} color="var(--fbc-primary)" />
                    Prestandaindikatorer
                  </h3>
                  
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "1rem"
                  }}>
                    {[
                      {
                        title: "Måleffektivitet",
                        value: teamStats ? `${((teamStats.goalsFor / teamStats.shotsFor) * 100).toFixed(1)}%` : "0%",
                        trend: "+2.3%",
                        color: "#10B981",
                        icon: "🎯"
                      },
                      {
                        title: "Defensiv stabilitet",
                        value: teamStats ? `${(((teamStats.shotsAgainst - teamStats.goalsAgainst) / teamStats.shotsAgainst) * 100).toFixed(1)}%` : "0%",
                        trend: "+1.8%",
                        color: "#3B82F6",
                        icon: "🛡️"
                      },
                      {
                        title: "Poängsiffra",
                        value: teamStats ? `${(teamStats.points / (teamStats.gamesPlayed * 3) * 100).toFixed(0)}%` : "0%",
                        trend: "+4.2%",
                        color: "#F59E0B",
                        icon: "⭐"
                      },
                      {
                        title: "Hemmaplan",
                        value: "75%",
                        trend: "+5.1%",
                        color: "#8B5CF6",
                        icon: "🏠"
                      }
                    ].map((metric, index) => (
                      <div
                        key={index}
                        style={{
                          background: "var(--card-background)",
                          borderRadius: "16px",
                          padding: "1.5rem",
                          border: "1px solid var(--border-color)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                          e.currentTarget.style.borderColor = metric.color;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                          e.currentTarget.style.borderColor = "var(--border-color)";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                          <div style={{ fontSize: "1.5rem" }}>{metric.icon}</div>
                          <div style={{ 
                            fontSize: "0.9rem", 
                            color: "var(--text-secondary)",
                            fontWeight: 600
                          }}>
                            {metric.title}
                          </div>
                        </div>
                        <div style={{
                          fontSize: "2rem",
                          fontWeight: 800,
                          color: metric.color,
                          marginBottom: "0.5rem"
                        }}>
                          {metric.value}
                        </div>
                        <div style={{
                          fontSize: "0.8rem",
                          color: "#10B981",
                          fontWeight: 600
                        }}>
                          ↗ {metric.trend} sedan förra månaden
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        )}

        {/* JÄMFÖR TAB */}
        {activeTab === 'compare' && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <>
              {/* Player Selection */}
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
                  <SportIcon type="profile" size={20} color="var(--fbc-primary)" />
                  Välj spelare att jämföra (max 3)
                </h3>
                
                <div style={{
                  background: "var(--card-background)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  border: "1px solid var(--border-color)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "1rem"
                  }}>
                    {playerStats.map((player, index) => (
                      <div
                        key={player.id}
                        onClick={() => togglePlayerSelection(player.id)}
                        style={{
                          background: selectedPlayers.includes(player.id) 
                            ? "linear-gradient(135deg, rgba(26, 77, 114, 0.2), rgba(59, 130, 246, 0.1))"
                            : "var(--bg-tertiary)",
                          borderRadius: "12px",
                          padding: "1rem",
                          border: selectedPlayers.includes(player.id) 
                            ? "2px solid var(--fbc-primary)" 
                            : "1px solid var(--border-color)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          animation: `fadeIn 0.6s ease-out ${index * 0.05}s both`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.02)";
                          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, var(--fbc-primary), var(--fbc-primary-light))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "0.9rem",
                            fontWeight: "bold"
                          }}>
                            #{player.jerseyNumber}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontWeight: 600,
                              color: "var(--text-primary)",
                              fontSize: "1rem"
                            }}>
                              {player.name}
                            </div>
                            <div style={{
                              color: "var(--text-secondary)",
                              fontSize: "0.8rem"
                            }}>
                              {player.position} • {player.points} poäng
                            </div>
                          </div>
                          {selectedPlayers.includes(player.id) && (
                            <div style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              background: "var(--fbc-primary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontSize: "0.8rem"
                            }}>
                              ✓
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Comparison Results */}
              {selectedPlayers.length > 0 && (
                <>
                  {/* Radar Chart Comparison */}
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
                      Spelarprofiler
                    </h3>
                    
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: selectedPlayers.length === 1 ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "1.5rem"
                    }}>
                      {selectedPlayers.map((playerId) => {
                        const radarData = getPlayerRadarData(playerId);
                        const player = playerStats.find(p => p.id === playerId);
                        
                        return radarData && player ? (
                          <div
                            key={playerId}
                            style={{
                              background: "var(--card-background)",
                              borderRadius: "16px",
                              padding: "1.5rem",
                              border: "1px solid var(--border-color)",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              height: "350px"
                            }}
                          >
                            <h4 style={{ 
                              fontSize: "1rem", 
                              fontWeight: 600, 
                              margin: "0 0 1rem 0",
                              color: "var(--text-primary)",
                              textAlign: "center"
                            }}>
                              #{player.jerseyNumber} {player.name}
                            </h4>
                            <Radar data={radarData} options={radarOptions} />
                          </div>
                        ) : null;
                      })}
                    </div>
                  </section>

                  {/* Detailed Comparison Table */}
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
                      <SportIcon type="matches" size={20} color="var(--fbc-primary)" />
                      Detaljerad jämförelse
                    </h3>
                    
                    <div style={{
                      background: "var(--card-background)",
                      borderRadius: "16px",
                      border: "1px solid var(--border-color)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: `200px repeat(${selectedPlayers.length}, 1fr)`,
                        background: "var(--bg-tertiary)",
                        borderBottom: "1px solid var(--border-color)"
                      }}>
                        <div style={{ padding: "1rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                          Statistik
                        </div>
                        {selectedPlayers.map(playerId => {
                          const player = playerStats.find(p => p.id === playerId);
                          return player ? (
                            <div key={playerId} style={{ 
                              padding: "1rem", 
                              fontWeight: 600, 
                              color: "var(--text-primary)",
                              textAlign: "center"
                            }}>
                              #{player.jerseyNumber} {player.name.split(' ')[0]}
                            </div>
                          ) : null;
                        })}
                      </div>
                      
                      {[
                        { key: 'points', label: 'Poäng', format: (val: number) => val.toString() },
                        { key: 'goals', label: 'Mål', format: (val: number) => val.toString() },
                        { key: 'assists', label: 'Assist', format: (val: number) => val.toString() },
                        { key: 'gamesPlayed', label: 'Matcher', format: (val: number) => val.toString() },
                        { key: 'shotPercentage', label: 'Skott %', format: (val: number) => `${val.toFixed(1)}%` },
                        { key: 'plusMinus', label: '+/-', format: (val: number) => val > 0 ? `+${val}` : val.toString() },
                        { key: 'rating', label: 'Betyg', format: (val: number) => val.toFixed(1) },
                        { key: 'age', label: 'Ålder', format: (val: number) => `${val} år` }
                      ].map((stat, index) => (
                        <div key={stat.key} style={{
                          display: "grid",
                          gridTemplateColumns: `200px repeat(${selectedPlayers.length}, 1fr)`,
                          borderBottom: index < 7 ? "1px solid var(--border-color)" : "none"
                        }}>
                          <div style={{ 
                            padding: "1rem", 
                            color: "var(--text-secondary)",
                            fontWeight: 500
                          }}>
                            {stat.label}
                          </div>
                          {selectedPlayers.map(playerId => {
                            const player = playerStats.find(p => p.id === playerId);
                            const value = player ? player[stat.key as keyof PlayerStats] as number : 0;
                            const allValues = selectedPlayers.map(id => {
                              const p = playerStats.find(p => p.id === id);
                              return p ? p[stat.key as keyof PlayerStats] as number : 0;
                            });
                            const isHighest = selectedPlayers.length > 1 && value === Math.max(...allValues);
                            
                            return (
                              <div key={playerId} style={{ 
                                padding: "1rem", 
                                textAlign: "center",
                                color: isHighest ? "var(--fbc-secondary)" : "var(--text-primary)",
                                fontWeight: isHighest ? 700 : 500,
                                background: isHighest ? "rgba(245, 158, 11, 0.1)" : "transparent"
                              }}>
                                {stat.format(value)}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {selectedPlayers.length === 0 && (
                <div style={{
                  background: "var(--card-background)",
                  borderRadius: "16px",
                  padding: "3rem",
                  border: "1px solid var(--border-color)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}>📊</div>
                  <h4 style={{ 
                    fontSize: "1.2rem", 
                    fontWeight: 600, 
                    margin: "0 0 0.5rem 0",
                    color: "var(--text-primary)"
                  }}>
                    Välj spelare att jämföra
                  </h4>
                  <p style={{ 
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                    margin: 0
                  }}>
                    Klicka på spelarna ovan för att se detaljerade jämförelser och prestandaanalyser
                  </p>
                </div>
              )}
            </>
          </div>
        )}
      </div>
    </div>
  );
};

export { ModernStatistics };
export default ModernStatistics;
