
import React from "react";
import { Activity } from "../../types/activity";
import { useTheme } from "../../context/ThemeContext";
import styles from "./ActivityItem.module.css";

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

  // Status color is now handled by CSS var in module

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
      className={[
        styles.activityItemCard,
        isDark ? styles.dark : '',
        activity.canceled ? styles.canceled : '',
        activity.important ? styles.important : ''
      ].join(' ')}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      {...(onClick ? { role: "button" } : {})}
    >
      {/* Header med typ och titel */}
      <div className={styles.activityItemHeader}>
        <div className={styles.activityItemTitleSection}>
          <span className={styles.activityTypeIcon}>
            {getTypeIcon(activity.type)}
          </span>
          <div className={styles.activityTitleContainer}>
            <div
              className={styles.activityTitle}
              data-color={activity.color ? activity.color : undefined}
            >
              {activity.title}
            </div>
            <div className={styles.activityTypeLabel}>
              {activity.type}
            </div>
          </div>
        </div>
        {/* Status badges */}
        <div className={styles.activityBadges}>
          {activity.important && (
            <span className={`${styles.badge} ${styles.badgeImportant}`}>
              VIKTIGT
            </span>
          )}
          {activity.canceled && (
            <span className={`${styles.badge} ${styles.badgeCanceled}`}>
              INSTÄLLD
            </span>
          )}
          {activity.tags && activity.tags.map(tag => (
            <span key={tag} className={`${styles.badge} ${styles.badgeTag}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      {/* Tid och plats */}
      <div className={styles.activityDatetime}>
        <span>{formatDate(activity.date)}</span>
        {activity.startTime && (
          <span className={styles.activityTime}>
            {' '}kl {activity.startTime}{activity.endTime && <>–{activity.endTime}</>}
          </span>
        )}
        {activity.location && (
          <span className={styles.activityLocation}>
            {' '}@ <span className={styles.locationName}>{activity.location}</span>
          </span>
        )}
      </div>
      {/* Beskrivning */}
      {activity.description && (
        <div className={styles.activityDescription}>
          {activity.description}
        </div>
      )}
      {/* Användarens deltagandestatus */}
      {currentUserParticipation && (
        <div
          className={[
            styles.userParticipationStatus,
            `status-${currentUserParticipation.status}`
          ].join(' ')}
        >
          <div className={styles.statusIndicator}></div>
          <span className={styles.statusText}>
            Din status: {getStatusText(currentUserParticipation.status)}
          </span>
          {currentUserParticipation.absenceReason && (
            <span className={styles.absenceReason}>
              ({currentUserParticipation.absenceReason})
            </span>
          )}
        </div>
      )}
      {/* Deltagarstatistik */}
      {showParticipants && activity.participants.length > 0 && (
        <div className={styles.participationStats}>
          <span className={`${styles.stat} ${styles.statAttending}`}>✓ {attendingCount} kommer</span>
          <span className={`${styles.stat} ${styles.statAbsent}`}>✗ {absentCount} frånvarande</span>
          {notRespondedCount > 0 && (
            <span className={`${styles.stat} ${styles.statNotResponded}`}>? {notRespondedCount} inte svarat</span>
          )}
        </div>
      )}
      {/* Länkar och extra info */}
      <div className={styles.activityFooter}>
        {activity.mapUrl && (
          <a
            href={activity.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.activityLink}
            onClick={e => e.stopPropagation()}
          >
            📍 Karta
          </a>
        )}
        {activity.absenceDeadline && (
          <span className={styles.deadlineWarning}>
            ⏰ Sista anmälan: {new Date(activity.absenceDeadline).toLocaleDateString('sv-SE')}
          </span>
        )}
      </div>
    </div>
  );
};

export default ActivityItem;