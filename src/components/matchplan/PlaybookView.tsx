import React, { useState } from "react";
import { useToast } from "../ui/Toast";

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
  matchPlan: MatchPlan;
  readonly?: boolean;
  playerId?: string;
  onConfirm?: () => void;
}

const PlaybookView: React.FC<Props> = ({ 
  matchPlan, 
  readonly = true, 
  playerId,
  onConfirm 
}) => {
  const toast = useToast();
  const [currentSection, setCurrentSection] = useState<"overview" | "formations" | "tactics" | "instructions">("overview");
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);

  const isConfirmed = playerId ? matchPlan.confirmedBy.includes(playerId) : false;
  const confirmationRate = (matchPlan.confirmedBy.length / 20) * 100; // Antag 20 spelare

  const handleConfirm = () => {
    if (onConfirm && playerId && !isConfirmed) {
      onConfirm();
      toast?.success("Du har bekräftat att du läst matchplanen!");
    }
  };

  const sections = [
    { id: "overview", name: "Översikt", icon: "📊" },
    { id: "formations", name: "Formationer", icon: "🏒" },
    { id: "tactics", name: "Taktik", icon: "📋" },
    { id: "instructions", name: "Instruktioner", icon: "📝" }
  ];

  const styles = {
    container: {
      background: "#1a1a1a",
      minHeight: "100vh",
      color: "#ffffff",
      padding: "20px"
    },
    header: {
      background: "linear-gradient(135deg, #262626, #1a1a1a)",
      borderRadius: "16px",
      padding: "2rem",
      marginBottom: "2rem",
      textAlign: "center" as const,
      border: "1px solid #333"
    },
    tabs: {
      display: "flex",
      gap: "1rem",
      marginBottom: "2rem",
      borderBottom: "1px solid #333",
      paddingBottom: "1rem",
      overflowX: "auto" as const
    },
    tab: {
      padding: "0.75rem 1.5rem",
      borderRadius: "8px",
      border: "1px solid #333",
      background: "#262626",
      color: "#ccc",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontWeight: "500" as const,
      whiteSpace: "nowrap" as const,
      minWidth: "120px"
    },
    activeTab: {
      background: "var(--primary-color)",
      color: "#ffffff",
      borderColor: "var(--primary-color)"
    },
    card: {
      background: "#262626",
      borderRadius: "12px",
      padding: "1.5rem",
      border: "1px solid #333",
      marginBottom: "1rem"
    },
    button: {
      padding: "0.75rem 1.5rem",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600" as const,
      fontSize: "0.875rem",
      transition: "all 0.2s ease"
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          margin: "0 0 1rem 0",
          fontWeight: "700",
          background: "linear-gradient(135deg, #10b981, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          📖 {matchPlan.matchTitle}
        </h1>
        <div style={{ fontSize: "1.25rem", color: "#ccc", marginBottom: "1rem" }}>
          vs {matchPlan.opponent} • {new Date(matchPlan.date).toLocaleDateString("sv-SE")} • {matchPlan.venue}
        </div>
        
        {/* Bekräftelse-status */}
        <div style={{
          background: "#333",
          borderRadius: "12px",
          padding: "1rem",
          marginTop: "1rem"
        }}>
          <div style={{ marginBottom: "0.5rem", fontSize: "0.875rem", color: "#ccc" }}>
            Bekräftat av spelare: {matchPlan.confirmedBy.length}/20 ({Math.round(confirmationRate)}%)
          </div>
          <div style={{
            background: "#1a1a1a",
            borderRadius: "8px",
            height: "8px",
            overflow: "hidden"
          }}>
            <div style={{
              background: "linear-gradient(90deg, #10b981, #3b82f6)",
              height: "100%",
              width: `${confirmationRate}%`,
              transition: "width 0.3s ease"
            }} />
          </div>
          
          {playerId && !readonly && (
            <button
              onClick={handleConfirm}
              disabled={isConfirmed}
              style={{
                ...styles.button,
                background: isConfirmed ? "#10b981" : "var(--primary-color)",
                color: "#ffffff",
                marginTop: "1rem",
                opacity: isConfirmed ? 0.7 : 1
              }}
            >
              {isConfirmed ? "✅ Bekräftad" : "📋 Bekräfta att jag läst"}
            </button>
          )}
        </div>
      </header>

      {/* Navigation */}
      <div style={styles.tabs}>
        {sections.map(section => (
          <button
            key={section.id}
            style={{
              ...styles.tab,
              ...(currentSection === section.id ? styles.activeTab : {})
            }}
            onClick={() => setCurrentSection(section.id as any)}
          >
            {section.icon} {section.name}
          </button>
        ))}
      </div>

      {/* Content */}
      {currentSection === "overview" && (
        <div>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem"
          }}>
            <div style={styles.card}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6", marginBottom: "0.5rem" }}>
                {matchPlan.formations.length}
              </div>
              <div style={{ color: "#ccc" }}>Formationer</div>
            </div>
            <div style={styles.card}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b", marginBottom: "0.5rem" }}>
                {matchPlan.tactics.length}
              </div>
              <div style={{ color: "#ccc" }}>Taktiska instruktioner</div>
            </div>
            <div style={styles.card}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981", marginBottom: "0.5rem" }}>
                {matchPlan.keys.length}
              </div>
              <div style={{ color: "#ccc" }}>Nycklar till seger</div>
            </div>
            <div style={styles.card}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#8b5cf6", marginBottom: "0.5rem" }}>
                {matchPlan.specialPlays.length}
              </div>
              <div style={{ color: "#ccc" }}>Specialspel</div>
            </div>
          </div>

          {/* Nycklar till seger */}
          {matchPlan.keys.length > 0 && (
            <div style={styles.card}>
              <h3 style={{ color: "#8b5cf6", marginBottom: "1rem" }}>🔑 Nycklar till seger</h3>
              <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#ccc" }}>
                {matchPlan.keys.map((key, index) => (
                  <li key={index} style={{ marginBottom: "0.5rem" }}>{key}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tränaranteckningar */}
          {matchPlan.coachNotes && (
            <div style={styles.card}>
              <h3 style={{ color: "#10b981", marginBottom: "1rem" }}>💬 Tränaranteckningar</h3>
              <p style={{ margin: 0, color: "#ccc", lineHeight: 1.6 }}>
                {matchPlan.coachNotes}
              </p>
            </div>
          )}
        </div>
      )}

      {currentSection === "formations" && (
        <div>
          <div style={{ display: "grid", gap: "1rem" }}>
            {matchPlan.formations.map(formation => (
              <div
                key={formation.id}
                style={{
                  ...styles.card,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onClick={() => setSelectedFormation(selectedFormation?.id === formation.id ? null : formation)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ margin: "0 0 0.5rem 0", color: "#3b82f6" }}>
                      🏒 {formation.name}
                    </h4>
                    <div style={{ fontSize: "0.875rem", color: "#ccc", marginBottom: "0.5rem" }}>
                      Typ: {formation.type} • {formation.players.length} spelare
                    </div>
                    <p style={{ margin: 0, color: "#ccc", fontSize: "0.875rem" }}>
                      {formation.description}
                    </p>
                  </div>
                  <div style={{ fontSize: "1.5rem", color: "#666" }}>
                    {selectedFormation?.id === formation.id ? "▼" : "▶"}
                  </div>
                </div>
                
                {selectedFormation?.id === formation.id && (
                  <div style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    background: "#1a1a1a",
                    borderRadius: "8px",
                    border: "1px solid #333"
                  }}>
                    <h5 style={{ color: "#10b981", marginBottom: "0.5rem" }}>Spelarpositioner:</h5>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.5rem" }}>
                      {formation.players.map((player, index) => (
                        <div key={index} style={{ 
                          fontSize: "0.875rem", 
                          color: "#ccc",
                          padding: "0.25rem 0"
                        }}>
                          • Linje {player.line}: {player.position} (#{player.playerId})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {currentSection === "tactics" && (
        <div>
          <div style={{ display: "grid", gap: "1rem" }}>
            {matchPlan.tactics.map(tactic => (
              <div
                key={tactic.id}
                style={{
                  ...styles.card,
                  borderLeft: `4px solid ${
                    tactic.priority === "high" ? "#ef4444" :
                    tactic.priority === "medium" ? "#f59e0b" : "#6b7280"
                  }`
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <h4 style={{ margin: 0, color: "#f59e0b" }}>
                    📋 {tactic.title}
                  </h4>
                  <div style={{
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    background: tactic.priority === "high" ? "#ef4444" :
                              tactic.priority === "medium" ? "#f59e0b" : "#6b7280",
                    color: "#ffffff"
                  }}>
                    {tactic.priority === "high" ? "HÖG" :
                     tactic.priority === "medium" ? "MEDEL" : "LÅG"}
                  </div>
                </div>
                <div style={{ fontSize: "0.875rem", color: "#999", marginBottom: "0.5rem" }}>
                  Kategori: {tactic.category}
                </div>
                <p style={{ margin: 0, color: "#ccc", lineHeight: 1.6 }}>
                  {tactic.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentSection === "instructions" && (
        <div>
          {Object.keys(matchPlan.playerInstructions).length > 0 ? (
            <div style={{ display: "grid", gap: "1rem" }}>
              {Object.entries(matchPlan.playerInstructions).map(([playerId, instruction]) => (
                <div key={playerId} style={styles.card}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "#3b82f6" }}>
                    👤 Spelare #{playerId}
                  </h4>
                  <p style={{ margin: 0, color: "#ccc", lineHeight: 1.6 }}>
                    {instruction}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              ...styles.card,
              textAlign: "center",
              color: "#666"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📝</div>
              <p style={{ margin: 0 }}>Inga individuella spelarinstruktioner tillgängliga</p>
            </div>
          )}

          {/* Specialspel */}
          {matchPlan.specialPlays.length > 0 && (
            <div style={{ ...styles.card, marginTop: "2rem" }}>
              <h3 style={{ color: "#8b5cf6", marginBottom: "1rem" }}>⚡ Specialspel</h3>
              <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#ccc" }}>
                {matchPlan.specialPlays.map((play, index) => (
                  <li key={index} style={{ marginBottom: "0.5rem" }}>{play}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaybookView;
