import React, { useState } from "react";
import { useToast } from "../ui/Toast";
import { OpponentMatch } from "../../types/opponent";
import './MatchReportGenerator.css';

interface Props {
  match: OpponentMatch;
  onSave: (report: OpponentMatch) => void;
  onCancel: () => void;
}

const MatchReportGenerator: React.FC<Props> = ({ match, onSave, onCancel }) => {
  const toast = useToast();
  
  const [report, setReport] = useState<OpponentMatch>({
    ...match,
    report: match.report || "",
    keyEvents: match.keyEvents || [],
    ourPerformance: {
      rating: match.ourPerformance?.rating || 5,
      strengths: match.ourPerformance?.strengths || [],
      weaknesses: match.ourPerformance?.weaknesses || [],
      mvp: match.ourPerformance?.mvp || "",
      notes: match.ourPerformance?.notes || ""
    },
    opponentPerformance: {
      rating: match.opponentPerformance?.rating || 5,
      strengths: match.opponentPerformance?.strengths || [],
      weaknesses: match.opponentPerformance?.weaknesses || [],
      keyPlayers: match.opponentPerformance?.keyPlayers || [],
      notes: match.opponentPerformance?.notes || ""
    },
    tactics: {
      ourFormation: match.tactics?.ourFormation || "",
      theirFormation: match.tactics?.theirFormation || "",
      ourTactics: match.tactics?.ourTactics || [],
      theirTactics: match.tactics?.theirTactics || []
    },
    highlights: match.highlights || []
  });

  const [newKeyEvent, setNewKeyEvent] = useState("");
  const [newOurStrength, setNewOurStrength] = useState("");
  const [newOurWeakness, setNewOurWeakness] = useState("");
  const [newOpponentStrength, setNewOpponentStrength] = useState("");
  const [newOpponentWeakness, setNewOpponentWeakness] = useState("");
  const [newHighlight, setNewHighlight] = useState("");

  const handleSave = () => {
    if (!report.report?.trim()) {
      toast?.error("Skriv en matchrapport");
      return;
    }

    onSave(report);
    toast?.success("Matchrapport sparad!");
  };

  const addKeyEvent = () => {
    if (newKeyEvent.trim()) {
      setReport(prev => ({
        ...prev,
        keyEvents: [...prev.keyEvents, newKeyEvent.trim()]
      }));
      setNewKeyEvent("");
    }
  };

  const addOurStrength = () => {
    if (newOurStrength.trim()) {
      setReport(prev => ({
        ...prev,
        ourPerformance: {
          ...prev.ourPerformance,
          strengths: [...prev.ourPerformance.strengths, newOurStrength.trim()]
        }
      }));
      setNewOurStrength("");
    }
  };

  const addOurWeakness = () => {
    if (newOurWeakness.trim()) {
      setReport(prev => ({
        ...prev,
        ourPerformance: {
          ...prev.ourPerformance,
          weaknesses: [...prev.ourPerformance.weaknesses, newOurWeakness.trim()]
        }
      }));
      setNewOurWeakness("");
    }
  };

  const addOpponentStrength = () => {
    if (newOpponentStrength.trim()) {
      setReport(prev => ({
        ...prev,
        opponentPerformance: {
          ...prev.opponentPerformance,
          strengths: [...prev.opponentPerformance.strengths, newOpponentStrength.trim()]
        }
      }));
      setNewOpponentStrength("");
    }
  };

  const addOpponentWeakness = () => {
    if (newOpponentWeakness.trim()) {
      setReport(prev => ({
        ...prev,
        opponentPerformance: {
          ...prev.opponentPerformance,
          weaknesses: [...prev.opponentPerformance.weaknesses, newOpponentWeakness.trim()]
        }
      }));
      setNewOpponentWeakness("");
    }
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setReport(prev => ({
        ...prev,
        highlights: [...(prev.highlights || []), newHighlight.trim()]
      }));
      setNewHighlight("");
    }
  };

  const removeItem = (category: string, index: number) => {
    if (category === 'keyEvents') {
      setReport(prev => ({
        ...prev,
        keyEvents: prev.keyEvents.filter((_, i) => i !== index)
      }));
    } else if (category === 'ourStrengths') {
      setReport(prev => ({
        ...prev,
        ourPerformance: {
          ...prev.ourPerformance,
          strengths: prev.ourPerformance.strengths.filter((_, i) => i !== index)
        }
      }));
    } else if (category === 'ourWeaknesses') {
      setReport(prev => ({
        ...prev,
        ourPerformance: {
          ...prev.ourPerformance,
          weaknesses: prev.ourPerformance.weaknesses.filter((_, i) => i !== index)
        }
      }));
    } else if (category === 'opponentStrengths') {
      setReport(prev => ({
        ...prev,
        opponentPerformance: {
          ...prev.opponentPerformance,
          strengths: prev.opponentPerformance.strengths.filter((_, i) => i !== index)
        }
      }));
    } else if (category === 'opponentWeaknesses') {
      setReport(prev => ({
        ...prev,
        opponentPerformance: {
          ...prev.opponentPerformance,
          weaknesses: prev.opponentPerformance.weaknesses.filter((_, i) => i !== index)
        }
      }));
    } else if (category === 'highlights') {
      setReport(prev => ({
        ...prev,
        highlights: (prev.highlights || []).filter((_, i) => i !== index)
      }));
    }
  };

  // Styles moved to external CSS file: MatchReportGenerator.css

  return (
<div className="match-report-container">
  <div className="match-report-header">
    <h2 className="match-report-title">📝 Matchrapport</h2>
    <div className="match-report-subtitle">
      {report.homeTeam} vs {report.awayTeam} • {new Date(report.date).toLocaleDateString('sv-SE')}
    </div>
    <div className="match-report-score">
      {report.score.home}-{report.score.away}
    </div>
  </div>
  {/* Huvudrapport */}
  <div className="match-report-section">
    <h3 className="match-report-section-title">📄 Matchrapport</h3>
    <textarea
      className="match-report-textarea"
      placeholder="Skriv en sammanfattning av matchen..."
      value={report.report}
      onChange={(e) => setReport(prev => ({ ...prev, report: e.target.value }))}
      rows={5}
    />
  </div>
  {/* Nyckelhändelser */}
  <div className="match-report-section">
    <h3 className="match-report-section-title">⚡ Nyckelhändelser</h3>
    <div className="match-report-chip-container">
      {report.keyEvents.map((event, index) => (
        <span key={index} className="match-report-chip">
          {event}
          <button
            className="match-report-remove-button"
            onClick={() => removeItem('keyEvents', index)}
          >
            ✕
          </button>
        </span>
      ))}
    </div>
    <div className="match-report-flex-row">
      <input
        className="match-report-input"
        placeholder="Lägg till nyckelhändelse..."
        value={newKeyEvent}
        onChange={(e) => setNewKeyEvent(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addKeyEvent()}
      />
      <button className="match-report-add-button" onClick={addKeyEvent}>
        ➕
      </button>
    </div>
  </div>
  <div className="match-report-grid">
    {/* Vår prestation */}
    <div className="match-report-section">
      <h3 className="match-report-section-title">🟢 Vår prestation</h3>
      <div className="match-report-rating">
        <label className="match-report-label">Betyg:</label>
        <input
          type="range"
          min="1"
          max="10"
          value={report.ourPerformance.rating}
          onChange={(e) => setReport(prev => ({
            ...prev,
            ourPerformance: {
              ...prev.ourPerformance,
              rating: parseInt(e.target.value)
            }
          }))}
          title="Välj betyg för vår prestation"
        />
        <span className="match-report-rating-value">
          {report.ourPerformance.rating}/10
        </span>
      </div>
      <input
        className="match-report-input"
        placeholder="MVP..."
        value={report.ourPerformance.mvp}
        onChange={(e) => setReport(prev => ({
          ...prev,
          ourPerformance: {
            ...prev.ourPerformance,
            mvp: e.target.value
          }
        }))}
      />
      <h4 className="match-report-subsection-title">
        💪 Styrkor
      </h4>
      <div className="match-report-chip-container">
        {report.ourPerformance.strengths.map((strength, index) => (
          <span key={index} className="match-report-chip match-report-chip-green">
            {strength}
            <button
              className="match-report-remove-button"
              onClick={() => removeItem('ourStrengths', index)}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="match-report-flex-row">
        <input
          className="match-report-input"
          placeholder="Lägg till styrka..."
          value={newOurStrength}
          onChange={(e) => setNewOurStrength(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addOurStrength()}
        />
        <button className="match-report-add-button" onClick={addOurStrength}>
          ➕
        </button>
      </div>
      <h4 className="match-report-subsection-title">
        ⚠️ Svagheter
      </h4>
      <div className="match-report-chip-container">
        {report.ourPerformance.weaknesses.map((weakness, index) => (
          <span key={index} className="match-report-chip match-report-chip-red">
            {weakness}
            <button
              className="match-report-remove-button"
              onClick={() => removeItem('ourWeaknesses', index)}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="match-report-flex-row">
        <input
          className="match-report-input"
          placeholder="Lägg till svaghet..."
          value={newOurWeakness}
          onChange={(e) => setNewOurWeakness(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addOurWeakness()}
        />
        <button className="match-report-add-button" onClick={addOurWeakness}>
          ➕
        </button>
      </div>
    </div>
    {/* Motståndarens prestation */}
    <div className="match-report-section">
      <h3 className="match-report-section-title">🔴 Motståndarens prestation</h3>
      <div className="match-report-rating">
        <label className="match-report-label">Betyg:</label>
        <input
          type="range"
          min="1"
          max="10"
          value={report.opponentPerformance.rating}
          onChange={(e) => setReport(prev => ({
            ...prev,
            opponentPerformance: {
              ...prev.opponentPerformance,
              rating: parseInt(e.target.value)
            }
          }))}
          title="Välj betyg för motståndarens prestation"
        />
        <span className="match-report-rating-value">
          {report.opponentPerformance.rating}/10
        </span>
      </div>
      <h4 className="match-report-subsection-title">
        💪 Deras styrkor
      </h4>
      <div className="match-report-chip-container">
        {report.opponentPerformance.strengths.map((strength, index) => (
          <span key={index} className="match-report-chip match-report-chip-green">
            {strength}
            <button
              className="match-report-remove-button"
              onClick={() => removeItem('opponentStrengths', index)}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="match-report-flex-row">
        <input
          className="match-report-input"
          placeholder="Lägg till styrka..."
          value={newOpponentStrength}
          onChange={(e) => setNewOpponentStrength(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addOpponentStrength()}
        />
        <button className="match-report-add-button" onClick={addOpponentStrength}>
          ➕
        </button>
      </div>
      <h4 className="match-report-subsection-title">
        ⚠️ Deras svagheter
      </h4>
      <div className="match-report-chip-container">
        {report.opponentPerformance.weaknesses.map((weakness, index) => (
          <span key={index} className="match-report-chip match-report-chip-red">
            {weakness}
            <button
              className="match-report-remove-button"
              onClick={() => removeItem('opponentWeaknesses', index)}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="match-report-flex-row">
        <input
          className="match-report-input"
          placeholder="Lägg till svaghet..."
          value={newOpponentWeakness}
          onChange={(e) => setNewOpponentWeakness(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addOpponentWeakness()}
        />
        <button className="match-report-add-button" onClick={addOpponentWeakness}>
          ➕
        </button>
      </div>
    </div>
  </div>
  {/* Höjdpunkter */}
  <div className="match-report-section">
    <h3 className="match-report-section-title">✨ Höjdpunkter</h3>
    <div className="match-report-chip-container">
      {(report.highlights || []).map((highlight, index) => (
        <span key={index} className="match-report-chip match-report-chip-yellow">
          {highlight}
          <button
            className="match-report-remove-button"
            onClick={() => removeItem('highlights', index)}
          >
            ✕
          </button>
        </span>
      ))}
    </div>
    <div className="match-report-flex-row">
      <input
        className="match-report-input"
        placeholder="Lägg till höjdpunkt..."
        value={newHighlight}
        onChange={(e) => setNewHighlight(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
      />
      <button className="match-report-add-button" onClick={addHighlight}>
        ➕
      </button>
    </div>
  </div>
  {/* Knappar */}
  <div className="match-report-button-group">
    <button
      className="match-report-button match-report-secondary-button"
      onClick={onCancel}
    >
      Avbryt
    </button>
    <button
      className="match-report-button match-report-primary-button"
      onClick={handleSave}
    >
      💾 Spara rapport
    </button>
  </div>
</div>
);
}

export default MatchReportGenerator;
