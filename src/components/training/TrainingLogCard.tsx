import React from "react";
import { TrainingLog } from "../../types/user";

interface TrainingLogCardProps {
  log: TrainingLog;
  onEdit?: (log: TrainingLog) => void;
  onDelete?: (logId: string) => void;
  showActions?: boolean;
}

const intensityColors = {
  1: "#10b981",
  2: "#84cc16", 
  3: "#f59e0b",
  4: "#f97316",
  5: "#ef4444"
};

const intensityLabels = {
  1: "Lätt",
  2: "Låg",
  3: "Medel", 
  4: "Hög",
  5: "Max"
};

const feelingEmojis = {
  1: "😰",
  2: "😕", 
  3: "😐",
  4: "😊",
  5: "🤩"
};

export const TrainingLogCard: React.FC<TrainingLogCardProps> = ({
  log,
  onEdit,
  onDelete,
  showActions = true
}) => {
  const intensityColor = intensityColors[log.intensity as keyof typeof intensityColors];
  const intensityLabel = intensityLabels[log.intensity as keyof typeof intensityLabels];
  const feelingEmoji = feelingEmojis[log.feeling as keyof typeof feelingEmojis];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const hasStats = log.stats && (
    (log.stats.goals || 0) > 0 || 
    (log.stats.assists || 0) > 0 || 
    (log.stats.shots || 0) > 0
  );

  return (
    <div style={{
      background: "linear-gradient(135deg, #1a1a1a, #262626)",
      borderRadius: "16px",
      padding: "1.5rem",
      border: "1px solid #333",
      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Intensitetsindikator */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: intensityColor
      }} />

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "1rem"
      }}>
        <div>
          <div style={{
            fontSize: "1.125rem",
            fontWeight: "700",
            color: "#b8f27c",
            marginBottom: "0.25rem"
          }}>
            {formatDate(log.date)}
          </div>
          <div style={{
            fontSize: "0.875rem",
            color: "#9ca3af",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem"
          }}>
            <span>⏱️ {log.duration} min</span>
            <span style={{ color: intensityColor }}>
              ⚡ {intensityLabel}
            </span>
            <span style={{ fontSize: "1.25rem" }}>
              {feelingEmoji}
            </span>
          </div>
        </div>

        {showActions && (onEdit || onDelete) && (
          <div style={{
            display: "flex",
            gap: "0.5rem"
          }}>
            {onEdit && (
              <button
                onClick={() => onEdit(log)}
                style={{
                  background: "transparent",
                  border: "1px solid #374151",
                  borderRadius: "6px",
                  padding: "0.5rem",
                  color: "#e2e8f0",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#b8f27c";
                  e.currentTarget.style.color = "#b8f27c";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#374151";
                  e.currentTarget.style.color = "#e2e8f0";
                }}
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(log.id)}
                style={{
                  background: "transparent",
                  border: "1px solid #374151",
                  borderRadius: "6px",
                  padding: "0.5rem",
                  color: "#e2e8f0",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#ef4444";
                  e.currentTarget.style.color = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#374151";
                  e.currentTarget.style.color = "#e2e8f0";
                }}
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>

      {/* Färdigheter */}
      {log.skills && log.skills.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{
            fontSize: "0.75rem",
            fontWeight: "600",
            color: "#9ca3af",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            Tränade färdigheter
          </div>
          <div style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap"
          }}>
            {log.skills.map((skill, index) => (
              <span
                key={index}
                style={{
                  background: "#b8f27c20",
                  color: "#b8f27c",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  border: "1px solid #b8f27c40"
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Statistik */}
      {hasStats && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{
            fontSize: "0.75rem",
            fontWeight: "600",
            color: "#9ca3af",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            Statistik
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
            gap: "0.75rem"
          }}>
            {(log.stats?.goals || 0) > 0 && (
              <div style={{
                background: "#0f0f0f",
                padding: "0.75rem",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #333"
              }}>
                <div style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#22c55e",
                  marginBottom: "0.25rem"
                }}>
                  {log.stats?.goals || 0}
                </div>
                <div style={{
                  fontSize: "0.75rem",
                  color: "#9ca3af"
                }}>
                  ⚽ Mål
                </div>
              </div>
            )}
            {(log.stats?.assists || 0) > 0 && (
              <div style={{
                background: "#0f0f0f",
                padding: "0.75rem",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #333"
              }}>
                <div style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#f59e0b",
                  marginBottom: "0.25rem"
                }}>
                  {log.stats?.assists || 0}
                </div>
                <div style={{
                  fontSize: "0.75rem",
                  color: "#9ca3af"
                }}>
                  🎯 Assist
                </div>
              </div>
            )}
            {(log.stats?.shots || 0) > 0 && (
              <div style={{
                background: "#0f0f0f",
                padding: "0.75rem",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #333"
              }}>
                <div style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#8b5cf6",
                  marginBottom: "0.25rem"
                }}>
                  {log.stats?.shots || 0}
                </div>
                <div style={{
                  fontSize: "0.75rem",
                  color: "#9ca3af"
                }}>
                  🏒 Skott
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Anteckningar */}
      {log.note && (
        <div style={{
          background: "#0f0f0f",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid #333"
        }}>
          <div style={{
            fontSize: "0.75rem",
            fontWeight: "600",
            color: "#9ca3af",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            📝 Anteckningar
          </div>
          <div style={{
            fontSize: "0.875rem",
            color: "#e2e8f0",
            lineHeight: 1.5
          }}>
            {log.note}
          </div>
        </div>
      )}
    </div>
  );
};
