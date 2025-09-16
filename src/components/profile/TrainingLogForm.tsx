import React, { useState } from "react";
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
      style={{
        background: "#22272e",
        borderRadius: 12,
        maxWidth: 500,
        margin: "16px auto",
        padding: 18,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h3 style={{ color: "#b8f27c", fontSize: 18, margin: 0 }}>Lägg till träningslogg</h3>
      <label>
        Datum
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          style={inputStyle}
        />
      </label>
      <label>
        Känsla: {feeling}
        <input
          type="range"
          min={1}
          max={10}
          value={feeling}
          onChange={e => setFeeling(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </label>
      <label>
        Anteckning
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Kort anteckning"
          style={inputStyle}
        />
      </label>
      <button
        type="submit"
        style={{
          background: "#4a9d2c",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "10px 0",
          fontSize: 16,
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        Spara logg
      </button>
      <style>{`
        @media (max-width: 600px) {
          form {
            padding: 8px;
            border-radius: 0;
            max-width: 99vw;
          }
          h3 {
            font-size: 16px;
          }
          button, input {
            font-size: 15px !important;
          }
        }
      `}</style>
    </form>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  borderRadius: 6,
  border: "1px solid #b8f27c",
  marginTop: 4,
  fontSize: 16,
  background: "#181c1e",
  color: "#fff",
};

export default TrainingLogForm;