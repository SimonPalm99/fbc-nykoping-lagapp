import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      title={`Växla till ${isDark ? 'ljust' : 'mörkt'} tema`}
      aria-label={`Aktivera ${isDark ? 'ljust' : 'mörkt'} tema`}
      style={{
        background: 'transparent',
        border: `2px solid var(--border-color)`,
        borderRadius: '50%',
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '18px',
        padding: '0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          transition: 'transform 0.3s ease',
          transform: isDark ? 'rotate(180deg)' : 'rotate(0deg)'
        }}
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
      className="animated-theme-toggle"
      title={`Växla till ${isDark ? 'ljust' : 'mörkt'} tema`}
      aria-label={`Aktivera ${isDark ? 'ljust' : 'mörkt'} tema`}
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, #1e293b, #334155)' 
          : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        border: 'none',
        borderRadius: '25px',
        width: '50px',
        height: '26px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        padding: '2px',
        position: 'relative',
        boxShadow: isDark 
          ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
          : '0 2px 8px rgba(251, 191, 36, 0.3)'
      }}
    >
      <div
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          transition: 'transform 0.3s ease',
          transform: isDark ? 'translateX(24px)' : 'translateX(0px)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      >
        {isDark ? '🌙' : '☀️'}
      </div>
    </button>
  );
};
