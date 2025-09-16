// Befintliga typer
export interface VideoClip {
  id: string;
  url: string;
  description?: string;
  time?: string;
}

export interface PlayerFeedback {
  playerId: string;
  rating: number;
  comment?: string;
}

export interface PostMatchReport {
  id: string;
  matchId: string;
  teamId: string;
  createdBy: string;
  createdAt: string;
  summary: string;
  highlights: string[];
  videoClips: VideoClip[];
  playerFeedback: PlayerFeedback[];
  notes?: string;
}

// Uppdaterad summeringstyp för match
export interface PostMatchSummary {
  id: string;
  matchId: string;
  summary: string;
  positives: string;
  improvements: string;
  coachNotes: string;
  createdAt: string;
}

// Feedback efter match på spelarnivå
export interface PostMatchFeedback {
  id: string;
  matchId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}