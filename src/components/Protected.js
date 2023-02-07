import React from "react";
import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

//Protects pages that require signing in before viewing
//WRAPPER COMPONENT
export default function Protected({ children }) {
  const { user } = UserAuth();
  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}
