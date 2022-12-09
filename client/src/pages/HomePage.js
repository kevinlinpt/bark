import React, { useState } from "react";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import "./Homepage.scss";

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [isCreateAccount, setIsCreateAccount] = useState(true); // assume users are not signed up

  // user is not logged in
  const authToken = false;

  // open modal
  const handleClick = () => {
    setShowModal(true);
    setIsCreateAccount(true)
  };

  return (
    <div className="overlay">
      <Navbar
        minimal={false}
        setShowModal={setShowModal}
        showModal={showModal}
        setIsCreateAccount={setIsCreateAccount}
      />
      <div className="homepage">
        <h1 className="primary-title">Swipe. Match. Bark.</h1> {/* Love at First Bark */}
        <button className="primary-button" onClick={handleClick}>
          {authToken ? "Signout" : "Create Account"}
        </button>
        {showModal && (
          <AuthModal
            setShowModal={setShowModal}
            isCreateAccount={isCreateAccount}
            // setIsCreateAccount={setIsCreateAccount}
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;
