import React from "react";
import { Route, Routes } from "react-router-dom";
import SigninPage from "./pages/SigninPage";
import Homepage from "./pages/Homepage";
import GroupPage from "./pages/GroupPage";
import Protected from "./components/Protected";
import { AuthContextProvider } from "./context/AuthContext";
import TestingPage from "./ENDPOINT_TESTING/Testing";
import CoursePage from "./pages/CoursePage";
function App() {
  return (
    <div>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<SigninPage />} />
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
                <CoursePage />
              </Protected>
            }
          />
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
