import React from "react";

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      maxWidth: 480,
      margin: "0 auto",
      padding: "16px 8px",
      minHeight: "100vh",
      background: "#f6f8fa",
      boxSizing: "border-box"
    }}
  >
    {children}
  </div>
);

export default Container;