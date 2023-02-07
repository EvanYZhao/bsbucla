import React, { useEffect } from "react";
import { GoogleButton } from "react-google-button";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

  return <GoogleButton onClick={handleSignIn} />;
}
