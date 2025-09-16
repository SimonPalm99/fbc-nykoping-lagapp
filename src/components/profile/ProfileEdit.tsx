import React, { useState } from "react";
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
      style={{
        background: "#22272e",
        borderRadius: 12,
        maxWidth: 500,
        margin: "16px auto",
        padding: 18,
        color: "#fff",
        fontFamily: "inherit",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <h2 style={{ color: "#b8f27c", fontSize: 20, margin: 0, textAlign: "center" }}>
        Redigera profil
      </h2>
      <label>
        Namn
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </label>
      <label>
        E-post
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
          style={inputStyle}
        />
      </label>
      <label>
        Profilbild-URL
        <input
          name="profileImageUrl"
          value={form.profileImageUrl || ""}
          onChange={handleChange}
          placeholder="https://"
          style={inputStyle}
        />
      </label>
      <label>
        Födelsedag
        <input
          name="birthday"
          value={form.birthday || ""}
          onChange={handleChange}
          type="date"
          style={inputStyle}
        />
      </label>
      <label>
        Tröjnummer
        <input
          name="jerseyNumber"
          value={form.jerseyNumber}
          onChange={handleChange}
          type="number"
          required
          style={inputStyle}
        />
      </label>
      <label>
        Roll
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="player">Spelare</option>
          <option value="leader">Ledare</option>
        </select>
      </label>
      <label>
        Position
        <input
          name="favoritePosition"
          value={form.favoritePosition || ""}
          onChange={handleChange}
          style={inputStyle}
          placeholder="T.ex. Forward"
        />
      </label>
      <label>
        ICE-kontakt Namn
        <input
          name="iceContact.name"
          value={form.iceContacts[0]?.name || ""}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </label>
      <label>
        ICE-kontakt Relation
        <input
          name="iceContact.relation"
          value={form.iceContacts[0]?.relation || ""}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </label>
      <label>
        ICE-kontakt Telefon
        <input
          name="iceContact.phone"
          value={form.iceContacts[0]?.phone || ""}
          onChange={handleChange}
          type="tel"
          required
          style={inputStyle}
        />
      </label>
      <label>
        Om mig
        <textarea
          name="about"
          value={form.about || ""}
          onChange={handleChange}
          rows={2}
          style={textareaStyle}
          placeholder="Kort beskrivning om dig själv"
        />
      </label>

      <label>
        Badges
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {form.badges && form.badges.length > 0 ? (
            form.badges.map((b) => (
              <span
                key={b.id}
                style={{
                  background: "#b8f27c",
                  color: "#181c1e",
                  borderRadius: 5,
                  padding: "2px 7px",
                  fontSize: 13,
                  marginRight: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                {b.name}
                <button
                  type="button"
                  aria-label="Ta bort badge"
                  onClick={() => removeBadge(b.id)}
                  style={{
                    marginLeft: 4,
                    background: "transparent",
                    border: "none",
                    color: "#e66",
                    cursor: "pointer",
                    fontSize: 15,
                  }}
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <i style={{ color: "#bbb" }}>Inga</i>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <input
            type="text"
            value={badgeText}
            onChange={(e) => setBadgeText(e.target.value)}
            placeholder="Lägg till badge"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            type="button"
            onClick={addBadge}
            style={{
              background: "#b8f27c",
              color: "#181c1e",
              border: "none",
              borderRadius: 5,
              padding: "6px 12px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            +
          </button>
        </div>
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
          marginTop: 8,
          fontWeight: 700,
        }}
      >
        Spara ändringar
      </button>
      <style>{`
        @media (max-width: 600px) {
          form {
            padding: 8px;
            border-radius: 0;
            max-width: 99vw;
          }
          h2 {
            font-size: 16px;
          }
          button, input, textarea, select {
            font-size: 15px !important;
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

export default ProfileEdit;