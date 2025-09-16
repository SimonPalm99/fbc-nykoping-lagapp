import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { LeagueData, LeagueTable, LeagueMatch, LeagueTeam } from "../types/league";
// import { fetchCompleteLeagueData } from "../api/league";

// Mock-data för Division 1 (som exempel)
const mockLeagueTeams: LeagueTeam[] = [
  { id: "1", name: "FBC Nyköping", shortName: "FBC", homeVenue: "Nyköpings Sporthall" },
  { id: "2", name: "IBK Linköping", shortName: "LIN", homeVenue: "Linköping Arena" },
  { id: "3", name: "Ledberg Innebandy", shortName: "LED", homeVenue: "Gnesta Sporthall" },
  { id: "4", name: "Bergs IK", shortName: "BER", homeVenue: "Vasa Arena" },
  { id: "5", name: "Åby Öilers IBK", shortName: "ÅBY", homeVenue: "Åby Arena" },
  { id: "6", name: "Sala IBF", shortName: "SAL", homeVenue: "Sala Sporthall" },
  { id: "7", name: "Västerås IBS", shortName: "VÄS", homeVenue: "Västerås Arena" },
  { id: "8", name: "Uppsala IBK", shortName: "UPP", homeVenue: "Uppsala Hall" }
];

const mockLeagueTable: LeagueTable = {
  id: "div1-2024-25",
  leagueName: "Division 1",
  season: "2024/25",
  division: "Östra",
  lastUpdated: "2024-08-30T15:30:00Z",
  round: 0, // Säsongen har inte börjat än
  entries: [
    {
      position: 1,
      team: mockLeagueTeams[0]!!, // FBC Nyköping
      played: 0, wins: 0, draws: 0, losses: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
      form: [], trend: "same"
    },
    {
      position: 2,
      team: mockLeagueTeams[1]!!, // IBK Linköping
      played: 0, wins: 0, draws: 0, losses: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
      form: [], trend: "same"
    },
    {
      position: 3,
      team: mockLeagueTeams[2]!, // Ledberg Innebandy
      played: 0, wins: 0, draws: 0, losses: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
      form: [], trend: "same"
    },
    {
      position: 4,
      team: mockLeagueTeams[3]!, // Bergs IK
      played: 0, wins: 0, draws: 0, losses: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
      form: [], trend: "same"
    },
    {
      position: 5,
      team: mockLeagueTeams[4]!, // Åby Öilers IBK
      played: 0, wins: 0, draws: 0, losses: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
      form: [], trend: "same"
    },
    {
      position: 6,
      team: mockLeagueTeams[5]!, // Sala IBF
      played: 0, wins: 0, draws: 0, losses: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
      form: [], trend: "same"
    },
    {
      position: 7,
      team: mockLeagueTeams[6]!, // Västerås IBS
      played: 0, wins: 0, draws: 0, losses: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
      form: [], trend: "same"
    },
    {
      position: 8,
      team: mockLeagueTeams[7]!, // Uppsala IBK
      played: 0, wins: 0, draws: 0, losses: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
      form: [], trend: "same"
    }
  ]
};

const initialLeagueData: LeagueData = {
  table: mockLeagueTable,
  fixtures: [
    // FBC Nyköpings kommande matcher baserat på spelschemat Division 1 Östra 2025/26
    {
      id: "fixture-1",
      date: "2024-09-07",
      time: "13:00",
      homeTeam: mockLeagueTeams[0]!, // FBC Nyköping
      awayTeam: mockLeagueTeams[1]!, // IBK Linköping 
      venue: "Nyköpings Sporthall",
      round: 1,
      status: "upcoming"
    },
    {
      id: "fixture-2",
      date: "2024-09-14",
      time: "16:00",
      homeTeam: mockLeagueTeams[2]!, // Ledberg Innebandy
      awayTeam: mockLeagueTeams[0]!, // FBC Nyköping
      venue: "Gnesta Sporthall",
      round: 2,
      status: "upcoming"
    },
    {
      id: "fixture-3",
      date: "2024-09-21",
      time: "13:00",
      homeTeam: mockLeagueTeams[0]!, // FBC Nyköping
      awayTeam: mockLeagueTeams[3]!, // Bergs IK
      venue: "Nyköpings Sporthall",
      round: 3,
      status: "upcoming"
    },
    {
      id: "fixture-4",
      date: "2024-09-28",
      time: "15:00",
      homeTeam: mockLeagueTeams[4]!, // Åby Öilers IBK
      awayTeam: mockLeagueTeams[0]!, // FBC Nyköping
      venue: "Åby Arena",
      round: 4,  
      status: "upcoming"
    },
    {
      id: "fixture-5",
      date: "2024-10-05",
      time: "13:00",
      homeTeam: mockLeagueTeams[0]!, // FBC Nyköping
      awayTeam: mockLeagueTeams[5]!, // Sala IBF
      venue: "Nyköpings Sporthall",
      round: 5,
      status: "upcoming"
    },
    {
      id: "fixture-6",
      date: "2024-10-12",
      time: "18:00",
      homeTeam: mockLeagueTeams[6]!, // Västerås IBS
      awayTeam: mockLeagueTeams[0]!, // FBC Nyköping
      venue: "Västerås Arena",
      round: 6,
      status: "upcoming"
    },
    {
      id: "fixture-7",
      date: "2024-10-19",
      time: "13:00",
      homeTeam: mockLeagueTeams[0]!, // FBC Nyköping
      awayTeam: mockLeagueTeams[7]!, // Uppsala IBK
      venue: "Nyköpings Sporthall",
      round: 7,
      status: "upcoming"
    },
    {
      id: "fixture-8",
      date: "2024-11-02",
      time: "16:00",
      homeTeam: mockLeagueTeams[1]!, // IBK Linköping
      awayTeam: mockLeagueTeams[0]!, // FBC Nyköping
      venue: "Linköping Arena",
      round: 8,
      status: "upcoming"
    },
    {
      id: "fixture-9",
      date: "2024-11-09",
      time: "13:00",
      homeTeam: mockLeagueTeams[0]!, // FBC Nyköping
      awayTeam: mockLeagueTeams[2]!, // Ledberg Innebandy
      venue: "Nyköpings Sporthall",
      round: 9,
      status: "upcoming"
    },
    {
      id: "fixture-10",
      date: "2024-11-16",
      time: "17:00",
      homeTeam: mockLeagueTeams[3]!, // Bergs IK
      awayTeam: mockLeagueTeams[0]!, // FBC Nyköping
      venue: "Vasa Arena", 
      round: 10,
      status: "upcoming"
    },
    {
      id: "fixture-11",
      date: "2024-11-23",
      time: "13:00",
      homeTeam: mockLeagueTeams[0]!, // FBC Nyköping
      awayTeam: mockLeagueTeams[4]!, // Åby Öilers IBK
      venue: "Nyköpings Sporthall",
      round: 11,
      status: "upcoming"
    },
    {
      id: "fixture-12",
      date: "2024-11-30",
      time: "14:00",
      homeTeam: mockLeagueTeams[5]!, // Sala IBF
      awayTeam: mockLeagueTeams[0]!, // FBC Nyköping
      venue: "Sala Sporthall",
      round: 12,
      status: "upcoming"
    },
    {
      id: "fixture-13",
      date: "2024-12-07",
      time: "13:00",
      homeTeam: mockLeagueTeams[0]!, // FBC Nyköping
      awayTeam: mockLeagueTeams[6]!, // Västerås IBS
      venue: "Nyköpings Sporthall",
      round: 13,
      status: "upcoming"
    },
    {
      id: "fixture-14",
      date: "2024-12-14",
      time: "15:00",
      homeTeam: mockLeagueTeams[7]!, // Uppsala IBK
      awayTeam: mockLeagueTeams[0]!, // FBC Nyköping
      venue: "Uppsala Hall",
      round: 14,
      status: "upcoming"
    },
    // Ytterligare matcher mellan andra lag för att komplettera spelschemat
    {
      id: "fixture-15",
      date: "2024-09-08",
      time: "14:00",
      homeTeam: mockLeagueTeams[3]!, // Bergs IK
      awayTeam: mockLeagueTeams[5]!, // Sala IBF
      venue: "Vasa Arena",
      round: 1,
      status: "upcoming"
    },
    {
      id: "fixture-16",
      date: "2024-09-15",
      time: "16:00",
      homeTeam: mockLeagueTeams[4]!, // Åby Öilers IBK
      awayTeam: mockLeagueTeams[6]!, // Västerås IBS
      venue: "Åby Arena",
      round: 2,
      status: "upcoming"
    },
    {
      id: "fixture-17",
      date: "2024-09-22",
      time: "18:00",
      homeTeam: mockLeagueTeams[7]!, // Uppsala IBK
      awayTeam: mockLeagueTeams[1]!, // IBK Linköping
      venue: "Uppsala Hall",
      round: 3,
      status: "upcoming"
    }
  ],
  results: [
    // Tidigare resultät kommer att läggas till här när matcher spelas
    {
      id: "result-1",
      date: "2024-08-31",
      time: "14:00",
      homeTeam: mockLeagueTeams[0]!, // FBC Nyköping
      awayTeam: mockLeagueTeams[5]!, // Sala IBF
      venue: "Nyköpings Sporthall",
      round: 0, // Förberedelsmatch
      status: "finished",
      result: {
        homeGoals: 6,
        awayGoals: 3,
        overtime: false,
        penalties: false
      }
    }
  ],
  stats: {
    topScorers: [
      // Statistiken kommer att uppdateras när säsongen börjar
      { player: "Erik Andersson", team: "FBC Nyköping", goals: 0, assists: 0, points: 0 },
      { player: "Daniel Karlsson", team: "FBC Nyköping", goals: 0, assists: 0, points: 0 },
      { player: "Magnus Svensson", team: "IBK Linköping", goals: 0, assists: 0, points: 0 },
      { player: "Johan Nilsson", team: "Åby Öilers IBK", goals: 0, assists: 0, points: 0 },
      { player: "Peter Johansson", team: "Västerås IBS", goals: 0, assists: 0, points: 0 }
    ],
    topAssists: [
      { player: "Erik Andersson", team: "FBC Nyköping", assists: 0 },
      { player: "Daniel Karlsson", team: "FBC Nyköping", assists: 0 },
      { player: "Magnus Svensson", team: "IBK Linköping", assists: 0 },
      { player: "Peter Johansson", team: "Västerås IBS", assists: 0 },
      { player: "Johan Nilsson", team: "Åby Öilers IBK", assists: 0 }
    ],
    disciplinary: [
      // Utvisningsstatistik kommer att uppdateras under säsongen
    ]
  }
};

interface LeagueContextType {
  leagueData: LeagueData;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshLeagueData: () => Promise<void>;
  getTeamPosition: (teamName: string) => number | null;
  getUpcomingMatches: (teamName: string) => LeagueMatch[];
  clearCache: () => void;
  isOnline: boolean;
}

export const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export const LeagueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leagueData, setLeagueData] = useState<LeagueData>(initialLeagueData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Hämta ligadata från API (med fallback till mock-data)
  // Endast mock-data används nu, ingen live-data
  const fetchLeagueData = async (): Promise<LeagueData> => {
    return initialLeagueData;
  };

  const refreshLeagueData = useCallback(async () => {
    if (!isOnline) {
      setError("Ingen internetanslutning");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLeagueData();
      setLeagueData(data);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Kunde inte hämta ligadata";
      setError(errorMessage);
      console.error("Error fetching league data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isOnline]);

  const clearCache = useCallback(() => {
    // Denna funktion kan användas för att rensa cache
    setLeagueData(initialLeagueData);
    setLastUpdated(null);
    setError(null);
  }, []);

  const getTeamPosition = useCallback((teamName: string): number | null => {
    const entry = leagueData.table.entries.find(
      entry => entry.team.name.toLowerCase().includes(teamName.toLowerCase())
    );
    return entry?.position || null;
  }, [leagueData.table.entries]);

  const getUpcomingMatches = useCallback((teamName: string): LeagueMatch[] => {
    return leagueData.fixtures.filter(
      match => 
        match.homeTeam.name.toLowerCase().includes(teamName.toLowerCase()) ||
        match.awayTeam.name.toLowerCase().includes(teamName.toLowerCase())
    );
  }, [leagueData.fixtures]);

  // Lyssna på nätverksstatus
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Automatiskt uppdatera data var 30:e minut
  useEffect(() => {
    const fetchData = async () => {
      await refreshLeagueData();
    };
    
    fetchData();
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []); // Tom dependency array är OK här eftersom vi vill bara köra vid mount

  return (
    <LeagueContext.Provider value={{
      leagueData,
      isLoading,
      error,
      lastUpdated,
      refreshLeagueData,
      getTeamPosition,
      getUpcomingMatches,
      clearCache,
      isOnline
    }}>
      {children}
    </LeagueContext.Provider>
  );
};

export const useLeague = () => {
  const context = useContext(LeagueContext);
  if (!context) {
    throw new Error("useLeague måste användas inom LeagueProvider");
  }
  return context;
};
