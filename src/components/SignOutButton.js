import React from "react";
import { UserAuth } from "../context/AuthContext";

// Component for sign out button + logic
export default function SignOutButton() {
  const { googleSignOut } = UserAuth();
  const handleSignOut = async () => {
    try {
      await googleSignOut();
    } catch (error) {
      console.log(error);
    }
  };

  return <button onClick={handleSignOut}>Sign Out!</button>;
}
