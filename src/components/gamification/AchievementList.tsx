import React from "react";

interface Props {
  userId: string;
}

const AchievementList: React.FC<Props> = ({ userId }) => {
  // Här kan du ladda achievements baserat på userId
  return (
    <section>
      <h3>Achievements för {userId}</h3>
      {/* Här kan du rendera en lista med achievements */}
      <ul>
        <li>✅ Första matchen spelad</li>
        <li>✅ 10 träningar genomförda</li>
        {/* Lägg till fler achievements dynamiskt */}
      </ul>
    </section>
  );
};

export default AchievementList;