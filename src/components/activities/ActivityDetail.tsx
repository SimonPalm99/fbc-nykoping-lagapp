import React from "react";
import styles from "./ActivityDetail.module.css";
import { Activity } from "../../types/activity";

interface Props {
  activity: Activity;
}

const ActivityDetail: React.FC<Props> = ({ activity }) => (
  <section className={styles.sektion}>
    <h2 className={styles.rubrik}>
      {activity.title}
      {activity.type && (
        <span className={styles.typ}>{activity.type}</span>
      )}
      {activity.important && (
        <span className={styles.viktigt}>Viktigt!</span>
      )}
    </h2>
    <div className={styles.info}>
      <div className={styles.infoRad}>
        <strong>Datum:</strong> {activity.date}
        {activity.startTime && activity.endTime && (
          <> kl {activity.startTime}–{activity.endTime}</>
        )}
      </div>
      <div className={styles.infoRad}>
        <strong>Plats:</strong> {activity.location || <i>Ej angiven</i>}
        {activity.mapUrl && (
          <span>
            <a
              href={activity.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.kartaLank}
            >
              Karta
            </a>
          </span>
        )}
      </div>
      {activity.absenceDeadline && (
        <div className={styles.fravaro}>
          <strong>Sista dag för frånvaro:</strong> {activity.absenceDeadline}
        </div>
      )}
    </div>
    {activity.description && (
      <div className={styles.beskrivning}>
        <strong>Beskrivning:</strong>
        <div className={styles.beskrivningText}>{activity.description}</div>
      </div>
    )}
    {activity.tags && activity.tags.length > 0 && (
      <div className={styles.taggar}>
        <strong className={styles.tagLabel}>Taggar:</strong>{' '}
        {activity.tags.map(tag => (
          <span
            key={tag}
            className={styles.tag}
          >
            {tag}
          </span>
        ))}
      </div>
    )}
    <div className={styles.skapadAv}>
      <span>Skapad av: {activity.createdBy}</span>
    </div>
  </section>
);

export default ActivityDetail;