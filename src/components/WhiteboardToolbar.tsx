import React from "react";
import styles from "./WhiteboardToolbar.module.css";

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
  <div className={styles.toolbar}>
    <div className={styles["toolbar-title"]}>Verktyg</div>
    <div className={styles["toolbar-tools"]}>
      {tools.map(t => (
        <button
          key={t.key}
          onClick={() => setTool(t.key)}
          className={[
            styles["toolbar-tool-btn"],
            tool === t.key ? styles.selected : "",
            isMobile ? styles.mobile : ""
          ].filter(Boolean).join(" ")}
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
      <div className={styles["toolbar-colors"]}>
        {colors.map(c => {
          // Map color key to CSS class
          const colorClass = styles[`color-${c.key.replace('#','')}`] || "";
          return (
            <button
              key={c.key}
              onClick={() => setColor(c.key)}
              className={[
                styles["toolbar-color-btn"],
                colorClass,
                color === c.key ? styles.selected : ""
              ].filter(Boolean).join(" ")}
              title={c.label}
              aria-label={c.label}
              tabIndex={0}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setColor(c.key); }}
            ></button>
          );
        })}
      </div>
    )}
    {/* Rensa-knapp med bekräftelse */}
    <button
      className={[
        styles["toolbar-clear-btn"],
        isMobile ? styles.mobile : ""
      ].filter(Boolean).join(" ")}
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
