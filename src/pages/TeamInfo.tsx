import React, { useEffect, useState } from "react";
import { usersAPI } from "../services/apiService";
import { User } from "../types/user";

const TeamInfo: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    usersAPI.getAllUsers().then(res => {
      if (res.success) setUsers(res.data);
    });
  }, []);

  const ledare = users.filter(u => u.role === "leader");
  const spelare = users.filter(u => u.role === "player");

  const ProfileCard = (user: User) => (
    <div key={user.id} style={{
      background: "rgba(16,32,16,0.97)",
      borderRadius: "1.2rem",
      boxShadow: "0 2px 12px #22c55e22",
      padding: "1.2rem",
      marginBottom: "1.2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.7rem",
      textAlign: "center",
      color: "#F1F8E9"
    }}>
      <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#14532d", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.7rem", overflow: "hidden" }}>
        {user?.profileImageUrl ? (
          <img src={user.profileImageUrl} alt="Profilbild" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
        ) : (
          <span style={{ fontSize: "2rem", color: "#fff", fontWeight: "bold" }}>
            {(user?.name && typeof user.name === "string" && user.name.length > 0) ? (user.name?.[0]?.toUpperCase() ?? "") : ""}
          </span>
        )}
      </div>
      <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#fff" }}>{user?.name ?? ""}</div>
      <div style={{ fontSize: "1.05rem", color: "#C8E6C9" }}>{user?.email ?? ""}</div>
      <div style={{ fontSize: "1.05rem", color: "#C8E6C9" }}>{user?.phone ?? ""}</div>
      <div style={{ fontSize: "1.05rem", color: "#C8E6C9" }}>{user?.favoritePosition ?? ""}</div>
      <div style={{ fontSize: "1.05rem", color: "#C8E6C9" }}>{user?.jerseyNumber ? `#${user.jerseyNumber}` : ""}</div>
      <div style={{ fontSize: "0.98rem", color: "#C8E6C9" }}>{user?.about ?? ""}</div>
      {/* Visa statistik */}
      {user?.statistics && (
        <div style={{ display: "flex", gap: "1.2rem", justifyContent: "center", marginTop: "0.7rem" }}>
          <div>
            <div style={{ fontWeight: "bold", color: "#22c55e" }}>{user.statistics?.goals ?? 0}</div>
            <div style={{ color: "#C8E6C9", fontSize: "0.98rem" }}>Mål</div>
          </div>
          <div>
            <div style={{ fontWeight: "bold", color: "#22c55e" }}>{user.statistics?.assists ?? 0}</div>
            <div style={{ color: "#C8E6C9", fontSize: "0.98rem" }}>Assist</div>
          </div>
          <div>
            <div style={{ fontWeight: "bold", color: "#22c55e" }}>{user.statistics?.gamesPlayed ?? 0}</div>
            <div style={{ color: "#C8E6C9", fontSize: "0.98rem" }}>Matcher</div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 0.5rem" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#22c55e" }}>Ledare</h2>
      {ledare.length === 0 ? <div style={{ color: "#C8E6C9" }}>Inga ledare hittades.</div> : ledare.map(ProfileCard)}
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#22c55e" }}>Spelare</h2>
      {spelare.length === 0 ? <div style={{ color: "#C8E6C9" }}>Inga spelare hittades.</div> : spelare.map(ProfileCard)}
    </div>
  );
};

export default TeamInfo;
