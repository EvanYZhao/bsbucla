import { Button, FormControl, Input, InputLabel, TextField, Typography } from "@mui/material";
import React, { useEffect, useId, useState } from "react";
import ChatBox from "../components/Chat/ChatBox";
import GroupCard from "../components/GroupCard";
import SearchBar from "../components/SearchBar";
import SignOutButton from "../components/SignOutButton";
import { UserAuth } from "../context/AuthContext";
import {
  queryCourseFromId,
  queryGroupsFromCourseId,
  queryGroupFromId,
  joinGroupById,
  leaveGroupById,
  createGroup,
} from "../database/mongodb";

export default function TestingPage() {
  const { user } = UserAuth();
  const [courseIdPrefix, setCourseIdPrefix] = useState('');
  const [courseByPrefix, setCourseByPrefix] = useState(null);
  const [groupsPrefix, setGroupsPrefix] = useState([]);
  
  const [courseId, setCourseId] = useState('');
  const [courseById, setCourseById] = useState(null);
  const [groupsCourseId, setGroupsCourseId] = useState([]);

  const [groupId, setGroupId] = useState('');
  const [group, setGroup] = useState(null);
  const [courseGroupId, setCourseGroupId] = useState(null);

  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupCourseId, setGroupCourseId] = useState('');
  const [groupMaxMembers, setGroupMaxMembers] = useState(0);
  const [groupIdResp, setGroupIdResp] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const groups = await queryGroupsFromCourseId(user?.accessToken, courseIdPrefix);
      setGroupsPrefix(groups);
      const course = await queryCourseFromId(user?.accessToken, courseIdPrefix);
      setCourseByPrefix(course);
    }
    if (courseIdPrefix)
      fetchData();
  }, [courseIdPrefix]);

  const fetchCourseById = async (e) => {
    e.preventDefault();
    const course = await queryCourseFromId(user?.accessToken, courseId);
    setCourseById(course);
    const groups = await queryGroupsFromCourseId(user?.accessToken, courseId);
    setGroupsPrefix(groups);
  }

  useEffect(() => {
    const fetchData = async () => {
      const groups = await queryGroupsFromCourseId(user?.accessToken, courseId);
      setGroupsCourseId(groups);
    }
    if (courseById)
      fetchData();
  }, [courseById]);

  const fetchGroupById = async (e) => {
    e.preventDefault();
    const group = await queryGroupFromId(user?.accessToken, groupId);
    setGroup(group);
  }

  useEffect(() => {
    const fetchData = async () => {
      const course = await queryCourseFromId(user?.accessToken, group.courseId);
      setCourseGroupId(course);
    }
    if (group)
      fetchData();
  }, [group])

  const joinGroup = async (e) => {
    e.preventDefault();
    await joinGroupById(user?.accessToken, groupId);
    await fetchGroupById(e);
  }
  
  const leaveGroup = async (e) => {
    e.preventDefault();
    await leaveGroupById(user?.accessToken, groupId);
    setGroup(null);
    if (group.courseId === courseIdPrefix) {
      const groups = await queryGroupsFromCourseId(user?.accessToken, courseIdPrefix);
      setGroupsPrefix(groups);
    }
  }

  const createGroupHandler = async (e) => {
    e.preventDefault();
    const group = await createGroup(user?.accessToken, {name: groupName, description: groupDesc, courseId: groupCourseId, maxMembers: groupMaxMembers});
    if (group) {
      setGroupIdResp(group.groupId);
      if (groupCourseId === courseIdPrefix) {
        const groups = await queryGroupsFromCourseId(user?.accessToken, courseIdPrefix);
        setGroupsPrefix(groups);
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Course Search By Prefix Test */}
      <div className="py-5 flex flex-col items-center space-y-5 bg-red-200 w-1/2">
        <Typography variant='h4'>Course Search By Prefix</Typography>
        <SearchBar setcourseid={setCourseIdPrefix} debug="true" />
        {
          courseByPrefix ? <>
            <Typography variant='h5'>{courseByPrefix?.subjectLabel} {courseByPrefix?.number}: {courseByPrefix?.name}</Typography>
            <Typography variant='h5'>CourseID: {courseIdPrefix}</Typography>
            <Typography variant='h5'>Professors:</Typography>
            <div className="flex flex-col items-center bg-fuchsia-200 w-1/2">
              {
                courseByPrefix?.professors?.map(prof => <Typography variant='h6'>{prof}</Typography>)
              }
            </div>
            <Typography variant='h5'>Groups:</Typography>
            {
              groupsPrefix?.map(group => 
                <div>
                <Typography variant="h5">{group._id}</Typography>
                <GroupCard groupID={group._id}/>
                </div>)
            }
          </> : <></>
        }
      </div>
      {/* Course Search By ID Test */}
      <div className="py-5 flex flex-col items-center space-y-5 bg-yellow-200 w-1/2">
        <Typography variant='h4'>Course Search By ID</Typography>
        <form onSubmit={fetchCourseById} className="flex space-x-5">
          <FormControl>
              <InputLabel>Course ID</InputLabel>
              <Input id="my-input" onChange={e => setCourseId(e.target.value)} />
          </FormControl>
          <Button variant="contained" type="submit">Search</Button>
        </form>
        {
          courseById ? <>
            <Typography variant='h5'>{courseById?.subjectLabel} {courseById?.number}: {courseById?.name}</Typography>
            <Typography variant='h5'>Professors:</Typography>
            <div className="flex flex-col items-center bg-orange-200 w-1/2">
              {
                courseById?.professors?.map(prof => <Typography variant='h6'>{prof}</Typography>)
              }
            </div>
            <Typography variant='h5'>Groups:</Typography>
            {
              groupsCourseId?.map(group => <div>
                <Typography variant="h5">{group._id}</Typography>
                <GroupCard groupID={group._id}/>
              </div>)
            }
          </> : <></>
        }
      </div>

      {/* Group Search By ID Test */}
      <div className="py-5 flex flex-col items-center space-y-5 bg-sky-200 w-1/2">
        <Typography variant='h4'>Group Search By ID</Typography>
        <form onSubmit={fetchGroupById} className="flex space-x-5">
          <FormControl>
              <InputLabel>Group ID</InputLabel>
              <Input id="my-input" onChange={e => setGroupId(e.target.value)} />
          </FormControl>
          <Button variant="contained" type="submit">Search</Button>
        </form>
        {
          group ? <>
            <Typography variant='h5'>Group: {group.name}</Typography>
            <Typography variant='h5'>{courseGroupId?.subjectLabel} {courseGroupId?.number}: {courseGroupId?.name}</Typography>
            <Typography variant='h5'>Description: {group.description}</Typography>
            <Typography variant='h5'>Members ({group.members.length}{group.maxMembers ? `/${group.maxMembers}` : ''})</Typography>
            <div className="flex flex-col items-center bg-blue-300 w-1/2 space-y-10 p-5">
              {
                group?.members?.map(member => 
                  <div className="flex flex-col w-3/4 items-center">
                    { member.hasOwnProperty('picture') ? <img className="w-1/2" src={member.picture} referrerPolicy='no-referrer' /> : <></> }
                    <Typography variant='h7'>{member.name}</Typography>
                    { member.hasOwnProperty('email') ? <Typography variant='h7'>{member.email}</Typography> : <></> }
                    { member.hasOwnProperty('major') && member.major !== '' ? <Typography variant='h7'>Major: {member.major}</Typography> : <></>}
                  </div>
                )
              }
            </div>
            <Button variant="contained" onClick={group?.members[0].hasOwnProperty('email') ? leaveGroup : joinGroup}>
              {group?.members[0].hasOwnProperty('email') ?  'Leave' : 'Join'}
            </Button>
            {
              group?.members[0].hasOwnProperty('email') ?
              <div className="bg-neutral-100 w-2/3 h-[500px]">
              <ChatBox groupId={group._id}/>
              </div>
              : <></>
            }
          </> : <></>
        }
      </div>

      {/* Create Group Test */}
      <div className="flex flex-col items-center space-y-5 bg-lime-200 w-1/2">
        <Typography variant='h4'>Create Group</Typography>
        <form onSubmit={createGroupHandler} className="flex flex-col space-y-5">
          <FormControl>
              <InputLabel>Group Name</InputLabel>
              <Input onChange={e => setGroupName(e.target.value)} />
          </FormControl>
          <FormControl>
              <InputLabel>Group Description</InputLabel>
              <Input onChange={e => setGroupDesc(e.target.value)} />
          </FormControl>
          <FormControl>
              <InputLabel>Course ID</InputLabel>
              <Input onChange={e => setGroupCourseId(e.target.value)} />
          </FormControl>
          <FormControl>
              <InputLabel>Max Members</InputLabel>
              <Input onChange={e => setGroupMaxMembers(e.target.value)} type="number" value={groupMaxMembers}/>
          </FormControl>
          <Button variant="contained" type="submit">Create</Button>
        </form>
        {
          groupIdResp ? <Typography variant='h6' className="text-center">New Group:<br/>{groupIdResp}</Typography> : <></>
        }
      </div>
    </div>
  )
}
