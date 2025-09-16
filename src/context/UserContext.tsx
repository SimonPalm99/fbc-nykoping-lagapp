import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, TrainingLog } from "../types/user";
import { authAPI, healthAPI } from "../services/apiService";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  register: (newUser: any) => Promise<void>;
  updateUser: (u: Partial<User>) => Promise<void>;
  addTrainingLog: (userId: string, log: TrainingLog) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Hämta aktuell användare från backend (t.ex. via token)
  const refreshUser = async () => {
    try {
      // Anta att token finns i localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }
      // Hämta userId från token eller localStorage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setUser(null);
        return;
      }
      // Hämta profil från backend
      const res = await healthAPI.getProfile(userId);
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
    // Hämta alla users från backend
    import('../services/apiService').then(({ usersAPI }) => {
      usersAPI.getAllUsers().then(res => {
        if (res.success) setUsers(res.data);
      });
    });
  }, []);

  // Registrera ny användare
  const register = async (newUser: any) => {
    const res = await authAPI.register(newUser);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
      localStorage.setItem("userId", res.data.user.id);
    }
  };

  // Uppdatera användarprofil
  const updateUser = async (u: Partial<User>) => {
    if (!user?.id) return;
    const res = await healthAPI.updateProfile(user.id, u);
    if (res.success && res.data) {
      setUser(res.data);
    }
  };

  // Lägg till träningslogg (workout)
  const addTrainingLog = async (userId: string, log: TrainingLog) => {
    await healthAPI.addWorkout(userId, log);
    await refreshUser();
  };

  return (
    <UserContext.Provider value={{ user, setUser, users, setUsers, register, updateUser, addTrainingLog, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser måste användas inom UserProvider");
  return ctx;
};