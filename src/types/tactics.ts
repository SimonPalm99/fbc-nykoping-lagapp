export interface DrawingElement {
  id: string;
  type: "player" | "opponent" | "ball" | "arrow" | "curve" | "line" | "circle" | "rectangle" | "text" | "zone" | "cone" | "goal";
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  color: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  team?: "home" | "away" | "neutral";
  playerNumber?: number;
  playerPosition?: string;
}

export interface DrawingAnimation {
  id: string;
  elementId: string;
  keyframes: {
    time: number; // seconds
    x: number;
    y: number;
    rotation?: number;
  }[];
  duration: number;
  loop: boolean;
}

export interface TacticDrawing {
  id: string;
  title: string;
  description: string;
  type: "formation" | "powerplay" | "penalty" | "faceoff" | "exercise" | "play";
  category: "offense" | "defense" | "special_teams" | "general";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  elements: DrawingElement[];
  animations: DrawingAnimation[];
  notes: string;
  isPrivate: boolean; // endast för ledare
  sharedWith: string[]; // player IDs som kan se denna
  tags: string[];
  difficulty: "basic" | "intermediate" | "advanced";
  versions: {
    id: string;
    date: string;
    title: string;
    elements: DrawingElement[];
    animations: DrawingAnimation[];
    notes: string;
  }[];
}

export interface TacticLibrary {
  id: string;
  name: string;
  description: string;
  tactics: string[]; // tactic IDs
  createdBy: string;
  isTeamLibrary: boolean;
}

export interface DrawingTemplate {
  id: string;
  name: string;
  description: string;
  elements: DrawingElement[];
  category: "field" | "zones" | "formations" | "symbols";
  isDefault: boolean;
}
