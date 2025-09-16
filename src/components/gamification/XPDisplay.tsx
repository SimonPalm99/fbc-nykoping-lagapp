import React, { useState, useEffect } from 'react';

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
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-3',
          level: 'text-lg',
          xp: 'text-sm',
          progress: 'h-2'
        };
      case 'lg':
        return {
          container: 'p-6',
          level: 'text-3xl',
          xp: 'text-lg',
          progress: 'h-4'
        };
      default:
        return {
          container: 'p-4',
          level: 'text-2xl',
          xp: 'text-base',
          progress: 'h-3'
        };
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'gaming':
        return {
          container: 'bg-gradient-to-br from-gray-900 to-black text-green-400 border-green-500',
          level: 'text-yellow-400',
          progress: 'bg-green-500',
          progressBg: 'bg-gray-800'
        };
      case 'minimal':
        return {
          container: 'bg-white border-gray-200 text-gray-800',
          level: 'text-blue-600',
          progress: 'bg-blue-500',
          progressBg: 'bg-gray-200'
        };
      default:
        return {
          container: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white',
          level: 'text-blue-600 dark:text-blue-400',
          progress: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
          progressBg: 'bg-gray-200 dark:bg-gray-700'
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const themeClasses = getThemeClasses();

  return (
    <div className={`${sizeClasses.container} ${themeClasses.container} rounded-lg border shadow-sm relative overflow-hidden`}>
      {/* Recent XP gain animation */}
      {animateGain && recentGain > 0 && (
        <div className="absolute top-2 right-2 pointer-events-none">
          <div className="animate-bounce text-green-500 font-bold text-lg">
            +{recentGain} XP
          </div>
        </div>
      )}

      {/* Level display */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className={`${sizeClasses.level} font-bold ${themeClasses.level}`}>
            Level {level}
          </span>
          {theme === 'gaming' && (
            <span className="text-green-400 text-sm animate-pulse">⚡</span>
          )}
        </div>
        
        <div className="text-right">
          <div className={`${sizeClasses.xp} font-semibold`}>
            {displayXP.toLocaleString()} XP
          </div>
          <div className="text-xs text-gray-500">
            {xpToNext.toLocaleString()} till nästa
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className={`w-full ${themeClasses.progressBg} rounded-full ${sizeClasses.progress} overflow-hidden relative`}>
        <div 
          className={`${themeClasses.progress} ${sizeClasses.progress} rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          
          {/* Progress shine effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 w-full"
            style={{
              transform: 'translateX(-100%)',
              animation: 'shimmer 2s infinite'
            }}
          ></div>
        </div>
      </div>

      {/* Level progress indicator */}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span>Level {level}</span>
        <span>{Math.round(percentage)}%</span>
        <span>Level {level + 1}</span>
      </div>

      {/* Gaming theme extras */}
      {theme === 'gaming' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1 left-1 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute bottom-1 right-1 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default XPDisplay;
