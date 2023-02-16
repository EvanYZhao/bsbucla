import React from "react";
import SearchBar from "../components/SearchBar";
import SignOutButton from "../components/SignOutButton";
import { UserAuth } from "../context/AuthContext";

export default function Homepage() {
  const { user } = UserAuth(); // Used to display user name

  return (
    <div>
      <SearchBar/>
      Welcome {user?.displayName}
      <SignOutButton />
    </div>
  );
}
