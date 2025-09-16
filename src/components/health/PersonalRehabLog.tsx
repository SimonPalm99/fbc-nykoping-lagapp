import React, { useState, useEffect } from 'react';
import { RehabSession, RehabPlan, RecoveryLog } from '../../types/health';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import './PersonalRehabLog.css';

interface PersonalRehabLogProps {
  userId: string;
  onUpdate?: () => void;
}

export const PersonalRehabLog: React.FC<PersonalRehabLogProps> = ({ userId, onUpdate }) => {
  const [sessions, setSessions] = useState<RehabSession[]>([]);
  const [recoveryLogs, setRecoveryLogs] = useState<RecoveryLog[]>([]);
  const [activePlan, setActivePlan] = useState<RehabPlan | null>(null);
  const [showNewSession, setShowNewSession] = useState(false);
  const [showNewLog, setShowNewLog] = useState(false);
  const [currentView, setCurrentView] = useState<'sessions' | 'progress' | 'logs'>('sessions');

  // Mock data för demonstration
  useEffect(() => {
    const mockPlan: RehabPlan = {
      id: '1',
      injuryId: 'inj-1',
      playerId: userId,
      title: 'Rehabiliteringsplan - Ankelskada',
      description: 'Strukturerad rehabilitering efter ankelskada',
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      estimatedEndDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      status: 'active',
      phases: [
        { name: 'Akut fas', duration: '1-3 dagar', focus: 'Vila och smärtlindring' },
        { name: 'Läkningsfas', duration: '3-14 dagar', focus: 'Gradvis rörlighet' }
      ],
      exercises: [
        {
          id: 'ex1',
          name: 'Ankelcirklar',
          type: 'mobility',
          description: 'Cirkulära rörelser med ankeln',
          duration: 10,
          sets: 3,
          repetitions: 15,
          intensity: 'low',
          phase: 1,
          instructions: 'Sitt bekvämt och rotera ankeln långsamt',
          precautions: 'Stoppa vid smärta'
        }
      ],
      sessions: [],
      goals: ['Återfå full rörlighet', 'Smärtfri vardagsaktivitet'],
      restrictions: ['Undvik hopprörelser', 'Använd stöd vid behov'],
      createdBy: 'physio-1',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockSessions: RehabSession[] = [
      {
        id: 'session-1',
        planId: '1',
        playerId: userId,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        duration: 30,
        exercises: [
          {
            exerciseId: 'ex1',
            completed: true,
            actualSets: 3,
            actualRepetitions: 15,
            actualDuration: 10,
            painLevel: 2,
            difficulty: 'easy',
            notes: 'Gick bra, minimal smärta'
          }
        ],
        painLevel: 2,
        energyLevel: 4,
        notes: 'Bra session, känner förbättring',
        supervisedBy: 'physio-1',
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    const mockLogs: RecoveryLog[] = [
      {
        id: 'log-1',
        playerId: userId,
        date: new Date(),
        painLevel: 3,
        mobilityLevel: 3,
        swellingLevel: 2,
        stiffnessLevel: 3,
        sleepQuality: 4,
        medicationTaken: ['Ibuprofen 400mg'],
        activities: ['Promenad 15 min', 'Rehabiliteringsövningar'],
        notes: 'Bättre än igår, mindre stelhet på morgonen',
        mood: 'good'
      }
    ];

    setActivePlan(mockPlan);
    setSessions(mockSessions);
    setRecoveryLogs(mockLogs);
  }, [userId]);

  const [newSession, setNewSession] = useState<Partial<RehabSession>>({
    date: new Date(),
    duration: 30,
    exercises: [],
    painLevel: 1,
    energyLevel: 3,
    notes: ''
  });

  const [newLog, setNewLog] = useState<Partial<RecoveryLog>>({
    date: new Date(),
    painLevel: 1,
    mobilityLevel: 3,
    swellingLevel: 1,
    stiffnessLevel: 2,
    sleepQuality: 3,
    medicationTaken: [],
    activities: [],
    notes: '',
    mood: 'neutral'
  });

  const addSession = () => {
    if (activePlan && newSession.duration) {
      const session: RehabSession = {
        id: Date.now().toString(),
        planId: activePlan.id,
        playerId: userId,
        date: newSession.date || new Date(),
        duration: newSession.duration,
        exercises: newSession.exercises || [],
        painLevel: newSession.painLevel || 1,
        energyLevel: newSession.energyLevel || 3,
        notes: newSession.notes || '',
        completedAt: new Date()
      };

      setSessions(prev => [session, ...prev]);
      setNewSession({
        date: new Date(),
        duration: 30,
        exercises: [],
        painLevel: 1,
        energyLevel: 3,
        notes: ''
      });
      setShowNewSession(false);
      onUpdate?.();
    }
  };

  const addRecoveryLog = () => {
    const log: RecoveryLog = {
      id: Date.now().toString(),
      playerId: userId,
      date: newLog.date || new Date(),
      painLevel: newLog.painLevel || 1,
      mobilityLevel: newLog.mobilityLevel || 3,
      swellingLevel: newLog.swellingLevel || 1,
      stiffnessLevel: newLog.stiffnessLevel || 2,
      sleepQuality: newLog.sleepQuality || 3,
      medicationTaken: newLog.medicationTaken || [],
      activities: newLog.activities || [],
      notes: newLog.notes || '',
      mood: newLog.mood || 'neutral'
    };

    setRecoveryLogs(prev => [log, ...prev]);
    setNewLog({
      date: new Date(),
      painLevel: 1,
      mobilityLevel: 3,
      swellingLevel: 1,
      stiffnessLevel: 2,
      sleepQuality: 3,
      medicationTaken: [],
      activities: [],
      notes: '',
      mood: 'neutral'
    });
    setShowNewLog(false);
    onUpdate?.();
  };

  const getPainTrend = () => {
    const recentLogs = recoveryLogs.slice(0, 7);
    if (recentLogs.length < 2) return 'stable';
    
    const recent = recentLogs[0]?.painLevel;
    const previous = recentLogs[1]?.painLevel;
    
    if (recent !== undefined && previous !== undefined) {
      if (recent < previous) return 'improving';
      if (recent > previous) return 'worsening';
    }
    return 'stable';
  };

  const getProgressStats = () => {
    const totalSessions = sessions.length;
    const averagePain = sessions.reduce((sum, s) => sum + s.painLevel, 0) / totalSessions || 0;
    const averageEnergy = sessions.reduce((sum, s) => sum + s.energyLevel, 0) / totalSessions || 0;
    const completedExercises = sessions.reduce((sum, s) => 
      sum + s.exercises.filter(e => e.completed).length, 0
    );

    return {
      totalSessions,
      averagePain: Math.round(averagePain * 10) / 10,
      averageEnergy: Math.round(averageEnergy * 10) / 10,
      completedExercises,
      trend: getPainTrend()
    };
  };

  const stats = getProgressStats();

  return (
    <div className="personal-rehab-log">
      <div className="log-header">
        <h3>Min Rehabiliteringslogg</h3>
        {activePlan && (
          <div className="active-plan-info">
            <span className="plan-title">{activePlan.title}</span>
            <span className={`plan-status ${activePlan.status}`}>
              {activePlan.status}
            </span>
          </div>
        )}
      </div>

      <div className="progress-overview">
        <div className="stat-card">
          <div className="stat-value">{stats.totalSessions}</div>
          <div className="stat-label">Träningspass</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.completedExercises}</div>
          <div className="stat-label">Övningar</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.averagePain}/5</div>
          <div className="stat-label">Snitt smärta</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.averageEnergy}/5</div>
          <div className="stat-label">Snitt energi</div>
        </div>
        
        <div className={`stat-card trend ${stats.trend}`}>
          <div className="stat-value">
            {stats.trend === 'improving' ? '↗️' : 
             stats.trend === 'worsening' ? '↘️' : '➡️'}
          </div>
          <div className="stat-label">Trend</div>
        </div>
      </div>

      <div className="view-tabs">
        <button
          className={`tab ${currentView === 'sessions' ? 'active' : ''}`}
          onClick={() => setCurrentView('sessions')}
        >
          Träningspass
        </button>
        <button
          className={`tab ${currentView === 'progress' ? 'active' : ''}`}
          onClick={() => setCurrentView('progress')}
        >
          Framsteg
        </button>
        <button
          className={`tab ${currentView === 'logs' ? 'active' : ''}`}
          onClick={() => setCurrentView('logs')}
        >
          Daglig loggning
        </button>
      </div>

      {currentView === 'sessions' && (
        <div className="sessions-view">
          <div className="section-header">
            <h4>Träningspass</h4>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowNewSession(true)}
            >
              + Nytt pass
            </button>
          </div>

          <div className="sessions-list">
            {sessions.map(session => (
              <div key={session.id} className="session-card">
                <div className="session-header">
                  <div className="session-date">
                    {format(session.date, 'MMM dd, yyyy', { locale: sv })}
                  </div>
                  <div className="session-duration">{session.duration} min</div>
                </div>
                
                <div className="session-metrics">
                  <div className="metric">
                    <span className="metric-label">Smärta:</span>
                    <div className="pain-scale">
                      {[1,2,3,4,5].map(level => (
                        <div
                          key={level}
                          className={`pain-dot ${level <= session.painLevel ? 'active' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="metric">
                    <span className="metric-label">Energi:</span>
                    <div className="energy-scale">
                      {[1,2,3,4,5].map(level => (
                        <div
                          key={level}
                          className={`energy-dot ${level <= session.energyLevel ? 'active' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="session-exercises">
                  {session.exercises.map((exercise, index) => (
                    <div key={index} className="exercise-summary">
                      <span className={`exercise-status ${exercise.completed ? 'completed' : 'incomplete'}`}>
                        {exercise.completed ? '✓' : '○'}
                      </span>
                      <span>Övning {index + 1}</span>
                      {exercise.painLevel && (
                        <span className="exercise-pain">Smärta: {exercise.painLevel}/5</span>
                      )}
                    </div>
                  ))}
                </div>

                {session.notes && (
                  <div className="session-notes">
                    <strong>Anteckningar:</strong> {session.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {currentView === 'progress' && (
        <div className="progress-view">
          <div className="progress-charts">
            <div className="chart-card">
              <h5>Smärtnivå över tid</h5>
              <div className="simple-chart">
                {recoveryLogs.slice(0, 10).reverse().map((log) => (
                  <div key={log.id} className="chart-bar">
                    <div
                      className="bar pain-bar"
                      style={{ height: `${(log.painLevel / 5) * 100}%` }}
                    />
                    <span className="bar-label">{format(log.date, 'MM/dd')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card">
              <h5>Rörlighet över tid</h5>
              <div className="simple-chart">
                {recoveryLogs.slice(0, 10).reverse().map((log) => (
                  <div key={log.id} className="chart-bar">
                    <div
                      className="bar mobility-bar"
                      style={{ height: `${(log.mobilityLevel / 5) * 100}%` }}
                    />
                    <span className="bar-label">{format(log.date, 'MM/dd')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="milestones">
            <h5>Milstolpar</h5>
            <div className="milestone-list">
              <div className="milestone completed">
                <div className="milestone-icon">✓</div>
                <div className="milestone-text">
                  <strong>Första träningspasset</strong>
                  <span>Genomfört för 2 dagar sedan</span>
                </div>
              </div>
              
              <div className="milestone pending">
                <div className="milestone-icon">○</div>
                <div className="milestone-text">
                  <strong>En vecka utan smärta</strong>
                  <span>3 dagar kvar</span>
                </div>
              </div>
              
              <div className="milestone future">
                <div className="milestone-icon">○</div>
                <div className="milestone-text">
                  <strong>Återgång till träning</strong>
                  <span>Uppskattat: 3 veckor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'logs' && (
        <div className="logs-view">
          <div className="section-header">
            <h4>Daglig loggning</h4>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowNewLog(true)}
            >
              + Ny logg
            </button>
          </div>

          <div className="logs-list">
            {recoveryLogs.map(log => (
              <div key={log.id} className="log-card">
                <div className="log-header">
                  <div className="log-date">
                    {format(log.date, 'MMM dd, yyyy', { locale: sv })}
                  </div>
                  <div className={`mood-indicator ${log.mood}`}>
                    {log.mood === 'good' ? '😊' :
                     log.mood === 'bad' ? '😟' : '😐'}
                  </div>
                </div>

                <div className="log-metrics">
                  <div className="metric-grid">
                    <div className="metric-item">
                      <label>Smärta</label>
                      <div className="level-indicator">{log.painLevel}/5</div>
                    </div>
                    
                    <div className="metric-item">
                      <label>Rörlighet</label>
                      <div className="level-indicator">{log.mobilityLevel}/5</div>
                    </div>
                    
                    <div className="metric-item">
                      <label>Svullnad</label>
                      <div className="level-indicator">{log.swellingLevel}/5</div>
                    </div>
                    
                    <div className="metric-item">
                      <label>Stelhet</label>
                      <div className="level-indicator">{log.stiffnessLevel}/5</div>
                    </div>
                    
                    <div className="metric-item">
                      <label>Sömn</label>
                      <div className="level-indicator">{log.sleepQuality}/5</div>
                    </div>
                  </div>
                </div>

                {log.medicationTaken.length > 0 && (
                  <div className="log-medication">
                    <strong>Medicin:</strong> {log.medicationTaken.join(', ')}
                  </div>
                )}

                {log.activities.length > 0 && (
                  <div className="log-activities">
                    <strong>Aktiviteter:</strong> {log.activities.join(', ')}
                  </div>
                )}

                {log.notes && (
                  <div className="log-notes">
                    <strong>Anteckningar:</strong> {log.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal för nytt träningspass */}
      {showNewSession && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h5>Nytt träningspass</h5>
              <button
                className="btn-close"
                onClick={() => setShowNewSession(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Datum</label>
                <input
                  type="date"
                  value={format(newSession.date || new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setNewSession(prev => ({
                    ...prev,
                    date: new Date(e.target.value)
                  }))}
                />
              </div>

              <div className="form-group">
                <label>Varaktighet (minuter)</label>
                <input
                  type="number"
                  value={newSession.duration || ''}
                  onChange={(e) => setNewSession(prev => ({
                    ...prev,
                    duration: parseInt(e.target.value)
                  }))}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Smärtnivå (1-5)</label>
                  <select
                    value={newSession.painLevel || 1}
                    onChange={(e) => setNewSession(prev => ({
                      ...prev,
                      painLevel: parseInt(e.target.value)
                    }))}
                  >
                    {[1,2,3,4,5].map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Energinivå (1-5)</label>
                  <select
                    value={newSession.energyLevel || 3}
                    onChange={(e) => setNewSession(prev => ({
                      ...prev,
                      energyLevel: parseInt(e.target.value)
                    }))}
                  >
                    {[1,2,3,4,5].map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Anteckningar</label>
                <textarea
                  value={newSession.notes || ''}
                  onChange={(e) => setNewSession(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  rows={3}
                  placeholder="Hur gick träningspasset?"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowNewSession(false)}
              >
                Avbryt
              </button>
              <button
                className="btn btn-primary"
                onClick={addSession}
                disabled={!newSession.duration}
              >
                Spara pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal för ny daglig logg */}
      {showNewLog && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h5>Ny daglig logg</h5>
              <button
                className="btn-close"
                onClick={() => setShowNewLog(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Datum</label>
                <input
                  type="date"
                  value={format(newLog.date || new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setNewLog(prev => ({
                    ...prev,
                    date: new Date(e.target.value)
                  }))}
                />
              </div>

              <div className="metrics-grid">
                <div className="form-group">
                  <label>Smärtnivå (1-5)</label>
                  <select
                    value={newLog.painLevel || 1}
                    onChange={(e) => setNewLog(prev => ({
                      ...prev,
                      painLevel: parseInt(e.target.value)
                    }))}
                  >
                    {[1,2,3,4,5].map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Rörlighet (1-5)</label>
                  <select
                    value={newLog.mobilityLevel || 3}
                    onChange={(e) => setNewLog(prev => ({
                      ...prev,
                      mobilityLevel: parseInt(e.target.value)
                    }))}
                  >
                    {[1,2,3,4,5].map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Svullnad (1-5)</label>
                  <select
                    value={newLog.swellingLevel || 1}
                    onChange={(e) => setNewLog(prev => ({
                      ...prev,
                      swellingLevel: parseInt(e.target.value)
                    }))}
                  >
                    {[1,2,3,4,5].map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Stelhet (1-5)</label>
                  <select
                    value={newLog.stiffnessLevel || 2}
                    onChange={(e) => setNewLog(prev => ({
                      ...prev,
                      stiffnessLevel: parseInt(e.target.value)
                    }))}
                  >
                    {[1,2,3,4,5].map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Sömnkvalitet (1-5)</label>
                  <select
                    value={newLog.sleepQuality || 3}
                    onChange={(e) => setNewLog(prev => ({
                      ...prev,
                      sleepQuality: parseInt(e.target.value)
                    }))}
                  >
                    {[1,2,3,4,5].map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Humör</label>
                  <select
                    value={newLog.mood || 'neutral'}
                    onChange={(e) => setNewLog(prev => ({
                      ...prev,
                      mood: e.target.value as any
                    }))}
                  >
                    <option value="bad">Dåligt 😟</option>
                    <option value="neutral">Okej 😐</option>
                    <option value="good">Bra 😊</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Medicin tagen</label>
                <input
                  type="text"
                  value={newLog.medicationTaken?.join(', ') || ''}
                  onChange={(e) => setNewLog(prev => ({
                    ...prev,
                    medicationTaken: e.target.value.split(',').map(m => m.trim()).filter(m => m)
                  }))}
                  placeholder="Medicin 1, Medicin 2, ..."
                />
              </div>

              <div className="form-group">
                <label>Aktiviteter</label>
                <input
                  type="text"
                  value={newLog.activities?.join(', ') || ''}
                  onChange={(e) => setNewLog(prev => ({
                    ...prev,
                    activities: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                  }))}
                  placeholder="Promenad, Övningar, ..."
                />
              </div>

              <div className="form-group">
                <label>Anteckningar</label>
                <textarea
                  value={newLog.notes || ''}
                  onChange={(e) => setNewLog(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  rows={3}
                  placeholder="Hur mår du idag? Vad har hänt?"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowNewLog(false)}
              >
                Avbryt
              </button>
              <button
                className="btn btn-primary"
                onClick={addRecoveryLog}
              >
                Spara logg
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
