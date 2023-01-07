import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./AuthModal.scss";

const baseUrl = "http://localhost:8080";
const loginUrl = `${baseUrl}/login`;
const signupUrl = `${baseUrl}/signup`;

function AuthModal({ setShowModal, isSignedUp }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const navigate = useNavigate();

  const handleClick = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isSignedUp && password !== confirmPassword) {
        setError("The passwords do not match");
        return;
      }

      // send signup/login info to backend
      await axios
        .post(!isSignedUp ? signupUrl : loginUrl, {
          email,
          password,
        })
        .then((res) => {
          // save user id and token as cookies on website
          setCookie("UserId", res.data.userId);
          setCookie("AuthToken", res.data.token);

          // success if status 201 is sent from backend
          const success = res.status === 201;

          // if sign-up is successful, navigate to onboarding page
          if (success && !isSignedUp) {
            navigate("/onboarding/users");
          }
          // if login is successful, navigate to dashboard page
          if (success && isSignedUp) {
            navigate("/dashboard");
          }
          window.location.reload();
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth-modal">
      <div className="close-icon" onClick={handleClick}>
        ⓧ
      </div>
      <h2> {!isSignedUp ? "CREATE ACCOUNT" : "LOG IN"}</h2>
      {
        <p>
          By clicking Log In, you agree to our terms. Learn how we process your
          data in our Privacy Policy and Cookie Policy.
        </p>
      }
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="email"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isSignedUp && (
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="confirm password"
            required={true}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <input className="secondary-button" type="submit"></input>
        <p>{error}</p>
      </form>
      <hr />
      <h2>GET THE APP</h2>
    </div>
  );
}

export default AuthModal;
