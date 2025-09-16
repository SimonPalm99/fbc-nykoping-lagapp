// Typdefinitioner för ligatabeller och resultat

export interface LeagueTeam {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
  homeVenue: string;
}

export interface LeagueMatch {
  id: string;
  date: string;
  time: string;
  homeTeam: LeagueTeam;
  awayTeam: LeagueTeam;
  venue: string;
  round: number;
  status: "upcoming" | "live" | "finished" | "postponed";
  result?: {
    homeGoals: number;
    awayGoals: number;
    overtime?: boolean;
    penalties?: boolean;
  };
  events?: MatchEvent[];
}

export interface MatchEvent {
  id: string;
  time: string;
  period: 1 | 2 | 3 | "OT" | "SO";
  type: "goal" | "penalty" | "timeout" | "period_end";
  team: "home" | "away";
  player?: string;
  assist?: string[];
  description: string;
}

export interface LeagueTableEntry {
  position: number;
  team: LeagueTeam;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ("W" | "D" | "L")[];  // Senaste 5 matcherna
  trend: "up" | "down" | "same"; // Förändring sedan förra omgången
}

export interface LeagueTable {
  id: string;
  leagueName: string;
  season: string;
  division: string;
  lastUpdated: string;
  round: number;
  entries: LeagueTableEntry[];
}

export interface LeagueStats {
  topScorers: {
    player: string;
    team: string;
    goals: number;
    assists: number;
    points: number;
  }[];
  topAssists: {
    player: string;
    team: string;
    assists: number;
  }[];
  disciplinary: {
    player: string;
    team: string;
    yellowCards: number;
    redCards: number;
    penaltyMinutes: number;
  }[];
}

export interface LeagueData {
  table: LeagueTable;
  fixtures: LeagueMatch[];
  results: LeagueMatch[];
  stats: LeagueStats;
}
