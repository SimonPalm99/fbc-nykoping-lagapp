
import React, { useRef, useState } from "react";
import styles from "./TacticsBoardCanvas.module.css";

interface Point {
  x: number;
  y: number;
}

interface Line {
  color: string;
  size: number;
  points: Point[];
}

interface TacticsBoardCanvasProps {
  width?: number;
  height?: number;
}

const COLORS = ["#228be6", "#fa5252", "#40c057", "#fab005", "#495057"];

const TacticsBoardCanvas: React.FC<TacticsBoardCanvasProps> = ({ width = 500, height = 320 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [currentColor, setCurrentColor] = useState(COLORS[0]);
  const [currentSize, setCurrentSize] = useState(3);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    let x = 0, y = 0;
    if ("touches" in e && e.touches.length > 0 && rect) {
      const touch = e.touches[0];
      if (touch) {
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      }
    } else if ("clientX" in e && rect) {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setDrawing(true);
    const pos = getPos(e);
    setLines(ls => {
      const newLine: Line = { 
        color: (currentColor ?? COLORS[0]) as string, 
        size: currentSize, 
        points: [pos] 
      };
      return [...ls, newLine];
    });
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    const pos = getPos(e);
    setLines(ls => {
      const newLines = [...ls];
      const lastLine = newLines[newLines.length - 1];
      if (lastLine) {
        lastLine.points.push(pos);
      }
      return newLines;
    });
  };

  const endDrawing = () => setDrawing(false);

  // Ritar om canvas varje gång lines ändras
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const line of lines) {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.size;
      ctx.beginPath();
      line.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }
  }, [lines, width, height]);

  return (
    <div className={styles.tacticsBoardRoot}>
      <div className={styles.tacticsToolbar}>
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => setCurrentColor(c)}
            className={[
              styles.tacticsColorBtn,
              c === currentColor ? styles.selected : ''
              , styles[`color${c.replace('#','')}`]
            ].join(' ')}
            aria-label={`Välj färg ${c}`}
          />
        ))}
        <input
          type="range"
          min={2}
          max={8}
          value={currentSize}
          onChange={e => setCurrentSize(Number(e.target.value))}
          className={styles.tacticsRange}
          title="Välj tjocklek på pennan"
        />
        <button
          className={styles.tacticsClearBtn}
          onClick={() => setLines([])}
        >
          Rensa
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={styles.tacticsCanvas}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
      />
    </div>
  );
};

export default TacticsBoardCanvas;