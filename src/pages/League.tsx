import React from "react";

const teams = [
  "Djurgårdens IF IBS",
  "Farsta IBK",
  "FBC Nyköping",
  "FBC Sollentuna",
  "Huddinge IBS",
  "Hässelby SK IBK",
  "Nacka IBK",
  "Nykvarns IF Utveckling",
  "Rosersberg Arlanda IBK",
  "Värmdö IF",
  "Åkersberga IBF",
  "Älvsjö AIK IBF",
];

const columns = ["Lag", "S", "V", "O (SDV)", "F", "GM-IM", "+/-", "P", "Senaste 5"];

const League: React.FC = () => {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#14532d 0%,#22c55e 100%)", padding: "0 0 3rem 0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1rem 0 1rem" }}>
        <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "2.2rem", marginBottom: "0.7rem", letterSpacing: 1, textShadow: "0 2px 8px #14532d" }}>Liga & Tabell</h1>
        <div style={{ color: "#d1fae5", fontSize: "1.15rem", marginBottom: "2.2rem", background: "#166534", borderRadius: 12, padding: "1.1rem 1.3rem", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
          Vi väntar på rättigheter att få visa tabellen live från Svensk Innebandy. Tills vidare visas en demo-version.
        </div>
        <div style={{ background: "rgba(20,83,45,0.97)", borderRadius: 18, boxShadow: "0 4px 15px rgba(0,0,0,0.13)", padding: "1.5rem 1.2rem", overflowX: "auto", border: "1.5px solid #22c55e" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th key={col} style={{ textAlign: i === 0 ? "left" : "center", color: "#22c55e", fontWeight: 800, fontSize: "1.08rem", padding: "0.7rem 0.3rem", borderBottom: "2px solid #166534", letterSpacing: 0.5 }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teams.map((team, idx) => (
                <tr key={team} style={{ borderBottom: "1px solid #166534", background: idx % 2 === 0 ? "#14532d" : "#166534" }}>
                  <td style={{ padding: "0.7rem 0.3rem", fontWeight: 700, color: "#fff", fontSize: "1.08rem" }}>{team}</td>
                  <td style={{ textAlign: "center", color: "#d1fae5", fontWeight: 600 }}>0</td>
                  <td style={{ textAlign: "center", color: "#d1fae5", fontWeight: 600 }}>0</td>
                  <td style={{ textAlign: "center", color: "#d1fae5", fontWeight: 600 }}>0 (0)</td>
                  <td style={{ textAlign: "center", color: "#d1fae5", fontWeight: 600 }}>0</td>
                  <td style={{ textAlign: "center", color: "#d1fae5", fontWeight: 600 }}>0 - 0</td>
                  <td style={{ textAlign: "center", color: "#d1fae5", fontWeight: 600 }}>0</td>
                  <td style={{ textAlign: "center", color: "#d1fae5", fontWeight: 600 }}>0</td>
                  <td style={{ textAlign: "center", color: "#bbf7d0", fontWeight: 500 }}>saknas</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default League;
