import React from "react";
import styles from "./MVP.module.css";
import { useStatistics } from "../../context/StatisticsContext";
import { useUser } from "../../context/UserContext";

const MVP: React.FC = () => {
  const { users } = useUser();
  const { getSummaryForUser } = useStatistics();

  // MVP = flest mål + assist
  const mvp = users
    .map(u => ({ ...getSummaryForUser(u.id), name: u.name }))
    .sort((a, b) => b.goals + b.assists - (a.goals + a.assists))[0];

  if (!mvp) return <div className={styles.tom}>Ingen MVP än.</div>;

  return (
    <section className={styles.mvpBox}>
      <h3 className={styles.mvpRubrik}>MVP just nu</h3>
      <div className={styles.mvpNamn}>{mvp.name}</div>
      <div className={styles.mvpInfo}>Mål: {mvp.goals}, Assist: {mvp.assists}, Matcher: {mvp.gamesPlayed}</div>
    </section>
  );
};

export default MVP;