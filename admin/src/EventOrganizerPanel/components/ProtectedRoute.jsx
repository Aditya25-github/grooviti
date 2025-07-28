import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, userRole, loading } = useContext(StoreContext);

  if (loading) return null;

  if (!token) return <Navigate to="/" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // User role not allowed to access this route
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
