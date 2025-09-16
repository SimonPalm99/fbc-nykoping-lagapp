import React, { useState } from "react";
import { PostMatchSummary } from "../../types/postmatch";

interface Props {
  initial?: Partial<PostMatchSummary>;
  matchId: string;
  onSave: (summary: PostMatchSummary) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  margin: "6px 0 12px 0",
  borderRadius: 6,
  border: "1px solid #345",
  background: "#23272e",
  color: "#fff",
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  color: "#b8f27c",
  marginBottom: 2,
  display: "block",
  fontSize: 15,
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  background: "#b8f27c",
  color: "#222",
  border: "none",
  borderRadius: 6,
  padding: "10px",
  fontWeight: 700,
  fontSize: 17,
  marginTop: 10,
  cursor: "pointer",
};

const PostMatchEdit: React.FC<Props> = ({ initial, matchId, onSave }) => {
  const [form, setForm] = useState<PostMatchSummary>({
    id: initial && "id" in initial && initial.id ? initial.id : Math.random().toString(36).slice(2),
    matchId: initial?.matchId ?? matchId,
    summary: initial?.summary ?? "",
    positives: initial?.positives ?? "",
    improvements: initial?.improvements ?? "",
    coachNotes: initial?.coachNotes ?? "",
    createdAt: initial?.createdAt ?? new Date().toISOString(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#23272e",
        borderRadius: 9,
        padding: 18,
        marginTop: 20,
        boxShadow: "0 2px 14px #0002",
        maxWidth: 480,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <label style={labelStyle}>Match-ID</label>
      <input
        name="matchId"
        value={form.matchId}
        onChange={handleChange}
        style={inputStyle}
        required
        disabled={!!initial?.matchId}
      />

      <label style={labelStyle}>Sammanfattning</label>
      <textarea
        name="summary"
        value={form.summary}
        onChange={handleChange}
        rows={2}
        style={inputStyle}
        required
        placeholder="Sammanfatta matchen..."
      />

      <label style={labelStyle}>Vad var positivt?</label>
      <textarea
        name="positives"
        value={form.positives}
        onChange={handleChange}
        rows={2}
        style={inputStyle}
        placeholder="Ex: Bra passningsspel"
      />

      <label style={labelStyle}>Vad kan förbättras?</label>
      <textarea
        name="improvements"
        value={form.improvements}
        onChange={handleChange}
        rows={2}
        style={inputStyle}
        placeholder="Ex: Byten, försvarsspel"
      />

      <label style={labelStyle}>Tränarens kommentar</label>
      <textarea
        name="coachNotes"
        value={form.coachNotes}
        onChange={handleChange}
        rows={2}
        style={inputStyle}
        placeholder="Kommentar från coach"
      />

      <button type="submit" style={buttonStyle}>
        Spara summering
      </button>
      <style>{`
        @media (max-width: 600px) {
          form { padding: 8px !important; }
          input, textarea, select { font-size: 15px !important; }
          button { font-size: 15px !important; }
        }
      `}</style>
    </form>
  );
};

export default PostMatchEdit;