import React from "react";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";
import Welcome from "../pages/Welcome";

const AuthGate: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Visa Welcome även under laddning
  if (isLoading) return <Welcome />;
  return user ? <Home /> : <Welcome />;
};

export default AuthGate;
