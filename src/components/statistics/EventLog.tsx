import React from "react";
import { useActivity } from "../../context/ActivityContext";

interface EventLogProps {
  activityId?: string;
}

const EventLog: React.FC<EventLogProps> = ({ activityId }) => {
  const { activities } = useActivity();

  // Om du vill använda activityId, filtrera aktiviteterna:
  const shownActivities = activityId
    ? activities.filter(a => a.id === activityId)
    : activities;

  return (
    <div>
      <h3>Alla aktiviteter</h3>
      <ul>
        {shownActivities.map(a => (
          <li key={a.id}>
            {a.title} - {a.date} {a.canceled && <span style={{ color: "red" }}>[Inställd]</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventLog;