import React, { useState } from "react";

export interface TacticsBoard {
  id: string;
  title: string;
  createdBy: string;
  createdAt: string;
}

interface Props {
  isLeader: boolean;
}

const mockBoards: TacticsBoard[] = [
  {
    id: "1",
    title: "Anfall 1:a perioden",
    createdBy: "Tränare Lisa",
    createdAt: "2025-06-05T13:00:00Z",
  },
  {
    id: "2",
    title: "Boxplay",
    createdBy: "Tränare Kalle",
    createdAt: "2025-06-04T18:30:00Z",
  },
];

const TacticsBoardList: React.FC<Props> = ({ isLeader }) => {
  const [boards, setBoards] = useState<TacticsBoard[]>(mockBoards);
  const [selected, setSelected] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    setBoards((list) => [
      {
        id: Math.random().toString(36).slice(2),
        title: newTitle.trim(),
        createdBy: "Du",
        createdAt: new Date().toISOString(),
      },
      ...list,
    ]);
    setNewTitle("");
  };

  const handleDelete = (id: string) => {
    setBoards((list) => list.filter((b) => b.id !== id));
    if (selected === id) setSelected(null);
  };

  return (
    <div style={{ maxWidth: 450, margin: "0 auto", border: "1px solid #bbb", borderRadius: 8, padding: 14, background: "#f8f9fa" }}>
      <h3>Taktiktavlor</h3>
      {isLeader && (
        <div style={{ marginBottom: 12 }}>
          <input
            placeholder="Ny tavlas rubrik"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <button onClick={handleAdd}>Skapa tavla</button>
        </div>
      )}
      <ul>
        {boards.map((b) => (
          <li
            key={b.id}
            style={{
              display: "flex",
              alignItems: "center",
              background: selected === b.id ? "#e0eaff" : undefined,
              borderRadius: 4,
              padding: "6px 0",
              marginBottom: 2,
            }}
          >
            <button
              style={{
                flex: 1,
                textAlign: "left",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: selected === b.id ? "bold" : "normal",
                fontSize: 16,
              }}
              onClick={() => setSelected(b.id)}
            >
              {b.title}
            </button>
            <span style={{ fontSize: 11, color: "#888", marginLeft: 6 }}>
              {new Date(b.createdAt).toLocaleDateString()} ({b.createdBy})
            </span>
            {isLeader && (
              <button
                onClick={() => handleDelete(b.id)}
                style={{
                  marginLeft: 10,
                  color: "#fff",
                  background: "#fa5252",
                  border: "none",
                  borderRadius: 4,
                  padding: "2px 7px",
                  cursor: "pointer",
                }}
                title="Radera tavla"
              >
                🗑
              </button>
            )}
          </li>
        ))}
      </ul>
      {selected && (
        <div style={{ marginTop: 16, background: "#fffbe6", padding: 10, borderRadius: 6 }}>
          <b>Visar tavla:</b> {boards.find((b) => b.id === selected)?.title}
          {/* Här kan du rendera själva taktiktavlan, t.ex. <TacticsBoardCanvas boardId={selected} /> */}
        </div>
      )}
      {!selected && <div style={{ marginTop: 18, color: "#888" }}>Välj en tavla för att visa detaljer.</div>}
      {isLeader && (
        <div style={{ marginTop: 22, color: "#228be6", fontWeight: 500 }}>
          Du har ledarbehörighet och kan skapa/radera tavlor.
        </div>
      )}
    </div>
  );
};

export default TacticsBoardList;