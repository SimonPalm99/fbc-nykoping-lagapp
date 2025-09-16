import React from "react";

interface MenuPopupProps {
  open: boolean;
  onClose: () => void;
  menuItems: { label: string; path: string }[];
  styles: any;
  navigate: (path: string) => void;
}

const MenuPopup: React.FC<MenuPopupProps> = ({ open, onClose, menuItems, styles, navigate }) => {
  if (!open) return null;
  return (
    <div id="fbc-menu-popup" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.18)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: `linear-gradient(135deg, ${styles.primaryGreen} 0%, #111 100%)`, borderRadius: "1.2rem", boxShadow: "0 8px 32px rgba(46,125,50,0.18)", width: "100%", maxWidth: 370, maxHeight: "80vh", padding: "2.2rem 1.5rem 2rem 1.5rem", overflowY: "auto", border: `2px solid ${styles.primaryGreen}`, position: "relative", animation: "fadeInMenu 0.4s", display: "flex", flexDirection: "column", gap: "1.1rem", alignItems: "center" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 900, fontSize: "1.35rem", color: "#fff", marginBottom: "1.2rem", letterSpacing: "1px", textAlign: "center", textShadow: "0 2px 8px rgba(46,125,50,0.10)" }}>Meny</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.7rem", width: "100%" }}>
          {menuItems.map(({ label, path }) => (
            <button
              key={label}
              className="fbc-btn"
              style={{
                width: "100%",
                fontWeight: 700,
                fontSize: "1.13rem",
                color: styles.primaryGreen,
                background: "#111",
                borderRadius: "10px",
                boxShadow: "0 2px 12px rgba(46,125,50,0.10)",
                padding: "0.85rem 0.5rem",
                border: `2px solid ${styles.primaryGreen}`,
                transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                textAlign: "center",
                marginBottom: "0.1rem",
                letterSpacing: "0.5px"
              }}
              onClick={() => { onClose(); navigate(path); }}
              onMouseEnter={e => { e.currentTarget.style.background = styles.primaryGreen; e.currentTarget.style.color = "#fff"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(46,125,50,0.18)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#111"; e.currentTarget.style.color = styles.primaryGreen; e.currentTarget.style.boxShadow = "0 2px 12px rgba(46,125,50,0.10)"; }}
            >
              {label}
            </button>
          ))}
        </nav>
        <button className="fbc-btn" style={{ width: "100%", marginTop: "1.5rem", fontWeight: 700, fontSize: "1.08rem", color: styles.primaryGreen, background: "#111", borderRadius: "10px", boxShadow: "0 2px 12px rgba(46,125,50,0.10)", padding: "0.7rem 0.5rem", border: `2px solid ${styles.primaryGreen}` }} onClick={onClose}>Stäng</button>
      </div>
    </div>
  );
};

export default MenuPopup;
