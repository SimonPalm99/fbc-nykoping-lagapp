import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

export const ThemeToggle: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={styles['theme-toggle']}
      title={`Växla till ${isDark ? 'ljust' : 'mörkt'} tema`}
      aria-label={`Aktivera ${isDark ? 'ljust' : 'mörkt'} tema`}
    >
      <div
        className={
          `${styles['theme-toggle-icon']} ` +
          (isDark ? styles['theme-toggle-icon-rotated'] : '')
        }
      >
        {isDark ? '☀️' : '🌙'}
      </div>
    </button>
  );
};

// Advanced theme toggle with animation
export const AnimatedThemeToggle: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={
        `${styles['animated-theme-toggle']} ` +
        (isDark ? styles['animated-theme-toggle-dark'] : styles['animated-theme-toggle-light'])
      }
      title={`Växla till ${isDark ? 'ljust' : 'mörkt'} tema`}
      aria-label={`Aktivera ${isDark ? 'ljust' : 'mörkt'} tema`}
    >
      <div
        className={
          `${styles['animated-theme-toggle-knob']} ` +
          (isDark ? styles['animated-theme-toggle-knob-dark'] : styles['animated-theme-toggle-knob-light'])
        }
      >
        {isDark ? '🌙' : '☀️'}
      </div>
    </button>
  );
};
