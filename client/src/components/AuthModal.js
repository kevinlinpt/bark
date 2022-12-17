import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthModal.scss";

const baseUrl = "http://localhost:8080";
const loginUrl = `${baseUrl}/login`;
const signupUrl = `${baseUrl}/signup`;

function AuthModal({ setShowModal, isSignedUp }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);

  let navigate = useNavigate;

  const handleClick = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isSignedUp && password != confirmPassword) {
        setError("The passwords do not match");
        return;
      }

      // send signup info to backend
      await axios
        .post(signupUrl, {
          email,
          password,
        })
        .then((res) => {
          console.log(res);
          const success = res.status === 201;

          // if sign-up is successful
          if (success) {
            navigate("/onboarding/users");
          }
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
