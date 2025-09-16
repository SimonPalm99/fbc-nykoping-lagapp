import React from "react";
import { Fine } from "../../types/fine";

const FinesTable: React.FC<{ fines: Fine[] }> = ({ fines }) => (
  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
    {fines.length === 0 && <li>Inga böter ännu.</li>}
    {fines.map((fine) => (
      <li
        key={fine.id}
        style={{
          background: "#22272e",
          borderRadius: 9,
          marginBottom: 11,
          padding: "9px 13px",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          fontSize: 16,
          opacity: fine.paid ? 0.6 : 1,
          borderLeft: fine.paid ? "7px solid #b8f27c" : "7px solid #e66",
        }}
      >
        <div>
          <b>{fine.type.name}</b> • {fine.amount} kr
          <span style={{ marginLeft: 10, color: fine.paid ? "#b8f27c" : "#e66", fontWeight: 700 }}>
            {fine.paid ? "Betald" : "Obetald"}
          </span>
        </div>
        <div style={{ fontSize: 14, color: "#b8f27c", marginTop: 2 }}>
          {fine.reason}
        </div>
        <div style={{ fontSize: 13, color: "#bbb", marginTop: 1 }}>
          Spelare: {fine.playerId} | {fine.date} | Skapad av: {fine.createdBy}
        </div>
      </li>
    ))}
    <style>{`
      @media (max-width: 600px) {
        li, input, select, button { font-size: 15px !important; }
        ul { padding-left: 0 !important; }
      }
    `}</style>
  </ul>
);

export default FinesTable;