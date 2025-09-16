import React from "react";

interface Props {
  userId: string;
}

const BadgeList: React.FC<Props> = ({ userId }) => {
  // Här kan du ladda badges baserat på userId
  return (
    <section>
      <h3>Badges för {userId}</h3>
      {/* Här kan du rendera en lista med badges */}
      <ul>
        <li>🏅 Nybörjare</li>
        <li>🥈 Aktiv deltagare</li>
        {/* Lägg till fler badges dynamiskt */}
      </ul>
    </section>
  );
};

export default BadgeList;