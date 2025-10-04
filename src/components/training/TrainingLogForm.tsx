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
    <div className={"formRoot"}>
      <h2 className={"formTitle"}>
        📝 {existingLog ? "Redigera träningslogg" : "Ny träningslogg"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Datum och Duration */}
        <div className={"formGrid"}>
          <div>
            <label className={"formLabel"}>📅 Datum</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className={"input"}
              required
              placeholder="Välj datum"
            />
          </div>

          <div>
            <label className={"formLabel"}>⏱️ Längd (minuter)</label>
            <input
              type="number"
              min="1"
              max="300"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
              className={"input"}
              required
              placeholder="Längd i minuter"
            />
          </div>
        </div>

        {/* Intensitet */}
        <div className="section">
          <label className="formLabel">⚡ Intensitet</label>
          <div className="intensityRow">
            {intensityLevels.map(level => (
              <button
                key={level.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, intensity: level.value }))}
                className={
                  formData.intensity === level.value
                    ? `intensityButton intensityButtonActive intensity-color-${level.value}`
                    : "intensityButton"
                }
              >
                {level.label}
              </button>
            ))}
          </div>
          {selectedIntensity && (
            <p className="intensityDescription">{selectedIntensity.description}</p>
          )}
        </div>

        {/* Feeling */}
        <div className="section">
          <label className="formLabel">😊 Känsla</label>
          <div className="feelingRow">
            {feelingLevels.map(level => (
              <button
                key={level.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, feeling: level.value }))}
                className={formData.feeling === level.value ? "feelingButton feelingButtonActive" : "feelingButton"}
              >
                <span className="feelingEmoji">{level.emoji}</span>
                <span>{level.label}</span>
              </button>
            ))}
          </div>
          {selectedFeeling && (
            <p className="feelingDescription">{selectedFeeling.description}</p>
          )}
        </div>

        {/* Tränade färdigheter */}
        <div className="section">
          <label className="formLabel">🎯 Tränade färdigheter</label>
          {skillCategories.map(category => (
            <div key={category.id} className="skillCategory">
              <h4 className="skillCategoryTitle">{category.icon} {category.label}</h4>
              <div className="skillRow">
                {category.skills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className={formData.skills.includes(skill) ? "skillButton skillButtonActive" : "skillButton"}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Statistik */}
        <div className="section">
          <label className="formLabel">📊 Statistik (valfritt)</label>
          <div className="statsGrid">
            {[ 
              { key: "goals", label: "Mål", icon: "⚽", placeholder: "Antal mål" },
              { key: "assists", label: "Assist", icon: "🎯", placeholder: "Antal assist" },
              { key: "shots", label: "Skott", icon: "🏒", placeholder: "Antal skott" }
            ].map(stat => (
              <div key={stat.key}>
                <label className="statsLabel">{stat.icon} {stat.label}</label>
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
                  className={"statsInput"}
                  placeholder={stat.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Anteckningar */}
        <div className="section">
          <label className="formLabel">📝 Anteckningar</label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
            placeholder="Hur gick träningen? Vad kan förbättras nästa gång?"
            rows={4}
            className={"textarea"}
          />
        </div>

        {/* Knappar */}
        <div className="buttonRow">
          <button
            type="button"
            onClick={onCancel}
            className="cancelButton"
          >
            Avbryt
          </button>
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            variant="primary"
            className="submitButton"
          >
            {existingLog ? "Uppdatera" : "Spara logg"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};
