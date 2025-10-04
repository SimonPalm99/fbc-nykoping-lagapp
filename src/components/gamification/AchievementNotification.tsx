import React, { useState, useEffect } from 'react';
import styles from './AchievementNotification.module.css';

interface AchievementNotificationProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
    xp: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  isVisible,
  onClose,
  duration = 5000
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);

      return () => clearTimeout(timer);
    }
    return; // Explicit return for else case
  }, [isVisible, duration, onClose]);

  const getRarityClasses = (rarity: string) => {
    switch (rarity) {
      case 'rare':
        return styles.achievementNotification__rare;
      case 'epic':
        return styles.achievementNotification__epic;
      case 'legendary':
        return styles.achievementNotification__legendary;
      default:
        return '';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'rare':
        return 'Sällsynt Achievement';
      case 'epic':
        return 'Episk Achievement';
      case 'legendary':
        return 'Legendär Achievement';
      default:
        return 'Achievement Upplåst';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.achievementNotification}>
      <div className={isAnimating ? styles.achievementNotification__container : styles.achievementNotification__container + ' ' + styles['achievementNotification__container--hidden']}>
        <div className={styles.achievementNotification__card + ' ' + getRarityClasses(achievement.rarity)}>
          {/* Close button */}
          <button
            onClick={onClose}
            className={styles.achievementNotification__closeBtn}
          >
            ×
          </button>
          {/* Content */}
          <div className={styles.achievementNotification__content}>
            <div className={styles.achievementNotification__icon}>{achievement.icon}</div>
            <div className={styles.achievementNotification__info}>
              <div className={styles.achievementNotification__rarity}>{getRarityText(achievement.rarity)}</div>
              <h3 className={styles.achievementNotification__title}>{achievement.title}</h3>
              <p className={styles.achievementNotification__desc}>{achievement.description}</p>
              <div className={styles.achievementNotification__row}>
                <span className={styles.achievementNotification__xp}>+{achievement.xp} XP</span>
                <span className={styles.achievementNotification__congrats}>🎉 Grattis!</span>
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div className={styles.achievementNotification__progressBar}>
            <div
              className={styles.achievementNotification__progress}
              data-width={isAnimating ? '0%' : '100%'}
              data-duration={duration}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;
