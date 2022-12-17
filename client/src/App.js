import React from "react";
import "./styles/partials/global.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import OnboardingDogs from "./pages/OnboardingDogs";
import OnboardingUsers from "./pages/OnboardingUsers";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onboarding/users" element={<OnboardingUsers />} />
        {/* <Route path="/onboarding/dogs" element={<OnboardingDogs />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
