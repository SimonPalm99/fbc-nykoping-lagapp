export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "training" | "match" | "social" | "milestone" | "special";
  requirements: {
    type: "count" | "streak" | "single" | "average";
    metric: string; // "goals", "assists", "training_attendance", etc.
    value: number;
    timeframe?: "season" | "month" | "career";
  };
  xpReward: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  isActive: boolean;
  createdAt: string;
  // Gamla fält för bakåtkompatibilitet
  label?: string;
  date?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: "performance" | "leadership" | "teamwork" | "dedication" | "fun";
  requirements: string;
  xpValue: number;
  color: string;
  isLimited: boolean; // begränsat antal per säsong
  availableUntil?: string;
  // Gamla fält för bakåtkompatibilitet
  label?: string;
  icon?: string;
  date?: string;
  awardedBy?: string;
  activityId?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "individual" | "team";
  category: "fitness" | "skill" | "teamwork" | "attendance" | "fun";
  startDate: string;
  endDate: string;
  requirements: {
    metric: string;
    target: number;
    unit: string;
  };
  rewards: {
    xp: number;
    badge?: string;
    title?: string;
  };
  participants: string[]; // user IDs
  progress: {
    userId: string;
    current: number;
    completed: boolean;
    completedAt?: string;
  }[];
  isActive: boolean;
  createdBy: string;
  // Gamla fält för bakåtkompatibilitet
  deadline?: string;
  completedBy?: string[];
}

export interface PlayerXP {
  userId: string;
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  xpHistory: {
    date: string;
    amount: number;
    reason: string;
    category: "training" | "match" | "achievement" | "challenge" | "bonus";
  }[];
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  value: number;
  rank: number;
  change: number; // förändring sedan förra veckan/månaden
}

export interface Leaderboard {
  id: string;
  title: string;
  description: string;
  metric: "xp" | "goals" | "assists" | "training_attendance" | "match_attendance";
  timeframe: "week" | "month" | "season" | "alltime";
  entries: LeaderboardEntry[];
  lastUpdated: string;
  isActive: boolean;
}

export interface MVP {
  id: string;
  userId: string;
  matchId?: string;
  period: "match" | "week" | "month";
  date: string;
  reason: string;
  votedBy: string[];
  statistics?: {
    goals: number;
    assists: number;
    saves?: number;
    rating: number;
  };
  description: string;
}

export interface TeamReward {
  id: string;
  title: string;
  description: string;
  requirement: string;
  reward: string;
  achieved: boolean;
  achievedDate?: string;
  participants: string[];
}

export interface GamificationProfile {
  userId: string;
  xp: number;
  level: number;
  badges: Badge[];
  achievements: Achievement[];
  challenges: Challenge[];
  playerXP?: PlayerXP;
  mvpAwards: MVP[];
}