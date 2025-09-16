import React from "react";

interface Props {
  userId: string;
}

const ChallengeList: React.FC<Props> = ({ userId }) => {
  // Här kan du ladda challenges baserat på userId
  return (
    <section>
      <h3>Challenges för {userId}</h3>
      {/* Här kan du rendera en lista med challenges */}
      <ul>
        <li>🔓 Spring 5 km under 30 minuter</li>
        <li>🔓 Delta i 3 matcher i rad</li>
        {/* Lägg till fler challenges dynamiskt */}
      </ul>
    </section>
  );
};

export default ChallengeList;