import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { StatisticEvent, StatEventType } from "../../types/statistics";
import { useToast } from "../ui/Toast";

interface Props {
  activityId: string;
  onEventAdded?: (event: StatisticEvent) => void;
  readonly?: boolean;
}

interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  position: string;
  isGoalkeeper: boolean;
}

// Mock spelare - detta skulle komma från API
const mockPlayers: Player[] = [
  { id: "1", name: "Erik Svensson", jerseyNumber: 7, position: "Forward", isGoalkeeper: false },
  { id: "2", name: "Anna Karlsson", jerseyNumber: 12, position: "Defense", isGoalkeeper: false },
  { id: "3", name: "Marcus Lindberg", jerseyNumber: 1, position: "Goalkeeper", isGoalkeeper: true },
  { id: "4", name: "Sara Nyström", jerseyNumber: 23, position: "Forward", isGoalkeeper: false },
  { id: "5", name: "Johan Andersson", jerseyNumber: 4, position: "Defense", isGoalkeeper: false },
];

const RealTimeStats: React.FC<Props> = ({ activityId, onEventAdded, readonly = false }) => {
  const { isLeader } = useAuth();
  const toast = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State
  const [events, setEvents] = useState<StatisticEvent[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<StatEventType>("mål");
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [currentTime, setCurrentTime] = useState("00:00");
  const [isRecording, setIsRecording] = useState(false);
  const [showShotMap, setShowShotMap] = useState(false);
  const [onIcePlayers, setOnIcePlayers] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [gameMode, setGameMode] = useState<"5v5" | "powerplay" | "penalty">("5v5");
  const [_shots, _setShots] = useState<Array<{
    id: string;
    x: number;
    y: number;
    type: "goal" | "shot" | "save" | "miss";
    playerId: string;
    playerName: string;
    playerNumber: number;
    time: string;
    comment?: string;
  }>>([]);

  // Händelsetyper
  const eventTypes: { type: StatEventType; icon: string; color: string }[] = [
    { type: "mål", icon: "⚽", color: "#10b981" },
    { type: "assist", icon: "🎯", color: "#3b82f6" },
    { type: "skott", icon: "🏒", color: "#f59e0b" },
    { type: "räddning", icon: "🥅", color: "#8b5cf6" },
    { type: "utvisning", icon: "🟨", color: "#ef4444" },
    { type: "block", icon: "🛡️", color: "#6b7280" },
    { type: "tekniskt fel", icon: "⚠️", color: "#f97316" }
  ];

  // Timer för matchtid
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const [minutes, seconds] = prev.split(":").map(Number);
          const totalSeconds = (minutes || 0) * 60 + (seconds || 0) + 1;
          const newMinutes = Math.floor(totalSeconds / 60);
          const newSeconds = totalSeconds % 60;
          return `${newMinutes.toString().padStart(2, "0")}:${newSeconds.toString().padStart(2, "0")}`;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Rita planen för skottkarta
  const drawRink = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Rensa canvas
    ctx.fillStyle = "#2d5a27";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Rita plan
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;

    // Yttre gränser
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Mittlinje
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 10);
    ctx.lineTo(canvas.width / 2, canvas.height - 10);
    ctx.stroke();

    // Mittcirkel
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, 2 * Math.PI);
    ctx.stroke();

    // Målområden
    const goalWidth = 60;
    const goalHeight = 30;
    
    // Vänster mål
    ctx.strokeRect(10, (canvas.height - goalHeight) / 2, goalWidth, goalHeight);
    
    // Höger mål
    ctx.strokeRect(canvas.width - 10 - goalWidth, (canvas.height - goalHeight) / 2, goalWidth, goalHeight);

    // Rita befintliga skott
    events.filter(e => e.type === "skott" || e.type === "mål").forEach(event => {
      if (event.coords) {
        ctx.fillStyle = event.type === "mål" ? "#10b981" : "#ef4444";
        ctx.beginPath();
        ctx.arc(event.coords.x, event.coords.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  // Hantera klick på planen
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readonly || !isLeader() || (selectedEventType !== "skott" && selectedEventType !== "mål")) return;

    const canvas = canvasRef.current;
    if (!canvas || !selectedPlayer) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addEvent(selectedEventType, { x, y });
  };

  // Lägg till händelse
  const addEvent = (type: StatEventType, coords?: { x: number; y: number }) => {
    if (!selectedPlayer) {
      toast?.error("Välj en spelare först");
      return;
    }

    const newEvent: StatisticEvent = {
      id: Date.now().toString(),
      activityId,
      userId: selectedPlayer,
      type,
      time: currentTime,
      ...(coords && { coords }),
      onIce: [...onIcePlayers],
      ...(comment.trim() && { comment: comment.trim() })
    };

    setEvents(prev => [...prev, newEvent]);
    onEventAdded?.(newEvent);
    setComment("");
    
    toast?.success(`${type} registrerat för ${mockPlayers.find(p => p.id === selectedPlayer)?.name}`);
  };

  // Ta bort händelse
  const removeEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  // Växla spelare på plan
  const togglePlayerOnIce = (playerId: string) => {
    setOnIcePlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  useEffect(() => {
    if (showShotMap) {
      drawRink();
    }
  }, [showShotMap, events]);

  if (!isLeader() && readonly) {
    return (
      <div style={{ 
        background: "#1a202c", 
        padding: "20px", 
        borderRadius: "12px",
        textAlign: "center",
        color: "#a0aec0"
      }}>
        <h3>📊 Matchstatistik</h3>
        <p>Endast ledare kan registrera statistik under match.</p>
        <div style={{ marginTop: "20px" }}>
          <h4>Senaste händelser:</h4>
          {events.slice(-5).map(event => (
            <div key={event.id} style={{ 
              background: "#2d3748", 
              padding: "8px", 
              margin: "4px 0", 
              borderRadius: "6px" 
            }}>
              {event.time} - {event.type} - {mockPlayers.find(p => p.id === event.userId)?.name}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: "#1a202c", 
      padding: "20px", 
      borderRadius: "12px",
      color: "#fff"
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h3>📊 Realtidsstatistik</h3>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ 
            fontSize: "24px", 
            fontWeight: "bold",
            background: "#2d3748",
            padding: "8px 16px",
            borderRadius: "8px"
          }}>
            {currentTime}
          </div>
          <button
            onClick={() => setIsRecording(!isRecording)}
            style={{
              padding: "8px 16px",
              background: isRecording ? "#ef4444" : "#10b981",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            {isRecording ? "⏸️ Pausa" : "▶️ Starta"}
          </button>
        </div>
      </div>

      {/* Spelläge */}
      <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Spelläge:
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            {["5v5", "powerplay", "penalty"].map(mode => (
              <button
                key={mode}
                onClick={() => setGameMode(mode as any)}
                style={{
                  padding: "6px 12px",
                  background: gameMode === mode ? "#3b82f6" : "#4a5568",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                {mode === "5v5" ? "5v5" : mode === "powerplay" ? "Powerplay" : "Boxplay"}
              </button>
            ))}
          </div>
        </div>

        {/* Spelare på plan */}
        <div style={{ marginBottom: "20px" }}>
          <h4>🏒 Spelare på plan ({onIcePlayers.length}/6):</h4>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "8px",
            marginTop: "8px"
          }}>
            {mockPlayers.map(player => (
              <button
                key={player.id}
                onClick={() => togglePlayerOnIce(player.id)}
                style={{
                  padding: "8px",
                  background: onIcePlayers.includes(player.id) ? "#10b981" : "#4a5568",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                #{player.jerseyNumber} {player.name}
              </button>
            ))}
          </div>
        </div>

        {/* Händelsetyper */}
        <div style={{ marginBottom: "20px" }}>
          <h4>📝 Registrera händelse:</h4>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "8px",
            marginTop: "8px"
          }}>
            {eventTypes.map(({ type, icon, color }) => (
              <button
                key={type}
                onClick={() => setSelectedEventType(type)}
                style={{
                  padding: "12px 8px",
                  background: selectedEventType === type ? color : "#4a5568",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "600"
                }}
              >
                {icon} {type}
              </button>
            ))}
          </div>
        </div>

        {/* Spelarval */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Välj spelare:
          </label>
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              background: "#2d3748",
              border: "1px solid #4a5568",
              borderRadius: "6px",
              color: "#fff"
            }}
          >
            <option value="">-- Välj spelare --</option>
            {mockPlayers.map(player => (
              <option key={player.id} value={player.id}>
                #{player.jerseyNumber} {player.name} ({player.position})
              </option>
            ))}
          </select>
        </div>

        {/* Kommentar */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Kommentar (valfri):
          </label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="T.ex. 'Bra skott från kanten'"
            style={{
              width: "100%",
              padding: "8px 12px",
              background: "#2d3748",
              border: "1px solid #4a5568",
              borderRadius: "6px",
              color: "#fff"
            }}
          />
        </div>

        {/* Registrera knapp */}
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => addEvent(selectedEventType)}
            disabled={!selectedPlayer}
            style={{
              width: "100%",
              padding: "12px",
              background: !selectedPlayer ? "#4a5568" : "#3b82f6",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              cursor: !selectedPlayer ? "not-allowed" : "pointer",
              fontWeight: "600",
              fontSize: "16px"
            }}
          >
            📝 Registrera {selectedEventType}
          </button>
        </div>

        {/* Skottkarta */}
        {(selectedEventType === "skott" || selectedEventType === "mål") && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "10px"
            }}>
              <h4>🎯 Skottkarta</h4>
              <button
                onClick={() => setShowShotMap(!showShotMap)}
                style={{
                  padding: "6px 12px",
                  background: "#6b7280",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                {showShotMap ? "Dölj" : "Visa"}
              </button>
            </div>
            
            {showShotMap && (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "12px", color: "#a0aec0", marginBottom: "8px" }}>
                  Klicka på planen för att markera skottposition
                </p>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={200}
                  onClick={handleCanvasClick}
                  style={{
                    border: "2px solid #4a5568",
                    borderRadius: "8px",
                    cursor: "crosshair",
                    maxWidth: "100%"
                  }}
                />
                <div style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  gap: "16px",
                  marginTop: "8px",
                  fontSize: "12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <div style={{ 
                      width: "8px", 
                      height: "8px", 
                      background: "#10b981", 
                      borderRadius: "50%" 
                    }}></div>
                    Mål
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <div style={{ 
                      width: "8px", 
                      height: "8px", 
                      background: "#ef4444", 
                      borderRadius: "50%" 
                    }}></div>
                    Skott
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Händelselogg */}
        <div>
          <h4>📋 Händelselogg ({events.length}):</h4>
          <div style={{ 
            maxHeight: "300px", 
            overflowY: "auto",
            background: "#2d3748",
            borderRadius: "8px",
            padding: "10px"
          }}>
            {events.length === 0 ? (
              <p style={{ color: "#a0aec0", textAlign: "center" }}>
                Inga händelser registrerade än
              </p>
            ) : (
              events.slice().reverse().map(event => {
                const player = mockPlayers.find(p => p.id === event.userId);
                return (
                  <div
                    key={event.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px",
                      margin: "4px 0",
                      background: "#1a202c",
                      borderRadius: "6px",
                      fontSize: "14px"
                    }}
                  >
                    <div>
                      <strong>{event.time}</strong> - {event.type} - {player?.name}
                      {event.comment && (
                        <div style={{ fontSize: "12px", color: "#a0aec0" }}>
                          {event.comment}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeEvent(event.id)}
                      style={{
                        background: "#ef4444",
                        border: "none",
                        borderRadius: "4px",
                        color: "#fff",
                        cursor: "pointer",
                        padding: "4px 8px",
                        fontSize: "12px"
                      }}
                    >
                      ❌
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
    </div>
  );
};

export default RealTimeStats;
