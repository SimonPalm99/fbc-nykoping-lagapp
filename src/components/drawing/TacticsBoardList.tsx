import React, { useState } from "react";
import styles from "./TacticsBoardList.module.css";

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
    <div className={styles.tacticsBoardList}>
      <h3>Taktiktavlor</h3>
      {isLeader && (
        <div className={styles.tacticsBoardList__header}>
          <input
            placeholder="Ny tavlas rubrik"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className={styles.tacticsBoardList__input}
          />
          <button onClick={handleAdd}>Skapa tavla</button>
        </div>
      )}
      <ul className={styles.tacticsBoardList__list}>
        {boards.map((b) => (
          <li
            key={b.id}
            className={selected === b.id
              ? `${styles["tacticsBoardList__item"]} ${styles["tacticsBoardList__item--selected"]}`
              : styles["tacticsBoardList__item"]}
          >
            <button
              className={selected === b.id
                ? `${styles["tacticsBoardList__titleBtn"]} ${styles["tacticsBoardList__titleBtn--selected"]}`
                : styles["tacticsBoardList__titleBtn"]}
              onClick={() => setSelected(b.id)}
            >
              {b.title}
            </button>
            <span className={styles.tacticsBoardList__meta}>
              {new Date(b.createdAt).toLocaleDateString()} ({b.createdBy})
            </span>
            {isLeader && (
              <button
                onClick={() => handleDelete(b.id)}
                className={styles.tacticsBoardList__deleteBtn}
                title="Radera tavla"
              >
                🗑
              </button>
            )}
          </li>
        ))}
      </ul>
      {selected && (
        <div className={styles.tacticsBoardList__details}>
          <b>Visar tavla:</b> {boards.find((b) => b.id === selected)?.title}
          {/* Här kan du rendera själva taktiktavlan, t.ex. <TacticsBoardCanvas boardId={selected} /> */}
        </div>
      )}
      {!selected && <div className={styles.tacticsBoardList__empty}>Välj en tavla för att visa detaljer.</div>}
      {isLeader && (
        <div className={styles.tacticsBoardList__leaderInfo}>
          Du har ledarbehörighet och kan skapa/radera tavlor.
        </div>
      )}
    </div>
  );
};

export default TacticsBoardList;