import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { useActivity } from '../../context/ActivityContext';
import './PersonalStatistics.css';

const PersonalStatistics: React.FC = () => {
  const { user } = useAuth();
  const { users } = useUser();
  const { activities } = useActivity();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'season'>('month');

  const currentUser = users.find(u => u.id === user?.id);
  const trainingLogs = currentUser?.trainingLogs || [];

  // Calculate statistics based on timeframe
  const stats = useMemo(() => {
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
  }, [trainingLogs, activities, user?.id, selectedTimeframe]);

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

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 1) return '#94a3b8';
    if (intensity <= 2) return '#60a5fa';
    if (intensity <= 3) return '#34d399';
    if (intensity <= 4) return '#fbbf24';
    return '#ef4444';
  };

  return (
    <div className="personal-statistics">
      <div className="stats-header">
        <h2>Personlig Statistik</h2>
        <div className="timeframe-selector">
          {(['week', 'month', 'season'] as const).map(period => (
            <button
              key={period}
              className={`timeframe-btn ${selectedTimeframe === period ? 'active' : ''}`}
              onClick={() => setSelectedTimeframe(period)}
            >
              {period === 'week' ? 'Vecka' : period === 'month' ? 'Månad' : 'Säsong'}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-overview">
        <h3>{getTimeframeName()}</h3>
        
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">🏃</div>
            <div className="stat-info">
              <h4>Träningspass</h4>
              <span className="stat-number">{stats.totalTrainingSessions}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-info">
              <h4>Träningstid</h4>
              <span className="stat-number">{Math.round(stats.totalTrainingTime / 60)}h</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">{getFeelingEmoji(stats.avgFeeling)}</div>
            <div className="stat-info">
              <h4>Snitt Känsla</h4>
              <span className="stat-number">{stats.avgFeeling.toFixed(1)}/5</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <h4>Snitt Intensitet</h4>
              <span className="stat-number">{stats.avgIntensity.toFixed(1)}/5</span>
            </div>
          </div>
        </div>

        <div className="attendance-section">
          <h4>Närvaro på Aktiviteter</h4>
          <div className="attendance-stats">
            <div className="attendance-item">
              <span>🏃 Träningar:</span>
              <strong>{stats.activitiesAttended.training}</strong>
            </div>
            <div className="attendance-item">
              <span>🏒 Matcher:</span>
              <strong>{stats.activitiesAttended.matches}</strong>
            </div>
            <div className="attendance-item">
              <span>🎉 Sociala:</span>
              <strong>{stats.activitiesAttended.social}</strong>
            </div>
            <div className="attendance-item total">
              <span>📅 Totalt:</span>
              <strong>{stats.activitiesAttended.total}</strong>
            </div>
          </div>
        </div>

        {stats.topSkills.length > 0 && (
          <div className="skills-section">
            <h4>Mest Tränade Färdigheter</h4>
            <div className="skills-list">
              {stats.topSkills.map(({ skill, count }) => (
                <div key={skill} className="skill-item">
                  <span className="skill-name">{skill}</span>
                  <div className="skill-bar">
                    <div 
                      className="skill-progress" 
                      style={{ 
                        width: `${(count / (stats.topSkills[0]?.count || 1)) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="skill-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.recentTrainingLogs.length > 0 && (
          <div className="recent-training-section">
            <h4>Senaste Träningsloggar</h4>
            <div className="training-logs">
              {stats.recentTrainingLogs.map(log => (
                <div key={log.id} className="training-log-item">
                  <div className="log-date">
                    {new Date(log.date).toLocaleDateString('sv-SE')}
                  </div>
                  <div className="log-content">
                    <div className="log-note">{log.note}</div>
                    <div className="log-details">
                      <span className="log-feeling">
                        {getFeelingEmoji(log.feeling)} {log.feeling}/5
                      </span>
                      {log.intensity && (
                        <span 
                          className="log-intensity"
                          style={{ color: getIntensityColor(log.intensity) }}
                        >
                          🔥 {log.intensity}/5
                        </span>
                      )}
                      {log.duration && (
                        <span className="log-duration">
                          ⏱️ {log.duration}min
                        </span>
                      )}
                    </div>
                    {log.skills && log.skills.length > 0 && (
                      <div className="log-skills">
                        {log.skills.map(skill => (
                          <span key={skill} className="skill-tag">{skill}</span>
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
