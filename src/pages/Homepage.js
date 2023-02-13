import React from "react";
import SignOutButton from "../components/SignOutButton";
import GroupCard from "../components/GroupCard"
import { UserAuth } from "../context/AuthContext";

export default function Homepage() {
  const { user } = UserAuth(); // Used to display user name

  return (
    <div>
      Welcome {user?.displayName}
      <SignOutButton />
      <GroupCard groupName="group 1" peopleNum="1" peopleTotal="3" groupID="12345" />
    </div>
  );
}
