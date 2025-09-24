import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { checkQuestionAPI } from "../services/apiService";
import stylesModule from "./Ledarportal.module.css";
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
  id: string;
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
  // Set background and text color via CSS variables for root element
  useEffect(() => {
    const root = document.querySelector(`.${stylesModule.ledarportalRoot}`) as HTMLElement | null;
    if (root) {
      root.style.setProperty('--ledarportal-bg', styles.gradients.body);
      root.style.setProperty('--ledarportal-text', styles.textPrimary);
      root.style.setProperty('--ledarportal-primary-green', styles.primaryGreen);
    }
  }, [isDark, styles.gradients.body, styles.textPrimary, styles.primaryGreen]);
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
      // Here you would call your API to approve the user, e.g.:
      // await axios.post(`/api/users/approve/${userId}`);
      setPendingUsers(users => users.filter(u => u.id !== userId));
    } catch {
      setErrorPending("Kunde inte godkänna användare.");
    }
  };

  return (
    <div className={stylesModule.ledarportalRoot}>
      <header className={`${stylesModule.ledarportalHeader} ${stylesModule.ledarportalHeaderStyled}`}>
        <div className={stylesModule.ledarportalTitle}>Ledarportal</div>
        <div className={stylesModule.ledarportalSubtitle}>{/* color handled by CSS */}Här får du som ledare tillgång till information som bara är för ledare: frånvaroanmälan, svar från check in/check ut, enkätsvar och mer.</div>
      </header>
      <section className={stylesModule.ledarportalSection}>
        <div className={stylesModule.ledarportalCardsWrapper}>
          <div className={stylesModule.cardAbsence}>
            <div className={stylesModule.cardTitleAbsence}>Frånvaroanmälningar</div>
            {absences.length === 0 ? (
              <div className={stylesModule.cardAbsenceEmpty}>Inga frånvaroanmälningar ännu.</div>
            ) : (
              <div className={stylesModule.cardAbsenceList}>
                {absences.map((a, idx) => (
                  <div key={idx} className={stylesModule.cardAbsenceItem}>
                    <div className={stylesModule.cardAbsenceUser}>{a.userName} ({a.reason})</div>
                    <div className={stylesModule.cardAbsenceActivity}>Aktivitet: {a.activityTitle}</div>
                    {a.comment && <div className={stylesModule.cardAbsenceComment}>Kommentar: {a.comment}</div>}
                    <div className={stylesModule.cardAbsenceDate}>Anmäld: {new Date(a.date).toLocaleString('sv-SE')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={stylesModule.cardCheckInOut}>
            <div className={stylesModule.cardCheckInOutHeader}>
              <div className={stylesModule.cardCheckInOutTitle}>Check in / Check ut</div>
              <button onClick={() => setShowEditQuestions(v => !v)} className={stylesModule.cardCheckInOutEditBtn}>{showEditQuestions ? 'Stäng redigering' : 'Redigera frågor'}</button>
            </div>
            {/* Admin-sektion för redigering */}
            {showEditQuestions && (
              <div className={stylesModule.cardCheckInOutEditSection}>
                <div className={stylesModule.cardCheckInOutEditTitle}>Redigera frågor för check in/check ut</div>
                {/* Lista befintliga frågor */}
                {questions.map(q => (
                  <div key={q._id} className={stylesModule.cardCheckInOutEditItem}>
                    <div className={stylesModule.cardCheckInOutEditItemType}>{q.type === 'in' ? 'Check in' : 'Check ut'}-fråga</div>
                    <div className={stylesModule.cardCheckInOutEditItemText}>{q.text}</div>
                    <div className={stylesModule.cardCheckInOutEditItemOptions}>Svarsalternativ:
                      <ul className={stylesModule.cardCheckInOutEditItemOptionsList}>
                        {q.options.map((opt: string, idx: number) => <li key={idx}>{opt}</li>)}
                      </ul>
                    </div>
                    <button onClick={() => setEditQuestion(q)} className={stylesModule.cardCheckInOutEditBtn}>Redigera</button>
                    <button onClick={async () => { await checkQuestionAPI.delete(q._id); setQuestions(questions.filter(qq => qq._id !== q._id)); }} className={stylesModule.cardCheckInOutDeleteBtn}>Ta bort</button>
                  </div>
                ))}
                {/* Redigera vald fråga */}
                {editQuestion && (
                  <div className={stylesModule.cardCheckInOutEditItem}>
                    <div className={stylesModule.cardCheckInOutEditItemType}>Redigera fråga</div>
                    <label htmlFor="edit-question-text" className={stylesModule.cardCheckInOutEditLabel}>Frågetext</label>
                    <input
                      id="edit-question-text"
                      value={editQuestion.text}
                      onChange={e => setEditQuestion({ ...editQuestion, text: e.target.value })}
                      className={stylesModule.editQuestionInput}
                      placeholder="Frågetext"
                      title="Redigera frågetext"
                    />
                    <div className={stylesModule.cardCheckInOutEditOptions}>Svarsalternativ:
                      {editQuestion.options.map((opt: string, idx: number) => (
                        <div key={idx} className={stylesModule.cardCheckInOutEditOptionRow}>
                          <input
                            value={opt}
                            onChange={e => {
                              const opts = [...editQuestion.options];
                              opts[idx] = e.target.value;
                              setEditQuestion({ ...editQuestion, options: opts });
                            }}
                            className={stylesModule.editQuestionOptionInput}
                            title="Redigera svarsalternativ"
                            placeholder="Svarsalternativ"
                          />
                          <button
                            onClick={() => setEditQuestion({ ...editQuestion, options: editQuestion.options.filter((_: any, i: number) => i !== idx) })}
                            className={stylesModule.cardCheckInOutDeleteBtn}
                          >Ta bort</button>
                        </div>
                      ))}
                      <button onClick={() => setEditQuestion({ ...editQuestion, options: [...editQuestion.options, ''] })} className={stylesModule.cardCheckInOutAddOptionBtn}>Lägg till svarsalternativ</button>
                    </div>
                    <button onClick={async () => { await checkQuestionAPI.update(editQuestion._id, editQuestion); setEditQuestion(null); checkQuestionAPI.getAll().then(res => { if (res.success && res.data) setQuestions(res.data); }); }} className={stylesModule.cardCheckInOutEditBtn}>Spara</button>
                    <button onClick={() => setEditQuestion(null)} className={stylesModule.cardCheckInOutCancelBtn}>Avbryt</button>
                  </div>
                )}
                {/* Lägg till ny fråga */}
                <div className={stylesModule.cardCheckInOutEditItem}>
                  <div className={stylesModule.cardCheckInOutEditItemType}>Lägg till ny fråga</div>
                  <select
                    value={newQuestion.type}
                    onChange={e => setNewQuestion({ ...newQuestion, type: e.target.value })}
                    className={stylesModule.selectInput}
                    title="Typ av fråga"
                  >
                    <option value="in">Check in</option>
                    <option value="out">Check ut</option>
                  </select>
                  <input value={newQuestion.text} onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })} placeholder="Frågetext" className={stylesModule.editQuestionInput} />
                  <div className={stylesModule.cardCheckInOutEditOptions}>Svarsalternativ:
                    {newQuestion.options.map((opt, idx) => (
                      <div key={idx} className={stylesModule.cardCheckInOutEditOptionRow}>
                        <input
                          value={opt}
                          onChange={e => {
                            const opts = [...newQuestion.options];
                            opts[idx] = e.target.value;
                            setNewQuestion({ ...newQuestion, options: opts });
                          }}
                          className={stylesModule.optionInput}
                          title="Svarsalternativ"
                          placeholder="Svarsalternativ"
                        />
                        <button onClick={() => setNewQuestion({ ...newQuestion, options: newQuestion.options.filter((_: any, i: number) => i !== idx) })} className={stylesModule.cardCheckInOutDeleteBtn}>Ta bort</button>
                      </div>
                    ))}
                    <button onClick={() => setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ''] })} className={stylesModule.cardCheckInOutAddOptionBtn}>Lägg till svarsalternativ</button>
                  </div>
                  <button onClick={async () => { await checkQuestionAPI.create(newQuestion); setNewQuestion({ type: 'in', text: '', options: [''] }); checkQuestionAPI.getAll().then(res => { if (res.success && res.data) setQuestions(res.data); }); }} className={stylesModule.cardCheckInOutEditBtn}>Spara ny fråga</button>
                </div>
              </div>
            )}
            {checks.length === 0 ? (
              <div className={stylesModule.cardCheckInOutEmpty}>Inga check in/check ut-svar ännu.</div>
            ) : (
              <div>
                {/* Gruppera aktiviteter */}
                {(() => {
                  const activities = Array.from(new Map(checks.map(c => [c.activityId, c.activityTitle])).entries())
                    .map(([id, title]) => ({ id, title }));
                  return (
                    <div>
                        <div className={stylesModule.cardCheckInOutActivitiesHeader}>
                          <div className={stylesModule.cardCheckInOutActivitiesTitle}>Tidigare aktiviteter</div>
                          <div className={stylesModule.cardCheckInOutActivitiesList}>
                            {activities.map(act => (
                              <button key={act.id} onClick={() => setSelectedActivityId(act.id)} className={selectedActivityId===act.id ? stylesModule.cardCheckInOutActivityBtnActive : stylesModule.cardCheckInOutActivityBtn}>{act.title}</button>
                            ))}
                          </div>
                        </div>
                      {/* Visa svar och snitt för vald aktivitet */}
                      {selectedActivityId && (
                        <div className={stylesModule.cardCheckInOutActivityAnswersWrapper}>
                          <div className={stylesModule.cardCheckInOutActivityAnswersTitle}>Svar för aktivitet</div>
                          {(() => {
                            const activityChecks = checks.filter(c => c.activityId === selectedActivityId);
                            if (activityChecks.length === 0) return <div className={stylesModule.cardCheckInOutActivityAnswersEmpty}>Inga svar för denna aktivitet.</div>;
                            // Snittvärden
                            const avgBody = activityChecks.reduce((sum, c) => sum + c.bodyFeeling, 0) / activityChecks.length;
                            const avgMental = activityChecks.reduce((sum, c) => sum + c.mentalFeeling, 0) / activityChecks.length;
                            // Färgkodning
                            const getColor = (val: number) => val <= 1.5 ? '#e53935' : val <= 2.5 ? '#FFB300' : val <= 3.5 ? '#FBC02D' : '#2E7D32';
                            return (
                              <div>
                                <div className={stylesModule.cardCheckInOutActivityStats}>
                                  <div className={stylesModule.cardCheckInOutActivityAvgBody}>Snitt kropp: <span className={getColor(avgBody) === '#e53935' ? stylesModule.avgRed : getColor(avgBody) === '#FFB300' ? stylesModule.avgGold : getColor(avgBody) === '#FBC02D' ? stylesModule.avgYellow : stylesModule.avgGreen}>{avgBody.toFixed(2)}</span></div>
                                  <div className={stylesModule.cardCheckInOutActivityAvgMental}>Snitt mentalt: <span className={getColor(avgMental) === '#e53935' ? stylesModule.avgRed : getColor(avgMental) === '#FFB300' ? stylesModule.avgGold : getColor(avgMental) === '#FBC02D' ? stylesModule.avgYellow : stylesModule.avgGreen}>{avgMental.toFixed(2)}</span></div>
                                </div>
                                <div className={stylesModule.cardCheckInOutActivityList}>
                                  {activityChecks.map((c, idx) => (
                                    <div key={idx} className={stylesModule.cardCheckInOutActivityItem}>
                                      <div className={stylesModule.cardCheckInOutActivityUser}>{c.userName} ({c.type === 'in' ? 'Check in' : 'Check ut'})</div>
                                      <div className={stylesModule.cardCheckInOutActivityFeelings}>
                                        Kropp: <span className={getColor(c.bodyFeeling) === '#e53935' ? stylesModule.avgRed : getColor(c.bodyFeeling) === '#FFB300' ? stylesModule.avgGold : getColor(c.bodyFeeling) === '#FBC02D' ? stylesModule.avgYellow : stylesModule.avgGreen}>{c.bodyFeeling}</span> |
                                        Mentalt: <span className={getColor(c.mentalFeeling) === '#e53935' ? stylesModule.avgRed : getColor(c.mentalFeeling) === '#FFB300' ? stylesModule.avgGold : getColor(c.mentalFeeling) === '#FBC02D' ? stylesModule.avgYellow : stylesModule.avgGreen}>{c.mentalFeeling}</span>
                                      </div>
                                      <div className={stylesModule.cardCheckInOutActivityDate}>Tid: {new Date(c.date).toLocaleString('sv-SE')}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                      {/* Snitt över tid (tabell) */}
                      <div className={stylesModule.cardCheckInOutActivityTableWrapper}>
                        <div className={stylesModule.cardCheckInOutActivityTableTitle}>Snitt över tid</div>
                        <table className={stylesModule.cardCheckInOutActivityTable}>
                          <thead>
                            <tr className={stylesModule.cardCheckInOutActivityTableHeader}>
                              <th className={stylesModule.cardCheckInOutActivityTableCell}>Aktivitet</th>
                              <th className={stylesModule.cardCheckInOutActivityTableCell}>Snitt kropp</th>
                              <th className={stylesModule.cardCheckInOutActivityTableCell}>Snitt mentalt</th>
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
                                  <td className={stylesModule.cardCheckInOutActivityTableCell}>{act.title}</td>
                                  <td className={`${stylesModule.cardCheckInOutActivityTableCell} ${getColor(avgBody) === '#e53935' ? stylesModule.avgRed : getColor(avgBody) === '#FFB300' ? stylesModule.avgGold : getColor(avgBody) === '#FBC02D' ? stylesModule.avgYellow : stylesModule.avgGreen}`}>{avgBody.toFixed(2)}</td>
                                  <td className={`${stylesModule.cardCheckInOutActivityTableCell} ${getColor(avgMental) === '#e53935' ? stylesModule.avgRed : getColor(avgMental) === '#FFB300' ? stylesModule.avgGold : getColor(avgMental) === '#FBC02D' ? stylesModule.avgYellow : stylesModule.avgGreen}`}>{avgMental.toFixed(2)}</td>
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
          <div className={stylesModule.cardSurvey}>
            <div className={stylesModule.cardSurveyTitle}>Enkätsvar</div>
            <div className={stylesModule.cardSurveyDesc}>Här visas svaren från olika enkäter och undersökningar.</div>
          </div>
          <div className={stylesModule.cardPendingUsers}>
            <div className={stylesModule.cardPendingUsersTitle}>Nya ansökningar</div>
            {loadingPending ? (
              <div className={stylesModule.cardPendingUsersLoading}>Laddar...</div>
            ) : errorPending ? (
              <div className={stylesModule.cardPendingUsersError}>{errorPending}</div>
            ) : pendingUsers.length === 0 ? (
              <div className={stylesModule.cardPendingUsersEmpty}>Inga nya ansökningar.</div>
            ) : (
              <div className={stylesModule.cardPendingUsersList}>
                {pendingUsers.map(user => (
                  <div key={user.id} className={stylesModule.cardPendingUsersItem}>
                    <div className={stylesModule.cardPendingUsersName}>{user.name} ({user.role})</div>
                    <div className={stylesModule.cardPendingUsersEmail}>E-post: {user.email}</div>
                    <div className={stylesModule.cardPendingUsersStatus}>Status: {user.status}</div>
                    <button onClick={() => handleApprove(user.id)} className={stylesModule.cardPendingUsersApproveBtn}>Godkänn</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <footer className={stylesModule.ledarportalFooter}>
        <div className={stylesModule.ledarportalFooterCopyright}>
          &copy; {new Date().getFullYear()} FBC - Alla rättigheter förbehållna.
        </div>
        <div className={stylesModule.ledarportalFooterLinks}>
          <a href="/privacy-policy" className={stylesModule.ledarportalFooterLink}>Policy för personuppgifter</a>
          <a href="/terms-of-service" className={stylesModule.ledarportalFooterLink}>Användarvillkor</a>
          <a href="/cookie-policy" className={stylesModule.ledarportalFooterLink}>Cookiepolicy</a>
        </div>
      </footer>
    </div>
  );
};

export default Ledarportal;
