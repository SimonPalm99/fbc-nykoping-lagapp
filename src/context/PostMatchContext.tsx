import { createContext, useContext, useState, ReactNode } from "react";
import { PostMatchReport } from "../types/postmatch";

const initialReports: PostMatchReport[] = [
  {
    id: "r1",
    matchId: "m1",
    teamId: "1",
    createdBy: "SimonPalm99",
    createdAt: "2025-05-15T20:44:00",
    summary: "Bra insats mot Linköping, stark första period.",
    highlights: ["3 mål i första perioden", "Vändning i tredje", "Avgörande räddning av målvakten"],
    videoClips: [
      { id: "v1", url: "https://youtu.be/dQw4w9WgXcQ", description: "Första målet", time: "04:12" }
    ],
    playerFeedback: [
      { playerId: "7", rating: 5, comment: "Kul match, bra laginsats!" },
      { playerId: "12", rating: 4 }
    ],
    notes: "Behöver bli bättre på byten i andra perioden."
  }
];

interface PostMatchContextType {
  reports: PostMatchReport[];
  addReport: (report: Omit<PostMatchReport, "id" | "createdAt">) => void;
  editReport: (id: string, report: Omit<PostMatchReport, "id" | "createdAt">) => void;
  deleteReport: (id: string) => void;
}

const PostMatchContext = createContext<PostMatchContextType | undefined>(undefined);

export const usePostMatch = () => {
  const ctx = useContext(PostMatchContext);
  if (!ctx) throw new Error("PostMatchContext måste användas inom provider");
  return ctx;
};

export const PostMatchProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<PostMatchReport[]>(initialReports);

  const addReport = (report: Omit<PostMatchReport, "id" | "createdAt">) => {
    setReports(prev => [
      { ...report, id: (Math.random() * 1e9).toFixed(0), createdAt: new Date().toISOString() },
      ...prev
    ]);
  };

  const editReport = (id: string, report: Omit<PostMatchReport, "id" | "createdAt">) => {
    setReports(prev =>
      prev.map(r => r.id === id ? { ...r, ...report } : r)
    );
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  return (
    <PostMatchContext.Provider value={{ reports, addReport, editReport, deleteReport }}>
      {children}
    </PostMatchContext.Provider>
  );
};