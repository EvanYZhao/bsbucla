import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { Button } from "@mui/material";
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

  return (
    <div>
      <h3>Group Name: {group?.name}</h3>
      <h3>Course: {course}</h3>
      <h3>Members: </h3>
      {group?.members.map(member => {
      return (
        <div key={id}>
        <h4>{member.name}</h4>
        {member.hasOwnProperty('email') ? <h5>{member.email}</h5> : <></>}
        {member.hasOwnProperty('picture') ? <img referrerpolicy="no-referrer" src={member.picture} alt="Pfp"></img> : <></>}
        </div>
      );
      })}
      <Button onClick={joinButtonHandler}>{group?.members[0].hasOwnProperty('email') ? 'Leave group' : 'Join group'}</Button>
    </div>
  );
}