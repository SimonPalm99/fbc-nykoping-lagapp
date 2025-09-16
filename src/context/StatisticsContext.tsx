import { createContext, useContext, useState, ReactNode } from "react";
import { StatisticEvent } from "../types/statistics";
import { useAuth } from "./AuthContext";

// Enhanced Statistics Types
interface PersonalStats {
  userId: string;
  goals: number;
  assists: number;
  points: number;
  gamesPlayed: number;
  penalties: number;
  blocks: number;
  shots: number;
  saves: number;
  shotsOnGoal: number;
  shotPercentage: number;
  plusMinus: number;
  avgTimeOnIce: number; // minutes
  faceoffWins: number;
  faceoffTotal: number;
  faceoffPercentage: number;
  hits: number;
  takeaways: number;
  giveaways: number;
}

interface GameStats {
  gameId: string;
  date: string;
  opponent: string;
  isHome: boolean;
  result: 'win' | 'loss' | 'tie';
  goalsFor: number;
  goalsAgainst: number;
  personalStats: PersonalStats;
}

interface PerformanceTrends {
  userId: string;
  last5Games: number[];
  last10Games: number[];
  seasonAverage: number;
  bestGame: number;
  worstGame: number;
  consistency: number; // 0-100 scale
  improvement: number; // percentage change from start of season
}

// Dummydata för förbättrad statistik
const initialGames: GameStats[] = [
  {
    gameId: "g1",
    date: "2025-06-20",
    opponent: "Södertälje SK",
    isHome: true,
    result: 'win',
    goalsFor: 4,
    goalsAgainst: 2,
    personalStats: {
      userId: "2",
      goals: 2,
      assists: 1,
      points: 3,
      gamesPlayed: 1,
      penalties: 0,
      blocks: 2,
      shots: 5,
      saves: 0,
      shotsOnGoal: 4,
      shotPercentage: 40,
      plusMinus: 2,
      avgTimeOnIce: 18.5,
      faceoffWins: 8,
      faceoffTotal: 12,
      faceoffPercentage: 66.7,
      hits: 3,
      takeaways: 2,
      giveaways: 1
    }
  },
  {
    gameId: "g2",
    date: "2025-06-15",
    opponent: "AIK",
    isHome: false,
    result: 'loss',
    goalsFor: 1,
    goalsAgainst: 3,
    personalStats: {
      userId: "2",
      goals: 0,
      assists: 1,
      points: 1,
      gamesPlayed: 1,
      penalties: 1,
      blocks: 1,
      shots: 3,
      saves: 0,
      shotsOnGoal: 2,
      shotPercentage: 0,
      plusMinus: -1,
      avgTimeOnIce: 16.2,
      faceoffWins: 5,
      faceoffTotal: 10,
      faceoffPercentage: 50,
      hits: 2,
      takeaways: 1,
      giveaways: 2
    }
  }
];

// Dummydata
const initialEvents: StatisticEvent[] = [
  {
    id: "e1",
    activityId: "a2",
    userId: "2",
    type: "mål",
    time: "12:22",
    comment: "Snyggt skott"
  },
  {
    id: "e2",
    activityId: "a2",
    userId: "3",
    type: "assist",
    time: "12:22"
  },
  {
    id: "e3",
    activityId: "a2",
    userId: "2",
    type: "utvisning",
    time: "25:10",
    comment: "Slashing"
  }
];

interface StatisticsContextType {
  events: StatisticEvent[];
  games: GameStats[];
  addEvent: (ev: Omit<StatisticEvent, "id">) => void;
  removeEvent: (id: string) => void;
  addGame: (game: Omit<GameStats, "gameId">) => void;
  getSummaryForUser: (userId: string) => PersonalStats;
  getSeasonStatsForUser: (userId: string) => PersonalStats;
  getGameStatsForUser: (userId: string, gameId: string) => PersonalStats | null;
  getRecentGamesForUser: (userId: string, limit?: number) => GameStats[];
  getPerformanceTrends: (userId: string) => PerformanceTrends;
  getLeaderboard: (stat: keyof PersonalStats) => Array<{ userId: string; value: number; rank: number }>;
  getTeamStats: () => {
    totalGames: number;
    wins: number;
    losses: number;
    ties: number;
    winPercentage: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifferential: number;
  };
  getEventsForActivity: (activityId: string) => StatisticEvent[];
  compareUsers: (userIds: string[]) => { [userId: string]: PersonalStats };
}

export const StatisticsContext = createContext<StatisticsContextType | undefined>(undefined);

export const StatisticsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<StatisticEvent[]>(initialEvents);
  const [games, setGames] = useState<GameStats[]>(initialGames);
  const { user: _user } = useAuth();

  const addEvent = (ev: Omit<StatisticEvent, "id">) => {
    const newEv: StatisticEvent = { ...ev, id: Math.random().toString(36).slice(2) };
    setEvents(prev => [...prev, newEv]);
  };

  const removeEvent = (id: string) =>
    setEvents(prev => prev.filter(e => e.id !== id));

  const addGame = (game: Omit<GameStats, "gameId">) => {
    const newGame: GameStats = {
      ...game,
      gameId: Math.random().toString(36).slice(2)
    };
    setGames(prev => [...prev, newGame]);
  };

  const getSummaryForUser = (userId: string): PersonalStats => {
    const userEvents = events.filter(e => e.userId === userId);
    const userGames = games.filter(g => g.personalStats.userId === userId);
    
    if (userGames.length === 0) {
      return {
        userId,
        goals: userEvents.filter(e => e.type === "mål").length,
        assists: userEvents.filter(e => e.type === "assist").length,
        points: userEvents.filter(e => e.type === "mål" || e.type === "assist").length,
        gamesPlayed: new Set(userEvents.map(e => e.activityId)).size,
        penalties: userEvents.filter(e => e.type === "utvisning").length,
        blocks: userEvents.filter(e => e.type === "block").length,
        shots: userEvents.filter(e => e.type === "skott").length,
        saves: userEvents.filter(e => e.type === "räddning").length,
        shotsOnGoal: 0,
        shotPercentage: 0,
        plusMinus: 0,
        avgTimeOnIce: 0,
        faceoffWins: 0,
        faceoffTotal: 0,
        faceoffPercentage: 0,
        hits: 0,
        takeaways: 0,
        giveaways: 0
      };
    }

    // Aggregate stats from all games
    const totalStats = userGames.reduce((acc, game) => {
      const stats = game.personalStats;
      return {
        goals: acc.goals + stats.goals,
        assists: acc.assists + stats.assists,
        points: acc.points + stats.points,
        penalties: acc.penalties + stats.penalties,
        blocks: acc.blocks + stats.blocks,
        shots: acc.shots + stats.shots,
        saves: acc.saves + stats.saves,
        shotsOnGoal: acc.shotsOnGoal + stats.shotsOnGoal,
        plusMinus: acc.plusMinus + stats.plusMinus,
        timeOnIce: acc.timeOnIce + stats.avgTimeOnIce,
        faceoffWins: acc.faceoffWins + stats.faceoffWins,
        faceoffTotal: acc.faceoffTotal + stats.faceoffTotal,
        hits: acc.hits + stats.hits,
        takeaways: acc.takeaways + stats.takeaways,
        giveaways: acc.giveaways + stats.giveaways
      };
    }, {
      goals: 0, assists: 0, points: 0, penalties: 0, blocks: 0,
      shots: 0, saves: 0, shotsOnGoal: 0, plusMinus: 0, timeOnIce: 0,
      faceoffWins: 0, faceoffTotal: 0, hits: 0, takeaways: 0, giveaways: 0
    });

    return {
      userId,
      goals: totalStats.goals,
      assists: totalStats.assists,
      points: totalStats.points,
      gamesPlayed: userGames.length,
      penalties: totalStats.penalties,
      blocks: totalStats.blocks,
      shots: totalStats.shots,
      saves: totalStats.saves,
      shotsOnGoal: totalStats.shotsOnGoal,
      shotPercentage: totalStats.shots > 0 ? (totalStats.goals / totalStats.shots) * 100 : 0,
      plusMinus: totalStats.plusMinus,
      avgTimeOnIce: userGames.length > 0 ? totalStats.timeOnIce / userGames.length : 0,
      faceoffWins: totalStats.faceoffWins,
      faceoffTotal: totalStats.faceoffTotal,
      faceoffPercentage: totalStats.faceoffTotal > 0 ? (totalStats.faceoffWins / totalStats.faceoffTotal) * 100 : 0,
      hits: totalStats.hits,
      takeaways: totalStats.takeaways,
      giveaways: totalStats.giveaways
    };
  };

  const getSeasonStatsForUser = (userId: string): PersonalStats => {
    return getSummaryForUser(userId);
  };

  const getGameStatsForUser = (userId: string, gameId: string): PersonalStats | null => {
    const game = games.find(g => g.gameId === gameId && g.personalStats.userId === userId);
    return game ? game.personalStats : null;
  };

  const getRecentGamesForUser = (userId: string, limit = 5): GameStats[] => {
    return games
      .filter(g => g.personalStats.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const getPerformanceTrends = (userId: string): PerformanceTrends => {
    const userGames = getRecentGamesForUser(userId, 10);
    const last5 = userGames.slice(0, 5).map(g => g.personalStats.points);
    const last10 = userGames.slice(0, 10).map(g => g.personalStats.points);
    
    const allGames = games.filter(g => g.personalStats.userId === userId);
    const seasonAverage = allGames.length > 0 
      ? allGames.reduce((sum, g) => sum + g.personalStats.points, 0) / allGames.length 
      : 0;
    
    const bestGame = Math.max(...allGames.map(g => g.personalStats.points), 0);
    const worstGame = Math.min(...allGames.map(g => g.personalStats.points), 0);
    
    // Calculate consistency (lower variance = higher consistency)
    const variance = allGames.length > 1 
      ? allGames.reduce((sum, g) => sum + Math.pow(g.personalStats.points - seasonAverage, 2), 0) / allGames.length
      : 0;
    const consistency = Math.max(0, 100 - (variance * 10));

    // Calculate improvement (compare first and last 5 games)
    const firstHalf = allGames.slice(-Math.floor(allGames.length / 2));
    const secondHalf = allGames.slice(0, Math.floor(allGames.length / 2));
    const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, g) => sum + g.personalStats.points, 0) / firstHalf.length : 0;
    const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, g) => sum + g.personalStats.points, 0) / secondHalf.length : 0;
    const improvement = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;

    return {
      userId,
      last5Games: last5,
      last10Games: last10,
      seasonAverage,
      bestGame,
      worstGame,
      consistency,
      improvement
    };
  };

  const getLeaderboard = (stat: keyof PersonalStats): Array<{ userId: string; value: number; rank: number }> => {
    const allUsers = Array.from(new Set(games.map(g => g.personalStats.userId)));
    const userStats = allUsers.map(userId => {
      const stats = getSummaryForUser(userId);
      return {
        userId,
        value: stats[stat] as number,
        rank: 0
      };
    });

    // Sort and assign ranks
    userStats.sort((a, b) => b.value - a.value);
    userStats.forEach((item, index) => {
      item.rank = index + 1;
    });

    return userStats;
  };

  const getTeamStats = () => {
    const totalGames = games.length;
    const wins = games.filter(g => g.result === 'win').length;
    const losses = games.filter(g => g.result === 'loss').length;
    const ties = games.filter(g => g.result === 'tie').length;
    const winPercentage = totalGames > 0 ? (wins / totalGames) * 100 : 0;
    const goalsFor = games.reduce((sum, g) => sum + g.goalsFor, 0);
    const goalsAgainst = games.reduce((sum, g) => sum + g.goalsAgainst, 0);
    const goalDifferential = goalsFor - goalsAgainst;

    return {
      totalGames,
      wins,
      losses,
      ties,
      winPercentage,
      goalsFor,
      goalsAgainst,
      goalDifferential
    };
  };

  const getEventsForActivity = (activityId: string) =>
    events.filter(e => e.activityId === activityId);

  const compareUsers = (userIds: string[]): { [userId: string]: PersonalStats } => {
    return userIds.reduce((acc, userId) => {
      acc[userId] = getSummaryForUser(userId);
      return acc;
    }, {} as { [userId: string]: PersonalStats });
  };

  return (
    <StatisticsContext.Provider value={{
      events,
      games,
      addEvent,
      removeEvent,
      addGame,
      getSummaryForUser,
      getSeasonStatsForUser,
      getGameStatsForUser,
      getRecentGamesForUser,
      getPerformanceTrends,
      getLeaderboard,
      getTeamStats,
      getEventsForActivity,
      compareUsers
    }}>
      {children}
    </StatisticsContext.Provider>
  );
};

export const useStatistics = () => {
  const ctx = useContext(StatisticsContext);
  if (!ctx) throw new Error("useStatistics måste användas inom StatisticsProvider");
  return ctx;
};