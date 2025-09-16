export interface MatchAnalysis {
  id: string;
  matchId: string;
  matchTitle: string;
  date: string;
  author: string;
  period1: string;
  period2: string;
  period3: string;
  summary: string;
  rating: number;
  tactics?: string;
  comments?: string;
  files: { url: string; name: string; type: 'image' | 'video' | 'document'; }[];
  livestats?: any;
  createdAt: string;
  updatedAt?: string;
}
