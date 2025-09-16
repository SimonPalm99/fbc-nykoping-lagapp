import React, { useState } from "react";
import { useToast } from "../ui/Toast";
import { OpponentMatch } from "../../types/opponent";

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

  const styles = {
    container: {
      background: 'var(--card-background)',
      borderRadius: '12px',
      padding: '2rem',
      border: '1px solid var(--border-color)',
      maxWidth: '800px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '2rem',
      color: 'var(--text-primary)'
    },
    section: {
      marginBottom: '2rem'
    },
    sectionTitle: {
      color: 'var(--text-primary)',
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      background: 'var(--background-color)',
      color: 'var(--text-primary)',
      fontSize: '1rem',
      marginBottom: '0.5rem'
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      background: 'var(--background-color)',
      color: 'var(--text-primary)',
      fontSize: '1rem',
      resize: 'vertical' as const,
      minHeight: '100px',
      marginBottom: '0.5rem'
    },
    chipContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '0.5rem',
      marginBottom: '0.5rem'
    },
    chip: {
      background: 'var(--primary-color)',
      color: '#ffffff',
      padding: '0.25rem 0.75rem',
      borderRadius: '16px',
      fontSize: '0.875rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    removeButton: {
      background: 'none',
      border: 'none',
      color: '#ffffff',
      cursor: 'pointer',
      fontSize: '0.75rem'
    },
    addButton: {
      background: 'var(--primary-color)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '600'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '2rem'
    },
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem'
    },
    primaryButton: {
      background: 'var(--primary-color)',
      color: '#ffffff'
    },
    secondaryButton: {
      background: 'var(--border-color)',
      color: 'var(--text-primary)'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: '0 0 0.5rem 0' }}>📝 Matchrapport</h2>
        <div style={{ color: 'var(--text-secondary)' }}>
          {report.homeTeam} vs {report.awayTeam} • {new Date(report.date).toLocaleDateString('sv-SE')}
        </div>
        <div style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginTop: '0.5rem'
        }}>
          {report.score.home}-{report.score.away}
        </div>
      </div>

      {/* Huvudrapport */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📄 Matchrapport</h3>
        <textarea
          style={styles.textarea}
          placeholder="Skriv en sammanfattning av matchen..."
          value={report.report}
          onChange={(e) => setReport(prev => ({ ...prev, report: e.target.value }))}
          rows={5}
        />
      </div>

      {/* Nyckelhändelser */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>⚡ Nyckelhändelser</h3>
        <div style={styles.chipContainer}>
          {report.keyEvents.map((event, index) => (
            <span key={index} style={styles.chip}>
              {event}
              <button
                style={styles.removeButton}
                onClick={() => removeItem('keyEvents', index)}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            style={{ ...styles.input, marginBottom: 0 }}
            placeholder="Lägg till nyckelhändelse..."
            value={newKeyEvent}
            onChange={(e) => setNewKeyEvent(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addKeyEvent()}
          />
          <button style={styles.addButton} onClick={addKeyEvent}>
            ➕
          </button>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Vår prestation */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🟢 Vår prestation</h3>
          
          <div style={styles.rating}>
            <label style={{ color: 'var(--text-primary)' }}>Betyg:</label>
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
            />
            <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
              {report.ourPerformance.rating}/10
            </span>
          </div>

          <input
            style={styles.input}
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

          <h4 style={{ color: 'var(--text-primary)', margin: '1rem 0 0.5rem 0' }}>
            💪 Styrkor
          </h4>
          <div style={styles.chipContainer}>
            {report.ourPerformance.strengths.map((strength, index) => (
              <span key={index} style={{ ...styles.chip, background: '#10b981' }}>
                {strength}
                <button
                  style={styles.removeButton}
                  onClick={() => removeItem('ourStrengths', index)}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              style={{ ...styles.input, marginBottom: 0 }}
              placeholder="Lägg till styrka..."
              value={newOurStrength}
              onChange={(e) => setNewOurStrength(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addOurStrength()}
            />
            <button style={styles.addButton} onClick={addOurStrength}>
              ➕
            </button>
          </div>

          <h4 style={{ color: 'var(--text-primary)', margin: '1rem 0 0.5rem 0' }}>
            ⚠️ Svagheter
          </h4>
          <div style={styles.chipContainer}>
            {report.ourPerformance.weaknesses.map((weakness, index) => (
              <span key={index} style={{ ...styles.chip, background: '#ef4444' }}>
                {weakness}
                <button
                  style={styles.removeButton}
                  onClick={() => removeItem('ourWeaknesses', index)}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              style={{ ...styles.input, marginBottom: 0 }}
              placeholder="Lägg till svaghet..."
              value={newOurWeakness}
              onChange={(e) => setNewOurWeakness(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addOurWeakness()}
            />
            <button style={styles.addButton} onClick={addOurWeakness}>
              ➕
            </button>
          </div>
        </div>

        {/* Motståndarens prestation */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🔴 Motståndarens prestation</h3>
          
          <div style={styles.rating}>
            <label style={{ color: 'var(--text-primary)' }}>Betyg:</label>
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
            />
            <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
              {report.opponentPerformance.rating}/10
            </span>
          </div>

          <h4 style={{ color: 'var(--text-primary)', margin: '1rem 0 0.5rem 0' }}>
            💪 Deras styrkor
          </h4>
          <div style={styles.chipContainer}>
            {report.opponentPerformance.strengths.map((strength, index) => (
              <span key={index} style={{ ...styles.chip, background: '#10b981' }}>
                {strength}
                <button
                  style={styles.removeButton}
                  onClick={() => removeItem('opponentStrengths', index)}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              style={{ ...styles.input, marginBottom: 0 }}
              placeholder="Lägg till styrka..."
              value={newOpponentStrength}
              onChange={(e) => setNewOpponentStrength(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addOpponentStrength()}
            />
            <button style={styles.addButton} onClick={addOpponentStrength}>
              ➕
            </button>
          </div>

          <h4 style={{ color: 'var(--text-primary)', margin: '1rem 0 0.5rem 0' }}>
            ⚠️ Deras svagheter
          </h4>
          <div style={styles.chipContainer}>
            {report.opponentPerformance.weaknesses.map((weakness, index) => (
              <span key={index} style={{ ...styles.chip, background: '#ef4444' }}>
                {weakness}
                <button
                  style={styles.removeButton}
                  onClick={() => removeItem('opponentWeaknesses', index)}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              style={{ ...styles.input, marginBottom: 0 }}
              placeholder="Lägg till svaghet..."
              value={newOpponentWeakness}
              onChange={(e) => setNewOpponentWeakness(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addOpponentWeakness()}
            />
            <button style={styles.addButton} onClick={addOpponentWeakness}>
              ➕
            </button>
          </div>
        </div>
      </div>

      {/* Höjdpunkter */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>✨ Höjdpunkter</h3>
        <div style={styles.chipContainer}>
          {(report.highlights || []).map((highlight, index) => (
            <span key={index} style={{ ...styles.chip, background: '#f59e0b' }}>
              {highlight}
              <button
                style={styles.removeButton}
                onClick={() => removeItem('highlights', index)}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            style={{ ...styles.input, marginBottom: 0 }}
            placeholder="Lägg till höjdpunkt..."
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
          />
          <button style={styles.addButton} onClick={addHighlight}>
            ➕
          </button>
        </div>
      </div>

      {/* Knappar */}
      <div style={styles.buttonGroup}>
        <button
          style={{
            ...styles.button,
            ...styles.secondaryButton
          }}
          onClick={onCancel}
        >
          Avbryt
        </button>
        <button
          style={{
            ...styles.button,
            ...styles.primaryButton
          }}
          onClick={handleSave}
        >
          💾 Spara rapport
        </button>
      </div>
    </div>
  );
};

export default MatchReportGenerator;
