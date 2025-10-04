import React, { useState } from "react";
import styles from "./TrainingLogForm.module.css";
import { TrainingLog } from "../../types/user";

interface Props {
  onAdd: (log: TrainingLog) => void;
}

const TrainingLogForm: React.FC<Props> = ({ onAdd }) => {
  const [date, setDate] = useState<string>("");
  const [feeling, setFeeling] = useState<number>(5); // skala 1-10 t.ex.
  const [note, setNote] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    onAdd({
      id: Math.random().toString(36).slice(2),
      date,
      feeling, // nu number!
      note,
    });
    setNote("");
    setFeeling(5);
    setDate("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles["training-log-form"]}
    >
      <h3 className={styles["training-log-title"]}>Lägg till träningslogg</h3>
      <label className={styles["training-log-label"]}>
        Datum
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          className={styles["training-log-input"]}
        />
      </label>
      <label className={styles["training-log-label"]}>
        Känsla: {feeling}
        <input
          type="range"
          min={1}
          max={10}
          value={feeling}
          onChange={e => setFeeling(Number(e.target.value))}
          className={styles["training-log-range"]}
        />
      </label>
      <label className={styles["training-log-label"]}>
        Anteckning
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Kort anteckning"
          className={styles["training-log-input"]}
        />
      </label>
      <button
        type="submit"
        className={styles["training-log-button"]}
      >
        Spara logg
      </button>
      {/* Responsivitet hanteras i CSS-modulen */}
    </form>
  );
};



export default TrainingLogForm;