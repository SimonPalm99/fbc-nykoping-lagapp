import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { StatisticEvent, StatEventType } from "../../types/statistics";
import { useToast } from "../ui/Toast";
import styles from "./RealTimeStats.module.css";

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
  const drawRink = React.useCallback(() => {
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
  }, [events]);

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
  }, [showShotMap, drawRink]);

  if (!isLeader() && readonly) {
    return (
      <div className={styles.readonlyContainer}>
        <h3>📊 Matchstatistik</h3>
        <p className={styles.readonlyText}>Endast ledare kan registrera statistik under match.</p>
        <div className={styles.readonlyEvents}>
          <h4>Senaste händelser:</h4>
          {events.slice(-5).map(event => (
            <div key={event.id} className={styles.readonlyEventItem}>
              {event.time} - {event.type} - {mockPlayers.find(p => p.id === event.userId)?.name}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
  <h3>📊 Realtidsstatistik</h3>
  <div className={styles.headerRow}>
          <div className={styles.timer}>{currentTime}</div>
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`${styles.button} ${isRecording ? styles.buttonPause : styles.buttonStart}`}
          >
            {isRecording ? "⏸️ Pausa" : "▶️ Starta"}
          </button>
        </div>
      </div>

      {/* Spelläge */}
      <div className={styles.sectionMargin}>
        <label className={styles.label}>Spelläge:</label>
        <div className={styles.buttonGroup}>
            {["5v5", "powerplay", "penalty"].map(mode => (
              <button
                key={mode}
                onClick={() => setGameMode(mode as any)}
                className={`${styles.modeButton} ${gameMode === mode ? styles.modeActive : styles.modeInactive}`}
              >
                {mode === "5v5" ? "5v5" : mode === "powerplay" ? "Powerplay" : "Boxplay"}
              </button>
            ))}
          </div>
        </div>

        {/* Spelare på plan */}
        <div className={styles.sectionMargin}>
          <h4>🏒 Spelare på plan ({onIcePlayers.length}/6):</h4>
          <div className={styles.onIceGrid}>
            {mockPlayers.map(player => (
              <button
                key={player.id}
                onClick={() => togglePlayerOnIce(player.id)}
                className={`${styles.onIceButton} ${onIcePlayers.includes(player.id) ? styles.onIceActive : styles.onIceInactive}`}
              >
                #{player.jerseyNumber} {player.name}
              </button>
            ))}
          </div>
        </div>

        {/* Händelsetyper */}
        <div className={styles.sectionMargin}>
          <h4>📝 Registrera händelse:</h4>
          <div className={styles.eventTypeGrid}>
            {eventTypes.map(({ type, icon }) => (
              <button
                key={type}
                onClick={() => setSelectedEventType(type)}
                className={`${styles.eventTypeButton} ${selectedEventType === type ? styles.eventTypeActive : styles.eventTypeInactive} ${selectedEventType === type ? styles[`eventTypeColor_${type}`] : ''}`}
              >
                {icon} {type}
              </button>
            ))}
          </div>
        </div>

        {/* Spelarval */}
        <div className={styles.sectionMargin}>
          <label htmlFor="playerSelect" className={styles.label}>
            Välj spelare:
          </label>
          <select
            id="playerSelect"
            aria-label="Välj spelare"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className={styles.select}
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
        <div className={styles.sectionMargin}>
          <label htmlFor="commentInput" className={styles.label}>
            Kommentar (valfri):
          </label>
          <input
            id="commentInput"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="T.ex. 'Bra skott från kanten'"
            className={styles.input}
          />
        </div>

        {/* Registrera knapp */}
        <div className={styles.sectionMargin}>
          <button
            onClick={() => addEvent(selectedEventType)}
            disabled={!selectedPlayer}
            className={`${styles.registerButton} ${selectedPlayer ? styles.registerButtonActive : styles.registerButtonInactive}`}
          >
            📝 Registrera {selectedEventType}
          </button>
        </div>

        {/* Skottkarta */}
        {(selectedEventType === "skott" || selectedEventType === "mål") && (
          <div className={styles.sectionMargin}>
            <div className={styles.shotMapHeader}>
              <h4>🎯 Skottkarta</h4>
              <button
                onClick={() => setShowShotMap(!showShotMap)}
                className={styles.shotMapToggle}
              >
                {showShotMap ? "Dölj" : "Visa"}
              </button>
            </div>
            {showShotMap && (
              <div className={styles.shotMapCenter}>
                <p className={styles.shotMapText}>
                  Klicka på planen för att markera skottposition
                </p>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={200}
                  onClick={handleCanvasClick}
                  className={styles.shotMapCanvas}
                />
                <div className={styles.shotMapLegend}>
                  <div className={styles.shotMapLegendItem}>
                    <div className={styles.shotMapGoal}></div>
                    Mål
                  </div>
                  <div className={styles.shotMapLegendItem}>
                    <div className={styles.shotMapShot}></div>
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
          <div className={styles.eventLog}>
            {events.length === 0 ? (
              <p className={styles.eventLogEmpty}>
                Inga händelser registrerade än
              </p>
            ) : (
              events.slice().reverse().map(event => {
                const player = mockPlayers.find(p => p.id === event.userId);
                return (
                  <div key={event.id} className={styles.eventLogItem}>
                    <div>
                      <strong>{event.time}</strong> - {event.type} - {player?.name}
                      {event.comment && (
                        <div className={styles.eventLogComment}>
                          {event.comment}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeEvent(event.id)}
                      className={styles.eventLogRemove}
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
