import { useState, useEffect } from 'react';
import React from 'react';
import { useUser } from '../context/UserContext';
import { healthAPI, statisticsAPI, gamificationAPI } from '../services/apiService';
import styles from './Profile.module.css';


const Profile = () => {
  const { user, updateUser } = useUser();
  // State for profile editing
  const [editProfile, setEditProfile] = useState<any>(user ? { ...user } : {});
  // Profilbilds-uppladdning
  // ...existing code...
  // Animation feedback
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  // State for health logs (backend)
  const [editHealthId, setEditHealthId] = useState<string | null>(null);
  const [editHealthForm, setEditHealthForm] = useState<any>(null);
  const [healthForm, setHealthForm] = useState({ type: '', date: '', dateStart: '', dateEnd: '', rehabPlan: '', comment: '' });
  const [healthLogs, setHealthLogs] = useState<Array<any>>([]);
  const [showHealthForm, setShowHealthForm] = useState(false);
  // State for statistics
  const [stats, setStats] = useState<any>(null);
  // State for badges
  const [badges, setBadges] = useState<any[]>([]);

  // Load health logs, stats, badges from backend
  useEffect(() => {
    if (user?.id) {
      healthAPI.getWorkouts(user.id).then(res => {
        if (res.success) setHealthLogs(res.data);
      });
      statisticsAPI.getPersonal(user.id).then(res => {
        if (res.success) setStats(res.data);
      });
      gamificationAPI.getBadges(user.id).then(res => {
        if (res.success) setBadges(res.data);
      });
    }
  }, [user?.id]);
  // State for training logs
  // trainingLogs och setTrainingLogs är nu onödiga, all logik sker via user.trainingLogs och addTrainingLog
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [form, setForm] = useState({ type: '', date: '', duration: '', comment: '', feeling: '', intensity: '' });
  const [editLogId, setEditLogId] = useState<string | null>(null);
  const [editLogForm, setEditLogForm] = useState<any>(null);
  // Flikar
  const tabs = [
    { key: 'training', label: 'Logga träning' },
    { key: 'health', label: 'Hälsokort' },
    { key: 'stats', label: 'Statistik' },
    { key: 'badges', label: 'Badges' },
    { key: 'settings', label: 'Inställningar' },
    { key: 'team', label: 'Laginfo' }
  ];
  const [activeTab, setActiveTab] = useState('profile');

  // Snyggt profilkort
  const ProfileCard = (props: { user: any }) => {
    const { user } = props;
    return (
      <div className={styles.profileCard}>
        <div className={styles.profileImageWrapper}>
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profilbild"
              className={styles.profileImage}
              onError={e => {
                (e.currentTarget as HTMLImageElement).src = '/default-avatar.png';
              }}
            />
          ) : (
            <span className={styles.profileInitial}>{user.name ? user.name[0].toUpperCase() : ''}</span>
          )}
        </div>
        <div className={styles.profileName}>{user.name || '-'}</div>
        <div className={styles.profileInfo}>{user.email || '-'}</div>
        <div className={styles.profileInfo}>{user.phone || '-'}</div>
        <div className={styles.profileInfo}>{user.position || '-'}</div>
        <div className={styles.profileInfoSecondary}>{user.jerseyNumber ? `${user.position || ''} #${user.jerseyNumber}` : ''}</div>
        <div className={styles.profileInfoSecondary}>{user.birthday ? `Födelsedag: ${user.birthday}` : ''}</div>
        <div className={styles.profileInfoSecondary}>{user.aboutMe || '-'}</div>
        {user?.statistics && (
          <div className={styles.profileStatsRow}>
            <div className={styles.profileStatsCol}>
              <div className={styles.profileStatsValue}>-</div>
              <div className={styles.profileStatsLabel}>Mål</div>
            </div>
            <div className={styles.profileStatsCol}>
              <div className={styles.profileStatsValue}>-</div>
              <div className={styles.profileStatsLabel}>Assist</div>
            </div>
            <div className={styles.profileStatsCol}>
              <div className={styles.profileStatsValue}>-</div>
              <div className={styles.profileStatsLabel}>+ / -</div>
            </div>
            <div className={styles.profileStatsCol}>
              <div className={styles.profileStatsValue}>-</div>
              <div className={styles.profileStatsLabel}>Träningar</div>
            </div>
            <div className={styles.profileStatsCol}>
              <div className={styles.profileStatsValue}>-</div>
              <div className={styles.profileStatsLabel}>Matcher</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Innehåll för varje flik
  const renderTabContent = (user: any) => {
  switch (activeTab) {
      case 'training':
        // Statistik och träningsloggar från backend
        const logs = healthLogs || [];
        const totalMinutes = logs.reduce((sum: number, log: any) => sum + (parseInt(log.duration) || 0), 0);
        const totalPass = logs.length;
        const typeCount: Record<string, number> = {};
        logs.forEach((log: any) => {
          if (log.type) typeCount[log.type] = (typeCount[log.type] || 0) + 1;
        });
        return (
          <div className={styles.profileLogWrapper}>
            <h2 className={styles.profileLogHeader}>Mina loggade träningar</h2>
            {/* Statistik */}
            <div className={styles.profileLogStatsRow}>
              <div className={styles.profileLogStatsCol}>
                <div className={styles.profileLogStatsValue}>{totalPass}</div>
                <div className={styles.profileLogStatsLabel}>Antal pass</div>
              </div>
              <div className={styles.profileLogStatsCol}>
                <div className={styles.profileLogStatsValue}>{totalMinutes}</div>
                <div className={styles.profileLogStatsLabel}>Total tid (min)</div>
              </div>
              <div className={styles.profileLogStatsCol}>
                <div className={styles.profileLogStatsValue}>{Object.keys(typeCount).length}</div>
                <div className={styles.profileLogStatsLabel}>Typer</div>
              </div>
            </div>
            {/* Logglista med redigera/ta bort */}
            {logs.length === 0 ? (
              <div className={styles.profileLogEmpty}>Du har inte loggat någon träning än.</div>
            ) : (
              <ul className={styles.profileLogList}>
                {logs.map((log: any) => (
                  <li key={log.id} className={styles.profileLogItem}>
                    <div className={styles.profileLogType}>{log.type}</div>
                    <div className={styles.profileLogMeta}>{log.date} • {log.duration || 0} min</div>
                    <div className={styles.profileLogMeta}>Känsla: {log.feeling || '-'} / Intensitet: {log.intensity || '-'}</div>
                    {log.note && <div className={styles.profileLogNote}>{log.note}</div>}
                    <div className={styles.profileLogActions}>
                      <button className={styles.profileLogBtn} onClick={() => {
                        setEditLogId(log.id);
                        setEditLogForm({ ...log });
                      }}>Redigera</button>
                      <button className={styles.profileLogBtn + ' ' + styles.profileLogBtnDelete} onClick={async () => {
                        if (user?.id) {
                          // Ta bort logg via backend
                          await healthAPI.updateProfile(user.id, { trainingLogs: logs.filter((l: any) => l.id !== log.id) });
                          healthAPI.getWorkouts(user.id).then(res => {
                            if (res.success) setHealthLogs(res.data);
                          });
                        }
                      }}>Ta bort</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* Redigera logg modal */}
            {editLogId && editLogForm && (
              <form
                className={styles.profileForm}
                onSubmit={async e => {
                  e.preventDefault();
                  if (!editLogForm.type || !editLogForm.date || !editLogForm.duration) return;
                  if (user?.id) {
                    await healthAPI.addWorkout(user.id, editLogForm);
                    healthAPI.getWorkouts(user.id).then(res => {
                      if (res.success) setHealthLogs(res.data);
                    });
                  }
                  setEditLogId(null);
                  setEditLogForm(null);
                  setSaveFeedback('Träningen är uppdaterad!');
                  setTimeout(() => setSaveFeedback(null), 2000);
                }}
              >
                <div>
                  <label>Typ av träning</label>
                  <select value={editLogForm.type} onChange={e => setEditLogForm((f: any) => ({ ...f, type: e.target.value }))} required title="Typ av träning">
                    <option value="">Välj...</option>
                    <option value="Gym">Gym</option>
                    <option value="Löpning">Löpning</option>
                    <option value="Cykling">Cykling</option>
                    <option value="Simning">Simning</option>
                    <option value="Annat">Annat</option>
                  </select>
                  {/* Lägg till title för tillgänglighet */}
                  <select value={editLogForm.type} onChange={e => setEditLogForm((f: any) => ({ ...f, type: e.target.value }))} required title="Typ av träning">
                  </select>
                </div>
                <div>
                  <label>Datum</label>
                  <input type="date" value={editLogForm.date} onChange={e => setEditLogForm((f: any) => ({ ...f, date: e.target.value }))} required placeholder="Datum" title="Datum" />
                  <input type="date" value={editLogForm.date} onChange={e => setEditLogForm((f: any) => ({ ...f, date: e.target.value }))} required placeholder="Datum" title="Datum" />
                </div>
                <div>
                  <label>Tid (minuter)</label>
                  <input type="number" min="1" value={editLogForm.duration} onChange={e => setEditLogForm((f: any) => ({ ...f, duration: e.target.value }))} required placeholder="Tid (minuter)" title="Tid (minuter)" />
                  <input type="number" min="1" value={editLogForm.duration} onChange={e => setEditLogForm((f: any) => ({ ...f, duration: e.target.value }))} required placeholder="Tid (minuter)" title="Tid (minuter)" />
                </div>
                <div>
                  <label>Känsla (1-5)</label>
                  <input type="number" min="1" max="5" value={editLogForm.feeling} onChange={e => setEditLogForm((f: any) => ({ ...f, feeling: parseInt(e.target.value) }))} required placeholder="Känsla (1-5)" title="Känsla (1-5)" />
                  <input type="number" min="1" max="5" value={editLogForm.feeling} onChange={e => setEditLogForm((f: any) => ({ ...f, feeling: parseInt(e.target.value) }))} required placeholder="Känsla (1-5)" title="Känsla (1-5)" />
                </div>
                <div>
                  <label>Intensitet (1-5)</label>
                  <input type="number" min="1" max="5" value={editLogForm.intensity || ''} onChange={e => setEditLogForm((f: any) => ({ ...f, intensity: parseInt(e.target.value) }))} required placeholder="Intensitet (1-5)" title="Intensitet (1-5)" />
                  <input type="number" min="1" max="5" value={editLogForm.intensity || ''} onChange={e => setEditLogForm((f: any) => ({ ...f, intensity: parseInt(e.target.value) }))} required placeholder="Intensitet (1-5)" title="Intensitet (1-5)" />
                </div>
                <div>
                  <label>Kommentar (valfritt)</label>
                  <input type="text" value={editLogForm.note || ''} onChange={e => setEditLogForm((f: any) => ({ ...f, note: e.target.value }))} placeholder="Anteckning" title="Anteckning" />
                  <input type="text" value={editLogForm.note || ''} onChange={e => setEditLogForm((f: any) => ({ ...f, note: e.target.value }))} placeholder="Anteckning" title="Anteckning" />
                </div>
                <button type="submit" className={styles.profileFormBtn}>Spara ändringar</button>
                <button type="button" className={styles.profileFormBtn + ' ' + styles.profileFormBtnCancel} onClick={() => { setEditLogId(null); setEditLogForm(null); }}>Avbryt</button>
              </form>
            )}
            {/* Formulär */}
            <button
              className={styles.profileLogToggleBtn}
              onClick={() => setShowTrainingForm(v => !v)}
            >
              {showTrainingForm ? 'Stäng formulär' : 'Logga ny träning'}
            </button>
            {showTrainingForm && (
              <form
                className={styles.profileForm}
                onSubmit={async e => {
                  e.preventDefault();
                  if (!form.type || !form.date || !form.duration || !form.feeling || !form.intensity) return;
                  const newLog = {
                    id: Date.now().toString(),
                    type: form.type,
                    date: form.date,
                    duration: parseInt(form.duration),
                    feeling: parseInt(form.feeling),
                    intensity: parseInt(form.intensity),
                    note: form.comment || '',
                  };
                  if (user?.id) {
                    await healthAPI.addWorkout(user.id, newLog);
                    healthAPI.getWorkouts(user.id).then(res => {
                      if (res.success) setHealthLogs(res.data);
                    });
                  }
                  setForm({ type: '', date: '', duration: '', comment: '', feeling: '', intensity: '' });
                  setShowTrainingForm(false);
                  setSaveFeedback('Träningen är sparad!');
                  setTimeout(() => setSaveFeedback(null), 2000);
                }}
              >
                <div>
                  <label className={styles.profileFormLabel}>Typ av träning</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className={styles.profileFormInput}
                    required
                    title="Typ av träning"
                  >
                    <option value="">Välj...</option>
                    <option value="Gym">Gym</option>
                    <option value="Löpning">Löpning</option>
                    <option value="Cykling">Cykling</option>
                    <option value="Simning">Simning</option>
                    <option value="Annat">Annat</option>
                  </select>
                </div>
                <div>
                  <label className={styles.profileFormLabel}>Datum</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className={styles.profileFormInput}
                    required
                    placeholder="Datum"
                    title="Datum"
                  />
                </div>
                <div>
                  <label className={styles.profileFormLabel}>Tid (minuter)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                    className={styles.profileFormInput}
                    required
                    placeholder="Tid (minuter)"
                    title="Tid (minuter)"
                  />
                </div>
                <div>
                  <label className={styles.profileFormLabel}>Känsla (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.feeling || ''}
                    onChange={e => setForm(f => ({ ...f, feeling: e.target.value }))}
                    className={styles.profileFormInput}
                    required
                    placeholder="Känsla (1-5)"
                    title="Känsla (1-5)"
                  />
                </div>
                <div>
                  <label className={styles.profileFormLabel}>Intensitet (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.intensity || ''}
                    onChange={e => setForm(f => ({ ...f, intensity: e.target.value }))}
                    className={styles.profileFormInput}
                    required
                    placeholder="Intensitet (1-5)"
                    title="Intensitet (1-5)"
                  />
                </div>
                <div>
                  <label className={styles.profileFormLabel}>Kommentar (valfritt)</label>
                  <input
                    type="text"
                    value={form.comment}
                    onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                    className={styles.profileFormInput}
                    placeholder="Anteckning"
                    title="Anteckning"
                  />
                </div>
                <button
                  type="submit"
                  className={styles.profileFormBtn}
                >
                  Spara träning
                </button>
              </form>
            )}
          </div>
        );
      case 'health':
        // Hälsologgar från backend
        return (
          <div className={styles.profileLogWrapper}>
            <h2 className={styles.profileLogHeader}>Hälsokort</h2>
            <button
              className={styles.profileFormBtn}
              onClick={() => setShowHealthForm(v => !v)}
            >
              {showHealthForm ? 'Stäng formulär' : 'Lägg till skada/sjukdom'}
            </button>
            {showHealthForm && (
              <form
                className={styles.profileForm}
                onSubmit={async e => {
                  e.preventDefault();
                  if (!healthForm.type || (!healthForm.date && !healthForm.dateStart)) return;
                  if (user?.id) {
                    await healthAPI.addWorkout(user.id, healthForm);
                    healthAPI.getWorkouts(user.id).then(res => {
                      if (res.success) setHealthLogs(res.data);
                    });
                  }
                  setHealthForm({ type: '', date: '', dateStart: '', dateEnd: '', rehabPlan: '', comment: '' });
                  setShowHealthForm(false);
                }}
              >
                <div>
                  <label>Typ av händelse</label>
                  <select value={healthForm.type} onChange={e => setHealthForm(f => ({ ...f, type: e.target.value }))} required title="Typ av händelse">
                    <option value="">Välj...</option>
                    <option value="Sjukdom">Sjukdom</option>
                    <option value="Skada">Skada</option>
                    <option value="Annat">Annat</option>
                  </select>
                </div>
                <div>
                  <label>Datum (för kortare händelse)</label>
                  <input type="date" value={healthForm.date || ''} onChange={e => setHealthForm(f => ({ ...f, date: e.target.value }))} placeholder="Datum" title="Datum" />
                </div>
                <div>
                  <label>Startdatum (för längre skada/sjukdom)</label>
                  <input type="date" value={healthForm.dateStart || ''} onChange={e => setHealthForm(f => ({ ...f, dateStart: e.target.value }))} placeholder="Startdatum" title="Startdatum" />
                </div>
                <div>
                  <label>Slutdatum (om avslutad)</label>
                  <input type="date" value={healthForm.dateEnd || ''} onChange={e => setHealthForm(f => ({ ...f, dateEnd: e.target.value }))} placeholder="Slutdatum" title="Slutdatum" />
                </div>
                <div>
                  <label>Rehabplan (valfritt)</label>
                  <input type="text" value={healthForm.rehabPlan || ''} onChange={e => setHealthForm(f => ({ ...f, rehabPlan: e.target.value }))} placeholder="Rehabplan" title="Rehabplan" />
                </div>
                <div>
                  <label>Kommentar (valfritt)</label>
                  <input type="text" value={healthForm.comment || ''} onChange={e => setHealthForm(f => ({ ...f, comment: e.target.value }))} placeholder="Kommentar" title="Kommentar" />
                </div>
                <button type="submit" className={styles.profileFormBtn}>Spara händelse</button>
              </form>
            )}
            {/* Historiklista med redigera/ta bort */}
            <h3 className={styles.profileLogHeader}>Historik</h3>
            {healthLogs.length === 0 ? (
              <div className={styles.profileLogEmpty}>Inga händelser loggade än.</div>
            ) : (
              <ul className={styles.profileLogList}>
                {healthLogs.map(log => (
                  <li key={log.id} className={styles.profileLogItem}>
                    <div className={styles.profileLogType}>{log.type}</div>
                    <div className={styles.profileLogMeta}>{log.dateStart ? `${log.dateStart} - ${log.dateEnd || 'pågående'}` : log.date}</div>
                    {log.rehabPlan && <div className={styles.profileLogNote}><b>Rehabplan:</b> {log.rehabPlan}</div>}
                    {log.comment && <div className={styles.profileLogNote}>{log.comment}</div>}
                    <div className={styles.profileLogActions}>
                      <button className={styles.profileLogBtn} onClick={() => {
                        setEditHealthId(log.id);
                        setEditHealthForm({ ...log });
                      }}>Redigera</button>
                      <button className={styles.profileLogBtn + ' ' + styles.profileLogBtnDelete} onClick={async () => {
                        if (user?.id) {
                          // Ta bort logg via backend (kan behöva API för delete)
                          // healthAPI.deleteWorkout(user.id, log.id); // Om API finns
                          setHealthLogs(logs => logs.filter((l: any) => l.id !== log.id));
                        }
                      }}>Ta bort</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* Redigera modal */}
            {editHealthId && editHealthForm && (
              <form
                className={styles.profileForm}
                onSubmit={async e => {
                  e.preventDefault();
                  if (!editHealthForm.type || (!editHealthForm.date && !editHealthForm.dateStart)) return;
                  if (user?.id) {
                    await healthAPI.addWorkout(user.id, editHealthForm);
                    healthAPI.getWorkouts(user.id).then(res => {
                      if (res.success) setHealthLogs(res.data);
                    });
                  }
                  setEditHealthId(null);
                  setEditHealthForm(null);
                }}
              >
                <div>
                  <label>Typ av händelse</label>
                  <select value={editHealthForm.type} onChange={e => setEditHealthForm((f: any) => ({ ...f, type: e.target.value }))} required title="Typ av händelse">
                    <option value="">Välj...</option>
                    <option value="Sjukdom">Sjukdom</option>
                    <option value="Skada">Skada</option>
                    <option value="Annat">Annat</option>
                  </select>
                </div>
                <div>
                  <label>Datum (för kortare händelse)</label>
                  <input type="date" value={editHealthForm.date || ''} onChange={e => setEditHealthForm((f: any) => ({ ...f, date: e.target.value }))} placeholder="Datum" title="Datum" />
                </div>
                <div>
                  <label>Startdatum (för längre skada/sjukdom)</label>
                  <input type="date" value={editHealthForm.dateStart || ''} onChange={e => setEditHealthForm((f: any) => ({ ...f, dateStart: e.target.value }))} placeholder="Startdatum" title="Startdatum" />
                </div>
                <div>
                  <label>Slutdatum (om avslutad)</label>
                  <input type="date" value={editHealthForm.dateEnd || ''} onChange={e => setEditHealthForm((f: any) => ({ ...f, dateEnd: e.target.value }))} placeholder="Slutdatum" title="Slutdatum" />
                </div>
                <div>
                  <label>Rehabplan (valfritt)</label>
                  <input type="text" value={editHealthForm.rehabPlan || ''} onChange={e => setEditHealthForm((f: any) => ({ ...f, rehabPlan: e.target.value }))} placeholder="Rehabplan" title="Rehabplan" />
                </div>
                <div>
                  <label>Kommentar (valfritt)</label>
                  <input type="text" value={editHealthForm.comment || ''} onChange={e => setEditHealthForm((f: any) => ({ ...f, comment: e.target.value }))} placeholder="Kommentar" title="Kommentar" />
                </div>
                <button type="submit" className={styles.profileFormBtn}>Spara ändringar</button>
                <button type="button" className={styles.profileFormBtn + ' ' + styles.profileFormBtnCancel} onClick={() => { setEditHealthId(null); setEditHealthForm(null); }}>Avbryt</button>
              </form>
            )}
          </div>
        );
      case 'stats':
        // Statistik från backend
        return (
          <div className={styles.profileLogWrapper}>
            <h2 className={styles.profileLogHeader}>Min statistik</h2>
            <div className={styles.profileStatsRow}>
              <div className={styles.profileStatsItem}>
                <div className={styles.profileStatsValue}>{stats?.goals ?? '-'}</div>
                <div className={styles.profileStatsLabel}>Mål</div>
              </div>
              <div className={styles.profileStatsItem}>
                <div className={styles.profileStatsValue}>{stats?.assists ?? '-'}</div>
                <div className={styles.profileStatsLabel}>Assist</div>
              </div>
              <div className={styles.profileStatsItem}>
                <div className={styles.profileStatsValue}>{stats?.plusMinus ?? '-'}</div>
                <div className={styles.profileStatsLabel}>+ / -</div>
              </div>
              <div className={styles.profileStatsItem}>
                <div className={styles.profileStatsValue}>{stats?.trainings ?? '-'}</div>
                <div className={styles.profileStatsLabel}>Träningar</div>
              </div>
              <div className={styles.profileStatsItem}>
                <div className={styles.profileStatsValue}>{stats?.gamesPlayed ?? '-'}</div>
                <div className={styles.profileStatsLabel}>Matcher</div>
              </div>
            </div>
          </div>
        );
      case 'badges':
        // Badges från backend
        return (
          <div className={styles.profileLogWrapper}>
            <h2 className={styles.profileLogHeader}>Mina badges</h2>
            {badges.length === 0 ? (
              <div className={styles.profileLogEmpty}>Du har inga badges ännu.</div>
            ) : (
              <ul className={styles.profileLogList}>
                {badges.map(badge => (
                  <li key={badge.id} className={styles.profileBadgeItem}>
                    <div className={styles.profileBadgeName}>{badge.name}</div>
                    <div className={styles.profileBadgeDesc}>{badge.description}</div>
                    <div className={styles.profileBadgeDate}>Datum: {badge.dateEarned}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className={styles.profileLogWrapper}>
            <h2 className={styles.profileLogHeader}>Inställningar</h2>
            <form
              className={styles.profileForm}
              onSubmit={e => {
                e.preventDefault();
                if (user) {
                  updateUser({
                    ...user,
                    name: editProfile.name,
                    email: editProfile.email,
                    phone: editProfile.phone,
                    position: editProfile.position,
                    jerseyNumber: editProfile.jerseyNumber,
                    birthday: editProfile.birthday,
                    aboutMe: editProfile.aboutMe,
                    preferences: {
                      ...user.preferences,
                      ...editProfile.preferences
                    }
                  });
                  // All profiluppdatering sker nu via backend
                }
                setSaveFeedback('Inställningar sparade!');
                setTimeout(() => setSaveFeedback(null), 2000);
              }}
            >
              <div>
                <label>Namn</label>
                <input type="text" value={editProfile.name || ''} onChange={e => setEditProfile((p: any) => ({ ...p, name: e.target.value }))} placeholder="Namn" title="Namn" />
              </div>
              <div>
                <label>E-post</label>
                <input type="email" value={editProfile.email || ''} onChange={e => setEditProfile((p: any) => ({ ...p, email: e.target.value }))} placeholder="E-post" title="E-post" />
              </div>
              <div>
                <label>Telefonnummer</label>
                <input type="text" value={editProfile.phone || ''} onChange={e => setEditProfile((p: any) => ({ ...p, phone: e.target.value }))} placeholder="Telefonnummer" title="Telefonnummer" />
              </div>
              <div>
                <label>Position</label>
                <input type="text" value={editProfile.position || ''} onChange={e => setEditProfile((p: any) => ({ ...p, position: e.target.value }))} placeholder="Position" title="Position" />
              </div>
              <div>
                <label>Tröjnummer</label>
                <input type="number" min="0" value={editProfile.jerseyNumber || ''} onChange={e => setEditProfile((p: any) => ({ ...p, jerseyNumber: e.target.value }))} placeholder="Tröjnummer" title="Tröjnummer" />
              </div>
              <div>
                <label>Födelsedag</label>
                <input type="date" value={editProfile.birthday || ''} onChange={e => setEditProfile((p: any) => ({ ...p, birthday: e.target.value }))} placeholder="Födelsedag" title="Födelsedag" />
              </div>
              <div>
                <label>Om mig</label>
                <textarea value={editProfile.aboutMe || ''} onChange={e => setEditProfile((p: any) => ({ ...p, aboutMe: e.target.value }))} rows={3} placeholder="Om mig" title="Om mig" />
              </div>
              <button type="submit" className={styles.profileFormBtn}>Spara inställningar</button>
              {saveFeedback && <div className={styles.profileFormFeedback}>{saveFeedback}</div>}
            </form>
          </div>
        );
      case 'team':
        const TeamInfo = React.lazy(() => import('./TeamInfo'));
        return (
          <React.Suspense fallback={<div className={styles.profileTeamLoading}>Laddar laginfo...</div>}>
            <TeamInfo />
          </React.Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.profileRoot}>
      <div className={styles.profileContainer}>
        {/* Profilkortet högst upp */}
        <ProfileCard user={{ ...user, profileImageUrl: user?.profileImageUrl }} />
        {/* Feedback vid sparad profil */}
        {saveFeedback && (
          <div className={styles.profileSuccessMsg}>
            {saveFeedback}
          </div>
        )}
        {/* Flikmeny */}
        <nav className={styles.profileTabs}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? styles.profileTabBtnActive : styles.profileTabBtn}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        {/* Flikinnehåll */}
        <div className={styles.profileTabContent}>
          {renderTabContent({ ...user, profileImageUrl: user?.profileImageUrl })}
        </div>
      </div>
    </div>
  );
};

export default Profile;