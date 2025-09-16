import React from "react";
import { User } from "../../types/user";

interface Props {
  user: User;
}

const ProfileCard: React.FC<Props> = ({ user }) => (
  <div
    style={{
      background: "#22272e",
      borderRadius: 12,
      maxWidth: 500,
      margin: "16px auto",
      padding: 18,
      color: "#fff",
      fontFamily: "inherit",
      boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
    }}
  >
    <h2 style={{ color: "#b8f27c", fontSize: 20, margin: 0, textAlign: "center" }}>
      {user.name} – #{user.jerseyNumber} ({user.role})
    </h2>
    <div style={{ marginTop: 12 }}>
      <b>Email:</b> {user.email}
    </div>
    <div style={{ marginTop: 4 }}>
      <b>ICE-kontakt:</b> {user.iceContacts[0]?.name} ({user.iceContacts[0]?.relation}), {user.iceContacts[0]?.phone}
    </div>
    <div style={{ marginTop: 4 }}>
      <b>Om mig:</b> {user.about || <i>Ej ifyllt</i>}
    </div>
    <div style={{ marginTop: 10, fontWeight: 600, color: user.isApproved ? "#b8f27c" : "#e66" }}>
      {user.isApproved ? "✔️ Godkänd" : "⏳ Väntar på godkännande"}
    </div>
    <style>{`
      @media (max-width: 600px) {
        div {
          padding: 8px;
          border-radius: 0;
          max-width: 99vw;
        }
        h2 {
          font-size: 16px;
        }
      }
    `}</style>
  </div>
);

export default ProfileCard;