export type StatEventType = "mål" | "assist" | "skott" | "räddning" | "utvisning" | "block" | "tekniskt fel";
export interface StatisticEvent {
  id: string;
  activityId: string;
  userId: string;
  type: StatEventType;
  time: string; // t.ex. "12:34"
  coords?: { x: number, y: number }; // för positionshändelser/skottkarta
  videoTimestamp?: string;
  comment?: string;
  onIce?: string[]; // vilka var inne?
}
export interface StatisticSummary {
  userId: string;
  goals: number;
  assists: number;
  gamesPlayed: number;
  penalties: number;
  blocks: number;
  shots: number;
  saves: number;
}