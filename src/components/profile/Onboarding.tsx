import React, { useState } from "react";
import styles from "./Onboarding.module.css";
import { useUser } from "../../context/UserContext";
import { UserRole } from "../../types/user";

const roles: UserRole[] = ["player", "leader"];

const Onboarding: React.FC = () => {
  const { register } = useUser();
  const [form, setForm] = useState({
    name: "",
    email: "",
    jerseyNumber: "",
  role: "player" as UserRole,
    favoritePosition: "",
    about: "",
    profileImageUrl: "",
    birthday: "",
    phone: "",
    iceContacts: [{ name: "", phone: "", relation: "", isPrimary: true }]
  });
  const [done, setDone] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleICE = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({
      ...f,
      iceContacts: f.iceContacts.map((contact, index) => 
        index === 0 ? { ...contact, [e.target.name]: e.target.value } : contact
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      ...form,
      jerseyNumber: parseInt(form.jerseyNumber) || 0,
      iceContacts: form.iceContacts,
      injuries: [],
      statistics: {
        gamesPlayed: 0,
        goals: 0,
        assists: 0,
        points: 0,
        shots: 0,
        shotPercentage: 0,
        plusMinus: 0,
        penaltyMinutes: 0,
        blocks: 0,
        steals: 0
      },
      joinDate: new Date().toISOString().split('T')[0] || '',
      lastActive: new Date().toISOString(),
      preferences: {
        notifications: true,
        publicProfile: true,
        showStats: true,
        language: "sv",
        theme: "light",
        shareLocation: false
      },
      fines: {
        total: 0,
        paid: 0,
        outstanding: 0
      },
      milestones: [],
      totalGamificationPoints: 0,
      achievements: {
        mvpVotes: 0,
        playerOfTheWeek: 0,
        consecutiveTrainings: 0,
        bestStreak: 0
      }
    });
    setDone(true);
  };

  if (done) return <div>Registrering skickad! Invändar på ledargodkännande.</div>;

  return (
    <form onSubmit={handleSubmit} className={styles["onboarding-form"]}>
      <h2>Skapa konto</h2>
      <label className={styles["onboarding-label"]}>
        Namn
        <input name="name" value={form.name} onChange={handleChange} required className={styles["onboarding-input"]} />
      </label>
      <label className={styles["onboarding-label"]}>
        E-post
        <input name="email" type="email" value={form.email} onChange={handleChange} required className={styles["onboarding-input"]} />
      </label>
      <label className={styles["onboarding-label"]}>
        Tröjnummer
        <input name="jerseyNumber" type="number" value={form.jerseyNumber} onChange={handleChange} required className={styles["onboarding-input"]} />
      </label>
      <label className={styles["onboarding-label"]}>
        Födelsedag
        <input name="birthday" type="date" value={form.birthday} onChange={handleChange} className={styles["onboarding-input"]} />
      </label>
      <label className={styles["onboarding-label"]}>
        Roll
        <select name="role" value={form.role} onChange={handleChange} className={styles["onboarding-select"]}>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </label>
      <label className={styles["onboarding-label"]}>
        Position (favorit)
        <input name="favoritePosition" value={form.favoritePosition} onChange={handleChange} className={styles["onboarding-input"]} />
      </label>
      <label className={styles["onboarding-label"]}>
        Om mig
        <input name="about" value={form.about} onChange={handleChange} className={styles["onboarding-input"]} />
      </label>
      <label className={styles["onboarding-label"]}>
        Mobilnummer
        <input name="phone" value={form.phone} onChange={handleChange} className={styles["onboarding-input"]} />
      </label>
      <label className={styles["onboarding-label"]}>
        Profilbild (URL)
        <input name="profileImageUrl" value={form.profileImageUrl} onChange={handleChange} className={styles["onboarding-input"]} />
      </label>
      <fieldset className={styles["onboarding-fieldset"]}>
        <legend className={styles["onboarding-legend"]}>Nödkontakt (ICE)</legend>
        <label className={styles["onboarding-label"]}>
          Namn
          <input name="name" value={form.iceContacts[0]?.name || ""} onChange={handleICE} className={styles["onboarding-input"]} />
        </label>
        <label className={styles["onboarding-label"]}>
          Relation
          <input name="relation" value={form.iceContacts[0]?.relation || ""} onChange={handleICE} className={styles["onboarding-input"]} />
        </label>
        <label className={styles["onboarding-label"]}>
          Telefon
          <input name="phone" value={form.iceContacts[0]?.phone || ""} onChange={handleICE} className={styles["onboarding-input"]} />
        </label>
      </fieldset>
      <button type="submit" className={styles["onboarding-button"]}>Registrera</button>
    </form>
  );
};

export default Onboarding;