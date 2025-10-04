import React from 'react';
import styles from './BadgeDisplay.module.css';
import { Badge, Milestone } from '../../types/auth';

interface BadgeDisplayProps {
  badges: Badge[];
  milestones: Milestone[];
  compact?: boolean;
  showProgress?: boolean;
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badges,
  milestones,
  compact = false,
  showProgress = true
}) => {


  const getMilestoneProgress = (milestone: Milestone) => {
    if (milestone.achieved) return 100;
    
    // Här skulle vi koppla till faktisk användardata
    // För nu returnerar vi mock-data
    switch (milestone.type) {
      case 'training_count':
        return Math.min((50 / milestone.target) * 100, 100);
      case 'match_count':
        return Math.min((12 / milestone.target) * 100, 100);
      case 'goal_count':
        return Math.min((8 / milestone.target) * 100, 100);
      default:
        return 0;
    }
  };

  return (
    <div className={styles["badge-display"]}>
      {/* Badges Sektion */}
      <div className={styles["badges-section"]}>
        <h4 className={styles["section-title"]}>
          🏆 Badges ({badges.length})
        </h4>
        {badges.length === 0 ? (
          <div className={styles["empty-state"]}>
            <p>Inga badges än. Träna flitigt för att låsa upp prestationer!</p>
          </div>
        ) : (
          <div className={`${styles["badges-grid"]} ${compact ? styles["compact"] : ""}`}>
            {badges.map((badge) => {
              const rarityClass = badge.rarity ? styles[`rarity-${badge.rarity}`] : styles["rarity-default"];
              const colorClass = badge.color ? styles[`badge-color-${badge.color.replace('#','')}`] : "";
              return (
                <div 
                  key={badge.id}
                  className={`${styles["badge-item"]} ${rarityClass}`}
                  title={badge.description}
                >
                  <div className={`${styles["badge-icon"]} ${colorClass}`}>
                    {badge.icon}
                  </div>
                  {!compact && (
                    <>
                      <h5 className={styles["badge-name"]}>{badge.name}</h5>
                      <p className={styles["badge-description"]}>{badge.description}</p>
                      <span className={styles["badge-date"]}>
                        {new Date(badge.earnedDate).toLocaleDateString('sv-SE')}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Milstolpar Sektion */}
      <div className={styles["milestones-section"]}>
        <h4 className={styles["section-title"]}>
          🎯 Milstolpar ({milestones.filter(m => m.achieved).length}/{milestones.length})
        </h4>
        <div className={styles["milestones-list"]}>
          {milestones.map((milestone) => {
            const progress = getMilestoneProgress(milestone);
            return (
              <div 
                key={milestone.id}
                className={`${styles["milestone-item"]} ${milestone.achieved ? styles["achieved"] : ""}`}
              >
                <div className={styles["milestone-header"]}>
                  <div className={styles["milestone-icon"]}>
                    {milestone.icon}
                  </div>
                  <div className={styles["milestone-info"]}>
                    <h5 className={styles["milestone-name"]}>{milestone.name}</h5>
                    <p className={styles["milestone-description"]}>{milestone.description}</p>
                  </div>
                  <div className={styles["milestone-status"]}>
                    {milestone.achieved ? (
                      <span className={styles["achieved-badge"]}>✓ Uppnådd</span>
                    ) : (
                      <span className={styles["progress-text"]}>{Math.round(progress)}%</span>
                    )}
                  </div>
                </div>
                {showProgress && !milestone.achieved && (
                  <div className={styles["progress-bar"]}>
                    <div 
                      className={`${styles["progress-fill"]} ${styles[`progress-${Math.round(progress/10)*10}`]}`}
                    />
                  </div>
                )}
                {milestone.achieved && milestone.achievedAt && (
                  <span className={styles["achievement-date"]}>
                    Uppnådd: {new Date(milestone.achievedAt).toLocaleDateString('sv-SE')}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BadgeDisplay;
