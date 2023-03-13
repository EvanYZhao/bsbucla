import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import  Typography  from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { queryCourseFromId, queryGroupFromId, leaveGroupById, joinGroupById } from "../database/mongodb";
import {Button} from "@mui/material"

export default function GroupPage() {
  //this is the group ID
  const { id } = useParams();
  const { user } = UserAuth();
  const [group, setGroup] = useState(undefined);
  const [course, setCourse] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const groupData = await queryGroupFromId(user.accessToken, id);
      const courseData = await queryCourseFromId(
        user.accessToken,
        groupData?.courseId
      );
      setGroup(groupData);
      setCourse(courseData?.name);
    };
    fetchData();
  }, [user.accessToken, setGroup, setCourse]);

  const joinButtonHandler = async () => {
    console.log("join button handler called");
    // Old member
    if (group?.members[0].hasOwnProperty("email")) {
      await leaveGroupById(user.accessToken, id);
    }
    // New member
    else {
      await joinGroupById(user.accessToken, id);
    }

    // Update data
    queryGroupFromId(id, user?.accessToken)
      .then((data) => setGroup(data))
      .catch((err) => setGroup(undefined));

    const data = await queryCourseFromId(user.accessToken, group?.courseId);
    setCourse(data?.name);
  };

  const theme = createTheme({
  
  });



  return (
    <div className="bg-slate-100 h-full flex flex-col items-center">
      <Box
        bgcolor ="#e4ecf0"
        marginTop={2}
        borderRadius={5}
        p={2.5}
        mb={3}

      >
        <Typography fontFamily="Manrope, sans-serif" fontSize="2.5rem" color="#3a586b">
          <b>GROUP NAME:</b> {group?.name}
        </Typography>
        <Typography fontFamily="Manrope, sans-serif" fontSize="2.5rem" color="#3a586b">
          <b>Course:</b> {course}
        </Typography>
      </Box>
      <Typography fontFamily="Manrope, sans-serif" fontSize="2rem" color="#3a586b">
        <b>Members:</b>
      </Typography>
      <Box
        width = "95%"
        bgcolor ="#e4ecf0"
        marginTop={2}
        borderRadius ={4}
        p={2.5}
        mb={3}
      >
      <Grid container spacing={2}>
        {group?.members.map((member, index) => {
          return (
            <Grid item xs={12} sm={6} key={index}>
              <Box
                bgcolor ="white"
                marginTop={2}
                borderRadius={2}
                p={2.5}
                mb={3}
                boxShadow = "8px 8px 0px 0px rgba(0, 0, 0, 0.1)"

              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  {member.hasOwnProperty("picture") ? (
                    <img
                      referrerPolicy="no-referrer"
                      src={member.picture}
                      alt="Pfp"
                      style={{ height: "64px", width: "64px", marginRight: "24px" }}
                    />
                  ) : (
                    <div style={{ height: "64px", width: "64px", marginRight: "24px", backgroundColor: "#85A8BA" }}></div>
                  )}
                  <div>
                    <Typography fontFamily="Manrope, sans-serif" fontSize="1.5rem" color="#3a586b">
                      {member.name}
                    </Typography>
                    {member.hasOwnProperty("email") ? (
                      <Typography fontFamily="Manrope, sans-serif" fontSize="1rem" color="#3a586b">
                        {member.email}
                      </Typography>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      </Box>
      <Button onClick={joinButtonHandler}>
        {group?.members[0].hasOwnProperty("email")
          ? "Leave group"
          : "Join group"}
      </Button>
    </div>
  );
  }