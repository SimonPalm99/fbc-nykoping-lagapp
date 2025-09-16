import React, { useState } from "react";
import { TrainingLog } from "../../types/user";
import { LoadingButton } from "../ui/LoadingButton";
import { useToast } from "../ui/Toast";

interface TrainingLogFormProps {
  onSubmit: (log: Partial<TrainingLog>) => Promise<void>;
  onCancel: () => void;
  existingLog?: TrainingLog;
}

const skillCategories = [
  { id: "teknik", label: "Teknik", icon: "🎯", skills: ["bollkänsla", "passningar", "första touch", "vändningar"] },
  { id: "skott", label: "Skott", icon: "⚽", skills: ["skotteknik", "kraft", "precision", "avslut"] },
  { id: "fys", label: "Fysik", icon: "💪", skills: ["uthållighet", "styrka", "explosivitet", "balans"] },
  { id: "taktik", label: "Taktik", icon: "🧠", skills: ["positionering", "spelläsning", "beslut", "kommunikation"] },
  { id: "målvakt", label: "Målvakt", icon: "🥅", skills: ["reflexer", "positionering", "distribution", "kommunikation"] }
];

const intensityLevels = [
  { value: 1, label: "Lätt", color: "#10b981", description: "Uppvärmning/återhämtning" },
  { value: 2, label: "Låg", color: "#84cc16", description: "Teknisk träning" },
  { value: 3, label: "Medel", color: "#f59e0b", description: "Normal träning" },
  { value: 4, label: "Hög", color: "#f97316", description: "Intensiv träning" },
  { value: 5, label: "Max", color: "#ef4444", description: "Maximal ansträngning" }
];

const feelingLevels = [
  { value: 1, emoji: "😰", label: "Dålig", description: "Orkade knappt" },
  { value: 2, emoji: "😕", label: "Mindre bra", description: "Tung känsla" },
  { value: 3, emoji: "😐", label: "OK", description: "Normal känsla" },
  { value: 4, emoji: "😊", label: "Bra", description: "Positiv känsla" },
  { value: 5, emoji: "🤩", label: "Fantastisk", description: "Fantastisk form" }
];

export const TrainingLogForm: React.FC<TrainingLogFormProps> = ({
  onSubmit,
  onCancel,
  existingLog
}) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: existingLog?.date || new Date().toISOString().split('T')[0],
    duration: existingLog?.duration || 60,
    intensity: existingLog?.intensity || 3,
    feeling: existingLog?.feeling || 3,
    skills: existingLog?.skills || [],
    note: existingLog?.note || "",
    stats: {
      goals: existingLog?.stats?.goals || 0,
      assists: existingLog?.stats?.assists || 0,
      shots: existingLog?.stats?.shots || 0
    }
  });

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date) {
      toast.error("Datum måste anges");
      return;
    }

    if (formData.duration < 1 || formData.duration > 300) {
      toast.error("Träningslängd måste vara mellan 1-300 minuter");
      return;
    }

    setIsSubmitting(true);
    try {
      const logData = {
        ...formData,
        date: formData.date || new Date().toISOString().split('T')[0],
        id: existingLog?.id || `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      await onSubmit(logData as any);
      toast.success(existingLog ? "Träningslogg uppdaterad!" : "Träningslogg sparad!");
    } catch (error) {
      toast.error("Kunde inte spara träningsloggen");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedIntensity = intensityLevels.find(level => level.value === formData.intensity);
  const selectedFeeling = feelingLevels.find(level => level.value === formData.feeling);

  return (
    <div style={{
      background: "#0f0f0f",
      borderRadius: "16px",
      padding: "2rem",
      maxWidth: "600px",
      width: "100%",
      maxHeight: "90vh",
      overflowY: "auto"
    }}>
      <h2 style={{
        margin: "0 0 2rem 0",
        fontSize: "1.5rem",
        fontWeight: "700",
        color: "#b8f27c",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem"
      }}>
        📝 {existingLog ? "Redigera träningslogg" : "Ny träningslogg"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Datum och Duration */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "2rem"
        }}>
          <div>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#e2e8f0",
              marginBottom: "0.5rem"
            }}>
              📅 Datum
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #374151",
                background: "#1f2937",
                color: "#e2e8f0",
                fontSize: "0.875rem"
              }}
              required
            />
          </div>

          <div>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#e2e8f0",
              marginBottom: "0.5rem"
            }}>
              ⏱️ Längd (minuter)
            </label>
            <input
              type="number"
              min="1"
              max="300"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #374151",
                background: "#1f2937",
                color: "#e2e8f0",
                fontSize: "0.875rem"
              }}
              required
            />
          </div>
        </div>

        {/* Intensitet */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#e2e8f0",
            marginBottom: "1rem"
          }}>
            ⚡ Intensitet
          </label>
          <div style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap"
          }}>
            {intensityLevels.map(level => (
              <button
                key={level.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, intensity: level.value }))}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: formData.intensity === level.value ? `2px solid ${level.color}` : "1px solid #374151",
                  background: formData.intensity === level.value ? `${level.color}20` : "#1f2937",
                  color: formData.intensity === level.value ? level.color : "#e2e8f0",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  flex: 1,
                  minWidth: "80px",
                  textAlign: "center"
                }}
              >
                {level.label}
              </button>
            ))}
          </div>
          {selectedIntensity && (
            <p style={{
              fontSize: "0.75rem",
              color: "#9ca3af",
              marginTop: "0.5rem",
              textAlign: "center"
            }}>
              {selectedIntensity.description}
            </p>
          )}
        </div>

        {/* Feeling */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#e2e8f0",
            marginBottom: "1rem"
          }}>
            😊 Känsla
          </label>
          <div style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "space-between"
          }}>
            {feelingLevels.map(level => (
              <button
                key={level.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, feeling: level.value }))}
                style={{
                  padding: "1rem 0.5rem",
                  borderRadius: "8px",
                  border: formData.feeling === level.value ? "2px solid #b8f27c" : "1px solid #374151",
                  background: formData.feeling === level.value ? "#b8f27c20" : "#1f2937",
                  color: "#e2e8f0",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  flex: 1,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem"
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>{level.emoji}</span>
                <span>{level.label}</span>
              </button>
            ))}
          </div>
          {selectedFeeling && (
            <p style={{
              fontSize: "0.75rem",
              color: "#9ca3af",
              marginTop: "0.5rem",
              textAlign: "center"
            }}>
              {selectedFeeling.description}
            </p>
          )}
        </div>

        {/* Tränade färdigheter */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#e2e8f0",
            marginBottom: "1rem"
          }}>
            🎯 Tränade färdigheter
          </label>
          {skillCategories.map(category => (
            <div key={category.id} style={{ marginBottom: "1rem" }}>
              <h4 style={{
                margin: "0 0 0.5rem 0",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#b8f27c",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                {category.icon} {category.label}
              </h4>
              <div style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap"
              }}>
                {category.skills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    style={{
                      padding: "0.5rem 0.75rem",
                      borderRadius: "6px",
                      border: formData.skills.includes(skill) ? "1px solid #b8f27c" : "1px solid #374151",
                      background: formData.skills.includes(skill) ? "#b8f27c20" : "#1f2937",
                      color: formData.skills.includes(skill) ? "#b8f27c" : "#e2e8f0",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Statistik */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#e2e8f0",
            marginBottom: "1rem"
          }}>
            📊 Statistik (valfritt)
          </label>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "1rem"
          }}>
            {[
              { key: "goals", label: "Mål", icon: "⚽" },
              { key: "assists", label: "Assist", icon: "🎯" },
              { key: "shots", label: "Skott", icon: "🏒" }
            ].map(stat => (
              <div key={stat.key}>
                <label style={{
                  display: "block",
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  marginBottom: "0.25rem"
                }}>
                  {stat.icon} {stat.label}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stats[stat.key as keyof typeof formData.stats]}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    stats: {
                      ...prev.stats,
                      [stat.key]: parseInt(e.target.value) || 0
                    }
                  }))}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #374151",
                    background: "#1f2937",
                    color: "#e2e8f0",
                    fontSize: "0.875rem"
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Anteckningar */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#e2e8f0",
            marginBottom: "0.5rem"
          }}>
            📝 Anteckningar
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
            placeholder="Hur gick träningen? Vad kan förbättras nästa gång?"
            rows={4}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #374151",
              background: "#1f2937",
              color: "#e2e8f0",
              fontSize: "0.875rem",
              resize: "vertical",
              minHeight: "100px"
            }}
          />
        </div>

        {/* Knappar */}
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "flex-end"
        }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "1px solid #374151",
              background: "transparent",
              color: "#e2e8f0",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Avbryt
          </button>
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            variant="primary"
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: "600"
            }}
          >
            {existingLog ? "Uppdatera" : "Spara logg"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};
