import React, { useState } from "react";
import styles from "./MatchStats.module.css";
import { StatisticEvent } from "../../types/statistics";

interface Props {
  events: StatisticEvent[];
  players: Array<{
    id: string;
    name: string;
    jerseyNumber: number;
    position: string;
    isGoalkeeper: boolean;
  }>;
  onVideoLink?: (eventId: string, videoUrl: string, timestamp: string) => void;
}


interface PlayerStats {
  userId: string;
  name: string;
  jerseyNumber: number;
  position: string;
  goals: number;
  assists: number;
  gamesPlayed: number;
  penalties: number;
  blocks: number;
  shots: number;
  saves: number;
  shotPercentage: number;
  timeOnIce: number;
  plusMinus: number;
  savePercentage?: number;
}


export const MatchStats: React.FC<Props> = ({ events, players, onVideoLink }) => {
  // State hooks
  const [selectedTab, setSelectedTab] = useState<"overview" | "players" | "events" | "formations">("overview");
  // Removed unused selectedPlayer state
  // Removed unused videoLinkModal state
  // Removed unused videoUrl state
  // Removed unused videoTimestamp state

  // Beräknar statistik för varje spelare
  function beräknaSpelarstatistik(players: Props['players'], events: Props['events']): PlayerStats[] {
    return players.map(player => {
      const playerEvents = events.filter(e => e.userId === player.id);
      const mål = playerEvents.filter(e => e.type === "mål").length;
      const assist = playerEvents.filter(e => e.type === "assist").length;
      const skott = playerEvents.filter(e => e.type === "skott").length;
      const räddningar = playerEvents.filter(e => e.type === "räddning").length;
      const block = playerEvents.filter(e => e.type === "block").length;
      const utvisning = playerEvents.filter(e => e.type === "utvisning").length;
      const plusMinus = 0; // Förenklad, kan utökas
      return {
        userId: player.id,
        name: player.name,
        jerseyNumber: player.jerseyNumber,
        position: player.position,
        goals: mål,
        assists: assist,
        gamesPlayed: 1,
        penalties: utvisning,
        blocks: block,
        shots: skott + mål,
        saves: räddningar,
        shotPercentage: (skott + mål) > 0 ? (mål / (skott + mål)) * 100 : 0,
        savePercentage: player.isGoalkeeper && räddningar > 0 ? (räddningar / (räddningar + mål)) * 100 : 0,
        timeOnIce: 0,
        plusMinus: plusMinus
      };
    });
  }

  const spelarstatistik = beräknaSpelarstatistik(players, events);

  // Huvudrendering
  return (
    <>
      {/* Tabbar för att byta vy */}
      <div className={styles.tabbar}>
        <button className={selectedTab === "overview" ? styles.tabAktiv : styles.tab} onClick={() => setSelectedTab("overview")}>Översikt</button>
        <button className={selectedTab === "players" ? styles.tabAktiv : styles.tab} onClick={() => setSelectedTab("players")}>Spelare</button>
        <button className={selectedTab === "events" ? styles.tabAktiv : styles.tab} onClick={() => setSelectedTab("events")}>Händelser</button>
        <button className={selectedTab === "formations" ? styles.tabAktiv : styles.tab} onClick={() => setSelectedTab("formations")}>Formationer</button>
      </div>

      {/* Spelarstatistik */}
      {selectedTab === "players" && (
        <div className={styles.spelareTabellWrapper}>
          <table className={styles.spelareTabell}>
            <thead>
              <tr className={styles.spelareTabellHeader}>
                <th className={styles.spelareTabellHeaderCell}>#</th>
                <th className={styles.spelareTabellHeaderCell}>Spelare</th>
                <th className={styles.spelareTabellHeaderCellCenter}>Mål</th>
                <th className={styles.spelareTabellHeaderCellCenter}>Assist</th>
                <th className={styles.spelareTabellHeaderCellCenter}>Poäng</th>
                <th className={styles.spelareTabellHeaderCellCenter}>Skott</th>
                <th className={styles.spelareTabellHeaderCellCenter}>Skott%</th>
                <th className={styles.spelareTabellHeaderCellCenter}>Block</th>
                <th className={styles.spelareTabellHeaderCellCenter}>Utv</th>
              </tr>
            </thead>
            <tbody>
              {spelarstatistik
                .sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists))
                .map(spelare => (
                  <tr key={spelare.userId} className={styles.spelareTabellRow}>
                    <td className={styles.spelareTabellCell}>{spelare.jerseyNumber}</td>
                    <td className={styles.spelareTabellCell}>
                      <div>
                        <div className={styles.spelareNamn}>{spelare.name}</div>
                        <div className={styles.spelarePosition}>{spelare.position}</div>
                      </div>
                    </td>
                    <td className={styles.spelareTabellCellCenter + " " + styles.spelareMal}>{spelare.goals}</td>
                    <td className={styles.spelareTabellCellCenter + " " + styles.spelareAssist}>{spelare.assists}</td>
                    <td className={styles.spelareTabellCellCenter + " " + styles.spelarePoang}>{spelare.goals + spelare.assists}</td>
                    <td className={styles.spelareTabellCellCenter}>{spelare.shots}</td>
                    <td className={styles.spelareTabellCellCenter}>{spelare.shotPercentage.toFixed(1)}%</td>
                    <td className={styles.spelareTabellCellCenter}>{spelare.blocks}</td>
                    <td className={styles.spelareTabellCellCenter + " " + styles.spelareUtvisning}>{spelare.penalties}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* Målvaktsstatistik */}
          {spelarstatistik.some(s => s.saves && s.saves > 0) && (
            <div className={styles.malvaktStatistikBox}>
              <h4 className={styles.malvaktRubrik}>🥅 Målvaktsstatistik:</h4>
              {spelarstatistik
                .filter(s => s.saves && s.saves > 0)
                .map(mv => (
                  <div key={mv.userId} className={styles.malvaktRad}>
                    <span>#{mv.jerseyNumber} {mv.name}</span>
                    <span>{mv.saves} räddningar ({mv.savePercentage?.toFixed(1)}%)</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Händelser */}
      {selectedTab === "events" && (
        <div className={styles.handelserWrapper}>
          <h4 className={styles.handelserRubrik}>⏱️ Händelseförloppning:</h4>
          {events.length === 0 ? (
            <p className={styles.handelserTom}>Inga händelser registrerade</p>
          ) : (
            <div className={styles.handelserLista}>
              {events.map(event => {
                const spelare = players.find(p => p.id === event.userId);
                return (
                  <div key={event.id} className={styles.handelserRad + (event.videoTimestamp ? " " + styles.handelserVideo : "") }>
                    <div className={styles.handelserInfo}>
                      <span className={styles.handelserTid}>{event.time}</span>
                      <span className={styles.handelserTyp}>{event.type}</span>
                      <span className={styles.handelserSpelare}>#{spelare?.jerseyNumber} {spelare?.name}</span>
                      {event.videoTimestamp && (
                        <span className={styles.handelserVideoIcon}>📹 VIDEO</span>
                      )}
                    </div>
                    {event.comment && (
                      <div className={styles.handelserKommentar}>
                        "{event.comment}"
                      </div>
                    )}
                    <div className={styles.handelserActions}>
                      {!event.videoTimestamp && onVideoLink && (
                        <button
                          className={styles.handelserVideoBtn}
                          onClick={() => onVideoLink(event.id, "", event.time)}
                        >
                          📹 Länka video
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}

