import React from "react";
import { useStatistics } from "../../context/StatisticsContext";
import { useUser } from "../../context/UserContext";

const MVP: React.FC = () => {
  const { users } = useUser();
  const { getSummaryForUser } = useStatistics();

  // MVP = flest mål + assist
  const mvp = users
    .map(u => ({ ...getSummaryForUser(u.id), name: u.name }))
    .sort((a, b) => b.goals + b.assists - (a.goals + a.assists))[0];

  if (!mvp) return <div>Ingen MVP än.</div>;

  return (
    <section style={{ background: "#353", color: "#fff", padding: 16, borderRadius: 10, margin: "18px 0" }}>
      <h3>MVP just nu</h3>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{mvp.name}</div>
      <div>Mål: {mvp.goals}, Assist: {mvp.assists}, Matcher: {mvp.gamesPlayed}</div>
    </section>
  );
};

export default MVP;