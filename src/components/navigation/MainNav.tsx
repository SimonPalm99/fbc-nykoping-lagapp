import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Hem" },
  { to: "/profile", label: "Min Profil" },
  { to: "/activities", label: "Aktiviteter" },
  { to: "/opponents", label: "Motståndare" },
  { to: "/stats", label: "Statistik" }
];

const MainNav: React.FC = () => {
  return (
    <nav style={{
      display: "flex",
      gap: 18,
      margin: "20px 0",
      paddingBottom: 8,
      borderBottom: "1px solid #ddd"
    }}>
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          style={({ isActive }) => ({
            background: isActive ? "#1976d2" : "transparent",
            color: isActive ? "#fff" : "#222",
            border: "none",
            borderRadius: 4,
            padding: "6px 14px",
            cursor: "pointer",
            fontWeight: isActive ? 700 : 400,
            textDecoration: "none"
          })}
          end={item.to === "/"}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default MainNav;