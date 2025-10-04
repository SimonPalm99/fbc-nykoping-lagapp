import React, { useState } from "react";
import { PostMatchFeedback } from "../../types/postmatch";
import styles from "./PostMatchFeedbackEdit.module.css";

interface Props {
  initial?: Partial<PostMatchFeedback>;
  matchId: string;
  userId: string;
  onSave: (feedback: PostMatchFeedback) => void;
}

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
      className={styles.postMatchFeedbackForm}
    >
      <label className={styles.label}>Spelar-ID</label>
      <input
        name="userId"
        value={form.userId}
        className={styles.input}
        disabled
        title="Spelar-ID"
        placeholder="Ange spelarens ID"
      />

      <label className={styles.label}>Match-ID</label>
      <input
        name="matchId"
        value={form.matchId}
        className={styles.input}
        disabled
        title="Match-ID"
        placeholder="Ange matchens ID"
      />

      <label className={styles.label}>Betyg (1-5)</label>
      <input
        name="rating"
        type="number"
        min={1}
        max={5}
        value={form.rating}
        onChange={handleChange}
        className={styles.input}
        required
        title="Betyg"
        placeholder="Ange betyg mellan 1 och 5"
      />

      <label className={styles.label}>Kommentar</label>
      <textarea
        name="comment"
        value={form.comment}
        onChange={handleChange}
        rows={3}
        className={styles.input}
        placeholder="Kommentar om matchen eller egen insats"
      />

      <button type="submit" className={styles.button}>
        Spara feedback
      </button>
    </form>
  );
};

export default PostMatchFeedbackEdit;