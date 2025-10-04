import React, { useState } from "react";
import { PostMatchFeedback } from "../../types/postmatch";
import styles from "./PostMatchFeedback.module.css";

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
      className={styles.formContainer}
    >
      <h2 className={styles.formTitle}>
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
          className={styles.input}
        />
      </label>

      <label>
        Kommentar
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          rows={3}
          className={styles.textarea}
        />
      </label>

      <button
        type="submit"
        className={styles.formButton}
      >
        Skicka feedback
      </button>
    </form>
  );
};


export default PostMatchFeedbackForm;