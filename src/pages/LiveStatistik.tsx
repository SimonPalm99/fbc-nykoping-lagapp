import React, { useState } from "react";

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
  const [redigeradCell, setRedigeradCell] = useState<{p:number, f:number, side:"FOR"|"MOT", idx:number}|null>(null);
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
      // eslint-disable-next-line no-eval
      return {value:Function(`"use strict";return (${expr})`)()};
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
  const [cellBorders, setCellBorders] = useState<{[key:string]:{top?:string,right?:string,bottom?:string,left?:string}}>({});
  const [borderEditCell, setBorderEditCell] = useState<{p:number,f:number,side:"FOR"|"MOT",idx:number}|null>(null);

  function ändraKantlinje(p:number, f:number, side:"FOR"|"MOT", idx:number, border:string, color:string) {
    const key = cellKey(p,f,side,idx);
    setCellBorders(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [border]: color
      }
    }));
    setBorderEditCell(null);
  }

  function renderaCell(p:number, f:number, side:"FOR"|"MOT", idx:number) {
    const key = cellKey(p,f,side,idx);
    const värde = stats?.[p]?.[f]?.[side]?.[idx] ?? 0;
    const formel = formler[key];
    const borders = cellBorders[key] || {};
    const errorMsg = stats?.[p]?.[f]?.[side]?.[idx+1] ?? "";
    const baseStyle: React.CSSProperties = {
      minWidth: 64,
      height: 38,
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      background: "#fff",
      borderTop: borders.top ? `3px solid ${borders.top}` : "1px solid #d1d5db",
      borderRight: borders.right ? `3px solid ${borders.right}` : "1px solid #d1d5db",
      borderBottom: borders.bottom ? `3px solid ${borders.bottom}` : "1px solid #d1d5db",
      borderLeft: borders.left ? `3px solid ${borders.left}` : "1px solid #d1d5db",
      boxSizing: "border-box",
      fontWeight: 500,
      fontSize: "1rem",
      transition: "box-shadow 0.2s",
      boxShadow: redigeradCell && redigeradCell.p===p && redigeradCell.f===f && redigeradCell.side===side && redigeradCell.idx===idx ? "0 0 0 2px #22c55e" : "none",
      cursor: låst ? "pointer" : "text"
    };
    // Upplåst läge: all redigering
    if (!låst) {
      return (
        <div style={baseStyle}>
          <input
            type="text"
            value={formel ?? värde}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontWeight: 500,
              fontSize: "1rem",
              textAlign: "center"
            }}
            onChange={e => ändraFormel(p,f,side,idx,e.target.value)}
            title="Skriv tal eller formel. Ex: =A1+B2"
            onFocus={() => setRedigeradCell({p, f, side, idx})}
            onBlur={() => setRedigeradCell(null)}
          />
          <button style={{ position: "absolute", right: 4, top: 4, fontSize: 16, background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 4, cursor: "pointer", padding: "2px 6px" }} onClick={() => setBorderEditCell({p,f,side,idx})} title="Redigera kantlinje">✏️</button>
          {borderEditCell && borderEditCell.p===p && borderEditCell.f===f && borderEditCell.side===side && borderEditCell.idx===idx && (
            <div style={{ position: "absolute", top: 38, left: "50%", transform: "translateX(-50%)", background: "#fff", color: "#222", borderRadius: 8, boxShadow: "0 2px 8px #0002", zIndex: 20, padding: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Redigera kantlinje</div>
              {["top","right","bottom","left"].map(border => (
                <div key={border} style={{ marginBottom: 4 }}>
                  <span style={{ marginRight: 6 }}>{border}</span>
                  {["#22c55e","#ef4444","#222","#fff","#000","#FFD700"].map(color => (
                    <button key={color} style={{ background: color, border: "1px solid #222", width: 24, height: 24, marginRight: 4, borderRadius: 4, cursor: "pointer" }} onClick={() => ändraKantlinje(p,f,side,idx,border,color)} />
                  ))}
                </div>
              ))}
              <button style={{ marginTop: 6, padding: "2px 8px", background: "#eee", border: "1px solid #222", borderRadius: 6, cursor: "pointer" }} onClick={() => setBorderEditCell(null)}>Stäng</button>
            </div>
          )}
          {errorMsg && (
            <div style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: 2, position: "absolute", left: 0, right: 0, bottom: -18 }}>{errorMsg}</div>
          )}
        </div>
      );
    }
    // Låst läge: endast visning
    return (
      <div style={baseStyle} onClick={() => setRedigeradCell({p, f, side, idx})} title={formel ? (errorMsg ? errorMsg : "Formelcell. Ex: =A1+B2") : "Klicka för att redigera"}>
        <span style={{ fontWeight: 700, color: formel ? (errorMsg ? "#ef4444" : "#22c55e") : "#222" }}>
          {formel ? (formel.startsWith("=") ? `ƒ: ${formel}` : formel) : värde}
        </span>
        {errorMsg && (
          <div style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: 2, position: "absolute", left: 0, right: 0, bottom: -18 }}>{errorMsg}</div>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #101a10 0%, #181c18 100%)", color: "#f8fafc", fontFamily: "inherit", padding: "1.2rem 0" }}>
      <header style={{ width: "100%", maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "0.3rem 0.5rem 0.2rem 0.5rem", borderBottom: "2px solid #22c55e", background: "linear-gradient(135deg, #22c55e 0%, #181c18 100%)", borderRadius: "0 0 1rem 1rem", boxShadow: "0 2px 8px #22c55e22", position: "sticky", top: 0, zIndex: 10, minHeight: "56px" }}>
        <h1 style={{ fontWeight: 900, fontSize: "1.5rem", color: "#fff", letterSpacing: "1px", textShadow: "0 2px 8px #22c55e, 0 0px 2px #000", marginBottom: "0.3rem", zIndex: 2 }}>Live Matchstatistik</h1>
        <div style={{ margin: "0.7rem 0", zIndex: 2, width: "100%", maxWidth: 400, display: "flex", gap: 8 }}>
          {PERIODER.map((namn, idx) => (
            <button key={namn} onClick={() => setPeriod(idx)} style={{ padding: "0.6rem 1.2rem", fontSize: "0.95rem", backgroundColor: period===idx ? "#22c55e" : "#222", color: period===idx ? "#fff" : "#22c55e", border: "2px solid #22c55e", borderRadius: "8px", fontWeight: 700, cursor: "pointer", minWidth: 110 }}>{namn}</button>
          ))}
          <button onClick={() => setLåst(l => !l)} style={{ marginLeft: 12, padding: "0.6rem 1.2rem", fontWeight: 700, borderRadius: 8, border: "2px solid #22c55e", background: låst ? "#ef4444" : "#22c55e", color: "#fff" }}>{låst ? "Lås upp" : "Lås"}</button>
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button onClick={exportCSV} style={{ padding: "0.5rem 1.2rem", fontWeight: 700, borderRadius: 8, border: "2px solid #22c55e", background: "#22c55e", color: "#fff", cursor: "pointer" }}>Exportera CSV</button>
          <button onClick={()=>setImportModal(true)} style={{ padding: "0.5rem 1.2rem", fontWeight: 700, borderRadius: 8, border: "2px solid #22c55e", background: "#fff", color: "#22c55e", cursor: "pointer" }}>Importera CSV</button>
        </div>
        {importModal && (
          <div style={{ position: "fixed", top:0, left:0, width:"100vw", height:"100vh", background:"#000a", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ background:"#fff", color:"#222", borderRadius:12, padding:32, boxShadow:"0 2px 12px #0005", minWidth:320 }}>
              <h2 style={{ fontWeight:900, fontSize:"1.2rem", marginBottom:8 }}>Importera statistik från CSV</h2>
              <textarea value={importText} onChange={e=>setImportText(e.target.value)} rows={10} style={{ width:"100%", marginBottom:12, fontSize:"1rem", borderRadius:8, border:"1px solid #22c55e", padding:8 }} placeholder="Klistra in CSV-data här..." />
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>importCSV(importText)} style={{ padding:"0.5rem 1.2rem", fontWeight:700, borderRadius:8, border:"2px solid #22c55e", background:"#22c55e", color:"#fff", cursor:"pointer" }}>Importera</button>
                <button onClick={()=>setImportModal(false)} style={{ padding:"0.5rem 1.2rem", fontWeight:700, borderRadius:8, border:"2px solid #ef4444", background:"#fff", color:"#ef4444", cursor:"pointer" }}>Avbryt</button>
              </div>
            </div>
          </div>
        )}
      </header>
      <section style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
        <div style={{ overflowX: "auto", background: "#222", borderRadius: 12, boxShadow: "0 2px 8px #0002", padding: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1rem" }}>
            <thead>
              <tr>
                <th style={{ background: "#181c18", color: "#22c55e", fontWeight: 900, fontSize: "1.1rem", border: "2px solid #22c55e" }}>Femma</th>
                <th style={{ background: "#181c18", color: "#22c55e", fontWeight: 900, border: "2px solid #22c55e" }}>Typ</th>
                {STAT_TYPER.map((typ, idx) => (
                  <th key={typ+idx} style={{ background: "#181c18", color: "#22c55e", fontWeight: 700, border: "2px solid #22c55e" }}>{typ}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEMMOR.map((femma, fIdx) => (
                ["FOR", "MOT"].map(side => (
                  <tr key={femma.namn+side} style={{ background: femma.färg, fontWeight: side==="FOR"?700:400 }}>
                    <td style={{ border: "2px solid #222", fontWeight: 700 }}>{femma.namn}</td>
                    <td style={{ border: "2px solid #222", fontWeight: 700 }}>{side}</td>
                    {STAT_TYPER.map((_, idx) => (
                      <td key={idx} style={{ border: "2px solid #222", minWidth: 48 }}>
                        {renderaCell(period, fIdx, side as "FOR"|"MOT", idx)}
                      </td>
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
export default LiveStatistik;
