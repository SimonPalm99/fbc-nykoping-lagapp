import React from "react";
import styles from "./FineExport.module.css";
import { Fine } from "../../types/fine";

interface Props {
  fines: Fine[];
}

const FineExport: React.FC<Props> = ({ fines }) => {
  const handleExport = () => {
    const header = "ID,Spelare,Belopp,Anledning\n";
    const rows = fines.map(
      (fine) =>
        `"${fine.id}","${fine.playerId}",${fine.amount},"${fine.reason}"`
    );
    const csvContent = header + rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "fines_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className={styles.fineExport}>
      <h3>Exportera böter</h3>
      <table className={styles.fineExport__table}>
        <thead>
          <tr className={styles.fineExport__theadRow}>
            <th className={styles.fineExport__th}>Spelare</th>
            <th className={styles.fineExport__th}>Belopp</th>
            <th className={styles.fineExport__th}>Anledning</th>
          </tr>
        </thead>
        <tbody>
          {fines.map((fine) => (
            <tr key={fine.id}>
              <td className={styles.fineExport__td}>{fine.playerId}</td>
              <td className={styles.fineExport__td}>{fine.amount} kr</td>
              <td className={styles.fineExport__td}>{fine.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleExport} className={styles.fineExport__exportBtn}>Exportera till CSV</button>
    </section>
  );
};

export default FineExport;