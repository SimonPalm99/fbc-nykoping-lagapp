import React from "react";
import "./MatchPlanView.css";

interface Props {
  activityId: string;
  isLeader: boolean;
}

const MatchPlanView: React.FC<Props> = ({ activityId, isLeader }) => {
  return (
    <div className="matchplan-container">
      <h2>Matchplanering</h2>
      <p>
        Aktivitetens ID: <b>{activityId}</b>
      </p>
      {isLeader ? (
        <div className="matchplan-leader">
          Du är ledare och kan redigera matchplanen.
        </div>
      ) : (
        <div className="matchplan-viewer">
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
        <>
          <button className="edit-matchplan-btn">Redigera matchplan</button>
          <button className="edit-matchplan-btn-secondary">Redigera matchplan</button>
        </>
      )}
    </div>
  );
};

export default MatchPlanView;