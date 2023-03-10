import React, { useEffect } from "react";
import { GoogleButton } from "react-google-button";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { Typography, AppBar, Card, CardActions, CardContent, CardMedia, CssBaseline,Grid, Toolbar, Container } from "@mui/material";
// import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import App from "../App";
import { PeopleAlt } from "@mui/icons-material";
import { ClassNames } from "@emotion/react";






export default function SigninPage() {


  const { googleSignIn, user } = UserAuth();
  const navigate = useNavigate();

  //Sign in handler
  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  //Navigates to landing page automatically if user is signed in
  //Runs on mount and everytime the user object changes
  useEffect(() => {
    if (user != null) {
      navigate("/home");
    }
  }, [user]);


  return (

    <div>

          <div class = 'centered' >
            
              <Container height = '10em' display =  'flex' align =  'center' justify-content ='center' >
                <img src="https://i.imgur.com/ASEMnGG.png" alt="BSB" width = '100'/>
                <img src="https://i.imgur.com/cvZnH8a.png" alt="Bruin Study Buddies" width = '450'/>
            
                <GoogleButton onClick={handleSignIn} type = "light" />
              </Container>
           

        </div>

   
    </div>



  );
}
