import React, { useEffect, useId, useState } from "react";
import SearchBar from "../components/SearchBar";
import SignOutButton from "../components/SignOutButton";
import { UserAuth } from "../context/AuthContext";
import { queryCourseFromId, queryGroupsFromCourseId, queryGroupFromId, joinGroupById, leaveGroupById, createGroup } from "../database/mongodb";

export default function TestingPage() {
  const { user } = UserAuth();
  const [courseId, setCourseId] = useState(''); 
  const [course, setCourse] = useState({});
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState('');
  const [group, setGroup] = useState(undefined);

  const id = useId(); // FOR MAP KEYS, handles child key error

  // Whenever a new course is selected
  // Fetch the course information using courseId
  // Fetch the course's basic groups info using courseId
  useEffect(() => {
    const fetchData = async () => {
      if (courseId !== '' && courseId) {
        const data = await queryCourseFromId(courseId, user.accessToken);
        const groups = await queryGroupsFromCourseId(courseId, user.accessToken);
        setCourse(data);
        setGroups(groups);
      }
    }
    fetchData();
    console.log(user?.accessToken)
  }, [courseId, user.accessToken, setCourse, setGroups]);

  // This function will handle whether an old member wants to leave
  // Or a new member wants to join
  const joinButtonHandler = async () => {
    // Old member
    if (group?.members[0].hasOwnProperty('email')) {
      await leaveGroupById(groupId, user.accessToken);
    }
    // New member
    else {
      await joinGroupById(groupId, user.accessToken);
    }

    // Update data
    queryGroupFromId(groupId, user?.accessToken)
    .then(data => setGroup(data))
    .catch((err) => setGroup(undefined))

    const data = await queryCourseFromId(courseId, user.accessToken);
    const groups = await queryGroupsFromCourseId(courseId, user.accessToken);
    setCourse(data);
    setGroups(groups);
  }

  return (
    <div>
      <h1>{user?.displayName}</h1>
      <p>{user?.accessToken}</p>
      <SignOutButton />
      <br/>
      <SearchBar setcourseid={setCourseId}/>

      {
        // This section acts as a course description page
        // redirected to after clicking the course in the search bar

        // It will also contain a list of groups
        // associated with that course (mappings below)
      }
      <h2>Selected Course:</h2>
      <h3>Course ID: {courseId}</h3>
      <h3>Subject Area: {course?.subject} ({course?.subjectLabel})</h3>
      <h3>Course Number: {course?.number}</h3>
      <h3>Course Name: {course?.name}</h3>
      <h3>Available Groups ({groups.length ? groups.length : 0}):</h3>

      {
        // Each of these mappings can serve as a group card
        // This displays basic group information (name, member count)
        // The ID is only shown for test purposes, it will be passed in requests
      }
      {
        groups.map(group => {

          return (
            <div key={group._id}>
            <h4>Group ID: {group._id}</h4>
            <h4>{group.name}</h4>
            <h4>Members: {group.memberCount}</h4>
            </div>
          );
        }
        )
      }
      <br/>

      {
        // CREATE GROUP BASIC FORM
        // This will create a new group with name and courseId
      }
      <form onSubmit={async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const courseId = e.target.courseId.value;

        if (name !== '' && courseId !== '') {
          await createGroup(name, courseId, user.accessToken);
          const data = await queryCourseFromId(courseId, user.accessToken);
          const groups = await queryGroupsFromCourseId(courseId, user.accessToken);
          setCourse(data);
          setGroups(groups);
        }
      }}>
        <label>Name: </label><input id="name" type="text"></input>
        <label>CourseId: </label><input id="courseId" type="text"></input>
        <input type="submit" value="Submit" />
      </form>
      <br/>

      {
        // This section essentially serves as clicking on the group card
        // By clicking on a group card, you pass the group's ID to a request
        // To populate a new page with the group's extended information
      }
      <h2>Check out group by ID</h2>

      <form onSubmit={async (e) => {
        e.preventDefault();
        const value = e.target.groupId.value;
        if (value !== '') {
          queryGroupFromId(value, user?.accessToken)
          .then(data => setGroup(data))
          .catch((err) => {setGroup(undefined); console.log(err)})
        }
        else {
          setGroup(undefined);
        }
      }}>
        <input id="groupId" type="text" value={groupId} onChange={(e) => setGroupId(e.target.value)}></input>
        <button type="submit"> Submit </button>
      </form>

      {
        // JOIN/LEAVE GROUP BUTTON BASIC
        // This condition can be used to check if the user is in the group or not
        // The backend hides this property if the user is not in the group
        // The backend reveals this property if the user is in the group
      }
      <button onClick={joinButtonHandler}>{group?.members[0].hasOwnProperty('email') ? 'Leave group' : 'Join group'}</button>

      {
        // Extended group card
        // This card visualizes the extended group information
        // depending on whether the user is in the group or not

        // Displays member name, picture, (email)?
      }
      <h3>Group Name: {group?.name}</h3>
      <h3>Members:</h3>
      {
        group?.members.map(member => {
          return (
            <div key={id}>
            <h4>{member.name}</h4>
            {member.hasOwnProperty('email') ? <h5>{member.email}</h5> : <></>}
            {member.hasOwnProperty('picture') ? <img referrerpolicy="no-referrer" src={member.picture} alt="Pfp"></img> : <></>}
            </div>
          )
        })
      }
    </div>
  );
}
