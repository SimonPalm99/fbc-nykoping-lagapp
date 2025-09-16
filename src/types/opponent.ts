// Typdefinitioner för motståndare

export interface OpponentPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
  height?: string;
  weight?: string;
  age?: number;
  strengths: string[];
  weaknesses: string[];
  statistics?: {
    goals: number;
    assists: number;
    points: number;
    penaltyMinutes: number;
    gamesPlayed: number;
  };
  notes: string;
}

export interface OpponentTeam {
  id: string;
  name: string;
  league: string;
  homeVenue: string;
  coach: string;
  founded?: number;
  website?: string;
  logoUrl?: string;
  colors: {
    primary: string;
    secondary: string;
  };
  players: OpponentPlayer[];
  teamStats: {
    gamesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    goalsFor: number;
    goalsAgainst: number;
    powerplayPercentage: number;
    penaltyKillPercentage: number;
  };
  playStyle: {
    offense: "aggressive" | "balanced" | "defensive";
    defense: "aggressive" | "balanced" | "conservative";
    tempo: "fast" | "medium" | "slow";
    physicality: "high" | "medium" | "low";
  };
  strengths: string[];
  weaknesses: string[];
  keyPlayers: string[]; // player IDs
  notes: string;
  lastUpdated: string;
  updatedBy: string;
  matches?: OpponentMatch[];
  analysis?: OpponentAnalysis[];
}

export interface OpponentMatch {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  score: {
    home: number;
    away: number;
  };
  venue: string;
  keyEvents: string[];
  ourPerformance: {
    rating: number; // 1-10
    strengths: string[];
    weaknesses: string[];
    mvp?: string;
    notes: string;
  };
  opponentPerformance: {
    rating: number; // 1-10
    strengths: string[];
    weaknesses: string[];
    keyPlayers: string[];
    notes: string;
  };
  tactics: {
    ourFormation: string;
    theirFormation: string;
    ourTactics: string[];
    theirTactics: string[];
  };
  videoLinks: {
    url: string;
    title: string;
    timestamp?: string;
  }[];
  statisticsLink?: string;
  result?: string;
  homeOrAway: "home" | "away";
  report?: string;
  highlights?: string[];
  analysisId?: string;
}

export interface OpponentAnalysis {
  id: string;
  teamId: string;
  strengths: string[];
  weaknesses: string[];
  tactics: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface ScoutingReport {
  id: string;
  opponentId: string;
  matchDate: string;
  scoutedBy: string;
  scoutingDate: string;
  keyFindings: string[];
  recommendations: string[];
  tacticalNotes: string;
  playerSpotlight: {
    playerId: string;
    performance: string;
    threats: string[];
    howToDefend: string;
  }[];
  teamFormation: string;
  setPlays: {
    situation: string;
    description: string;
    howToDefend: string;
  }[];
  confidence: number; // 1-10 hur säker scouten är
  nextSteps: string[];
}