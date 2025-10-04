import React, { useEffect, useState } from "react";
import { usersAPI } from "../services/apiService";
import { User } from "../types/user";
import styles from "./TeamInfo.module.css";

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
    <div key={user.id} className={styles["profile-card"]}>
      <div className={styles["profile-avatar"]}>
        {user?.profileImageUrl ? (
          <img src={user.profileImageUrl} alt="Profilbild" className={styles["profile-avatar-img"]} />
        ) : (
          <span className={styles["profile-avatar-initial"]}>
            {(user?.name && typeof user.name === "string" && user.name.length > 0) ? (user.name?.[0]?.toUpperCase() ?? "") : ""}
          </span>
        )}
      </div>
      <div className={styles["profile-name"]}>{user?.name ?? ""}</div>
      <div className={styles["profile-email"]}>{user?.email ?? ""}</div>
      <div className={styles["profile-phone"]}>{user?.phone ?? ""}</div>
      <div className={styles["profile-position"]}>{user?.favoritePosition ?? ""}</div>
      <div className={styles["profile-jersey"]}>{user?.jerseyNumber ? `#${user.jerseyNumber}` : ""}</div>
      <div className={styles["profile-about"]}>{user?.about ?? ""}</div>
      {/* Visa statistik */}
      {user?.statistics && (
        <div className={styles["profile-stats"]}>
          <div className={styles["profile-stat"]}>
            <div className={styles["profile-stat-value"]}>{user.statistics?.goals ?? 0}</div>
            <div className={styles["profile-stat-label"]}>Mål</div>
          </div>
          <div className={styles["profile-stat"]}>
            <div className={styles["profile-stat-value"]}>{user.statistics?.assists ?? 0}</div>
            <div className={styles["profile-stat-label"]}>Assist</div>
          </div>
          <div className={styles["profile-stat"]}>
            <div className={styles["profile-stat-value"]}>{user.statistics?.gamesPlayed ?? 0}</div>
            <div className={styles["profile-stat-label"]}>Matcher</div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles["teaminfo-container"]}>
      <h2 className={styles["teaminfo-title"]}>Ledare</h2>
      {ledare.length === 0 ? <div className={styles["teaminfo-empty"]}>Inga ledare hittades.</div> : ledare.map(ProfileCard)}
      <h2 className={styles["teaminfo-title"]}>Spelare</h2>
      {spelare.length === 0 ? <div className={styles["teaminfo-empty"]}>Inga spelare hittades.</div> : spelare.map(ProfileCard)}
    </div>
  );
};

export default TeamInfo;
