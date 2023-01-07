import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import OnboardingUsers from "./pages/OnboardingUsers";
import "./styles/partials/global.css";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const authToken = cookies.AuthToken;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {authToken && <Route path="/dashboard" element={<Dashboard />} />}
        {authToken && (
          <Route path="/onboarding/users" element={<OnboardingUsers />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
