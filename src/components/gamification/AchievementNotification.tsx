import React, { useState, useEffect } from 'react';

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
        return 'from-blue-500 to-blue-700 border-blue-300';
      case 'epic':
        return 'from-purple-500 to-purple-700 border-purple-300';
      case 'legendary':
        return 'from-yellow-500 to-yellow-700 border-yellow-300 shadow-2xl animate-pulse';
      default:
        return 'from-gray-500 to-gray-700 border-gray-300';
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
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
          transform transition-all duration-500 ease-out
          ${isAnimating ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        `}
      >
        <div
          className={`
            relative overflow-hidden
            bg-gradient-to-r ${getRarityClasses(achievement.rarity)}
            text-white rounded-lg shadow-2xl border-2
            p-4 max-w-sm w-80
            ${achievement.rarity === 'legendary' ? 'animate-bounce' : ''}
          `}
        >
          {/* Sparkle animation for legendary */}
          {achievement.rarity === 'legendary' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          )}
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-gray-200 text-xl font-bold"
          >
            ×
          </button>
          
          {/* Content */}
          <div className="flex items-start gap-3">
            <div className="text-4xl animate-bounce">
              {achievement.icon}
            </div>
            
            <div className="flex-1">
              <div className="text-xs uppercase font-bold mb-1 opacity-90">
                {getRarityText(achievement.rarity)}
              </div>
              
              <h3 className="font-bold text-lg mb-1">
                {achievement.title}
              </h3>
              
              <p className="text-sm opacity-90 mb-2">
                {achievement.description}
              </p>
              
              <div className="flex items-center gap-2">
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-semibold">
                  +{achievement.xp} XP
                </span>
                <span className="text-xs opacity-75">
                  🎉 Grattis!
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-20">
            <div
              className="h-full bg-white transition-all duration-300 ease-linear"
              style={{
                width: isAnimating ? '0%' : '100%',
                transitionDuration: `${duration}ms`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;
