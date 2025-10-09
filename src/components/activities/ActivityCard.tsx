
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity } from "../../types/activity";

interface ActivityCardProps {
  activity: Activity;
  styles: any;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  onAbsence?: () => void;
  expandable?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, styles, onCheckIn, onCheckOut, onAbsence, expandable }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName !== "BUTTON") {
      if (expandable) setExpanded((prev) => !prev);
      else navigate("/activities");
    }
  };
  return (
    <div
      key={activity.id}
      className={styles.kort + (expanded ? " " + styles.expanded : "") + " " + styles.kortPointer}
      onClick={handleCardClick}
    >
      <div className={styles.rubrikrad}>
        <span className={styles.rubrik}>{activity.title}</span>
        {activity.important && (
          <span className={styles.viktigt}>
            ⭐ Viktigt
          </span>
        )}
      </div>
      <div className={styles.info}>
        {activity.location} • {activity.date} kl {activity.startTime}
      </div>
      {activity.gatheringTime && (
        <div className={styles.samlingstid}>
          Samlingstid: {activity.gatheringTime}
        </div>
      )}
      <div className={styles.knapprad}>
        {onCheckIn && (
          <button
            onClick={e => {
              e.stopPropagation();
              onCheckIn();
            }}
            className={styles.knapp}
            aria-label="Checka in"
          >
            Checka in
          </button>
        )}
        {onCheckOut && (
          <button
            onClick={e => {
              e.stopPropagation();
              onCheckOut();
            }}
            className={styles.knapp}
            aria-label="Checka ut"
          >
            Checka ut
          </button>
        )}
        {onAbsence && (
          <button
            onClick={e => {
              e.stopPropagation();
              onAbsence();
            }}
            className={`${styles.knapp} ${styles['knapp-logout']}`}
            aria-label="Anmäl frånvaro för aktivitet"
          >
            Frånvaro
          </button>
        )}
      </div>
      {expanded && (
        <div className={styles.activityCardExpanded}>
          {/* Visa mer info, t.ex. laguttagning och matchinfo */}
          {activity.matchInfo && (
            <div className={styles.activityCardMatchInfo}>
              <div className={styles.activityCardMatchInfoTitle}>Matchinfo</div>
              <div className={styles.activityCardMatchInfoText}>{activity.matchInfo}</div>
            </div>
          )}
          {activity.lineup && (
            <div className={styles.activityCardLineupRow}>
              <div className={styles.activityCardLineupTitle}>Laguttagning</div>
              {/* Hantera olika laguppställningsstrukturer */}
              {/* Hantera laguppställning som objekt med grupper */}
              {activity.lineup && typeof activity.lineup === 'object' && (
                Object.entries(activity.lineup).map(([group, players]) => (
                  Array.isArray(players) && players.length > 0 ? (
                    <div key={group}>
                      <div className={styles.activityCardLineupTitle}>{group}</div>
                      {players.map((player, idx) => (
                        <div key={idx} className={styles.activityCardLineupCol}>{player}</div>
                      ))}
                    </div>
                  ) : null
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
