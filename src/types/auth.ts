export interface PreviousClub {
  name: string;
  startYear: number;
  endYear?: number;
  division?: string;
  achievements?: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  jerseyNumber?: number;
  position?: string;
  role: 'player' | 'leader' | 'admin';
  status: 'pending' | 'approved' | 'suspended';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  phone?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  favoritePosition?: string;
  aboutMe?: string;
  previousClubs?: PreviousClub[];
  joinedDate?: string;
  trainingCount?: number;
  seasonPoints?: number;
  matchCount?: number;
  goalCount?: number;
  assistCount?: number;
  badges?: Badge[];
  stats?: {
    totalTrainings: number;
    totalMatches: number;
    totalGoals: number;
    totalAssists: number;
  };
  notifications: {
    activities: boolean;
    forum: boolean;
    statistics: boolean;
    fines: boolean;
  };
  personalTrainingLog?: PersonalTrainingEntry[];
  statistics?: any;
  totalGamificationPoints?: number;
  avatarUrl?: string;
  isActive?: boolean;
  updatedAt?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color?: string;
  earnedDate: string; // När utmärkelsen erhölls
  type: 'training' | 'match' | 'milestone' | 'achievement' | 'special';
  // Nya fält för mer detaljerade badges
  category?: 'attendance' | 'performance' | 'social' | 'leadership' | 'anniversary';
  progress?: {
    current: number;
    target: number;
  };
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  type: 'training_count' | 'match_count' | 'goal_count' | 'assist_count' | 'anniversary' | 'streak';
  target: number;
  achieved: boolean;
  achievedAt?: string;
  icon: string;
  reward?: {
    points: number;
    badge?: Badge;
    title?: string;
  };
}

export interface PersonalTrainingEntry {
  id: string;
  date: string;
  type: 'gym' | 'running' | 'skills' | 'recovery' | 'other';
  duration: number; // minuter
  intensity: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  feeling: 1 | 2 | 3 | 4 | 5; // 1 = dåligt, 5 = utmärkt
  skills?: string[]; // Fokusområden för träningen
  stats?: {
    goals?: number;
    shots?: number;
    assists?: number;
    distance?: number; // km för löpning
    weight?: number; // kg för gym
  };
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  phone?: string;
  jerseyNumber?: number;
  position?: string;
  favoritePosition?: string;
  aboutMe?: string;
  previousClubs?: PreviousClub[];
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  role?: 'player' | 'leader' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UserProfile extends User {
  // Sociala funktioner
  shareProfile: boolean;
  showStatistics: boolean;
  showHistory: boolean;
  
  // Milstolpar och prestationer
  milestones: Milestone[];
  currentStreak: number; // Aktuell träningsstreak
  longestStreak: number; // Längsta träningsstreak
  
  // Spelarhistorik
  clubHistory: {
    clubName: string;
    seasons: string[];
    position?: string;
    achievements?: string[];
  }[];
  
  // Avancerade inställningar
  privacy: {
    showEmergencyContactToLeaders: boolean;
    allowDirectMessages: boolean;
    showOnlineStatus: boolean;
  };
}
