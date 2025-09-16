export interface LineupPlayer {
  userId: string;
  position: "Målvakt" | "Back" | "Center" | "Forward" | "Avbytare";
  line: number; // 1,2,3...
}

export interface TacticsNote {
  id: string;
  title: string;
  description: string;
  checkedBy?: string[];
}

export interface MatchPlan {
  id: string;
  activityId: string;
  opponent: string;
  createdBy: string;
  createdAt: string;
  lineup: LineupPlayer[];
  tactics: TacticsNote[];
  coachNotes: string;
}