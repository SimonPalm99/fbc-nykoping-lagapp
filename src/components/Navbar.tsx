import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PWAInstallButtonCompact } from "./ui/PWAInstallButton";
import { AuthManager } from "./auth/AuthManager";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import styles from "./Navbar.module.css";

const primaryNavLinks = [
  { path: "/", label: "Hem", icon: "🏠" },
  { path: "/activities", label: "Aktiviteter", icon: "📅" },
  { path: "/statistics", label: "Statistik", icon: "📊" },
  { path: "/league", label: "Liga", icon: "🏆" }
];

const secondaryNavLinks = [
  { path: "/training-log", label: "Träningslogg", icon: "💪" },
  { path: "/health", label: "Hälsa", icon: "🏥" },
  { path: "/chat", label: "Chat", icon: "💭" },
  { path: "/forum", label: "Forum", icon: "💬" },
  { path: "/tactics", label: "Taktik", icon: "🏒" },
  { path: "/fines", label: "Böter", icon: "💰" },
  { path: "/opponents", label: "Motståndare", icon: "🥅" },
  { path: "/matchplan", label: "Matchplan", icon: "📋" },
  { path: "/postmatch", label: "Analys", icon: "📹" },
  { path: "/gamification", label: "Utmärkelser", icon: "🏅" },
  { path: "/profile", label: "Profil", icon: "👤" }
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { isAuthenticated } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (showMenu) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [showMenu]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const quickSearchSuggestions = [
    { label: "Kommande träningar", icon: "📅", action: () => navigate("/activities?filter=training") },
    { label: "Senaste matcher", icon: "🏒", action: () => navigate("/statistics?view=recent") },
    { label: "Lagstatistik", icon: "📊", action: () => navigate("/statistics") },
    { label: "Chatten", icon: "💭", action: () => navigate("/chat") },
    { label: "Mina böter", icon: "💰", action: () => navigate("/fines") }
  ];

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          {/* Logo & Klubbnamn - FBC Nyköping Style */}
          <NavLink
            to="/"
            className={() => styles.logoLink}
          >
            <div className={styles.logoCircle}>
              <img 
                src="/fbc-logo.jpg" 
                alt="FBC Nyköping" 
                className={styles.logoImg}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 20px; color: white; font-weight: bold;">⚡</span>';
                }}
              />
            </div>
            <div className={styles.logoTextColumn}>
              <span className={styles.logoTitle}>FBC NYKÖPING</span>
              <span className={styles.logoSubtitle}>LAGAPP</span>
            </div>
          </NavLink>

          {/* Huvudnavigation - Desktop */}
          <div className={styles.desktopNav}>
            {primaryNavLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.navLinkActive}`
                    : styles.navLink
                }
                end={link.path === "/"}
              >
                <span>{link.icon}</span>
                <span className="nav-text">{link.label}</span>
              </NavLink>
            ))}
            
            {/* Mer-knapp med dropdown */}
            <div ref={menuRef} className={styles.menuRelative}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={showMenu ? `${styles.moreBtn} ${styles.moreBtnActive}` : styles.moreBtn}
              >
                <span>📱</span>
                <span className="nav-text">Mer</span>
                <span className={showMenu ? `${styles.moreIcon} ${styles.moreIconOpen}` : styles.moreIcon}>▼</span>
              </button>
              
              {/* Dropdown Menu */}
              {showMenu && (
                <div className={styles.dropdownMenu}>
                  {secondaryNavLinks.map(link => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setShowMenu(false)}
                      className={({ isActive }) =>
                        isActive
                          ? `${styles.dropdownLink} ${styles.dropdownLinkActive}`
                          : styles.dropdownLink
                      }
                    >
                      <span className={styles.dropdownIcon}>{link.icon}</span>
                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions - Sök, Notifieringar, Profil */}
          <div className={styles.actions}>
            {/* Sökknapp */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={styles.searchBtn}
            >
              🔍
            </button>

            {/* Notifieringar - endast för inloggade användare */}
            {isAuthenticated && (
              <div ref={notificationRef} className={styles.notifContainer}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={styles.notifBtn}
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className={styles.notifBadge}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifikationspanel */}
                {showNotifications && (
                  <div className={styles.notifPanel}>
                    <div className={styles.notifPanelHeader}>
                      <span>Notifieringar</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className={styles.notifPanelMarkAll}
                        >
                          Markera alla som lästa
                        </button>
                      )}
                    </div>
                    <div className={styles.notifList}>
                      {notifications.length === 0 ? (
                        <div className={styles.notifEmpty}>
                          Inga notifieringar
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            onClick={() => markAsRead(notification.id)}
                            className={
                              notification.isRead
                                ? `${styles.notifItem} ${styles.notifItemRead}`
                                : `${styles.notifItem} ${styles.notifItemUnread}`
                            }
                          >
                            <div className={styles.notifItemTitle}>
                              {notification.title}
                            </div>
                            <div className={styles.notifItemMsg}>
                              {notification.message}
                            </div>
                            <div className={styles.notifItemTime}>
                              {new Date(notification.createdAt).toLocaleString('sv-SE', {
                                month: 'short',
                                day: 'numeric', 
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PWA Install-knapp */}
            <PWAInstallButtonCompact />

            {/* Auth Manager */}
            <div className={styles.pwaBtnWrap}>
              <AuthManager />
            </div>
          </div>
        </div>

        {/* Sökfält */}
        {showSearch && (
          <div ref={searchRef} className={styles.searchBarContainer}>
            <div className="container">
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                  type="text"
                  placeholder="Sök spelare, aktiviteter, inlägg..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  autoFocus
                />
                <button
                  type="submit"
                  className={styles.searchSubmitBtn}
                >
                  Sök
                </button>
              </form>

              {/* Snabbsök-förslag */}
              <div className={styles.quickSearchGrid}>
                {quickSearchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={suggestion.action}
                    className={styles.quickSearchBtn}
                  >
                    <span>{suggestion.icon}</span>
                    <span>{suggestion.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobilnavigation */}
      <div className={`${styles.mobileNav} mobile-nav`}>
        <div className={styles.mobileNavInner}>
          {primaryNavLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.25rem",
                padding: "0.5rem",
                textDecoration: "none",
                color: isActive ? "#22c55e" : "#64748b",
                fontSize: "0.75rem",
                fontWeight: "600",
                position: "relative"
              })}
              end={link.path === "/"}
            >
              <span className={styles.mobileNavIcon}>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
          
          {/* Mer-knapp för mobile */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={
              showMenu
                ? `${styles.mobileMoreBtn} ${styles.mobileMoreBtnActive}`
                : styles.mobileMoreBtn
            }
          >
            <span className={styles.mobileMoreIcon}>📱</span>
            <span>Mer</span>
          </button>
          {showMenu && (
            <div
              className={`${styles.mobileMenuOverlay} mobile-menu-overlay`}
            >
              <div className={styles.mobileMenuHeader}>
                <h2 className={styles.mobileMenuTitle}>
                  Meny
                </h2>
                <button
                  onClick={() => setShowMenu(false)}
                  className={styles.mobileMenuCloseBtn}
                >
                  ×
                </button>
              </div>
              
              <div 
                className={`dropdown-menu ${styles.mobileMenuGrid}`}
              >
                {secondaryNavLinks.map(link => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setShowMenu(false)}
                    style={({ isActive }) => ({
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1rem 1.5rem",
                      borderRadius: "16px",
                      textDecoration: "none",
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: isActive ? "#22c55e" : "#ffffff",
                      background: isActive 
                        ? "rgba(34, 197, 94, 0.1)" 
                        : "rgba(255, 255, 255, 0.05)",
                      border: isActive 
                        ? "1px solid rgba(34, 197, 94, 0.2)" 
                        : "1px solid rgba(255, 255, 255, 0.1)",
                      transition: "all 0.2s ease"
                    })}
                  >
                    <span className={styles.mobileMenuIcon}>{link.icon}</span>
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
