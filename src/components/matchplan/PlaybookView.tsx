import React, { useState } from "react";
import { useToast } from "../ui/Toast";
import styles from "./PlaybookView.module.css";

interface Formation {
  id: string;
  name: string;
  type: "5v5" | "powerplay" | "penalty" | "faceoff";
  players: Array<{
    playerId: string;
    x: number;
    y: number;
    position: "Forward" | "Defense" | "Goalkeeper";
    line: number;
  }>;
  description: string;
  isDefault: boolean;
}

interface TacticNote {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "offense" | "defense" | "special_teams" | "general";
}

interface MatchPlan {
  id: string;
  matchTitle: string;
  opponent: string;
  date: string;
  venue: string;
  formations: Formation[];
  tactics: TacticNote[];
  coachNotes: string;
  playerInstructions: Record<string, string>;
  specialPlays: string[];
  keys: string[];
  published: boolean;
  confirmedBy: string[];
}

interface Props {
  matchPlan: MatchPlan;
  readonly?: boolean;
  playerId?: string;
  onConfirm?: () => void;
}

const PlaybookView: React.FC<Props> = ({ 
  matchPlan, 
  readonly = true, 
  playerId,
  onConfirm 
}) => {
  const toast = useToast();
  const [currentSection, setCurrentSection] = useState<"overview" | "formations" | "tactics" | "instructions">("overview");
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);

  const isConfirmed = playerId ? matchPlan.confirmedBy.includes(playerId) : false;
  const confirmationRate = (matchPlan.confirmedBy.length / 20) * 100; // Antag 20 spelare

  const handleConfirm = () => {
    if (onConfirm && playerId && !isConfirmed) {
      onConfirm();
      toast?.success("Du har bekräftat att du läst matchplanen!");
    }
  };

  const sections = [
    { id: "overview", name: "Översikt", icon: "📊" },
    { id: "formations", name: "Formationer", icon: "🏒" },
    { id: "tactics", name: "Taktik", icon: "📋" },
    { id: "instructions", name: "Instruktioner", icon: "📝" }
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles["header-title"]}>
          📖 {matchPlan.matchTitle}
        </h1>
        <div className={styles["header-subtitle"]}>
          vs {matchPlan.opponent} • {new Date(matchPlan.date).toLocaleDateString("sv-SE")} • {matchPlan.venue}
        </div>
        {/* Bekräftelse-status */}
        <div className={styles["confirm-status"]}>
          <div className={styles["confirm-status-label"]}>
            Bekräftat av spelare: {matchPlan.confirmedBy.length}/20 ({Math.round(confirmationRate)}%)
          </div>
          <div className={styles["confirm-bar"]}>
            <div className={styles["confirm-bar-fill"]} data-width={confirmationRate} />
          </div>
          {playerId && !readonly && (
            <button
              onClick={handleConfirm}
              disabled={isConfirmed}
              className={isConfirmed ? `${styles["confirm-btn"]} ${styles["confirm-btn-confirmed"]}` : styles["confirm-btn"]}
            >
              {isConfirmed ? "✅ Bekräftad" : "📋 Bekräfta att jag läst"}
            </button>
          )}
        </div>
      </header>
      {/* Navigation */}
      <div className={styles.tabs}>
        {sections.map(section => (
          <button
            key={section.id}
            className={currentSection === section.id ? `${styles.tab} ${styles["tab-active"]}` : styles.tab}
            onClick={() => setCurrentSection(section.id as any)}
          >
            {section.icon} {section.name}
          </button>
        ))}
      </div>
      {/* Content */}
      {currentSection === "overview" && (
        <div>
          <div className={`${styles.grid} ${styles["grid-auto"]} ${styles["grid-margin-bottom"]}`}> 
            <div className={styles.card}>
              <div className={`${styles["card-title"]} ${styles["card-title-blue"]}`}>{matchPlan.formations.length}</div>
              <div className={styles["card-label"]}>Formationer</div>
            </div>
            <div className={styles.card}>
              <div className={`${styles["card-title"]} ${styles["card-title-orange"]}`}>{matchPlan.tactics.length}</div>
              <div className={styles["card-label"]}>Taktiska instruktioner</div>
            </div>
            <div className={styles.card}>
              <div className={`${styles["card-title"]} ${styles["card-title-green"]}`}>{matchPlan.keys.length}</div>
              <div className={styles["card-label"]}>Nycklar till seger</div>
            </div>
            <div className={styles.card}>
              <div className={`${styles["card-title"]} ${styles["card-title-purple"]}`}>{matchPlan.specialPlays.length}</div>
              <div className={styles["card-label"]}>Specialspel</div>
            </div>
          </div>
          {/* Nycklar till seger */}
          {matchPlan.keys.length > 0 && (
            <div className={styles.card}>
              <h3 className={styles["special-plays-title"]}>🔑 Nycklar till seger</h3>
              <ul className={styles["keys-list"]}>
                {matchPlan.keys.map((key, index) => (
                  <li key={index} className={styles["keys-list-item"]}>{key}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Tränaranteckningar */}
          {matchPlan.coachNotes && (
            <div className={styles.card}>
              <h3 className={styles["coach-notes-title"]}>💬 Tränaranteckningar</h3>
              <p className={styles["coach-notes"]}>{matchPlan.coachNotes}</p>
            </div>
          )}
        </div>
      )}
      {currentSection === "formations" && (
        <div>
          <div className={styles.grid}>
            {matchPlan.formations.map(formation => (
              <div
                key={formation.id}
                className={`${styles.card} ${styles["formation-card"]}`}
                onClick={() => setSelectedFormation(selectedFormation?.id === formation.id ? null : formation)}
              >
                <div className={styles["formation-card-header"]}>
                  <div>
                    <h4 className={styles["formation-card-title"]}>🏒 {formation.name}</h4>
                    <div className={styles["formation-card-meta"]}>Typ: {formation.type} • {formation.players.length} spelare</div>
                    <p className={styles["formation-card-desc"]}>{formation.description}</p>
                  </div>
                  <div className={styles["formation-card-arrow"]}>{selectedFormation?.id === formation.id ? "▼" : "▶"}</div>
                </div>
                {selectedFormation?.id === formation.id && (
                  <div className={styles["formation-card-details"]}>
                    <h5 className={styles["formation-card-details-title"]}>Spelarpositioner:</h5>
                    <div className={styles["formation-card-details-list"]}>
                      {formation.players.map((player, index) => (
                        <div key={index} className={styles["formation-card-details-item"]}>
                          • Linje {player.line}: {player.position} (#{player.playerId})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {currentSection === "tactics" && (
        <div>
          <div className={styles.grid}>
            {matchPlan.tactics.map(tactic => (
              <div
                key={tactic.id}
                className={`${styles.card} ${styles["tactic-card"]}`}
              >
                <div className={styles["tactic-card-header"]}>
                  <h4 className={styles["tactic-card-title"]}>📋 {tactic.title}</h4>
                  <div className={styles["tactic-card-priority"]}>{tactic.priority === "high" ? "HÖG" : tactic.priority === "medium" ? "MEDEL" : "LÅG"}</div>
                </div>
                <div className={styles["tactic-card-category"]}>Kategori: {tactic.category}</div>
                <p className={styles["tactic-card-desc"]}>{tactic.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {currentSection === "instructions" && (
        <div>
          {Object.keys(matchPlan.playerInstructions).length > 0 ? (
            <div className={styles["instructions-list"]}>
              {Object.entries(matchPlan.playerInstructions).map(([playerId, instruction]) => (
                <div key={playerId} className={`${styles.card} ${styles["instructions-card"]}`}>
                  <h4 className={styles["instructions-card-title"]}>👤 Spelare #{playerId}</h4>
                  <p className={styles["instructions-card-desc"]}>{instruction}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className={`${styles.card} ${styles["instructions-empty"]}`}>
              <div className={styles["instructions-empty-icon"]}>📝</div>
              <p>Inga individuella spelarinstruktioner tillgängliga</p>
            </div>
          )}
          {/* Specialspel */}
          {matchPlan.specialPlays.length > 0 && (
            <div className={`${styles.card} ${styles["special-plays-card"]}`}>
              <h3 className={styles["special-plays-title"]}>⚡ Specialspel</h3>
              <ul className={styles["special-plays-list"]}>
                {matchPlan.specialPlays.map((play, index) => (
                  <li key={index} className={styles["special-plays-list-item"]}>{play}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaybookView;
