import React from "react";
import colorLogo from "../assets/Images/bark_logo.PNG";
import whiteLogo from "../assets/Images/bark_logo_paw2.png";
import "../components/Navbar.scss";

function Navbar({ minimal, setShowModal, showModal, setIsCreateAccount }) {
  const handleClick = () => {
    setShowModal(true);
    setIsCreateAccount(false)
  };

  const authToken = false;
  return (
    <div className="navbar">
      <div className="logo-container">
        <img className="logo" src={minimal ? whiteLogo : whiteLogo}></img>
      </div>
      {!authToken && !minimal && (
        <button
          className="nav-button"
          onClick={handleClick}
          disabled={showModal}
        >
          Log in
        </button>
      )}
    </div>
  );
}

export default Navbar;
