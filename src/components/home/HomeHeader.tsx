import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../ui/Toast';

interface HomeHeaderProps {
  styles: any; // TODO: Proper type for styles
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ styles }) => {
  const { user: authUser } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1.25rem 1.5rem",
      background: styles.cardBackground,
      borderBottom: `2px solid ${styles.primaryGreen}`,
      boxShadow: styles.shadows.medium,
      position: "relative"
    }}>
      {/* Bakgrundsdekor */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: styles.gradients.primary
      }} />
      
      {/* Profil sektion */}
      <div 
        onClick={() => {
          navigate("/profile");
          toast.success("Öppnar din profil...");
        }}
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "1rem",
          cursor: "pointer",
          padding: "0.5rem",
          borderRadius: "16px",
          transition: "all 0.3s ease",
          position: "relative"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = styles.gradients.cardHover;
          e.currentTarget.style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.transform = "scale(1)";
        }}
        title="Klicka för att öppna din profil"
      >
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: styles.gradients.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "white",
          border: `3px solid ${styles.primaryGreen}`,
          boxShadow: styles.shadows.small,
          position: "relative",
          transition: "all 0.3s ease"
        }}>
          {authUser?.profilePicture ? (
            <img 
              src={authUser.profilePicture} 
              alt={authUser.name}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover"
              }}
            />
          ) : (
            authUser?.name?.charAt(0).toUpperCase() || "S"
          )}
          
          {/* Online-indikator */}
          <div style={{
            position: "absolute",
            bottom: "2px",
            right: "2px",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: "#4CAF50",
            border: "2px solid white"
          }} />
        </div>
        
        <div>
          <h2 style={{
            margin: 0,
            fontSize: "1.3rem",
            ...styles.typography.heading,
            color: styles.textPrimary
          }}>
            Hej, {authUser?.name?.split(' ')[0] || "Spelare"}! 👋
          </h2>
          <p style={{
            margin: "0.25rem 0 0 0",
            fontSize: "0.875rem",
            color: styles.textSecondary,
            ...styles.typography.body,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap"
          }}>
            <span style={{ 
              background: styles.gradients.gold,
              color: "white",
              padding: "0.125rem 0.5rem",
              borderRadius: "12px",
              fontSize: "0.75rem",
              fontWeight: "600"
            }}>
              #{authUser?.jerseyNumber || "00"}
            </span>
            <span>{authUser?.favoritePosition || authUser?.position || "Spelare"}</span>
            {authUser?.role === 'leader' && (
              <span style={{ 
                background: styles.primaryGreen,
                color: "white",
                padding: "0.125rem 0.5rem",
                borderRadius: "12px",
                fontSize: "0.75rem",
                fontWeight: "600"
              }}>
                👑 Ledare
              </span>
            )}
            <span style={{ 
              background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              color: styles.textSecondary,
              padding: "0.125rem 0.5rem",
              borderRadius: "12px",
              fontSize: "0.75rem",
              fontWeight: "500"
            }}>
              💚 {authUser?.totalGamificationPoints || 0} poäng
            </span>
          </p>
        </div>
      </div>
    </header>
  );
};
