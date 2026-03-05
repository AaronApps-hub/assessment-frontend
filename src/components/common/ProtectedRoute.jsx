import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import loadingImg from "../../images/thumnail.jpg";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  // ⏳ Wait until auth is loaded
  if (loading) {
    return (
      <>
        {/* Inject animation */}
        <style>
          {`
            @keyframes pulseZoom {
              0% { transform: scale(1); }
              50% { transform: scale(1.15); }
              100% { transform: scale(1); }
            }
          `}
        </style>

        <div style={styles.loaderWrap}>
          <img src={loadingImg} alt="Loading" style={styles.loaderImg} />
        </div>
      </>
    );
  }

  // 🚫 Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Normalize roles
  const userRole = user.role?.toLowerCase().trim();
  const allowedRoles = roles?.map(r => r.toLowerCase().trim());

  // 🚫 Role not allowed
  if (roles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const styles = {
  loaderWrap: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
  },

  loaderImg: {
    width: 260,
    height: 260,
    objectFit: "cover",
    animation: "pulseZoom 2.2s ease-in-out infinite",
  },
};

export default ProtectedRoute;
