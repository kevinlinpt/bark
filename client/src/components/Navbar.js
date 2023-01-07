import React from "react";
import whiteLogo from "../assets/Images/bark_logo_paw2.png";
import { Link } from "react-router-dom";
import "../components/Navbar.scss";

function Navbar({
  authToken,
  minimal,
  setShowModal,
  showModal,
  setIsSignedUp,
}) {
  const handleClick = () => {
    setShowModal(true);
    setIsSignedUp(true);
  };

  return (
    <div className="navbar">
      <div className="logo-container">
        <Link to="/">
          <img className="logo" src={minimal ? whiteLogo : whiteLogo}></img>
        </Link>
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
