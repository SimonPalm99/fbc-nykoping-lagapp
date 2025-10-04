import React, { useState, useEffect } from "react";
import { useOpponent } from "../../context/OpponentContext";
import { OpponentAnalysis } from "../../types/opponent";
import styles from "./OpponentAnalysisEdit.module.css";

interface OpponentAnalysisEditProps {
  initial?: OpponentAnalysis;
  isEdit?: boolean;
  onDone?: (a: OpponentAnalysis) => void;
  onCancel?: () => void;
}


const OpponentAnalysisEdit: React.FC<OpponentAnalysisEditProps> = ({
  initial,
  isEdit,
  onDone,
  onCancel
}) => {
  const { teams, addAnalysis } = useOpponent();

  // Om initial finns: förifyll, annars tomma värden
  const [form, setForm] = useState({
    teamId: initial?.teamId || teams[0]?.id || "",
    strengths: initial?.strengths?.join(", ") || "",
    weaknesses: initial?.weaknesses?.join(", ") || "",
    tactics: initial?.tactics || "",
    notes: initial?.notes || "",
    createdBy: initial?.createdBy || "SimonPalm99",
  });

  useEffect(() => {
    if (initial) {
      setForm({
        teamId: initial.teamId,
        strengths: initial.strengths.join(", "),
        weaknesses: initial.weaknesses.join(", "),
        tactics: initial.tactics,
        notes: initial.notes || "",
        createdBy: initial.createdBy,
      });
    }
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Om vi editerar, kör onDone med nytt objekt (med samma id)
    if (isEdit && initial && onDone) {
      onDone({
        ...initial,
        teamId: form.teamId,
        strengths: form.strengths.split(",").map(s => s.trim()).filter(Boolean),
        weaknesses: form.weaknesses.split(",").map(s => s.trim()).filter(Boolean),
        tactics: form.tactics,
        notes: form.notes,
        createdBy: form.createdBy,
      });
    } else {
      // Vid ny analys, skapa via context
      addAnalysis(form.teamId, {
        strengths: form.strengths.split(",").map(s => s.trim()).filter(Boolean),
        weaknesses: form.weaknesses.split(",").map(s => s.trim()).filter(Boolean),
        tactics: form.tactics,
        notes: form.notes,
        createdBy: form.createdBy,
      });
    }
    if (onDone && isEdit) return; // vid edit: lämna till parent att stänga/spara
    setForm({
      teamId: teams[0]?.id || "",
      strengths: "",
      weaknesses: "",
      tactics: "",
      notes: "",
      createdBy: "SimonPalm99",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.opponentAnalysisForm}
    >
  <select
    name="teamId"
    value={form.teamId}
    onChange={handleChange}
    className={styles.input}
    required
    disabled={isEdit}
    title="Välj motståndarlag"
  >
    {teams.map((team) => (
      <option key={team.id} value={team.id}>
        {team.name}
      </option>
    ))}
  </select>

  <label className={styles.label}>
    Styrkor{" "}
  <span className={styles.spanHint}>
      (komma-separerade)
    </span>
  </label>
  <input
    name="strengths"
    value={form.strengths}
    onChange={handleChange}
    className={styles.input}
    placeholder="Snabba omställningar, Bra på tekningar"
  />

  <label className={styles.label}>
    Svagheter{" "}
  <span className={styles.spanHint}>
      (komma-separerade)
    </span>
  </label>
  <input
    name="weaknesses"
    value={form.weaknesses}
    onChange={handleChange}
    className={styles.input}
    placeholder="Långsamma byten, Dålig disciplin"
  />

  <label className={styles.label}>Taktik / Rekommendationer</label>
  <textarea
    name="tactics"
    value={form.tactics}
    onChange={handleChange}
    className={`${styles.input} ${styles.textareaTactics}`}
    placeholder="Ex: Pressa deras backar, spela på djupet"
    required
  />

  <label className={styles.label}>Anteckningar</label>
  <textarea
    name="notes"
    value={form.notes}
    onChange={handleChange}
    className={`${styles.input} ${styles.textareaNotes}`}
    placeholder="Deras #9 är poängfarlig, deras boxplay svagt"
  />

  <button type="submit" className={styles.button}>
    {isEdit ? "Spara ändringar" : "Spara analys"}
  </button>
  {onCancel && isEdit && (
    <button
      type="button"
      className={`${styles.button} ${styles.cancel}`}
      onClick={onCancel}
    >
      Avbryt
    </button>
  )}
    </form>
  );
};

export default OpponentAnalysisEdit;