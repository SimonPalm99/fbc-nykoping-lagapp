import React, { useState } from "react";
import { useToast } from "../ui/Toast";
import FormationBuilder from "./FormationBuilder";

interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  position: "Forward" | "Defense" | "Goalkeeper";
  available: boolean;
  injured?: boolean;
  suspended?: boolean;
}

interface Formation {
  id: string;
  name: string;
  type: "5v5" | "powerplay" | "penalty" | "faceoff";
  players: Array<{
    playerId: string;
    x: number;
    y: number;
    position: "Forward" | "Defense" | "Goalkeeper";
    line: number;
  }>;
  description: string;
  isDefault: boolean;
}

interface TacticNote {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "offense" | "defense" | "special_teams" | "general";
  assignedTo?: string[];
  acknowledged?: string[];
}

interface MatchPlan {
  id: string;
  matchTitle: string;
  opponent: string;
  date: string;
  venue: string;
  formations: Formation[];
  tactics: TacticNote[];
  coachNotes: string;
  playerInstructions: Record<string, string>;
  specialPlays: string[];
  keys: string[];
  published: boolean;
  confirmedBy: string[];
}

interface Props {
  matchId?: string;
  existingPlan?: MatchPlan;
  initialMatchTitle?: string;
  initialOpponent?: string;
  initialDate?: string;
  initialVenue?: string;
  onSave: (plan: MatchPlan) => void;
  onCancel: () => void;
}

const MatchPlanCreator: React.FC<Props> = ({ 
  matchId, 
  existingPlan, 
  initialMatchTitle,
  initialOpponent,
  initialDate,
  initialVenue,
  onSave, 
  onCancel 
}) => {
  const toast = useToast();

  // State
  const [currentTab, setCurrentTab] = useState<"info" | "formations" | "tactics" | "players" | "preview">("info");
  const [matchTitle, setMatchTitle] = useState(existingPlan?.matchTitle || initialMatchTitle || "");
  const [opponent, setOpponent] = useState(existingPlan?.opponent || initialOpponent || "");
  const [date, setDate] = useState(existingPlan?.date || initialDate || "");
  const [venue, setVenue] = useState(existingPlan?.venue || initialVenue || "");
  const [formations, setFormations] = useState<Formation[]>(existingPlan?.formations || []);
  const [tactics, setTactics] = useState<TacticNote[]>(existingPlan?.tactics || []);
  const [coachNotes, setCoachNotes] = useState(existingPlan?.coachNotes || "");
  const [playerInstructions, setPlayerInstructions] = useState<Record<string, string>>(existingPlan?.playerInstructions || {});
  const [specialPlays, setSpecialPlays] = useState<string[]>(existingPlan?.specialPlays || []);
  const [keys, setKeys] = useState<string[]>(existingPlan?.keys || []);
  const [showFormationBuilder, setShowFormationBuilder] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | undefined>();

  // Mock spelare data
  const [players] = useState<Player[]>([
    { id: "1", name: "Erik Svensson", jerseyNumber: 7, position: "Forward", available: true },
    { id: "2", name: "Anna Karlsson", jerseyNumber: 12, position: "Defense", available: true },
    { id: "3", name: "Marcus Lindberg", jerseyNumber: 1, position: "Goalkeeper", available: true },
    { id: "4", name: "Sara Nyström", jerseyNumber: 23, position: "Forward", available: true },
    { id: "5", name: "Johan Andersson", jerseyNumber: 4, position: "Defense", available: true },
    { id: "6", name: "Lisa Johansson", jerseyNumber: 21, position: "Forward", available: true },
    { id: "7", name: "Mikael Berg", jerseyNumber: 30, position: "Goalkeeper", available: false, injured: true },
    { id: "8", name: "Sofia Lindström", jerseyNumber: 8, position: "Defense", available: true },
    { id: "9", name: "Daniel Karlsson", jerseyNumber: 15, position: "Forward", available: true },
    { id: "10", name: "Emma Svensson", jerseyNumber: 11, position: "Forward", available: false, suspended: true },
  ]);

  const handleSaveFormation = (formation: Formation) => {
    if (editingFormation) {
      setFormations(prev => prev.map(f => f.id === formation.id ? formation : f));
      toast?.success("Formation uppdaterad");
    } else {
      setFormations(prev => [...prev, formation]);
      toast?.success("Formation tillagd");
    }
    setShowFormationBuilder(false);
    setEditingFormation(undefined);
  };

  const handleDeleteFormation = (formationId: string) => {
    if (window.confirm("Är du säker på att du vill ta bort denna formation?")) {
      setFormations(prev => prev.filter(f => f.id !== formationId));
      toast?.success("Formation borttagen");
    }
  };

  const handleAddTactic = () => {
    const newTactic: TacticNote = {
      id: Date.now().toString(),
      title: "",
      description: "",
      priority: "medium",
      category: "general",
      assignedTo: [],
      acknowledged: []
    };
    setTactics(prev => [...prev, newTactic]);
  };

  const handleUpdateTactic = (id: string, updates: Partial<TacticNote>) => {
    setTactics(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleDeleteTactic = (id: string) => {
    setTactics(prev => prev.filter(t => t.id !== id));
  };

  const handleAddSpecialPlay = () => {
    const play = prompt("Beskriv specialspelet:");
    if (play?.trim()) {
      setSpecialPlays(prev => [...prev, play.trim()]);
    }
  };

  const handleAddKey = () => {
    const key = prompt("Lägg till en nyckel till segern:");
    if (key?.trim()) {
      setKeys(prev => [...prev, key.trim()]);
    }
  };

  const handleSave = () => {
    if (!matchTitle.trim() || !opponent.trim() || !date || !venue.trim()) {
      toast?.error("Fyll i alla obligatoriska fält");
      return;
    }

    if (formations.length === 0) {
      toast?.error("Lägg till minst en formation");
      return;
    }

    const matchPlan: MatchPlan = {
      id: existingPlan?.id || Date.now().toString(),
      matchTitle: matchTitle.trim(),
      opponent: opponent.trim(),
      date,
      venue: venue.trim(),
      formations,
      tactics,
      coachNotes: coachNotes.trim(),
      playerInstructions,
      specialPlays,
      keys,
      published: false,
      confirmedBy: []
    };

    onSave(matchPlan);
  };

  const tabs = [
    { id: "info", name: "Matchinfo", icon: "ℹ️" },
    { id: "formations", name: "Formationer", icon: "🏒" },
    { id: "tactics", name: "Taktik", icon: "📋" },
    { id: "players", name: "Spelare", icon: "👥" },
    { id: "preview", name: "Förhandsvisning", icon: "👁️" }
  ];

  return (
    <div style={{ 
      background: "#1a202c", 
      padding: "20px", 
      borderRadius: "12px",
      color: "#fff"
    }}>
      {showFormationBuilder ? (
        <FormationBuilder
          players={players}
          {...(editingFormation && { formation: editingFormation })}
          onSave={handleSaveFormation}
          onCancel={() => {
            setShowFormationBuilder(false);
            setEditingFormation(undefined);
          }}
        />
      ) : (
        <>
          {/* Header */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <h2 style={{ margin: 0 }}>
              {existingPlan ? "📝 Redigera matchplan" : "📝 Skapa ny matchplan"}
            </h2>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={onCancel}
                style={{
                  padding: "8px 16px",
                  background: "#6b7280",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                Avbryt
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: "8px 16px",
                  background: "#10b981",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                💾 Spara plan
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ 
            display: "flex", 
            gap: "8px", 
            marginBottom: "20px",
            borderBottom: "1px solid #4a5568",
            paddingBottom: "10px"
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                style={{
                  padding: "8px 16px",
                  background: currentTab === tab.id ? "#3b82f6" : "#4a5568",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: currentTab === tab.id ? "600" : "normal"
                }}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>

          {/* Matchinfo */}
          {currentTab === "info" && (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "20px"
            }}>
              <div>
                <h3>📋 Grundinfo</h3>
                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>
                      Matchnamn *
                    </label>
                    <input
                      type="text"
                      value={matchTitle}
                      onChange={(e) => setMatchTitle(e.target.value)}
                      placeholder="FBC Nyköping vs Motståndare"
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

                  <div>
                    <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>
                      Motståndare *
                    </label>
                    <input
                      type="text"
                      value={opponent}
                      onChange={(e) => setOpponent(e.target.value)}
                      placeholder="Västerås IBK"
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

                  <div>
                    <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>
                      Datum & tid *
                    </label>
                    <input
                      type="datetime-local"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
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

                  <div>
                    <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>
                      Arena *
                    </label>
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="Nyköpings Sporthall"
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
                </div>
              </div>

              <div>
                <h3>📝 Tränaranteckningar</h3>
                <textarea
                  value={coachNotes}
                  onChange={(e) => setCoachNotes(e.target.value)}
                  placeholder="Allmänna anteckningar och instruktioner för matchen..."
                  rows={8}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#2d3748",
                    border: "1px solid #4a5568",
                    borderRadius: "6px",
                    color: "#fff",
                    resize: "vertical"
                  }}
                />

                <div style={{ marginTop: "16px" }}>
                  <h4>🔑 Nycklar till seger</h4>
                  {keys.map((key, index) => (
                    <div 
                      key={index}
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "8px",
                        margin: "4px 0" 
                      }}
                    >
                      <span style={{ fontSize: "12px" }}>•</span>
                      <span style={{ flex: 1, fontSize: "14px" }}>{key}</span>
                      <button
                        onClick={() => setKeys(prev => prev.filter((_, i) => i !== index))}
                        style={{
                          background: "#ef4444",
                          border: "none",
                          borderRadius: "4px",
                          color: "#fff",
                          cursor: "pointer",
                          padding: "2px 6px",
                          fontSize: "12px"
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddKey}
                    style={{
                      padding: "4px 8px",
                      background: "#3b82f6",
                      border: "none",
                      borderRadius: "4px",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "12px",
                      marginTop: "8px"
                    }}
                  >
                    ➕ Lägg till nyckel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Formationer */}
          {currentTab === "formations" && (
            <div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "20px"
              }}>
                <h3 style={{ margin: 0 }}>🏒 Formationer ({formations.length})</h3>
                <button
                  onClick={() => setShowFormationBuilder(true)}
                  style={{
                    padding: "8px 16px",
                    background: "#10b981",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  ➕ Ny formation
                </button>
              </div>

              {formations.length === 0 ? (
                <div style={{ 
                  textAlign: "center", 
                  padding: "40px",
                  background: "#2d3748",
                  borderRadius: "8px",
                  color: "#a0aec0"
                }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏒</div>
                  <h3>Inga formationer skapade än</h3>
                  <p>Skapa din första formation för att komma igång</p>
                </div>
              ) : (
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "16px"
                }}>
                  {formations.map(formation => (
                    <div
                      key={formation.id}
                      style={{
                        background: "#2d3748",
                        padding: "16px",
                        borderRadius: "8px",
                        border: formation.isDefault ? "2px solid #10b981" : "1px solid #4a5568"
                      }}
                    >
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "12px"
                      }}>
                        <div>
                          <h4 style={{ margin: "0 0 4px 0" }}>
                            {formation.name}
                            {formation.isDefault && <span style={{ color: "#10b981" }}> ⭐</span>}
                          </h4>
                          <div style={{ 
                            display: "inline-block",
                            padding: "2px 8px",
                            background: "#4a5568",
                            borderRadius: "4px",
                            fontSize: "12px"
                          }}>
                            {formation.type === "5v5" ? "5v5" :
                             formation.type === "powerplay" ? "Powerplay" :
                             formation.type === "penalty" ? "Boxplay" : "Faceoff"}
                          </div>
                        </div>
                        
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button
                            onClick={() => {
                              setEditingFormation(formation);
                              setShowFormationBuilder(true);
                            }}
                            style={{
                              background: "#3b82f6",
                              border: "none",
                              borderRadius: "4px",
                              color: "#fff",
                              cursor: "pointer",
                              padding: "4px 8px",
                              fontSize: "12px"
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteFormation(formation.id)}
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
                            🗑️
                          </button>
                        </div>
                      </div>

                      <div style={{ fontSize: "14px", color: "#a0aec0", marginBottom: "8px" }}>
                        {formation.players.length} spelare
                      </div>

                      {formation.description && (
                        <p style={{ 
                          fontSize: "12px", 
                          color: "#e2e8f0", 
                          margin: "8px 0",
                          fontStyle: "italic"
                        }}>
                          "{formation.description}"
                        </p>
                      )}

                      <div style={{ fontSize: "12px" }}>
                        {Object.entries(
                          formation.players.reduce((acc, p) => {
                            acc[p.line] = (acc[p.line] || 0) + 1;
                            return acc;
                          }, {} as Record<number, number>)
                        ).map(([line, count]) => (
                          <span key={line} style={{ marginRight: "8px" }}>
                            L{line}: {count}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Taktik */}
          {currentTab === "tactics" && (
            <div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "20px"
              }}>
                <h3 style={{ margin: 0 }}>📋 Taktiska instruktioner ({tactics.length})</h3>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => {
                      // Öppna ritverktyget i ny flik
                      window.open('/tactics', '_blank');
                      toast?.info('Ritverktyget öppnas i ny flik');
                    }}
                    style={{
                      padding: "8px 16px",
                      background: "#7c3aed",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    🎨 Ritverktyg
                  </button>
                  <button
                    onClick={handleAddTactic}
                    style={{
                      padding: "8px 16px",
                      background: "#10b981",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    ➕ Ny instruktion
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gap: "16px" }}>
                {tactics.map(tactic => (
                  <div
                    key={tactic.id}
                    style={{
                      background: "#2d3748",
                      padding: "16px",
                      borderRadius: "8px",
                      border: `1px solid ${
                        tactic.priority === "high" ? "#ef4444" :
                        tactic.priority === "medium" ? "#f59e0b" : "#6b7280"
                      }`
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "16px" }}>
                      <div>
                        <input
                          type="text"
                          value={tactic.title}
                          onChange={(e) => handleUpdateTactic(tactic.id, { title: e.target.value })}
                          placeholder="Titel på instruktionen..."
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            background: "#1a202c",
                            border: "1px solid #4a5568",
                            borderRadius: "6px",
                            color: "#fff",
                            fontWeight: "600",
                            marginBottom: "8px"
                          }}
                        />
                        
                        <textarea
                          value={tactic.description}
                          onChange={(e) => handleUpdateTactic(tactic.id, { description: e.target.value })}
                          placeholder="Detaljerad beskrivning av instruktionen..."
                          rows={3}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            background: "#1a202c",
                            border: "1px solid #4a5568",
                            borderRadius: "6px",
                            color: "#fff",
                            resize: "vertical"
                          }}
                        />

                        <div style={{ 
                          display: "flex", 
                          gap: "12px", 
                          marginTop: "8px",
                          alignItems: "center"
                        }}>
                          <select
                            value={tactic.priority}
                            onChange={(e) => handleUpdateTactic(tactic.id, { priority: e.target.value as any })}
                            style={{
                              padding: "4px 8px",
                              background: "#1a202c",
                              border: "1px solid #4a5568",
                              borderRadius: "4px",
                              color: "#fff",
                              fontSize: "12px"
                            }}
                          >
                            <option value="low">Låg prioritet</option>
                            <option value="medium">Medel prioritet</option>
                            <option value="high">Hög prioritet</option>
                          </select>

                          <select
                            value={tactic.category}
                            onChange={(e) => handleUpdateTactic(tactic.id, { category: e.target.value as any })}
                            style={{
                              padding: "4px 8px",
                              background: "#1a202c",
                              border: "1px solid #4a5568",
                              borderRadius: "4px",
                              color: "#fff",
                              fontSize: "12px"
                            }}
                          >
                            <option value="general">Allmänt</option>
                            <option value="offense">Anfall</option>
                            <option value="defense">Försvar</option>
                            <option value="special_teams">Specialteams</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteTactic(tactic.id)}
                        style={{
                          background: "#ef4444",
                          border: "none",
                          borderRadius: "6px",
                          color: "#fff",
                          cursor: "pointer",
                          padding: "8px 12px",
                          height: "fit-content"
                        }}
                      >
                        🗑️ Ta bort
                      </button>
                    </div>
                  </div>
                ))}

                {tactics.length === 0 && (
                  <div style={{ 
                    textAlign: "center", 
                    padding: "40px",
                    background: "#2d3748",
                    borderRadius: "8px",
                    color: "#a0aec0"
                  }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
                    <h3>Inga taktiska instruktioner ännu</h3>
                    <p>Lägg till instruktioner för att ge laget riktlinjer</p>
                  </div>
                )}
              </div>

              {/* Specialspel */}
              <div style={{ marginTop: "32px" }}>
                <h4>⚡ Specialspel</h4>
                {specialPlays.map((play, index) => (
                  <div 
                    key={index}
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "8px",
                      margin: "8px 0",
                      padding: "8px",
                      background: "#2d3748",
                      borderRadius: "6px"
                    }}
                  >
                    <span style={{ flex: 1 }}>{play}</span>
                    <button
                      onClick={() => setSpecialPlays(prev => prev.filter((_, i) => i !== index))}
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
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddSpecialPlay}
                  style={{
                    padding: "6px 12px",
                    background: "#3b82f6",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  ➕ Lägg till specialspel
                </button>
              </div>
            </div>
          )}

          {/* Spelare */}
          {currentTab === "players" && (
            <div>
              <h3>👥 Spelare & individuella instruktioner</h3>
              
              {/* Spelarkort */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "16px"
              }}>
                {players.map(player => (
                  <div
                    key={player.id}
                    style={{
                      background: "#2d3748",
                      padding: "16px",
                      borderRadius: "8px",
                      border: !player.available ? "1px solid #ef4444" : "1px solid #4a5568"
                    }}
                  >
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px"
                    }}>
                      <div>
                        <h4 style={{ margin: "0 0 4px 0" }}>
                          #{player.jerseyNumber} {player.name}
                        </h4>
                        <div style={{ 
                          display: "inline-block",
                          padding: "2px 8px",
                          background: "#4a5568",
                          borderRadius: "4px",
                          fontSize: "12px"
                        }}>
                          {player.position}
                        </div>
                      </div>
                      
                      <div>
                        {!player.available && (
                          <span style={{ 
                            padding: "2px 6px",
                            background: "#ef4444",
                            borderRadius: "4px",
                            fontSize: "10px"
                          }}>
                            {player.injured ? "Skadad" : player.suspended ? "Avstängd" : "Ej tillgänglig"}
                          </span>
                        )}
                      </div>
                    </div>

                    <textarea
                      value={playerInstructions[player.id] || ""}
                      onChange={(e) => setPlayerInstructions(prev => ({
                        ...prev,
                        [player.id]: e.target.value
                      }))}
                      placeholder="Individuella instruktioner för denna spelare..."
                      rows={3}
                      disabled={!player.available}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        background: player.available ? "#1a202c" : "#374151",
                        border: "1px solid #4a5568",
                        borderRadius: "6px",
                        color: player.available ? "#fff" : "#9ca3af",
                        resize: "vertical"
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Förhandsvisning */}
          {currentTab === "preview" && (
            <div>
              <h3>👁️ Förhandsvisning av matchplan</h3>
              
              <div style={{ 
                background: "#2d3748", 
                padding: "20px", 
                borderRadius: "8px",
                border: "2px dashed #4a5568"
              }}>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <h1 style={{ 
                    margin: "0 0 8px 0",
                    fontSize: "24px",
                    color: "#10b981"
                  }}>
                    {matchTitle || "Matchplan"}
                  </h1>
                  <div style={{ fontSize: "16px", color: "#a0aec0" }}>
                    vs {opponent || "Motståndare"} • {date ? new Date(date).toLocaleDateString("sv-SE") : "Datum"} • {venue || "Arena"}
                  </div>
                </div>

                {/* Sammanfattning */}
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "16px",
                  marginBottom: "24px"
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "32px", fontWeight: "bold", color: "#3b82f6" }}>
                      {formations.length}
                    </div>
                    <div style={{ fontSize: "14px", color: "#a0aec0" }}>Formationer</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "32px", fontWeight: "bold", color: "#f59e0b" }}>
                      {tactics.length}
                    </div>
                    <div style={{ fontSize: "14px", color: "#a0aec0" }}>Taktiska instruktioner</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "32px", fontWeight: "bold", color: "#10b981" }}>
                      {players.filter(p => p.available).length}
                    </div>
                    <div style={{ fontSize: "14px", color: "#a0aec0" }}>Tillgängliga spelare</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "32px", fontWeight: "bold", color: "#8b5cf6" }}>
                      {keys.length}
                    </div>
                    <div style={{ fontSize: "14px", color: "#a0aec0" }}>Nycklar till seger</div>
                  </div>
                </div>

                {/* Status */}
                <div style={{ 
                  background: "#1a202c", 
                  padding: "16px", 
                  borderRadius: "8px",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "18px", marginBottom: "8px" }}>
                    {!matchTitle || !opponent || !date || !venue ? (
                      <span style={{ color: "#ef4444" }}>⚠️ Ofullständig - Fyll i alla obligatoriska fält</span>
                    ) : formations.length === 0 ? (
                      <span style={{ color: "#f59e0b" }}>⚠️ Nästan klar - Lägg till minst en formation</span>
                    ) : (
                      <span style={{ color: "#10b981" }}>✅ Redo att spara!</span>
                    )}
                  </div>
                  <p style={{ color: "#a0aec0", margin: "0 0 16px 0", fontSize: "14px" }}>
                    Denna matchplan kommer att sparas och kan delas med laget
                  </p>
                  
                  {/* Export och dela-knappar */}
                  {matchTitle && opponent && date && venue && formations.length > 0 && (
                    <div style={{ 
                      display: "flex", 
                      gap: "12px", 
                      justifyContent: "center",
                      flexWrap: "wrap"
                    }}>
                      <button
                        onClick={() => {
                          // Exportera som PDF eller text
                          const planContent = `
MATCHPLAN - ${matchTitle}
======================
Motståndare: ${opponent}
Datum: ${new Date(date).toLocaleDateString("sv-SE")}
Arena: ${venue}

FORMATIONER (${formations.length}):
${formations.map(f => `- ${f.name} (${f.type}): ${f.description}`).join('\n')}

TAKTISKA INSTRUKTIONER (${tactics.length}):
${tactics.map(t => `- ${t.title} (${t.priority}): ${t.description}`).join('\n')}

TRÄNARANTECKNINGAR:
${coachNotes}

NYCKLAR TILL SEGER:
${keys.map(k => `- ${k}`).join('\n')}
                          `;
                          
                          const blob = new Blob([planContent], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `Matchplan_${matchTitle.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast?.success('Matchplan exporterad!');
                        }}
                        style={{
                          padding: "8px 16px",
                          background: "#3b82f6",
                          border: "none",
                          borderRadius: "6px",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "600"
                        }}
                      >
                        📄 Exportera
                      </button>
                      
                      <button
                        onClick={() => {
                          // Kopiera delbar länk
                          const shareUrl = `${window.location.origin}/matchplan?id=${matchId}&share=true`;
                          navigator.clipboard.writeText(shareUrl).then(() => {
                            toast?.success('Delbar länk kopierad!');
                          }).catch(() => {
                            toast?.error('Kunde inte kopiera länk');
                          });
                        }}
                        style={{
                          padding: "8px 16px",
                          background: "#10b981",
                          border: "none",
                          borderRadius: "6px",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "600"
                        }}
                      >
                        🔗 Dela
                      </button>
                      
                      <button
                        onClick={() => {
                          // Skicka bekräftelseförfrågan till spelare
                          toast?.info('Bekräftelseförfrågan skickad till alla spelare');
                        }}
                        style={{
                          padding: "8px 16px",
                          background: "#f59e0b",
                          border: "none",
                          borderRadius: "6px",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "600"
                        }}
                      >
                        📢 Be om bekräftelse
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MatchPlanCreator;
