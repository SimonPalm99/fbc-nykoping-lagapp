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
      style={{
        background: styles.cardBackground,
        borderRadius: "1.2rem",
        boxShadow: "0 4px 16px rgba(46, 125, 50, 0.18)",
        border: `2px solid ${styles.primaryGreen}`,
        padding: "1.2rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.7rem",
        cursor: "pointer",
        transition: "box-shadow 0.2s, border 0.2s",
        position: "relative"
      }}
      onClick={e => {
        if ((e.target as HTMLElement).tagName !== "BUTTON") navigate("/activities");
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
        <span style={{ fontWeight: "700", fontSize: "1.1rem", color: styles.textPrimary }}>{activity.title}</span>
        {activity.important && (
          <span style={{
            background: styles.gradients.gold,
            color: "white",
            padding: "0.15rem 0.5rem",
            borderRadius: "10px",
            fontSize: "0.85rem",
            fontWeight: "600"
          }}>
            ⭐ Viktigt
          </span>
        )}
      </div>
      <div style={{ color: styles.textSecondary, fontSize: "0.98rem" }}>
        {activity.location} • {activity.date} kl {activity.startTime}
      </div>
      {activity.gatheringTime && (
        <div style={{ color: styles.primaryGreen, fontWeight: 700, fontSize: "1.05rem", marginTop: "0.3rem" }}>
          Samlingstid: {activity.gatheringTime}
        </div>
      )}
      <div style={{ display: "flex", gap: "0.7rem", marginTop: "0.5rem" }}>
        {onCheckIn && (
          <button
            onClick={e => {
              e.stopPropagation();
              onCheckIn();
            }}
            className="fbc-btn"
            style={{
              background: styles.primaryGreen,
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.35rem 0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
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
            className="fbc-btn"
            style={{
              background: styles.primaryGreen,
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.35rem 0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
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
            className="fbc-btn fbc-btn-logout"
            style={{
              background: "#e53935",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.35rem 0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
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
