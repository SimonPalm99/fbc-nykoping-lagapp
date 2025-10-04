import React, { useState } from "react";
import { PostMatchSummary } from "../../types/postmatch";
import styles from "./PostMatchEdit.module.css";

interface Props {
  initial?: Partial<PostMatchSummary>;
  matchId: string;
  onSave: (summary: PostMatchSummary) => void;
}

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
      className={styles.postMatchForm}
    >
      <label className={styles.label}>Match-ID</label>
      <input
        name="matchId"
        value={form.matchId}
        onChange={handleChange}
        className={styles.input}
        required
        disabled={!!initial?.matchId}
        title="Match-ID"
        placeholder="Ange matchens ID"
      />

      <label className={styles.label}>Sammanfattning</label>
      <textarea
        name="summary"
        value={form.summary}
        onChange={handleChange}
        rows={2}
        className={styles.input}
        required
        placeholder="Sammanfatta matchen..."
      />

      <label className={styles.label}>Vad var positivt?</label>
      <textarea
        name="positives"
        value={form.positives}
        onChange={handleChange}
        rows={2}
        className={styles.input}
        placeholder="Ex: Bra passningsspel"
      />

      <label className={styles.label}>Vad kan förbättras?</label>
      <textarea
        name="improvements"
        value={form.improvements}
        onChange={handleChange}
        rows={2}
        className={styles.input}
        placeholder="Ex: Byten, försvarsspel"
      />

      <label className={styles.label}>Tränarens kommentar</label>
      <textarea
        name="coachNotes"
        value={form.coachNotes}
        onChange={handleChange}
        rows={2}
        className={styles.input}
        placeholder="Kommentar från coach"
      />

      <button type="submit" className={styles.button}>
        Spara summering
      </button>
    </form>
  );
};

export default PostMatchEdit;