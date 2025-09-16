import React from "react";

interface Tool {
  key: string;
  label: string;
}
interface Color {
  key: string;
  label: string;
}
interface WhiteboardToolbarProps {
  tools: Tool[];
  tool: string;
  setTool: (tool: string) => void;
  colors: Color[];
  color: string;
  setColor: (color: string) => void;
  isMobile: boolean;
}

const WhiteboardToolbar: React.FC<WhiteboardToolbarProps> = ({ tools, tool, setTool, colors, color, setColor, isMobile }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
    <div style={{ fontWeight: 900, fontSize: "1.08rem", color: "#222", marginBottom: 6 }}>Verktyg</div>
    <div style={{ display: "flex", gap: 6 }}>
      {tools.map(t => (
        <button
          key={t.key}
          onClick={() => setTool(t.key)}
          style={{ background: tool===t.key ? "#2E7D32" : "#f5f5f5", color: tool===t.key ? "#fff" : "#222", borderRadius: 6, border: tool===t.key ? "2px solid #2E7D32" : "1.5px solid #ddd", fontWeight: 700, fontSize: isMobile ? "1.25rem" : "1.02rem", padding: isMobile ? "1rem 2rem" : "0.45rem 0.9rem", cursor: "pointer", boxShadow: tool===t.key ? "0 2px 8px #2E7D3233" : "none", minWidth: isMobile ? 64 : 44, minHeight: isMobile ? 54 : 38, display: "flex", alignItems: "center", justifyContent: "center", outline: "none" }}
          title={t.label}
          aria-label={t.label}
          tabIndex={0}
          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setTool(t.key); }}
        >
          {t.label}
        </button>
      ))}
    </div>
    {/* Färgval för penna/linje */}
    {(tool === "pen" || tool === "line") && (
      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        {colors.map(c => (
          <button
            key={c.key}
            onClick={() => setColor(c.key)}
            style={{ width: 28, height: 28, borderRadius: "50%", background: c.key, border: color===c.key ? "3px solid #222" : "2px solid #ddd", cursor: "pointer", boxShadow: color===c.key ? "0 2px 8px #2225" : "none", outline: "none" }}
            title={c.label}
            aria-label={c.label}
            tabIndex={0}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setColor(c.key); }}
          ></button>
        ))}
      </div>
    )}
    {/* Rensa-knapp med bekräftelse */}
    <button
      style={{ marginTop: 16, background: "#e53935", color: "#fff", borderRadius: 6, border: "2px solid #e53935", fontWeight: 700, fontSize: isMobile ? "1.15rem" : "1rem", padding: isMobile ? "0.8rem 1.5rem" : "0.4rem 1rem", cursor: "pointer", boxShadow: "0 2px 8px #e5393533", outline: "none" }}
      title="Rensa allt"
      aria-label="Rensa allt"
      tabIndex={0}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") {
        if (window.confirm("Vill du verkligen rensa allt på whiteboarden? Detta går inte att ångra.")) {
          if (typeof window !== "undefined" && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent("whiteboard-clear"));
          }
        }
      }}}
      onClick={() => {
        if (window.confirm("Vill du verkligen rensa allt på whiteboarden? Detta går inte att ångra.")) {
          if (typeof window !== "undefined" && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent("whiteboard-clear"));
          }
        }
      }}
    >Rensa</button>
  </div>
);

export default WhiteboardToolbar;
