import React, { createContext, useContext, useState, ReactNode } from "react";

// Typ för en motståndaranalys – anpassa gärna!
export interface OpponentAnalysis {
  id: string;
  teamId: string;
  matchId: string;
  date: string;
  opponentName: string;
  summary: string;
  strengths?: string[];
  weaknesses?: string[];
  comment?: string;
}

// Typ för contextens värde
interface OpponentAnalysisContextProps {
  analyses: OpponentAnalysis[];
  addAnalysis: (analysis: OpponentAnalysis) => void;
  updateAnalysis: (analysis: OpponentAnalysis) => void;
}

// Skapa context
const OpponentAnalysisContext = createContext<OpponentAnalysisContextProps | undefined>(undefined);

export const useOpponentAnalyses = () => {
  const ctx = useContext(OpponentAnalysisContext);
  if (!ctx) throw new Error("useOpponentAnalyses måste användas inom OpponentAnalysisProvider");
  return ctx;
};

// Provider-komponenten
export const OpponentAnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [analyses, setAnalyses] = useState<OpponentAnalysis[]>([]);

  const addAnalysis = (analysis: OpponentAnalysis) => {
    setAnalyses(prev => [...prev, analysis]);
  };

  const updateAnalysis = (updated: OpponentAnalysis) => {
    setAnalyses(prev =>
      prev.map(a => (a.id === updated.id ? updated : a))
    );
  };

  return (
    <OpponentAnalysisContext.Provider value={{ analyses, addAnalysis, updateAnalysis }}>
      {children}
    </OpponentAnalysisContext.Provider>
  );
};