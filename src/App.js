import React from "react";
import { Route, Routes } from "react-router-dom";
import SigninPage from "./pages/SigninPage";
import Homepage from "./pages/Homepage";
import GroupPage from "./pages/GroupPage";
import Protected from "./components/Protected";
import { AuthContextProvider } from "./context/AuthContext";
import CreateGroupPage from "./pages/CreateGroupPage";

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
            path="/createGroup"
            element={
              <Protected>
                <CreateGroupPage />
              </Protected>
            }
          />
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
