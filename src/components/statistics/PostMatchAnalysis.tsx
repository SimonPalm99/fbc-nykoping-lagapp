import React, { useState } from "react";
import { StatisticEvent } from "../../types/statistics";
import { MatchStats } from "./MatchStats";
import styles from "./PostMatchAnalysis.module.css";

interface Props {
  matchId: string;
  matchTitle: string;
  matchDate: string;
  opponent: string;
  finalScore: { home: number; away: number };
  events: StatisticEvent[];
  players: Array<{
    id: string;
    name: string;
    jerseyNumber: number;
    position: string;
    isGoalkeeper: boolean;
  }>;
  onExportReport?: (matchId: string) => void;
}

const PostMatchAnalysis: React.FC<Props> = ({
  matchId,
  matchTitle,
  matchDate,
  opponent,
  finalScore,
  events,
  players,
  onExportReport
}) => {
  const [selectedTab, setSelectedTab] = useState<"summary" | "detailed" | "video">("summary");

  // Beräkna matchsammanfattning
  const matchSummary = {
    duration: "60:00", // Detta skulle komma från faktiska data
    goals: events.filter(e => e.type === "mål").length,
    shots: events.filter(e => e.type === "skott" || e.type === "mål").length,
    saves: events.filter(e => e.type === "räddning").length,
    penalties: events.filter(e => e.type === "utvisning").length,
    powerplayGoals: events.filter(e => e.type === "mål" && e.onIce && e.onIce.length > 10).length,
    powerplayChances: events.filter(e => e.type === "utvisning").length,
    mvp: events.length > 0 ? getMatchMVP() : null
  };

  function getMatchMVP() {
    const playerStats = players.map(player => {
      const playerEvents = events.filter(e => e.userId === player.id);
      const goals = playerEvents.filter(e => e.type === "mål").length;
      const assists = playerEvents.filter(e => e.type === "assist").length;
      const points = goals + assists;
      
      return {
        ...player,
        points,
        goals,
        assists
      };
    });

    return playerStats.reduce((prev, current) => 
      (prev.points > current.points) ? prev : current
    );
  }

  const videoEvents = events.filter(e => e.videoTimestamp);

  const tabs = [
    { id: "summary", name: "Sammanfattning", icon: "📊" },
    { id: "detailed", name: "Detaljerat", icon: "📋" },
    { id: "video", name: `Video (${videoEvents.length})`, icon: "🎥" }
  ];

  return (
    <div className={styles["postmatch-root"]}>
      {/* Header */}
      <div className={styles["postmatch-header"]}>
        <div>
          <h2 className={styles["postmatch-title"]}>{matchTitle}</h2>
          <div className={styles["postmatch-date"]}>{new Date(matchDate).toLocaleDateString("sv-SE")} vs {opponent}</div>
          <div className={
            styles["postmatch-score"] + " " + (
              finalScore.home > finalScore.away ? styles["postmatch-score-win"] :
              finalScore.home < finalScore.away ? styles["postmatch-score-loss"] :
              styles["postmatch-score-draw"]
            )
          }>
            {finalScore.home} - {finalScore.away}
            <span className={styles["postmatch-score-status"]}>
              {finalScore.home > finalScore.away ? "(Vinst)" : 
               finalScore.home < finalScore.away ? "(Förlust)" : "(Oavgjort)"}
            </span>
          </div>
        </div>

        <div className={styles["postmatch-actions"]}>
          {onExportReport && (
            <button
              onClick={() => onExportReport(matchId)}
              className={styles["postmatch-export-btn"]}
            >
              📄 Exportera rapport
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles["postmatch-tabs"]}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={
              styles["postmatch-tab-btn"] + (selectedTab === tab.id ? " " + styles["postmatch-tab-btn-active"] : "")
            }
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Sammanfattning */}
      {selectedTab === "summary" && (
        <div>
          {/* Snabbstatistik */}
          <div className={styles["postmatch-summary-grid"]}>
            <div className={styles["postmatch-summary-box"]}>
              <div className={styles["postmatch-summary-value"] + " " + styles["postmatch-summary-goals"]}>{matchSummary.goals}</div>
              <div className={styles["postmatch-summary-label"]}>Mål</div>
            </div>
            <div className={styles["postmatch-summary-box"]}>
              <div className={styles["postmatch-summary-value"] + " " + styles["postmatch-summary-shots"]}>{matchSummary.shots}</div>
              <div className={styles["postmatch-summary-label"]}>Skott</div>
            </div>
            <div className={styles["postmatch-summary-box"]}>
              <div className={styles["postmatch-summary-value"] + " " + styles["postmatch-summary-saves"]}>{matchSummary.saves}</div>
              <div className={styles["postmatch-summary-label"]}>Räddningar</div>
            </div>
            <div className={styles["postmatch-summary-box"]}>
              <div className={styles["postmatch-summary-value"] + " " + styles["postmatch-summary-penalties"]}>{matchSummary.penalties}</div>
              <div className={styles["postmatch-summary-label"]}>Utvisningar</div>
            </div>
          </div>

          {/* MVP och Nyckelspelare */}
          {matchSummary.mvp && (
            <div className={styles["postmatch-mvp"]}>
              <h3 className={styles["postmatch-mvp-title"]}>🏆 Match MVP</h3>
              <div className={styles["postmatch-mvp-box"]}>
                <div className={styles["postmatch-mvp-avatar"]}>#{matchSummary.mvp.jerseyNumber}</div>
                <div>
                  <div className={styles["postmatch-mvp-name"]}>{matchSummary.mvp.name}</div>
                  <div className={styles["postmatch-mvp-position"]}>{matchSummary.mvp.position}</div>
                  <div className={styles["postmatch-mvp-points"]}>{matchSummary.mvp.goals} mål, {matchSummary.mvp.assists} assist = {matchSummary.mvp.points} poäng</div>
                </div>
              </div>
            </div>
          )}

          {/* Specialteams */}
          <div className={styles["postmatch-specialteams"]}>
            <h3 className={styles["postmatch-specialteams-title"]}>⚡ Specialteams</h3>
            <div className={styles["postmatch-specialteams-grid"]}>
              <div>
                <div className={styles["postmatch-specialteams-box"]}>
                  <span>Powerplay-mål</span>
                  <span className={styles["postmatch-specialteams-goals"]}>{matchSummary.powerplayGoals}</span>
                </div>
                <div className={styles["postmatch-specialteams-box"] + " " + styles["postmatch-specialteams-box-margin"]}>
                  <span>Powerplay-chanser</span>
                  <span className={styles["postmatch-specialteams-chances"]}>{matchSummary.powerplayChances}</span>
                </div>
              </div>
              <div>
                <div className={styles["postmatch-specialteams-box"]}>
                  <span>PP-effektivitet</span>
                  <span className={styles["postmatch-specialteams-eff"]}>{matchSummary.powerplayChances > 0 ? ((matchSummary.powerplayGoals / matchSummary.powerplayChances) * 100).toFixed(1) + "%" : "0%"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tidslinje med viktiga händelser */}
          <div className={styles["postmatch-timeline"]}>
            <h3 className={styles["postmatch-timeline-title"]}>📅 Matchens viktiga händelser</h3>
            <div className={styles["postmatch-timeline-list"]}>
              {events
                .filter(e => e.type === "mål" || e.type === "utvisning")
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(event => {
                  const player = players.find(p => p.id === event.userId);
                  return (
                    <div
                      key={event.id}
                      className={
                        styles["postmatch-timeline-event"] + " " + (event.type === "mål" ? styles["postmatch-timeline-event-goal"] : styles["postmatch-timeline-event-penalty"])
                      }
                    >
                      <span className={styles["postmatch-timeline-time"]}>{event.time}</span>
                      <span className={event.type === "mål" ? styles["postmatch-timeline-icon-goal"] : styles["postmatch-timeline-icon-penalty"]}>
                        {event.type === "mål" ? "⚽" : "🟨"}
                      </span>
                      <div>
                        <div className={styles["postmatch-timeline-event-info"]}>
                          {event.type === "mål" ? "MÅL" : "UTVISNING"} - #{player?.jerseyNumber} {player?.name}
                        </div>
                        {event.comment && (
                          <div className={styles["postmatch-timeline-comment"]}>{event.comment}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Detaljerad statistik */}
      {selectedTab === "detailed" && (
        <MatchStats
          events={events}
          players={players}
        />
      )}

      {/* Video-sektion */}
      {selectedTab === "video" && (
        <div>
          {videoEvents.length === 0 ? (
            <div className={styles["postmatch-video"]}>
              <div className={styles["postmatch-video-icon"]}>🎥</div>
              <h3>Inga videoklipp länkade</h3>
              <p>Länka videoklipp till händelser för att se dem här</p>
            </div>
          ) : (
            <div>
              <h3 className={styles["postmatch-video-list-title"]}>🎥 Länkade videoklipp ({videoEvents.length})</h3>
              <div className={styles["postmatch-video-list"]}>
                {videoEvents.map(event => {
                  const player = players.find(p => p.id === event.userId);
                  return (
                    <div
                      key={event.id}
                      className={styles["postmatch-video-item"]}
                    >
                      <div className={styles["postmatch-video-item-header"]}>
                        <div>
                          <span className={styles["postmatch-video-time"]}>{event.time}</span>
                          <span className={styles["postmatch-video-player"]}>
                            {event.type} - #{player?.jerseyNumber} {player?.name}
                          </span>
                        </div>
                        <span className={styles["postmatch-video-timestamp"]}>
                          📹 {event.videoTimestamp}
                        </span>
                      </div>
                      {event.comment && (
                        <div className={styles["postmatch-video-comment"]}>
                          "{event.comment}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostMatchAnalysis;
