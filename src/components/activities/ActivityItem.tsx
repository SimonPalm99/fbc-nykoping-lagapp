import React from "react";
import { Activity } from "../../types/activity";
import { useTheme } from "../../context/ThemeContext";

interface Props {
  activity: Activity;
  onClick?: () => void;
  showParticipants?: boolean;
  userId?: string;
}

const ActivityItem: React.FC<Props> = ({ 
  activity, 
  onClick, 
  showParticipants = false, 
  userId
}) => {
  const { isDark } = useTheme();
  const currentUserParticipation = userId ? 
    activity.participants.find(p => p.userId === userId) : null;
  
  const attendingCount = activity.participants.filter(p => p.status === "attending").length;
  const absentCount = activity.participants.filter(p => p.status === "absent").length;
  const notRespondedCount = activity.participants.filter(p => p.status === "not_responded").length;

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      "träning": "🏒",
      "match": "🥅",
      "cup": "🏆",
      "lagfest": "🎉",
      "styrketräning": "💪",
      "taktikträning": "📋",
      "målvaktsträning": "🥅",
      "möte": "💼",
      "annat": "📅"
    };
    return icons[type] || "📅";
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "attending": return "#48bb78";
      case "absent": return "#f56565";
      case "maybe": return "#ed8936";
      case "not_responded": return "#a0aec0";
      default: return "#a0aec0";
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case "attending": return "Kommer";
      case "absent": return "Frånvarande";
      case "maybe": return "Kanske";
      case "not_responded": return "Inte svarat";
      default: return "Okänd";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Idag";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Imorgon";
    } else {
      return date.toLocaleDateString('sv-SE', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div
      className={`activity-item-card ${isDark ? 'dark' : ''} ${activity.canceled ? 'canceled' : ''} ${activity.important ? 'important' : ''}`}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {/* Header med typ och titel */}
      <div className="activity-item-header">
        <div className="activity-item-title-section">
          <span className="activity-type-icon">
            {getTypeIcon(activity.type)}
          </span>
          <div className="activity-title-container">
            <div className="activity-title" style={{ color: activity.color || '#3b82f6' }}>
              {activity.title}
            </div>
            <div className="activity-type-label">
              {activity.type}
            </div>
          </div>
        </div>

        {/* Status badges */}
        <div className="activity-badges">
          {activity.important && (
            <span className="badge badge-important">
              VIKTIGT
            </span>
          )}
          {activity.canceled && (
            <span className="badge badge-canceled">
              INSTÄLLD
            </span>
          )}
          {activity.tags && activity.tags.map(tag => (
            <span key={tag} className="badge badge-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Tid och plats */}
      <div className="activity-datetime">
        <span className="activity-date">{formatDate(activity.date)}</span>
        {activity.startTime && (
          <span className="activity-time">
            {' '}kl {activity.startTime}{activity.endTime && <>–{activity.endTime}</>}
          </span>
        )}
        {activity.location && (
          <span className="activity-location">
            {' '}@ <span className="location-name">{activity.location}</span>
          </span>
        )}
      </div>

      {/* Beskrivning */}
      {activity.description && (
        <div className="activity-description">
          {activity.description}
        </div>
      )}

      {/* Användarens deltagandestatus */}
      {currentUserParticipation && (
        <div 
          className={`user-participation-status status-${currentUserParticipation.status}`}
          style={{ '--status-color': getStatusColor(currentUserParticipation.status) } as React.CSSProperties}
        >
          <div className="status-indicator"></div>
          <span className="status-text">
            Din status: {getStatusText(currentUserParticipation.status)}
          </span>
          {currentUserParticipation.absenceReason && (
            <span className="absence-reason">
              ({currentUserParticipation.absenceReason})
            </span>
          )}
        </div>
      )}

      {/* Deltagarstatistik */}
      {showParticipants && activity.participants.length > 0 && (
        <div className="participation-stats">
          <span className="stat stat-attending">✓ {attendingCount} kommer</span>
          <span className="stat stat-absent">✗ {absentCount} frånvarande</span>
          {notRespondedCount > 0 && (
            <span className="stat stat-not-responded">? {notRespondedCount} inte svarat</span>
          )}
        </div>
      )}

      {/* Länkar och extra info */}
      <div className="activity-footer">
        {activity.mapUrl && (
          <a
            href={activity.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="activity-link"
            onClick={e => e.stopPropagation()}
          >
            📍 Karta
          </a>
        )}
        {activity.absenceDeadline && (
          <span className="deadline-warning">
            ⏰ Sista anmälan: {new Date(activity.absenceDeadline).toLocaleDateString('sv-SE')}
          </span>
        )}
      </div>
    </div>
  );
};

export default ActivityItem;