import React from "react";
import { useStatistics } from "../../context/StatisticsContext";
import { useUser } from "../../context/UserContext";

const TeamStats: React.FC = () => {
  const { users } = useUser();
  const { getSummaryForUser } = useStatistics();

  return (
    <section style={{ background: "#232323", padding: 18, borderRadius: 10, margin: "18px 0" }}>
      <h3>Lagstatistik – Topp 5</h3>
      <table style={{ width: "100%", color: "#fff", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Spelare</th>
            <th>Mål</th>
            <th>Assist</th>
            <th>Skott</th>
            <th>Block</th>
            <th>Utvisningar</th>
            <th>Matcher</th>
          </tr>
        </thead>
        <tbody>
          {users
            .map(u => ({ ...getSummaryForUser(u.id), name: u.name }))
            .sort((a, b) => b.goals - a.goals)
            .slice(0, 5)
            .map((row, i) => (
              <tr key={i} style={{ background: i === 0 ? "#354" : "inherit" }}>
                <td>{row.name}</td>
                <td>{row.goals}</td>
                <td>{row.assists}</td>
                <td>{row.shots}</td>
                <td>{row.blocks}</td>
                <td>{row.penalties}</td>
                <td>{row.gamesPlayed}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
};

export default TeamStats;