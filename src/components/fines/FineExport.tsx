import React from "react";
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
    <section style={{ marginTop: 24 }}>
      <h3>Exportera böter</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: 12,
          fontSize: 14,
        }}
      >
        <thead>
          <tr style={{ background: "#f7f7f7" }}>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Spelare</th>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Belopp</th>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Anledning</th>
          </tr>
        </thead>
        <tbody>
          {fines.map((fine) => (
            <tr key={fine.id}>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{fine.playerId}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{fine.amount} kr</td>
              <td style={{ border: "1px solid #ccc", padding: "6px" }}>{fine.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleExport}>Exportera till CSV</button>
    </section>
  );
};

export default FineExport;