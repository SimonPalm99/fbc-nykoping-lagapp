import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #FAFAFA 0%, #F1F8E9 30%, #E8F5E9 100%)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "60px", height: "60px", margin: "0 auto 1rem", background: "linear-gradient(135deg, #2E7D32 0%, #388E3C 50%, #4CAF50 100%)", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: "white", animation: "pulse 2s infinite" }}>🏒</div>
          <p style={{ fontSize: "1rem", color: "#1B5E20", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>Laddar FBC Nyköping...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  // Ledarportal: endast coach/admin
  const isLeaderRoute = window.location.pathname === "/ledarportal";
  if (isLeaderRoute && user && user.role !== "leader" && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
