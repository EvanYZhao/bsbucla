import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import SignOutButton from "../components/SignOutButton";
import CreateGroupButton from "../components/CreateGroupButton";
import { UserAuth } from "../context/AuthContext";
import Typography from '@mui/material/Typography';
import GroupCard from "../components/GroupCard";
import { getUserProfile } from "../database/mongodb";

export default function Homepage() {
  const { user } = UserAuth(); // Used to display user name
  const { groups, setGroups } = useState([]);

  useEffect(() => {
    getUserProfile(user?.accessToken)
    .then((resp) => {
      console.log(resp)
      setGroups(resp.groups);
    })
  }, [user, setGroups]);

  return (
    <div class="bg-slate-50 h-full">
      <div id="navTitle"
           class="w-full
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
      
      <GroupCard groupName="Monkeys"
                   peopleNum="20"
                   peopleTotal="30"
                   groupID="0"
        />
      {
        groups?.map((g) => <h1>g</h1>)
      }
    </div>
    
  );
}
