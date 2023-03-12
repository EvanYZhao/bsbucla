import React, { useState } from "react";
import {
  Button,
  Box,
  TextField,
  Typography
} from "@mui/material";

export default function CreateGroup() {
  //todo:
  //create a form for the user to type in their group requirements
  //group name, class, number of people max in group, a description
  //on submit:
  //save all the info and check it:
  //check if the groupname has been taken already
  //if it's been taken, dipslay message/highlight the name box and say it's been taken
  //message goes away once they resubmit and it's fine
  //if all data is valid, call the create group api with the given info
  //display a card that displays all the resulting information and a link to the group's page

  //for choosing the class to create the group for, do the autofill thing and save the class id for the api call later
  //on submit, have to check if all data is valid and filled out

  const [nameTaken, setNameTaken] = useState(false);
  
  const joinButtonHandler = async () =>{
    //do all checks for validity here
    //once all valid, call create group and set validity variables to true
    //if not valid, set the validity variables to false
    //should i do useeffect here to reset the page?
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
        />
        <TextField
          helperText=" "
          label="Class"
        />
        <TextField
          helperText=" " 
          label="Group size"
          type="number"
        />
      </Box>
      <TextField
          helperText=" "
          label="Group description"
          multiline
          rows={4}
          maxRows={10}
          sx={{
            width:'500px'
          }}
        />
      <Button
        sx={{
          width: '200px',
          height: '50px',
          fontSize: '20px'
        }}
        onClick={joinButtonHandler}
      > Create group </Button>
    </div>
  );
}
