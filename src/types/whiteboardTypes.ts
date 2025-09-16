export interface Marker {
  type: "player" | "opponent" | "ball";
  x: number;
  y: number;
}

export interface Line {
  tool: "pen" | "line";
  points: { x: number; y: number }[];
  color: string;
}

export interface TextBox {
  x: number;
  y: number;
  text: string;
}

export interface ExerciseStep {
  markers: Marker[];
  lines: Line[];
  comment?: string;
}
