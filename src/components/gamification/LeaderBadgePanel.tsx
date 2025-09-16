import React from "react";

interface Props {
  leaderId: string;
}

// Här kan du lägga till fler märken och dynamik i framtiden
const badges = [
  { icon: "🏆", name: "Superledare", description: "Har lett 50+ matcher" },
  { icon: "🎖️", name: "Mentor", description: "Har coachat nya spelare" },
  { icon: "🤝", name: "Lagspelare", description: "Har organiserat lagaktiviteter" }
];

const LeaderBadgePanel: React.FC<Props> = ({ leaderId }) => {
  // Här kan du t.ex. filtrera badges eller hämta dem asynkront i framtiden
  
  return (
    <section style={{
      background: "#f7f9fa",
      borderRadius: 8,
      padding: 20,
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      marginBottom: 24,
      maxWidth: 400
    }}>
      <h3 style={{ marginBottom: 12 }}>
        Ledarmärken för <span style={{ color: "#1976d2" }}>{leaderId}</span>
      </h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {badges.map((badge, idx) => (
          <li key={idx} style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 14,
            background: "#fff",
            borderRadius: 6,
            padding: "10px 14px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
          }}>
            <span style={{ fontSize: 28, marginRight: 14 }}>{badge.icon}</span>
            <div>
              <div style={{ fontWeight: 600 }}>{badge.name}</div>
              <div style={{ fontSize: 13, color: "#555" }}>{badge.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LeaderBadgePanel;