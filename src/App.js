import React from "react";
import { Route, Routes } from "react-router-dom";
import SigninPage from "./pages/SigninPage";
import Homepage from "./pages/Homepage";
import GroupPage from "./pages/GroupPage";
import Protected from "./components/Protected";
import { AuthContextProvider } from "./context/AuthContext";
import CreateGroupPage from "./pages/CreateGroupPage";
import CoursePage from "./pages/CoursePage";
import TestingPage from "./ENDPOINT_TESTING/Testing";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div class="flex flex-col h-screen">
      <AuthContextProvider>
        <Navbar/>
        <Routes>
          <Route path="/" element={<SigninPage />} />
          <Route
            path="testing" // Tentative testing page DO NOT DELETE
            element={
              <Protected>
                <TestingPage />
              </Protected>
            }
          />
          <Route
            path="/group/:id"
            element={
              <Protected>
                <GroupPage />
              </Protected>
            }
          />
          <Route
            path="/course/:id"
            element={
              <Protected>
                <CoursePage />
              </Protected>
            }
          />
          <Route
            path="/home"
            element={
              <Protected>
                <Homepage />
              </Protected>
            }
          />
          <Route
            path="/group/:id"
            element={
              <Protected>
                <GroupPage />
              </Protected>
            }
          />
          <Route
            path="/testing"
            element={
              <Protected>
                <TestingPage />
              </Protected>
            }
          />
          <Route
            path="/course/:id"
            element={
              <Protected>
              </Protected>
            }
          />
        </Routes>
      </AuthContextProvider>
    </>
  );
}
export default App;