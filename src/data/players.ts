export interface Player {
  id: string; // Tröjnummer
  name: string;
  position: "mv" | "back" | "forward";
}

export const players: Player[] = [
  // Målvakter
  { id: "2", name: "Sam Elkin", position: "mv" },
  { id: "93", name: "Jonathan Zettervall", position: "mv" },
  // Backar
  { id: "4", name: "Malte Söderström", position: "back" },
  { id: "13", name: "Lucas Öijvall", position: "back" },
  { id: "20", name: "Vilgot Johnson", position: "back" },
  { id: "25", name: "Viggo Tolf", position: "back" },
  { id: "27", name: "Adam Persson", position: "back" },
  { id: "28", name: "Sebastian Gejskog", position: "back" },
  { id: "55", name: "Linus Björkborg", position: "back" },
  { id: "65", name: "Isak Palm", position: "back" },
  { id: "92", name: "Marcus Groth", position: "back" },
  // Forwards
  { id: "7", name: "Martin Cederin", position: "forward" },
  { id: "10", name: "Leo Johansson", position: "forward" },
  { id: "14", name: "Martin Eklund", position: "forward" },
  { id: "16", name: "Rasmus Widén", position: "forward" },
  { id: "23", name: "Daniel Öberg", position: "forward" },
  { id: "29", name: "Pontus Grindberg", position: "forward" },
  { id: "63", name: "Emanuel Sörberg", position: "forward" },
  { id: "68", name: "Rabi Kahlaji", position: "forward" },
  { id: "71", name: "Viktor Palm", position: "forward" },
  { id: "96", name: "Kevin Hansson", position: "forward" },
  { id: "97", name: "Rikard Westerberg", position: "forward" },
];