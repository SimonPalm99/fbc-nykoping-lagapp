import React from "react";
import styles from "./FineList.module.css";
import { Fine } from "../../types/fine";
import { players } from "../../data/players";

const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || "Okänd";

interface Props {
  fines: Fine[];
}

const FineList: React.FC<Props> = ({ fines }) => {
  return (
    <div className={styles.fineList}>
      <table className={styles.fineList__table}>
        <thead>
          <tr className={styles.fineList__theadRow}>
            <th className={styles.fineList__th}>Spelare</th>
            <th className={styles.fineList__th}>Belopp</th>
            <th className={styles.fineList__th}>Anledning</th>
            <th className={styles.fineList__th}>Datum</th>
            <th className={styles.fineList__th}>Betald</th>
          </tr>
        </thead>
        <tbody className={styles.fineList__tbody}>
          {fines.length === 0 && (
            <tr>
              <td colSpan={5} className={styles.fineList__emptyRow}>
                Inga böter ännu
              </td>
            </tr>
          )}
          {fines.map((fine) => (
            <tr key={fine.id} className={styles.fineList__row}>
              <td className={styles.fineList__td}>{getPlayerName(fine.playerId)}</td>
              <td className={styles.fineList__td}>{fine.amount} kr</td>
              <td className={styles.fineList__td}>{fine.reason}</td>
              <td className={styles.fineList__td}>{fine.date}</td>
              <td className={fine.paid ? styles.fineList__paid : styles.fineList__unpaid}>
                {fine.paid ? "Ja" : "Nej"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FineList;