import React, { useState } from "react";

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
    <div style={{ width: '100%', minHeight: 320 }}>
      <div style={{ display:'flex', gap:'1rem', marginBottom:'1rem', flexWrap:'wrap', justifyContent:'center' }}>
        {eventTypes.map(et => (
          <button key={et.key} onClick={() => logEvent(et.key)} style={{ background:et.color, color:'#fff', border:'none', borderRadius:'0.7rem', padding:'0.7rem 1.2rem', fontWeight:700, fontSize:'1rem', cursor:'pointer', boxShadow:'0 2px 8px #22c55e22' }}>{et.label}</button>
        ))}
        <input type="text" value={player} onChange={e => setPlayer(e.target.value)} placeholder="Spelare (valfritt)" style={{ padding:'0.7rem', borderRadius:'0.7rem', border:'1px solid #22c55e', fontSize:'1rem', minWidth:120 }} />
        <button onClick={saveStats} style={{ background:'#22c55e', color:'#fff', border:'none', borderRadius:'0.7rem', padding:'0.7rem 1.2rem', fontWeight:700, fontSize:'1rem', cursor:'pointer', marginLeft:'2rem' }}>Spara</button>
      </div>
      {/* Statistik summering */}
      <div style={{ display:'flex', gap:'2rem', flexWrap:'wrap', justifyContent:'center', marginBottom:'2rem' }}>
        {eventTypes.map(et => (
          <div key={et.key} style={{ background:'#fff', borderRadius:'1rem', boxShadow:'0 2px 8px #22c55e22', width:120, height:90, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'1.1rem', color:et.color, margin:'0.5rem' }}>
            <div>{et.label}</div>
            <div style={{ fontSize:'1.5rem', color:'#222', fontWeight:900 }}>{stats[et.key]}</div>
          </div>
        ))}
      </div>
      {/* Loggade händelser */}
      <div style={{ background:'#fff', borderRadius:'1rem', boxShadow:'0 2px 8px #22c55e22', padding:'1rem', marginBottom:'2rem' }}>
        <div style={{ fontWeight:700, color:'#22c55e', marginBottom:'0.7rem' }}>Loggade händelser</div>
        <ul style={{ listStyle:'none', padding:0, margin:0 }}>
          {events.map((ev, i) => (
            <li key={i} style={{ marginBottom:'0.5rem', color:'#222', fontWeight:500 }}>
              <span style={{ color:eventTypes.find(et=>et.key===ev.type)?.color, fontWeight:700 }}>{eventTypes.find(et=>et.key===ev.type)?.label}</span> {ev.player && <span>({ev.player})</span>} <span style={{ color:'#888', fontSize:'0.95rem' }}>{ev.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LiveStats;
