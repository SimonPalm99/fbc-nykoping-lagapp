import { createContext, useContext, useState, ReactNode } from "react";
import { Fine, FineType } from "../types/fine";

// 1. Definiera exempel på bötestyper
const fineTypes: FineType[] = [
  { 
    id: "a2", 
    name: "Sen ankomst", 
    amount: 30,
    category: "försening",
    isActive: true,
    autoApply: false,
    requiresApproval: true,
    description: "Böter för sen ankomst",
    createdBy: "admin",
    createdAt: "2025-01-01T00:00:00Z"
  },
  { 
    id: "utv", 
    name: "Utvisning", 
    amount: 50,
    category: "uppförande",
    isActive: true,
    autoApply: false,
    requiresApproval: true,
    description: "Böter för utvisning",
    createdBy: "admin",
    createdAt: "2025-01-01T00:00:00Z"
  },
  { 
    id: "1", 
    name: "Sen till träning", 
    amount: 100,
    category: "försening",
    isActive: true,
    autoApply: false,
    requiresApproval: true,
    description: "Böter för sen till träning",
    createdBy: "admin",
    createdAt: "2025-01-01T00:00:00Z"
  },
  { 
    id: "2", 
    name: "Glömt klubba", 
    amount: 50,
    category: "utrustning",
    isActive: true,
    autoApply: false,
    requiresApproval: false,
    description: "Böter för glömd klubba",
    createdBy: "admin",
    createdAt: "2025-01-01T00:00:00Z"
  }
];

// 2. Exempel på böter – garanterat typ-säkra FineType-objekt
const initialFines: Fine[] = [
  {
    id: "f1",
    playerId: "2",
    userId: "2",
    type: fineTypes.find(ft => ft.id === "a2")!, // Sen ankomst
    amount: 30,
    reason: "Kom 10 min sent till träning.",
    date: "2025-06-03T18:30",
    category: "försening",
    description: "Kom 10 min sent till träning.",
    paid: false,
    isPaid: false,
    createdBy: "1",
    issuedBy: "1",
    status: "pending"
  },
  {
    id: "f2",
    playerId: "3",
    userId: "3",
    type: fineTypes.find(ft => ft.id === "utv")!, // Utvisning
    amount: 50,
    reason: "Onödig utvisning under match.",
    date: "2025-06-01T17:00",
    category: "uppförande",
    description: "Onödig utvisning under match.",
    paid: false,
    isPaid: false,
    createdBy: "1",
    issuedBy: "1",
    status: "pending"
  },
  {
    id: "f3",
    playerId: "1",
    userId: "1",
    type: fineTypes.find(ft => ft.id === "1")!, // Sen till träning
    amount: 100,
    reason: "Sen till träning",
    date: "2025-06-07",
    category: "försening",
    description: "Sen till träning",
    paid: false,
    isPaid: false,
    createdBy: "SimonPalm99",
    issuedBy: "SimonPalm99",
    status: "pending"
  },
  {
    id: "f4",
    playerId: "2",
    userId: "2",
    type: fineTypes.find(ft => ft.id === "2")!, // Glömt klubba
    amount: 50,
    reason: "Glömt klubba hemma",
    date: "2025-06-08",
    category: "utrustning",
    description: "Glömt klubba hemma",
    paid: true,
    isPaid: true,
    paidDate: "2025-06-08",
    createdBy: "TränareLisa",
    issuedBy: "TränareLisa",
    status: "paid"
  }
];

// 3. Skapa Context
interface FineContextType {
  fines: Fine[];
  fineTypes: FineType[];
  addFine: (fine: Omit<Fine, "id">) => void;
}

const FineContext = createContext<FineContextType | undefined>(undefined);

export const useFines = () => {
  const ctx = useContext(FineContext);
  if (!ctx) throw new Error("FineContext saknas");
  return ctx;
};

// 4. Provider-komponent
export const FineProvider = ({ children }: { children: ReactNode }) => {
  const [fines, setFines] = useState<Fine[]>(initialFines);

  const addFine = (fine: Omit<Fine, "id">) => {
    const newFine: Fine = { ...fine, id: (Math.random() * 1e9).toFixed(0) };
    setFines(prev => [newFine, ...prev]);
  };

  return (
    <FineContext.Provider value={{ fines, fineTypes, addFine }}>
      {children}
    </FineContext.Provider>
  );
};