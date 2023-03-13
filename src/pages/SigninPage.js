import React, { useEffect } from "react";
import { GoogleButton } from "react-google-button";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { Container } from "@mui/material";

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
    <div class ="grad"> 
      <div> 
          <div class = 'centered' >
            
              <Container height = '10em' display =  'flex' align =  'center' justify-content ='center' >
                <img src="https://i.imgur.com/P06aj1I.png" alt="BSB" width = '100'/>
                <img src="https://i.imgur.com/cvZnH8a.png" alt="Bruin Study Buddies" width = '450'/>
            
                <GoogleButton onClick={handleSignIn} type = "light" />
              </Container>
           

          </div>
        </div>
    </div>



  );
}
