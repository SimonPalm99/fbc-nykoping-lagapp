export interface MatchEvent {
  id: string;
  type: "goal" | "assist" | "penalty" | "save" | "shot" | "block" | "steal" | "substitution";
  playerId: string;
  time: string; // MM:SS format
  period: number;
  x?: number; // position on field (0-100)
  y?: number; // position on field (0-100)
  assistedBy?: string; // player ID
  penaltyType?: string;
  penaltyMinutes?: number;
  shotType?: "goal" | "save" | "miss" | "post";
  formation?: string; // vilket lag/formation som var på plan
  videoTimestamp?: string;
  note?: string;
}

export interface MatchLineup {
  id: string;
  name: string;
  players: string[]; // player IDs
  formation: "5v5" | "4v5" | "5v4" | "4v4" | "6v5" | "5v6";
  isStarting: boolean;
}

export interface MatchPlan {
  id: string;
  matchId: string;
  createdBy: string;
  lineups: MatchLineup[];
  tactics: string[]; // tactic IDs
  notes: string;
  substitutionPlan?: {
    playerId: string;
    replaceId: string;
    time?: string;
  }[];
  specialSituations: {
    powerplay: MatchLineup[];
    penalty: MatchLineup[];
    overtime: MatchLineup[];
  };
  goalkeepers: {
    starting: string;
    backup: string;
  };
  confirmed: boolean;
  confirmedBy: string[];
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  location: string;
  league: string;
  isHome: boolean;
  opponent: string;
  events: MatchEvent[];
  finalScore?: {
    home: number;
    away: number;
  };
  status: "upcoming" | "live" | "finished" | "cancelled";
  matchPlan?: MatchPlan;
  liveStats?: {
    shots: { home: number; away: number };
    saves: { home: number; away: number };
    penalties: { home: number; away: number };
    faceoffs: { home: number; away: number };
  };
}
