import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, TrainingLog } from "../types/user";
import { authAPI, healthAPI } from "../services/apiService";
import { getCurrentUserFromBackend } from "../services/authService";

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

  // Hämta aktuell användare från backend via token
  const refreshUser = async () => {
    try {
      // Hämta token från cookies eller sessionStorage (ingen localStorage)
      const token = document.cookie.match(/(^|;)\s*fbc_access_token=([^;]*)/)?.[2] || sessionStorage.getItem("fbc_access_token");
      console.log('UserContext DEBUG: token', token);
      if (!token) {
        console.log('UserContext DEBUG: ingen token hittades');
        setUser(null);
        return;
      }
      // Hämta user från backend med token
      const res = await getCurrentUserFromBackend(token);
      console.log('UserContext DEBUG: respons från backend', res);
      if (res.success && res.data) {
        const userObj = {
          ...res.data,
          id: res.data._id || res.data.id // alltid mappa till id
        };
        console.log('UserContext DEBUG: user från backend:', userObj);
        setUser(userObj);
      } else {
        console.log('UserContext DEBUG: Ingen user från backend, respons:', res);
        setUser(null);
      }
    } catch (err) {
      console.log('UserContext DEBUG: error', err);
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
    // Hämta alla users från backend
    import('../services/apiService').then(({ usersAPI }) => {
      usersAPI.getAllUsers().then(res => {
        if (res.success) {
          const mappedUsers = res.data.map((u: any) => ({ ...u, id: u._id || u.id }));
          setUsers(mappedUsers);
        }
      });
    });
  }, []);

  // Registrera ny användare
  const register = async (newUser: any) => {
    const res = await authAPI.register(newUser);
    if (res.success && res.data?.user) {
      setUser({
        ...res.data.user,
        id: res.data.user._id || res.data.user.id
      });
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