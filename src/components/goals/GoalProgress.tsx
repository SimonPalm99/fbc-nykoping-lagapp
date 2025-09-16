import React from 'react';
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
  
  return (
    <div style={{
      background: 'var(--card-background)',
      borderRadius: '16px',
      padding: '1.25rem',
      border: `1px solid ${isCompleted ? goal.color + '40' : 'var(--border-color)'}`,
      boxShadow: isCompleted ? `0 4px 16px ${goal.color}20` : '0 2px 12px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      {/* Background pattern for completed goals */}
      {isCompleted && (
        <div style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 60,
          height: 60,
          background: `linear-gradient(45deg, ${goal.color}20, transparent)`,
          borderRadius: '50%',
          opacity: 0.3
        }} />
      )}
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem',
        marginBottom: '1rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${goal.color}, ${goal.color}cc)`,
          borderRadius: '50%',
          padding: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '48px',
          height: '48px',
          boxShadow: `0 4px 12px ${goal.color}30`,
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
        }}>
          <SportIcon type={goal.icon as any} size={24} color="#fff" />
        </div>
        <div>
          <div style={{
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--text-primary)',
            marginBottom: '0.25rem'
          }}>
            {goal.label}
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            fontWeight: 600
          }}>
            {goal.current} av {goal.target}
            {isCompleted && (
              <span style={{ 
                color: goal.color, 
                marginLeft: '0.5rem',
                fontSize: '0.8rem'
              }}>
                ✅ Uppnått!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        background: 'rgba(0,0,0,0.1)',
        borderRadius: '8px',
        height: '8px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          background: `linear-gradient(90deg, ${goal.color}, ${goal.color}dd)`,
          height: '100%',
          width: `${percentage}%`,
          borderRadius: '8px',
          transition: 'width 0.8s ease-out',
          boxShadow: `0 0 8px ${goal.color}40`
        }} />
        
        {/* Shimmer effect for active progress */}
        {!isCompleted && percentage > 0 && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(90deg, transparent, ${goal.color}30, transparent)`,
            animation: 'shimmer 2s infinite',
            borderRadius: '8px'
          }} />
        )}
      </div>

      {/* Progress percentage */}
      <div style={{
        textAlign: 'right',
        marginTop: '0.5rem',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: percentage >= 80 ? goal.color : 'var(--text-secondary)'
      }}>
        {Math.round(percentage)}%
      </div>
    </div>
  );
};

const GoalProgress: React.FC<GoalProgressProps> = ({ goals, loading = false }) => {
  if (loading) {
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        {[1, 2].map(i => (
          <div key={i} style={{
            background: 'var(--card-background)',
            borderRadius: '16px',
            padding: '1.25rem',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite'
              }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  width: '60%',
                  height: '1rem',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: '4px',
                  marginBottom: '0.5rem'
                }} />
                <div style={{
                  width: '40%',
                  height: '0.8rem',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: '4px'
                }} />
              </div>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '4px'
            }} />
          </div>
        ))}
      </div>
    );
  }

  const displayGoals = goals.slice(0, 4); // Show top 4 goals

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1rem'
    }}>
      {displayGoals.map((goal, index) => (
        <div 
          key={goal.id}
          style={{
            animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
          }}
        >
          <GoalProgressCard goal={goal} />
        </div>
      ))}
    </div>
  );
};

export default GoalProgress;
