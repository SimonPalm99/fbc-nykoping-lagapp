import React, { useState } from "react";

import styles from "./ActivityEdit.module.css";

interface ActivityFormState {
  name: string;
  description: string;
  isActive: boolean;
}

const ActivityEdit: React.FC = () => {
  const [form, setForm] = useState<ActivityFormState>({
    name: "",
    description: "",
    isActive: false,
  });

  // Robust & typesäker hanterare för både input, textarea och checkbox
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    // Bara checkbox har checked, så vi måste typecaste
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hantera submit, t.ex. API-anrop här
    alert(JSON.stringify(form, null, 2));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formular}>
      <div className={styles.falt}>
        <label className={styles.etikett} htmlFor="name">Namn:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.falt}>
        <label className={styles.etikett} htmlFor="description">Beskrivning:</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          className={styles.textarea}
        />
      </div>
      <div className={styles.falt}>
        <label className={styles.etikett} htmlFor="isActive">
          Aktiv?
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className={styles.checkbox}
          />
        </label>
      </div>
      <button
        type="submit"
        className={styles.knapp}
      >
        Spara
      </button>
    </form>
  );
};

export default ActivityEdit;