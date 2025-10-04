import React from "react";
import { useNavigate } from "react-router-dom";
import { Activity } from "../../types/activity";

interface ActivityCardProps {
  activity: Activity;
  styles: any;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  onAbsence?: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, styles, onCheckIn, onCheckOut, onAbsence }) => {
  const navigate = useNavigate();
  return (
    <div
      key={activity.id}
      className={styles.kort}
      onClick={e => {
        if ((e.target as HTMLElement).tagName !== "BUTTON") navigate("/activities");
      }}
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
    </div>
  );
};

export default ActivityCard;
