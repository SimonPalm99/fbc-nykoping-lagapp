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

  // Mock databas för användare (skulle vara riktig databas i produktion)
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user-1',
      email: 'simon@fbcnykoping.se',
      name: 'Simon Andersson',
      jerseyNumber: 17,
      position: 'Center',
      role: 'leader',
      status: 'approved',
      createdAt: '2024-01-15',
      approvedAt: '2024-01-15',
      favoritePosition: 'Center',
      aboutMe: 'Lagkapten och centerforward med passion för spelet',
      phone: '0701234567',
      statistics: {
        gamesPlayed: 18,
        goals: 15,
        assists: 12,
        points: 27,
        shots: 85,
        shotPercentage: 17.6,
        plusMinus: 8,
        penaltyMinutes: 6,
        blocks: 4,
        steals: 12
      },
      totalGamificationPoints: 485,
      emergencyContact: {
        name: 'Anna Andersson',
        phone: '0709876543',
        relation: 'Maka'
      },
      badges: [
        {
          id: 'badge-1',
          name: '100 Träningar',
          description: 'Genomfört 100 träningar',
          icon: '🏃‍♂️',
          color: '#22c55e',
          earnedDate: '2024-03-15',
          type: 'training'
        }
      ],
      stats: {
        totalTrainings: 125,
        totalMatches: 45,
        totalGoals: 32,
        totalAssists: 28
      },
      notifications: {
        activities: true,
        forum: true,
        statistics: true,
        fines: false
      },
      personalTrainingLog: []
    },
    {
      id: 'user-2',
      email: 'erik@fbcnykoping.se',
      name: 'Erik Karlsson',
      jerseyNumber: 23,
      position: 'Back',
      role: 'player',
      status: 'approved',
      createdAt: '2024-02-01',
      approvedAt: '2024-02-02',
      approvedBy: 'user-1',
      favoritePosition: 'Vänsterback',
      aboutMe: 'Snabb back som älskar att anfalla',
      statistics: {
        gamesPlayed: 16,
        goals: 3,
        assists: 8,
        points: 11,
        shots: 42,
        shotPercentage: 7.1,
        plusMinus: 5,
        penaltyMinutes: 12,
        blocks: 18,
        steals: 25
      },
      totalGamificationPoints: 320,
      badges: [],
      stats: {
        totalTrainings: 89,
        totalMatches: 38,
        totalGoals: 12,
        totalAssists: 45
      },
      notifications: {
        activities: true,
        forum: true,
        statistics: true,
        fines: true
      },
      personalTrainingLog: []
    },
    {
      id: 'user-3',
      email: 'anna@example.com',
      name: 'Anna Johansson',
      jerseyNumber: 9,
      position: 'Forward',
      role: 'player',
      status: 'pending',
      createdAt: '2024-06-25',
      aboutMe: 'Ny spelare som kommer från AIK',
      previousClubs: [
        {
          name: 'AIK Innebandy',
          startYear: 2018,
          endYear: 2021,
          division: 'Division 2',
          achievements: ['Vann serien 2020']
        }
      ],
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
      totalGamificationPoints: 50,
      notifications: {
        activities: true,
        forum: true,
        statistics: true,
        fines: true
      },
      personalTrainingLog: []
    },
    // Demo-användare för testning
    {
      id: 'demo-player',
      email: 'erik@demo.se',
      name: 'Simon Palm', // Ändrat namn
      jerseyNumber: 99,
      position: 'Forward',
      role: 'player',
      status: 'approved',
      createdAt: '2024-01-01',
      approvedAt: '2024-01-01',
      favoritePosition: 'Forward',
      aboutMe: 'Demo-konto för att testa spelarfunktioner',
      phone: '070-123-4567',
      statistics: {
        gamesPlayed: 10,
        goals: 8,
        assists: 5,
        points: 13,
        shots: 45,
        shotPercentage: 17.8,
        plusMinus: 6,
        penaltyMinutes: 2,
        blocks: 3,
        steals: 8
      },
      totalGamificationPoints: 250,
      emergencyContact: {
        name: 'Demo Kontakt',
        phone: '070-987-6543',
        relation: 'Förälder'
      },
      badges: [],
      stats: {
        totalTrainings: 50,
        totalMatches: 25,
        totalGoals: 15,
        totalAssists: 20
      },
      notifications: {
        activities: true,
        forum: true,
        statistics: true,
        fines: true
      },
      personalTrainingLog: []
    },
    {
      id: 'demo-leader',
      email: 'sara@demo.se',
      name: 'Simon Palm', // Ändrat namn
      jerseyNumber: 1,
      position: 'Målvakt',
      role: 'leader',
      status: 'approved',
      createdAt: '2024-01-01',
      approvedAt: '2024-01-01',
      favoritePosition: 'Målvakt',
      aboutMe: 'Demo-konto för att testa ledarfunktioner',
      phone: '070-555-1234',
      statistics: {
        gamesPlayed: 20,
        goals: 2,
        assists: 15,
        points: 17,
        shots: 25,
        shotPercentage: 8.0,
        plusMinus: 12,
        penaltyMinutes: 0,
        blocks: 45,
        steals: 30
      },
      totalGamificationPoints: 500,
      emergencyContact: {
        name: 'Demo Partner',
        phone: '070-555-9876',
        relation: 'Make'
      },
      badges: [
        {
          id: 'badge-leader',
          name: 'Lagledare',
          description: 'Erfaren lagledare',
          icon: '👨‍💼',
          color: '#FF9800',
          earnedDate: '2024-01-01',
          type: 'special'
        }
      ],
      stats: {
        totalTrainings: 100,
        totalMatches: 60,
        totalGoals: 5,
        totalAssists: 40
      },
      notifications: {
        activities: true,
        forum: true,
        statistics: true,
        fines: false
      },
      personalTrainingLog: []
    },
    {
      id: 'demo-admin',
      email: 'admin@demo.se',
      name: 'Demo Admin',
      jerseyNumber: 0,
      position: 'Admin',
      role: 'admin',
      status: 'approved',
      createdAt: '2024-01-01',
      approvedAt: '2024-01-01',
      favoritePosition: 'Admin',
      aboutMe: 'Demo-konto för att testa admin-funktioner',
      phone: '070-000-0000',
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
      totalGamificationPoints: 1000,
      emergencyContact: {
        name: 'Demo Admin Kontakt',
        phone: '070-000-0001',
        relation: 'Partner'
      },
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
    },
    {
      id: 'demo-pending',
      email: 'pending@fbcnykoping.se',
      name: 'Demo Väntande',
      jerseyNumber: 88,
      position: 'Center',
      role: 'player',
      status: 'pending',
      createdAt: '2024-06-29',
      favoritePosition: 'Center',
      aboutMe: 'Demo-konto för att testa väntande medlemsfunktioner',
      phone: '070-888-9999',
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
      totalGamificationPoints: 25,
      emergencyContact: {
        name: 'Demo Anhörig',
        phone: '070-888-0000',
        relation: 'Syskon'
      },
      badges: [],
      stats: {
        totalTrainings: 0,
        totalMatches: 0,
        totalGoals: 0,
        totalAssists: 0
      },
      notifications: {
        activities: true,
        forum: false,
        statistics: false,
        fines: false
      },
      personalTrainingLog: []
    }
  ]);

  // Simulera inloggning med localStorage
  useEffect(() => {
    const checkAuthStatus = () => {
      // För mockad demo-login: hämta användare från localStorage om backend inte är tillgänglig
      const localUser = localStorage.getItem('fbc_user');
      if (localUser) {
        try {
          const user = JSON.parse(localUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch {
          localStorage.removeItem('fbc_user');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      } else if (authService.isAuthenticated()) {
        setAuthState({
          user: authService.getCurrentUser(),
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        authService.setupTokenRefresh();
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login(credentials);
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      if (credentials.rememberMe) {
        localStorage.setItem('fbc_rememberMe', 'true');
      } else {
        localStorage.removeItem('fbc_rememberMe');
      }
      authService.setupTokenRefresh();
      toast.success(`Välkommen tillbaka, ${response.user.name}!`);
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
    localStorage.removeItem('fbc_user');
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
      localStorage.setItem('fbc_user', JSON.stringify(updatedUser));
      
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