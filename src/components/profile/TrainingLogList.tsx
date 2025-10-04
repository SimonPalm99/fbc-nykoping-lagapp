import React from "react";
import styles from "./TrainingLogList.module.css";
import { TrainingLog, User } from "../../types/user";

interface Props {
  user: User;
}

const TrainingLogList: React.FC<Props> = ({ user }) => {
  const logs: TrainingLog[] = user.trainingLogs || [];

  if (logs.length === 0)
    return (
      <div className={styles["training-log-empty"]}>
        Inga träningsloggar än.
      </div>
    );

  return (
    <section className={styles["training-log-section"]}>
      <h3 className={styles["training-log-title"]}>Träningsloggar</h3>
      <ul className={styles["training-log-list"]}>
        {logs.map((log) => (
          <li
            key={log.id}
            className={styles["training-log-item"]}
          >
            <div className={styles["training-log-date"]}>{log.date}</div>
            <div>
              Känsla: <b>{log.feeling}</b>
              {log.note && (
                <span className={styles["training-log-note"]}>– {log.note}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
      {/* Responsivitet hanteras i CSS-modulen */}
    </section>
  );
};

export default TrainingLogList;