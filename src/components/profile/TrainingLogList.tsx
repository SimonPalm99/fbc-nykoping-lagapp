import React from "react";
import { TrainingLog, User } from "../../types/user";

interface Props {
  user: User;
}

const TrainingLogList: React.FC<Props> = ({ user }) => {
  const logs: TrainingLog[] = user.trainingLogs || [];

  if (logs.length === 0)
    return (
      <div
        style={{
          background: "#252c36",
          color: "#b8f27c",
          borderRadius: 8,
          padding: 12,
          margin: "16px auto",
          textAlign: "center",
        }}
      >
        Inga träningsloggar än.
      </div>
    );

  return (
    <section
      style={{
        background: "#22272e",
        borderRadius: 12,
        maxWidth: 500,
        margin: "16px auto",
        padding: 18,
        color: "#fff",
        fontFamily: "inherit",
      }}
    >
      <h3 style={{ color: "#b8f27c", fontSize: 18, margin: 0 }}>Träningsloggar</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0 0" }}>
        {logs.map((log) => (
          <li
            key={log.id}
            style={{
              background: "#181c1e",
              marginBottom: 10,
              borderRadius: 7,
              padding: "8px 12px",
              fontSize: 15,
            }}
          >
            <div style={{ fontWeight: 600 }}>{log.date}</div>
            <div>
              Känsla: <b>{log.feeling}</b>
              {log.note && (
                <span style={{ marginLeft: 8, color: "#b8f27c" }}>– {log.note}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <style>{`
        @media (max-width: 600px) {
          section {
            padding: 8px;
            border-radius: 0;
            max-width: 99vw;
          }
          h3 {
            font-size: 16px;
          }
          li {
            font-size: 14px;
            padding: 6px 4px;
          }
        }
      `}</style>
    </section>
  );
};

export default TrainingLogList;