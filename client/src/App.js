import React from "react";
import "./styles/partials/global.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import OnboardingDogs from "./pages/OnboardingDogs";
import OnboardingUsers from "./pages/OnboardingUsers";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const authToken = cookies.AuthToken
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {authToken && <Route path="/dashboard" element={<Dashboard />} />}
        {authToken && <Route path="/onboarding/users" element={<OnboardingUsers />} />}
        {/* <Route path="/onboarding/dogs" element={<OnboardingDogs />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
