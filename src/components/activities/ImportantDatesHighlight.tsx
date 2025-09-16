import React from "react";
import { Activity } from "../../types/activity";

interface Props {
  activities: Activity[];
  selectedDate?: Date;
  onDateClick?: (date: string) => void;
}

const ImportantDatesHighlight: React.FC<Props> = ({ activities, selectedDate: _selectedDate, onDateClick }) => {
  const getImportantDates = () => {
    const importantActivities = activities.filter(activity => 
      activity.important || 
      activity.type === 'cup' || 
      activity.type === 'lagfest' ||
      activity.tags?.includes('slutspel') ||
      activity.tags?.includes('playoff') ||
      activity.tags?.includes('final')
    );

    // Gruppera efter datum och typ
    const dateGroups: Record<string, Activity[]> = {};
    importantActivities.forEach(activity => {
      if (!dateGroups[activity.date]) {
        dateGroups[activity.date] = [];
      }
      const dateGroup = dateGroups[activity.date];
      if (dateGroup) {
        dateGroup.push(activity);
      }
    });

    return Object.entries(dateGroups)
      .map(([date, activitiesOnDate]) => ({
        date,
        activities: activitiesOnDate,
        isUpcoming: new Date(date) > new Date(),
        daysUntil: Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getDateIcon = (activities: Activity[]) => {
    if (activities.some(a => a.type === 'cup')) return '🏆';
    if (activities.some(a => a.type === 'lagfest')) return '🎉';
    if (activities.some(a => a.tags?.includes('slutspel') || a.tags?.includes('playoff'))) return '🥇';
    if (activities.some(a => a.tags?.includes('final'))) return '👑';
    if (activities.some(a => a.important)) return '⭐';
    return '📅';
  };

  const getDateType = (activities: Activity[]) => {
    if (activities.some(a => a.type === 'cup')) return 'Cup';
    if (activities.some(a => a.type === 'lagfest')) return 'Lagfest';
    if (activities.some(a => a.tags?.includes('slutspel'))) return 'Slutspel';
    if (activities.some(a => a.tags?.includes('playoff'))) return 'Playoff';
    if (activities.some(a => a.tags?.includes('final'))) return 'Final';
    return 'Viktigt datum';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const importantDates = getImportantDates();
  const upcomingDates = importantDates.filter(d => d.isUpcoming).slice(0, 5);

  if (importantDates.length === 0) {
    return (
      <div className="important-dates-empty">
        <div className="empty-icon">🗓️</div>
        <p>Inga viktiga datum markerade</p>
        <small>Cuper, slutspel och lagfester visas här automatiskt</small>
      </div>
    );
  }

  return (
    <div className="important-dates-highlight">
      <h3>
        <span className="icon">⭐</span>
        Viktiga datum
      </h3>

      {upcomingDates.length > 0 && (
        <div className="upcoming-section">
          <h4>Kommande viktiga datum</h4>
          <div className="upcoming-list">
            {upcomingDates.map(({ date, activities, daysUntil }) => (
              <div 
                key={date} 
                className={`important-date-card upcoming ${daysUntil <= 7 ? 'urgent' : ''}`}
                onClick={() => onDateClick?.(date)}
              >
                <div className="date-header">
                  <span className="date-icon">{getDateIcon(activities)}</span>
                  <div className="date-info">
                    <div className="date-type">{getDateType(activities)}</div>
                    <div className="date-when">
                      {daysUntil === 0 ? 'Idag' : 
                       daysUntil === 1 ? 'Imorgon' : 
                       daysUntil <= 7 ? `Om ${daysUntil} dagar` :
                       formatDate(date)}
                    </div>
                  </div>
                  {daysUntil <= 7 && (
                    <div className="countdown">
                      {daysUntil === 0 ? 'IDAG' : `${daysUntil}d`}
                    </div>
                  )}
                </div>
                
                <div className="activities-preview">
                  {activities.map(activity => (
                    <div key={activity.id} className="activity-preview">
                      <span className="activity-time">{activity.startTime || 'Hela dagen'}</span>
                      <span className="activity-title">{activity.title}</span>
                      {activity.location && (
                        <span className="activity-location">📍 {activity.location}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="all-dates-section">
        <h4>Alla viktiga datum ({importantDates.length})</h4>
        <div className="dates-grid">
          {importantDates.map(({ date, activities, isUpcoming }) => (
            <div 
              key={date} 
              className={`important-date-mini ${!isUpcoming ? 'past' : ''}`}
              onClick={() => onDateClick?.(date)}
              title={activities.map(a => a.title).join(', ')}
            >
              <div className="mini-icon">{getDateIcon(activities)}</div>
              <div className="mini-date">
                {new Date(date).toLocaleDateString('sv-SE', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="mini-type">{getDateType(activities)}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .important-dates-highlight {
          background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
          border-radius: 12px;
          padding: 20px;
          margin: 16px 0;
          border: 2px solid #f59e0b;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
        }

        .important-dates-highlight h3 {
          margin: 0 0 16px 0;
          color: #92400e;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 700;
        }

        .important-dates-highlight h4 {
          margin: 16px 0 12px 0;
          color: #92400e;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .upcoming-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .important-date-card {
          background: white;
          border-radius: 8px;
          padding: 16px;
          border: 1px solid #fbbf24;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .important-date-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .important-date-card.urgent {
          border-color: #ef4444;
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .date-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .date-icon {
          font-size: 24px;
        }

        .date-info {
          flex: 1;
        }

        .date-type {
          font-weight: 600;
          color: #92400e;
          font-size: 14px;
        }

        .date-when {
          color: #6b7280;
          font-size: 13px;
        }

        .countdown {
          background: #ef4444;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
        }

        .activities-preview {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .activity-preview {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }

        .activity-time {
          color: #6b7280;
          font-weight: 500;
          min-width: 70px;
        }

        .activity-title {
          font-weight: 600;
          color: #374151;
        }

        .activity-location {
          color: #6b7280;
          font-size: 12px;
        }

        .dates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 8px;
        }

        .important-date-mini {
          background: white;
          border: 1px solid #fbbf24;
          border-radius: 6px;
          padding: 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 12px;
        }

        .important-date-mini:hover {
          background: #fef3c7;
          transform: translateY(-1px);
        }

        .important-date-mini.past {
          opacity: 0.6;
          border-color: #d1d5db;
        }

        .mini-icon {
          font-size: 16px;
          margin-bottom: 4px;
        }

        .mini-date {
          font-weight: 600;
          color: #374151;
          margin-bottom: 2px;
        }

        .mini-type {
          color: #6b7280;
          font-size: 10px;
          text-transform: uppercase;
        }

        .important-dates-empty {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        @media (max-width: 600px) {
          .important-dates-highlight {
            padding: 16px;
            margin: 12px 0;
          }

          .dates-grid {
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          }

          .important-date-card {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default ImportantDatesHighlight;
