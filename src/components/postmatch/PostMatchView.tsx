import React from "react";

interface Props {
  activityId: string;
  isLeader: boolean;
  userId: string;
}

const PostMatchView: React.FC<Props> = ({ activityId, isLeader, userId }) => {
  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 16 }}>
      <h2>Eftermatch & Reflektion</h2>
      <p>
        Aktivitetens ID: <b>{activityId}</b>
      </p>
      <p>
        Användarens ID: <b>{userId}</b>
      </p>
      <p>
        {isLeader ? (
          <span style={{ color: "green" }}>
            Du har ledarbehörighet för denna aktivitet.
          </span>
        ) : (
          <span style={{ color: "blue" }}>
            Du är deltagare på denna aktivitet.
          </span>
        )}
      </p>
      {/* Lägg till formulär, reflektioner eller feedback här */}
      <div style={{ marginTop: 30 }}>
        <textarea
          rows={5}
          style={{ width: "100%" }}
          placeholder="Skriv dina reflektioner om matchen här..."
        />
        <button style={{ marginTop: 10 }}>Spara reflektion</button>
      </div>
      {isLeader && (
        <div style={{ marginTop: 24 }}>
          <button style={{ background: "#faad14", color: "#222", padding: "8px 18px", borderRadius: 6 }}>
            Se allas reflektioner (ledare)
          </button>
        </div>
      )}
    </div>
  );
};

export default PostMatchView;