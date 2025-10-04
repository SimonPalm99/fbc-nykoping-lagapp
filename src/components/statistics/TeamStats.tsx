import React from "react";
import { useStatistics } from "../../context/StatisticsContext";
import { useUser } from "../../context/UserContext";
import styles from "./TeamStats.module.css";

const TeamStats: React.FC = () => {
  const { users } = useUser();
  const { getSummaryForUser } = useStatistics();

  return (
    <section className={styles.teamstatsSection}>
      <h3>Lagstatistik – Topp 5</h3>
      <table className={styles.teamstatsTable}>
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
              <tr key={i}>
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