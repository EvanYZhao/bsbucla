import React, { useEffect, useId, useState } from "react";
import SearchBar from "../components/SearchBar";
import SignOutButton from "../components/SignOutButton";
import CreateGroupButton from "../components/CreateGroupButton";
import { UserAuth } from "../context/AuthContext";
import Typography from "@mui/material/Typography";
import GroupCard from "../components/GroupCard";
import { getUserProfile } from "../database/mongodb";
import { createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ChatBox from "../components/Chat/ChatBox";
import { CenterFocusStrong } from "@mui/icons-material";

const theme = createTheme();

export default function Homepage() {
  const { user } = UserAuth(); // Used to display user name
  const [groups, setGroups] = useState([]);
  const [chatDisplay, setChatDisplay] = useState(false);
  const [chatId, setChatId] = useState(null);
  const listId = useId();

  useEffect(() => {
    getUserProfile(user?.accessToken).then((profile) => {
      setGroups(profile.groups);
    });
  }, [user]);

  const displayChat = (id) => {
    setChatDisplay(true);
    setChatId(id);
    console.log("Chatting in dashboard for group: " + id);
  };

  return (
    <div className="bg-slate-100 h-full flex flex-col items-center">
      <div
        id="navTitle"
        className="w-full h-20 flex justify-center items-center"
        style={{ padding: "80px" }}
      >
        <Box bgcolor="#e4ecf0" borderRadius={4} p={2}>
          <Typography
            fontFamily="Manrope, sans-serif"
            fontSize="4.5rem"
            color="#3a586b"
          >
            <b>BRUIN STUDY BUDDIES </b>
          </Typography>
        </Box>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-3/4 grid grid-cols-2 gap-4">
          <Box borderRadius={3} p={2} mb={1} width="100%">
            {chatDisplay ? (
              <div className="h-[62vh]">
                  <ChatBox groupId={chatId} />
              </div>
            ) : (
              <Box marginTop={10}>
                <img src="https://i.imgur.com/wfvVfwq.png" alt="BSB" />
              </Box>
            )}
          </Box>
          <div className="flex flex-col space-y-2 items-center">
            {groups.length > 0 ? (
              <Box
                bgcolor="#e4ecf0"
                marginTop={2}
                borderRadius={3}
                p={2}
                mb={1}
                width="100%"
              >
                <div className="flex flex-col space-y-2 items-center">
                  <Typography
                    fontFamily="Manrope, sans-serif"
                    fontSize="2rem"
                    color="#3a586b"
                  >
                    GROUPS
                  </Typography>
                </div>
                <div className="h-[50vh] px-5 overflow-y-hidden hover:overflow-y-scroll">
                  {groups.map((g) => (
                    <Grid item xs={12} sm={6} md={4} key={listId}>
                      <div style={{ padding: "10px" }}>
                        <GroupCard
                          id={listId}
                          groupID={g}
                          place={"home"}
                          displayChat={() => displayChat(g)}
                        />
                      </div>
                    </Grid>
                  ))}
                </div>
              </Box>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
