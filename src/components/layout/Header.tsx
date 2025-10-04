
import React from "react";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 600);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className={
      isMobile ? `${styles.huvudHeader} ${styles.mobile}` : styles.huvudHeader
    }>
      <div className={
        isMobile ? `${styles.huvudHeaderText} ${styles.mobile}` : styles.huvudHeaderText
      }>
        <div className={
          isMobile ? `${styles.huvudTitle} ${styles.mobile}` : styles.huvudTitle
        }>
          FBC Nyköping
        </div>
        <div className={
          isMobile ? `${styles.huvudSubtitle} ${styles.mobile}` : styles.huvudSubtitle
        }>
          Innebandy sedan 2015
        </div>
      </div>
    </header>
  );
};

export default Header;