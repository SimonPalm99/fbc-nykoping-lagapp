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

  // Sätt CSS-variabler för dynamiska färger
  const cssVars = `
    .${styles.homeHeader} {
      --card-background: ${styles.cardBackground};
      --primary-green: ${styles.primaryGreen};
      --shadow-medium: ${styles.shadows.medium};
      --gradient-primary: ${styles.gradients.primary};
      --gradient-card-hover: ${styles.gradients.cardHover};
      --gradient-gold: ${styles.gradients.gold};
      --shadow-small: ${styles.shadows.small};
      --text-primary: ${styles.textPrimary};
      --text-secondary: ${styles.textSecondary};
    }
  `;
  return (
    <>
      <style>{cssVars}</style>
      <header className={styles.homeHeader}>
      {/* Bakgrundsdekor */}
      <div className={styles.homeHeaderBackground} />
      
      {/* Profil sektion */}
      <div 
        className={styles.homeHeaderProfile}
        onClick={() => {
          navigate("/profile");
          toast.success("Öppnar din profil...");
        }}
        title="Klicka för att öppna din profil"
      >
        <div className={styles.homeHeaderAvatar}>
          {authUser?.profilePicture ? (
            <img 
              src={authUser.profilePicture} 
              alt={authUser.name}
              className={styles.homeHeaderAvatarImg}
            />
          ) : (
            authUser?.name?.charAt(0).toUpperCase() || "S"
          )}
          {/* Online-indikator */}
          <div className={styles.homeHeaderOnline} />
        </div>
        
        <div>
          <h2 className={styles.homeHeaderName}>
            Hej, {authUser?.name?.split(' ')[0] || "Spelare"}! 👋
          </h2>
          <p className={styles.homeHeaderInfo}>
            <span className={styles.homeHeaderBadge}>
              #{authUser?.jerseyNumber || "00"}
            </span>
            <span>{authUser?.favoritePosition || authUser?.position || "Spelare"}</span>
            {authUser?.role === 'leader' && (
              <span className={styles.homeHeaderRole}>
                👑 Ledare
              </span>
            )}
            <span className={`${styles.homeHeaderPoints} ${isDark ? styles.homeHeaderPointsDark : ''}`}>
              💚 {authUser?.totalGamificationPoints || 0} poäng
            </span>
          </p>
        </div>
      </div>
    </header>
    </>
  );
};
