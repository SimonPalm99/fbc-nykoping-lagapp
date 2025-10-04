import React, { useState } from "react";
import styles from "./LiveStats.module.css";

const eventTypes = [
  { key: "goal", label: "Mål", color: "#22c55e" },
  { key: "assist", label: "Assist", color: "#FFD600" },
  { key: "penalty", label: "Utvisning", color: "#FF5252" },
  { key: "shot", label: "Skott", color: "#2196F3" },
  { key: "turnover", label: "Bolltapp", color: "#222" },
];

const LiveStats: React.FC = () => {
  const [events, setEvents] = useState<Array<{ type: string; time: string; player?: string }>>([]);
  const [player, setPlayer] = useState("");

  // Logga händelse
  const logEvent = (type: string) => {
    setEvents(ev => [
      { type, time: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), player },
      ...ev
    ]);
    setPlayer("");
  };

  // Statistik summering
  const stats = eventTypes.reduce((acc, et) => {
    acc[et.key] = events.filter(e => e.type === et.key).length;
    return acc;
  }, {} as Record<string, number>);

  // Spara statistik (demo)
  const saveStats = () => {
    localStorage.setItem('liveStats', JSON.stringify(events));
    alert('Statistik sparad!');
  };

  return (
    <div className={styles.livestatsRoot}>
      <div className={styles.livestatsControls}>
        {eventTypes.map(et => (
          <button
            key={et.key}
            onClick={() => logEvent(et.key)}
            className={
              styles.livestatsBtn + ' ' +
              (et.key === 'goal' ? styles.livestatsBtnGoal : '') +
              (et.key === 'assist' ? styles.livestatsBtnAssist : '') +
              (et.key === 'penalty' ? styles.livestatsBtnPenalty : '') +
              (et.key === 'shot' ? styles.livestatsBtnShot : '')
            }
          >
            {et.label}
          </button>
        ))}
        <input
          type="text"
          value={player}
          onChange={e => setPlayer(e.target.value)}
          placeholder="Spelare (valfritt)"
          className={styles.livestatsInput}
        />
        <button
          onClick={saveStats}
          className={styles.livestatsBtn + ' ' + styles.livestatsBtnExport}
        >Spara</button>
      </div>
      {/* Statistik summering */}
      <div className={styles.livestatsSummary}>
        {eventTypes.map(et => (
          <div
            key={et.key}
            className={
              styles.livestatsSummaryBox + ' ' +
              (et.key === 'goal' ? styles.livestatsBtnGoal : '') +
              (et.key === 'assist' ? styles.livestatsBtnAssist : '') +
              (et.key === 'penalty' ? styles.livestatsBtnPenalty : '') +
              (et.key === 'shot' ? styles.livestatsBtnShot : '')
            }
          >
            <div className={styles.livestatsSummaryLabel}>{et.label}</div>
            <div className={styles.livestatsSummaryValue}>{stats[et.key]}</div>
          </div>
        ))}
      </div>
      {/* Loggade händelser */}
      <div className={styles.livestatsLog}>
        <div className={styles.livestatsLogTitle}>Loggade händelser</div>
        <ul className={styles.livestatsLogList}>
          {events.map((ev, i) => {
            const et = eventTypes.find(e => e.key === ev.type);
            return (
              <li key={i} className={styles.livestatsLogItem}>
                <span
                  className={
                    et?.key === 'goal' ? styles.livestatsLogTypeGoal :
                    et?.key === 'assist' ? styles.livestatsLogTypeAssist :
                    et?.key === 'penalty' ? styles.livestatsLogTypePenalty :
                    et?.key === 'shot' ? styles.livestatsLogTypeShot :
                    et?.key === 'turnover' ? styles.livestatsLogTypeTurnover : ''
                  }
                >
                  {et?.label}
                </span>
                {ev.player && <span>({ev.player})</span>} <span className={styles.livestatsLogTime}>{ev.time}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default LiveStats;
