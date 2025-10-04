import React from "react";

import styles from "./MenuPopup.module.css";

interface MenuPopupProps {
  open: boolean;
  onClose: () => void;
  menuItems: { label: string; path: string }[];
  navigate: (path: string) => void;
}

const MenuPopup: React.FC<MenuPopupProps> = ({ open, onClose, menuItems, navigate }) => {
  if (!open) return null;
  return (
    <div id="fbc-menu-popup" className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContainer} onClick={e => e.stopPropagation()}>
        <div className={styles.popupTitle}>Meny</div>
        <nav className={styles.popupNav}>
          {menuItems.map(({ label, path }) => (
            <button
              key={label}
              className={styles.popupBtn}
              onClick={() => { onClose(); navigate(path); }}
            >
              {label}
            </button>
          ))}
        </nav>
        <button className={styles.closeBtn} onClick={onClose}>Stäng</button>
      </div>
    </div>
  );
};

export default MenuPopup;
