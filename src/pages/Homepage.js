import React from "react";
import SearchBar from "../components/SearchBar";
import SignOutButton from "../components/SignOutButton";
import CreateGroupButton from "../components/CreateGroupButton";
import { UserAuth } from "../context/AuthContext";
import GroupCard from "../components/GroupCard";

export default function Homepage() {
  const { user } = UserAuth(); // Used to display user name

  return (
    <div>
      <SearchBar />
      Welcome {user?.displayName}
      <SignOutButton /> 
      <CreateGroupButton />
      <GroupCard groupName="name" peopleNum={3} peopleTotal={5} groupID="63f384e879ca42169116540c"/>
    </div>
    
  );
}
