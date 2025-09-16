import React, { useState } from "react";
import { PostMatchFeedback } from "../../types/postmatch";

interface Props {
  matchId: string;
  userId: string;
  onSave: (feedback: PostMatchFeedback) => void;
}

const PostMatchFeedbackForm: React.FC<Props> = ({ matchId, userId, onSave }) => {
  const [form, setForm] = useState<PostMatchFeedback>({
    id: Math.random().toString(36).slice(2),
    matchId,
    userId,
    rating: 3,
    comment: "",
    createdAt: new Date().toISOString(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#22272e",
        padding: 16,
        borderRadius: 12,
        maxWidth: 450,
        margin: "16px auto",
        color: "#fff",
        fontFamily: "inherit",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 20, color: "#b8f27c", textAlign: "center" }}>
        Ge feedback på matchen
      </h2>

      <label>
        Betyg (1-5)
        <input
          type="number"
          name="rating"
          min={1}
          max={5}
          value={form.rating}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </label>

      <label>
        Kommentar
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          rows={3}
          style={textareaStyle}
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
          fontSize: 18,
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        Skicka feedback
      </button>
      <style>{`
        @media (max-width: 600px) {
          form {
            padding: 8px;
            border-radius: 0;
            max-width: 98vw;
          }
          h2 {
            font-size: 17px;
          }
          button {
            font-size: 16px;
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

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
};

export default PostMatchFeedbackForm;