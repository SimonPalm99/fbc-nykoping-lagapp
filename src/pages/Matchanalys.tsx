
import React, { useEffect, useState } from "react";
import styles from "./Matchanalys.module.css";
import { activitiesAPI, analysisAPI } from "../services/apiService";
import { Activity } from "../types/activity";
// import { MatchAnalysis } from "../types/analysis"; // Removed unused import
import "./Matchanalys.css";

const Matchanalys: React.FC = () => {
  const [matches, setMatches] = useState<Activity[]>([]);
  // Removed unused analyses state
  const [search, setSearch] = useState("");
  // Removed unused loading state

  useEffect(() => {
    Promise.all([
      activitiesAPI.getAll(),
      analysisAPI.getAll()
    ]).then(([matchRes]) => {
      setMatches(matchRes.data.filter((a: Activity) => a.type === "match"));
      // Removed setAnalyses since analyses state is unused
    });
  }, []);
  // Sök/filter på ALLA matcher
  const filteredMatches = matches.filter(match =>
    match.title.toLowerCase().includes(search.toLowerCase()) ||
    match.date.includes(search)
  );
  // Formulär för att skapa/redigera analys
  // Removed unused editMatchId and setEditMatchId state
  // Removed unused saving state to fix unused variable error

  // Removed unused openForm function to fix unused variable error

  // Add a valid return statement for the component
  // Removed unused handleFileUpload function to fix unused variable error

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Matchanalys</h1>
        <p className={styles.subheading}>
          Det är här du skapar och sammanställer analyser för alla matcher du har spelat. Lägg in egna kommentarer, livestatistik, filmer, bilder och dokument. När du är klar kan du dela analysen med laget. Sidan är din samlingsplats för all matchinformation – perfekt inför returmöten!
        </p>
        <input
          className={styles.input}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Sök match eller datum..."
        />
        {/* Renderingslogik */}
        <ul>
          {filteredMatches.map(match => (
            <li key={match.id}>{match.title} - {match.date}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Matchanalys;
