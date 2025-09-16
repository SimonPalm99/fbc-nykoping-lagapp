import { useState, useEffect } from 'react';
import React from 'react';
import { useUser } from '../context/UserContext';
import { healthAPI, statisticsAPI, gamificationAPI } from '../services/apiService';

const fbcTheme = {
  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a2e1a 100%)',
  headerBg: 'rgba(16,32,16,0.97)',
  text: {
    primary: '#F1F8E9',
    secondary: '#C8E6C9',
  },
  accent: '#22c55e',
  accentDark: '#14532d',
  accentLight: '#bbf7d0',
  cardBg: 'rgba(16,32,16,0.97)',
  gold: '#FFB300',
  white: '#fff'
};

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
    // Statistik hämtas direkt från user.statistics i JSX nedan
    return (
      <div style={{
        background: fbcTheme.cardBg,
        backdropFilter: 'blur(10px)',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px rgba(34,197,94,0.18), 0 2px 24px #0008',
        padding: '2rem 1.2rem 1.5rem 1.2rem',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.1rem',
        textAlign: 'center',
      }}>
        {/* Profilbild med fallback till initial */}
        <div style={{
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: fbcTheme.accentDark,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {user.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="Profilbild" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          ) : (
            <span style={{ fontSize: '2.5rem', color: fbcTheme.white, fontWeight: 'bold' }}>{user.name ? user.name[0].toUpperCase() : ''}</span>
          )}
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: fbcTheme.white, marginBottom: '0.5rem' }}>{user.name || '-'}</div>
        <div style={{ fontSize: '1.15rem', color: fbcTheme.text.primary, marginBottom: '0.5rem' }}>{user.email || '-'}</div>
        <div style={{ fontSize: '1.15rem', color: fbcTheme.text.primary, marginBottom: '0.5rem' }}>{user.phone || '-'}</div>
        <div style={{ fontSize: '1.15rem', color: fbcTheme.text.primary, marginBottom: '0.5rem' }}>{user.position || '-'}</div>
        <div style={{ fontSize: '1.05rem', color: fbcTheme.text.secondary, marginBottom: '0.5rem' }}>{user.jerseyNumber ? `${user.position || ''} #${user.jerseyNumber}` : ''}</div>
        <div style={{ fontSize: '1.05rem', color: fbcTheme.text.secondary, marginBottom: '0.5rem' }}>{user.birthday ? `Födelsedag: ${user.birthday}` : ''}</div>
        <div style={{ fontSize: '1.05rem', color: fbcTheme.text.secondary, marginBottom: '0.5rem' }}>{user.aboutMe || '-'}</div>
        {/* Statistik hämtas direkt från user.statistics i JSX nedan */}
        {user?.statistics && (
          <div style={{ display: 'flex', gap: '2.2rem', justifyContent: 'center', marginTop: '1.2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.7rem', fontWeight: 'bold', color: fbcTheme.accent }}>-</div>
              <div style={{ color: fbcTheme.text.secondary, fontSize: '1.08rem' }}>Mål</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.7rem', fontWeight: 'bold', color: fbcTheme.accent }}>-</div>
              <div style={{ color: fbcTheme.text.secondary, fontSize: '1.08rem' }}>Assist</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.7rem', fontWeight: 'bold', color: fbcTheme.accent }}>-</div>
              <div style={{ color: fbcTheme.text.secondary, fontSize: '1.08rem' }}>+ / -</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.7rem', fontWeight: 'bold', color: fbcTheme.accent }}>-</div>
              <div style={{ color: fbcTheme.text.secondary, fontSize: '1.08rem' }}>Träningar</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.7rem', fontWeight: 'bold', color: fbcTheme.accent }}>-</div>
              <div style={{ color: fbcTheme.text.secondary, fontSize: '1.08rem' }}>Matcher</div>
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
          <div style={{ maxWidth: 420, margin: '0 auto', padding: '1.2rem 0' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: fbcTheme.accent, marginBottom: '1rem' }}>Mina loggade träningar</h2>
            {/* Statistik */}
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1.2rem', background: 'rgba(34,197,94,0.07)', borderRadius: '1rem', padding: '1rem 0.7rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: fbcTheme.accent }}>{totalPass}</div>
                <div style={{ color: fbcTheme.text.secondary, fontSize: '1.05rem' }}>Antal pass</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: fbcTheme.accent }}>{totalMinutes}</div>
                <div style={{ color: fbcTheme.text.secondary, fontSize: '1.05rem' }}>Total tid (min)</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: fbcTheme.accent }}>{Object.keys(typeCount).length}</div>
                <div style={{ color: fbcTheme.text.secondary, fontSize: '1.05rem' }}>Typer</div>
              </div>
            </div>
            {/* Logglista med redigera/ta bort */}
            {logs.length === 0 ? (
              <div style={{ color: fbcTheme.text.secondary, marginBottom: '1.2rem' }}>Du har inte loggat någon träning än.</div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.2rem' }}>
                {logs.map((log: any) => (
                  <li key={log.id} style={{ background: fbcTheme.cardBg, borderRadius: '1rem', marginBottom: '0.7rem', padding: '0.9rem 1.2rem', color: fbcTheme.text.primary, boxShadow: '0 1px 8px #22c55e22', display: 'flex', flexDirection: 'column', gap: '0.3rem', position: 'relative' }}>
                    <div style={{ fontWeight: 'bold', color: fbcTheme.accent, fontSize: '1.08rem' }}>{log.type}</div>
                    <div style={{ fontSize: '0.98rem', color: fbcTheme.text.secondary }}>{log.date} • {log.duration || 0} min</div>
                    <div style={{ fontSize: '0.98rem', color: fbcTheme.text.secondary }}>Känsla: {log.feeling || '-'} / Intensitet: {log.intensity || '-'}</div>
                    {log.note && <div style={{ fontSize: '0.98rem', marginTop: 2 }}>{log.note}</div>}
                    <div style={{ display: 'flex', gap: '0.7rem', marginTop: '0.5rem' }}>
                      <button style={{ background: fbcTheme.accentDark, color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.3rem 0.8rem', cursor: 'pointer' }} onClick={() => {
                        setEditLogId(log.id);
                        setEditLogForm({ ...log });
                      }}>Redigera</button>
                      <button style={{ background: '#b91c1c', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.3rem 0.8rem', cursor: 'pointer' }} onClick={async () => {
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
                style={{ background: fbcTheme.cardBg, borderRadius: '1.2rem', padding: '1.2rem', marginBottom: '1rem', boxShadow: '0 1px 8px #22c55e22', color: fbcTheme.text.primary, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}
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
                  <select value={editLogForm.type} onChange={e => setEditLogForm((f: any) => ({ ...f, type: e.target.value }))} required>
                    <option value="">Välj...</option>
                    <option value="Gym">Gym</option>
                    <option value="Löpning">Löpning</option>
                    <option value="Cykling">Cykling</option>
                    <option value="Simning">Simning</option>
                    <option value="Annat">Annat</option>
                  </select>
                </div>
                <div>
                  <label>Datum</label>
                  <input type="date" value={editLogForm.date} onChange={e => setEditLogForm((f: any) => ({ ...f, date: e.target.value }))} required />
                </div>
                <div>
                  <label>Tid (minuter)</label>
                  <input type="number" min="1" value={editLogForm.duration} onChange={e => setEditLogForm((f: any) => ({ ...f, duration: e.target.value }))} required />
                </div>
                <div>
                  <label>Känsla (1-5)</label>
                  <input type="number" min="1" max="5" value={editLogForm.feeling} onChange={e => setEditLogForm((f: any) => ({ ...f, feeling: parseInt(e.target.value) }))} required />
                </div>
                <div>
                  <label>Intensitet (1-5)</label>
                  <input type="number" min="1" max="5" value={editLogForm.intensity || ''} onChange={e => setEditLogForm((f: any) => ({ ...f, intensity: parseInt(e.target.value) }))} required />
                </div>
                <div>
                  <label>Kommentar (valfritt)</label>
                  <input type="text" value={editLogForm.note || ''} onChange={e => setEditLogForm((f: any) => ({ ...f, note: e.target.value }))} />
                </div>
                <button type="submit" style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: '0.9rem', padding: '0.8rem 1.3rem', fontWeight: 'bold', fontSize: '1.08rem', cursor: 'pointer', marginTop: '0.5rem' }}>Spara ändringar</button>
                <button type="button" style={{ background: '#222', color: '#fff', border: 'none', borderRadius: '0.9rem', padding: '0.8rem 1.3rem', fontWeight: 'bold', fontSize: '1.08rem', cursor: 'pointer', marginTop: '0.5rem' }} onClick={() => { setEditLogId(null); setEditLogForm(null); }}>Avbryt</button>
              </form>
            )}
            {/* Formulär */}
            <button
              style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: '0.9rem', padding: '0.8rem 1.3rem', fontWeight: 'bold', fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 1px 8px #22c55e33', marginBottom: '1rem', marginTop: '0.5rem' }}
              onClick={() => setShowTrainingForm(v => !v)}
            >
              {showTrainingForm ? 'Stäng formulär' : 'Logga ny träning'}
            </button>
            {showTrainingForm && (
              <form
                style={{ background: fbcTheme.cardBg, borderRadius: '1.2rem', padding: '1.2rem', marginTop: '0.5rem', boxShadow: '0 1px 8px #22c55e22', color: fbcTheme.text.primary, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}
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
                  <label style={{ display: 'block', marginBottom: 2, fontWeight: 500 }}>Typ av träning</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '0.7rem', border: `1.5px solid ${fbcTheme.accent}`, background: fbcTheme.cardBg, color: fbcTheme.text.primary, fontSize: '1.05rem' }}
                    required
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
                  <label style={{ display: 'block', marginBottom: 2, fontWeight: 500 }}>Datum</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '0.7rem', border: `1.5px solid ${fbcTheme.accent}`, background: fbcTheme.cardBg, color: fbcTheme.text.primary, fontSize: '1.05rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 2, fontWeight: 500 }}>Tid (minuter)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '0.7rem', border: `1.5px solid ${fbcTheme.accent}`, background: fbcTheme.cardBg, color: fbcTheme.text.primary, fontSize: '1.05rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 2, fontWeight: 500 }}>Känsla (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.feeling || ''}
                    onChange={e => setForm(f => ({ ...f, feeling: e.target.value }))}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '0.7rem', border: `1.5px solid ${fbcTheme.accent}`, background: fbcTheme.cardBg, color: fbcTheme.text.primary, fontSize: '1.05rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 2, fontWeight: 500 }}>Intensitet (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.intensity || ''}
                    onChange={e => setForm(f => ({ ...f, intensity: e.target.value }))}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '0.7rem', border: `1.5px solid ${fbcTheme.accent}`, background: fbcTheme.cardBg, color: fbcTheme.text.primary, fontSize: '1.05rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 2, fontWeight: 500 }}>Kommentar (valfritt)</label>
                  <input
                    type="text"
                    value={form.comment}
                    onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '0.7rem', border: `1.5px solid ${fbcTheme.accent}`, background: fbcTheme.cardBg, color: fbcTheme.text.primary, fontSize: '1.05rem' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: '0.9rem', padding: '0.8rem 1.3rem', fontWeight: 'bold', fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 1px 8px #22c55e33', marginTop: '0.5rem' }}
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
          <div style={{ maxWidth: 420, margin: '0 auto', padding: '1.2rem 0' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: fbcTheme.accent, marginBottom: '1rem' }}>Hälsokort</h2>
            <button
              style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: '0.9rem', padding: '0.8rem 1.3rem', fontWeight: 'bold', fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 1px 8px #22c55e33', marginBottom: '1rem', marginTop: '0.5rem' }}
              onClick={() => setShowHealthForm(v => !v)}
            >
              {showHealthForm ? 'Stäng formulär' : 'Lägg till skada/sjukdom'}
            </button>
            {showHealthForm && (
              <form
                style={{ background: fbcTheme.cardBg, borderRadius: '1.2rem', padding: '1.2rem', marginTop: '0.5rem', boxShadow: '0 1px 8px #22c55e22', color: fbcTheme.text.primary, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}
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
                  <select value={healthForm.type} onChange={e => setHealthForm(f => ({ ...f, type: e.target.value }))} required>
                    <option value="">Välj...</option>
                    <option value="Sjukdom">Sjukdom</option>
                    <option value="Skada">Skada</option>
                    <option value="Annat">Annat</option>
                  </select>
                </div>
                <div>
                  <label>Datum (för kortare händelse)</label>
                  <input type="date" value={healthForm.date || ''} onChange={e => setHealthForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <label>Startdatum (för längre skada/sjukdom)</label>
                  <input type="date" value={healthForm.dateStart || ''} onChange={e => setHealthForm(f => ({ ...f, dateStart: e.target.value }))} />
                </div>
                <div>
                  <label>Slutdatum (om avslutad)</label>
                  <input type="date" value={healthForm.dateEnd || ''} onChange={e => setHealthForm(f => ({ ...f, dateEnd: e.target.value }))} />
                </div>
                <div>
                  <label>Rehabplan (valfritt)</label>
                  <input type="text" value={healthForm.rehabPlan || ''} onChange={e => setHealthForm(f => ({ ...f, rehabPlan: e.target.value }))} />
                </div>
                <div>
                  <label>Kommentar (valfritt)</label>
                  <input type="text" value={healthForm.comment || ''} onChange={e => setHealthForm(f => ({ ...f, comment: e.target.value }))} />
                </div>
                <button type="submit" style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: '0.9rem', padding: '0.8rem 1.3rem', fontWeight: 'bold', fontSize: '1.08rem', cursor: 'pointer', marginTop: '0.5rem' }}>Spara händelse</button>
              </form>
            )}
            {/* Historiklista med redigera/ta bort */}
            <h3 style={{ fontSize: '1.08rem', color: fbcTheme.accent, margin: '1.2rem 0 0.7rem 0' }}>Historik</h3>
            {healthLogs.length === 0 ? (
              <div style={{ color: fbcTheme.text.secondary, marginBottom: '1.2rem' }}>Inga händelser loggade än.</div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.2rem' }}>
                {healthLogs.map(log => (
                  <li key={log.id} style={{ background: fbcTheme.cardBg, borderRadius: '1rem', marginBottom: '0.7rem', padding: '0.9rem 1.2rem', color: fbcTheme.text.primary, boxShadow: '0 1px 8px #22c55e22', display: 'flex', flexDirection: 'column', gap: '0.3rem', position: 'relative' }}>
                    <div style={{ fontWeight: 'bold', color: fbcTheme.accent, fontSize: '1.08rem' }}>{log.type}</div>
                    <div style={{ fontSize: '0.98rem', color: fbcTheme.text.secondary }}>{log.dateStart ? `${log.dateStart} - ${log.dateEnd || 'pågående'}` : log.date}</div>
                    {log.rehabPlan && <div style={{ fontSize: '0.98rem', marginTop: 2 }}><b>Rehabplan:</b> {log.rehabPlan}</div>}
                    {log.comment && <div style={{ fontSize: '0.98rem', marginTop: 2 }}>{log.comment}</div>}
                    <div style={{ display: 'flex', gap: '0.7rem', marginTop: '0.5rem' }}>
                      <button style={{ background: fbcTheme.accentDark, color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.3rem 0.8rem', cursor: 'pointer' }} onClick={() => {
                        setEditHealthId(log.id);
                        setEditHealthForm({ ...log });
                      }}>Redigera</button>
                      <button style={{ background: '#b91c1c', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.3rem 0.8rem', cursor: 'pointer' }} onClick={async () => {
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
                style={{ background: fbcTheme.cardBg, borderRadius: '1.2rem', padding: '1.2rem', marginBottom: '1rem', boxShadow: '0 1px 8px #22c55e22', color: fbcTheme.text.primary, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}
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
                  <select value={editHealthForm.type} onChange={e => setEditHealthForm((f: any) => ({ ...f, type: e.target.value }))} required>
                    <option value="">Välj...</option>
                    <option value="Sjukdom">Sjukdom</option>
                    <option value="Skada">Skada</option>
                    <option value="Annat">Annat</option>
                  </select>
                </div>
                <div>
                  <label>Datum (för kortare händelse)</label>
                  <input type="date" value={editHealthForm.date || ''} onChange={e => setEditHealthForm((f: any) => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <label>Startdatum (för längre skada/sjukdom)</label>
                  <input type="date" value={editHealthForm.dateStart || ''} onChange={e => setEditHealthForm((f: any) => ({ ...f, dateStart: e.target.value }))} />
                </div>
                <div>
                  <label>Slutdatum (om avslutad)</label>
                  <input type="date" value={editHealthForm.dateEnd || ''} onChange={e => setEditHealthForm((f: any) => ({ ...f, dateEnd: e.target.value }))} />
                </div>
                <div>
                  <label>Rehabplan (valfritt)</label>
                  <input type="text" value={editHealthForm.rehabPlan || ''} onChange={e => setEditHealthForm((f: any) => ({ ...f, rehabPlan: e.target.value }))} />
                </div>
                <div>
                  <label>Kommentar (valfritt)</label>
                  <input type="text" value={editHealthForm.comment || ''} onChange={e => setEditHealthForm((f: any) => ({ ...f, comment: e.target.value }))} />
                </div>
                <button type="submit" style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: '0.9rem', padding: '0.8rem 1.3rem', fontWeight: 'bold', fontSize: '1.08rem', cursor: 'pointer', marginTop: '0.5rem' }}>Spara ändringar</button>
                <button type="button" style={{ background: '#222', color: '#fff', border: 'none', borderRadius: '0.9rem', padding: '0.8rem 1.3rem', fontWeight: 'bold', fontSize: '1.08rem', cursor: 'pointer', marginTop: '0.5rem' }} onClick={() => { setEditHealthId(null); setEditHealthForm(null); }}>Avbryt</button>
              </form>
            )}
          </div>
        );
      case 'stats':
        // Statistik från backend
        return (
          <div style={{ maxWidth: 420, margin: '0 auto', padding: '1.2rem 0' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: fbcTheme.accent, marginBottom: '1rem' }}>Min statistik</h2>
            <div style={{ display: 'flex', gap: '2.2rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.7rem', fontWeight: 'bold', color: fbcTheme.accent }}>{stats?.goals ?? '-'}</div>
                <div style={{ color: fbcTheme.text.secondary, fontSize: '1.08rem' }}>Mål</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.7rem', fontWeight: 'bold', color: fbcTheme.accent }}>{stats?.assists ?? '-'}</div>
                <div style={{ color: fbcTheme.text.secondary, fontSize: '1.08rem' }}>Assist</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.7rem', fontWeight: 'bold', color: fbcTheme.accent }}>{stats?.plusMinus ?? '-'}</div>
                <div style={{ color: fbcTheme.text.secondary, fontSize: '1.08rem' }}>+ / -</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.7rem', fontWeight: 'bold', color: fbcTheme.accent }}>{stats?.trainings ?? '-'}</div>
                <div style={{ color: fbcTheme.text.secondary, fontSize: '1.08rem' }}>Träningar</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.7rem', fontWeight: 'bold', color: fbcTheme.accent }}>{stats?.gamesPlayed ?? '-'}</div>
                <div style={{ color: fbcTheme.text.secondary, fontSize: '1.08rem' }}>Matcher</div>
              </div>
            </div>
            {/* Här kan fler statistikfält läggas till när riktig data finns */}
          </div>
        );
      case 'badges':
        // Badges från backend
        return (
          <div style={{ maxWidth: 420, margin: '0 auto', padding: '1.2rem 0' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: fbcTheme.accent, marginBottom: '1rem' }}>Mina badges</h2>
            {badges.length === 0 ? (
              <div style={{ color: fbcTheme.text.secondary, fontSize: '1.08rem', marginTop: '1.2rem' }}>
                Du har inga badges ännu.
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.2rem' }}>
                {badges.map(badge => (
                  <li key={badge.id} style={{ background: fbcTheme.cardBg, borderRadius: '1rem', marginBottom: '0.7rem', padding: '0.9rem 1.2rem', color: fbcTheme.text.primary, boxShadow: '0 1px 8px #22c55e22', display: 'flex', flexDirection: 'column', gap: '0.3rem', position: 'relative' }}>
                    <div style={{ fontWeight: 'bold', color: fbcTheme.gold, fontSize: '1.08rem' }}>{badge.name}</div>
                    <div style={{ fontSize: '0.98rem', color: fbcTheme.text.secondary }}>{badge.description}</div>
                    <div style={{ fontSize: '0.98rem', color: fbcTheme.text.secondary }}>Datum: {badge.dateEarned}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case 'settings':
        return (
          <div style={{ maxWidth: 420, margin: '0 auto', padding: '1.2rem 0' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: fbcTheme.accent, marginBottom: '1rem' }}>Inställningar</h2>
            <form
              style={{ background: fbcTheme.cardBg, borderRadius: '1.2rem', padding: '1.2rem', marginTop: '0.5rem', boxShadow: '0 1px 8px #22c55e22', color: fbcTheme.text.primary, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}
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
                <input type="text" value={editProfile.name || ''} onChange={e => setEditProfile((p: any) => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label>E-post</label>
                <input type="email" value={editProfile.email || ''} onChange={e => setEditProfile((p: any) => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label>Telefonnummer</label>
                <input type="text" value={editProfile.phone || ''} onChange={e => setEditProfile((p: any) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <label>Position</label>
                <input type="text" value={editProfile.position || ''} onChange={e => setEditProfile((p: any) => ({ ...p, position: e.target.value }))} />
              </div>
              <div>
                <label>Tröjnummer</label>
                <input type="number" min="0" value={editProfile.jerseyNumber || ''} onChange={e => setEditProfile((p: any) => ({ ...p, jerseyNumber: e.target.value }))} />
              </div>
              <div>
                <label>Födelsedag</label>
                <input type="date" value={editProfile.birthday || ''} onChange={e => setEditProfile((p: any) => ({ ...p, birthday: e.target.value }))} />
              </div>
              <div>
                <label>Om mig</label>
                <textarea value={editProfile.aboutMe || ''} onChange={e => setEditProfile((p: any) => ({ ...p, aboutMe: e.target.value }))} rows={3} />
              </div>
              <button type="submit" style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: '0.9rem', padding: '0.8rem 1.3rem', fontWeight: 'bold', fontSize: '1.08rem', cursor: 'pointer', marginTop: '0.5rem' }}>Spara inställningar</button>
              {saveFeedback && <div style={{ color: fbcTheme.accent, marginTop: '0.7rem', fontWeight: 'bold' }}>{saveFeedback}</div>}
            </form>
          </div>
        );
      case 'team':
        const TeamInfo = React.lazy(() => import('./TeamInfo'));
        return (
          <React.Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Laddar laginfo...</div>}>
            <TeamInfo />
          </React.Suspense>
        );
      default:
        return null;
    }
  };

  return (
  <div style={{ minHeight: '100vh', background: fbcTheme.background, color: fbcTheme.text.primary, padding: '2rem 0.5rem', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Profilkortet högst upp */}
        <ProfileCard user={{ ...user, profileImageUrl: user?.profileImageUrl }} />
        {/* Feedback vid sparad profil */}
        {saveFeedback && (
          <div style={{ position: 'fixed', top: 32, right: 32, background: '#22c55e', color: '#fff', padding: '1rem 2rem', borderRadius: '1rem', fontWeight: 700, fontSize: '1.08rem', boxShadow: '0 2px 8px #22c55e55', zIndex: 9999, animation: 'fadeInProfile 0.5s' }}>
            {saveFeedback}
          </div>
        )}
        {/* Flikmeny */}
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: activeTab === tab.key ? 'rgba(34,197,94,0.95)' : 'rgba(34,34,34,0.85)',
                color: activeTab === tab.key ? '#fff' : fbcTheme.text.secondary,
                border: 'none',
                borderRadius: '0.7rem',
                padding: '0.6rem 1.2rem',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: activeTab === tab.key ? '0 1px 6px #22c55e33' : 'none',
                transition: 'background 0.2s',
                backdropFilter: 'blur(6px)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        {/* Flikinnehåll */}
        <div style={{ animation: 'fadeInProfile 0.7s' }}>
          {renderTabContent({ ...user, profileImageUrl: user?.profileImageUrl })}
        </div>
      </div>
      {/* Responsiv design */}
      <style>{`
        @media (max-width: 600px) {
          .profile-card, .profile-content { max-width: 98vw !important; padding: 0.5rem !important; }
          nav { flex-direction: column !important; gap: 0.2rem !important; }
        }
        @keyframes fadeInProfile {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};

export default Profile;