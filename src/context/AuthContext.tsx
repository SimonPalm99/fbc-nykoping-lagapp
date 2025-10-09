import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { User, UserRegistration, AuthState } from '../types/auth';
import { useToast } from '../components/ui/Toast';
type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: UserRegistration) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  uploadProfilePicture: (file: File) => Promise<string | null>;
  approveUser: (userId: string) => Promise<boolean>;
  getPendingUsers: () => User[];
  isLeader: () => boolean;
  isAdmin: () => boolean;
  canApproveUsers: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  const toast = useToast();

  // Ta bort mock/demo-användare. Använd tom array eller hämta från backend i produktion.
  const [users, setUsers] = useState<User[]>([]);

  // Vid mount: hämta aktuell användare från backend med token/cookie och försök förnya sessionen om nödvändigt
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Försök hämta accessToken från localStorage
        const token = authService.getAccessToken();
        let user = null;
        if (token) {
          // Hämta användare med token
          const res = await authService.getCurrentUserFromBackend(token);
          if (res && res.success && res.data) {
            user = { ...res.data, id: res.data._id || res.data.id };
            setAuthState({ user, isAuthenticated: true, isLoading: false, error: null });
            return;
          } else if (res.error && res.error.toLowerCase().includes('expired')) {
            // Token expired, försök förnya
            try {
              const newToken = await authService.refreshAccessToken();
              const refreshedRes = await authService.getCurrentUserFromBackend(newToken);
              if (refreshedRes && refreshedRes.success && refreshedRes.data) {
                user = { ...refreshedRes.data, id: refreshedRes.data._id || refreshedRes.data.id };
                setAuthState({ user, isAuthenticated: true, isLoading: false, error: null });
                return;
              }
            } catch (refreshErr) {
              // Misslyckades att förnya, logga ut
              authService.logout();
              setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
              return;
            }
          }
        }
        // Om ingen token eller misslyckad hämtning, logga ut
        setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
      } catch {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
      }
    };
    fetchUser();
    // Sätt upp automatisk token-refresh
    authService.setupTokenRefresh();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login(credentials);
      const user = {
        ...response.user,
        id: response.user.id
      };
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      toast.success(`Välkommen tillbaka, ${user.name}!`);
      return true;
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false, error: error.message || 'Något gick fel vid inloggning' }));
      toast.error(error.message || 'Något gick fel vid inloggning');
      return false;
    }
  };

  const register = async (userData: UserRegistration): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulera API-anrop
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Kontrollera om email redan finns
      if (users.find(u => u.email === userData.email)) {
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Email-adressen används redan' 
        }));
        toast.error('Email-adressen används redan');
        return false;
      }

      // Kontrollera om tröjnummer redan används
      if (userData.jerseyNumber && users.find(u => u.jerseyNumber === userData.jerseyNumber && u.status !== 'suspended')) {
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Tröjnumret används redan' 
        }));
        toast.error('Tröjnumret används redan');
        return false;
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email,
        name: userData.name,
        phone: userData.phone || '',
        jerseyNumber: userData.jerseyNumber || 0,
        position: userData.position || '',
        favoritePosition: userData.favoritePosition || '',
        aboutMe: userData.aboutMe || '',
        previousClubs: userData.previousClubs ? 
          userData.previousClubs.map((club: any) => 
            typeof club === 'string' ? 
            { name: club, startYear: new Date().getFullYear() - 1 } : 
            club
          ) : [],
        emergencyContact: userData.emergencyContact || { name: '', phone: '', relation: '' },
        role: 'player',
        status: 'pending', // Kräver ledargodkännande
        createdAt: new Date().toISOString(),
        statistics: {
          gamesPlayed: 0,
          goals: 0,
          assists: 0,
          points: 0,
          shots: 0,
          shotPercentage: 0,
          plusMinus: 0,
          penaltyMinutes: 0,
          blocks: 0,
          steals: 0
        },
        totalGamificationPoints: 100, // Startbonus för nya spelare
        badges: [],
        stats: {
          totalTrainings: 0,
          totalMatches: 0,
          totalGoals: 0,
          totalAssists: 0
        },
        notifications: {
          activities: true,
          forum: true,
          statistics: true,
          fines: true
        },
        personalTrainingLog: []
      };

      setUsers(prev => [...prev, newUser]);
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });

      toast.success('Registrering genomförd! Väntar på godkännande från ledare.');
      return true;

    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Något gick fel vid registrering' 
      }));
      toast.error('Något gick fel vid registrering');
      return false;
    }
  };

  const logout = () => {
  // Ingen localStorage, logga ut via backend/token
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    toast.info('Du har loggats ut');
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const updatedUser = { ...authState.user, ...updates };
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));

      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      toast.success('Profilen uppdaterad!');
      return true;
    } catch {
      toast.error('Kunde inte uppdatera profilen');
      return false;
    }
  };

  const uploadProfilePicture = async (_file: File): Promise<string | null> => {
    try {
      // Simulera filuppladdning
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // I verkligheten skulle detta ladda upp till en server
      const mockUrl = `https://example.com/profiles/${authState.user?.id}_${Date.now()}.jpg`;
      
      await updateProfile({ profilePicture: mockUrl });
      return mockUrl;
    } catch {
      toast.error('Kunde inte ladda upp profilbild');
      return null;
    }
  };

  const approveUser = async (userId: string): Promise<boolean> => {
    if (!canApproveUsers()) return false;

    try {
      const userToApprove = users.find(u => u.id === userId);
      if (!userToApprove) return false;

      const updatedUser = {
        ...userToApprove,
        status: 'approved' as const,
        approvedAt: new Date().toISOString(),
        approvedBy: authState.user?.id || ''
      };

      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      toast.success(`${updatedUser.name} har godkänts!`);
      return true;
    } catch {
      toast.error('Kunde inte godkänna användaren');
      return false;
    }
  };

  const getPendingUsers = (): User[] => {
    return users.filter(u => u.status === 'pending');
  };

  const isLeader = (): boolean => {
    return authState.user?.role === 'leader' || authState.user?.role === 'admin';
  };

  const isAdmin = (): boolean => {
    return authState.user?.role === 'admin';
  };

  const canApproveUsers = (): boolean => {
    return isLeader();
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    uploadProfilePicture,
    approveUser,
    getPendingUsers,
    isLeader,
    isAdmin,
    canApproveUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};