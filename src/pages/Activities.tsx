import React, { useState, useEffect } from 'react';
import './Activities.css';
import { useLocation } from 'react-router-dom';
import { useTitle } from '../hooks/useTitle';
// ...existing code...
import { activitiesAPI } from '../services/apiService';
import { Activity, ActivityComment } from '../types/activity';
import { useUser } from '../context/UserContext';

const fbcTheme = {
  background: 'linear-gradient(135deg, #0A0A0A 0%, #0D1B0D 30%, #1B2E1B 100%)',
  cardBg: 'rgba(16, 32, 16, 0.97)',
  accent: '#2E7D32',
  accentDark: '#181f2a',
  accentLight: '#fff',
  text: {
    primary: '#F1F8E9',
    secondary: '#C8E6C9',
    dark: '#181f2a',
  }
};

const Activities: React.FC = () => {
  const { user } = useUser();
  // Redigera aktivitet state
  const [showAddTab, setShowAddTab] = useState(false);
  useTitle('Aktiviteter - FBC Nyköping');
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [typeFilter, setTypeFilter] = useState<'alla' | 'match' | 'träning' | 'annat'>('alla');
  const [newCustom, setNewCustom] = useState({ title: '', date: '', startTime: '', location: '', description: '' });
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const scrollToId = params.get('id');
  const activityRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  // const { user } = useAuth(); // Oanvänd variabel borttagen
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<Record<string, string>>({});
  // Redigera aktivitet state
  const [editActivityId, setEditActivityId] = React.useState<string | null>(null);
  const [editActivityForm, setEditActivityForm] = React.useState<Partial<Activity> | null>(null);

  // Hämta aktiviteter från API vid start
  useEffect(() => {
    setLoading(true);
    activitiesAPI.getAll()
      .then(res => {
        console.log('API-svar /activities:', res);
        if (res && Array.isArray(res.data)) {
          setActivities(res.data.length > 0 ? res.data : []);
        } else {
          setActivities([]);
          setError('Kunde inte hämta aktiviteter från server.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('API-fel /activities:', err);
        setError('Kunde inte hämta aktiviteter från server. Visar lokala aktiviteter.');
        setActivities([]);
        setLoading(false);
      });
  }, []);
  // Sort all activities by date (ascending)
  let allActivities = [...activities];
  if (filter === 'past') {
    allActivities = allActivities.sort((a, b) => {
      const dateA = new Date(a.date + (a.startTime ? 'T' + a.startTime : ''));
      const dateB = new Date(b.date + (b.startTime ? 'T' + b.startTime : ''));
      return dateB.getTime() - dateA.getTime(); // Nyaste först
    });
  } else {
    allActivities = allActivities.sort((a, b) => {
      const dateA = new Date(a.date + (a.startTime ? 'T' + a.startTime : ''));
      const dateB = new Date(b.date + (b.startTime ? 'T' + b.startTime : ''));
      return dateA.getTime() - dateB.getTime(); // Äldsta först
    });
  }
  function stripTime(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  const todayDate = stripTime(new Date());
  allActivities.forEach(a => {
    console.log('Aktivitet:', a.title, 'Datum:', a.date, 'Typ:', a.type);
  });
  console.log('Datum idag:', todayDate);
  // Visa ALLA aktiviteter oavsett datum och typ
  const filteredActivities = allActivities;
  console.log('Alla aktiviteter:', allActivities.length, 'Filtrerade:', filteredActivities.length);

  // Hantera expanderade kort
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // Hantera kommentarer per aktivitet
  const [activityComments, setActivityComments] = useState<Record<string, ActivityComment[]>>({});
  // Hantera inputfält per aktivitet
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Initiera kommentarer från activities (hämtas från backend)
  React.useEffect(() => {
    const initial: Record<string, ActivityComment[]> = {};
    allActivities.forEach(a => {
      initial[a.id] = a.comments || [];
    });
    setActivityComments(initial);
  }, [allActivities.length, allActivities.map(a => a.comments).join()]);

  // Scroll to activity if id is present
  React.useEffect(() => {
    if (scrollToId && activityRefs.current[scrollToId]) {
      activityRefs.current[scrollToId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [scrollToId, filteredActivities]);

  return (
    <div style={{ minHeight: '100vh', background: fbcTheme.background, color: fbcTheme.text.primary, padding: '2rem 0.5rem', transition: 'background 0.5s' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0.5rem' }}>
        {/* Välkomsttext */}
        <div style={{ textAlign: 'center', fontWeight: 900, fontSize: '2.1rem', color: fbcTheme.accent, marginBottom: '0.7rem', letterSpacing: '1px' }}>
          Välkommen till FBC Nyköpings aktivitetslista!
        </div>
        {/* Loading/Error */}
        {loading && (
          <div style={{ background: fbcTheme.cardBg, color: fbcTheme.accent, borderRadius: '1rem', padding: '1rem', textAlign: 'center', marginBottom: '1rem', fontWeight: 600 }}>
            Laddar aktiviteter...
          </div>
        )}
        {error && (
          <div style={{ background: '#e53935', color: '#fff', borderRadius: '1rem', padding: '1rem', textAlign: 'center', marginBottom: '1rem', fontWeight: 600 }}>
            {error}
          </div>
        )}
                            {/* Felaktig knapp och error-div borttagen. Kommentarsflöde hanteras i aktivitetskortet. */}
        <div style={{ display: 'flex', gap: '0.7rem', marginBottom: '1.2rem', alignItems: 'center' }}>
          <button
            style={{
              background: filter === 'past' && !showAddTab ? fbcTheme.accent : 'transparent',
              color: filter === 'past' && !showAddTab ? fbcTheme.accentLight : fbcTheme.accent,
              border: `2px solid ${fbcTheme.accent}`,
              borderRadius: '1rem',
              padding: '0.5rem 1.2rem',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: filter === 'past' && !showAddTab ? '0 2px 8px #2E7D3233' : 'none',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onClick={() => setFilter(filter === 'past' ? 'upcoming' : 'past')}
            aria-label="Växla mellan kommande och föregående"
          >
            {filter === 'past' ? 'Kommande' : 'Föregående'}
          </button>
          {/* Typfilter */}
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)} style={{
            background: fbcTheme.cardBg,
            color: fbcTheme.text.primary,
            border: `2px solid ${fbcTheme.accent}`,
            borderRadius: '1rem',
            padding: '0.5rem 1.2rem',
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: '0 2px 8px #2E7D3233',
            transition: 'all 0.2s',
            outline: 'none',
          }}>
            <option value="alla">Alla typer</option>
            <option value="match">Matcher</option>
            <option value="träning">Träningar</option>
            <option value="annat">Annat</option>
          </select>
          <button
            onClick={() => setShowAddTab(true)}
            style={{
              background: showAddTab ? fbcTheme.accent : 'transparent',
              color: showAddTab ? fbcTheme.accentLight : fbcTheme.accent,
              border: `2px solid ${fbcTheme.accent}`,
              borderRadius: '1rem',
              padding: '0.5rem 1.2rem',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: showAddTab ? '0 2px 8px #2E7D3233' : 'none',
              transition: 'all 0.2s',
              marginLeft: '0.5rem',
              cursor: 'pointer',
            }}
            aria-label="Lägg till aktivitet"
          >
            Lägg till aktivitet
          </button>
        </div>
        {/* Aktivitetslistan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', transition: 'all 0.5s' }}>
          <pre style={{ background: '#222', color: '#fff', padding: '1rem', borderRadius: '1rem', marginBottom: '1rem', fontSize: '0.95rem', maxHeight: 300, overflow: 'auto' }}>
            {JSON.stringify(activities, null, 2)}
          </pre>
          {filteredActivities.length === 0 ? (
            <div style={{ background: fbcTheme.cardBg, borderRadius: '1.2rem', padding: '2rem', textAlign: 'center', color: fbcTheme.text.secondary, boxShadow: '0 2px 12px #22c55e22' }}>
              Inga aktiviteter att visa
            </div>
          ) : (
            !showAddTab ? (
              filteredActivities.map(activity => {
                const isMatch = activity.type === "match";
                const isTraining = activity.type === "träning";
                const expanded = expandedId === activity.id;
                const comments = activityComments[activity.id] || [];
                const commentInput = commentInputs[activity.id] || "";
                const activityId = activity.id;
                return (
                  <div
                    key={activityId}
                    ref={el => { activityRefs.current[activityId] = el; }}
                    className={`activity-card${expanded ? ' expanded' : ''}`}
                    onClick={() => setExpandedId(expanded ? null : activityId)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.02rem', color: isMatch ? fbcTheme.accent : fbcTheme.text.primary }}>{activity.title}</div>
                      <span style={{ color: fbcTheme.text.secondary, fontSize: '0.92rem', fontWeight: 500 }}>
                        {activity.date}{activity.startTime ? ` • ${activity.startTime}` : ''}
                      </span>
                      <span style={{ color: fbcTheme.text.secondary, fontSize: '0.92rem' }}>{activity.location}</span>
                      {/* Ledare kan redigera/ta bort allt, spelare bara sina egna */}
                      {(user?.role === 'leader' || activity.createdBy === user?.id) && (
                        <>
                          <button
                            style={{ marginLeft: 'auto', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.3rem 1rem', fontWeight: 600, cursor: 'pointer' }}
                            onClick={e => {
                              e.stopPropagation();
                              setEditActivityId(activity.id);
                              setEditActivityForm({ ...activity });
                            }}
                          >Redigera</button>
                          <button
                            style={{ marginLeft: '0.5rem', background: '#e53935', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.3rem 1rem', fontWeight: 600, cursor: 'pointer' }}
                            onClick={async e => {
                              e.stopPropagation();
                              const res = await activitiesAPI.delete(activity.id);
                              if (res.success) {
                                setActivities(prev => prev.filter(a => a.id !== activity.id));
                              } else {
                                // setError('Kunde inte ta bort aktivitet från server.');
                              }
                            }}
                          >Ta bort</button>
                        </>
                      )}
                    </div>
  {/* Redigera aktivitet modal/form */}
  {editActivityId && editActivityForm && (
    <form
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onSubmit={async e => {
        e.preventDefault();
        if (!editActivityForm.title || !editActivityForm.date) return;
        const res = await activitiesAPI.update(editActivityId, editActivityForm);
        if (res.success && res.data) {
          setActivities(prev => prev.map(a => a.id === editActivityId ? res.data : a));
          setEditActivityId(null);
          setEditActivityForm(null);
        } else {
          // setError('Kunde inte uppdatera aktivitet på servern.');
        }
      }}
    >
      <div style={{ background: fbcTheme.cardBg, borderRadius: '1.2rem', padding: '2rem', minWidth: 320, boxShadow: '0 2px 12px #22c55e22', color: fbcTheme.text.primary, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ color: fbcTheme.accent, fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Redigera aktivitet</h2>
        <input placeholder="Titel" value={editActivityForm.title || ''} onChange={e => setEditActivityForm(f => ({ ...f!, title: e.target.value }))} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
        <input type="date" value={editActivityForm.date || ''} onChange={e => setEditActivityForm(f => ({ ...f!, date: e.target.value }))} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
        <input placeholder="Starttid" value={editActivityForm.startTime || ''} onChange={e => setEditActivityForm(f => ({ ...f!, startTime: e.target.value }))} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
        <input placeholder="Plats" value={editActivityForm.location || ''} onChange={e => setEditActivityForm(f => ({ ...f!, location: e.target.value }))} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
        <input placeholder="Beskrivning" value={editActivityForm.description || ''} onChange={e => setEditActivityForm(f => ({ ...f!, description: e.target.value }))} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
        <select value={editActivityForm.type || ''} onChange={e => setEditActivityForm(f => ({ ...f!, type: e.target.value as Activity["type"] }))} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }}>
          <option value="">Välj typ...</option>
          <option value="träning">Träning</option>
          <option value="match">Match</option>
          <option value="annat">Annat</option>
        </select>
        <button type="submit" style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>Spara ändringar</button>
        <button type="button" style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }} onClick={() => { setEditActivityId(null); setEditActivityForm(null); }}>Avbryt</button>
      </div>
    </form>
  )}
                    {/* Visa senaste kommentar om någon finns, även på komprimerat kort */}
                    {((isTraining && comments.length > 0) || (isMatch && activity.leaderNotes)) && (
                      <div style={{ color: fbcTheme.text.primary, background: 'rgba(34,51,34,0.13)', borderRadius: '0.4rem', padding: '0.2rem 0.7rem', marginTop: '0.2rem', fontSize: '0.93rem', fontStyle: 'italic', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                        {isTraining ? comments[comments.length - 1]?.text : activity.leaderNotes}
                      </div>
                    )}
                    {expanded && (
                      <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.2rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', boxShadow: '0 2px 8px #2E7D3222' }}>
                        <div style={{ color: fbcTheme.text.secondary }}>{activity.description}</div>
                        {/* Kommentarer och input för träning */}
                        {isTraining && (
                          <div style={{ marginTop: '0.7rem' }}>
                            <div style={{ fontWeight: 600, color: fbcTheme.accent, marginBottom: '0.3rem' }}>Kommentarer</div>
                            {comments.length > 0 && comments.map((c, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', color: fbcTheme.text.primary, background: 'rgba(34,51,34,0.18)', borderRadius: '0.4rem', padding: '0.3rem 0.7rem', marginBottom: '0.2rem', fontSize: '0.95rem' }}>
                                <span style={{ flex: 1 }}>{c.text}</span>
                                {c.userId === "me" && (
                                  <button
                                    style={{ marginLeft: '0.7rem', background: '#e53935', color: '#fff', border: 'none', borderRadius: '0.3rem', padding: '0.2rem 0.7rem', fontSize: '0.92rem', cursor: 'pointer' }}
                                    onClick={e => {
                                      e.stopPropagation();
                                      setActivityComments(prev => ({
                                        ...prev,
                                        [activity.id]: (prev[activity.id] ?? []).filter((_, idx) => idx !== i)
                                      }));
                                    }}
                                  >Ta bort</button>
                                )}
                              </div>
                            ))}
                            <input
                              type="text"
                              value={commentInput}
                              onChange={e => setCommentInputs(inputs => ({ ...inputs, [activity.id]: e.target.value }))}
                              placeholder="Lägg till kommentar..."
                              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.4rem', border: `1px solid ${fbcTheme.accent}`, marginTop: '0.3rem', fontSize: '0.95rem' }}
                              onClick={e => e.stopPropagation()}
                            />
                            <button
                              style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: '0.4rem', padding: '0.4rem 1.2rem', fontWeight: 600, marginTop: '0.3rem', cursor: 'pointer', fontSize: '0.95rem' }}
                              onClick={async e => {
                                e.stopPropagation();
                                if (commentInput.trim()) {
                                  setCommentError(errs => ({ ...errs, [activity.id]: '' }));
                                  const newComment: ActivityComment = {
                                    id: Math.random().toString(36).slice(2),
                                    userId: user?.id || "me",
                                    text: commentInput,
                                    timestamp: new Date().toISOString()
                                  };
                                  const res = await activitiesAPI.addComment(activity.id, newComment);
                                  if (res.success && res.data && res.data.comments) {
                                    setActivityComments(prev => ({
                                      ...prev,
                                      [activity.id]: res.data.comments
                                    }));
                                    setCommentInputs(inputs => ({ ...inputs, [activity.id]: "" }));
                                  } else {
                                    setCommentError(errs => ({ ...errs, [activity.id]: 'Kunde inte spara kommentar. Prova igen.' }));
                                  }
                                }
                              }}
                            >Skicka</button>
                            {commentError[activity.id] && (
                              <div style={{ color: '#e53935', marginTop: '0.3rem', fontWeight: 600 }}>{commentError[activity.id]}</div>
                            )}
                          </div>
                        )}
                        {/* FBC-stil: Matchinfo och laguttagning */}
                        {isMatch && (
                          <div style={{ marginTop: '1.2rem', background: 'rgba(34,51,34,0.10)', borderRadius: '1rem', padding: '1.2rem', boxShadow: '0 2px 8px #2E7D3222' }}>
                            <div style={{ fontWeight: 900, fontSize: '1.15rem', color: fbcTheme.accent, marginBottom: '0.7rem', letterSpacing: '1px' }}>Matchinfo</div>
                            {activity.matchInfo ? (
                              <div style={{ color: fbcTheme.text.primary, fontSize: '1.05rem', marginBottom: '1.1rem', whiteSpace: 'pre-line' }}>{activity.matchInfo}</div>
                            ) : (
                              <div style={{ color: fbcTheme.text.secondary, fontSize: '1.05rem', marginBottom: '1.1rem' }}>Ingen matchinfo ännu.</div>
                            )}
                            {/* Visa bilder/dokument om de finns */}
                            {activity.matchFiles && activity.matchFiles.length > 0 && (
                              <div style={{ marginBottom: '1.1rem' }}>
                                {activity.matchFiles.map((file: { url: string; name: string; type: 'image' | 'document'; }, i: number) => (
                                  file.type === 'image' ? (
                                    <img key={i} src={file.url} alt={file.name} style={{ maxWidth: '100%', borderRadius: '0.7rem', marginBottom: '0.5rem' }} />
                                  ) : (
                                    <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" style={{ color: fbcTheme.accent, textDecoration: 'underline', marginRight: '1rem', fontSize: '1rem' }}>{file.name}</a>
                                  )
                                ))}
                              </div>
                            )}
                            {/* LAGUTTAGNING */}
                            <div style={{ fontWeight: 900, fontSize: '1.12rem', color: fbcTheme.accent, marginBottom: '0.5rem', marginTop: '0.7rem' }}>Laguttagning</div>
                            {activity.lineup ? (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', marginBottom: '0.7rem' }}>
                                {/* Femman */}
                                {(['first', 'second', 'third'] as const).map((line, idx) => (
                                  <div key={line} style={{ background: 'rgba(46,125,50,0.10)', borderRadius: '0.7rem', padding: '0.7rem', minWidth: 160 }}>
                                    <div style={{ fontWeight: 700, color: fbcTheme.accent, marginBottom: '0.3rem' }}>{idx + 1}:a femman</div>
                                    {(activity.lineup && activity.lineup[line])?.map((player: string, i: number) => (
                                      <div key={i} style={{ color: fbcTheme.text.primary, fontSize: '1rem', marginBottom: '0.2rem' }}>{player}</div>
                                    ))}
                                  </div>
                                ))}
                                {/* Powerplay, Boxplay, Målvakter, Reserv */}
                                <div style={{ background: 'rgba(255,179,0,0.10)', borderRadius: '0.7rem', padding: '0.7rem', minWidth: 160 }}>
                                  <div style={{ fontWeight: 700, color: '#FFB300', marginBottom: '0.3rem' }}>Powerplay</div>
                                  {activity.lineup.powerplay?.map((player: string, i: number) => (
                                    <div key={i} style={{ color: fbcTheme.text.primary, fontSize: '1rem', marginBottom: '0.2rem' }}>{player}</div>
                                  ))}
                                </div>
                                <div style={{ background: 'rgba(34,51,34,0.10)', borderRadius: '0.7rem', padding: '0.7rem', minWidth: 160 }}>
                                  <div style={{ fontWeight: 700, color: fbcTheme.accent, marginBottom: '0.3rem' }}>Boxplay</div>
                                  {activity.lineup.boxplay?.map((player: string, i: number) => (
                                    <div key={i} style={{ color: fbcTheme.text.primary, fontSize: '1rem', marginBottom: '0.2rem' }}>{player}</div>
                                  ))}
                                </div>
                                <div style={{ background: 'rgba(34,51,34,0.10)', borderRadius: '0.7rem', padding: '0.7rem', minWidth: 160 }}>
                                  <div style={{ fontWeight: 700, color: fbcTheme.accent, marginBottom: '0.3rem' }}>Målvakter</div>
                                  {activity.lineup.goalies?.map((player: string, i: number) => (
                                    <div key={i} style={{ color: fbcTheme.text.primary, fontSize: '1rem', marginBottom: '0.2rem' }}>{player}</div>
                                  ))}
                                </div>
                                <div style={{ background: 'rgba(34,51,34,0.10)', borderRadius: '0.7rem', padding: '0.7rem', minWidth: 160 }}>
                                  <div style={{ fontWeight: 700, color: fbcTheme.accent, marginBottom: '0.3rem' }}>Reserv</div>
                                  {activity.lineup.reserve?.map((player: string, i: number) => (
                                    <div key={i} style={{ color: fbcTheme.text.primary, fontSize: '1rem', marginBottom: '0.2rem' }}>{player}</div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div style={{ color: fbcTheme.text.secondary, fontSize: '1.05rem', marginBottom: '0.7rem' }}>Ingen laguttagning ännu.</div>
                            )}
                            {/* Ledare kan lägga till/redigera info */}
                            {false /* Byt till isLeader */ && (
                              <div style={{ marginTop: '1.2rem' }}>
                                <button style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.7rem 1.5rem', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer' }}>Redigera matchinfo/laguttagning</button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <form style={{ margin: '1rem 0', background: fbcTheme.cardBg, padding: '1rem', borderRadius: '1rem', boxShadow: '0 2px 8px #22c55e22', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}
                onSubmit={async e => {
                  e.preventDefault();
                  if (!newCustom.title || !newCustom.date) return;
                  // Välj typ baserat på titel eller låt användaren välja typ i UI om du vill
                  let type: Activity["type"] = 'annat';
                  const titleLower = newCustom.title.toLowerCase();
                  if (titleLower.includes('träning')) type = 'träning';
                  else if (titleLower.includes('match')) type = 'match';
                  // Skapa aktivitet mot backend
                  const newActivity: Partial<Activity> = {
                    title: newCustom.title,
                    type,
                    date: newCustom.date,
                    startTime: newCustom.startTime,
                    location: newCustom.location,
                    description: newCustom.description,
                    createdBy: 'user',
                    participants: [],
                    comments: [],
                    important: false
                  };
                  const res = await activitiesAPI.create(newActivity);
                  if (res.success && res.data) {
                    setActivities(prev => [...prev, res.data]);
                  } else {
                    // setError('Kunde inte spara aktivitet till server.');
                  }
                  setNewCustom({ title: '', date: '', startTime: '', location: '', description: '' });
                  setShowAddTab(false);
                }}>
                <div style={{ fontWeight: 600, color: fbcTheme.accent }}>Lägg till "Annat" aktivitet</div>
                <input placeholder="Titel" value={newCustom.title} onChange={e => setNewCustom({ ...newCustom, title: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                <input type="date" value={newCustom.date} onChange={e => setNewCustom({ ...newCustom, date: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                <input placeholder="Starttid" value={newCustom.startTime} onChange={e => setNewCustom({ ...newCustom, startTime: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                <input placeholder="Plats" value={newCustom.location} onChange={e => setNewCustom({ ...newCustom, location: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                <input placeholder="Beskrivning" value={newCustom.description} onChange={e => setNewCustom({ ...newCustom, description: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                <button type="submit" style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>Lägg till</button>
              </form>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Activities;
