import React from "react";
import { Route, Routes } from "react-router-dom";
import SigninPage from "./pages/SigninPage";
import Homepage from "./pages/Homepage";
import Protected from "./components/Protected";
import { AuthContextProvider } from "./context/AuthContext";

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
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
