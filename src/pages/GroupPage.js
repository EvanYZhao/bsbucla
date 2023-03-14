import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import  Typography  from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { queryCourseFromId, queryGroupFromId, leaveGroupById, joinGroupById } from "../database/mongodb";
import {Button, Divider} from "@mui/material"
import { useNavigate } from "react-router-dom"
import ChatBox from "../components/Chat/ChatBox"

export default function GroupPage() {
  //this is the group ID
  const { id } = useParams();
  const { user } = UserAuth();
  const [group, setGroup] = useState(undefined);
  const [course, setCourse] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const groupData = await queryGroupFromId(user.accessToken, id);
      const courseData = await queryCourseFromId(
        user.accessToken,
        groupData?.courseId
      );
      setGroup(groupData);
      setCourse(courseData);
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
    setCourse(data);
    if (location.state === "home") {
      navigate("/home");
    } else {
      navigate(`/course/${course._id}`, { state: course });
    }
  };

  const theme = createTheme({});

  return (
    <div className="bg-slate-100 h-[90vh] flex flex-col items-center py-5">
      <Box
        bgcolor="#e4ecf0"
        borderRadius={5}
        className="text-center p-8 m-5"
      >
        <Typography 
          fontFamily="Manrope, sans-serif" 
          fontSize="2.5rem" 
          color="#3a586b"
          >
          <b>{group?.name}</b>
        </Typography>
        {
          group?.description !== '' ? 
            <Typography 
              fontFamily="Manrope, sans-serif" 
              fontSize="1.5rem" 
              color="#3a586b"
              className="p-3"
            >
              {group?.description}
            </Typography>
          : <></>
        }
        <Divider />
        <Typography 
          fontFamily="Manrope, sans-serif" 
          fontSize="2rem" 
          color="#3a586b"
          className="pt-3"
          >
          {course?.subjectLabel} {course?.number}: {course?.name}
        </Typography>
      </Box>
      <div className="flex w-full">
        {/* Members list */}
        <div 
          className="w-1/3 h-[50vh] px-5 overflow-y-hidden hover:overflow-y-scroll"
        >
          {group?.members.map((member, index) => {
            return (
              <div
                  key={index}
                  className="p-5 mb-8 rounded-2xl bg-neutral-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]"
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
                </div>
            );
          })}
        </div>
        <div className="w-2/3 h-[50vh]">
          <div className="h-full w-full">
            <ChatBox groupId={group?._id} />
          </div>
        </div>
      </div>
      <Button onClick={joinButtonHandler}>
        {group?.members[0].hasOwnProperty("email")
          ? "Leave group"
          : group?.maxMembers === group?.members.length
          ? "Group full"
          : "Join group"}
      </Button>
    </div>
  );
}
