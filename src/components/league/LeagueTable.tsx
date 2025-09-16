import React from "react";
import { useLeague } from "../../context/LeagueContext";
import "./LeagueTable.css";

interface LeagueTableProps {
  highlightTeam?: string; // Team att highlighta (t.ex. "FBC Nyköping")  
  showStats?: boolean; // Visa extra statistik
  maxEntries?: number; // Begränsa antal rader
}

const LeagueTable: React.FC<LeagueTableProps> = ({ 
  highlightTeam = "FBC Nyköping", 
  showStats = true,
  maxEntries 
}) => {
  const { leagueData, isLoading, error, refreshLeagueData, lastUpdated: contextLastUpdated, isOnline } = useLeague();

  if (isLoading) {
    return (
      <div className="league-table loading">
        <div className="table-header">
          <h3>📊 {leagueData.table.leagueName} - {leagueData.table.division}</h3>
          {!isOnline && <span className="offline-indicator">📶 Offline</span>}
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Hämtar tabelldata...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="league-table error">
        <div className="table-header">
          <h3>📊 Ligatabell</h3>
          {!isOnline && <span className="offline-indicator">📶 Offline</span>}
        </div>
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={refreshLeagueData} className="retry-button" disabled={!isOnline}>
            🔄 {isOnline ? 'Försök igen' : 'Väntar på anslutning'}
          </button>
        </div>
      </div>
    );
  }

  const entries = maxEntries 
    ? leagueData.table.entries.slice(0, maxEntries)
    : leagueData.table.entries;

  const lastUpdatedText = contextLastUpdated 
    ? contextLastUpdated.toLocaleString("sv-SE", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      })
    : new Date(leagueData.table.lastUpdated).toLocaleString("sv-SE", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });

  return (
    <div className="league-table">
      <div className="table-header">
        <div className="header-title">
          <h3>📊 {leagueData.table.leagueName} - {leagueData.table.division}</h3>
          <span className="season">{leagueData.table.season}</span>
        </div>
        <div className="header-info">
          <span className="round">Omgång {leagueData.table.round}</span>
          <span className="last-updated">Uppdaterad: {lastUpdatedText}</span>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="pos">#</th>
              <th className="team">Lag</th>
              <th className="played">M</th>
              <th className="points">P</th>
              {showStats && (
                <>
                  <th className="wins">V</th>
                  <th className="draws">O</th>
                  <th className="losses">F</th>
                  <th className="goals">GM-IM</th>
                </>
              )}
              <th className="form">Form</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const isHighlighted = entry.team.name.toLowerCase().includes(highlightTeam.toLowerCase());
              const positionClass = entry.position <= 2 ? "promotion" : 
                                  entry.position >= entries.length - 1 ? "relegation" : "";

              return (
                <tr 
                  key={entry.team.id} 
                  className={`table-row ${isHighlighted ? "highlighted" : ""} ${positionClass}`}
                >
                  <td className="pos">
                    <span className="position">{entry.position}</span>
                    {entry.trend === "up" && <span className="trend up">↗</span>}
                    {entry.trend === "down" && <span className="trend down">↘</span>}
                  </td>
                  <td className="team">
                    <div className="team-info">
                      <span className="team-name">{entry.team.shortName || entry.team.name}</span>
                      {isHighlighted && <span className="team-badge">🏠</span>}
                    </div>
                  </td>
                  <td className="played">{entry.played}</td>
                  <td className="points">
                    <strong>{entry.points}</strong>
                  </td>
                  {showStats && (
                    <>
                      <td className="wins">{entry.wins}</td>
                      <td className="draws">{entry.draws}</td>
                      <td className="losses">{entry.losses}</td>
                      <td className="goals">
                        <span className="goals-detail">
                          {entry.goalsFor}-{entry.goalsAgainst}
                          <small className="goal-diff">
                            ({entry.goalDifference >= 0 ? "+" : ""}{entry.goalDifference})
                          </small>
                        </span>
                      </td>
                    </>
                  )}
                  <td className="form">
                    <div className="form-indicators">
                      {entry.form.slice(-5).map((result, index) => (
                        <span 
                          key={index} 
                          className={`form-result ${result.toLowerCase()}`}
                          title={result === "W" ? "Vinst" : result === "D" ? "Oavgjort" : "Förlust"}
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {maxEntries && leagueData.table.entries.length > maxEntries && (
        <div className="table-footer">
          <p className="more-info">
            Visar {maxEntries} av {leagueData.table.entries.length} lag
          </p>
        </div>
      )}

      <div className="table-legend">
        <div className="legend-item promotion">
          <span className="legend-color"></span>
          <span>Uppflyttning</span>
        </div>
        <div className="legend-item relegation">
          <span className="legend-color"></span>
          <span>Nedflyttning</span>
        </div>
        <div className="legend-abbreviations">
          <small>
            M = Matcher, P = Poäng, V = Vinster, O = Oavgjort, F = Förluster, 
            GM = Gjorda mål, IM = Insläppta mål
          </small>
        </div>
      </div>

      <button 
        onClick={refreshLeagueData} 
        className="refresh-button"
        disabled={isLoading || !isOnline}
      >
        🔄 {isLoading ? 'Uppdaterar...' : !isOnline ? 'Offline' : 'Uppdatera tabell'}
      </button>
    </div>
  );
};

export default LeagueTable;
