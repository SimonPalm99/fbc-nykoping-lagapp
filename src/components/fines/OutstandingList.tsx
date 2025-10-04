import React from "react";
import styles from "./OutstandingList.module.css";
import { Fine } from "../../types/fine";

interface Props {
  fines: Fine[];
}

const OutstandingList: React.FC<Props> = ({ fines }) => (
  <section className={styles.outstandingList}>
    <h3>Obetalda böter</h3>
    <ul className={styles.outstandingList__ul}>
      {fines.map((fine) => (
        <li key={fine.id} className={styles.outstandingList__item}>
          <div>
            <span className={styles.outstandingList__player}>{fine.playerId}</span> <span className={styles.outstandingList__reason}>({fine.reason})</span>
          </div>
          <div className={styles.outstandingList__amount}>{fine.amount} kr</div>
        </li>
      ))}
    </ul>
  </section>
);

export default OutstandingList;