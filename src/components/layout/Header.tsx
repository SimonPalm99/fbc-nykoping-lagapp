import React from "react";

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#181c1e",
  padding: "14px 0",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const titleStyle: React.CSSProperties = {
  color: "#fff",
  fontWeight: 700,
  fontSize: 24,
  letterSpacing: 1,
  lineHeight: 1.1,
};

const subtitleStyle: React.CSSProperties = {
  fontWeight: 400,
  fontSize: 13,
  color: "#b8f27c",
  letterSpacing: 0.5,
  marginTop: 3,
};

const Header: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 600);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      style={{
        ...headerStyle,
        flexDirection: isMobile ? "column" : "row",
        padding: isMobile ? "10px 0" : "14px 0",
      }}
    >
      <div style={{ textAlign: isMobile ? "center" : "left" }}>
        <div style={{ ...titleStyle, fontSize: isMobile ? 19 : 24 }}>
          FBC Nyköping
        </div>
        <div style={{ ...subtitleStyle, fontSize: isMobile ? 11 : 13 }}>
          Innebandy sedan 2015
        </div>
      </div>
    </header>
  );
};

export default Header;