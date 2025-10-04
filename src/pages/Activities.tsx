import React, { useState, useEffect } from 'react';
import styles from './Activities.module.css';
import { useLocation } from 'react-router-dom';
import { useTitle } from '../hooks/useTitle';
// ...existing code...
import { activitiesAPI } from '../services/apiService';
import { Activity, ActivityComment } from '../types/activity';
import { useUser } from '../context/UserContext';


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
    const allActivities = React.useMemo(() => {
      let arr = [...activities];
      if (filter === 'past') {
        arr = arr
          .filter(a => {
            const activityDate = new Date(a.date);
            activityDate.setHours(0,0,0,0);
            const today = new Date();
            today.setHours(0,0,0,0);
            return activityDate <= today;
          })
          .sort((a, b) => {
            const dateA = new Date(a.date + (a.startTime ? 'T' + a.startTime : ''));
            const dateB = new Date(b.date + (b.startTime ? 'T' + b.startTime : ''));
            return dateB.getTime() - dateA.getTime(); // Nyaste först
          });
      } else {
        arr = arr
          .filter(a => {
            const activityDate = new Date(a.date);
            activityDate.setHours(0,0,0,0);
            const today = new Date();
            today.setHours(0,0,0,0);
            return activityDate >= today;
          })
          .sort((a, b) => {
            const dateA = new Date(a.date + (a.startTime ? 'T' + a.startTime : ''));
            const dateB = new Date(b.date + (b.startTime ? 'T' + b.startTime : ''));
            return dateA.getTime() - dateB.getTime(); // Äldsta först
          });
      }
      return arr;
    }, [activities, filter]);
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
  }, [allActivities]);

  // Scroll to activity if id is present
  React.useEffect(() => {
    if (scrollToId && activityRefs.current[scrollToId]) {
      activityRefs.current[scrollToId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [scrollToId, filteredActivities]);

  return (
    <div className={styles.activitiesWrapper}>
      <div className={styles.activitiesContainer}>
        {/* Välkomsttext */}
        <div className={styles.activitiesHeader}>
          Välkommen till FBC Nyköpings aktivitetslista!
        </div>
        {/* Loading/Error */}
        {loading && (
          <div className={styles.activitiesCardBg}>
            Laddar aktiviteter...
          </div>
        )}
        {error && (
          <div className={styles.activitiesError}>
            {error}
          </div>
        )}
        <div className={styles.activitiesFilterRow}>
          <button
            className={filter === 'past' && !showAddTab ? `${styles.activitiesFilterBtn} ${styles.activitiesFilterBtnActive}` : styles.activitiesFilterBtn}
            onClick={() => setFilter(filter === 'past' ? 'upcoming' : 'past')}
            aria-label="Växla mellan kommande och föregående"
          >
            {filter === 'past' ? 'Kommande' : 'Föregående'}
          </button>
          {/* Typfilter */}
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)} className={styles.activitiesTypeSelect} title="Typ av aktivitet">
            <option value="alla">Alla typer</option>
            <option value="match">Matcher</option>
            <option value="träning">Träningar</option>
            <option value="annat">Annat</option>
          </select>
          <button
            onClick={() => setShowAddTab(true)}
            className={showAddTab ? `${styles.activitiesAddBtn} ${styles.activitiesAddBtnActive}` : styles.activitiesAddBtn}
            aria-label="Lägg till aktivitet"
          >
            Lägg till aktivitet
          </button>
        </div>
        {/* Aktivitetslistan */}
        <div className={styles.activitiesList}>
          {filteredActivities.length === 0 ? (
            <div className={styles.activitiesEmpty}>
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
                    className={`${styles.activityCard}${expanded ? ' ' + styles.expanded : ''}`}
                    onClick={() => setExpandedId(expanded ? null : activityId)}
                  >
                    <div className={styles.activityCardHeader}>
                      <div className={styles.activityCardTitle}>{activity.title}</div>
                      <span className={styles.activityCardMeta}>
                        {activity.date}{activity.startTime ? ` • ${activity.startTime}` : ''}
                      </span>
                      <span className={styles.activityCardLocation}>{activity.location}</span>
                      {(user?.role === 'leader' || activity.createdBy === user?.id) && (
                        <>
                          <button
                            className={styles.activityCardEditBtn}
                            onClick={e => {
                              e.stopPropagation();
                              setEditActivityId(activity.id);
                              setEditActivityForm({ ...activity });
                            }}
                          >Redigera</button>
                          <button
                            className={styles.activityCardDeleteBtn}
                            onClick={async e => {
                              e.stopPropagation();
                              const res = await activitiesAPI.delete(activity.id);
                              if (res.success) {
                                setActivities(prev => prev.filter(a => a.id !== activity.id));
                              }
                            }}
                          >Ta bort</button>
                        </>
                      )}
                    </div>
  {/* Redigera aktivitet modal/form */}
  {editActivityId && editActivityForm && (
    <form
      className={styles.activityCardEditModal}
      onSubmit={async e => {
        e.preventDefault();
        if (!editActivityForm.title || !editActivityForm.date) return;
        const res = await activitiesAPI.update(editActivityId, editActivityForm);
        if (res.success && res.data) {
          setActivities(prev => prev.map(a => a.id === editActivityId ? res.data : a));
          setEditActivityId(null);
          setEditActivityForm(null);
        }
      }}
    >
      <div className={styles.activityCardEditModalContent}>
        <h2 className={styles.activityCardEditModalTitle}>Redigera aktivitet</h2>
        <input placeholder="Titel" value={editActivityForm.title || ''} onChange={e => setEditActivityForm(f => ({ ...f!, title: e.target.value }))} className={styles.activityCardEditModalInput} />
  <input type="date" value={editActivityForm.date || ''} onChange={e => setEditActivityForm(f => ({ ...f!, date: e.target.value }))} className={styles.activityCardEditModalInput} placeholder="Datum" title="Datum" />
        <input placeholder="Starttid" value={editActivityForm.startTime || ''} onChange={e => setEditActivityForm(f => ({ ...f!, startTime: e.target.value }))} className={styles.activityCardEditModalInput} />
        <input placeholder="Plats" value={editActivityForm.location || ''} onChange={e => setEditActivityForm(f => ({ ...f!, location: e.target.value }))} className={styles.activityCardEditModalInput} />
        <input placeholder="Beskrivning" value={editActivityForm.description || ''} onChange={e => setEditActivityForm(f => ({ ...f!, description: e.target.value }))} className={styles.activityCardEditModalInput} />
  <select value={editActivityForm.type || ''} onChange={e => setEditActivityForm(f => ({ ...f!, type: e.target.value as Activity["type"] }))} className={styles.activityCardEditModalSelect} title="Typ av aktivitet">
          <option value="">Välj typ...</option>
          <option value="träning">Träning</option>
          <option value="match">Match</option>
          <option value="annat">Annat</option>
        </select>
        <button type="submit" className={styles.activityCardEditModalBtn}>Spara ändringar</button>
        <button type="button" className={styles.activityCardEditModalBtnCancel} onClick={() => { setEditActivityId(null); setEditActivityForm(null); }}>Avbryt</button>
      </div>
    </form>
  )}
                    {/* Visa senaste kommentar om någon finns, även på komprimerat kort */}
                    {((isTraining && comments.length > 0) || (isMatch && activity.leaderNotes)) && (
                      <div className={styles.activityCardLatestComment}>
                        {isTraining ? comments[comments.length - 1]?.text : activity.leaderNotes}
                      </div>
                    )}
                    {expanded && (
                      <div className={styles.activityCardExpanded}>
                        <div className={styles.activityCardDescription}>{activity.description}</div>
                        {/* Kommentarer och input för träning */}
                        {isTraining && (
                          <div className={styles.activityCardCommentRow}>
                            <div className={styles.activityCardCommentTitle}>Kommentarer</div>
                            {comments.length > 0 && comments.map((c, i) => (
                                        <div key={i} className={styles.activityCardComment}>
                                          <span className={styles.activityCardCommentText}>{c.text}</span>
                                {c.userId === "me" && (
                                  <button
                                    className={styles.activityCardCommentDeleteBtn}
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
                              className={styles.activityCardCommentInput}
                              onClick={e => e.stopPropagation()}
                            />
                            <button
                              className={styles.activityCardCommentSendBtn}
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
                              <div className={styles.activityCardCommentError}>{commentError[activity.id]}</div>
                            )}
                          </div>
                        )}
                        {/* FBC-stil: Matchinfo och laguttagning */}
                        {isMatch && (
                          <div className={styles.activityCardMatchInfo}>
                            <div className={styles.activityCardMatchInfoTitle}>Matchinfo</div>
                            {activity.matchInfo ? (
                              <div className={styles.activityCardMatchInfoText}>{activity.matchInfo}</div>
                            ) : (
                              <div className={styles.activityCardMatchInfoTextEmpty}>Ingen matchinfo ännu.</div>
                            )}
                            {/* Visa bilder/dokument om de finns */}
                            {activity.matchFiles && activity.matchFiles.length > 0 && (
                              <div className={styles.activityCardMatchFiles}>
                                {activity.matchFiles.map((file: { url: string; name: string; type: 'image' | 'document'; }, i: number) => (
                                  file.type === 'image' ? (
                                    <img key={i} src={file.url} alt={file.name} className={styles.activityCardMatchFileImg} />
                                  ) : (
                                    <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" className={styles.activityCardMatchFileLink}>{file.name}</a>
                                  )
                                ))}
                              </div>
                            )}
                            {/* LAGUTTAGNING */}
                            <div className={styles.activityCardLineupTitle}>Laguttagning</div>
                            {activity.lineup ? (
                              <div className={styles.activityCardLineupRow}>
                                {/* Femman */}
                                {(['first', 'second', 'third'] as const).map((line, idx) => (
                                  <div key={line} className={styles.activityCardLineupCol}>
                                    <div className={styles.activityCardLineupColTitle}>{idx + 1}:a femman</div>
                                    {(activity.lineup && activity.lineup[line])?.map((player: string, i: number) => (
                                      <div key={i} className={styles.activityCardLineupPlayer}>{player}</div>
                                    ))}
                                  </div>
                                ))}
                                {/* Powerplay, Boxplay, Målvakter, Reserv */}
                                <div className={`${styles.activityCardLineupCol} ${styles.activityCardLineupColPowerplay}`}>
                                  <div className={`${styles.activityCardLineupColTitle} ${styles.activityCardLineupColTitlePowerplay}`}>Powerplay</div>
                                  {activity.lineup.powerplay?.map((player: string, i: number) => (
                                    <div key={i} className={styles.activityCardLineupPlayer}>{player}</div>
                                  ))}
                                </div>
                                <div className={`${styles.activityCardLineupCol} ${styles.activityCardLineupColBoxplay}`}>
                                  <div className={styles.activityCardLineupColTitle}>Boxplay</div>
                                  {activity.lineup.boxplay?.map((player: string, i: number) => (
                                    <div key={i} className={styles.activityCardLineupPlayer}>{player}</div>
                                  ))}
                                </div>
                                <div className={`${styles.activityCardLineupCol} ${styles.activityCardLineupColGoalies}`}>
                                  <div className={styles.activityCardLineupColTitle}>Målvakter</div>
                                  {activity.lineup.goalies?.map((player: string, i: number) => (
                                    <div key={i} className={styles.activityCardLineupPlayer}>{player}</div>
                                  ))}
                                </div>
                                <div className={`${styles.activityCardLineupCol} ${styles.activityCardLineupColReserve}`}>
                                  <div className={styles.activityCardLineupColTitle}>Reserv</div>
                                  {activity.lineup.reserve?.map((player: string, i: number) => (
                                    <div key={i} className={styles.activityCardLineupPlayer}>{player}</div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className={styles.activityCardMatchInfoTextEmpty}>Ingen laguttagning ännu.</div>
                            )}
                            {/* Ledare kan lägga till/redigera info */}
                            {false /* Byt till isLeader */ && (
                              <div className={styles.activityCardLineupEditRow}>
                                <button className={styles.activityCardLineupEditBtn}>Redigera matchinfo/laguttagning</button>
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
                <form className={styles.activityCardAddForm}
                  onSubmit={async e => {
                    e.preventDefault();
                    if (!newCustom.title || !newCustom.date) return;
                    let type: Activity["type"] = 'annat';
                    const titleLower = newCustom.title.toLowerCase();
                    if (titleLower.includes('träning')) type = 'träning';
                    else if (titleLower.includes('match')) type = 'match';
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
                    }
                    setNewCustom({ title: '', date: '', startTime: '', location: '', description: '' });
                    setShowAddTab(false);
                  }}>
                  <div className={styles.activityCardAddFormTitle}>Lägg till "Annat" aktivitet</div>
                  <input placeholder="Titel" value={newCustom.title} onChange={e => setNewCustom({ ...newCustom, title: e.target.value })} className={styles.activityCardAddFormInput} />
                  <input type="date" value={newCustom.date} onChange={e => setNewCustom({ ...newCustom, date: e.target.value })} className={styles.activityCardAddFormInput} placeholder="Datum" title="Datum" />
                  <input placeholder="Starttid" value={newCustom.startTime} onChange={e => setNewCustom({ ...newCustom, startTime: e.target.value })} className={styles.activityCardAddFormInput} />
                  <input placeholder="Plats" value={newCustom.location} onChange={e => setNewCustom({ ...newCustom, location: e.target.value })} className={styles.activityCardAddFormInput} />
                  <input placeholder="Beskrivning" value={newCustom.description} onChange={e => setNewCustom({ ...newCustom, description: e.target.value })} className={styles.activityCardAddFormInput} />
                  <button type="submit" className={styles.activityCardAddFormBtn}>Lägg till</button>
                </form>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Activities;
