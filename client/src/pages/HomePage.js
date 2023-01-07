import React, { useState } from "react";
import { useCookies } from "react-cookie";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import "./HomePage.scss";

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false); // assume users are not signed up
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  // user is not logged in
  const authToken = cookies.AuthToken;

  // open modal for create account if not logged in, otherwise, signout
  const handleClick = () => {
    if (authToken) {
      removeCookie("UserId", cookies.UserId);
      removeCookie("AuthToken", cookies.AuthToken);
      window.location.reload();
      return;
    }
    setShowModal(true);
    setIsSignedUp(false);
  };

  return (
    <div className="overlay">
      <Navbar
        authToken={authToken}
        minimal={false}
        setShowModal={setShowModal}
        showModal={showModal}
        setIsSignedUp={setIsSignedUp}
      />
      <div className="homepage">
        <h1 className="primary-title">Swipe. Match. Bark.</h1>{" "}
        <button className="primary-button" onClick={handleClick}>
          {authToken ? "Signout" : "Create Account"}
        </button>
        {showModal && (
          <AuthModal setShowModal={setShowModal} isSignedUp={isSignedUp} />
        )}
      </div>
    </div>
  );
}

export default HomePage;
