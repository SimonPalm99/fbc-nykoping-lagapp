import React from "react";
import { Fine } from "../../types/fine";

interface Props {
  fines: Fine[];
}

const TeamFundPanel: React.FC<Props> = ({ fines }) => {
  const total = fines.reduce((sum, fine) => sum + fine.amount, 0);

  return (
    <section
      style={{
        marginBottom: 24,
        background: "#e4fbe1",
        borderRadius: 8,
        padding: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        textAlign: "center",
      }}
    >
      <h3 style={{ color: "#181c1e" }}>Totalt i lagkassan</h3>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#4a9d2c",
          marginBottom: 4,
        }}
      >
        {total} kr
      </div>
      <div style={{ fontSize: 13, color: "#555" }}>
        Summering av alla utdelade böter
      </div>
    </section>
  );
};

export default TeamFundPanel;