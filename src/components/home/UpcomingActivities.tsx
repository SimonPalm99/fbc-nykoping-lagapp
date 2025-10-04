
import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from '../../types/activity';
import styles from './UpcomingActivities.module.css';

interface UpcomingActivitiesProps {
  activities: Activity[];
}

export const UpcomingActivities: React.FC<UpcomingActivitiesProps> = ({ activities }) => {
  // Visa endast de 3 närmaste aktiviteterna
  const nearestActivities = activities.slice(0, 3);

  return (
    <section className={styles.kommandeSection}>
      <div className={styles.kommandeHeader}>
        <h3 className={styles.kommandeRubrik}>📅 Kommande aktiviteter</h3>
        <Link
          to="/activities"
          className={styles.kommandeLank}
        >
          Visa alla →
        </Link>
      </div>

      {nearestActivities.length === 0 ? (
        <div className={styles.kommandeTomKort}>
          <div className={styles.kommandeTomIcon}>📅</div>
          <h4 className={styles.kommandeTomRubrik}>Inga kommande aktiviteter</h4>
          <p className={styles.kommandeTomText}>Nya aktiviteter kommer snart att läggas till</p>
        </div>
      ) : (
        <div className={styles.kommandeList}>
          {nearestActivities.map((activity) => (
            <div key={activity.id} className={styles.kommandeAktivKort}>
              <div
                className={styles.kommandeAktivGradient}
                data-gradient={
                  activity.type === 'match'
                    ? 'linear-gradient(135deg, #f44336, #d32f2f)'
                    : activity.type === 'träning'
                    ? 'linear-gradient(135deg, #4caf50, #388e3c)'
                    : 'linear-gradient(135deg, #2196f3, #1976d2)'
                }
              />
              <div className={styles.kommandeAktivContent}>
                <div className={styles.kommandeAktivInfo}>
                  <div className={styles.kommandeAktivTop}>
                    <span className={styles.kommandeAktivIcon}>
                      {activity.type === 'match' ? '⚽' :
                        activity.type === 'träning' ? '🏃‍♂️' : '📅'}
                    </span>
                    <h4 className={styles.kommandeAktivRubrik}>{activity.title}</h4>
                    <span
                      className={styles.kommandeAktivTyp}
                      data-bg={
                        activity.type === 'match'
                          ? 'rgba(244, 67, 54, 0.1)'
                          : activity.type === 'träning'
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'rgba(33, 150, 243, 0.1)'
                      }
                      data-color={
                        activity.type === 'match'
                          ? '#f44336'
                          : activity.type === 'träning'
                          ? '#4caf50'
                          : '#2196f3'
                      }
                    >
                      {activity.type.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className={styles.kommandeAktivDatum}>
                      <span>📅</span>
                      <span>{new Date(activity.date).toLocaleDateString('sv-SE', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className={styles.kommandeAktivTid}>
                      <span>⏰</span>
                      <span>{activity.startTime} - {activity.endTime}</span>
                    </div>
                    <div className={styles.kommandeAktivPlats}>
                      <span>📍</span>
                      <span>{activity.location}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.kommandeAktivExtra}>
                  <span className={styles.kommandeAktivDagar}>
                    {Math.ceil((new Date(activity.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dagar
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
