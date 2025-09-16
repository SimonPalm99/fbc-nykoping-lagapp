import React from "react";
import { Fine } from "../../types/fine";

interface Props {
  fines: Fine[];
}

const OutstandingList: React.FC<Props> = ({ fines }) => (
  <section style={{ marginBottom: 24 }}>
    <h3>Obetalda böter</h3>
    <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
      {fines.map((fine) => (
        <li
          key={fine.id}
          style={{
            background: "#fff",
            borderRadius: 8,
            marginBottom: 8,
            padding: "10px 14px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 15,
          }}
        >
          <div>
            <strong>{fine.playerId}</strong> <span style={{ color: "#888" }}>({fine.reason})</span>
          </div>
          <div style={{ fontWeight: 600, color: "#4a9d2c" }}>{fine.amount} kr</div>
        </li>
      ))}
    </ul>
  </section>
);

export default OutstandingList;