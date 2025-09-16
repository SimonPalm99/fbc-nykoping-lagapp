import React, { useState } from "react";
import { Fine, FineType } from "../../types/fine";

interface Props {
  onAdd: (fine: Omit<Fine, "id">) => void;
  fineTypes: FineType[];
}

const AddFine: React.FC<Props> = ({ onAdd, fineTypes }) => {
  const emptyType = fineTypes[0] || {
    id: "default",
    name: "Annan bot",
    amount: 50,
    category: "annat" as const,
    isActive: true,
    autoApply: false,
    requiresApproval: true,
    description: "Standard bot",
    createdBy: "system",
    createdAt: new Date().toISOString()
  };

  const [form, setForm] = useState<Omit<Fine, "id">>({
    playerId: "",
    userId: "",
    amount: emptyType.amount,
    reason: "",
    date: new Date().toISOString().slice(0, 10),
    category: "annat",
    description: "",
    paid: false,
    isPaid: false,
    type: emptyType,
    createdBy: "",
    issuedBy: "",
    status: "pending"
  });

  const [_touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "type") {
      const selectedType = fineTypes.find((t) => t.id === value);
      if (selectedType) {
        setForm((f) => ({
          ...f,
          type: selectedType,
          amount: selectedType.amount,
        }));
      }
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((f) => ({ ...f, [name]: checked }));
    } else if (name === "amount") {
      setForm((f) => ({ ...f, amount: Number(value) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError(null);
    if (
      !form.playerId ||
      !form.type?.id ||
      !form.reason ||
      !form.date ||
      !form.createdBy ||
      form.amount <= 0
    ) {
      setError("Fyll i alla fält!");
      return;
    }
    setLoading(true);
    onAdd(form);
    setForm({
      playerId: "",
      userId: "",
      amount: emptyType.amount,
      reason: "",
      date: new Date().toISOString().slice(0, 10),
      category: "annat",
      description: "",
      paid: false,
      isPaid: false,
      type: emptyType,
      createdBy: "",
      issuedBy: "",
      status: "pending"
    });
    setTouched(false);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={rowStyle}>
        <input
          type="text"
          name="playerId"
          placeholder="Spelar-ID"
          value={form.playerId}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </div>
      <div style={rowStyle}>
        <select
          name="type"
          value={form.type.id}
          onChange={handleChange}
          style={inputStyle}
          required
        >
          <option value="">Välj bötestyp</option>
          {fineTypes.map((ft) => (
            <option key={ft.id} value={ft.id}>
              {ft.name} ({ft.amount} kr)
            </option>
          ))}
        </select>
      </div>
      <div style={rowStyle}>
        <input
          type="number"
          name="amount"
          placeholder="Belopp (kr)"
          value={form.amount}
          onChange={handleChange}
          style={inputStyle}
          min={1}
          required
        />
      </div>
      <div style={rowStyle}>
        <input
          type="text"
          name="reason"
          placeholder="Anledning"
          value={form.reason}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </div>
      <div style={rowStyle}>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </div>
      <div style={rowStyle}>
        <input
          type="text"
          name="createdBy"
          placeholder="Skapad av"
          value={form.createdBy}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 15 }}>
          <input
            type="checkbox"
            name="paid"
            checked={form.paid}
            onChange={handleChange}
            style={{ marginRight: 6 }}
          />
          Betald
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          background: "#b8f27c",
          color: "#181c1e",
          fontWeight: 700,
          border: "none",
          borderRadius: 6,
          padding: "8px 18px",
          cursor: loading ? "wait" : "pointer",
          fontSize: 16,
          marginTop: 4,
          width: "100%",
        }}
      >
        {loading ? "Lägger till..." : "Lägg till bot"}
      </button>
      {error && <div style={{ color: "#e66", marginTop: 7 }}>{error}</div>}
      <style>{`
        @media (max-width: 600px) {
          form { padding: 8px 2vw !important; }
          input, select, button { font-size: 15px !important; }
        }
      `}</style>
    </form>
  );
};

const formStyle: React.CSSProperties = {
  background: "#22272e",
  padding: 14,
  borderRadius: 9,
  marginBottom: 20,
  maxWidth: 470,
  margin: "0 auto",
};

const rowStyle: React.CSSProperties = { marginBottom: 8 };

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 5,
  border: "1px solid #b8f27c",
  padding: "7px 8px",
  fontSize: 15,
  background: "#181c1e",
  color: "#fff",
  outline: "none",
};

export default AddFine;