import React from "react";
import { useNavigate } from "react-router-dom";

interface ProfileCardProps {
  user: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="profileCardRoot">
      <div className="profileCardMain" onClick={() => navigate("/profile")} aria-label="Gå till min profil">
        <div className="profileCardImageWrapper">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.name || "Profilbild"}
              className="profileCardImage"
              onError={e => { e.currentTarget.src = '/default-avatar.png'; }}
            />
          ) : (
            <img
              src="/default-avatar.png"
              alt="Profilbild"
              className="profileCardImage"
            />
          )}
          <div className="profileCardGlow" />
        </div>
        <div className="profileCardInfo">
          <span className="profileCardName">{user?.name}</span>
          {user?.jerseyNumber ? (
            <span className="profileCardJersey">#{user.jerseyNumber}</span>
          ) : null}
          {user?.favoritePosition ? (
            <span className="profileCardPosition">{user.favoritePosition}</span>
          ) : null}
          {user?.birthday ? (
            <span className="profileCardBirthday">🎂 {new Date(user.birthday).toLocaleDateString('sv-SE')}</span>
          ) : null}
          {user?.email && (
            <span className="profileCardEmail">📧 {user.email}</span>
          )}
          {user?.badges && user.badges.length > 0 && (
            <div className="profileCardBadges">
              {user.badges.slice(0, 3).map((badge: any) => (
                <span key={badge.id} title={badge.name} className="profileCardBadge">
                  {badge.iconUrl ? (
                    <img src={badge.iconUrl} alt={badge.name} className="profileCardBadgeIcon" />
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
