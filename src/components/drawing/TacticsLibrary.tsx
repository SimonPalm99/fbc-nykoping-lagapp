import React, { useState } from "react";
import styles from "./TacticsLibrary.module.css";
import { TacticDrawing, DrawingTemplate } from "../../types/tactics";
import { useAuth } from "../../context/AuthContext";

interface Props {
  tactics: TacticDrawing[];
  templates: DrawingTemplate[];
  onSelectTactic: (tactic: TacticDrawing) => void;
  onCreateNew: () => void;
  onDeleteTactic: (tacticId: string) => void;
  onTemplateSelect: (template: DrawingTemplate) => void;
}

const TacticsLibrary: React.FC<Props> = ({
  tactics,
  templates,
  onSelectTactic,
  onCreateNew,
  onDeleteTactic,
  onTemplateSelect
}) => {
  const { isLeader } = useAuth();
  const [activeTab, setActiveTab] = useState<"tactics" | "templates">("tactics");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTactics = tactics.filter(tactic => {
    const matchesSearch = tactic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tactic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || tactic.category === filterCategory;
    const matchesType = filterType === "all" || tactic.type === filterType;
    const canView = isLeader() || tactic.sharedWith.length > 0;
    
    return matchesSearch && matchesCategory && matchesType && canView;
  });

  const filteredTemplates = templates.filter(template => {
    return template.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.libraryRoot}>
      <div className={styles.header}>
        <h2 className={styles.title}>📚 Taktikbibliotek</h2>
        {isLeader() && (
          <button onClick={onCreateNew} className={styles.addButton}>
            ➕ Ny taktik
          </button>
        )}
      </div>

      {/* Flikar */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("tactics")}
          className={activeTab === "tactics" ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton}
        >
          🎯 Taktiker ({filteredTactics.length})
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={activeTab === "templates" ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton}
        >
          📋 Mallar ({filteredTemplates.length})
        </button>
      </div>

      {/* Sökfält och filter */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Sök taktiker..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        
        {activeTab === "tactics" && (
          <>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={styles.select}
              title="Filtrera på kategori"
            >
              <option value="all">Alla kategorier</option>
              <option value="offense">Anfall</option>
              <option value="defense">Försvar</option>
              <option value="special_teams">Speciallag</option>
              <option value="general">Allmänt</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={styles.select}
              title="Filtrera på typ"
            >
              <option value="all">Alla typer</option>
              <option value="formation">Formation</option>
              <option value="powerplay">Powerplay</option>
              <option value="penalty">Boxplay</option>
              <option value="faceoff">Nedsläpp</option>
              <option value="exercise">Övning</option>
              <option value="play">Spelplan</option>
            </select>
          </>
        )}
      </div>

      {/* Innehåll */}
      {activeTab === "tactics" ? (
        <div className={styles.tacticsGrid}>
          {filteredTactics.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Inga taktiker hittades</p>
              {isLeader() && (
                <button
                  onClick={onCreateNew}
                  className={styles.createButton}
                >
                  Skapa första taktiken
                </button>
              )}
            </div>
          ) : (
            filteredTactics.map(tactic => (
              <div
                key={tactic.id}
                className={styles.tacticCard}
                onClick={() => onSelectTactic(tactic)}
                tabIndex={0}
                onMouseEnter={e => styles.tacticCardHover && e.currentTarget.classList.add(styles.tacticCardHover)}
                onMouseLeave={e => styles.tacticCardHover && e.currentTarget.classList.remove(styles.tacticCardHover)}
              >
                <div className={styles.tacticCardHeader}>
                  <h3 className={styles.tacticTitle}>{tactic.title}</h3>
                  {isLeader() && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteTactic(tactic.id);
                      }}
                      className={styles.deleteButton}
                    >
                      🗑️
                    </button>
                  )}
                </div>

                <p className={styles.tacticDescription}>
                  {tactic.description || "Ingen beskrivning"}
                </p>

                <div className={styles.tacticTags}>
                  <span className={styles.categoryTag + ' ' + getCategoryBgClass(tactic.category)}>
                    {getCategoryLabel(tactic.category)}
                  </span>
                  <span className={styles.typeTag}>
                    {getTypeLabel(tactic.type)}
                  </span>
                </div>

                <div className={styles.tacticMeta}>
                  <span>Av: {tactic.createdBy}</span>
                  <span>{new Date(tactic.updatedAt).toLocaleDateString()}</span>
                </div>

                {!isLeader() && tactic.sharedWith.length > 0 && (
                  <div className={styles.sharedTag}>
                    📤 Delad med dig
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className={styles.templatesGrid}>
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className={styles.templateCard}
              onClick={() => onTemplateSelect(template)}
              tabIndex={0}
              onMouseEnter={e => styles.templateCardHover && e.currentTarget.classList.add(styles.templateCardHover)}
              onMouseLeave={e => styles.templateCardHover && e.currentTarget.classList.remove(styles.templateCardHover)}


            >
              <div className={styles.templateIcon}>
                {getTemplateIcon(template.category)}
              </div>
              <h4 className={styles.templateTitle}>{template.name}</h4>
              <p className={styles.templateDescription}>{template.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper functions

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "offense": return "Anfall";
    case "defense": return "Försvar";
    case "special_teams": return "Speciallag";
    default: return "Allmänt";
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "formation": return "Formation";
    case "powerplay": return "Powerplay";
    case "penalty": return "Boxplay";
    case "faceoff": return "Nedsläpp";
    case "exercise": return "Övning";
    case "play": return "Spelplan";
    default: return "Allmänt";
  }
};

const getTemplateIcon = (category: string) => {
  switch (category) {
    case "field": return "🏒";
    case "zones": return "⬜";
    case "formations": return "👥";
    case "symbols": return "🔶";
    default: return "📋";
  }
};


export default TacticsLibrary;

// Dynamisk klass för kategori-bakgrund
function getCategoryBgClass(category: string) {
  switch (category) {
    case "offense": return styles.bgOffense;
    case "defense": return styles.bgDefense;
    case "special_teams": return styles.bgSpecialTeams;
    default: return styles.bgGeneral;
  }
}
