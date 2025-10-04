import React from "react";
import styles from "./LeaderBadgePanel.module.css";

interface Props {
  leaderId: string;
}

// Här kan du lägga till fler märken och dynamik i framtiden
const badges = [
  { icon: "🏆", name: "Superledare", description: "Har lett 50+ matcher" },
  { icon: "🎖️", name: "Mentor", description: "Har coachat nya spelare" },
  { icon: "🤝", name: "Lagspelare", description: "Har organiserat lagaktiviteter" }
];

const LeaderBadgePanel: React.FC<Props> = ({ leaderId }) => {
  // Här kan du t.ex. filtrera badges eller hämta dem asynkront i framtiden
  
  return (
    <section className={styles.leaderBadgePanel}>
      <h3 className={styles.leaderBadgePanel__title}>
        Ledarmärken för <span className={styles.leaderBadgePanel__leader}>{leaderId}</span>
      </h3>
      <ul className={styles.leaderBadgePanel__list}>
        {badges.map((badge, idx) => (
          <li key={idx} className={styles.leaderBadgePanel__item}>
            <span className={styles.leaderBadgePanel__icon}>{badge.icon}</span>
            <div>
              <div className={styles.leaderBadgePanel__name}>{badge.name}</div>
              <div className={styles.leaderBadgePanel__desc}>{badge.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LeaderBadgePanel;