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

/**
 *  Defines a set of functions that can be used throughout the application related to 
 * user login information and google sign-in or sign-out functionality
 * @returns {AuthContext.Provider} `AuthContext.Provider` Component
 */
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

/**
 * Import this function to access all the functions defined in the AuthContextProvider method above
 * @returns All defined functions within AuthContextProvider()
 */
export const UserAuth = () => {
  return useContext(AuthContext);
};
