import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import Button from '@mui/material-next/Button';
//npm install /@mui/material-next
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { queryCourseFromId, queryGroupFromId, leaveGroupById, joinGroupById } from "../database/mongodb";

export default function GroupPage() {
  //this is the group ID
  const { id } = useParams();
  const { user } = UserAuth();
  const [group, setGroup] = useState(undefined);
  const [course, setCourse] = useState('');

  useEffect(() => {
    console.log("use effect called");
    const fetchData = async () => {
    const groupData = await queryGroupFromId(id, user.accessToken);
    const courseData = await queryCourseFromId(groupData?.courseId, user.accessToken);
    setGroup(groupData);
    setCourse(courseData?.name);
    }
    fetchData();
  }, [user.accessToken, setGroup, setCourse]);

  const joinButtonHandler = async () => {
    console.log("join button handler called");
    // Old member
    if (group?.members[0].hasOwnProperty('email')) {
      await leaveGroupById(id, user.accessToken);
    }
    // New member
    else {
      await joinGroupById(id, user.accessToken);
    }

    // Update data
    queryGroupFromId(id, user?.accessToken)
    .then(data => setGroup(data))
    .catch((err) => setGroup(undefined))

    const data = await queryCourseFromId(group?.courseId, user.accessToken);
    setCourse(data?.name);
  }

  const theme = createTheme({
  
  });



  return (
    <div class="bg-slate-100 h-full flex flex-col items-center gradient" theme ={theme}>
      <div >
      <div style={{ marginBottom: '10px' }}>
        <Typography fontFamily="Inder, sans-serif" fontSize="2rem" color="#738b95">Group Name:</Typography>
        <Typography>{group?.name}</Typography>
      </div>
      
      <div>
        <Typography fontFamily="Inder, sans-serif" fontSize="2rem" color="#738b95">Course:</Typography>
        <Typography>{course}</Typography>
      </div>
      {group?.members.map(member => {
      return (
        <div key={id}>
        <h4>{member.name}</h4>
        {member.hasOwnProperty('email') ? <h5>{member.email}</h5> : <></>}
        {member.hasOwnProperty('picture') ? <img referrerpolicy="no-referrer" src={member.picture} alt="Pfp"></img> : <></>}
        </div>
      );
      })}
      <div>
        <Button size = "large" variant = "elevated" color = "#ffffff" onClick={joinButtonHandler}>{group?.members[0].hasOwnProperty('email') ? 'Leave group' : 'JOIN GROUP'}</Button>
      </div>
      </div>
    </div>
  );
}