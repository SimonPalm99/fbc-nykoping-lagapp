import React, { useState } from "react";
import styles from "./ProfileEdit.module.css";
import { User, IceContact } from "../../types/user";

interface Props {
  user: User;
  onSave: (updated: User) => void;
}

const ProfileEdit: React.FC<Props> = ({ user, onSave }) => {
  const [form, setForm] = useState<User>({ ...user });

  // Badge-hantering
  const [badgeText, setBadgeText] = useState<string>("");

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

  // Lägg till badge
  const addBadge = () => {
    if (badgeText.trim()) {
      setForm((prev) => ({
        ...prev,
        badges: [
          ...(prev.badges || []),
          {
            id: Math.random().toString(36).slice(2),
            name: badgeText.trim(),
            description: `Badge: ${badgeText.trim()}`,
            dateEarned: new Date().toISOString(),
            category: "special" as const,
            rarity: "common" as const,
            points: 10
          }
        ],
      }));
      setBadgeText("");
    }
  };

  // Ta bort badge
  const removeBadge = (badgeId: string) => {
    setForm((prev) => ({
      ...prev,
      badges: (prev.badges || []).filter((b) => b.id !== badgeId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles["profile-edit-form"]}
    >
      <h2 className={styles["profile-edit-title"]}>
        Redigera profil
      </h2>
      <label className={styles["profile-edit-label"]}>
        Namn
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className={styles["profile-edit-input"]}
        />
      </label>
      <label className={styles["profile-edit-label"]}>
        E-post
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
          className={styles["profile-edit-input"]}
        />
      </label>
      <label className={styles["profile-edit-label"]}>
        Profilbild-URL
        <input
          name="profileImageUrl"
          value={form.profileImageUrl || ""}
          onChange={handleChange}
          placeholder="https://"
          className={styles["profile-edit-input"]}
        />
      </label>
      <label className={styles["profile-edit-label"]}>
        Födelsedag
        <input
          name="birthday"
          value={form.birthday || ""}
          onChange={handleChange}
          type="date"
          className={styles["profile-edit-input"]}
        />
      </label>
      <label className={styles["profile-edit-label"]}>
        Tröjnummer
        <input
          name="jerseyNumber"
          value={form.jerseyNumber}
          onChange={handleChange}
          type="number"
          required
          className={styles["profile-edit-input"]}
        />
      </label>
      <label className={styles["profile-edit-label"]}>
        Roll
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className={styles["profile-edit-select"]}
        >
          <option value="player">Spelare</option>
          <option value="leader">Ledare</option>
        </select>
      </label>
      <label className={styles["profile-edit-label"]}>
        Position
        <input
          name="favoritePosition"
          value={form.favoritePosition || ""}
          onChange={handleChange}
          className={styles["profile-edit-input"]}
          placeholder="T.ex. Forward"
        />
      </label>
      <label className={styles["profile-edit-label"]}>
        ICE-kontakt Namn
        <input
          name="iceContact.name"
          value={form.iceContacts[0]?.name || ""}
          onChange={handleChange}
          required
          className={styles["profile-edit-input"]}
        />
      </label>
      <label className={styles["profile-edit-label"]}>
        ICE-kontakt Relation
        <input
          name="iceContact.relation"
          value={form.iceContacts[0]?.relation || ""}
          onChange={handleChange}
          required
          className={styles["profile-edit-input"]}
        />
      </label>
      <label className={styles["profile-edit-label"]}>
        ICE-kontakt Telefon
        <input
          name="iceContact.phone"
          value={form.iceContacts[0]?.phone || ""}
          onChange={handleChange}
          type="tel"
          required
          className={styles["profile-edit-input"]}
        />
      </label>
      <label className={styles["profile-edit-label"]}>
        Om mig
        <textarea
          name="about"
          value={form.about || ""}
          onChange={handleChange}
          rows={2}
          className={styles["profile-edit-textarea"]}
          placeholder="Kort beskrivning om dig själv"
        />
      </label>

      <label className={styles["profile-edit-label"]}>
        Badges
        <div className={styles["profile-edit-badges-row"]}>
          {form.badges && form.badges.length > 0 ? (
            form.badges.map((b) => (
              <span
                key={b.id}
                className={styles["profile-edit-badge"]}
              >
                {b.name}
                <button
                  type="button"
                  aria-label="Ta bort badge"
                  onClick={() => removeBadge(b.id)}
                  className={styles["profile-edit-badge-remove"]}
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <i className={styles["profile-edit-badge-empty"]}>Inga</i>
          )}
        </div>
        <div className={styles["profile-edit-badge-input-row"]}>
          <input
            type="text"
            value={badgeText}
            onChange={(e) => setBadgeText(e.target.value)}
            placeholder="Lägg till badge"
            className={`${styles["profile-edit-input"]} ${styles["profile-edit-badge-input"]}`}
          />
          <button
            type="button"
            onClick={addBadge}
            className={styles["profile-edit-badge-add"]}
          >
            +
          </button>
        </div>
      </label>

      <button
        type="submit"
        className={styles["profile-edit-button"]}
      >
        Spara ändringar
      </button>
      {/* Responsivitet hanteras i CSS-modulen */}
    </form>
  );
};



export default ProfileEdit;