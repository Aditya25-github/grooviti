import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const ProtectedRoute = ({ children }) => {
  const { token, admin, loading } = useContext(StoreContext);

  if (loading) return null;

  if (!token || !admin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
