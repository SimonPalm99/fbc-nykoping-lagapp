import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../ui/Toast";

interface ShotData {
  id: string;
  x: number;
  y: number;
  type: "goal" | "shot" | "save" | "miss";
  playerId: string;
  playerName: string;
  playerNumber: number;
  time: string;
  comment?: string;
}

interface Props {
  shots: ShotData[];
  onShotAdded?: (shot: Omit<ShotData, 'id'>) => void;
  readonly?: boolean;
  players: Array<{ id: string; name: string; jerseyNumber: number }>;
  selectedPlayer?: string;
  selectedShotType?: "goal" | "shot" | "save" | "miss";
}

const ShotMap: React.FC<Props> = ({ 
  shots, 
  onShotAdded, 
  readonly = false, 
  players, 
  selectedPlayer,
  selectedShotType = "shot"
}) => {
  const { theme } = useTheme();
  const toast = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedShot, setSelectedShot] = useState<ShotData | null>(null);
  const [showShotDetails, setShowShotDetails] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });

  // Responsive canvas sizing
  useEffect(() => {
    const updateCanvasSize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setCanvasSize({ width: window.innerWidth - 40, height: 300 });
      } else {
        setCanvasSize({ width: 600, height: 400 });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    drawRink();
  }, [shots, selectedShot, canvasSize, theme]);

  const drawRink = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Clear canvas
    ctx.fillStyle = theme === 'dark' ? "#1a202c" : "#f7fafc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw rink
    drawRinkLayout(ctx, canvas.width, canvas.height);
    
    // Draw shots
    shots.forEach(shot => drawShot(ctx, shot));
    
    // Highlight selected shot
    if (selectedShot) {
      drawShotHighlight(ctx, selectedShot);
    }
  };

  const drawRinkLayout = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = theme === 'dark' ? "#4a5568" : "#2d3748";
    ctx.lineWidth = 2;

    // Outer borders
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Center line
    ctx.beginPath();
    ctx.moveTo(width / 2, 20);
    ctx.lineTo(width / 2, height - 20);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 30, 0, 2 * Math.PI);
    ctx.stroke();

    // Goal areas (left and right)
    const goalWidth = 60;
    const goalHeight = 30;
    
    // Left goal
    ctx.strokeRect(20, (height - goalHeight) / 2, goalWidth, goalHeight);
    // Right goal  
    ctx.strokeRect(width - 20 - goalWidth, (height - goalHeight) / 2, goalWidth, goalHeight);

    // Goal creases
    ctx.strokeRect(20, 20, goalWidth, height - 40);
    ctx.strokeRect(width - 20 - goalWidth, 20, goalWidth, height - 40);

    // Add zone markers
    ctx.strokeStyle = theme === 'dark' ? "#2d3748" : "#a0aec0";
    ctx.lineWidth = 1;
    
    // Defensive zones
    ctx.beginPath();
    ctx.moveTo(20 + goalWidth * 1.5, 20);
    ctx.lineTo(20 + goalWidth * 1.5, height - 20);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(width - 20 - goalWidth * 1.5, 20);
    ctx.lineTo(width - 20 - goalWidth * 1.5, height - 20);
    ctx.stroke();
  };

  const drawShot = (ctx: CanvasRenderingContext2D, shot: ShotData) => {
    const colors = {
      goal: "#10b981",
      shot: "#3b82f6", 
      save: "#8b5cf6",
      miss: "#ef4444"
    };

    const size = 8;
    ctx.fillStyle = colors[shot.type];
    ctx.strokeStyle = theme === 'dark' ? "#fff" : "#000";
    ctx.lineWidth = 2;

    ctx.beginPath();
    
    if (shot.type === "goal") {
      // Draw star for goals
      drawStar(ctx, shot.x, shot.y, size);
    } else if (shot.type === "save") {
      // Draw square for saves
      ctx.fillRect(shot.x - size/2, shot.y - size/2, size, size);
      ctx.strokeRect(shot.x - size/2, shot.y - size/2, size, size);
    } else if (shot.type === "miss") {
      // Draw X for misses
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(shot.x - size/2, shot.y - size/2);
      ctx.lineTo(shot.x + size/2, shot.y + size/2);
      ctx.moveTo(shot.x + size/2, shot.y - size/2);
      ctx.lineTo(shot.x - size/2, shot.y + size/2);
      ctx.stroke();
    } else {
      // Draw circle for shots
      ctx.arc(shot.x, shot.y, size/2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  };

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const drawShotHighlight = (ctx: CanvasRenderingContext2D, shot: ShotData) => {
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    ctx.arc(shot.x, shot.y, 15, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.setLineDash([]);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readonly) return;

    const canvas = canvasRef.current;
    if (!canvas || !selectedPlayer) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on existing shot
    const clickedShot = shots.find(shot => {
      const distance = Math.sqrt((shot.x - x) ** 2 + (shot.y - y) ** 2);
      return distance <= 12;
    });

    if (clickedShot) {
      setSelectedShot(clickedShot);
      setShowShotDetails(true);
      return;
    }

    // Add new shot
    const player = players.find(p => p.id === selectedPlayer);
    if (!player) return;

    const currentTime = new Date().toLocaleTimeString('sv-SE', { 
      minute: '2-digit', 
      second: '2-digit' 
    });

    const newShot: Omit<ShotData, 'id'> = {
      x,
      y,
      type: selectedShotType,
      playerId: player.id,
      playerName: player.name,
      playerNumber: player.jerseyNumber,
      time: currentTime
    };

    onShotAdded?.(newShot);
    
    const typeNames = {
      goal: "Mål",
      shot: "Skott", 
      save: "Räddning",
      miss: "Miss"
    };
    
    toast?.success(`${typeNames[selectedShotType]} registrerat för ${player.name}`);
  };

  const getShotStats = () => {
    const stats = {
      goals: shots.filter(s => s.type === "goal").length,
      shots: shots.length,
      saves: shots.filter(s => s.type === "save").length,
      misses: shots.filter(s => s.type === "miss").length
    };
    
    return {
      ...stats,
      shotPercentage: stats.shots > 0 ? ((stats.goals / stats.shots) * 100).toFixed(1) : "0.0"
    };
  };

  const stats = getShotStats();

  return (
    <div className="shot-map">
      <div className="shot-map__header">
        <h3 className="shot-map__title">🎯 Skottkarta</h3>
        <div className="shot-map__stats">
          <div className="stat-item">
            <span className="stat-value">{stats.goals}</span>
            <span className="stat-label">Mål</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.shots}</span>
            <span className="stat-label">Skott</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.shotPercentage}%</span>
            <span className="stat-label">Träff%</span>
          </div>
        </div>
      </div>

      <div className="shot-map__legend">
        <div className="legend-item">
          <div className="legend-icon goal">⭐</div>
          <span>Mål</span>
        </div>
        <div className="legend-item">
          <div className="legend-icon shot">●</div>
          <span>Skott</span>
        </div>
        <div className="legend-item">
          <div className="legend-icon save">■</div>
          <span>Räddning</span>
        </div>
        <div className="legend-item">
          <div className="legend-icon miss">✕</div>
          <span>Miss</span>
        </div>
      </div>

      <div className="shot-map__canvas-container">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onClick={handleCanvasClick}
          className="shot-map__canvas"
        />
        
        {!readonly && !selectedPlayer && (
          <div className="shot-map__overlay">
            <div className="overlay-message">
              <span>🏒</span>
              <p>Välj en spelare för att registrera skott</p>
            </div>
          </div>
        )}
      </div>

      {/* Shot Details Modal */}
      {showShotDetails && selectedShot && (
        <div className="shot-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Skottdetaljer</h4>
              <button 
                onClick={() => setShowShotDetails(false)}
                className="close-button"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="shot-info">
                <div className="info-row">
                  <span className="label">Spelare:</span>
                  <span>#{selectedShot.playerNumber} {selectedShot.playerName}</span>
                </div>
                <div className="info-row">
                  <span className="label">Tid:</span>
                  <span>{selectedShot.time}</span>
                </div>
                <div className="info-row">
                  <span className="label">Typ:</span>
                  <span className={`shot-type ${selectedShot.type}`}>
                    {selectedShot.type === 'goal' ? '⭐ Mål' :
                     selectedShot.type === 'shot' ? '● Skott' :
                     selectedShot.type === 'save' ? '■ Räddning' : '✕ Miss'}
                  </span>
                </div>
                {selectedShot.comment && (
                  <div className="info-row">
                    <span className="label">Kommentar:</span>
                    <span>{selectedShot.comment}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShotMap;
