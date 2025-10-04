import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { useActivity } from '../../context/ActivityContext';
import styles from './PersonalStatistics.module.css';

const PersonalStatistics: React.FC = () => {
  const { user } = useAuth();
  const { users } = useUser();
  const { activities } = useActivity();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'season'>('month');

  const currentUser = users.find(u => u.id === user?.id);


  // Calculate statistics based on timeframe
  const stats = useMemo(() => {
    const trainingLogs = currentUser?.trainingLogs || [];
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (selectedTimeframe) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'season':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
    }

    // Filter training logs by timeframe
    const recentTrainingLogs = trainingLogs.filter(log => 
      new Date(log.date) >= cutoffDate
    );

    // Filter activities by timeframe and user participation
    const recentActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      const userParticipation = activity.participants.find(p => p.userId === user?.id);
      return activityDate >= cutoffDate && userParticipation?.status === 'attending';
    });

    // Calculate training statistics
    const totalTrainingSessions = recentTrainingLogs.length;
    const totalTrainingTime = recentTrainingLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const avgFeeling = recentTrainingLogs.length > 0 
      ? recentTrainingLogs.reduce((sum, log) => sum + log.feeling, 0) / recentTrainingLogs.length 
      : 0;
    const avgIntensity = recentTrainingLogs.length > 0
      ? recentTrainingLogs.reduce((sum, log) => sum + (log.intensity || 0), 0) / recentTrainingLogs.length
      : 0;

    // Calculate skill focus
    const skillCounts: { [key: string]: number } = {};
    recentTrainingLogs.forEach(log => {
      log.skills?.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([skill, count]) => ({ skill, count }));

    // Calculate activity attendance
    const trainingActivities = recentActivities.filter(a => a.type === 'träning');
    const matchActivities = recentActivities.filter(a => a.type === 'match');
    const socialActivities = recentActivities.filter(a => ['lagfest', 'möte', 'annat'].includes(a.type));

    return {
      totalTrainingSessions,
      totalTrainingTime,
      avgFeeling,
      avgIntensity,
      topSkills,
      activitiesAttended: {
        training: trainingActivities.length,
        matches: matchActivities.length,
        social: socialActivities.length,
        total: recentActivities.length
      },
      recentTrainingLogs: recentTrainingLogs.slice(-10).reverse()
    };
  }, [currentUser?.trainingLogs, activities, user?.id, selectedTimeframe]);

  const getTimeframeName = () => {
    switch (selectedTimeframe) {
      case 'week': return 'Senaste veckan';
      case 'month': return 'Senaste månaden';
      case 'season': return 'Säsongen';
    }
  };

  const getFeelingEmoji = (feeling: number) => {
    if (feeling <= 1) return '😞';
    if (feeling <= 2) return '😐';
    if (feeling <= 3) return '🙂';
    if (feeling <= 4) return '😊';
    return '🤩';
  };


  return (
    <div className={styles.personalStatistics}>
      <div className={styles.statsHeader}>
        <h2>Personlig Statistik</h2>
        <div className={styles.timeframeSelector}>
          {(['week', 'month', 'season'] as const).map(period => (
            <button
              key={period}
              className={
                `${styles.timeframeBtn} ${selectedTimeframe === period ? styles.active : ''}`
              }
              onClick={() => setSelectedTimeframe(period)}
            >
              {period === 'week' ? 'Vecka' : period === 'month' ? 'Månad' : 'Säsong'}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.statsOverview}>
        <h3>{getTimeframeName()}</h3>
        <div className={styles.statsCards}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏃</div>
            <div className={styles.statInfo}>
              <h4>Träningspass</h4>
              <span className={styles.statNumber}>{stats.totalTrainingSessions}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⏱️</div>
            <div className={styles.statInfo}>
              <h4>Träningstid</h4>
              <span className={styles.statNumber}>{Math.round(stats.totalTrainingTime / 60)}h</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>{getFeelingEmoji(stats.avgFeeling)}</div>
            <div className={styles.statInfo}>
              <h4>Snitt Känsla</h4>
              <span className={styles.statNumber}>{stats.avgFeeling.toFixed(1)}/5</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🔥</div>
            <div className={styles.statInfo}>
              <h4>Snitt Intensitet</h4>
              <span className={styles.statNumber}>{stats.avgIntensity.toFixed(1)}/5</span>
            </div>
          </div>
        </div>

        <div className={styles.attendanceSection}>
          <h4>Närvaro på Aktiviteter</h4>
          <div className={styles.attendanceStats}>
            <div className={styles.attendanceItem}>
              <span>🏃 Träningar:</span>
              <strong>{stats.activitiesAttended.training}</strong>
            </div>
            <div className={styles.attendanceItem}>
              <span>🏒 Matcher:</span>
              <strong>{stats.activitiesAttended.matches}</strong>
            </div>
            <div className={styles.attendanceItem}>
              <span>🎉 Sociala:</span>
              <strong>{stats.activitiesAttended.social}</strong>
            </div>
            <div className={`${styles.attendanceItem} ${styles.total}`}> 
              <span>📅 Totalt:</span>
              <strong>{stats.activitiesAttended.total}</strong>
            </div>
          </div>
        </div>

        {stats.topSkills.length > 0 && (
          <div className={styles.skillsSection}>
            <h4>Mest Tränade Färdigheter</h4>
            <div className={styles.skillsList}>
              {stats.topSkills.map(({ skill, count }) => (
                <div key={skill} className={styles.skillItem}>
                  <span className={styles.skillName}>{skill}</span>
                  <div className={styles.skillBar}>
                    <div
                      className={
                        `${styles.skillProgress} ${styles['progress-' + Math.round((count / (stats.topSkills[0]?.count || 1)) * 10)]}`
                      }
                    />
                  </div>
                  <span className={styles.skillCount}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.recentTrainingLogs.length > 0 && (
          <div className={styles.recentTrainingSection}>
            <h4>Senaste Träningsloggar</h4>
            <div className={styles.trainingLogs}>
              {stats.recentTrainingLogs.map(log => (
                <div key={log.id} className={styles.trainingLogItem}>
                  <div className={styles.logDate}>
                    {new Date(log.date).toLocaleDateString('sv-SE')}
                  </div>
                  <div className={styles.logContent}>
                    <div className={styles.logNote}>{log.note}</div>
                    <div className={styles.logDetails}>
                      <span className={styles.logFeeling}>
                        {getFeelingEmoji(log.feeling)} {log.feeling}/5
                      </span>
                      {log.intensity && (
                        <span 
                          className={
                            `${styles.logIntensity} ${styles['intensity-' + Math.round(log.intensity)]}`
                          }
                        >
                          🔥 {log.intensity}/5
                        </span>
                      )}
                      {log.duration && (
                        <span className={styles.logDuration}>
                          ⏱️ {log.duration}min
                        </span>
                      )}
                    </div>
                    {log.skills && log.skills.length > 0 && (
                      <div className={styles.logSkills}>
                        {log.skills.map(skill => (
                          <span key={skill} className={styles.skillTag}>{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalStatistics;
