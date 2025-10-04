import React, { ReactNode } from "react";
import styles from "./ProtectedRoute.module.css";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.protectedRoot}>
        <div className={styles.protectedCenter}>
          <div className={styles.protectedLogo}>🏒</div>
          <p className={styles.protectedText}>Laddar FBC Nyköping...</p>
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
