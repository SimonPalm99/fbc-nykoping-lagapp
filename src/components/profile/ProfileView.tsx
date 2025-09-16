import React from "react";
import { User } from "../../types/user";

interface Props {
  show: User;
}

const ProfileView: React.FC<Props> = ({ show }) => (
  <section
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
    <img
      src={show.profileImageUrl || "https://placehold.co/100"}
      alt="Profilbild"
      style={{
        borderRadius: "50%",
        display: "block",
        margin: "0 auto 12px",
        objectFit: "cover",
        background: "#181c1e"
      }}
      width={100}
      height={100}
    />
    <h2 style={{ color: "#b8f27c", fontSize: 20, margin: 0, textAlign: "center" }}>
      {show.name}{" "}
  {show.role === "leader" && (
        <span style={{ fontSize: "0.8em", color: "#8fe" }}>Ledare</span>
      )}
    </h2>
    <p style={pStyle}><b>Nummer:</b> #{show.jerseyNumber}</p>
    <p style={pStyle}><b>E-post:</b> {show.email}</p>
    <p style={pStyle}><b>Födelsedag:</b> {show.birthday || <i>Ej ifyllt</i>}</p>
    <p style={pStyle}><b>Position:</b> {show.favoritePosition || <i>Ej ifyllt</i>}</p>
    <p style={pStyle}><b>Om mig:</b> {show.about || <i>Ej ifyllt</i>}</p>
    <p style={pStyle}>
      <b>ICE-kontakt:</b> {show.iceContacts[0]?.name} ({show.iceContacts[0]?.relation}), {show.iceContacts[0]?.phone}
    </p>
    <p style={pStyle}>
      <b>Badges:</b>{" "}
      {show.badges && show.badges.length > 0
        ? show.badges.map((b) => (
            <span key={b.id} style={{ marginRight: 8, background: "#b8f27c", color: "#181c1e", borderRadius: 5, padding: "2px 7px", fontSize: 13 }}>
              {b.name}
            </span>
          ))
        : <i>Inga</i>}
    </p>
    <div style={{
      marginTop: 12,
      fontWeight: 600,
      color: show.isApproved ? "#b8f27c" : "#e66",
      textAlign: "center"
    }}>
      {show.isApproved ? "✔️ Godkänd" : "⏳ Väntar på godkännande"}
    </div>
    <style>{`
      @media (max-width: 600px) {
        section {
          padding: 8px;
          border-radius: 0;
          max-width: 99vw;
        }
        h2 {
          font-size: 16px;
        }
        img {
          width: 60px !important;
          height: 60px !important;
        }
        p {
          font-size: 15px !important;
        }
      }
    `}</style>
  </section>
);

const pStyle: React.CSSProperties = {
  margin: "7px 0 0 0"
};

export default ProfileView;