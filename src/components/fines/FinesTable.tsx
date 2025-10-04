import React from "react";
import styles from "./FinesTable.module.css";
import { Fine } from "../../types/fine";

const FinesTable: React.FC<{ fines: Fine[] }> = ({ fines }) => (
  <ul className={styles.finesTable}>
    {fines.length === 0 && <li>Inga böter ännu.</li>}
    {fines.map((fine) => (
      <li
        key={fine.id}
        className={fine.paid
          ? `${styles["finesTable__item"]} ${styles["finesTable__item--paid"]}`
          : `${styles["finesTable__item"]} ${styles["finesTable__item--unpaid"]}`}
      >
        <div>
          <b>{fine.type.name}</b> • {fine.amount} kr
          <span
            className={fine.paid
              ? `${styles["finesTable__status"]} ${styles["finesTable__status--paid"]}`
              : `${styles["finesTable__status"]} ${styles["finesTable__status--unpaid"]}`}
          >
            {fine.paid ? "Betald" : "Obetald"}
          </span>
        </div>
        <div className={styles.finesTable__reason}>
          {fine.reason}
        </div>
        <div className={styles.finesTable__meta}>
          Spelare: {fine.playerId} | {fine.date} | Skapad av: {fine.createdBy}
        </div>
      </li>
    ))}
  </ul>
);

export default FinesTable;