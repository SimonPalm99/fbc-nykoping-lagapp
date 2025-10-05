
import styles from "./MatchPlanCreator.module.css";
import { useState } from "react";
import { useToast } from "../ui/Toast";

interface MatchPlanCreatorProps {
  matchId: string | null;
  initialMatchTitle: string;
  initialOpponent: string;
  initialDate: string;
  initialVenue: string;
  onSave: (plan: any) => void;
  onCancel: () => void;
}

interface Formation {
  id: string;
  name: string;
  type: "5v5" | "powerplay" | "penalty" | "faceoff";
  description?: string;
  isDefault?: boolean;
  players: { line: number }[];
}

const MatchPlanCreator: React.FC<MatchPlanCreatorProps> = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [currentTab] = useState<string>("formations");
  const [tactics, setTactics] = useState<any[]>([]);
  const toast = useToast();

  const handleDeleteFormation = (id: string) => {
    setFormations(prev => prev.filter(f => f.id !== id));
    toast?.info("Formation borttagen");
  };

  const handleDeleteTactic = (id: string) => {
    setTactics(prev => prev.filter(t => t.id !== id));
    toast?.info("Taktisk instruktion borttagen");
  };

  const handleUpdateTactic = (id: string, updates: any) => {
    setTactics(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  return (
    <div>
      {/* Formationer */}
      {currentTab === "formations" && (
        <div>
          <div>
            {formations.map(formation => (
              <div key={formation.id} className={styles["formationer-kort"]}>
                <div className={styles["formationer-kort-header"]}>
                  <span>{formation.name}</span>
                  <button
                    onClick={() => handleDeleteFormation(formation.id)}
                    className={styles["formationer-kort-radera-btn"]}
                  >🗑️</button>
                </div>
                <div className={styles["formationer-kort-spelare"]}>{formation.players.length} spelare</div>
                {formation.description && (
                  <p className={styles["formationer-kort-beskrivning"]}>
                    "{formation.description}"
                  </p>
                )}
                <div className={styles["formationer-kort-linjer"]}>
                  {Object.entries(
                    formation.players.reduce((acc, p) => {
                      acc[p.line] = (acc[p.line] || 0) + 1;
                      return acc;
                    }, {} as Record<number, number>)
                  ).map(([line, count]) => (
                    <span key={line} className={styles["formationer-kort-linje"]}>
                      L{line}: {count}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={styles["formationer-actions-row"]}>
            <button
              onClick={() => {
                window.open("https://ritverktyg.example.com", "_blank");
                toast?.info('Ritverktyget öppnas i ny flik');
              }}
            >Ritverktyg</button>
          </div>
        </div>
      )}

      {/* Taktiska instruktioner */}
      {currentTab === "tactics" && (
        <div>
          <div className={styles["tactic-list"]}>
            {tactics.map(tactic => (
              <div
                key={tactic.id}
                className={
                  `${styles["tactic-card"]} ` +
                  (tactic.priority === "high"
                    ? styles["tactic-card-high"]
                    : tactic.priority === "medium"
                    ? styles["tactic-card-medium"]
                    : styles["tactic-card-low"])
                }
              >
                <div className={styles["tactic-card-grid"]}>
                  <div>
                    <input
                      type="text"
                      value={tactic.title}
                      onChange={e => handleUpdateTactic(tactic.id, { title: e.target.value })}
                      placeholder="Titel på instruktionen..."
                      className={styles["tactic-title-input"]}
                    />
                    <textarea
                      value={tactic.description}
                      onChange={e => handleUpdateTactic(tactic.id, { description: e.target.value })}
                      placeholder="Detaljerad beskrivning av instruktionen..."
                      rows={3}
                      className={styles["tactic-desc-textarea"]}
                    />
                    <div className={styles["tactic-row"]}>
                      <select
                        value={tactic.priority}
                        onChange={e => handleUpdateTactic(tactic.id, { priority: e.target.value as any })}
                        className={styles["matchplan-select"]}
                        title="Prioritet"
                      >
                        <option value="low">Låg prioritet</option>
                        <option value="medium">Medel prioritet</option>
                        <option value="high">Hög prioritet</option>
                      </select>
                      <select
                        value={tactic.category}
                        onChange={e => handleUpdateTactic(tactic.id, { category: e.target.value as any })}
                        className={styles["matchplan-category-select"]}
                        title="Kategori"
                      >
                        <option value="general">Allmänt</option>
                        <option value="offense">Anfall</option>
                        <option value="defense">Försvar</option>
                        <option value="special_teams">Specialteams</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTactic(tactic.id)}
                    className={styles["tactic-delete-btn"]}
                  >🗑️ Ta bort</button>
                </div>
              </div>
            ))}
            {tactics.length === 0 && (
              <div className={styles["tactic-empty"]}>
                <div className={styles["tactic-empty-icon"]}>📋</div>
                <h3>Inga taktiska instruktioner ännu</h3>
                <p>Lägg till instruktioner för att ge laget riktlinjer</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spelare */}
      {currentTab === "players" && (
        <div>
          <h3>👥 Spelare & individuella instruktioner</h3>
          {/* TODO: Add player instructions UI here */}
        </div>
      )}
    </div>
  );
}

export default MatchPlanCreator;
