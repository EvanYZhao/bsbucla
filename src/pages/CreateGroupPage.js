import React, { useState } from "react";
import {
  Button,
  Box,
  TextField,
  Typography
} from "@mui/material";
import GroupCard from "../components/GroupCard";
import {
  queryCourseFromId,
  queryGroupsFromCourseId,
  queryGroupFromId,
  joinGroupById,
  leaveGroupById,
  createGroup,
} from "../database/mongodb";
import { useParams } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

export default function CreateGroup() {
  //todo:
  //group name, class, number of people max in group, a description
  //NEED HELP: for choosing the class to create the group for, do the autofill thing and save the class id for the api call later
  const { id } = useParams();
  const { user } = UserAuth();

  const [nameTaken, setNameTaken] = useState(false);
  const [allValid, setAllValid] = useState(true);

  const [groupName, setGroupName] = useState("");
  const [className, setClassName] = useState("");
  const [maxPeople, setMaxPeople] = useState(0);
  const [description, setDescription] = useState("");
  
  const joinButtonHandler = async () =>{
    //do all checks for validity here
    //once all valid, call create group, reset form to empty, and display a clickable card that routes to their newly create group page 
      //also displays a message that says "you can view your groups on the home page" or something like that
    //if not valid, set the validity variables to false 
    //should i do useeffect here to reset the page to make the values display as false?
    
    /*if (allValid){
      //call create group
      groupData = createGroup
      return(
        GroupCard(groupData._id)
      );
    }*/
    //NEED HELP: displaying the card underneath
  };

  const handleNameChange = e =>{
    setGroupName(e.target.value);
  };

  const handleClassNameChange = e =>{
    setClassName(e.target.value);
    //want to do the search bar like thing here but not sure how to get the id from that
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
          helperText= {nameTaken ? "Name already taken":" "}
          label="Group Name"
          onChange={handleNameChange}
        />
        <TextField
          helperText=" "
          label="Class"
          onChange={handleClassNameChange}
        />
        <TextField
          helperText=" " 
          label="Group size"
          type="number"
          onChange={handleMaxPeopleChange}
        />
      </Box>
      <TextField
          helperText=" "
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
