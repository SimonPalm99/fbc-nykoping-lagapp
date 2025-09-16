import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '../components/ui/Toast';

export interface LiveUpdate {
  id: string;
  type: 'activity' | 'match' | 'message' | 'notification' | 'user_status';
  data: any;
  timestamp: Date;
  userId?: string;
}

export interface LiveMatchData {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  period: number;
  timeRemaining: string;
  events: MatchEvent[];
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'penalty' | 'timeout' | 'period_end';
  team: 'home' | 'away';
  player?: string;
  time: string;
  description: string;
}

interface LiveContextType {
  isConnected: boolean;
  liveMatch: LiveMatchData | null;
  onlineUsers: string[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  sendMessage: (type: string, data: any) => void;
  subscribeToUpdates: (callback: (update: LiveUpdate) => void) => () => void;
  startLiveMatch: (matchId: string) => void;
  endLiveMatch: () => void;
  updateMatchScore: (homeScore: number, awayScore: number) => void;
  addMatchEvent: (event: Omit<MatchEvent, 'id'>) => void;
}

const LiveContext = createContext<LiveContextType | undefined>(undefined);

export const useLive = () => {
  const context = useContext(LiveContext);
  if (!context) {
    throw new Error('useLive must be used within a LiveProvider');
  }
  return context;
};

interface LiveProviderProps {
  children: ReactNode;
}

export const LiveProvider: React.FC<LiveProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [liveMatch, setLiveMatch] = useState<LiveMatchData | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [_ws, _setWs] = useState<WebSocket | null>(null);
  const [updateCallbacks, setUpdateCallbacks] = useState<((update: LiveUpdate) => void)[]>([]);

  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  // Mock WebSocket för utveckling (skulle använda riktig WebSocket i produktion)
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Simulera WebSocket-anslutning
    setConnectionStatus('connecting');
    
    const mockConnect = () => {
      setTimeout(() => {
        setIsConnected(true);
        setConnectionStatus('connected');
        setOnlineUsers(['Simon Andersson', 'Erik Johansson', 'Marcus Svensson', 'Johan Nilsson']);
        toast.success('Ansluten till live-uppdateringar');
        
        // Simulera periodiska uppdateringar
        const interval = setInterval(() => {
          const updates: LiveUpdate[] = [
            {
              id: `update-${Date.now()}`,
              type: 'activity',
              data: { message: 'Ny träning schemalagd för imorgon' },
              timestamp: new Date()
            },
            {
              id: `update-${Date.now() + 1}`,
              type: 'user_status',
              data: { userId: 'user-2', status: 'online' },
              timestamp: new Date()
            }
          ];
          
          // Skicka random uppdatering
          const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
          if (randomUpdate) {
            updateCallbacks.forEach(callback => callback(randomUpdate));
          }
        }, 30000); // Var 30:e sekund

        return () => clearInterval(interval);
      }, 2000);
    };

    mockConnect();

    return () => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      setOnlineUsers([]);
    };
  }, [isAuthenticated, user]); // Tog bort toast från dependencies

  const sendMessage = (type: string, data: any) => {
    if (!isConnected) {
      toast.error('Inte ansluten till servern');
      return;
    }

    // Mock implementation - skulle skicka via WebSocket
    console.log('Sending message:', { type, data });
    
    // Simulera att meddelandet kommer tillbaka som uppdatering
    const update: LiveUpdate = {
      id: `msg-${Date.now()}`,
      type: type as any,
      data,
      timestamp: new Date(),
      userId: user?.id || ''
    };
    
    setTimeout(() => {
      updateCallbacks.forEach(callback => callback(update));
    }, 100);
  };

  const subscribeToUpdates = (callback: (update: LiveUpdate) => void) => {
    setUpdateCallbacks(prev => [...prev, callback]);
    
    return () => {
      setUpdateCallbacks(prev => prev.filter(cb => cb !== callback));
    };
  };

  const startLiveMatch = (matchId: string) => {
    const newMatch: LiveMatchData = {
      matchId,
      homeTeam: 'FBC Nyköping',
      awayTeam: 'Motståndslag',
      homeScore: 0,
      awayScore: 0,
      period: 1,
      timeRemaining: '20:00',
      events: []
    };
    
    setLiveMatch(newMatch);
    sendMessage('match_start', newMatch);
    toast.success('Live-match startad!');
  };

  const endLiveMatch = () => {
    if (liveMatch) {
      sendMessage('match_end', { matchId: liveMatch.matchId });
      setLiveMatch(null);
      toast.info('Live-match avslutad');
    }
  };

  const updateMatchScore = (homeScore: number, awayScore: number) => {
    if (liveMatch) {
      const updatedMatch = {
        ...liveMatch,
        homeScore,
        awayScore
      };
      setLiveMatch(updatedMatch);
      sendMessage('score_update', { matchId: liveMatch.matchId, homeScore, awayScore });
    }
  };

  const addMatchEvent = (event: Omit<MatchEvent, 'id'>) => {
    if (liveMatch) {
      const newEvent: MatchEvent = {
        ...event,
        id: `event-${Date.now()}`
      };
      
      const updatedMatch = {
        ...liveMatch,
        events: [...liveMatch.events, newEvent]
      };
      
      setLiveMatch(updatedMatch);
      sendMessage('match_event', { matchId: liveMatch.matchId, event: newEvent });
      
      // Uppdatera poäng vid mål
      if (newEvent.type === 'goal') {
        if (newEvent.team === 'home') {
          updateMatchScore(liveMatch.homeScore + 1, liveMatch.awayScore);
        } else {
          updateMatchScore(liveMatch.homeScore, liveMatch.awayScore + 1);
        }
      }
    }
  };

  const value: LiveContextType = {
    isConnected,
    liveMatch,
    onlineUsers,
    connectionStatus,
    sendMessage,
    subscribeToUpdates,
    startLiveMatch,
    endLiveMatch,
    updateMatchScore,
    addMatchEvent
  };

  return (
    <LiveContext.Provider value={value}>
      {children}
    </LiveContext.Provider>
  );
};

export default LiveProvider;
