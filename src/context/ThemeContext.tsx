import React, { createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  theme: 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Alltid mörkt tema - ingen växling möjlig
  const isDark = true;
  const theme = 'dark' as const;
  
  const toggleTheme = () => {
    // Ingen funktion - alltid mörkt tema
    console.log('Tema-växling är inaktiverad - endast mörkt tema används');
  };

  const value: ThemeContextType = {
    isDark,
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
