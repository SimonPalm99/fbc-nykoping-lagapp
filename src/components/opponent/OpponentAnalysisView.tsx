import React, { useState } from "react";
import { useOpponent } from "../../context/OpponentContext";
import { OpponentAnalysis } from "../../types/opponent";
import OpponentAnalysisEdit from "./OpponentAnalysisEdit";
import { useToast } from "../ui/Toast";

interface OpponentAnalysisViewProps {
  analysis: OpponentAnalysis;
  onEdit?: (a: OpponentAnalysis) => void;
  onDelete?: (id: string) => void;
  isLeader?: boolean;
}

const OpponentAnalysisView: React.FC<OpponentAnalysisViewProps> = ({
  analysis,
  onEdit,
  onDelete,
  isLeader = false
}) => {
  const { teams } = useOpponent();
  const toast = useToast();
  const [edit, setEdit] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const team = teams.find((t) => t.id === analysis.teamId);

  const handleDelete = () => {
    if (window.confirm("Är du säker på att du vill ta bort denna analys?")) {
      onDelete?.(analysis.id);
      toast?.success("Analys borttagen");
    }
  };

  const styles = {
    container: {
      background: 'var(--card-background)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1rem',
      border: '1px solid var(--border-color)',
      transition: 'all 0.2s ease'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem'
    },
    title: {
      color: 'var(--text-primary)',
      fontSize: '1.25rem',
      fontWeight: '600',
      margin: 0
    },
    meta: {
      color: 'var(--text-secondary)',
      fontSize: '0.875rem',
      marginTop: '0.25rem'
    },
    section: {
      marginBottom: '1rem'
    },
    sectionTitle: {
      color: 'var(--text-primary)',
      fontSize: '1rem',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    chipContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '0.5rem',
      marginTop: '0.5rem'
    },
    chip: {
      background: 'var(--primary-color)',
      color: '#ffffff',
      padding: '0.25rem 0.75rem',
      borderRadius: '16px',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    strengthChip: {
      background: '#10b981',
      color: '#ffffff',
      padding: '0.25rem 0.75rem',
      borderRadius: '16px',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    weaknessChip: {
      background: '#ef4444',
      color: '#ffffff',
      padding: '0.25rem 0.75rem',
      borderRadius: '16px',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    tacticsBox: {
      background: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '8px',
      padding: '1rem',
      marginTop: '0.5rem'
    },
    notesBox: {
      background: 'rgba(245, 158, 11, 0.1)',
      border: '1px solid rgba(245, 158, 11, 0.2)',
      borderRadius: '8px',
      padding: '1rem',
      marginTop: '0.5rem'
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    button: {
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease'
    },
    primaryButton: {
      background: 'var(--primary-color)',
      color: '#ffffff'
    },
    dangerButton: {
      background: '#ef4444',
      color: '#ffffff'
    },
    secondaryButton: {
      background: 'var(--border-color)',
      color: 'var(--text-primary)'
    }
  };

  if (edit) {
    return (
      <OpponentAnalysisEdit
        initial={analysis}
        isEdit
        onDone={(a) => {
          setEdit(false);
          onEdit?.(a);
          toast?.success("Analys uppdaterad");
        }}
        onCancel={() => setEdit(false)}
      />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>
            🔍 Analys: {team?.name || analysis.teamId}
          </h3>
          <div style={styles.meta}>
            Skapad av {analysis.createdBy} • {new Date(analysis.createdAt).toLocaleDateString('sv-SE')}
          </div>
        </div>
        {isLeader && (
          <div style={{
            display: 'flex',
            gap: '0.5rem'
          }}>
            <button
              style={{
                ...styles.button,
                ...styles.secondaryButton
              }}
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? '📄 Dölj' : '📋 Visa mer'}
            </button>
          </div>
        )}
      </div>

      {/* Styrkor */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>💪 Styrkor</div>
        {analysis.strengths && analysis.strengths.length > 0 ? (
          <div style={styles.chipContainer}>
            {analysis.strengths.map((strength, index) => (
              <span key={index} style={styles.strengthChip}>
                {strength}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic' }}>
            Inga styrkor dokumenterade
          </p>
        )}
      </div>

      {/* Svagheter */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>⚠️ Svagheter</div>
        {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
          <div style={styles.chipContainer}>
            {analysis.weaknesses.map((weakness, index) => (
              <span key={index} style={styles.weaknessChip}>
                {weakness}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic' }}>
            Inga svagheter dokumenterade
          </p>
        )}
      </div>

      {/* Taktik */}
      {analysis.tactics && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>📋 Taktisk analys</div>
          <div style={styles.tacticsBox}>
            <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {analysis.tactics}
            </p>
          </div>
        </div>
      )}

      {/* Detaljvy */}
      {showDetails && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          {/* Anteckningar */}
          {analysis.notes && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>📝 Anteckningar</div>
              <div style={styles.notesBox}>
                <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {analysis.notes}
                </p>
              </div>
            </div>
          )}

          {/* Rekommendationer */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>💡 Rekommendationer</div>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <ul style={{ margin: 0, color: 'var(--text-primary)', paddingLeft: '1.5rem' }}>
                <li>Utnyttja deras svagheter i defensiven</li>
                <li>Var uppmärksam på deras starka sidor</li>
                <li>Anpassa vår taktik efter deras spelstil</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Knappar */}
      {isLeader && (
        <div style={styles.buttonGroup}>
          <button
            style={{
              ...styles.button,
              ...styles.primaryButton
            }}
            onClick={() => setEdit(true)}
          >
            ✏️ Redigera
          </button>
          <button
            style={{
              ...styles.button,
              ...styles.dangerButton
            }}
            onClick={handleDelete}
          >
            🗑️ Ta bort
          </button>
          <button
            style={{
              ...styles.button,
              ...styles.secondaryButton
            }}
            onClick={() => {
              toast?.info('Export-funktion kommer i nästa version');
            }}
          >
            📤 Exportera
          </button>
        </div>
      )}
    </div>
  );
};

export default OpponentAnalysisView;