import React, { useState } from "react";
import styles from "./AddFine.module.css";
import { Fine, FineType } from "../../types/fine";

interface Props {
  onAdd: (fine: Omit<Fine, "id">) => void;
  fineTypes: FineType[];
}

const AddFine: React.FC<Props> = ({ onAdd, fineTypes }) => {
  const [form, setForm] = useState({
    playerId: "",
    type: fineTypes[0] || {
      id: "",
      name: "",
      amount: 0,
      category: "annat",
      isActive: true,
      autoApply: false,
      requiresApproval: false,
      createdBy: "",
      createdAt: "",
    },
    amount: 0,
    reason: "",
    date: "",
    createdBy: "",
    paid: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === "type") {
      const selectedType = fineTypes.find((ft) => ft.id === value);
      setForm((prev) => ({ ...prev, type: selectedType || prev.type, amount: selectedType ? selectedType.amount : prev.amount }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "amount") {
      setForm((prev) => ({ ...prev, amount: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!form.playerId || !form.type.id || !form.amount || !form.reason || !form.date || !form.createdBy) {
        setError("Alla fält måste fyllas i.");
        setLoading(false);
        return;
      }
      const fineToAdd = {
        playerId: form.playerId,
        userId: form.playerId, // alias
        type: form.type,
        date: form.date,
        reason: form.reason,
        amount: form.amount,
        category: form.type.category,
        description: form.reason,
        paid: form.paid,
        isPaid: form.paid,
        createdBy: form.createdBy,
        issuedBy: form.createdBy,
  status: "pending" as Fine["status"],
      };
      onAdd(fineToAdd);
      setForm({
        playerId: "",
        type: fineTypes[0]
          ? fineTypes[0]
          : {
              id: "",
              name: "",
              amount: 0,
              category: "annat",
              isActive: true,
              autoApply: false,
              requiresApproval: false,
              createdBy: "",
              createdAt: "",
            },
        amount: 0,
        reason: "",
        date: "",
        createdBy: "",
        paid: false,
      });
    } catch (err) {
      setError("Något gick fel. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <input
          type="text"
          name="playerId"
          placeholder="Spelar-ID"
          value={form.playerId}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.row}>
        <select
          name="type"
          value={form.type.id}
          onChange={handleChange}
          className={styles.input}
          required
          title="Välj bötestyp"
        >
          <option value="">Välj bötestyp</option>
          {fineTypes.map((ft) => (
            <option key={ft.id} value={ft.id}>
              {ft.name} ({ft.amount} kr)
            </option>
          ))}
        </select>
      </div>
      <div className={styles.row}>
        <input
          type="number"
          name="amount"
          placeholder="Belopp (kr)"
          value={form.amount}
          onChange={handleChange}
          className={styles.input}
          min={1}
          required
        />
      </div>
      <div className={styles.row}>
        <input
          type="text"
          name="reason"
          placeholder="Anledning"
          value={form.reason}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.row}>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className={styles.input}
          required
        title="Datum"
        placeholder="Datum"
        />
      </div>
      <div className={styles.row}>
        <input
          type="text"
          name="createdBy"
          placeholder="Skapad av"
          title="Skapad av"
          value={form.createdBy}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.row}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="paid"
            checked={form.paid}
            onChange={handleChange}
            className={styles.checkbox}
            title="Betald"
          />
          Betald
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={styles.submitButton}
      >
        {loading ? "Lägger till..." : "Lägg till bot"}
      </button>
      {error && <div className={styles.error}>{error}</div>}
    </form>
  );
};
export default AddFine;