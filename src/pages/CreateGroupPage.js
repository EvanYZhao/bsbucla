import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Box, TextField, Typography } from "@mui/material";
import { createGroup } from "../database/mongodb";
import { UserAuth } from "../context/AuthContext";

export default function CreateGroup() {
  const { user } = UserAuth();

  const [errorMessage, setErrorMessage] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [maxPeople, setMaxPeople] = useState(0);
  const [description, setDescription] = useState("");
  const location = useLocation();

  const joinButtonHandler = () => {
    createGroup(user?.accessToken, {
      name: groupName,
      description: description,
      courseId: location.state,
      maxMembers: maxPeople,
    })
      .then((result) => {
        setGroupId(result.groupId);
      })
      .catch((err) => setErrorMessage(err.response.data));
  };

  const clearButtonHandler = () => {
    setDescription("");
    setGroupName("");
    setMaxPeople("");
  };

  const handleNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleMaxPeopleChange = (e) => {
    setMaxPeople(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const responseMessage = () => {
    if (errorMessage) {
      return errorMessage;
    } else {
      return groupId && `Successfully Created Group!`
    }
  };

  return (
    <div className="bg-slate-100 h-full flex flex-col items-center">
      <Typography
        variant="h2"
        fontFamily="Manrope, sans-serif"
        fontSize="3.8rem"
        color="#3a586b"
        sx={{
          marginBottom: "20px",
          marginTop: "20px",
          backgroundColor: "#e4ecf0",
          padding: "16px",
          borderRadius: "10px",
        }}
      >
        Create your group:
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          "& > :not(style)": { m: 3 },
        }}
      >
        <TextField
          label="Group Name"
          onChange={handleNameChange}
          value={groupName}
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
          width: "500px",
        }}
        onChange={handleDescriptionChange}
        value={description}
      />
      <Button
        sx={{
          width: "200px",
          height: "50px",
          fontFamily: "Manrope, sans-serif",
          fontSize: "20px",
          borderRadius: "8px",
          color: "#3a586b",
          backgroundColor: "#e4ecf0",
          marginBottom: "16px",
          marginTop: "16px",
        }}
        onClick={joinButtonHandler}
      >
        Create group
      </Button>
      <Button
        sx={{
          width: "160px",
          height: "40px",
          fontFamily: "Manrope, sans-serif",
          fontSize: "16px",
          borderRadius: "8px",
          color: "#3a586b",
          backgroundColor: "#e4ecf0",
        }}
        onClick={clearButtonHandler}
      >
        Clear form
      </Button>
      <Typography variant="h3">{responseMessage()}</Typography>
    </div>
  );
}
