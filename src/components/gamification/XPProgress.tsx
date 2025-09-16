import React from "react";

interface Props {
  userId: string;
}

const XPProgress: React.FC<Props> = ({ userId }) => {
  // Här kan du hämta/anpassa XP-data baserat på userId
  // Nedan är statiskt exempel
  const xp = 1234;
  const xpForNextLevel = 1500;
  const percent = Math.min((xp / xpForNextLevel) * 100, 100);

  return (
    <section>
      <h3>XP-progress för {userId}</h3>
      <div>
        <span>Poäng: {xp} / {xpForNextLevel}</span>
        <div style={{
          background: "#eee",
          borderRadius: 8,
          height: 20,
          marginTop: 8,
          marginBottom: 4,
          width: 300,
          overflow: "hidden"
        }}>
          <div style={{
            background: "#1976d2",
            width: `${percent}%`,
            height: "100%",
            transition: "width .3s"
          }}></div>
        </div>
        <span>{percent.toFixed(1)}%</span>
      </div>
    </section>
  );
};

export default XPProgress;