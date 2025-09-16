import React from 'react';
import { Badge, Milestone } from '../../types/auth';

interface BadgeDisplayProps {
  badges: Badge[];
  milestones: Milestone[];
  compact?: boolean;
  showProgress?: boolean;
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badges,
  milestones,
  compact = false,
  showProgress = true
}) => {
  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return '#ffd700';
      case 'epic': return '#9333ea';
      case 'rare': return '#2563eb';
      default: return '#6b7280';
    }
  };

  const getMilestoneProgress = (milestone: Milestone) => {
    if (milestone.achieved) return 100;
    
    // Här skulle vi koppla till faktisk användardata
    // För nu returnerar vi mock-data
    switch (milestone.type) {
      case 'training_count':
        return Math.min((50 / milestone.target) * 100, 100);
      case 'match_count':
        return Math.min((12 / milestone.target) * 100, 100);
      case 'goal_count':
        return Math.min((8 / milestone.target) * 100, 100);
      default:
        return 0;
    }
  };

  return (
    <div className="badge-display">
      {/* Badges Sektion */}
      <div className="badges-section">
        <h4 className="section-title">
          🏆 Badges ({badges.length})
        </h4>
        
        {badges.length === 0 ? (
          <div className="empty-state">
            <p>Inga badges än. Träna flitigt för att låsa upp prestationer!</p>
          </div>
        ) : (
          <div className={`badges-grid ${compact ? 'compact' : ''}`}>
            {badges.map((badge) => (
              <div 
                key={badge.id}
                className="badge-item"
                style={{ borderColor: getRarityColor(badge.rarity) }}
                title={badge.description}
              >
                <div className="badge-icon" style={{ color: badge.color }}>
                  {badge.icon}
                </div>
                {!compact && (
                  <>
                    <h5 className="badge-name">{badge.name}</h5>
                    <p className="badge-description">{badge.description}</p>
                    <span className="badge-date">
                      {new Date(badge.earnedDate).toLocaleDateString('sv-SE')}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Milstolpar Sektion */}
      <div className="milestones-section">
        <h4 className="section-title">
          🎯 Milstolpar ({milestones.filter(m => m.achieved).length}/{milestones.length})
        </h4>
        
        <div className="milestones-list">
          {milestones.map((milestone) => {
            const progress = getMilestoneProgress(milestone);
            
            return (
              <div 
                key={milestone.id}
                className={`milestone-item ${milestone.achieved ? 'achieved' : ''}`}
              >
                <div className="milestone-header">
                  <div className="milestone-icon">
                    {milestone.icon}
                  </div>
                  <div className="milestone-info">
                    <h5 className="milestone-name">{milestone.name}</h5>
                    <p className="milestone-description">{milestone.description}</p>
                  </div>
                  <div className="milestone-status">
                    {milestone.achieved ? (
                      <span className="achieved-badge">✓ Uppnådd</span>
                    ) : (
                      <span className="progress-text">{Math.round(progress)}%</span>
                    )}
                  </div>
                </div>
                
                {showProgress && !milestone.achieved && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                
                {milestone.achieved && milestone.achievedAt && (
                  <span className="achievement-date">
                    Uppnådd: {new Date(milestone.achievedAt).toLocaleDateString('sv-SE')}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .badge-display {
            padding: 1rem;
            background: var(--card-background);
            border-radius: 12px;
            border: 1px solid var(--border-color);
          }

          .section-title {
            font-size: 1.125rem;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0 0 1rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .badges-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .badges-grid.compact {
            grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
          }

          .badge-item {
            padding: 1rem;
            background: var(--background);
            border: 2px solid var(--border-color);
            border-radius: 12px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .badge-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }

          .badge-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
          }

          .badge-name {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0 0 0.25rem 0;
          }

          .badge-description {
            font-size: 0.75rem;
            color: var(--text-secondary);
            margin: 0 0 0.5rem 0;
            line-height: 1.3;
          }

          .badge-date {
            font-size: 0.75rem;
            color: var(--text-muted);
          }

          .milestones-list {
            display: grid;
            gap: 1rem;
          }

          .milestone-item {
            padding: 1rem;
            background: var(--background);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            transition: all 0.3s ease;
          }

          .milestone-item.achieved {
            background: var(--success-background);
            border-color: var(--success-color);
          }

          .milestone-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 0.5rem;
          }

          .milestone-icon {
            font-size: 1.5rem;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--primary-background);
            border-radius: 8px;
          }

          .milestone-info {
            flex: 1;
          }

          .milestone-name {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0 0 0.25rem 0;
          }

          .milestone-description {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin: 0;
          }

          .milestone-status {
            text-align: right;
          }

          .achieved-badge {
            background: var(--success-color);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
          }

          .progress-text {
            color: var(--text-secondary);
            font-weight: 600;
          }

          .progress-bar {
            height: 6px;
            background: var(--border-color);
            border-radius: 3px;
            overflow: hidden;
            margin-top: 0.5rem;
          }

          .progress-fill {
            height: 100%;
            background: var(--primary-color);
            transition: width 0.3s ease;
          }

          .achievement-date {
            font-size: 0.75rem;
            color: var(--text-muted);
            font-style: italic;
          }

          .empty-state {
            text-align: center;
            padding: 2rem;
            color: var(--text-secondary);
          }

          .empty-state p {
            margin: 0;
          }

          @media (max-width: 768px) {
            .badges-grid {
              grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            }
            
            .milestone-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.5rem;
            }
            
            .milestone-status {
              align-self: flex-end;
              text-align: left;
            }
          }
        `
      }} />
    </div>
  );
};

export default BadgeDisplay;
