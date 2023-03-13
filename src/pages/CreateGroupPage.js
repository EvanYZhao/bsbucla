import React, { useState } from "react";
import {
  Button,
  Box,
  TextField,
  Typography
} from "@mui/material";
import {
  createGroup,
} from "../database/mongodb";
import { UserAuth } from "../context/AuthContext";

export default function CreateGroup() {
  const { user } = UserAuth();

  const [errorMessage, setErrorMessage] = useState(null);
  const [groupId, setGroupId] = useState(null);

  const [groupName, setGroupName] = useState("");
  const [classId, setClassId] = useState("");
  const [maxPeople, setMaxPeople] = useState(0);
  const [description, setDescription] = useState("");
  
  const joinButtonHandler = () =>{
    const response = createGroup(user?.accessToken, {name: groupName, description: description, 
      courseId: classId, maxMembers: maxPeople})
      .then(result => setGroupId(result.groupId))
      .catch(err => setErrorMessage(err.response.data));
  };

  const clearButtonHandler = () =>{
    setDescription("");
    setGroupName("");
    setClassId("");
    setMaxPeople("");
  };

  const handleNameChange = e =>{
    setGroupName(e.target.value);
  };

  const handleClassIdChange = e =>{
    setClassId(e.target.value);
  };

  const handleMaxPeopleChange = e =>{
    setMaxPeople(e.target.value);
  };

  const handleDescriptionChange = e =>{
    setDescription(e.target.value);
  };

  const responseMessage = () =>{
    if (groupId && errorMessage != null){
      return `Group created! Group ID: ${groupId}`
    }
    else if (errorMessage){
      return errorMessage
    }
  };

  return (
    <div className="bg-slate-100 h-full flex flex-col items-center">
      <Typography variant="h2">
        Create your group:
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& > :not(style)': { m: 3 },
        }}
      >
        <TextField
          label="Group Name"
          onChange={handleNameChange}
          value={groupName}
        />
        <TextField
          label="Class ID"
          onChange={handleClassIdChange}
          value={classId}
        />
        <TextField
          label="Group size"
          type="number"
          onChange={handleMaxPeopleChange}
          value={maxPeople}
        />
      </Box>
      <TextField
          label="Group description"
          multiline
          rows={4}
          sx={{
            width:'500px'
          }}
          onChange={handleDescriptionChange}
          value={description}
        />
      <Button
        sx={{
          width: '200px',
          height: '50px',
          fontSize: '20px'
        }}
        onClick={joinButtonHandler}
      > 
        Create group 
      </Button>
      <Button onClick= {clearButtonHandler}>Clear form</Button>
      <Typography variant="h3">
        {responseMessage()}
      </Typography>
    </div>
  );
}
