import React, { useState } from "react";

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
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "2rem auto" }}>
      <div style={{ marginBottom: 16 }}>
        <label>
          Namn:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            style={{ width: "100%", padding: 6, marginTop: 4 }}
            required
          />
        </label>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>
          Beskrivning:
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={{ width: "100%", padding: 6, marginTop: 4, minHeight: 60 }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>
          Aktiv?
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      <button
        type="submit"
        style={{
          background: "#1976d2",
          color: "#fff",
          border: "none",
          padding: "8px 18px",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Spara
      </button>
    </form>
  );
};

export default ActivityEdit;