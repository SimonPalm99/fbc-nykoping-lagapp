import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { StatisticEvent, StatEventType } from "../../types/statistics";
import { useToast } from "../ui/Toast";
import ShotMap from "./ShotMap";

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
  { id: "6", name: "Lisa Persson", jerseyNumber: 11, position: "Forward", isGoalkeeper: false },
  { id: "7", name: "David Berg", jerseyNumber: 8, position: "Defense", isGoalkeeper: false },
  { id: "8", name: "Emma Johansson", jerseyNumber: 15, position: "Forward", isGoalkeeper: false },
];

const RealTimeStats: React.FC<Props> = ({ activityId, onEventAdded, readonly = false }) => {
  const { isLeader } = useAuth();
  const toast = useToast();
  
  // State
  const [events, setEvents] = useState<StatisticEvent[]>([]);
  const [shots, setShots] = useState<any[]>([]);
  const [selectedShotType, setSelectedShotType] = useState<"goal" | "save" | "shot" | "miss">("shot");
  const [selectedEventType, setSelectedEventType] = useState<StatEventType>("mål");
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [currentTime, setCurrentTime] = useState("00:00");
  const [isRecording, setIsRecording] = useState(false);
  const [onIcePlayers, setOnIcePlayers] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [gameMode, setGameMode] = useState<"5v5" | "powerplay" | "penalty">("5v5");
  const [activeTab, setActiveTab] = useState<"events" | "shotmap" | "lineup">("events");

  // Händelsetyper
  const eventTypes: { type: StatEventType; icon: string; color: string; description: string }[] = [
    { type: "mål", icon: "⚽", color: "#10b981", description: "Mål" },
    { type: "assist", icon: "🎯", color: "#3b82f6", description: "Assist" },
    { type: "skott", icon: "🏒", color: "#f59e0b", description: "Skott" },
    { type: "räddning", icon: "🥅", color: "#8b5cf6", description: "Räddning" },
    { type: "utvisning", icon: "🟨", color: "#ef4444", description: "Utvisning" },
    { type: "block", icon: "🛡️", color: "#6b7280", description: "Block" },
    { type: "tekniskt fel", icon: "⚠️", color: "#f97316", description: "Tekniskt fel" }
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

  // Hantera skott från skottkarta
  const handleShotAdded = (shotData: Omit<typeof shots[0], 'id'>) => {
    const newShot = {
      ...shotData,
      id: Date.now().toString()
    };
    
    setShots(prev => [...prev, newShot]);
    
    // Skapa även en statistikhändelse
    const newEvent: StatisticEvent = {
      id: Date.now().toString(),
      activityId,
      userId: shotData.playerId,
      type: shotData.type === "goal" ? "mål" : 
            shotData.type === "save" ? "räddning" : "skott",
      time: currentTime,
      comment: shotData.comment || "",
      onIce: onIcePlayers,
      coords: {
        x: shotData.x,
        y: shotData.y
      }
    };
    
    setEvents(prev => [...prev, newEvent]);
    onEventAdded?.(newEvent);
  };

  const addEvent = () => {
    if (!selectedPlayer || !selectedEventType) {
      toast?.error("Välj spelare och händelsetyp");
      return;
    }

    const player = mockPlayers.find(p => p.id === selectedPlayer);
    if (!player) return;

    const newEvent: StatisticEvent = {
      id: Date.now().toString(),
      activityId,
      userId: selectedPlayer,
      type: selectedEventType,
      time: currentTime,
      comment: comment.trim(),
      onIce: [...onIcePlayers]
    };

    setEvents(prev => [...prev, newEvent]);
    onEventAdded?.(newEvent);
    setComment("");

    toast?.success(`${selectedEventType} registrerat för ${player.name}`);
  };

  const removeEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const togglePlayerOnIce = (playerId: string) => {
    setOnIcePlayers(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
  };

  if (!isLeader() && readonly) {
    return (
      <div className="realtime-stats realtime-stats--readonly">
        <div className="realtime-stats__header">
          <h3>📊 Matchstatistik</h3>
          <div className="realtime-stats__time">
            {currentTime}
          </div>
        </div>
        
        <div className="realtime-stats__summary">
          <p>Endast ledare kan registrera statistik under pågående match.</p>
          <p>Statistiken visas här när matchen är slutförd.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="realtime-stats">
      <div className="realtime-stats__header">
        <h3>📊 Realtidsstatistik</h3>
        <div className="realtime-stats__controls">
          <div className="realtime-stats__time">
            {currentTime}
          </div>
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`realtime-stats__timer-btn ${isRecording ? 'realtime-stats__timer-btn--recording' : ''}`}
          >
            {isRecording ? "⏸️ Pausa" : "▶️ Starta"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="realtime-stats__tabs">
        <button
          onClick={() => setActiveTab("events")}
          className={`tab-button ${activeTab === "events" ? "tab-button--active" : ""}`}
        >
          📝 Händelser
        </button>
        <button
          onClick={() => setActiveTab("shotmap")}
          className={`tab-button ${activeTab === "shotmap" ? "tab-button--active" : ""}`}
        >
          🎯 Skottkarta
        </button>
        <button
          onClick={() => setActiveTab("lineup")}
          className={`tab-button ${activeTab === "lineup" ? "tab-button--active" : ""}`}
        >
          👥 Lineup
        </button>
      </div>

      {/* Events Tab */}
      {activeTab === "events" && (
        <div className="realtime-stats__content">
          {/* Spelläge */}
          <div className="realtime-stats__game-mode">
            <label>Spelläge:</label>
            <div className="game-mode-buttons">
              {(["5v5", "powerplay", "penalty"] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setGameMode(mode)}
                  className={`game-mode-btn ${gameMode === mode ? "game-mode-btn--active" : ""}`}
                >
                  {mode === "5v5" ? "5v5" : mode === "powerplay" ? "PP" : "BP"}
                </button>
              ))}
            </div>
          </div>

          {/* Händelseregistrering */}
          <div className="realtime-stats__event-form">
            <div className="form-group">
              <label>Händelsetyp:</label>
              <div className="event-type-grid">
                {eventTypes.map(eventType => (
                  <button
                    key={eventType.type}
                    onClick={() => setSelectedEventType(eventType.type)}
                    className={`event-type-btn ${selectedEventType === eventType.type ? `event-type-btn--active event-type-btn--${eventType.type}` : ""}`}
                    title={eventType.description}
                  >
                    <span className="event-icon">{eventType.icon}</span>
                    <span className="event-name">{eventType.type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="player-select">Spelare:</label>
              <select
                id="player-select"
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="player-select"
              >
                <option value="">Välj spelare...</option>
                {mockPlayers.map(player => (
                  <option key={player.id} value={player.id}>
                    #{player.jerseyNumber} {player.name} ({player.position})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Kommentar (valfritt):</label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="T.ex. Vacker förhand från kanten..."
                className="comment-input"
              />
            </div>

            <button
              onClick={addEvent}
              disabled={!selectedPlayer || !selectedEventType}
              className="add-event-btn"
            >
              ➕ Lägg till händelse
            </button>
          </div>

          {/* Händelselista */}
          <div className="realtime-stats__events">
            <h4>Registrerade händelser ({events.length})</h4>
            {events.length === 0 ? (
              <div className="empty-events">
                <p>Inga händelser registrerade än.</p>
              </div>
            ) : (
              <div className="events-list">
                {events.slice().reverse().map(event => {
                  const player = mockPlayers.find(p => p.id === event.userId);
                  const eventTypeData = eventTypes.find(et => et.type === event.type);
                  
                  return (
                    <div key={event.id} className="event-item">
                      <div className="event-info">
                        <div className="event-header">
                          <span className="event-time">{event.time}</span>
                          <span 
                            className={`event-type event-type--${eventTypeData?.type}`}
                          >
                            {eventTypeData?.icon} {event.type}
                          </span>
                          <span className="event-player">
                            #{player?.jerseyNumber} {player?.name}
                          </span>
                        </div>
                        {event.comment && (
                          <div className="event-comment">"{event.comment}"</div>
                        )}
                      </div>
                      <button
                        onClick={() => removeEvent(event.id)}
                        className="remove-event-btn"
                        title="Ta bort händelse"
                      >
                        ❌
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shot Map Tab */}
      {activeTab === "shotmap" && (
        <div className="realtime-stats__content">
          <div className="shotmap-controls">
            <div className="form-group">
              <label>Skotttyp:</label>
              <div className="shot-type-buttons">
                {(["goal", "shot", "save", "miss"] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedShotType(type)}
                    className={`shot-type-btn ${selectedShotType === type ? "shot-type-btn--active" : ""}`}
                  >
                    {type === "goal" ? "⭐ Mål" :
                     type === "shot" ? "● Skott" :
                     type === "save" ? "■ Räddning" : "✕ Miss"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <ShotMap
            shots={shots}
            onShotAdded={handleShotAdded}
            readonly={readonly}
            players={mockPlayers}
            selectedPlayer={selectedPlayer}
            selectedShotType={selectedShotType}
          />
        </div>
      )}

      {/* Lineup Tab */}
      {activeTab === "lineup" && (
        <div className="realtime-stats__content">
          <div className="lineup-section">
            <h4>Spelare på isen ({onIcePlayers.length})</h4>
            <div className="players-grid">
              {mockPlayers.map(player => (
                <button
                  key={player.id}
                  onClick={() => togglePlayerOnIce(player.id)}
                  className={`player-card ${onIcePlayers.includes(player.id) ? "player-card--on-ice" : ""}`}
                >
                  <div className="player-number">#{player.jerseyNumber}</div>
                  <div className="player-name">{player.name}</div>
                  <div className="player-position">{player.position}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Plus/Minus tracking */}
          <div className="plus-minus-section">
            <h4>+/- Tracking</h4>
            <p className="help-text">
              Spelare som är på isen när mål görs får +1 (egna mål) eller -1 (motståndarmål).
              Välj vilka spelare som var på isen när händelsen inträffade.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeStats;
