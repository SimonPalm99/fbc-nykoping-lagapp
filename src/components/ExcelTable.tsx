import React, { useState } from "react";
import styles from "./ExcelTable.module.css";

interface Cell {
  value: string;
  formula?: string;
  border: {
    color: string;
    width: number;
    style: "solid" | "dashed" | "dotted";
  };
}

const defaultBorder: { color: string; width: number; style: "solid" | "dashed" | "dotted" } = { color: "#222", width: 1, style: "solid" };

function parseFormula(formula: string, cells: Cell[][]): number | string {
  // Enkel parser för =SUM(A1:A3), =A1*B2 etc
  if (!formula.startsWith("=")) return formula;
  try {
    // SUMMA
    if (/^=SUM\((.+)\)$/i.test(formula)) {
      const match = formula.match(/^=SUM\((.+)\)$/i);
      if (match && match[1]) {
        const range = match[1];
        const [start, end] = range.split(":");
        if (!start || !end) return "Fel i formel";
        const startCol = start.charCodeAt(0) - 65;
        const startRow = parseInt(start.slice(1)) - 1;
        const endCol = end.charCodeAt(0) - 65;
        const endRow = parseInt(end.slice(1)) - 1;
        let sum = 0;
        for (let r = startRow; r <= endRow; r++) {
          for (let c = startCol; c <= endCol; c++) {
            const cell = cells[r]?.[c];
            if (!cell) continue;
            const v = parseFloat(cell.value);
            if (!isNaN(v)) sum += v;
          }
        }
        return sum;
      }
    }
    // Multiplikation =A1*B2
    if (/^=([A-Z][0-9])\*([A-Z][0-9])$/i.test(formula)) {
      const match = formula.match(/^=([A-Z][0-9])\*([A-Z][0-9])$/i);
      if (match && match[1] && match[2]) {
        const ref1 = match[1];
        const ref2 = match[2];
        const col1 = ref1.charCodeAt(0) - 65;
        const row1 = parseInt(ref1.slice(1)) - 1;
        const col2 = ref2.charCodeAt(0) - 65;
        const row2 = parseInt(ref2.slice(1)) - 1;
  const cell1 = cells[row1]?.[col1];
  const cell2 = cells[row2]?.[col2];
  if (!cell1 || !cell2) return "Fel i formel";
  const v1 = parseFloat(cell1.value);
  const v2 = parseFloat(cell2.value);
  if (!isNaN(v1) && !isNaN(v2)) return v1 * v2;
      }
    }
    // Cellreferens =A1
    if (/^=([A-Z][0-9])$/i.test(formula)) {
      const match = formula.match(/^=([A-Z][0-9])$/i);
      if (match && match[1]) {
        const ref = match[1];
        const col = ref.charCodeAt(0) - 65;
        const row = parseInt(ref.slice(1)) - 1;
  const cell = cells[row]?.[col];
  if (!cell) return "Fel i formel";
  return cell.value;
      }
    }
    return "Fel i formel";
  } catch {
    return "Fel i formel";
  }
}

const ExcelTable: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 5 }) => {
  const [cells, setCells] = useState<Cell[][]>(
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ value: "", border: { color: defaultBorder.color, width: defaultBorder.width, style: defaultBorder.style } }))
    )
  );
  const [editingBorder, setEditingBorder] = useState<{ row: number; col: number } | null>(null);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const handleChange = (row: number, col: number, value: string) => {
    setCells(prev => {
      const updated = prev.map(arr => arr.slice());
      const cell = updated[row]?.[col];
      if (!cell) {
        return updated;
      }
      cell.value = value;
      return updated;
    });
  };

  const handleFormula = (row: number, col: number, formula: string) => {
    setCells(prev => {
      const updated = prev.map(arr => arr.slice());
      const cell = updated[row]?.[col];
      if (!cell) {
        return updated;
      }
      cell.formula = formula;
      return updated;
    });
  };

  const handleBorderChange = (row: number, col: number, border: Partial<Cell["border"]>) => {
    setCells(prev => {
      const updated = prev.map(arr => arr.slice());
      const cell = updated[row]?.[col];
      if (!cell) {
        return updated;
      }
      cell.border = {
        color: border.color ?? cell.border?.color ?? "#222",
        width: border.width ?? cell.border?.width ?? 1,
        style: border.style ?? cell.border?.style ?? "solid",
      };
      return updated;
    });
  };

  return (
    <div className={styles.excelTable}>
      <button onClick={() => setIsEditable(e => !e)} className={styles.excelTable__editBtn}>
        {isEditable ? "Lås tabell" : "Redigera tabell"}
      </button>
      <table className={styles.excelTable__table}>
        <thead>
          <tr>
            <th className={styles.excelTable__th}></th>
            {Array.from({ length: cols }, (_, c) => (
              <th key={c} className={styles.excelTable__th}>{String.fromCharCode(65 + c)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cells.map((rowArr, r) => (
            <tr key={r}>
              <th className={styles.excelTable__th}>{r + 1}</th>
              {rowArr.map((cell, c) => (
                <td
                  key={c}
                  className={[
                    styles.excelTable__td,
                    styles[`excelTable__border_${cell.border?.style || "solid"}`]
                  ].join(" ")}
                  onDoubleClick={() => isEditable && setEditingBorder({ row: r, col: c })}
                  data-border-width={cell.border?.width || 1}
                  data-border-color={cell.border?.color || "#222"}
                >
                  <input
                    type="text"
                    value={cell.value}
                    onChange={e => handleChange(r, c, e.target.value)}
                    className={styles.excelTable__input}
                    placeholder="Värde eller formel"
                    disabled={!isEditable}
                  />
                  <div className={styles.excelTable__formulaResult}>
                    {cell.formula ? parseFormula(cell.formula, cells) : ""}
                  </div>
                  <input
                    type="text"
                    value={cell.formula || ""}
                    onChange={e => handleFormula(r, c, e.target.value)}
                    className={styles.excelTable__formulaInput}
                    placeholder="=SUM(A1:A3) eller =A1*B2"
                    disabled={!isEditable}
                  />
                  {editingBorder && editingBorder.row === r && editingBorder.col === c && isEditable && (
                    <div className={styles.excelTable__borderEditor}>
                      <label>Färg: <input type="color" value={cell.border?.color || "#222"} onChange={e => handleBorderChange(r, c, { color: e.target.value })} disabled={!isEditable} /></label>
                      <label>Tjocklek: <input type="number" min={1} max={8} value={cell.border?.width || 1} onChange={e => handleBorderChange(r, c, { width: Number(e.target.value) })} disabled={!isEditable} /></label>
                      <label>Stil: <select value={cell.border?.style || "solid"} onChange={e => handleBorderChange(r, c, { style: e.target.value as any })} disabled={!isEditable}>
                        <option value="solid">Solid</option>
                        <option value="dashed">Streckad</option>
                        <option value="dotted">Prickad</option>
                      </select></label>
                      <button onClick={() => setEditingBorder(null)} className={styles.excelTable__closeBtn}>Stäng</button>
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelTable;
