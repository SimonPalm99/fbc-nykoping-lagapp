import React from "react";
import { useNavigate } from "react-router-dom";

interface ProfileCardProps {
  user: any;
  styles: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, styles }) => {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.5rem", minWidth: "140px", zIndex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", cursor: "pointer", borderRadius: "1rem", transition: "box-shadow 0.25s, border 0.25s, transform 0.25s", boxShadow: "0 4px 16px rgba(46,125,50,0.12)", background: "rgba(46,125,50,0.12)", padding: "0.5rem 0.8rem", minWidth: "110px", position: "relative", backdropFilter: "blur(1px)", opacity: 0.98, transform: "scale(1.02)", overflow: "hidden" }} onClick={() => navigate("/profile")} aria-label="Gå till min profil" onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)") } onMouseLeave={e => (e.currentTarget.style.transform = "scale(1.02)") }>
        <div style={{ position: "relative" }}>
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt={user.name || "Profilbild"} style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", border: `2px solid #FFB300`, boxShadow: "0 2px 8px rgba(255,179,0,0.12)" }} />
          ) : (
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: styles.gradients.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: "bold", color: "white", border: `2px solid #FFB300`, boxShadow: "0 2px 8px rgba(255,179,0,0.12)" }}>
              {user?.name?.charAt(0).toUpperCase() || "S"}
            </div>
          )}
          {/* Guldglow runt profilbild */}
          <div style={{ position: "absolute", top: -4, left: -4, width: 46, height: 46, borderRadius: "50%", background: "radial-gradient(circle, #FFB30022 0%, transparent 70%)", zIndex: 0 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
          <span style={{ fontWeight: 900, fontSize: "0.95rem", color: styles.textPrimary }}>{user?.name}</span>
          {user?.jerseyNumber ? (
            <span style={{ fontWeight: 600, fontSize: "0.85rem", color: styles.textSecondary }}>#{user.jerseyNumber}</span>
          ) : null}
          {user?.favoritePosition ? (
            <span style={{ fontWeight: 600, fontSize: "0.85rem", color: styles.textSecondary }}>{user.favoritePosition}</span>
          ) : null}
          {user?.birthday ? (
            <span style={{ fontSize: "0.8rem", color: styles.textSecondary }}>🎂 {new Date(user.birthday).toLocaleDateString('sv-SE')}</span>
          ) : null}
          {user?.email && (
            <span style={{ fontSize: "0.8rem", color: styles.textSecondary, marginTop: "0.05rem" }}>📧 {user.email}</span>
          )}
          {/* BADGES/UTMÄRKELSER */}
          {user?.badges && user.badges.length > 0 && (
            <div style={{ display: "flex", gap: "0.2rem", marginTop: "0.1rem" }}>
              {user.badges.slice(0, 3).map((badge: any) => (
                <span key={badge.id} title={badge.name} style={{ fontSize: "1.1rem", color: "#FFB300", filter: "drop-shadow(0 1px 2px #FFB300)" }}>
                  {badge.iconUrl ? (
                    <img src={badge.iconUrl} alt={badge.name} style={{ width: "1.1em", height: "1.1em", verticalAlign: "middle" }} />
                  ) : (
                    "🏅"
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
