import React from "react";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";
import Welcome from "../pages/Welcome";

const AuthGate: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // eller en loader
  return user ? <Home /> : <Welcome />;
};

export default AuthGate;
