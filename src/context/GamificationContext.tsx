import { createContext, useContext, useState, ReactNode } from "react";
import { Badge, Achievement, Challenge, GamificationProfile } from "../types/gamification";

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  type: 'training' | 'social' | 'performance' | 'fitness';
  difficulty: 'easy' | 'medium' | 'hard';
  requirement: {
    action: string;
    count: number;
    timeframe: 'day' | 'week' | 'month';
  };
  expires: string;
  isCompleted: boolean;
  progress: number;
}

interface GamificationContextType {
  profile: GamificationProfile | null;
  achievements: Achievement[];
  challenges: Challenge[];
  badges: Badge[];
  dailyChallenges: DailyChallenge[];
  
  // Actions
  addXP: (amount: number, reason: string) => void;
  completeChallenge: (challengeId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  updateDailyChallenges: () => void;
  
  // Stats
  getTotalXP: () => number;
  getCurrentLevel: () => number;
  getXPToNextLevel: () => number;
  getLeaderboard: () => any[];
  getUserRank: (userId: string) => number;
  
  // Social
  shareAchievement: (achievementId: string) => void;
  giveLike: (userId: string, contentId: string) => void;
  
  // Weekly/Monthly challenges
  getWeeklyChallenges: () => Challenge[];
  getMonthlyChallenges: () => Challenge[];
  
  // Gamification stats
  getGamificationStats: () => any;
  
  // Progress tracking
  trackProgress: (action: string, value: number) => void;
  getProgress: (category: string) => number;
  
  // Rewards
  claimReward: (rewardId: string) => void;
  getPendingRewards: () => any[];
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

interface GamificationProviderProps {
  children: ReactNode;
}

export const GamificationProvider = ({ children }: GamificationProviderProps) => {
  const [profile] = useState<GamificationProfile | null>(null);
  const [achievements] = useState<Achievement[]>([]);
  const [challenges] = useState<Challenge[]>([]);
  const [badges] = useState<Badge[]>([]);
  const [dailyChallenges] = useState<DailyChallenge[]>([]);

  const addXP = (amount: number, reason: string) => {
    console.log(`Added ${amount} XP for: ${reason}`);
  };

  const completeChallenge = (challengeId: string) => {
    console.log(`Completed challenge: ${challengeId}`);
  };

  const unlockAchievement = (achievementId: string) => {
    console.log(`Unlocked achievement: ${achievementId}`);
  };

  const updateDailyChallenges = () => {
    console.log('Updated daily challenges');
  };

  const getTotalXP = () => profile?.xp || 0;
  const getCurrentLevel = () => profile?.level || 1;
  const getXPToNextLevel = () => Math.max(0, ((profile?.level || 1) * 100) - (profile?.xp || 0));
  const getLeaderboard = () => [];
  const getUserRank = (_userId: string) => 1;
  const shareAchievement = (_achievementId: string) => {};
  const giveLike = (_userId: string, _contentId: string) => {};
  const getWeeklyChallenges = () => [];
  const getMonthlyChallenges = () => [];
  const getGamificationStats = () => ({});
  const trackProgress = (_action: string, _value: number) => {};
  const getProgress = (_category: string) => 0;
  const claimReward = (_rewardId: string) => {};
  const getPendingRewards = () => [];

  const value: GamificationContextType = {
    profile,
    achievements,
    challenges,
    badges,
    dailyChallenges,
    addXP,
    completeChallenge,
    unlockAchievement,
    updateDailyChallenges,
    getTotalXP,
    getCurrentLevel,
    getXPToNextLevel,
    getLeaderboard,
    getUserRank,
    shareAchievement,
    giveLike,
    getWeeklyChallenges,
    getMonthlyChallenges,
    getGamificationStats,
    trackProgress,
    getProgress,
    claimReward,
    getPendingRewards
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};
