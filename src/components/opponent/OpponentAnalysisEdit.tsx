import React, { useState, useEffect } from "react";
import { useOpponent } from "../../context/OpponentContext";
import { OpponentAnalysis } from "../../types/opponent";

interface OpponentAnalysisEditProps {
  initial?: OpponentAnalysis;
  isEdit?: boolean;
  onDone?: (a: OpponentAnalysis) => void;
  onCancel?: () => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  margin: "6px 0 12px 0",
  borderRadius: 6,
  border: "1px solid #345",
  background: "#23272e",
  color: "#fff",
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  color: "#b8f27c",
  marginBottom: 2,
  display: "block",
  fontSize: 15,
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  background: "#b8f27c",
  color: "#222",
  border: "none",
  borderRadius: 6,
  padding: "10px",
  fontWeight: 700,
  fontSize: 17,
  marginTop: 10,
  cursor: "pointer",
};

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
      style={{
        background: "#23272e",
        borderRadius: 9,
        padding: 18,
        marginTop: 20,
        boxShadow: "0 2px 14px #0002",
        maxWidth: 480,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <label style={labelStyle}>Motståndarlag</label>
      <select
        name="teamId"
        value={form.teamId}
        onChange={handleChange}
        style={inputStyle}
        required
        disabled={isEdit} // Kan ej byta lag vid edit
      >
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>

      <label style={labelStyle}>
        Styrkor{" "}
        <span style={{ fontWeight: 400, color: "#bbb", fontSize: 13 }}>
          (komma-separerade)
        </span>
      </label>
      <input
        name="strengths"
        value={form.strengths}
        onChange={handleChange}
        style={inputStyle}
        placeholder="Snabba omställningar, Bra på tekningar"
      />

      <label style={labelStyle}>
        Svagheter{" "}
        <span style={{ fontWeight: 400, color: "#bbb", fontSize: 13 }}>
          (komma-separerade)
        </span>
      </label>
      <input
        name="weaknesses"
        value={form.weaknesses}
        onChange={handleChange}
        style={inputStyle}
        placeholder="Långsamma byten, Dålig disciplin"
      />

      <label style={labelStyle}>Taktik / Rekommendationer</label>
      <textarea
        name="tactics"
        value={form.tactics}
        onChange={handleChange}
        style={{ ...inputStyle, minHeight: 50, resize: "vertical" }}
        placeholder="Ex: Pressa deras backar, spela på djupet"
        required
      />

      <label style={labelStyle}>Anteckningar</label>
      <textarea
        name="notes"
        value={form.notes}
        onChange={handleChange}
        style={{ ...inputStyle, minHeight: 40, resize: "vertical" }}
        placeholder="Deras #9 är poängfarlig, deras boxplay svagt"
      />

      <button type="submit" style={buttonStyle}>
        {isEdit ? "Spara ändringar" : "Spara analys"}
      </button>
      {onCancel && isEdit && (
        <button
          type="button"
          style={{
            ...buttonStyle,
            background: "#e66",
            color: "#fff",
            marginTop: 10,
          }}
          onClick={onCancel}
        >
          Avbryt
        </button>
      )}
      <style>{`
        @media (max-width: 600px) {
          form { padding: 8px !important; }
          input, textarea, select { font-size: 15px !important; }
          button { font-size: 15px !important; }
        }
      `}</style>
    </form>
  );
};

export default OpponentAnalysisEdit;