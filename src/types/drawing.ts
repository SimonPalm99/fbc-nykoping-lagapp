export type DrawingElementType = "pen" | "line" | "rect" | "circle" | "text" | "erase";

export interface DrawingElement {
  id: string;
  type: DrawingElementType;
  color: string;
  thickness: number;
  points: { x: number; y: number }[]; // For pen/line
  text?: string; // For text
  rect?: { x: number; y: number; w: number; h: number }; // For rect/circle
}

export interface TacticsBoard {
  id: string;
  title: string;
  createdBy: string;
  createdAt: string;
  elements: DrawingElement[];
  sharedWith?: string[]; // userIds
}