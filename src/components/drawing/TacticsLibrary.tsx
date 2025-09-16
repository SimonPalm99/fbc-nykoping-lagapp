import React, { useState } from "react";
import { TacticDrawing, DrawingTemplate } from "../../types/tactics";
import { useAuth } from "../../context/AuthContext";

interface Props {
  tactics: TacticDrawing[];
  templates: DrawingTemplate[];
  onSelectTactic: (tactic: TacticDrawing) => void;
  onCreateNew: () => void;
  onDeleteTactic: (tacticId: string) => void;
  onTemplateSelect: (template: DrawingTemplate) => void;
}

const TacticsLibrary: React.FC<Props> = ({
  tactics,
  templates,
  onSelectTactic,
  onCreateNew,
  onDeleteTactic,
  onTemplateSelect
}) => {
  const { isLeader } = useAuth();
  const [activeTab, setActiveTab] = useState<"tactics" | "templates">("tactics");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTactics = tactics.filter(tactic => {
    const matchesSearch = tactic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tactic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || tactic.category === filterCategory;
    const matchesType = filterType === "all" || tactic.type === filterType;
    const canView = isLeader() || tactic.sharedWith.length > 0;
    
    return matchesSearch && matchesCategory && matchesType && canView;
  });

  const filteredTemplates = templates.filter(template => {
    return template.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{
      background: "#1a202c",
      borderRadius: "12px",
      padding: "20px",
      color: "#fff"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h2 style={{ margin: 0 }}>📚 Taktikbibliotek</h2>
        {isLeader() && (
          <button
            onClick={onCreateNew}
            style={{
              padding: "10px 20px",
              background: "#059669",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            ➕ Ny taktik
          </button>
        )}
      </div>

      {/* Flikar */}
      <div style={{
        display: "flex",
        gap: "4px",
        marginBottom: "20px",
        borderBottom: "1px solid #4a5568"
      }}>
        <button
          onClick={() => setActiveTab("tactics")}
          style={{
            padding: "12px 24px",
            background: activeTab === "tactics" ? "#2563eb" : "transparent",
            border: "none",
            borderRadius: "8px 8px 0 0",
            color: "#fff",
            cursor: "pointer",
            fontWeight: activeTab === "tactics" ? "bold" : "normal"
          }}
        >
          🎯 Taktiker ({filteredTactics.length})
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          style={{
            padding: "12px 24px",
            background: activeTab === "templates" ? "#2563eb" : "transparent",
            border: "none",
            borderRadius: "8px 8px 0 0",
            color: "#fff",
            cursor: "pointer",
            fontWeight: activeTab === "templates" ? "bold" : "normal"
          }}
        >
          📋 Mallar ({filteredTemplates.length})
        </button>
      </div>

      {/* Sökfält och filter */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginBottom: "20px",
        flexWrap: "wrap"
      }}>
        <input
          type="text"
          placeholder="Sök taktiker..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "8px 12px",
            background: "#2d3748",
            border: "1px solid #4a5568",
            borderRadius: "6px",
            color: "#fff"
          }}
        />
        
        {activeTab === "tactics" && (
          <>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                padding: "8px 12px",
                background: "#2d3748",
                border: "1px solid #4a5568",
                borderRadius: "6px",
                color: "#fff"
              }}
            >
              <option value="all">Alla kategorier</option>
              <option value="offense">Anfall</option>
              <option value="defense">Försvar</option>
              <option value="special_teams">Speciallag</option>
              <option value="general">Allmänt</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: "8px 12px",
                background: "#2d3748",
                border: "1px solid #4a5568",
                borderRadius: "6px",
                color: "#fff"
              }}
            >
              <option value="all">Alla typer</option>
              <option value="formation">Formation</option>
              <option value="powerplay">Powerplay</option>
              <option value="penalty">Boxplay</option>
              <option value="faceoff">Nedsläpp</option>
              <option value="exercise">Övning</option>
              <option value="play">Spelplan</option>
            </select>
          </>
        )}
      </div>

      {/* Innehåll */}
      {activeTab === "tactics" ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "16px"
        }}>
          {filteredTactics.length === 0 ? (
            <div style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
              color: "#a0aec0"
            }}>
              <p>Inga taktiker hittades</p>
              {isLeader() && (
                <button
                  onClick={onCreateNew}
                  style={{
                    padding: "8px 16px",
                    background: "#059669",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: "pointer",
                    marginTop: "8px"
                  }}
                >
                  Skapa första taktiken
                </button>
              )}
            </div>
          ) : (
            filteredTactics.map(tactic => (
              <div
                key={tactic.id}
                style={{
                  background: "#2d3748",
                  padding: "16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  border: "1px solid #4a5568"
                }}
                onClick={() => onSelectTactic(tactic)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = "#2563eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#4a5568";
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "8px"
                }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "bold"
                  }}>
                    {tactic.title}
                  </h3>
                  {isLeader() && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTactic(tactic.id);
                      }}
                      style={{
                        background: "#dc2626",
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
                  )}
                </div>

                <p style={{
                  color: "#a0aec0",
                  fontSize: "14px",
                  margin: "0 0 12px 0",
                  lineHeight: "1.4"
                }}>
                  {tactic.description || "Ingen beskrivning"}
                </p>

                <div style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "8px"
                }}>
                  <span style={{
                    padding: "2px 8px",
                    background: getCategoryColor(tactic.category),
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    {getCategoryLabel(tactic.category)}
                  </span>
                  <span style={{
                    padding: "2px 8px",
                    background: "#4a5568",
                    borderRadius: "12px",
                    fontSize: "12px"
                  }}>
                    {getTypeLabel(tactic.type)}
                  </span>
                </div>

                <div style={{
                  fontSize: "12px",
                  color: "#718096",
                  display: "flex",
                  justifyContent: "space-between"
                }}>
                  <span>Av: {tactic.createdBy}</span>
                  <span>{new Date(tactic.updatedAt).toLocaleDateString()}</span>
                </div>

                {!isLeader() && tactic.sharedWith.length > 0 && (
                  <div style={{
                    marginTop: "8px",
                    padding: "4px 8px",
                    background: "#059669",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    📤 Delad med dig
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "12px"
        }}>
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              style={{
                background: "#2d3748",
                padding: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "center",
                border: "1px solid #4a5568",
                transition: "all 0.2s ease"
              }}
              onClick={() => onTemplateSelect(template)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.borderColor = "#7c3aed";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.borderColor = "#4a5568";
              }}
            >
              <div style={{
                fontSize: "24px",
                marginBottom: "8px"
              }}>
                {getTemplateIcon(template.category)}
              </div>
              <h4 style={{
                margin: "0 0 4px 0",
                fontSize: "14px"
              }}>
                {template.name}
              </h4>
              <p style={{
                color: "#a0aec0",
                fontSize: "12px",
                margin: 0
              }}>
                {template.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper functions
const getCategoryColor = (category: string) => {
  switch (category) {
    case "offense": return "#059669";
    case "defense": return "#dc2626";
    case "special_teams": return "#7c3aed";
    default: return "#4a5568";
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "offense": return "Anfall";
    case "defense": return "Försvar";
    case "special_teams": return "Speciallag";
    default: return "Allmänt";
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "formation": return "Formation";
    case "powerplay": return "Powerplay";
    case "penalty": return "Boxplay";
    case "faceoff": return "Nedsläpp";
    case "exercise": return "Övning";
    case "play": return "Spelplan";
    default: return "Allmänt";
  }
};

const getTemplateIcon = (category: string) => {
  switch (category) {
    case "field": return "🏒";
    case "zones": return "⬜";
    case "formations": return "👥";
    case "symbols": return "🔶";
    default: return "📋";
  }
};

export default TacticsLibrary;
