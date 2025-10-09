import React, { useState, useEffect } from "react";
import { finesAPI } from "../services/apiService";
import stylesCss from "./home.module.css";
import activitiesStyles from "./Activities.module.css";
import { useNavigate } from "react-router-dom";
// import { useTheme } from "../context/ThemeContext"; // Borttagen, ej använd
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { Activity } from "../types/activity";
import { forumAPI } from "../services/apiService";
import { apiService } from "../services/apiService";
import ActivityCard from "../components/activities/ActivityCard";
import ProfileCard from "../components/common/ProfileCard";
import MenuPopup from "../components/common/MenuPopup";
// import ChatWindow, { ChatMessage } from "../components/chat/ChatWindow";
import { usersData } from "../types/user";

// ...getStyles borttagen, ej använd...

const Home: React.FC = () => {
  // Motiverande veckotexter
  const today = new Date();
  const motivationalTexts = [
    "Ge aldrig upp – varje träning gör dig starkare!",
    "Tillsammans är vi starka. Stötta varandra!",
    "Du missar 100% av skotten du inte tar.",
    "Var stolt över din insats, oavsett resultat.",
    "Små framsteg är också framsteg!",
    "Glädje och gemenskap gör oss bättre.",
    "Träning är nyckeln till framgång!",
    "Varje dag är en ny chans att utvecklas.",
    "Motgångar bygger vinnare.",
    "Din attityd avgör din prestation!"
  ];
  // Veckonummer (ISO)
  const weekNr = Math.floor((today.getTime() - new Date(today.getFullYear(),0,1).getTime()) / (7*24*60*60*1000));
  const motivationalText = motivationalTexts[weekNr % motivationalTexts.length];
  // Skapa lista med {namn, datum, ålder}
  const upcomingBirthdays = usersData.map(u => {
    const birthDate = new Date(u.birthday);
    // Beräkna nästa födelsedag (år = idag om inte passerat, annars nästa år)
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
    // Beräkna ålder vid nästa födelsedag
    const age = nextBirthday.getFullYear() - birthDate.getFullYear();
    return { name: u.name, date: nextBirthday, age };
  }).sort((a, b) => a.date.getTime() - b.date.getTime());
  const nextBirthday = upcomingBirthdays[0];
  // Responsiv design: lägg till media queries för mobil/surfplatta
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media (max-width: 600px) {
        header, section, footer {
          max-width: 100vw !important;
          padding-left: 0.5rem !important;
          padding-right: 0.5rem !important;
        }
        header {
          border-radius: 0 0 0.7rem 0.7rem !important;
          min-height: 48px !important;
        }
        .fbc-btn {
          font-size: 1rem !important;
          padding: 0.5rem 0.7rem !important;
        }
        .fbc-btn-logout {
          min-width: 80px !important;
        }
      }
      @media (max-width: 900px) {
        header, section, footer {
          max-width: 98vw !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);
  const [forumLoading, setForumLoading] = useState(false);
  const [forumError, setForumError] = useState<string | null>(null);
  // ...existing code...
  const [userFines, setUserFines] = useState<{ total: number; paid: number; outstanding: number } | null>(null);
  // Chatt-meddelanden (dummy-data)


  // ...existing code...

  // ...övrig kod...

  const { user: authUser } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Flytta useEffect för böter hit, efter att authUser är definierad
  useEffect(() => {
    if (!authUser?.id) return;
    finesAPI.getByUser(authUser.id).then(res => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        // Summera böter
        const total = res.data.reduce((sum, fine) => sum + (fine.amount || 0), 0);
        const paid = res.data.filter(f => f.paid).reduce((sum, fine) => sum + (fine.amount || 0), 0);
        const outstanding = total - paid;
        setUserFines({ total, paid, outstanding });
      } else {
        setUserFines({ total: 0, paid: 0, outstanding: 0 });
      }
    });
  }, [authUser?.id]);
  // const styles = getStyles(isDark); // Borttagen, ej använd
  const [upcomingActivities, setUpcomingActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  type ForumPost = {id:string; title:string; author:string; createdAt:string; content:string; media?:string; comments?:any[]; likes?:number; isLocal?:boolean};
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [editPostId, setEditPostId] = useState<string|null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [showDeleteId, setShowDeleteId] = useState<string|null>(null);
  // Statistik borttagen
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAbsencePopup, setShowAbsencePopup] = useState(false);
  const [absenceReason, setAbsenceReason] = useState<string>("");
  const [absenceComment, setAbsenceComment] = useState<string>("");
  const [absenceSubmitting, setAbsenceSubmitting] = useState(false);
  const [absenceActivity, setAbsenceActivity] = useState<Activity | null>(null);

    // Animation keyframes för popups och meny
    useEffect(() => {
        const fadeInMenu = `@keyframes fadeInMenu { from { opacity: 0; } to { opacity: 1; } }`;
        const slideInMenu = `@keyframes slideInMenu { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`;
        const fadeInPopup = `@keyframes fadeInPopup { from { opacity: 0; } to { opacity: 1; } }`;
        const slideInPopup = `@keyframes slideInPopup { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }`;
        const style = document.createElement('style');
        style.innerHTML = `${fadeInMenu} ${slideInMenu} ${fadeInPopup} ${slideInPopup}`;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    // Scrolla alltid till toppen vid sidbyte
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
    setActivitiesLoading(true);
    setActivitiesError(null);
    apiService.get('/activities').then((res: any) => {
      if (res.success && Array.isArray(res.data)) {
        const today = new Date();
        today.setHours(0,0,0,0);
        const sorted = res.data
          .filter((a: any) => {
            const activityDate = new Date(a.date);
            activityDate.setHours(0,0,0,0);
            return activityDate >= today;
          })
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);
        setUpcomingActivities(sorted);
      } else {
        setActivitiesError(res.error || 'Kunde inte hämta aktiviteter.');
      }
      setActivitiesLoading(false);
    }).catch((err: any) => {
      setActivitiesError(err?.message || 'Kunde inte hämta aktiviteter.');
      setActivitiesLoading(false);
    });
        // Hämta inlägg från både API och localStorage
    setForumLoading(true);
    setForumError(null);
    forumAPI.getPosts(1, 3).then((res: any) => {
      if (res.success && res.data?.posts) {
        const apiPosts = res.data.posts.map((p: any) => ({
          id: p.id,
          title: p.title,
          author: p.author?.name || p.author || "Anonym",
          createdAt: p.createdAt?.slice(0, 10) || "",
          content: p.content || "",
          media: p.media || "",
          comments: p.comments || [],
          likes: typeof p.likes === "number" ? p.likes : 0
        }));
        // Endast backend-data i produktion
  const allPosts = apiPosts.sort((a: ForumPost, b: ForumPost) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setForumPosts(allPosts);
      } else {
        setForumError(res.error || 'Kunde inte hämta foruminlägg.');
      }
      setForumLoading(false);
    }).catch((err: any) => {
      setForumError(err?.message || 'Kunde inte hämta foruminlägg.');
      setForumLoading(false);
    });
    // Statistik borttagen

    }, [authUser?.id]);
        

    // Hantera meny-overlay
    useEffect(() => {
        if (!menuOpen) return;
        document.addEventListener('mousedown', (e) => {
            const menu = document.getElementById('fbc-menu-popup');
            if (menu && !menu.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        });
        return () => document.removeEventListener('mousedown', () => {});
    }, [menuOpen]);

    // Förhindra scroll på body när menyn är öppen
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

  // Visa bara nästkommande aktivitet
  const nextActivity = React.useMemo(() => upcomingActivities.length > 0 ? upcomingActivities[0] : null, [upcomingActivities]);

    // Menyobjekt för navigering
    const menuItems = [
  { label: "Aktiviteter", path: "/activities" },
  { label: "Chat", path: "/chat" },
  { label: "Forum", path: "/forum" },
  { label: "Profil", path: "/profile" },
  { label: "Böter", path: "/fines" },
  { label: "Bemärkelser", path: "/gamification" },
  { label: "Taktik, övning & analys", path: "/tactics" },
  { label: "Ledarportal", path: "/ledarportal" },
  { label: "Matchverktyg", path: "/matchverktyg" }
    ];

  // Hantera redigering av inlägg
  // handleEditPost används inte på Home-sidan

  const handleSaveEdit = () => {
    if (!editPostId) return;
    const localPostsRaw = localStorage.getItem('fbc-forum-posts');
    let localPosts = localPostsRaw ? JSON.parse(localPostsRaw) : [];
    localPosts = localPosts.map((p:any) => p.id === editPostId ? { ...p, content: editContent } : p);
    localStorage.setItem('fbc-forum-posts', JSON.stringify(localPosts));
    setEditPostId(null);
    setEditContent("");
    // Uppdatera forumPosts
    const updatedPosts = forumPosts.map(p => p.id === editPostId ? { ...p, content: editContent } : p);
    setForumPosts(updatedPosts);
  };

  const handleDeletePost = (id: string) => {
    const localPostsRaw = localStorage.getItem('fbc-forum-posts');
    let localPosts = localPostsRaw ? JSON.parse(localPostsRaw) : [];
    localPosts = localPosts.filter((p:any) => p.id !== id);
    localStorage.setItem('fbc-forum-posts', JSON.stringify(localPosts));
    setShowDeleteId(null);
    // Uppdatera forumPosts
    setForumPosts(forumPosts.filter(p => p.id !== id));
  };

  // Frånvaroanmälan logik
  const handleAbsenceSubmit = async () => {
    if (!nextActivity || !authUser) return;
    setAbsenceSubmitting(true);
    const absence = {
      activityId: nextActivity.id,
      activityTitle: nextActivity.title,
      userId: authUser.id,
      userName: authUser.name,
      reason: absenceReason,
      comment: absenceComment,
      date: new Date().toISOString()
    };
    try {
      // Spara till backend via API
      const res = await apiService.post('/absences', absence);
      if (res.success) {
        setShowAbsencePopup(false);
        setAbsenceReason("");
        setAbsenceComment("");
      } else {
        alert(res.error || "Kunde inte spara frånvaroanmälan.");
      }
    } catch (err: any) {
      alert(err?.message || "Kunde inte spara frånvaroanmälan.");
    }
    setAbsenceSubmitting(false);
  };

return (
    <>
    {/* Grön gradient-overlay överst */}
    <div className={stylesCss.homeGradientTop} />
    {/* Header och innehåll här */}
    <header className={stylesCss.homeHeader}>
      {/* Snygg välkomsttext högst upp */}
      <div className={stylesCss.homeWelcomeText}>
        Välkommen {authUser?.name}!
      </div>
      {/* FBC-logga över hela headern i bakgrunden */}
      <img src="/fbc-logo.jpg" alt="FBC logga" className={stylesCss.homeHeaderLogo} />
      {/* Profilkort med badges */}
  <ProfileCard user={authUser} />
      {/* Knapprad längst ner i headern */}
      <div className={stylesCss.homeHeaderBtnRow}>
        <button className={`fbc-btn fbc-btn-logout ${stylesCss.homeLogoutBtn}`} onClick={() => setShowLogoutConfirm(true)} aria-label="Logga ut">Logga ut</button>
        <button className={`fbc-btn ${stylesCss.homeMenuBtn}`} onClick={() => setMenuOpen(true)} aria-label="Meny">
          <span className={stylesCss.homeMenuIcon} tabIndex={0} aria-label="Öppna meny" role="button">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </span>
        </button>
      </div>
    </header>
    {/* Popup: logga ut-bekräftelse */}
    {showLogoutConfirm && (
      <div className={stylesCss.homePopupOverlay}>
        <div className={stylesCss.homeLogoutPopup}>
          <div className={stylesCss.homeLogoutTitle}>
            <span className={stylesCss.homeLogoutIcon}>🔒</span> Bekräfta utloggning
          </div>
          <div className={stylesCss.homeLogoutText}>Är du säker på att du vill logga ut?</div>
          <div className={stylesCss.homeLogoutBtnRow}>
            <button className={`fbc-btn fbc-btn-logout ${stylesCss.homeLogoutPopupBtn}`} onClick={() => {
              logout();
              setShowLogoutConfirm(false);
              navigate("/");
            }}>Logga ut</button>
            <button className={`fbc-btn ${stylesCss.homeLogoutPopupBtn} ${stylesCss.homeLogoutPopupBtnCancel}`} onClick={() => setShowLogoutConfirm(false)}>Avbryt</button>
          </div>
        </div>
      </div>
    )}
    {/* Kommande aktiviteter */}
    <section className={`${activitiesStyles.activitiesContainer} ${activitiesStyles.homeSectionMargin}`}>
      <div className={activitiesStyles.activitiesCardBg}>
        <div className={`${activitiesStyles.activitiesHeader} ${activitiesStyles.homeHeaderMargin} ${activitiesStyles.activitiesHeaderFlex}`}>
          <span>Nästa aktivitet</span>
          <button className={activitiesStyles.activitiesAddBtn} onClick={() => navigate("/activities")} aria-label="Se alla aktiviteter" tabIndex={0}>
            Se alla aktiviteter
          </button>
        </div>
        <div className={activitiesStyles.activitiesList}>
          {activitiesLoading ? (
            <div className={activitiesStyles.activitiesCardBg}>Laddar aktiviteter...</div>
          ) : activitiesError ? (
            <div className={activitiesStyles.activitiesError}>{activitiesError}</div>
          ) : nextActivity ? (
            <ActivityCard
              activity={nextActivity}
              styles={activitiesStyles}
              onCheckIn={() => alert('Du har checkat in på aktiviteten!')}
              onCheckOut={() => alert('Du har checkat ut från aktiviteten!')}
              onAbsence={() => { setAbsenceActivity(nextActivity); setShowAbsencePopup(true); }}
              expandable={true}
            />
          ) : (
            <div className={activitiesStyles.activitiesEmpty}>Ingen kommande aktivitet</div>
          )}
        </div>
      </div>
    </section>

        {/* Popup för frånvaroanmälan */}
        {showAbsencePopup && absenceActivity && (
          <div className={stylesCss.homePopupOverlay}>
            <div className={stylesCss.homeAbsencePopup}>
              <div className={stylesCss.homeAbsenceTitle}>Frånvaroanmälan</div>
              <div className={stylesCss.homeAbsenceText}>
                Du anmäler frånvaro för: <b>{absenceActivity.title}</b>
              </div>
              <label className={stylesCss.homeAbsenceLabel}>Anledning</label>
              <input type="text" value={absenceReason} onChange={e => setAbsenceReason(e.target.value)} className={stylesCss.homeAbsenceInput} placeholder="Sjuk, bortrest, etc." />
              <textarea value={absenceComment} onChange={e => setAbsenceComment(e.target.value)} className={stylesCss.homeAbsenceTextarea} placeholder="Exempel: Krya på dig!" />
              <div className={stylesCss.homeAbsenceBtnRow}>
                <button className={`fbc-btn ${stylesCss.homeAbsenceSendBtn}`} onClick={handleAbsenceSubmit} disabled={absenceSubmitting || !absenceReason}>
                  {absenceSubmitting ? "Skickar..." : "Skicka frånvaro"}
                </button>
                <button className={`fbc-btn fbc-btn-logout ${stylesCss.homeAbsenceCancelBtn}`} onClick={() => setShowAbsencePopup(false)} disabled={absenceSubmitting}>Avbryt</button>
              </div>
            </div>
          </div>
        )}

        {/* Forumsektion */}
        <section className={`${activitiesStyles.activitiesContainer} ${activitiesStyles.homeSectionMargin}`}>
          <div className={activitiesStyles.activitiesCardBg}>
            <div className={`${activitiesStyles.activitiesHeader} ${activitiesStyles.homeHeaderMargin}`}>Forum</div>
            <button className={activitiesStyles.activitiesAddBtn} onClick={() => navigate('/forum')} aria-label="Se alla foruminlägg" tabIndex={0}>
              Se alla inlägg
            </button>
            <div className={activitiesStyles.activitiesList}>
              {forumLoading ? (
                <div className={activitiesStyles.activitiesCardBg}>Laddar forum...</div>
              ) : forumError ? (
                <div className={activitiesStyles.activitiesError}>{forumError}</div>
              ) : forumPosts.length === 0 ? (
                <div className={activitiesStyles.activitiesEmpty}>Inga inlägg ännu.</div>
              ) : null}
              {/* Modal för redigering */}
              {editPostId && (
                <div className={stylesCss.homePopupOverlay}>
                  <div className={activitiesStyles.activitiesCardBg}>
                    <div className={stylesCss.homeEditTitle}>Redigera inlägg</div>
                    <textarea value={editContent} onChange={e => setEditContent(e.target.value)} className={stylesCss.homeEditTextarea} placeholder="Redigera inlägg..." />
                    <div className={stylesCss.homeAbsenceBtnRow}>
                      <button className={`fbc-btn ${stylesCss.homeEditSaveBtn}`} onClick={handleSaveEdit}>Spara</button>
                      <button className={`fbc-btn fbc-btn-logout ${stylesCss.homeEditCancelBtn}`} onClick={() => setEditPostId(null)}>Avbryt</button>
                    </div>
                  </div>
                </div>
              )}
              {/* Modal för ta bort */}
              {showDeleteId && (
                <div className={stylesCss.homePopupOverlay}>
                  <div className={activitiesStyles.activitiesCardBg}>
                    <div className={stylesCss.homeDeleteTitle}>Ta bort inlägg</div>
                    <div className={stylesCss.homeAbsenceText}>Är du säker på att du vill ta bort detta inlägg?</div>
                    <div className={stylesCss.homeAbsenceBtnRow}>
                      <button className={`fbc-btn fbc-btn-logout ${stylesCss.homeDeleteBtn}`} onClick={() => handleDeletePost(showDeleteId)}>Ta bort</button>
                      <button className={`fbc-btn ${stylesCss.homeDeleteCancelBtn}`} onClick={() => setShowDeleteId(null)}>Avbryt</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Chatbubbla nere till höger */}
        {!menuOpen && (
          <button
            className={stylesCss.homeChatBubble}
            aria-label="Öppna chatten"
            onClick={() => navigate('/chat')}
          >
            💬
          </button>
        )}

        {/* Motiverande veckotext */}
        <section className={`${activitiesStyles.activitiesContainer} ${activitiesStyles.homeSectionMargin}`}>
          <div className={activitiesStyles.activitiesCardBg}>
            <div className={`${activitiesStyles.activitiesHeader} ${activitiesStyles.homeHeaderMargin}`}>Veckans motivation</div>
            <div className={activitiesStyles.activitiesList}>
              <span className={activitiesStyles.finesWarningTitle}>
                💡 {motivationalText}
              </span>
            </div>
          </div>
        </section>

        {/* Nästa födelsedag */}
        {nextBirthday && (
          <section className={`${activitiesStyles.activitiesContainer} ${activitiesStyles.homeSectionMargin}`}>
            <div className={activitiesStyles.activitiesCardBg}>
              <div className={`${activitiesStyles.activitiesHeader} ${activitiesStyles.homeHeaderMargin}`}>Nästa födelsedag</div>
              <div className={activitiesStyles.activitiesList}>
                <span className={activitiesStyles.finesWarningTitle}>
                  🎂 {nextBirthday.name} fyller år {nextBirthday.date.toLocaleDateString("sv-SE", { day: "numeric", month: "long" })} och blir {nextBirthday.age} år!
                </span>
              </div>
            </div>
          </section>
        )}

    {/* Statistik borttagen */}

    {/* Meny-popup med modern stil */}
<MenuPopup open={menuOpen} onClose={() => setMenuOpen(false)} menuItems={menuItems} navigate={navigate} />
				{/* Footer med copyright och länk till policyer */}
        {/* Böter längst ner */}
        {userFines && userFines.outstanding > 0 && (
          <div className={activitiesStyles.activitiesCardBg}>
            <span className={activitiesStyles.finesWarningTitle}>⚠️ Du har obetalda böter!</span>
            <span>Summa att betala: <b>{userFines.outstanding} kr</b></span>
            <div className={activitiesStyles.finesWarningText}>Betala till lagets böteskonto snarast.</div>
          </div>
        )}
        <footer className={stylesCss.homeFooter}>
          <div className={stylesCss.homeFooterCopyright}>
            &copy; {new Date().getFullYear()} FBC - Alla rättigheter förbehållna.
          </div>
          <div className={stylesCss.homeFooterLinks}>
            <a href="/privacy-policy" className={stylesCss.homeFooterLink} onClick={e => { e.preventDefault(); navigate('/privacy-policy'); }}>
              Policy för personuppgifter
            </a>
            <a href="/terms-of-service" className={stylesCss.homeFooterLink} onClick={e => { e.preventDefault(); navigate('/terms-of-service'); }}>
              Användarvillkor
            </a>
            <a href="/cookie-policy" className={stylesCss.homeFooterLink} onClick={e => { e.preventDefault(); navigate('/cookie-policy'); }}>
              Cookiepolicy
            </a>
          </div>
        </footer>
    </>
    );
  };

export default React.memo(Home);