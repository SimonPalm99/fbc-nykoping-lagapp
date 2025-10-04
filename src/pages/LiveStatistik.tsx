import React, { useState } from "react";
import styles from "./LiveStatistik.module.css";
import { Parser } from "expr-eval";

// Enkel eval-funktion istället för mathjs
function evaluate(expr: string): number {
  // Endast +, -, *, / och parenteser tillåts
  if (!/^[\d+\-*/().\s]+$/.test(expr)) throw new Error("Ogiltiga tecken i formel");
  try {
    const parser = new Parser();
    return parser.evaluate(expr);
  } catch (e) {
    throw new Error("Fel i formel: " + (e instanceof Error ? e.message : e));
  }
}

const FEMMOR = [
  { namn: "1a femman", färg: "#d6f5d6" },
  { namn: "2a femman", färg: "#fff7d6" },
  { namn: "3e femman", färg: "#e6f0fa" },
  { namn: "ALLA FEMMOR", färg: "#fff" }
];
const STAT_TYPER = [
  "Etablerat", "xG", "Mål", "Hög Press", "xG", "Mål", "Spelvändning", "xG", "Mål", "PP", "xG", "Mål", "Tot xG", "Tot Mål"
];
const PERIODER = ["Period 1", "Period 2", "Period 3", "Summering"];

function skapaTomStat() {
  // 3 perioder, 4 femmor, 2 rader (FÖR/MOT), 14 stattyper
  const stats = [];
  for (let p = 0; p < 4; p++) {
    const period = [];
    for (let f = 0; f < 4; f++) {
      const femma = { FOR: Array(STAT_TYPER.length).fill(0), MOT: Array(STAT_TYPER.length).fill(0) };
      period.push(femma);
    }
    stats.push(period);
  }
  return stats;
}

// ...existing code...

const LiveStatistik: React.FC = () => {
  const [period, setPeriod] = useState(0);
  const [stats, setStats] = useState(() => skapaTomStat());
  const [låst, setLåst] = useState(true);
  // const [redigeradCell, setRedigeradCell] = useState<{p:number, f:number, side:"FOR"|"MOT", idx:number}|null>(null); // Borttagen, ej använd
  const [importModal, setImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  // Exportera statistik till CSV
  function exportCSV() {
    let rows = [];
    rows.push(["Period","Femma","Side",...STAT_TYPER]);
    for(let p=0;p<4;p++){
      for(let f=0;f<4;f++){
        for(let side of ["FOR","MOT"] as const){
          let row = [PERIODER[p] ?? `Period ${p+1}`, FEMMOR[f]?.namn ?? `Femma ${f+1}`, side];
          const femmaObj = stats?.[p]?.[f];
          const sideArr = femmaObj ? femmaObj[side] : undefined;
          for(let idx=0;idx<STAT_TYPER.length;idx++){
            row.push(sideArr ? sideArr[idx] : "");
          }
          rows.push(row);
        }
      }
    }
    const csv = rows.map(r=>r.map(x=>`"${x}"`).join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "livestatistik.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Importera statistik från CSV
  function importCSV(text:string) {
    try {
      const lines = text.trim().split(/\r?\n/);
      if(lines.length<2) return;
      const newStats = skapaTomStat();
      for(let i=1;i<lines.length;i++){
        const cols = lines[i]?.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(x=>x.replace(/"/g,"")) ?? [];
        const p = typeof cols[0]==="string" ? PERIODER.indexOf(cols[0]) : -1;
        const f = typeof cols[1]==="string" ? FEMMOR.findIndex(x=>x.namn===cols[1]) : -1;
        const side = (cols[2]==="FOR"||cols[2]==="MOT") ? cols[2] as "FOR"|"MOT" : undefined;
        if(p>=0&&f>=0&&side){
          const arr = newStats?.[p]?.[f]?.[side];
          if(arr){
            for(let idx=0;idx<STAT_TYPER.length;idx++){
              arr[idx]=Number(cols[3+idx] ?? 0);
            }
          }
        }
      }
      setStats(newStats);
      setImportModal(false);
    }catch(e){
      alert("Fel vid import: "+e);
    }
  }

  // Formelstöd: varje cell kan innehålla tal eller formel
  const [formler, setFormler] = useState<{[key:string]:string}>({});

  // Cellreferens: t.ex. A1 = femma 0, typ 0, FOR
  function cellKey(p:number, f:number, side:"FOR"|"MOT", idx:number) {
    return `${p}_${f}_${side}_${idx}`;
  }

  // Konvertera cellreferens (A1, B2, ...) till index
  function refToIndex(ref:string):{f:number, side:"FOR"|"MOT", idx:number}|null {
    const match = /^([A-D])([1-9][0-9]*)$/.exec(ref);
    if (!match || typeof match[1]!=="string" || typeof match[2]!=="string") return null;
    const femma = match[1].charCodeAt(0) - 65;
    const idx = parseInt(match[2] ?? "0",10)-1;
    if (isNaN(femma)||isNaN(idx)||femma<0||femma>3||idx<0||idx>=STAT_TYPER.length) return null;
    return {f:femma, side:"FOR", idx}; // Default FOR, kan byggas ut
  }
  function parseFormula(formel:string, getValue:(key:string)=>number):{value:number,error?:string} {
    try {
      let expr = formel.replace(/([A-D][1-9][0-9]*)/g, (ref) => {
        const refIdx = refToIndex(ref);
        if (!refIdx) throw new Error(`Ogiltig cellreferens: ${ref}`);
        return getValue(cellKey(period,refIdx.f,refIdx.side,refIdx.idx)).toString();
      });
      return {value: evaluate(expr)};
    } catch(e:any) {
      return {value:0,error:e.message||"Formelfel"};
    }
  }

  // ...ändraStat borttagen, ej använd längre...

  function ändraFormel(p:number, f:number, side:"FOR"|"MOT", idx:number, value:string) {
    const key = cellKey(p,f,side,idx);
    setFormler(prev => ({ ...prev, [key]: value }));
    setStats(prev => {
      const kopia = JSON.parse(JSON.stringify(prev));
      if (value.startsWith("=")) {
        const res = parseFormula(value.slice(1), k => {
          // Hämta värde från stats
          const parts = k.split("_");
          const pp = Number(parts[0]);
          const ff = Number(parts[1]);
          const ss = parts[2] as "FOR"|"MOT";
          const ii = Number(parts[3]);
          if(isNaN(pp)||isNaN(ff)||isNaN(ii)||!kopia?.[pp]?.[ff]?.[ss]) return 0;
          return kopia[pp][ff][ss][ii] ?? 0;
        });
        kopia[p][f][side][idx] = res.value;
        kopia[p][f][side][idx+1] = res.error ? res.error : ""; // Spara felmeddelande bredvid cellen
      } else {
        kopia[p][f][side][idx] = Number(value);
        kopia[p][f][side][idx+1] = "";
      }
      return kopia;
    });
  }

  // Kantlinje-stöd
  const [cellBorders] = useState<{[key:string]:{top?:string,right?:string,bottom?:string,left?:string}}>({});
  const [borderEditCell, setBorderEditCell] = useState<{p:number,f:number,side:"FOR"|"MOT",idx:number}|null>(null);


  function renderaCell(p:number, f:number, side:"FOR"|"MOT", idx:number) {
    const key = cellKey(p,f,side,idx);
    const värde = stats?.[p]?.[f]?.[side]?.[idx] ?? 0;
    const formel = formler[key];
    const borders = cellBorders[key] || {};
    const errorMsg = stats?.[p]?.[f]?.[side]?.[idx+1] ?? "";
    // Generera CSS-klasser för cellkanter
    function borderClass(borders: {[key:string]:string}) {
      return [
        borders.top ? styles["borderTop_"+borders.top.replace("#","")] : "",
        borders.right ? styles["borderRight_"+borders.right.replace("#","")] : "",
        borders.bottom ? styles["borderBottom_"+borders.bottom.replace("#","")] : "",
        borders.left ? styles["borderLeft_"+borders.left.replace("#","")] : ""
      ].filter(Boolean).join(" ");
    }
    const cellClass = [
      styles.cell,
      !låst ? styles.editing : "",
      borderClass(borders)
    ].filter(Boolean).join(" ");
    // Upplåst läge: all redigering
    if (!låst) {
      return (
        <div className={cellClass}>
          <input
            type="text"
            value={formel ?? värde}
            className={styles.cellInput}
            onChange={e => ändraFormel(p,f,side,idx,e.target.value)}
            title="Skriv tal eller formel. Ex: =A1+B2"
          />
          <button className={styles.borderBtn} onClick={() => setBorderEditCell({p,f,side,idx})} title="Redigera kantlinje">✏️</button>
          {borderEditCell && borderEditCell.p===p && borderEditCell.f===f && borderEditCell.side===side && borderEditCell.idx===idx && (
            <div className={styles.borderEditBox}>
              <div className={styles.borderEditTitle}>Redigera kantlinje</div>
              {["top","right","bottom","left"].map(border => (
                <div key={border} className={styles.borderEditRow}>
                  {["#22c55e","#ef4444","#222","#fff","#000","#FFD700"].map(color => (
                    <button
                      key={color}
                      className={styles.borderColorBtn}
                      title={`Välj kantfärg ${color}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
          {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
        </div>
      );
    }
    // Låst läge: visa värde
    return (
      <div className={cellClass}>
        {värde}
        {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
      </div>
    );
  }

  // Main render
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>Live Matchstatistik</h1>
        <div className={styles.periods}>
          {PERIODER.map((namn, idx) => (
            <button
              key={namn}
              onClick={() => setPeriod(idx)}
              className={[
                styles.periodBtn,
                period===idx ? styles.active : ""
              ].filter(Boolean).join(" ")}
            >{namn}</button>
          ))}
          <button
            onClick={() => setLåst(l => !l)}
            className={[
              styles.lockBtn,
              !låst ? styles.unlocked : ""
            ].filter(Boolean).join(" ")}
          >{låst ? "Lås upp" : "Lås"}</button>
        </div>
        <div className={styles.actions}>
          <button onClick={exportCSV} className={styles.actionBtn}>Exportera CSV</button>
          <button onClick={()=>setImportModal(true)} className={[styles.actionBtn, styles.import].join(" ")}>Importera CSV</button>
        </div>
        {importModal && (
          <div className={styles.importModal}>
            <div className={styles.importBox}>
              <h2 className={styles.importTitle}>Importera statistik från CSV</h2>
              <textarea
                value={importText}
                onChange={e=>setImportText(e.target.value)}
                rows={10}
                className={styles.importTextarea}
                placeholder="Klistra in CSV-data här..."
              />
              <div className={styles.importActions}>
                <button onClick={()=>importCSV(importText)} className={styles.actionBtn}>Importera</button>
                <button onClick={()=>setImportModal(false)} className={[styles.actionBtn, styles.cancel].join(" ")}>Avbryt</button>
              </div>
            </div>
          </div>
        )}
      </header>
      <section className={styles.section}>
        <div className={styles.tableWrap}>
          <table className={styles.statsTable}>
            <thead>
              <tr>
                <th className={styles.statsTh}>Femma</th>
                <th className={styles.statsTh}>Typ</th>
                {STAT_TYPER.map((typ, idx) => (
                  <th key={typ+idx} className={[styles.statsTh, styles.typ].join(" ")}>{typ}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEMMOR.map((femma, fIdx) => (
                ["FOR", "MOT"].map(side => (
                  <tr
                    key={femma.namn+side}
                    className={[
                      styles.statsRow,
                      side === "FOR" ? styles.forRow : styles.motRow,
                      styles["rowBg_"+femma.färg.replace("#","")]
                    ].join(" ")}
                  >
                    <td className={styles.statsTd}>{femma.namn}</td>
                    <td className={styles.statsTd}>{side}</td>
                    {STAT_TYPER.map((_, idx) => (
                      <td key={idx} className={[styles.statsTd, styles.cell].join(" ")}>{renderaCell(period, fIdx, side as "FOR"|"MOT", idx)}</td>
                    ))}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
// export default LiveStatistik; // Removed duplicate default export
export default LiveStatistik;
