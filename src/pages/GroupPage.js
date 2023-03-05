import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { queryCourseFromId, queryGroupFromId } from "../database/mongodb";

export default function GroupPage() {
  //this is the group ID
  const { id } = useParams();
  const { user } = UserAuth();
  const [group, setGroup] = useState(undefined);
  const [course, setCourse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
    const groupData = await queryGroupFromId(id, user.accessToken);
    const courseData = await queryCourseFromId(groupData?.courseId, user.accessToken);
    setGroup(groupData);
    setCourse(courseData?.name);
    }
    fetchData();
  }, [user.accessToken, setGroup, setCourse]);

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
      
    </div>
  );
}