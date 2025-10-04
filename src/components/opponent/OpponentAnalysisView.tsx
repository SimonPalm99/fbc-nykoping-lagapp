import React, { useState } from "react";
import { useOpponent } from "../../context/OpponentContext";
import { OpponentAnalysis } from "../../types/opponent";
import OpponentAnalysisEdit from "./OpponentAnalysisEdit";
import { useToast } from "../ui/Toast";
import styles from "./OpponentAnalysisView.module.css";

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
    <div className={styles["analys-container"]}>
      <div className={styles["analys-header"]}>
        <div>
          <h3 className={styles["analys-titel"]}>
            🔍 Analys: {team?.name || analysis.teamId}
          </h3>
          <div className={styles["analys-meta"]}>
            Skapad av {analysis.createdBy} • {new Date(analysis.createdAt).toLocaleDateString('sv-SE')}
          </div>
        </div>
        {isLeader && (
          <div className={styles["button-group"]}>
            <button
              className={`${styles["knapp"]} ${styles["knapp-sekundar"]}`}
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? '📄 Dölj' : '📋 Visa mer'}
            </button>
          </div>
        )}
      </div>

      {/* Styrkor */}
      <div className={styles["analys-section"]}>
        <div className={styles["analys-section-titel"]}>💪 Styrkor</div>
        {analysis.strengths && analysis.strengths.length > 0 ? (
          <div className={styles["chip-container"]}>
            {analysis.strengths.map((strength, index) => (
              <span key={index} className={`${styles["chip"]} ${styles["styrka-chip"]}`}>
                {strength}
              </span>
            ))}
          </div>
        ) : (
          <p className={styles["ingen-info"]}>
            Inga styrkor dokumenterade
          </p>
        )}
      </div>

      {/* Svagheter */}
      <div className={styles["analys-section"]}>
        <div className={styles["analys-section-titel"]}>⚠️ Svagheter</div>
        {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
          <div className={styles["chip-container"]}>
            {analysis.weaknesses.map((weakness, index) => (
              <span key={index} className={`${styles["chip"]} ${styles["svaghet-chip"]}`}>
                {weakness}
              </span>
            ))}
          </div>
        ) : (
          <p className={styles["ingen-info"]}>
            Inga svagheter dokumenterade
          </p>
        )}
      </div>

      {/* Taktik */}
      {analysis.tactics && (
        <div className={styles["analys-section"]}>
          <div className={styles["analys-section-titel"]}>📋 Taktisk analys</div>
          <div className={styles["taktik-box"]}>
            <p className={styles["analys-text"]}>
              {analysis.tactics}
            </p>
          </div>
        </div>
      )}

      {/* Detaljvy */}
      {showDetails && (
        <div className={styles["analys-detaljer"]}>
          {/* Anteckningar */}
          {analysis.notes && (
            <div className={styles["analys-section"]}>
              <div className={styles["analys-section-titel"]}>📝 Anteckningar</div>
              <div className={styles["anteckning-box"]}>
                <p className={styles["analys-text"]}>
                  {analysis.notes}
                </p>
              </div>
            </div>
          )}

          {/* Rekommendationer */}
          <div className={styles["analys-section"]}>
            <div className={styles["analys-section-titel"]}>💡 Rekommendationer</div>
            <div className={styles["rekommendation-box"]}>
              <ul className={styles["rekommendation-lista"]}>
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
        <div className={styles["button-group"]}>
          <button
            className={`${styles["knapp"]} ${styles["knapp-primar"]}`}
            onClick={() => setEdit(true)}
          >
            ✏️ Redigera
          </button>
          <button
            className={`${styles["knapp"]} ${styles["knapp-fara"]}`}
            onClick={handleDelete}
          >
            🗑️ Ta bort
          </button>
          <button
            className={`${styles["knapp"]} ${styles["knapp-sekundar"]}`}
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