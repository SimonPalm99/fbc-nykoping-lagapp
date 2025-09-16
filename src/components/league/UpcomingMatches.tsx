import React from "react";
import { useLeague } from "../../context/LeagueContext";
import { LeagueMatch } from "../../types/league";
import "./UpcomingMatches.css";

interface UpcomingMatchesProps {
  teamName?: string;
  maxMatches?: number;
  showAllMatches?: boolean; // Visa alla lag eller bara FBC
}

const UpcomingMatches: React.FC<UpcomingMatchesProps> = ({
  teamName = "FBC Nyköping",
  maxMatches = 5,
  showAllMatches = false
}) => {
  const { leagueData, isLoading, error } = useLeague();

  if (isLoading) {
    return (
      <div className="upcoming-matches loading">
        <h3>📅 Kommande matcher</h3>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Hämtar matchdata...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="upcoming-matches error">
        <h3>📅 Kommande matcher</h3>
        <div className="error-message">
          <p>⚠️ Kunde inte hämta matchdata</p>
        </div>
      </div>
    );
  }

  // Filtrera matcher baserat på team och visa alla eller bara FBC
  let matches = leagueData.fixtures;
  
  if (!showAllMatches && teamName) {
    matches = matches.filter(match => 
      match.homeTeam.name.toLowerCase().includes(teamName.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(teamName.toLowerCase())
    );
  }

  matches = matches.slice(0, maxMatches);

  const formatMatchDate = (dateStr: string, timeStr: string) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return "Idag";
    if (isTomorrow) return "Imorgon";
    
    return date.toLocaleDateString("sv-SE", { 
      weekday: "short", 
      day: "numeric", 
      month: "short" 
    });
  };

  const getMatchImportance = (match: LeagueMatch, teamName: string): "home" | "away" | "neutral" => {
    if (match.homeTeam.name.toLowerCase().includes(teamName.toLowerCase())) return "home";
    if (match.awayTeam.name.toLowerCase().includes(teamName.toLowerCase())) return "away";
    return "neutral";
  };

  return (
    <div className="upcoming-matches">
      <div className="matches-header">
        <h3>📅 Kommande matcher</h3>
        {!showAllMatches && (
          <span className="team-filter">{teamName}</span>
        )}
      </div>

      {matches.length === 0 ? (
        <div className="no-matches">
          <p>Inga kommande matcher hittades</p>
        </div>
      ) : (
        <div className="matches-list">
          {matches.map((match) => {
            const importance = getMatchImportance(match, teamName);
            const isLive = match.status === "live";
            const isPostponed = match.status === "postponed";

            return (
              <div 
                key={match.id} 
                className={`match-card ${importance} ${isLive ? "live" : ""} ${isPostponed ? "postponed" : ""}`}
              >
                <div className="match-status">
                  {isLive && <span className="live-indicator">🔴 LIVE</span>}
                  {isPostponed && <span className="postponed-indicator">⏸️ Uppskjuten</span>}
                  {!isLive && !isPostponed && (
                    <span className="match-round">Omgång {match.round}</span>
                  )}
                </div>

                <div className="match-date-time">
                  <span className="match-date">
                    {formatMatchDate(match.date, match.time)}
                  </span>
                  <span className="match-time">{match.time}</span>
                </div>

                <div className="match-teams">
                  <div className={`team home-team ${importance === "home" ? "highlighted" : ""}`}>
                    <span className="team-name">{match.homeTeam.shortName || match.homeTeam.name}</span>
                    {importance === "home" && <span className="home-indicator">🏠</span>}
                  </div>
                  
                  <div className="match-vs">
                    <span className="vs-text">vs</span>
                  </div>
                  
                  <div className={`team away-team ${importance === "away" ? "highlighted" : ""}`}>
                    <span className="team-name">{match.awayTeam.shortName || match.awayTeam.name}</span>
                    {importance === "away" && <span className="away-indicator">✈️</span>}
                  </div>
                </div>

                <div className="match-venue">
                  <span className="venue-icon">📍</span>
                  <span className="venue-name">{match.venue}</span>
                </div>

                {match.result && isLive && (
                  <div className="live-score">
                    <span className="score">
                      {match.result.homeGoals} - {match.result.awayGoals}
                    </span>
                    {match.result.overtime && <span className="overtime">ÖT</span>}
                    {match.result.penalties && <span className="penalties">STR</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingMatches;
