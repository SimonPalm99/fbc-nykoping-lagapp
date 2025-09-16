import { createContext, useContext, useState, ReactNode } from "react";
import { MatchPlan } from "../types/matchplan";

// Dummydata
const initialPlans: MatchPlan[] = [
  {
    id: "mp1",
    activityId: "a2",
    opponent: "IBK Nyköping",
    createdBy: "1",
    createdAt: "2025-06-06T10:00",
    lineup: [
      { userId: "2", position: "Målvakt", line: 1 },
      { userId: "3", position: "Back", line: 1 },
      { userId: "4", position: "Back", line: 1 },
      { userId: "5", position: "Center", line: 1 },
      { userId: "6", position: "Forward", line: 1 }
    ],
    tactics: [
      { id: "t1", title: "Press högt", description: "Pressa deras backar i uppspelsfas." },
      { id: "t2", title: "Byt ofta", description: "Snabba byten första perioden." }
    ],
    coachNotes: "Stabil insats på träningarna i veckan. Fokusera på kommunikationen!"
  }
];

interface MatchPlanContextType {
  plans: MatchPlan[];
  getPlanByActivity: (activityId: string) => MatchPlan | undefined;
  addPlan: (plan: Omit<MatchPlan, "id" | "createdAt">) => void;
  updatePlan: (plan: MatchPlan) => void;
  removePlan: (planId: string) => void;
}

export const MatchPlanContext = createContext<MatchPlanContextType | undefined>(undefined);

export const MatchPlanProvider = ({ children }: { children: ReactNode }) => {
  const [plans, setPlans] = useState<MatchPlan[]>(initialPlans);

  const getPlanByActivity = (activityId: string) =>
    plans.find(p => p.activityId === activityId);

  const addPlan = (plan: Omit<MatchPlan, "id" | "createdAt">) => {
    setPlans(prev => [
      ...prev,
      { ...plan, id: Math.random().toString(36).slice(2), createdAt: new Date().toISOString() }
    ]);
  };

  const updatePlan = (plan: MatchPlan) => {
    setPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
  };

  const removePlan = (planId: string) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
  };

  return (
    <MatchPlanContext.Provider value={{ plans, getPlanByActivity, addPlan, updatePlan, removePlan }}>
      {children}
    </MatchPlanContext.Provider>
  );
};

export const useMatchPlan = () => {
  const ctx = useContext(MatchPlanContext);
  if (!ctx) throw new Error("useMatchPlan måste användas inom MatchPlanProvider");
  return ctx;
};