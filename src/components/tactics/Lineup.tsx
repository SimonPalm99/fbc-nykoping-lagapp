import React, { useState } from "react";
import styles from "./Lineup.module.css";

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
    <div className={styles.lineupRoot}>
      <nav className={styles.lineupNav}>
        <button
          onClick={() => setActiveTab('femma')}
          className={
            styles.lineupNavBtn + ' ' + (activeTab === 'femma' ? styles.lineupNavBtnFemma : '')
          }
        >Femma</button>
        <button
          onClick={() => setActiveTab('pp')}
          className={
            styles.lineupNavBtn + ' ' + (activeTab === 'pp' ? styles.lineupNavBtnPp : '')
          }
        >PP</button>
        <button
          onClick={() => setActiveTab('bp')}
          className={
            styles.lineupNavBtn + ' ' + (activeTab === 'bp' ? styles.lineupNavBtnBp : '')
          }
        >BP</button>
        <button
          onClick={exportLineup}
          className={styles.lineupNavBtn + ' ' + styles.lineupNavBtnExport}
        >Exportera</button>
      </nav>
      <div className={styles.lineupPositions}>
        {/* Positioner */}
        {positions.map(pos => (
          <div
            key={pos}
            onDrop={() => handleDrop(pos)}
            onDragOver={e => e.preventDefault()}
            className={styles.lineupPosBox}
          >
            <div>{pos}</div>
            {activeTab === 'femma' && femma[pos] && (
              <div
                draggable
                onDragStart={() => femma[pos] && handleDragStart(femma[pos])}
                className={styles.lineupPosPlayerFemma}
              >
                {femma[pos]?.name} #{femma[pos]?.number}
              </div>
            )}
            {activeTab === 'pp' && pp[pos] && (
              <div
                draggable
                onDragStart={() => pp[pos] && handleDragStart(pp[pos])}
                className={styles.lineupPosPlayerPp}
              >
                {pp[pos]?.name} #{pp[pos]?.number}
              </div>
            )}
            {activeTab === 'bp' && bp[pos] && (
              <div
                draggable
                onDragStart={() => bp[pos] && handleDragStart(bp[pos])}
                className={styles.lineupPosPlayerBp}
              >
                {bp[pos]?.name} #{bp[pos]?.number}
              </div>
            )}
            {(activeTab === 'femma' && femma[pos]) || (activeTab === 'pp' && pp[pos]) || (activeTab === 'bp' && bp[pos]) ? (
              <button
                onClick={() => handleRemove(pos)}
                className={styles.lineupPosRemoveBtn}
              >✕</button>
            ) : null}
          </div>
        ))}
      </div>
      {/* Bänk */}
      <div className={styles.lineupBench}>
        {bench.map(player => (
          <div
            key={player.id}
            draggable
            onDragStart={() => handleDragStart(player)}
            className={styles.lineupBenchPlayer}
          >
            {player.name} #{player.number}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lineup;
