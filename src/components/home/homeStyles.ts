// Home page styles utility

export const getHomeStyles = (isDark: boolean) => ({
  // FBC Nyköping officiella färger
  primaryGreen: "#2E7D32",
  secondaryGreen: "#388E3C", 
  accentGreen: "#4CAF50",
  lightGreen: isDark ? "#1B5E20" : "#E8F5E9",
  darkGreen: "#1B5E20",
  fbcGold: "#FFB300",
  fbcBlack: "#0D1B0D",
  
  darkBackground: isDark ? "#0A0A0A" : "#FAFAFA",
  cardBackground: isDark ? "rgba(16, 32, 16, 0.95)" : "#FFFFFF",
  borderColor: isDark ? "#2E5829" : "#E1F5FE",
  textPrimary: isDark ? "#F1F8E9" : "#1B5E20",
  textSecondary: isDark ? "#C8E6C9" : "#4A5568",
  
  gradients: {
    primary: "linear-gradient(135deg, #2E7D32 0%, #388E3C 50%, #4CAF50 100%)",
    gold: "linear-gradient(135deg, #FFB300 0%, #FF8F00 100%)",
    body: isDark 
      ? "linear-gradient(135deg, #0A0A0A 0%, #0D1B0D 30%, #1B2E1B 100%)"
      : "linear-gradient(135deg, #FAFAFA 0%, #F1F8E9 30%, #E8F5E9 100%)",
    card: isDark 
      ? "linear-gradient(135deg, rgba(16, 32, 16, 0.95) 0%, rgba(46, 88, 41, 0.3) 100%)" 
      : "linear-gradient(135deg, #FFFFFF 0%, #F8FDF8 100%)",
    cardHover: isDark
      ? "linear-gradient(135deg, rgba(46, 125, 50, 0.2) 0%, rgba(56, 142, 60, 0.2) 100%)"
      : "linear-gradient(135deg, rgba(46, 125, 50, 0.05) 0%, rgba(56, 142, 60, 0.05) 100%)"
  },
  shadows: {
    small: isDark ? "0 2px 12px rgba(0,0,0,0.6)" : "0 2px 12px rgba(46, 125, 50, 0.15)",
    medium: isDark ? "0 6px 24px rgba(0,0,0,0.7)" : "0 6px 24px rgba(46, 125, 50, 0.2)",
    large: isDark ? "0 12px 48px rgba(0,0,0,0.8)" : "0 12px 48px rgba(46, 125, 50, 0.25)"
  },
  typography: {
    heading: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontWeight: "800",
      letterSpacing: "-0.025em"
    },
    body: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontWeight: "400", 
      lineHeight: "1.5"
    }
  }
});
