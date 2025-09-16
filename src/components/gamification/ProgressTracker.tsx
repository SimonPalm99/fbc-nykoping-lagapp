import React from 'react';

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

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-500',
          text: 'text-green-600',
          bgLight: 'bg-green-100'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500',
          text: 'text-purple-600',
          bgLight: 'bg-purple-100'
        };
      case 'orange':
        return {
          bg: 'bg-orange-500',
          text: 'text-orange-600',
          bgLight: 'bg-orange-100'
        };
      case 'red':
        return {
          bg: 'bg-red-500',
          text: 'text-red-600',
          bgLight: 'bg-red-100'
        };
      default:
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-600',
          bgLight: 'bg-blue-100'
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          height: 'h-2',
          text: 'text-xs',
          padding: 'p-2'
        };
      case 'lg':
        return {
          height: 'h-4',
          text: 'text-base',
          padding: 'p-4'
        };
      default:
        return {
          height: 'h-3',
          text: 'text-sm',
          padding: 'p-3'
        };
    }
  };

  const colorClasses = getColorClasses(color);
  const sizeClasses = getSizeClasses(size);

  return (
    <div className={`${sizeClasses.padding} bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`font-medium text-gray-900 dark:text-white ${sizeClasses.text}`}>
          {label}
        </span>
        <div className="flex items-center gap-2">
          {showPercentage && (
            <span className={`${colorClasses.text} font-semibold ${sizeClasses.text}`}>
              {Math.round(percentage)}%
            </span>
          )}
          {isComplete && (
            <span className="text-green-500 text-sm">✓</span>
          )}
        </div>
      </div>
      
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses.height} overflow-hidden`}>
        <div 
          className={`${colorClasses.bg} ${sizeClasses.height} rounded-full transition-all duration-500 ease-out ${
            animated ? 'animate-pulse' : ''
          } ${isComplete ? 'animate-bounce' : ''}`}
          style={{ width: `${percentage}%` }}
        >
          {animated && (
            <div className="w-full h-full bg-white opacity-30 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <span className={`text-gray-500 ${sizeClasses.text}`}>
          {current.toLocaleString()} av {target.toLocaleString()}
        </span>
        {!isComplete && (
          <span className={`text-gray-400 ${sizeClasses.text}`}>
            {(target - current).toLocaleString()} kvar
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
