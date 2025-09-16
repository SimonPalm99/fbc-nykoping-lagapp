import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { checkQuestionAPI } from "../services/apiService";
interface CheckInOut {
  activityId: string;
  activityTitle: string;
  userId: string;
  userName: string;
  type: 'in' | 'out';
  bodyFeeling: number;
  mentalFeeling: number;
  date: string;
}

const getStyles = (isDark: boolean) => ({
  primaryGreen: "#2E7D32",
  accentGreen: "#4CAF50",
  fbcGold: "#FFB300",
  cardBackground: isDark ? "rgba(16, 32, 16, 0.97)" : "#FFFFFF",
  textPrimary: isDark ? "#F1F8E9" : "#1B5E20",
  textSecondary: isDark ? "#C8E6C9" : "#4A5568",
  gradients: {
    body: isDark
      ? "linear-gradient(135deg, #0A0A0A 0%, #0D1B0D 30%, #1B2E1B 100%)"
      : "linear-gradient(135deg, #FAFAFA 0%, #F1F8E9 30%, #E8F5E9 100%)",
    cardHover: isDark
      ? "linear-gradient(135deg, rgba(46, 125, 50, 0.25) 0%, rgba(56, 142, 60, 0.25) 100%)"
      : "linear-gradient(135deg, rgba(46, 125, 50, 0.07) 0%, rgba(56, 142, 60, 0.07) 100%)",
  },
});

interface Absence {
  activityId: string;
  activityTitle: string;
  userId: string;
  userName: string;
  reason: string;
  comment: string;
  date: string;
}

interface PendingUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const Ledarportal: React.FC = () => {
  // const { user: authUser } = useUser();
  const [questions, setQuestions] = useState<any[]>([]);
  const [showEditQuestions, setShowEditQuestions] = useState(false);
  const [editQuestion, setEditQuestion] = useState<any|null>(null);
  const [newQuestion, setNewQuestion] = useState({ type: 'in', text: '', options: [''] });
  const [checks, setChecks] = useState<CheckInOut[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string|null>(null);
  const { isDark } = useTheme();
  const styles = getStyles(isDark);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [errorPending, setErrorPending] = useState<string | null>(null);

  useEffect(() => {
    checkQuestionAPI.getAll().then(res => {
      if (res.success && res.data) setQuestions(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get('/api/checks')
      .then((res) => {
        setChecks(res.data as CheckInOut[]);
      })
      .catch(() => {
        // Optionally handle error
      });
  }, []);

  useEffect(() => {
    axios.get('/api/absences')
      .then((res) => {
        setAbsences(res.data as Absence[]);
      })
      .catch(() => {
        // Optionally handle error, e.g. show a message
      });
  }, []);

  useEffect(() => {
    axios.get("/api/users/pending")
      .then((res) => {
  setPendingUsers(res.data as PendingUser[]);
        setLoadingPending(false);
      })
      .catch(() => {
        setErrorPending("Kunde inte hämta ansökningar.");
        setLoadingPending(false);
      });
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      await axios.patch(`/api/users/${userId}/approve`);
      setPendingUsers(users => users.filter(u => u._id !== userId));
    } catch {
      setErrorPending("Kunde inte godkänna användare.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: styles.gradients.body, color: styles.textPrimary, fontFamily: "inherit", padding: "1.2rem 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 180, background: "linear-gradient(135deg, #22c55e 0%, #0a0a0a 100%)", opacity: 0.18, zIndex: 0, pointerEvents: "none" }} />
      <header style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "0.3rem 0.5rem 0.2rem 0.5rem",
        borderBottom: `2px solid ${styles.primaryGreen}`,
        background: "linear-gradient(120deg, #2E7D32 0%, #388E3C 100%)",
        borderRadius: "0 0 1rem 1rem",
        boxShadow: "0 2px 8px rgba(46, 125, 50, 0.10)",
        position: "relative",
        overflow: "hidden",
        minHeight: "56px"
      }}>
        <div style={{ width: "100%", textAlign: "center", fontWeight: 900, fontSize: "1.35rem", color: "#fff", letterSpacing: "1px", textShadow: "0 2px 8px #2E7D32, 0 0px 2px #000", marginBottom: "0.3rem", zIndex: 2 }}>
          Ledarportal
        </div>
        <div style={{ width: "100%", textAlign: "center", color: styles.textSecondary, fontSize: "1.05rem", marginBottom: "0.2rem" }}>
          Här får du som ledare tillgång till information som bara är för ledare: frånvaroanmälan, svar från check in/check ut, enkätsvar och mer.
        </div>
      </header>
      <section style={{ maxWidth: 900, margin: "2rem auto 2rem auto", padding: "0 1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ background: styles.cardBackground, borderRadius: "1.2rem", boxShadow: "0 4px 16px rgba(46, 125, 50, 0.18)", border: `2px solid ${styles.primaryGreen}`, padding: "1.2rem 1.5rem" }}>
            <div style={{ fontWeight: 700, fontSize: "1.15rem", color: styles.primaryGreen }}>Frånvaroanmälningar</div>
            {absences.length === 0 ? (
              <div style={{ color: styles.textSecondary, fontSize: "0.98rem" }}>Inga frånvaroanmälningar ännu.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                {absences.map((a, idx) => (
                  <div key={idx} style={{ background: styles.gradients.cardHover, borderRadius: "1rem", padding: "1rem 1.2rem", boxShadow: "0 2px 8px rgba(46,125,50,0.10)", border: `1.5px solid ${styles.primaryGreen}`, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <div style={{ fontWeight: 700, color: styles.primaryGreen, fontSize: "1.05rem" }}>{a.userName} ({a.reason})</div>
                    <div style={{ color: styles.textSecondary, fontSize: "0.98rem" }}>Aktivitet: {a.activityTitle}</div>
                    {a.comment && <div style={{ color: styles.textSecondary, fontSize: "0.95rem" }}>Kommentar: {a.comment}</div>}
                    <div style={{ color: styles.textSecondary, fontSize: "0.85rem" }}>Anmäld: {new Date(a.date).toLocaleString('sv-SE')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ background: styles.cardBackground, borderRadius: "1.2rem", boxShadow: "0 4px 16px rgba(46, 125, 50, 0.18)", border: `2px solid ${styles.primaryGreen}`, padding: "1.2rem 1.5rem", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: "1.15rem", color: styles.primaryGreen }}>Check in / Check ut</div>
              <button onClick={() => setShowEditQuestions(v => !v)} style={{ background: styles.primaryGreen, color: '#fff', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: '0.98rem', padding: '0.4rem 1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px #2E7D3233', marginLeft: 'auto' }}>{showEditQuestions ? 'Stäng redigering' : 'Redigera frågor'}</button>
            </div>
            {/* Admin-sektion för redigering */}
            {showEditQuestions && (
              <div style={{ margin: '1.2rem 0', background: styles.gradients.cardHover, borderRadius: 12, padding: '1.2rem' }}>
                <div style={{ fontWeight: 700, color: styles.primaryGreen, fontSize: '1.08rem', marginBottom: '0.7rem' }}>Redigera frågor för check in/check ut</div>
                {/* Lista befintliga frågor */}
                {questions.map(q => (
                  <div key={q._id} style={{ marginBottom: '1.1rem', background: '#fff', borderRadius: 8, padding: '0.7rem 1.1rem', boxShadow: '0 2px 8px #2E7D3233', border: `1.5px solid ${styles.primaryGreen}` }}>
                    <div style={{ fontWeight: 700, color: styles.primaryGreen }}>{q.type === 'in' ? 'Check in' : 'Check ut'}-fråga</div>
                    <div style={{ fontWeight: 600 }}>{q.text}</div>
                    <div style={{ margin: '0.5rem 0' }}>
                      Svarsalternativ:
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {q.options.map((opt: string, idx: number) => <li key={idx}>{opt}</li>)}
                      </ul>
                    </div>
                    <button onClick={() => setEditQuestion(q)} style={{ marginRight: 8, background: styles.primaryGreen, color: '#fff', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Redigera</button>
                    <button onClick={async () => { await checkQuestionAPI.delete(q._id); setQuestions(questions.filter(qq => qq._id !== q._id)); }} style={{ background: '#e53935', color: '#fff', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Ta bort</button>
                  </div>
                ))}
                {/* Redigera vald fråga */}
                {editQuestion && (
                  <div style={{ marginBottom: '1.1rem', background: '#fff', borderRadius: 8, padding: '0.7rem 1.1rem', boxShadow: '0 2px 8px #2E7D3233', border: `1.5px solid ${styles.primaryGreen}` }}>
                    <div style={{ fontWeight: 700, color: styles.primaryGreen }}>Redigera fråga</div>
                    <input value={editQuestion.text} onChange={e => setEditQuestion({ ...editQuestion, text: e.target.value })} style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />
                    <div style={{ marginBottom: 8 }}>
                      Svarsalternativ:
                      {editQuestion.options.map((opt: string, idx: number) => (
                        <div key={idx} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                          <input value={opt} onChange={e => {
                            const opts = [...editQuestion.options];
                            opts[idx] = e.target.value;
                            setEditQuestion({ ...editQuestion, options: opts });
                          }} style={{ flex: 1, padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />
                          <button onClick={() => setEditQuestion({ ...editQuestion, options: editQuestion.options.filter((_: any, i: number) => i !== idx) })} style={{ background: '#e53935', color: '#fff', borderRadius: 6, border: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '0.2rem 0.6rem', cursor: 'pointer' }}>Ta bort</button>
                        </div>
                      ))}
                      <button onClick={() => setEditQuestion({ ...editQuestion, options: [...editQuestion.options, ''] })} style={{ background: styles.primaryGreen, color: '#fff', borderRadius: 6, border: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '0.2rem 0.6rem', cursor: 'pointer', marginTop: 4 }}>Lägg till svarsalternativ</button>
                    </div>
                    <button onClick={async () => { await checkQuestionAPI.update(editQuestion._id, editQuestion); setEditQuestion(null); checkQuestionAPI.getAll().then(res => { if (res.success && res.data) setQuestions(res.data); }); }} style={{ background: styles.primaryGreen, color: '#fff', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '0.3rem 0.8rem', cursor: 'pointer', marginRight: 8 }}>Spara</button>
                    <button onClick={() => setEditQuestion(null)} style={{ background: '#aaa', color: '#fff', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Avbryt</button>
                  </div>
                )}
                {/* Lägg till ny fråga */}
                <div style={{ marginBottom: '1.1rem', background: '#fff', borderRadius: 8, padding: '0.7rem 1.1rem', boxShadow: '0 2px 8px #2E7D3233', border: `1.5px solid ${styles.primaryGreen}` }}>
                  <div style={{ fontWeight: 700, color: styles.primaryGreen }}>Lägg till ny fråga</div>
                  <select value={newQuestion.type} onChange={e => setNewQuestion({ ...newQuestion, type: e.target.value })} style={{ marginBottom: 8, padding: 6, borderRadius: 6, border: '1px solid #ccc' }}>
                    <option value="in">Check in</option>
                    <option value="out">Check ut</option>
                  </select>
                  <input value={newQuestion.text} onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })} placeholder="Frågetext" style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />
                  <div style={{ marginBottom: 8 }}>
                    Svarsalternativ:
                    {newQuestion.options.map((opt, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                        <input value={opt} onChange={e => {
                          const opts = [...newQuestion.options];
                          opts[idx] = e.target.value;
                          setNewQuestion({ ...newQuestion, options: opts });
                        }} style={{ flex: 1, padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />
                        <button onClick={() => setNewQuestion({ ...newQuestion, options: newQuestion.options.filter((_: any, i: number) => i !== idx) })} style={{ background: '#e53935', color: '#fff', borderRadius: 6, border: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '0.2rem 0.6rem', cursor: 'pointer' }}>Ta bort</button>
                      </div>
                    ))}
                    <button onClick={() => setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ''] })} style={{ background: styles.primaryGreen, color: '#fff', borderRadius: 6, border: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '0.2rem 0.6rem', cursor: 'pointer', marginTop: 4 }}>Lägg till svarsalternativ</button>
                  </div>
                  <button onClick={async () => { await checkQuestionAPI.create(newQuestion); setNewQuestion({ type: 'in', text: '', options: [''] }); checkQuestionAPI.getAll().then(res => { if (res.success && res.data) setQuestions(res.data); }); }} style={{ background: styles.primaryGreen, color: '#fff', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Spara ny fråga</button>
                </div>
              </div>
            )}
            {checks.length === 0 ? (
              <div style={{ color: styles.textSecondary, fontSize: "0.98rem" }}>Inga check in/check ut-svar ännu.</div>
            ) : (
              <div>
                {/* Gruppera aktiviteter */}
                {(() => {
                  const activities = Array.from(new Map(checks.map(c => [c.activityId, c.activityTitle])).entries())
                    .map(([id, title]) => ({ id, title }));
                  return (
                    <div>
                      <div style={{ marginBottom: "1.2rem" }}>
                        <div style={{ fontWeight: 700, color: styles.primaryGreen, fontSize: "1.08rem", marginBottom: "0.5rem" }}>Tidigare aktiviteter</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.7rem" }}>
                          {activities.map(act => (
                            <button key={act.id} onClick={() => setSelectedActivityId(act.id)} style={{ background: selectedActivityId===act.id ? styles.primaryGreen : styles.cardBackground, color: selectedActivityId===act.id ? '#fff' : styles.textPrimary, borderRadius: 10, border: `2px solid ${styles.primaryGreen}`, fontWeight: 700, fontSize: "1.05rem", padding: "0.5rem 1.2rem", cursor: "pointer" }}>{act.title}</button>
                          ))}
                        </div>
                      </div>
                      {/* Visa svar och snitt för vald aktivitet */}
                      {selectedActivityId && (
                        <div style={{ marginTop: "1.2rem" }}>
                          <div style={{ fontWeight: 700, color: styles.primaryGreen, fontSize: "1.08rem", marginBottom: "0.5rem" }}>Svar för aktivitet</div>
                          {(() => {
                            const activityChecks = checks.filter(c => c.activityId === selectedActivityId);
                            if (activityChecks.length === 0) return <div style={{ color: styles.textSecondary }}>Inga svar för denna aktivitet.</div>;
                            // Snittvärden
                            const avgBody = activityChecks.reduce((sum, c) => sum + c.bodyFeeling, 0) / activityChecks.length;
                            const avgMental = activityChecks.reduce((sum, c) => sum + c.mentalFeeling, 0) / activityChecks.length;
                            // Färgkodning
                            const getColor = (val: number) => val <= 1.5 ? '#e53935' : val <= 2.5 ? '#FFB300' : val <= 3.5 ? '#FBC02D' : '#2E7D32';
                            return (
                              <div>
                                <div style={{ display: "flex", gap: "2rem", marginBottom: "1.2rem" }}>
                                  <div style={{ fontWeight: 700, fontSize: "1.05rem", color: styles.textPrimary }}>Snitt kropp: <span style={{ color: getColor(avgBody), fontWeight: 900 }}>{avgBody.toFixed(2)}</span></div>
                                  <div style={{ fontWeight: 700, fontSize: "1.05rem", color: styles.textPrimary }}>Snitt mentalt: <span style={{ color: getColor(avgMental), fontWeight: 900 }}>{avgMental.toFixed(2)}</span></div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                                  {activityChecks.map((c, idx) => (
                                    <div key={idx} style={{ background: styles.gradients.cardHover, borderRadius: "1rem", padding: "0.7rem 1.2rem", boxShadow: "0 2px 8px rgba(46,125,50,0.10)", border: `1.5px solid ${styles.primaryGreen}`, display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                      <div style={{ fontWeight: 700, color: styles.primaryGreen, fontSize: "1.05rem" }}>{c.userName} ({c.type === 'in' ? 'Check in' : 'Check ut'})</div>
                                      <div style={{ color: styles.textSecondary, fontSize: "0.98rem" }}>Kropp: <span style={{ color: getColor(c.bodyFeeling), fontWeight: 700 }}>{c.bodyFeeling}</span> | Mentalt: <span style={{ color: getColor(c.mentalFeeling), fontWeight: 700 }}>{c.mentalFeeling}</span></div>
                                      <div style={{ color: styles.textSecondary, fontSize: "0.85rem" }}>Tid: {new Date(c.date).toLocaleString('sv-SE')}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                      {/* Snitt över tid (tabell) */}
                      <div style={{ marginTop: "2.2rem" }}>
                        <div style={{ fontWeight: 700, color: styles.primaryGreen, fontSize: "1.08rem", marginBottom: "0.5rem" }}>Snitt över tid</div>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ background: styles.gradients.cardHover }}>
                              <th style={{ padding: "0.5rem", border: `1px solid ${styles.primaryGreen}` }}>Aktivitet</th>
                              <th style={{ padding: "0.5rem", border: `1px solid ${styles.primaryGreen}` }}>Snitt kropp</th>
                              <th style={{ padding: "0.5rem", border: `1px solid ${styles.primaryGreen}` }}>Snitt mentalt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activities.map(act => {
                              const activityChecks = checks.filter(c => c.activityId === act.id);
                              if (activityChecks.length === 0) return null;
                              const avgBody = activityChecks.reduce((sum, c) => sum + c.bodyFeeling, 0) / activityChecks.length;
                              const avgMental = activityChecks.reduce((sum, c) => sum + c.mentalFeeling, 0) / activityChecks.length;
                              const getColor = (val: number) => val <= 1.5 ? '#e53935' : val <= 2.5 ? '#FFB300' : val <= 3.5 ? '#FBC02D' : '#2E7D32';
                              return (
                                <tr key={act.id}>
                                  <td style={{ padding: "0.5rem", border: `1px solid ${styles.primaryGreen}` }}>{act.title}</td>
                                  <td style={{ padding: "0.5rem", border: `1px solid ${styles.primaryGreen}`, color: getColor(avgBody), fontWeight: 700 }}>{avgBody.toFixed(2)}</td>
                                  <td style={{ padding: "0.5rem", border: `1px solid ${styles.primaryGreen}`, color: getColor(avgMental), fontWeight: 700 }}>{avgMental.toFixed(2)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
          <div style={{ background: styles.cardBackground, borderRadius: "1.2rem", boxShadow: "0 4px 16px rgba(46, 125, 50, 0.18)", border: `2px solid ${styles.primaryGreen}`, padding: "1.2rem 1.5rem" }}>
            <div style={{ fontWeight: 700, fontSize: "1.15rem", color: styles.primaryGreen }}>Enkätsvar</div>
            <div style={{ color: styles.textSecondary, fontSize: "0.98rem" }}>Här visas svaren från olika enkäter och undersökningar.</div>
          </div>
          <div style={{ background: styles.cardBackground, borderRadius: "1.2rem", boxShadow: "0 4px 16px rgba(46, 125, 50, 0.18)", border: `2px solid ${styles.primaryGreen}`, padding: "1.2rem 1.5rem" }}>
            <div style={{ fontWeight: 700, fontSize: "1.15rem", color: styles.primaryGreen }}>Nya ansökningar</div>
            {loadingPending ? (
              <div style={{ color: styles.textSecondary, fontSize: "0.98rem" }}>Laddar...</div>
            ) : errorPending ? (
              <div style={{ color: "#e53935", fontSize: "0.98rem" }}>{errorPending}</div>
            ) : pendingUsers.length === 0 ? (
              <div style={{ color: styles.textSecondary, fontSize: "0.98rem" }}>Inga nya ansökningar.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                {pendingUsers.map(user => (
                  <div key={user._id} style={{ background: styles.gradients.cardHover, borderRadius: "1rem", padding: "1rem 1.2rem", boxShadow: "0 2px 8px rgba(46,125,50,0.10)", border: `1.5px solid ${styles.primaryGreen}`, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <div style={{ fontWeight: 700, color: styles.primaryGreen, fontSize: "1.05rem" }}>{user.name} ({user.role})</div>
                    <div style={{ color: styles.textSecondary, fontSize: "0.98rem" }}>E-post: {user.email}</div>
                    <div style={{ color: styles.textSecondary, fontSize: "0.95rem" }}>Status: {user.status}</div>
                    <button onClick={() => handleApprove(user._id)} style={{ marginTop: "0.7rem", padding: "0.6rem 1.2rem", borderRadius: "10px", background: styles.primaryGreen, color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 2px 8px #2E7D3233" }}>Godkänn</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <footer style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem", borderTop: `2px solid ${styles.primaryGreen}`, display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", fontSize: "0.9rem", color: styles.textSecondary }}>
        <div style={{ textAlign: "center" }}>
          &copy; {new Date().getFullYear()} FBC - Alla rättigheter förbehållna.
        </div>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          <a href="/privacy-policy" style={{ color: styles.textSecondary, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#FFB300"} onMouseLeave={e => e.currentTarget.style.color = styles.textSecondary}>
            Policy för personuppgifter
          </a>
          <a href="/terms-of-service" style={{ color: styles.textSecondary, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#FFB300"} onMouseLeave={e => e.currentTarget.style.color = styles.textSecondary}>
            Användarvillkor
          </a>
          <a href="/cookie-policy" style={{ color: styles.textSecondary, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#FFB300"} onMouseLeave={e => e.currentTarget.style.color = styles.textSecondary}>
            Cookiepolicy
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Ledarportal;
