import React from "react";

interface Props {
  activityId: string;
  isLeader: boolean;
}

const MatchPlanView: React.FC<Props> = ({ activityId, isLeader }) => {
  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 16 }}>
      <h2>Matchplanering</h2>
      <p>
        Aktivitetens ID: <b>{activityId}</b>
      </p>
      {isLeader ? (
        <div style={{ color: "green", marginBottom: 12 }}>
          Du är ledare och kan redigera matchplanen.
        </div>
      ) : (
        <div style={{ color: "blue", marginBottom: 12 }}>
          Du kan se matchplanen, men inte redigera.
        </div>
      )}

      {/* Exempel på innehåll */}
      <ul>
        <li>Samling: 18:00</li>
        <li>Genomgång: 18:15</li>
        <li>Uppvärmning: 18:30</li>
        <li>Matchstart: 19:00</li>
      </ul>

      {isLeader && (
        <button style={{ marginTop: 18 }}>Redigera matchplan</button>
      )}
    </div>
  );
};

export default MatchPlanView;