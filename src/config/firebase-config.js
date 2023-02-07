// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9n8qefzoqJDPLPP6iELT2sh7YVpbFIco",
  authDomain: "cs35l-studyspaces.firebaseapp.com",
  projectId: "cs35l-studyspaces",
  storageBucket: "cs35l-studyspaces.appspot.com",
  messagingSenderId: "699948657583",
  appId: "1:699948657583:web:7e3dc32823adebe36f5d5a"
};

// Initialize Firebase along with any SDKs
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)