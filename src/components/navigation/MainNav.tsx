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
    <nav className="huvudnavigering">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            isActive ? "navlank aktiv" : "navlank"
          }
          end={item.to === "/"}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default MainNav;