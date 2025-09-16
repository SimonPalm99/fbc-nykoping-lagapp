import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { Activity } from "../types/activity";
import { forumAPI } from "../services/apiService";
import { apiService } from "../services/apiService";
import ForumPostCard from "../components/forum/ForumPostCard";
import ActivityCard from "../components/activities/ActivityCard";
import ProfileCard from "../components/common/ProfileCard";
import MenuPopup from "../components/common/MenuPopup";

const getStyles = (isDark: boolean) => ({
    primaryGreen: "#2E7D32",
    accentGreen: "#4CAF50",
    fbcGold: "#FFB300",
    cardBackground: isDark ? "rgba(16, 32, 16, 0.97)" : "#FFFFFF",
    textPrimary: isDark ? "#F1F8E9" : "#1B5E20",
    textSecondary: isDark ? "#C8E6C9" : "#4A5568",
    gradients: {
        primary: "linear-gradient(135deg, #2E7D32 0%, #388E3C 50%, #4CAF50 100%)",
        gold: "linear-gradient(135deg, #FFB300 0%, #FF8F00 100%)",
        body: isDark 
            ? "linear-gradient(135deg, #0A0A0A 0%, #0D1B0D 30%, #1B2E1B 100%)"
            : "linear-gradient(135deg, #FAFAFA 0%, #F1F8E9 30%, #E8F5E9 100%)",
        cardHover: isDark
            ? "linear-gradient(135deg, rgba(46, 125, 50, 0.25) 0%, rgba(56, 142, 60, 0.25) 100%)"
            : "linear-gradient(135deg, rgba(46, 125, 50, 0.07) 0%, rgba(56, 142, 60, 0.07) 100%)",
    }
});

const Home: React.FC = () => {
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
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { user: authUser } = useUser();
    const { logout } = useAuth();
    const styles = getStyles(isDark);
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
        const now = new Date();
        const sorted = res.data
          .filter((a: any) => new Date(a.date) >= now)
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
    <div style={{ minHeight: "100vh", background: styles.gradients.body, color: "#f8fafc", fontFamily: "inherit", padding: "1.2rem 0", position: "relative", overflow: "hidden" }}>
      {/* Grön gradient-overlay överst */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 180, background: "linear-gradient(135deg, #22c55e 0%, #0a0a0a 100%)", opacity: 0.18, zIndex: 0, pointerEvents: "none" }} />
      {/* Header och innehåll här */}
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
					{/* Snygg välkomsttext högst upp */}
					<div style={{ width: "100%", textAlign: "center", fontWeight: 900, fontSize: "1.35rem", color: "#fff", letterSpacing: "1px", textShadow: "0 2px 8px #2E7D32, 0 0px 2px #000", marginBottom: "0.3rem", zIndex: 2 }}>
						Välkommen {authUser?.name}!
					</div>
					{/* FBC-logga över hela headern i bakgrunden */}
					<img src="/fbc-logo.jpg" alt="FBC logga" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.10, zIndex: 0, pointerEvents: "none", filter: "blur(1px) grayscale(0.2)" }} />
					{/* Profilkort med badges */}
          <ProfileCard user={authUser} styles={styles} />
					{/* Knapprad längst ner i headern */}
					<div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1.2rem", marginTop: "0.7rem", zIndex: 2 }}>
      <button className="fbc-btn fbc-btn-logout" onClick={() => setShowLogoutConfirm(true)} aria-label="Logga ut" style={{ padding: "0.6rem 1.2rem", fontSize: "0.95rem", backgroundColor: "#e53935", color: "#222" }}>Logga ut</button>
      <button className="fbc-btn" onClick={() => setMenuOpen(true)} style={{ position: "relative", padding: "0.6rem 1rem", fontSize: "1.2rem", backgroundColor: styles.primaryGreen, borderRadius: "50%", boxShadow: "0 2px 8px rgba(46,125,50,0.18)", transition: "transform 0.2s", color: "#222" }} aria-label="Meny">
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }} tabIndex={0} aria-label="Öppna meny" role="button">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </span>
      </button>
					</div>
				</header>
				{/* Popup: logga ut-bekräftelse */}
				{showLogoutConfirm && (
					<div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.35)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
						<div style={{ background: "#fff", borderRadius: "1.5rem", padding: "2.5rem 2.5rem 2rem 2.5rem", boxShadow: "0 8px 32px rgba(46,125,50,0.18)", textAlign: "center", minWidth: 280, maxWidth: 90, border: "2px solid #FFB300", position: "relative" }}>
							<div style={{ fontWeight: 900, fontSize: "1.35rem", color: "#2E7D32", marginBottom: "1.2rem", letterSpacing: "1px" }}>
								<span style={{ fontSize: "2.2rem", marginRight: "0.5rem" }}>🔒</span> Bekräfta utloggning
							</div>
							<div style={{ color: "#4A5568", fontSize: "1.05rem", marginBottom: "1.5rem" }}>
								Är du säker på att du vill logga ut?
							</div>
							<div style={{ display: "flex", justifyContent: "center", gap: "1.2rem" }}>
								<button className="fbc-btn fbc-btn-logout" style={{ minWidth: 110, fontSize: "1.05rem" }} onClick={() => {
									logout();
									setShowLogoutConfirm(false);
									navigate("/");
								}}>Logga ut</button>
								<button className="fbc-btn" style={{ minWidth: 110, fontSize: "1.05rem", background: "#4CAF50" }} onClick={() => setShowLogoutConfirm(false)}>Avbryt</button>
							</div>
						</div>
					</div>
				)}
        {/* Kommande aktiviteter */}
        <section style={{ maxWidth: 900, margin: "2rem auto 2rem auto", padding: "0 1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.7rem" }}>
            <span style={{ fontWeight: 900, fontSize: "1.18rem", color: styles.primaryGreen, letterSpacing: "1px" }}>Nästa aktivitet</span>
            <button onClick={() => navigate("/activities")}
              style={{ background: styles.primaryGreen, color: "white", border: "none", borderRadius: "8px", padding: "0.25rem 0.9rem", fontWeight: 600, fontSize: "0.95rem", cursor: "pointer", boxShadow: "0 2px 8px rgba(46,125,50,0.10)" }} aria-label="Se alla aktiviteter" tabIndex={0}>
              Se alla aktiviteter
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {/* Loading/error för aktiviteter */}
            {activitiesLoading ? (
              <div style={{ color: styles.primaryGreen, fontWeight: 700, fontSize: '1.05rem' }}>Laddar aktiviteter...</div>
            ) : activitiesError ? (
              <div style={{ color: '#e53935', fontWeight: 700, fontSize: '1.05rem' }}>{activitiesError}</div>
            ) : nextActivity ? (
              <ActivityCard
                activity={nextActivity}
                styles={styles}
                onAbsence={() => {
                  setAbsenceActivity(nextActivity);
                  setShowAbsencePopup(true);
                }}
              />
            ) : (
              <div style={{ color: styles.textSecondary, fontSize: "1.05rem" }}>Ingen kommande aktivitet</div>
            )}
          </div>
        </section>

        {/* Popup för frånvaroanmälan */}
        {showAbsencePopup && absenceActivity && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.35)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#fff", borderRadius: "1.2rem", padding: "2rem 2rem 1.5rem 2rem", boxShadow: "0 8px 32px rgba(46,125,50,0.18)", minWidth: 280, maxWidth: 400, border: `2px solid ${styles.fbcGold}` }}>
              <div style={{ fontWeight: 900, fontSize: "1.15rem", color: styles.fbcGold, marginBottom: "1.2rem" }}>Frånvaroanmälan</div>
              <div style={{ color: styles.textSecondary, fontSize: "1.05rem", marginBottom: "1.2rem" }}>
                Du anmäler frånvaro för: <b>{absenceActivity.title}</b>
              </div>
              <label style={{ fontWeight: 700, color: styles.primaryGreen, marginBottom: "0.5rem", display: "block" }}>Anledning</label>
              <input type="text" value={absenceReason} onChange={e => setAbsenceReason(e.target.value)} style={{ width: "100%", fontSize: "1rem", borderRadius: 8, border: `1.5px solid ${styles.primaryGreen}`, marginBottom: "1.2rem", padding: "0.5rem" }} placeholder="Sjuk, bortrest, etc." />
              <label style={{ fontWeight: 700, color: styles.primaryGreen, marginBottom: "0.5rem", display: "block" }}>Kommentar (valfritt)</label>
              <textarea value={absenceComment} onChange={e => setAbsenceComment(e.target.value)} style={{ width: "100%", minHeight: 60, fontSize: "1rem", borderRadius: 8, border: `1.5px solid ${styles.primaryGreen}`, marginBottom: "1.2rem", padding: "0.5rem" }} placeholder="Exempel: Krya på dig!" />
              <div style={{ display: "flex", gap: "1.2rem", justifyContent: "center" }}>
                <button className="fbc-btn" style={{ background: styles.fbcGold, color: '#222', borderRadius: 8, padding: '0.4rem 1.2rem', fontWeight: 700, fontSize: '1.05rem', border: 'none' }} onClick={handleAbsenceSubmit} disabled={absenceSubmitting || !absenceReason}>
                  {absenceSubmitting ? "Skickar..." : "Skicka frånvaro"}
                </button>
                <button className="fbc-btn fbc-btn-logout" style={{ background: '#e53935', color: '#fff', borderRadius: 8, padding: '0.4rem 1.2rem', fontWeight: 700, fontSize: '1.05rem', border: 'none' }} onClick={() => setShowAbsencePopup(false)} disabled={absenceSubmitting}>Avbryt</button>
              </div>
            </div>
          </div>
        )}

				{/* Forumsektion, nu först */}
				<section style={{ maxWidth: 900, margin: '0 auto 2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.7rem' }}>
        <span style={{ fontWeight: 900, fontSize: '1.18rem', color: styles.primaryGreen, letterSpacing: '1px' }}>Forum</span>
        <button onClick={() => navigate('/forum')}
          style={{ background: styles.primaryGreen, color: 'white', border: 'none', borderRadius: '8px', padding: '0.25rem 0.9rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(46,125,50,0.10)' }} aria-label="Se alla foruminlägg" tabIndex={0}>
          Se alla inlägg
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {/* Visa endast senaste inlägget, om det finns */}
        {forumLoading ? (
          <div style={{ color: styles.primaryGreen, fontWeight: 700, fontSize: '1.05rem' }}>Laddar forum...</div>
        ) : forumError ? (
          <div style={{ color: '#e53935', fontWeight: 700, fontSize: '1.05rem' }}>{forumError}</div>
        ) : forumPosts.length === 0 ? (
          <div style={{ color: styles.textSecondary, fontSize: '1.05rem' }}>Inga inlägg ännu.</div>
        ) : (
          forumPosts[0] ? <ForumPostCard post={forumPosts[0]} styles={styles} /> : null
        )}
        {/* Modal för redigering */}
        {editPostId && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: '1.2rem', padding: '2rem 2rem 1.5rem 2rem', boxShadow: '0 8px 32px rgba(46,125,50,0.18)', minWidth: 280, maxWidth: 400, border: `2px solid ${styles.primaryGreen}` }}>
              <div style={{ fontWeight: 900, fontSize: '1.15rem', color: styles.primaryGreen, marginBottom: '1.2rem' }}>Redigera inlägg</div>
              <textarea value={editContent} onChange={e => setEditContent(e.target.value)} style={{ width: '100%', minHeight: 80, fontSize: '1rem', borderRadius: 8, border: `1.5px solid ${styles.primaryGreen}`, marginBottom: '1.2rem', padding: '0.5rem' }} />
              <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
                <button className="fbc-btn" style={{ background: styles.primaryGreen, color: '#fff', borderRadius: 8, padding: '0.4rem 1.2rem', fontWeight: 700, fontSize: '1.05rem', border: 'none' }} onClick={handleSaveEdit}>Spara</button>
                <button className="fbc-btn fbc-btn-logout" style={{ background: '#e53935', color: '#fff', borderRadius: 8, padding: '0.4rem 1.2rem', fontWeight: 700, fontSize: '1.05rem', border: 'none' }} onClick={() => setEditPostId(null)}>Avbryt</button>
              </div>
            </div>
          </div>
        )}
        {/* Modal för ta bort */}
        {showDeleteId && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: '1.2rem', padding: '2rem 2rem 1.5rem 2rem', boxShadow: '0 8px 32px rgba(46,125,50,0.18)', minWidth: 280, maxWidth: 400, border: `2px solid #e53935` }}>
              <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#e53935', marginBottom: '1.2rem' }}>Ta bort inlägg</div>
              <div style={{ color: styles.textSecondary, fontSize: '1.05rem', marginBottom: '1.2rem' }}>Är du säker på att du vill ta bort detta inlägg?</div>
              <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
                <button className="fbc-btn fbc-btn-logout" style={{ background: '#e53935', color: '#fff', borderRadius: 8, padding: '0.4rem 1.2rem', fontWeight: 700, fontSize: '1.05rem', border: 'none' }} onClick={() => handleDeletePost(showDeleteId)}>Ta bort</button>
                <button className="fbc-btn" style={{ background: styles.primaryGreen, color: '#fff', borderRadius: 8, padding: '0.4rem 1.2rem', fontWeight: 700, fontSize: '1.05rem', border: 'none' }} onClick={() => setShowDeleteId(null)}>Avbryt</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>

    {/* Statistik borttagen */}

    {/* Meny-popup med modern stil */}
<MenuPopup open={menuOpen} onClose={() => setMenuOpen(false)} menuItems={menuItems} styles={styles} navigate={navigate} />
				{/* Footer med copyright och länk till policyer */}
				<footer style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem", borderTop: `2px solid ${styles.primaryGreen}`, display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", fontSize: "0.9rem", color: styles.textSecondary }}>
					<div style={{ textAlign: "center" }}>
						&copy; {new Date().getFullYear()} FBC - Alla rättigheter förbehållna.
					</div>
					<div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            <a href="/privacy-policy" style={{ color: styles.textSecondary, textDecoration: "none", transition: "color 0.2s" }} onClick={e => { e.preventDefault(); navigate('/privacy-policy'); }} onMouseEnter={e => e.currentTarget.style.color = "#FFB300"} onMouseLeave={e => e.currentTarget.style.color = styles.textSecondary}>
              Policy för personuppgifter
            </a>
            <a href="/terms-of-service" style={{ color: styles.textSecondary, textDecoration: "none", transition: "color 0.2s" }} onClick={e => { e.preventDefault(); navigate('/terms-of-service'); }} onMouseEnter={e => e.currentTarget.style.color = "#FFB300"} onMouseLeave={e => e.currentTarget.style.color = styles.textSecondary}>
              Användarvillkor
            </a>
            <a href="/cookie-policy" style={{ color: styles.textSecondary, textDecoration: "none", transition: "color 0.2s" }} onClick={e => { e.preventDefault(); navigate('/cookie-policy'); }} onMouseEnter={e => e.currentTarget.style.color = "#FFB300"} onMouseLeave={e => e.currentTarget.style.color = styles.textSecondary}>
              Cookiepolicy
            </a>
					</div>
				</footer>
			</div>
		);
	};

export default React.memo(Home);