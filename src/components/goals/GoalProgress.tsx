import React from 'react';
import styles from './GoalProgress.module.css';
import SportIcon from '../ui/SportIcon';

interface PersonalGoal {
  id: string;
  type: 'goals' | 'assists' | 'trainings' | 'matches';
  target: number;
  current: number;
  label: string;
  icon: string;
  color: string;
}

interface GoalProgressProps {
  goals: PersonalGoal[];
  loading?: boolean;
}

const GoalProgressCard: React.FC<{ goal: PersonalGoal }> = ({ goal }) => {
  const percentage = Math.min((goal.current / goal.target) * 100, 100);
  const isCompleted = goal.current >= goal.target;
  // Använd data-attribut för färg istället för inline-style
  // Använd data-attribut för progress istället för inline-style
  return (
    <div
      className={`${isCompleted ? styles.goalProgressCardCompleted : styles.goalProgressCard} ${styles.goalProgressCard}`}
      data-color={goal.color}
    >
      {isCompleted && <div className={styles.goalProgressCardPattern} />}
      <div className={styles.goalProgressHeader}>
        <div className={styles.goalProgressIcon}>
          <SportIcon type={goal.icon as any} size={24} color="#fff" />
        </div>
        <div>
          <div className={styles.goalProgressLabel}>{goal.label}</div>
          <div className={styles.goalProgressStats}>
            {goal.current} av {goal.target}
            {isCompleted && (
              <span className={styles.goalProgressAchieved}>✅ Uppnått!</span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.goalProgressBarWrapper}>
        <div className={styles.goalProgressBar} data-progress={percentage} />
        {!isCompleted && percentage > 0 && (
          <div className={styles.goalProgressBarShimmer} />
        )}
      </div>
      <div className={percentage >= 80 ? styles.goalProgressPercentHigh : styles.goalProgressPercent}>
        {Math.round(percentage)}%
      </div>
    </div>
  );
};

const GoalProgress: React.FC<GoalProgressProps> = ({ goals, loading = false }) => {
  if (loading) {
    return (
      <div className={styles.goalProgressGrid}>
        {[1, 2].map(i => (
          <div key={i} className={styles.goalProgressCard}>
            <div className={styles.goalProgressHeader}>
              <div className={`${styles.goalProgressIcon} ${styles.goalProgressSkeletonIcon}`} />
              <div className={styles.goalProgressSkeletonTextWrapper}>
                <div className={styles.goalProgressSkeletonTextMain} />
                <div className={styles.goalProgressSkeletonTextSub} />
              </div>
            </div>
            <div className={styles.goalProgressSkeletonBar} />
          </div>
        ))}
      </div>
    );
  }

  const displayGoals = goals.slice(0, 4); // Show top 4 goals

  return (
    <div className={styles.goalProgressGrid}>
      {displayGoals.map((goal, index) => (
        <div 
          key={goal.id}
          className={`${styles.goalProgressFadeIn} ${styles[`goalProgressFadeInDelay${index}`]}`}
        >
          <GoalProgressCard goal={goal} />
        </div>
      ))}
    </div>
  );
};

export default GoalProgress;
