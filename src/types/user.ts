export type UserRole = "player" | "leader" | "admin";

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  dateEarned: string;
  category: "milestone" | "achievement" | "seasonal" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number; // gamification points
}

export interface UserMilestone {
  id: string;
  type: "training" | "match" | "goal" | "assist" | "save" | "season";
  name: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  dateCompleted?: string;
  reward?: UserBadge;
}

export interface TrainingLog {
  id: string;
  date: string;
  feeling: number; // 1-5 scale
  note: string;
  duration?: number; // minutes
  intensity?: number; // 1-5 scale
  skills?: string[]; // fokusområden
  stats?: {
    goals?: number;
    assists?: number;
    shots?: number;
  };
}

export interface IceContact {
  name: string;
  phone: string;
  relation: string;
  isPrimary: boolean;
}

export interface ClubHistory {
  id: string;
  clubName: string;
  season: string;
  league: string;
  position: string;
  achievements?: string[];
}

export interface InjuryReport {
  id: string;
  date: string;
  type: string;
  severity: "minor" | "moderate" | "severe";
  description: string;
  expectedReturn?: string;
  rehabPlan?: string[];
  status: "injured" | "rehab" | "recovered";
  updatedBy: string;
}

export interface UserStatistics {
  gamesPlayed: number;
  attendance?: number; // närvaro i procent
  goals: number;
  assists: number;
  points: number;
  shots: number;
  shotPercentage: number;
  plusMinus: number;
  penaltyMinutes: number;
  blocks: number;
  steals: number;
  saves?: number; // för målvakter
  savePercentage?: number; // för målvakter
  goalsAgainst?: number; // för målvakter
  gaa?: number; // goals against average för målvakter
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  jerseyNumber: number;
  role: UserRole;
  isApproved: boolean;
  profileImageUrl: string;
  favoritePosition: string;
  about: string;
  badges: UserBadge[];
  milestones: UserMilestone[];
  clubHistory: ClubHistory[];
  iceContacts: IceContact[];
  trainingLogs: TrainingLog[];
  injuries: InjuryReport[];
  statistics: UserStatistics;
  birthday: string;
  phone: string;
  address?: string;
  emergencyMedicalInfo?: string;
  joinDate: string;
  lastActive: string;
  totalGamificationPoints: number;
  preferences: {
    notifications: boolean;
    publicProfile: boolean;
    showStats: boolean;
    language: "sv" | "en";
    theme: "light" | "dark" | "auto";
    shareLocation: boolean;
  };
  fines: {
    total: number;
    paid: number;
    outstanding: number;
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  achievements: {
    mvpVotes: number;
    playerOfTheWeek: number;
    consecutiveTrainings: number;
    bestStreak: number;
  };
}

// Här är din array
export const usersData: User[] = [
  {
    id: "1",
    name: "Anna Andersson",
    email: "anna@example.com",
    jerseyNumber: 10,
  role: "player",
    isApproved: false,
    profileImageUrl: "",
    favoritePosition: "Forward",
    about: "Spelar i FBC Nyköping sedan 2023",
    badges: [
      {
        id: "badge1",
        name: "Första målet",
        description: "Gjorde sitt första mål för laget",
        dateEarned: "2025-03-15",
        category: "milestone",
        rarity: "common",
        points: 10
      }
    ],
    milestones: [
      {
        id: "milestone1",
        type: "training",
        name: "100 träningar",
        description: "Delta i 100 träningar",
        target: 100,
        current: 45,
        completed: false
      },
      {
        id: "milestone2",
        type: "goal",
        name: "10 mål",
        description: "Gör 10 mål denna säsong",
        target: 10,
        current: 8,
        completed: false
      }
    ],
    clubHistory: [
      {
        id: "club1",
        clubName: "Nyköping IBK",
        season: "2022/2023",
        league: "Division 3",
        position: "Forward",
        achievements: ["Nykomling av året"]
      }
    ],
    iceContacts: [
      {
        name: "Mamma Andersson",
        phone: "0701234567",
        relation: "Mamma",
        isPrimary: true
      }
    ],
    trainingLogs: [
      {
        id: "log1",
        date: "2025-06-20",
        feeling: 4,
        note: "Bra träning, fokus på skott",
        duration: 90,
        intensity: 3,
        skills: ["skott", "teknik"],
        stats: {
          goals: 2,
          assists: 1,
          shots: 8
        }
      }
    ],
    injuries: [],
    statistics: {
      gamesPlayed: 15,
      goals: 8,
      assists: 5,
      points: 13,
      shots: 42,
      shotPercentage: 19.0,
      plusMinus: 2,
      penaltyMinutes: 6,
      blocks: 8,
      steals: 12
    },
    birthday: "1995-08-15",
    phone: "0701234567",
    joinDate: "2025-01-15",
    lastActive: "2025-06-25",
    totalGamificationPoints: 145,
    preferences: {
      notifications: true,
      publicProfile: true,
      showStats: true,
      language: "sv",
      theme: "auto",
      shareLocation: false
    },
    fines: {
      total: 150,
      paid: 100,
      outstanding: 50
    },
    socialMedia: {
      instagram: "@anna_andersson_10"
    },
    achievements: {
      mvpVotes: 2,
      playerOfTheWeek: 1,
      consecutiveTrainings: 12,
      bestStreak: 15
    }
  },
  {
    id: "2",
    name: "Bertil Berg",
    email: "bertil@example.com",
    jerseyNumber: 22,
  role: "leader",
    isApproved: true,
    profileImageUrl: "",
    favoritePosition: "Tränare",
    about: "Huvudtränare för FBC Nyköping, 10 års erfarenhet",
    badges: [
      {
        id: "badge2",
        name: "Ledarskap",
        description: "Utmärkt ledarskap på och utanför plan",
        dateEarned: "2025-01-01",
        category: "special",
        rarity: "legendary",
        points: 100
      }
    ],
    clubHistory: [
      {
        id: "club2",
        clubName: "Stockholms IBF",
        season: "2015-2020",
        league: "Allsvenskan",
        position: "Mittfältare",
        achievements: ["SM-silver 2018"]
      }
    ],
    iceContacts: [
      {
        name: "Fru Berg",
        phone: "0707654321",
        relation: "Fru",
        isPrimary: true
      }
    ],
    trainingLogs: [],
    injuries: [],
    statistics: {
      gamesPlayed: 0, // Ledare spelar inte
      goals: 0,
      assists: 0,
      points: 0,
      shots: 0,
      shotPercentage: 0,
      plusMinus: 0,
      penaltyMinutes: 0,
      blocks: 0,
      steals: 0
    },
    birthday: "1980-05-20",
    phone: "0707654321",
    joinDate: "2024-08-01",
    lastActive: "2025-06-25",
    totalGamificationPoints: 250,
    preferences: {
      notifications: true,
      publicProfile: true,
      showStats: false,
      language: "sv",
      theme: "light",
      shareLocation: false
    },
    fines: {
      total: 0,
      paid: 0,
      outstanding: 0
    },
    socialMedia: {
      facebook: "bertil.berg.coach"
    },
    achievements: {
      mvpVotes: 0,
      playerOfTheWeek: 0,
      consecutiveTrainings: 0,
      bestStreak: 0
    },
    milestones: [
      {
        id: "leadership1",
        type: "training",
        name: "100 träningspass som ledare",
        description: "Genomför 100 träningspass som huvudtränare",
        target: 100,
        current: 85,
        completed: false
      }
    ]
  },
  {
    id: "3",
    name: "Carl Carlsson",
    email: "carl@example.com",
    jerseyNumber: 7,
  role: "player",
    isApproved: true,
    profileImageUrl: "",
    favoritePosition: "Målvakt",
    about: "Förstamålvakt, drömmer om att bli professionell",
    badges: [
      {
        id: "badge3",
        name: "Nollställning",
        description: "Första nollställningen i karriären",
        dateEarned: "2025-04-10",
        category: "achievement",
        rarity: "rare",
        points: 25
      }
    ],
    milestones: [
      {
        id: "milestone3_1",
        type: "save",
        name: "100 räddningar",
        description: "Gör 100 räddningar denna säsong",
        target: 100,
        current: 67,
        completed: false
      }
    ],
    clubHistory: [],
    iceContacts: [
      {
        name: "Pappa Carlsson",
        phone: "0705555555",
        relation: "Pappa",
        isPrimary: true
      }
    ],
    trainingLogs: [
      {
        id: "log2",
        date: "2025-06-22",
        feeling: 5,
        note: "Målvaktsträning, jobbade med reflexer",
        duration: 60,
        intensity: 4,
        skills: ["reflexer", "positionering"]
      }
    ],
    injuries: [],
    statistics: {
      gamesPlayed: 12,
      goals: 0,
      assists: 2,
      points: 2,
      shots: 0,
      shotPercentage: 0,
      plusMinus: 8,
      penaltyMinutes: 2,
      blocks: 0,
      steals: 0,
      saves: 234,
      savePercentage: 89.2,
      goalsAgainst: 28,
      gaa: 2.33
    },
    birthday: "1998-12-03",
    phone: "0705555555",
    joinDate: "2025-02-01",
    lastActive: "2025-06-24",
    totalGamificationPoints: 198,
    preferences: {
      notifications: true,
      publicProfile: true,
      showStats: true,
      language: "sv",
      theme: "dark",
      shareLocation: false
    },
    fines: {
      total: 0,
      paid: 0,
      outstanding: 0
    },
    achievements: {
      mvpVotes: 5,
      playerOfTheWeek: 3,
      consecutiveTrainings: 8,
      bestStreak: 22
    }
  }
];
