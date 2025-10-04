import React, { useState } from "react";
import styles from "./OnboardingForm.module.css";

import type { UserRole, IceContact } from "../../types/user";

interface FormState {
  name: string;
  email: string;
  jerseyNumber: number;
  role: UserRole;
  iceContacts: IceContact[];
  about: string;
}

interface Props {
  onSubmit: (user: FormState) => void;
}

const OnboardingForm: React.FC<Props> = ({ onSubmit }) => {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    jerseyNumber: 0,
  role: "player",
    iceContacts: [{ name: "", phone: "", relation: "", isPrimary: true }],
    about: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("iceContact.")) {
      const key = name.split(".")[1] as keyof IceContact;
      setForm((prev) => ({
        ...prev,
        iceContacts: prev.iceContacts.map((contact, index) => 
          index === 0 ? { ...contact, [key]: value } : contact
        ),
      }));
    } else if (name === "jerseyNumber") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles["onboarding-form"]}
    >
      <h2 className={styles["onboarding-title"]}>
        Skapa profil
      </h2>
      <label className={styles["onboarding-label"]}>
        Namn
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className={styles["onboarding-input"]}
        />
      </label>
      <label className={styles["onboarding-label"]}>
        E-post
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
          className={styles["onboarding-input"]}
        />
      </label>
      <label className={styles["onboarding-label"]}>
        Tröjnummer
        <input
          name="jerseyNumber"
          value={form.jerseyNumber}
          onChange={handleChange}
          type="number"
          required
          className={styles["onboarding-input"]}
        />
      </label>
      <label className={styles["onboarding-label"]}>
        Roll
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className={styles["onboarding-select"]}
        >
          <option value="player">Spelare</option>
          <option value="leader">Ledare</option>
        </select>
      </label>
      <label className={styles["onboarding-label"]}>
        ICE-kontakt Namn
        <input
          name="iceContact.name"
          value={form.iceContacts[0]?.name || ""}
          onChange={handleChange}
          required
          className={styles["onboarding-input"]}
        />
      </label>
      <label className={styles["onboarding-label"]}>
        ICE-kontakt Relation
        <input
          name="iceContact.relation"
          value={form.iceContacts[0]?.relation || ""}
          onChange={handleChange}
          required
          className={styles["onboarding-input"]}
        />
      </label>
      <label className={styles["onboarding-label"]}>
        ICE-kontakt Telefon
        <input
          name="iceContact.phone"
          value={form.iceContacts[0]?.phone || ""}
          onChange={handleChange}
          type="tel"
          required
          className={styles["onboarding-input"]}
        />
      </label>
      <label className={styles["onboarding-label"]}>
        Om mig
        <textarea
          name="about"
          value={form.about}
          onChange={handleChange}
          rows={2}
          className={styles["onboarding-textarea"]}
          placeholder="Kort beskrivning om dig själv"
        />
      </label>
      <button
        type="submit"
        className={styles["onboarding-button"]}
      >
        Spara profil
      </button>
      {/* Responsivitet hanteras i CSS-modulen */}
    </form>
  );
};



export default OnboardingForm;