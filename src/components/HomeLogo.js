import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";

export default function HomeLogo() {
  const navigate = useNavigate();
  const routeHome = () => {
    navigate("/home");
  };

  return <IconButton onClick={routeHome}>Logo</IconButton>;
}
