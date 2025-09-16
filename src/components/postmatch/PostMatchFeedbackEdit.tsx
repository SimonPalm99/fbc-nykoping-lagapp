import React, { useState } from "react";
import { PostMatchFeedback } from "../../types/postmatch";

interface Props {
  initial?: Partial<PostMatchFeedback>;
  matchId: string;
  userId: string;
  onSave: (feedback: PostMatchFeedback) => void;
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

const PostMatchFeedbackEdit: React.FC<Props> = ({
  initial,
  matchId,
  userId,
  onSave,
}) => {
  const [form, setForm] = useState<PostMatchFeedback>({
    id: initial?.id ?? Math.random().toString(36).slice(2),
    matchId: initial?.matchId ?? matchId,
    userId: initial?.userId ?? userId,
    rating: initial?.rating ?? 3,
    comment: initial?.comment ?? "",
    createdAt: initial?.createdAt ?? new Date().toISOString(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: PostMatchFeedback) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating < 1 || form.rating > 5) {
      alert("Betyg måste vara mellan 1 och 5");
      return;
    }
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
      <label style={labelStyle}>Spelar-ID</label>
      <input
        name="userId"
        value={form.userId}
        style={inputStyle}
        disabled
      />

      <label style={labelStyle}>Match-ID</label>
      <input
        name="matchId"
        value={form.matchId}
        style={inputStyle}
        disabled
      />

      <label style={labelStyle}>Betyg (1-5)</label>
      <input
        name="rating"
        type="number"
        min={1}
        max={5}
        value={form.rating}
        onChange={handleChange}
        style={inputStyle}
        required
      />

      <label style={labelStyle}>Kommentar</label>
      <textarea
        name="comment"
        value={form.comment}
        onChange={handleChange}
        rows={3}
        style={inputStyle}
        placeholder="Kommentar om matchen eller egen insats"
      />

      <button type="submit" style={buttonStyle}>
        Spara feedback
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

export default PostMatchFeedbackEdit;