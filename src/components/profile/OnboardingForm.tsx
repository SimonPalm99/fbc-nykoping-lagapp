import React, { useState } from "react";

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
        Skapa profil
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
          value={form.about}
          onChange={handleChange}
          rows={2}
          style={textareaStyle}
          placeholder="Kort beskrivning om dig själv"
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
          marginTop: 8,
          fontWeight: 700,
        }}
      >
        Spara profil
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
          button {
            font-size: 15px;
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

export default OnboardingForm;