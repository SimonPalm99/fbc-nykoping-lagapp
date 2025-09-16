import { useEffect } from "react";

interface Drawings {
  tool: string;
  points: { x: number; y: number }[];
  color?: string;
}

interface MarkerPath {
  markerIndex: number;
  points: { x: number; y: number }[];
}

export function useWhiteboardCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  drawings: Drawings[],
  currentLine: Drawings | null,
  color: string,
  markerPaths: MarkerPath[],
  isExerciseMode: boolean
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Rita penna och linjer
    drawings.forEach(d => {
  if (!d.points || d.points.length === 0 || !d.points[0]) return;
  ctx.strokeStyle = d.color || (d.tool === "pen" ? color : "#2E7D32");
  ctx.lineWidth = d.tool === "pen" ? 3 : 4;
  ctx.beginPath();
  ctx.moveTo(d.points[0].x, d.points[0].y);
  d.points.forEach((p: any) => ctx.lineTo(p.x, p.y));
  ctx.stroke();
    });
    // Rita aktuell linje
    if (currentLine && currentLine.points && currentLine.points.length > 0 && currentLine.points[0]) {
      ctx.strokeStyle = currentLine.color || color;
      ctx.lineWidth = currentLine.tool === "pen" ? 3 : 4;
      ctx.beginPath();
      ctx.moveTo(currentLine.points[0].x, currentLine.points[0].y);
      currentLine.points.forEach((p: any) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    }
    // Visa paths bakom markörer endast när man ritar (inte vid uppspelning)
    if (isExerciseMode && markerPaths.length) {
      markerPaths.forEach(path => {
  if (!path.points || path.points.length === 0 || !path.points[0]) return;
  ctx.strokeStyle = "#1976d2";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(path.points[0].x, path.points[0].y);
  path.points.forEach((p: any) => ctx.lineTo(p.x, p.y));
  ctx.stroke();
      });
    }
  }, [canvasRef, drawings, currentLine, color, markerPaths, isExerciseMode]);
}
