import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

export default function CreateGroupButton() {
  const navigate = useNavigate();
  const navigateToCreateGroup = () => {
    // navigate to /CreateGroup
    navigate("/createGroup");
  };
  return <button onClick={navigateToCreateGroup}>Create a group!</button>;
}
