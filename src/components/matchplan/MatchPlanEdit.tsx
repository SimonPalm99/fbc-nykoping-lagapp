import React, { useState } from "react";
import "./MatchPlanEdit.css";

export interface MatchPlan {
  id: string;
  date: string;
  opponent: string;
  location: string;
  lineup: string[];
  tactics: string;
}

interface Props {
  initialPlan?: MatchPlan;
  onSave: (plan: MatchPlan) => void;
}

const defaultLineup = ["Målvakt", "Back", "Back", "Center", "Forward", "Forward"];

const MatchPlanEdit: React.FC<Props> = ({ initialPlan, onSave }) => {
  const [plan, setPlan] = useState<MatchPlan>(
    initialPlan ?? {
      id: Math.random().toString(36).slice(2),
      date: "",
      opponent: "",
      location: "",
      lineup: defaultLineup,
      tactics: ""
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx?: number) => {
    const { name, value } = e.target;
    if (name === "lineup" && typeof idx === "number") {
      setPlan(p => {
        const newLineup = [...p.lineup];
        newLineup[idx] = value;
        return { ...p, lineup: newLineup };
      });
    } else {
      setPlan(p => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(plan);
  };

  return (
    <form onSubmit={handleSubmit} className="matchplan-edit-form">
      <h3>Redigera Matchplan</h3>
      <label>
        Datum:
        <input name="date" type="date" value={plan.date} onChange={handleChange} required />
      </label>
      <label>
        Motståndare:
        <input name="opponent" value={plan.opponent} onChange={handleChange} required />
      </label>
      <label>
        Plats:
        <input name="location" value={plan.location} onChange={handleChange} required />
      </label>
      <label>
        Uppställning:
        {plan.lineup.map((pos, idx) => (
          <input
            key={idx}
            name="lineup"
            value={pos}
            onChange={e => handleChange(e, idx)}
            className="matchplan-lineup-input"
          />
        ))}
      </label>
      <label>
        Taktik / Anteckning:
        <textarea name="tactics" value={plan.tactics} onChange={handleChange} rows={4} />
      </label>
      <button type="submit" className="matchplan-save-btn">Spara plan</button>
      <button type="submit" className="matchplan-save-btn matchplan-save-btn-margin">Spara plan</button>
    </form>
  );
};

export default MatchPlanEdit;