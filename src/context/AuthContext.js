import React from "react";
import { useContext, createContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebase-config";

const AuthContext = createContext();

//Component wrapper which provides context values in App.js
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  //Sign in logic (Popup signin)
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  //Sign out logic
  const googleSignOut = () => {
    signOut(auth);
  };

  //Sets user object everytime the authorization state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  //Refactored context wrapper into parent component (Best practice)
  return (
    <AuthContext.Provider value={{ googleSignIn, googleSignOut, user }}>
      {children}
    </AuthContext.Provider>
  );
};

//Creation of value that stores context API and values
export const UserAuth = () => {
  return useContext(AuthContext);
};
