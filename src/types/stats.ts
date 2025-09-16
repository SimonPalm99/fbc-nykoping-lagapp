// Typ för match- och träningsstatistik

export interface MatchStat {
  id: string;
  matchId: string;
  playerId: string;
  goals: number;
  assists: number;
  shots: number;
  blocks: number;
  penalties: number;
  saves?: number;
  plusMinus: number;
  comments?: string;
  videoLink?: string;
}