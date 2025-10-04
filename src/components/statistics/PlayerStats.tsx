import React from "react";
import { useStatistics } from "../../context/StatisticsContext";
import { useUser } from "../../context/UserContext";
import styles from "./PlayerStats.module.css";

const PlayerStats: React.FC<{ userId: string }> = ({ userId }) => {
  const { getSummaryForUser } = useStatistics();
  const { users } = useUser();
  const user = users.find(u => u.id === userId);

  if (!user) return <div>Spelare saknas.</div>;

  const stats = getSummaryForUser(userId);

  return (
    <section className={styles["player-stats-section"]}>
      <h3>{user.name} – Statistik</h3>
      <ul>
        <li>Mål: {stats.goals}</li>
        <li>Assist: {stats.assists}</li>
        <li>Skott: {stats.shots}</li>
        <li>Räddningar: {stats.saves}</li>
        <li>Blockar: {stats.blocks}</li>
        <li>Utvisningar: {stats.penalties}</li>
        <li>Matcher/träningar: {stats.gamesPlayed}</li>
      </ul>
    </section>
  );
};

export default PlayerStats;