import React, { useEffect, useId, useState } from "react";
import SearchBar from "../components/SearchBar";
import SignOutButton from "../components/SignOutButton";
import CreateGroupButton from "../components/CreateGroupButton";
import { UserAuth } from "../context/AuthContext";
import Typography from "@mui/material/Typography";
import GroupCard from "../components/GroupCard";
import { getUserProfile, queryGroupFromId } from "../database/mongodb";

export default function Homepage() {
  const { user } = UserAuth(); // Used to display user name
  const [groups, setGroups] = useState([]);
  const listId = useId();

  useEffect(() => {
    getUserProfile(user?.accessToken).then((profile) => {
      setGroups(profile.groups);
    });
  }, [user]);

  return (
    <div className="bg-slate-100 h-full flex flex-col items-center">
      <div
        id="navTitle"
        className="w-full
                  h-20
                  flex
                  justify-center
                  items-center
           "
      >
        <Typography variant="h5">
          <b>My Dashboard</b>
        </Typography>
      </div>

      <div className="grid grid-cols-2 w-full px-24">
        <div className="flex flex-col space-y-6 items-center">
          <Typography variant="h5">Column 1 (Maybe Chatbox?)</Typography>
        </div>
        <div className="flex flex-col space-y-6 items-center">
          <Typography variant="h5">My Groups</Typography>
          <div className="w-1/2 space-y-4">
            {groups?.map((g) => (
              <div key={listId}>
                <GroupCard id={listId} groupID={g} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
