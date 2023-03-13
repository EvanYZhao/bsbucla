import React, { useState } from "react";
import {
  Button,
  Box,
  TextField,
  Typography
} from "@mui/material";
import GroupCard from "../components/GroupCard";
import {
  createGroup,
} from "../database/mongodb";
import { useParams } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

export default function CreateGroup() {
  //todo:
  //group name, class ID, number of people max in group, a description
  //for simplicity, make the user get the class ID rather than looking for it?
  //or let them type in the class name? and do a search bar type of deal
  const { id } = useParams();
  const { user } = UserAuth();

  const [errorMessage, setErrorMessage] = useState("");

  const [groupName, setGroupName] = useState("");
  const [classId, setclassId] = useState("");
  const [maxPeople, setMaxPeople] = useState(0);
  const [description, setDescription] = useState("");
  
  const joinButtonHandler = async () =>{
    const response = createGroup(user?.accessToken, {name: groupName, desc: description, 
      courseId: classId, maxMembers: maxPeople}).then(result => result)
      .catch(err => setErrorMessage(err))
    
  };

  const handleNameChange = e =>{
    setGroupName(e.target.value);
  };

  const handleclassIdChange = e =>{
    setclassId(e.target.value);
  };

  const handleMaxPeopleChange = e =>{
    setMaxPeople(e.target.value);
  };

  const handleDescriptionChange = e =>{
    setDescription(e.target.value);
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
        />
        <TextField
          label="Class"
          onChange={handleclassIdChange}
        />
        <TextField
          label="Group size"
          type="number"
          onChange={handleMaxPeopleChange}
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
    </div>
  );
}
