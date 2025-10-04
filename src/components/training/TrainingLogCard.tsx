import React from "react";
import { TrainingLog } from "../../types/user";
import styles from "./TrainingLogCard.module.css";

interface TrainingLogCardProps {
  log: TrainingLog;
  onEdit?: (log: TrainingLog) => void;
  onDelete?: (logId: string) => void;
  showActions?: boolean;
}


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
    <div className={styles.traininglogCard}>
      {/* Intensitetsindikator */}
      <div className={
        styles.traininglogIntensity + ' ' + styles[`traininglogIntensity${log.intensity}`]
      } />

      {/* Header */}
      <div className={styles.traininglogHeader}>
        <div>
          <div className={styles.traininglogDate}>
            {formatDate(log.date)}
          </div>
          <div className={styles.traininglogMeta}>
            <span>⏱️ {log.duration} min</span>
            <span className={
              styles.traininglogMetaIntensity + ' ' + styles[`traininglogMetaIntensity${log.intensity}`]
            }>
              ⚡ {intensityLabel}
            </span>
            <span className={styles.traininglogMetaFeeling}>{feelingEmoji}</span>
          </div>
        </div>

        {showActions && (onEdit || onDelete) && (
          <div className={styles.traininglogActions}>
            {onEdit && (
              <button
                onClick={() => onEdit(log)}
                className={styles.traininglogActionBtn + ' ' + styles.traininglogActionBtnEdit}
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(log.id)}
                className={styles.traininglogActionBtn + ' ' + styles.traininglogActionBtnDelete}
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>

      {/* Färdigheter */}
      {log.skills && log.skills.length > 0 && (
        <div className={styles.traininglogSkills}>
          <div className={styles.traininglogSkillsLabel}>Tränade färdigheter</div>
          <div className={styles.traininglogSkillsList}>
            {log.skills.map((skill, index) => (
              <span key={index} className={styles.traininglogSkill}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Statistik */}
      {hasStats && (
        <div className={styles.traininglogStats}>
          <div className={styles.traininglogStatsLabel}>Statistik</div>
          <div className={styles.traininglogStatsGrid}>
            {(log.stats?.goals || 0) > 0 && (
              <div className={styles.traininglogStat}>
                <div className={styles.traininglogStatValueGoal}>{log.stats?.goals || 0}</div>
                <div className={styles.traininglogStatLabel}>⚽ Mål</div>
              </div>
            )}
            {(log.stats?.assists || 0) > 0 && (
              <div className={styles.traininglogStat}>
                <div className={styles.traininglogStatValueAssist}>{log.stats?.assists || 0}</div>
                <div className={styles.traininglogStatLabel}>🎯 Assist</div>
              </div>
            )}
            {(log.stats?.shots || 0) > 0 && (
              <div className={styles.traininglogStat}>
                <div className={styles.traininglogStatValueShot}>{log.stats?.shots || 0}</div>
                <div className={styles.traininglogStatLabel}>🏒 Skott</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Anteckningar */}
      {log.note && (
        <div className={styles.traininglogNote}>
          <div className={styles.traininglogNoteLabel}>📝 Anteckningar</div>
          <div className={styles.traininglogNoteText}>{log.note}</div>
        </div>
      )}
    </div>
  );
};
