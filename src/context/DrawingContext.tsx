import { createContext, useContext, useState, ReactNode } from "react";
import { TacticsBoard, DrawingElement } from "../types/drawing";

// Dummydata
const initialBoards: TacticsBoard[] = [
  {
    id: "board1",
    title: "Powerplay 1",
    createdBy: "1",
    createdAt: "2025-06-01T12:00",
    elements: [],
    sharedWith: []
  }
];

interface DrawingContextType {
  boards: TacticsBoard[];
  addBoard: (b: Omit<TacticsBoard, "id" | "createdAt" | "elements">) => void;
  saveElements: (boardId: string, elements: DrawingElement[]) => void;
}

export const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const DrawingProvider = ({ children }: { children: ReactNode }) => {
  const [boards, setBoards] = useState<TacticsBoard[]>(initialBoards);

  const addBoard = (b: Omit<TacticsBoard, "id" | "createdAt" | "elements">) => {
    setBoards(prev => [
      ...prev,
      {
        ...b,
        id: Math.random().toString(36).slice(2),
        createdAt: new Date().toISOString(),
        elements: []
      }
    ]);
  };

  const saveElements = (boardId: string, elements: DrawingElement[]) => {
    setBoards(prev => prev.map(b => b.id === boardId ? { ...b, elements } : b));
  };

  return (
    <DrawingContext.Provider value={{ boards, addBoard, saveElements }}>
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => {
  const ctx = useContext(DrawingContext);
  if (!ctx) throw new Error("useDrawing måste användas inom DrawingProvider");
  return ctx;
};