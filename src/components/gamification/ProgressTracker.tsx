import React from 'react';
import styles from './ProgressTracker.module.css';

interface ProgressTrackerProps {
  current: number;
  target: number;
  label: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  animated?: boolean;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  current,
  target,
  label,
  color = 'blue',
  size = 'md',
  showPercentage = true,
  animated = true
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  // Removed unused getColorClasses and getSizeClasses functions

  const barColorClass = styles[`progressTracker__bar--${color}`] || styles['progressTracker__bar--blue'];
  const barSizeClass = styles[`progressTracker__bar--${size}`] || styles['progressTracker__bar--md'];
  const labelSizeClass = styles[`progressTracker__label--${size}`] || styles['progressTracker__label--md'];

  return (
    <div className={styles.progressTracker}>
      <div className={styles.progressTracker__header}>
        <span className={`${styles.progressTracker__label} ${labelSizeClass}`}>{label}</span>
        <div className={styles.progressTracker__headerRight}>
          {showPercentage && (
            <span className={styles.progressTracker__percentage}>{Math.round(percentage)}%</span>
          )}
          {isComplete && (
            <span className={styles.progressTracker__check}>✓</span>
          )}
        </div>
      </div>
      <div className={styles.progressTracker__barWrapper}>
        <div
          className={`${styles.progressTracker__bar} ${barColorClass} ${barSizeClass} ${isComplete ? styles['progressTracker__bar--complete'] : ''} ${animated ? styles['progressTracker__bar--animated'] : ''}`}
          data-width={percentage}
        >
          {animated && <div className={styles.progressTracker__barPulse}></div>}
        </div>
      </div>
      <div className={styles.progressTracker__footer}>
        <span className={styles.progressTracker__footerLabel}>{current.toLocaleString()} av {target.toLocaleString()}</span>
        {!isComplete && (
          <span className={styles.progressTracker__footerLeft}>{(target - current).toLocaleString()} kvar</span>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
