import React, { useState } from "react";
import { useOpponent } from "../../context/OpponentContext";
import { OpponentAnalysis } from "../../types/opponent";
import OpponentAnalysisView from "./OpponentAnalysisView";
import styles from "./OpponentList.module.css";

// Props-interface med stöd för isLeader
export interface OpponentAnalysisListProps {
  teamId: string;
  isLeader?: boolean;
}

const OpponentAnalysisList: React.FC<OpponentAnalysisListProps> = ({
  teamId,
  isLeader = false,
}) => {
  const { teams } = useOpponent();

  // Hämta analyser för valt lag
  const [analyses, setAnalyses] = useState<OpponentAnalysis[]>(
    teams.find((t) => t.id === teamId)?.analysis || []
  );

  // Uppdatera en analys på plats i listan
  const handleEdit = (a: OpponentAnalysis) => {
    setAnalyses((prev) =>
      prev.map((item) => (item.id === a.id ? a : item))
    );
  };

  // Ta bort en analys
  const handleDelete = (id: string) => {
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
  };

  if (!analyses.length) {
    return (
      <div className={styles["ingen-analys"]}>
        Ingen analys sparad för detta lag ännu.
      </div>
    );
  }

  return (
    <>
      {analyses.map((analysis) => (
        <OpponentAnalysisView
          key={analysis.id}
          analysis={analysis}
          {...(isLeader && { onEdit: handleEdit, onDelete: handleDelete })}
          isLeader={isLeader}
        />
      ))}
    </>
  );
};

export default OpponentAnalysisList;