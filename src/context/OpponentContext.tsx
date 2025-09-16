import { createContext, useContext, useState, ReactNode } from "react";
import { OpponentTeam, OpponentAnalysis } from "../types/opponent";

// Dummydata
const initialTeams: OpponentTeam[] = [
  {
    id: "1",
    name: "IBK Linköping",
    league: "Division 1",
    homeVenue: "Linköping Sporthall",
    coach: "Lars Andersson",
    logoUrl: "/assets/images/linkoping_logo.png",
    colors: {
      primary: "#FF0000",
      secondary: "#FFFFFF"
    },
    players: [],
    teamStats: {
      gamesPlayed: 20,
      wins: 12,
      losses: 6,
      draws: 2,
      goalsFor: 85,
      goalsAgainst: 67,
      powerplayPercentage: 22.5,
      penaltyKillPercentage: 78.3
    },
    playStyle: {
      offense: "aggressive",
      defense: "balanced",
      tempo: "fast",
      physicality: "medium"
    },
    strengths: ["Snabba omställningar", "Bra på tekningar"],
    weaknesses: ["Långsamma byten", "Stressas vid hög press"],
    keyPlayers: ["#9", "#22", "#15"],
    notes: "Snabbt lag, aggressivt försvar.",
    lastUpdated: "2025-01-16",
    updatedBy: "SimonPalm99",
    matches: [
      {
        id: "m1",
        date: "2025-01-15",
        homeTeam: "FBC Nyköping",
        awayTeam: "IBK Linköping",
        score: {
          home: 4,
          away: 5
        },
        venue: "Nyköpings Sporthall",
        keyEvents: ["Bortamål i boxplay", "Vårt ledningsmål i PP"],
        ourPerformance: {
          rating: 7,
          strengths: ["Bra powerplay", "Stark försvarsspel"],
          weaknesses: ["Tappade koncentrationen sista perioden"],
          notes: "Jämn match, tappade i sista perioden."
        },
        opponentPerformance: {
          rating: 8,
          strengths: ["Snabba omställningar", "Effektiva boxplay"],
          weaknesses: ["Nervösa i början"],
          keyPlayers: ["#9 Andersson", "#22 Karlsson"],
          notes: "Stark motståndare med god teknik"
        },
        tactics: {
          ourFormation: "3-2-1",
          theirFormation: "2-2-2",
          ourTactics: ["Hög press", "Snabba omställningar"],
          theirTactics: ["Defensiv boxplay", "Kontringsspel"]
        },
        videoLinks: [],
        homeOrAway: "home"
      }
    ],
    analysis: [
      {
        id: "a1",
        teamId: "1",
        strengths: ["Snabba omställningar", "Bra på tekningar"],
        weaknesses: ["Långsamma byten", "Stressas vid hög press"],
        tactics: "Försök spela på djupet, pressa backar högt.",
        notes: "Deras #9 är poängfarlig.",
        createdBy: "SimonPalm99",
        createdAt: "2025-01-16"
      }
    ]
  },
  {
    id: "2",
    name: "IK Sirius",
    league: "Division 1",
    homeVenue: "Sirius Sporthall",
    coach: "Maria Johansson",
    logoUrl: "/assets/images/sirius_logo.png",
    colors: {
      primary: "#0000FF",
      secondary: "#FFFF00"
    },
    players: [],
    teamStats: {
      gamesPlayed: 20,
      wins: 8,
      losses: 10,
      draws: 2,
      goalsFor: 72,
      goalsAgainst: 81,
      powerplayPercentage: 18.2,
      penaltyKillPercentage: 72.5
    },
    playStyle: {
      offense: "balanced",
      defense: "aggressive",
      tempo: "medium",
      physicality: "high"
    },
    strengths: ["Tungt skott", "Fysiskt lag"],
    weaknesses: ["Dålig disciplin"],
    keyPlayers: ["#7", "#13", "#21"],
    notes: "Fysiskt lag med tungt skott.",
    lastUpdated: "2025-01-16",
    updatedBy: "SimonPalm99",
    matches: [],
    analysis: [
      {
        id: "a2",
        teamId: "2",
        strengths: ["Tungt skott", "Fysiskt lag"],
        weaknesses: ["Dålig disciplin"],
        tactics: "Använd snabba pass, undvik närkamper.",
        createdBy: "SimonPalm99",
        createdAt: "2025-02-04"
      }
    ]
  }
];

// Context och Provider
interface OpponentContextType {
  teams: OpponentTeam[];
  addTeam: (team: Omit<OpponentTeam, "id">) => void;
  addAnalysis: (teamId: string, analysis: Omit<OpponentAnalysis, "id" | "teamId" | "createdAt">) => void;
}

const OpponentContext = createContext<OpponentContextType | undefined>(undefined);

export const useOpponent = () => {
  const ctx = useContext(OpponentContext);
  if (!ctx) throw new Error("Måste använda inom OpponentProvider");
  return ctx;
};

export const OpponentProvider = ({ children }: { children: ReactNode }) => {
  const [teams, setTeams] = useState<OpponentTeam[]>(initialTeams);

  // Lägg till lag
  const addTeam = (team: Omit<OpponentTeam, "id">) => {
    setTeams(prev => [...prev, { ...team, id: (Math.random() * 1e9).toFixed(0) }]);
  };

  // Lägg till analys till rätt lag
  const addAnalysis = (teamId: string, analysis: Omit<OpponentAnalysis, "id" | "teamId" | "createdAt">) => {
    setTeams(prev =>
      prev.map(team =>
        team.id === teamId
          ? {
              ...team,
              analysis: [
                ...(team.analysis || []),
                {
                  ...analysis,
                  id: (Math.random() * 1e9).toFixed(0),
                  teamId,
                  createdAt: new Date().toISOString()
                }
              ]
            }
          : team
      )
    );
  };

  return (
    <OpponentContext.Provider value={{ teams, addTeam, addAnalysis }}>
      {children}
    </OpponentContext.Provider>
  );
};