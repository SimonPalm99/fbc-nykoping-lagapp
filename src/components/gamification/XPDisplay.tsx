import React, { useState, useEffect } from 'react';
import styles from './XPDisplay.module.css';

interface XPDisplayProps {
  currentXP: number;
  level: number;
  xpToNext: number;
  totalXP: number;
  recentGain?: number;
  showRecentGain?: boolean;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'default' | 'gaming' | 'minimal';
}

const XPDisplay: React.FC<XPDisplayProps> = ({
  currentXP,
  level,
  xpToNext,
  totalXP,
  recentGain = 0,
  showRecentGain = false,
  size = 'md',
  theme = 'default'
}) => {
  const [animateGain, setAnimateGain] = useState(false);
  const [displayXP, setDisplayXP] = useState(currentXP);

  useEffect(() => {
    if (showRecentGain && recentGain > 0) {
      setAnimateGain(true);
      
      // Animate the XP counter
      const duration = 1000;
      const startValue = currentXP - recentGain;
      const endValue = currentXP;
      const startTime = Date.now();

      const animateCounter = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        const currentValue = startValue + (endValue - startValue) * easeProgress;
        setDisplayXP(Math.round(currentValue));

        if (progress < 1) {
          requestAnimationFrame(animateCounter);
        } else {
          setTimeout(() => setAnimateGain(false), 500);
        }
      };

      requestAnimationFrame(animateCounter);
    } else {
      setDisplayXP(currentXP);
    }
  }, [currentXP, recentGain, showRecentGain]);

  const percentage = (currentXP / totalXP) * 100;
  
  // Map size and theme to CSS module class names
  const containerClass = `${styles.xpDisplayContainer}
    ${theme === 'gaming' ? styles['xpDisplayContainer--gaming'] : ''}
    ${theme === 'minimal' ? styles['xpDisplayContainer--minimal'] : ''}`.replace(/\s+/g, ' ').trim();
  const levelClass = `${styles.xpDisplayLevel}
    ${theme === 'gaming' ? styles['xpDisplayLevel--gaming'] : ''}
    ${theme === 'minimal' ? styles['xpDisplayLevel--minimal'] : ''}
    ${theme === 'default' ? styles['xpDisplayLevel--default'] : ''}`.replace(/\s+/g, ' ').trim();
  const xpClass = styles.xpDisplayXP;
  const progressBarClass = `${styles.xpDisplayProgressBar}
    ${size === 'sm' ? styles.xpDisplayProgressBarSm : ''}
    ${size === 'lg' ? styles.xpDisplayProgressBarLg : ''}`.replace(/\s+/g, ' ').trim();
  const progressClass = `${styles.xpDisplayProgress}
    ${theme === 'gaming' ? styles['xpDisplayProgress--gaming'] : ''}
    ${theme === 'minimal' ? styles['xpDisplayProgress--minimal'] : ''}
    ${theme === 'default' ? styles['xpDisplayProgress--default'] : ''}
    ${size === 'sm' ? styles.xpDisplayProgressSm : ''}
    ${size === 'lg' ? styles.xpDisplayProgressLg : ''}`.replace(/\s+/g, ' ').trim();
  const progressBgClass = `${styles.xpDisplayProgressBg}
    ${theme === 'gaming' ? styles['xpDisplayProgressBg--gaming'] : ''}
    ${theme === 'minimal' ? styles['xpDisplayProgressBg--minimal'] : ''}
    ${theme === 'default' ? styles['xpDisplayProgressBg--default'] : ''}`.replace(/\s+/g, ' ').trim();
  const recentGainClass = styles.xpDisplayRecentGain;
  const shimmerClass = styles.xpDisplayShimmer;
  const extrasClass = styles.xpDisplayExtras;
  const extrasPingClass = styles.xpDisplayExtrasPing;
  const extrasPulseClass = styles.xpDisplayExtrasPulse;
  const footerClass = styles.xpDisplayFooter;

  return (
  <div className={containerClass}>
      {/* Recent XP gain animation */}
      {animateGain && recentGain > 0 && (
        <div className={recentGainClass}>+{recentGain} XP</div>
      )}

      {/* Level display */}
      <div className={styles.xpDisplayHeader}>
        <div className={styles.xpDisplayHeaderLeft}>
          <span className={levelClass}>Nivå {level}</span>
          {theme === 'gaming' && (
            <span className={styles.xpDisplayGamingIcon}>⚡</span>
          )}
        </div>
        <div className={styles.xpDisplayHeaderRight}>
          <div className={xpClass}>{displayXP.toLocaleString()} XP</div>
          <div className={styles.xpDisplayNext}>{xpToNext.toLocaleString()} till nästa nivå</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className={progressBarClass + ' ' + progressBgClass}>
        <div 
          className={progressClass}
          data-xp-progress-width={percentage}
        >
          {/* Shimmer effect */}
          <div className={shimmerClass}></div>
        </div>
      </div>

      {/* Level progress indicator */}
      <div className={footerClass}>
        <span>Nivå {level}</span>
        <span>{Math.round(percentage)}%</span>
        <span>Nivå {level + 1}</span>
      </div>

      {/* Gaming theme extras */}
      {theme === 'gaming' && (
        <div className={extrasClass}>
          <div className={extrasPingClass}></div>
          <div className={extrasPulseClass}></div>
        </div>
      )}
    </div>
  );
};

export default XPDisplay;
