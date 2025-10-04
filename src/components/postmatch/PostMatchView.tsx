import React from "react";
import styles from "./PostMatchView.module.css";

interface Props {
  activityId: string;
  isLeader: boolean;
  userId: string;
}

const PostMatchView: React.FC<Props> = ({ activityId, isLeader, userId }) => {
  return (
    <div className={styles["postmatch-container"]}>
      <h2>Eftermatch & Reflektion</h2>
      <p>
        Aktivitetens ID: <b>{activityId}</b>
      </p>
      <p>
        Användarens ID: <b>{userId}</b>
      </p>
      <p>
        {isLeader ? (
          <span className={styles["status-ledare"]}>
            Du har ledarbehörighet för denna aktivitet.
          </span>
        ) : (
          <span className={styles["status-deltagare"]}>
            Du är deltagare på denna aktivitet.
          </span>
        )}
      </p>
      {/* Lägg till formulär, reflektioner eller feedback här */}
      <div className={styles["reflektions-sektion"]}>
        <textarea
          rows={5}
          className={styles["reflektions-textarea"]}
          placeholder="Skriv dina reflektioner om matchen här..."
        />
        <button className={styles["reflektions-knapp"]}>Spara reflektion</button>
      </div>
      {isLeader && (
        <div className={styles["leader-section"]}>
          <button className={styles["leader-button"]}>
            Se allas reflektioner (ledare)
          </button>
        </div>
      )}
    </div>
  );
};

export default PostMatchView;