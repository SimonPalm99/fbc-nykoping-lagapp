import React, { useState } from "react";

// Demo-spelare
interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
}
const demoPlayers: Player[] = [
  { id: "1", name: "Anna", number: 10, position: "C" },
  { id: "2", name: "Erik", number: 7, position: "LW" },
  { id: "3", name: "Sara", number: 22, position: "RW" },
  { id: "4", name: "Johan", number: 5, position: "LD" },
  { id: "5", name: "Maja", number: 18, position: "RD" },
  { id: "6", name: "Oskar", number: 31, position: "G" },
];

const positions = ["LW", "C", "RW", "LD", "RD", "G"];

const Lineup: React.FC = () => {
  const [femma, setFemma] = useState<{ [pos: string]: Player }>({});
  const [bench, setBench] = useState<Player[]>(demoPlayers);
  const [dragged, setDragged] = useState<Player | null>(null);
  const [pp, setPP] = useState<{ [pos: string]: Player }>({});
  const [bp, setBP] = useState<{ [pos: string]: Player }>({});
  const [activeTab, setActiveTab] = useState<'femma'|'pp'|'bp'>('femma');

  // Drag/drop
  const handleDragStart = (player: any) => setDragged(player);
  const handleDrop = (pos: string) => {
    if (!dragged) return;
    if (activeTab === 'femma') setFemma(f => ({ ...f, [pos]: dragged }));
    if (activeTab === 'pp') setPP(f => ({ ...f, [pos]: dragged }));
    if (activeTab === 'bp') setBP(f => ({ ...f, [pos]: dragged }));
    setBench(b => b.filter(p => p.id !== dragged.id));
    setDragged(null);
  };
  const handleRemove = (pos: string) => {
    let player: Player | undefined;
    if (activeTab === 'femma') { player = femma[pos]; setFemma(f => { const c = { ...f }; delete c[pos]; return c; }); }
    if (activeTab === 'pp') { player = pp[pos]; setPP(f => { const c = { ...f }; delete c[pos]; return c; }); }
    if (activeTab === 'bp') { player = bp[pos]; setBP(f => { const c = { ...f }; delete c[pos]; return c; }); }
  if (player) setBench(b => [...b, player].filter((p): p is Player => !!p));
  };

  // Exportera laguppställning (demo)
  const exportLineup = () => {
    let lineup;
    if (activeTab === 'femma') lineup = femma;
    if (activeTab === 'pp') lineup = pp;
    if (activeTab === 'bp') lineup = bp;
    localStorage.setItem('lineup', JSON.stringify(lineup));
    alert('Laguppställning sparad!');
  };

  return (
    <div style={{ width: '100%', minHeight: 320 }}>
      <nav style={{ display:'flex', gap:'1rem', marginBottom:'1rem', justifyContent:'center' }}>
        <button onClick={() => setActiveTab('femma')} style={{ background:activeTab==='femma'?'#22c55e':'#222', color:'#fff', border:'none', borderRadius:'0.7rem', padding:'0.5rem 1.2rem', fontWeight:700, cursor:'pointer' }}>Femma</button>
        <button onClick={() => setActiveTab('pp')} style={{ background:activeTab==='pp'?'#FFD600':'#222', color:activeTab==='pp'?'#222':'#fff', border:'none', borderRadius:'0.7rem', padding:'0.5rem 1.2rem', fontWeight:700, cursor:'pointer' }}>PP</button>
        <button onClick={() => setActiveTab('bp')} style={{ background:activeTab==='bp'?'#2196F3':'#222', color:activeTab==='bp'?'#fff':'#fff', border:'none', borderRadius:'0.7rem', padding:'0.5rem 1.2rem', fontWeight:700, cursor:'pointer' }}>BP</button>
        <button onClick={exportLineup} style={{ background:'#22c55e', color:'#fff', border:'none', borderRadius:'0.7rem', padding:'0.5rem 1.2rem', fontWeight:700, cursor:'pointer', marginLeft:'2rem' }}>Exportera</button>
      </nav>
      <div style={{ display:'flex', gap:'2rem', flexWrap:'wrap', justifyContent:'center', marginBottom:'2rem' }}>
        {/* Positioner */}
        {positions.map(pos => (
          <div key={pos} onDrop={() => handleDrop(pos)} onDragOver={e => e.preventDefault()} style={{ background:'#fff', borderRadius:'1rem', boxShadow:'0 2px 8px #22c55e22', width:110, height:110, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'1.1rem', color:'#22c55e', margin:'0.5rem', position:'relative' }}>
            <div>{pos}</div>
            {activeTab==='femma' && femma[pos] && (
              <div draggable onDragStart={() => femma[pos] && handleDragStart(femma[pos])} style={{ background:'#22c55e', color:'#fff', borderRadius:'0.7rem', padding:'0.5rem 1rem', marginTop:'0.5rem', cursor:'grab', fontWeight:700 }}>{femma[pos]?.name} #{femma[pos]?.number}</div>
            )}
            {activeTab==='pp' && pp[pos] && (
              <div draggable onDragStart={() => pp[pos] && handleDragStart(pp[pos])} style={{ background:'#FFD600', color:'#222', borderRadius:'0.7rem', padding:'0.5rem 1rem', marginTop:'0.5rem', cursor:'grab', fontWeight:700 }}>{pp[pos]?.name} #{pp[pos]?.number}</div>
            )}
            {activeTab==='bp' && bp[pos] && (
              <div draggable onDragStart={() => bp[pos] && handleDragStart(bp[pos])} style={{ background:'#2196F3', color:'#fff', borderRadius:'0.7rem', padding:'0.5rem 1rem', marginTop:'0.5rem', cursor:'grab', fontWeight:700 }}>{bp[pos]?.name} #{bp[pos]?.number}</div>
            )}
            {(activeTab==='femma' && femma[pos]) || (activeTab==='pp' && pp[pos]) || (activeTab==='bp' && bp[pos]) ? (
              <button onClick={() => handleRemove(pos)} style={{ position:'absolute', top:8, right:8, background:'#FF5252', color:'#fff', border:'none', borderRadius:'50%', width:28, height:28, fontWeight:700, cursor:'pointer' }}>✕</button>
            ) : null}
          </div>
        ))}
      </div>
      {/* Bänk */}
      <div style={{ background:'#fff', borderRadius:'1rem', boxShadow:'0 2px 8px #22c55e22', padding:'1rem', display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center' }}>
        {bench.map(player => (
          <div key={player.id} draggable onDragStart={() => handleDragStart(player)} style={{ background:'#222', color:'#fff', borderRadius:'0.7rem', padding:'0.5rem 1rem', fontWeight:700, cursor:'grab', minWidth:90 }}>{player.name} #{player.number}</div>
        ))}
      </div>
    </div>
  );
};

export default Lineup;
