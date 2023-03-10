import React, { useEffect, useId, useState } from "react";
import SearchBar from "../components/SearchBar";
import SignOutButton from "../components/SignOutButton";
import CreateGroupButton from "../components/CreateGroupButton";
import { UserAuth } from "../context/AuthContext";
import Typography from '@mui/material/Typography';
import GroupCard from "../components/GroupCard";
import { getUserProfile, queryGroupFromId } from "../database/mongodb";


import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({

});

export default function Homepage() {
  const { user } = UserAuth(); // Used to display user name
  const [ groups, setGroups ] = useState([]);
  const listId = useId();

  useEffect(() => {
    getUserProfile(user?.accessToken)
    .then(profile => {
      setGroups(profile.groups)
    });
  }, [user]);

  return (
    
    <div class="bg-slate-100 h-full flex flex-col items-center" >
      <div id="navTitle"
           class="w-full
                  h-20
                  flex
                  justify-center
                  items-center
           "
      >
        <Typography fontfamily = "Helvetica Neue" fontSize = '1.9rem'>
        <b>My Dashboard</b>
        </Typography>
      </div>
      
      <div class="grid grid-cols-2 w-full px-24">
      <div class="flex flex-col space-y-6 items-center">
        <Typography  variant="h5">
          Column 1 (Maybe Chatbox?)
          </Typography>
        </div>
        <div class="flex flex-col space-y-6 items-center">
          <Typography variant="h5">
          GROUPS
          </Typography>
          <div class="w-1/2 space-y-4">
            {
              groups?.map((g) => <GroupCard id={listId} groupID={g}/>)
            }
          </div>
        </div>
      </div>
    </div>
    
  );
}
