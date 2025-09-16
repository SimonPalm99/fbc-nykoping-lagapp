import React from "react";
import { Fine } from "../../types/fine";
import { players } from "../../data/players";

const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || "Okänd";

interface Props {
  fines: Fine[];
}

const FineList: React.FC<Props> = ({ fines }) => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 520,
        margin: "0 auto",
        background: "#21252b",
        borderRadius: 12,
        overflow: "auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
        marginBottom: 30,
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          color: "#fff",
          fontFamily: "inherit",
          fontSize: 15,
        }}
      >
        <thead>
          <tr style={{ background: "#181c1e" }}>
            <th style={{ padding: "10px 2px" }}>Spelare</th>
            <th style={{ padding: "10px 2px" }}>Belopp</th>
            <th style={{ padding: "10px 2px" }}>Anledning</th>
            <th style={{ padding: "10px 2px" }}>Datum</th>
            <th style={{ padding: "10px 2px" }}>Betald</th>
          </tr>
        </thead>
        <tbody>
          {fines.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: 16, color: "#b8f27c" }}>
                Inga böter ännu
              </td>
            </tr>
          )}
          {fines.map((fine) => (
            <tr key={fine.id} style={{ background: "#23272f" }}>
              <td style={{ padding: "8px 2px" }}>{getPlayerName(fine.playerId)}</td>
              <td style={{ padding: "8px 2px" }}>{fine.amount} kr</td>
              <td style={{ padding: "8px 2px" }}>{fine.reason}</td>
              <td style={{ padding: "8px 2px" }}>{fine.date}</td>
              <td style={{ padding: "8px 2px", color: fine.paid ? "#b8f27c" : "#ff6464" }}>
                {fine.paid ? "Ja" : "Nej"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        @media (max-width: 600px) {
          div {
            overflow-x: auto;
          }
          table, thead, tbody, th, td, tr {
            display: block;
          }
          th, td {
            padding: 12px 4px;
            min-width: 120px;
          }
          thead {
            display: none;
          }
          tr {
            margin-bottom: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default FineList;