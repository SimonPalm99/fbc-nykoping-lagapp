import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PWAInstallButtonCompact } from "./ui/PWAInstallButton";
import { AuthManager } from "./auth/AuthManager";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

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
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "var(--bg-secondary)",
        backdropFilter: "blur(20px)",
        borderBottom: "2px solid var(--fbc-primary)",
        padding: "0.75rem 0",
        boxShadow: "var(--shadow-lg)"
      }}>
        <div className="container" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem"
        }}>
          {/* Logo & Klubbnamn - FBC Nyköping Style */}
          <NavLink to="/" style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.75rem",
            textDecoration: "none",
            color: "inherit"
          }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--fbc-primary), var(--fbc-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-glow)",
              border: "2px solid var(--fbc-primary)"
            }}>
              <img 
                src="/fbc-logo.jpg" 
                alt="FBC Nyköping" 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  borderRadius: "50%",
                  objectFit: "cover"
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 20px; color: white; font-weight: bold;">⚡</span>';
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ 
                fontWeight: "800", 
                fontSize: "1.1rem",
                color: "#ffffff",
                lineHeight: "1.2",
                letterSpacing: "-0.025em",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)"
              }}>
                FBC NYKÖPING
              </span>
              <span style={{ 
                fontSize: "0.7rem", 
                color: "#7CB342",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                LAGAPP
              </span>
            </div>
          </NavLink>

          {/* Huvudnavigation - Desktop */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }} className="desktop-nav">
            {primaryNavLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: isActive ? "#22c55e" : "#64748b",
                  background: isActive ? "rgba(34, 197, 94, 0.1)" : "transparent",
                  border: isActive ? "1px solid rgba(34, 197, 94, 0.2)" : "1px solid transparent",
                  transition: "all 0.2s ease"
                })}
                end={link.path === "/"}
              >
                <span>{link.icon}</span>
                <span className="nav-text">{link.label}</span>
              </NavLink>
            ))}
            
            {/* Mer-knapp med dropdown */}
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: showMenu ? "#22c55e" : "#64748b",
                  background: showMenu ? "rgba(34, 197, 94, 0.1)" : "transparent",
                  border: showMenu ? "1px solid rgba(34, 197, 94, 0.2)" : "1px solid transparent",
                  transition: "all 0.2s ease",
                  cursor: "pointer"
                }}
              >
                <span>📱</span>
                <span className="nav-text">Mer</span>
                <span style={{ 
                  transform: showMenu ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease"
                }}>▼</span>
              </button>
              
              {/* Dropdown Menu */}
              {showMenu && (
                <div 
                  className="dropdown-menu"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    minWidth: "280px",
                    background: "rgba(15, 23, 42, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "16px",
                    padding: "12px",
                    marginTop: "8px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    zIndex: 1001,
                    maxHeight: "400px",
                    overflowY: "auto"
                  }}
                >
                  {secondaryNavLinks.map(link => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setShowMenu(false)}
                      style={({ isActive }) => ({
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "12px",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: isActive ? "#22c55e" : "#ffffff",
                        background: isActive ? "rgba(34, 197, 94, 0.1)" : "transparent",
                        border: isActive ? "1px solid rgba(34, 197, 94, 0.2)" : "1px solid transparent",
                        transition: "all 0.2s ease",
                        marginBottom: "4px"
                      })}
                    >
                      <span style={{ fontSize: "1.1rem" }}>{link.icon}</span>
                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions - Sök, Notifieringar, Profil */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            {/* Sökknapp */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              style={{
                background: "none",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "0.5rem",
                cursor: "pointer",
                color: "#64748b",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#22c55e";
                e.currentTarget.style.color = "#22c55e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.color = "#64748b";
              }}
            >
              🔍
            </button>

            {/* Notifieringar - endast för inloggade användare */}
            {isAuthenticated && (
              <div ref={notificationRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    background: "none",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "0.5rem",
                    cursor: "pointer",
                    color: "#64748b",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#22c55e";
                    e.currentTarget.style.color = "#22c55e";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.color = "#64748b";
                  }}
                >
                  🔔
                  {unreadCount > 0 && (
                    <span style={{
                      position: "absolute",
                      top: "-2px",
                      right: "-2px",
                      background: "#ef4444",
                      color: "white",
                      borderRadius: "50%",
                      width: "18px",
                      height: "18px",
                      fontSize: "0.625rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "600"
                    }}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifikationspanel */}
                {showNotifications && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "0.5rem",
                    width: "320px",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "12px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                    padding: "1rem",
                    zIndex: 1001
                  }}>
                    <div style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#0f172a",
                      marginBottom: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <span>Notifieringar</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#64748b",
                            cursor: "pointer",
                            fontSize: "0.75rem"
                          }}
                        >
                          Markera alla som lästa
                        </button>
                      )}
                    </div>
                    
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {notifications.length === 0 ? (
                        <div style={{
                          textAlign: "center",
                          color: "#64748b",
                          fontSize: "0.875rem",
                          padding: "2rem 1rem"
                        }}>
                          Inga notifieringar
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            onClick={() => markAsRead(notification.id)}
                            style={{
                              padding: "0.75rem",
                              marginBottom: "0.5rem",
                              background: notification.isRead ? "#f8fafc" : "#eff6ff",
                              borderRadius: "8px",
                              fontSize: "0.875rem",
                              cursor: "pointer",
                              transition: "all 0.2s ease"
                            }}
                          >
                            <div style={{ 
                              color: "#0f172a", 
                              marginBottom: "0.25rem",
                              fontWeight: notification.isRead ? "400" : "600"
                            }}>
                              {notification.title}
                            </div>
                            <div style={{ 
                              color: "#64748b", 
                              fontSize: "0.75rem",
                              marginBottom: "0.25rem" 
                            }}>
                              {notification.message}
                            </div>
                            <div style={{ color: "#94a3b8", fontSize: "0.7rem" }}>
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
            <div style={{ marginLeft: "0.5rem" }}>
              <AuthManager />
            </div>
          </div>
        </div>

        {/* Sökfält */}
        {showSearch && (
          <div ref={searchRef} style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderTop: "1px solid rgba(226, 232, 240, 0.8)",
            padding: "1rem 0"
          }}>
            <div className="container">
              <form onSubmit={handleSearch} style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "1rem"
              }}>
                <input
                  type="text"
                  placeholder="Sök spelare, aktiviteter, inlägg..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.875rem",
                    background: "white"
                  }}
                  autoFocus
                />
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Sök
                </button>
              </form>

              {/* Snabbsök-förslag */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "0.5rem"
              }}>
                {quickSearchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={suggestion.action}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.75rem",
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "left"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#22c55e";
                      e.currentTarget.style.background = "#f0fdf4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.background = "white";
                    }}
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
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(226, 232, 240, 0.8)",
        padding: "0.75rem 0",
        display: "none"
      }} className="mobile-nav">
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center"
        }}>
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
              <span style={{ fontSize: "1.25rem" }}>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
          
          {/* Mer-knapp för mobile */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.5rem",
              background: "none",
              border: "none",
              color: showMenu ? "#22c55e" : "#64748b",
              fontSize: "0.75rem",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>📱</span>
            <span>Mer</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          background: "rgba(15, 23, 42, 0.98)",
          backdropFilter: "blur(20px)",
          zIndex: 1002,
          display: "flex",
          flexDirection: "column",
          padding: "2rem 1rem",
          overflowY: "auto"
        }} className="mobile-menu-overlay">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem"
          }}>
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: "800",
              color: "#ffffff",
              margin: 0
            }}>
              Meny
            </h2>
            <button
              onClick={() => setShowMenu(false)}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                color: "#ffffff",
                fontSize: "1.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ×
            </button>
          </div>
          
          <div 
            className="dropdown-menu"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
              maxHeight: "calc(100vh - 120px)",
              overflowY: "auto"
            }}
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
                <span style={{ fontSize: "1.5rem" }}>{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
