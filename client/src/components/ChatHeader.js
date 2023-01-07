import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "./ChatHeader.scss";

function ChatHeader({ user }) {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const navigate = useNavigate();

  // remove cookies on logout
  const logout = () => {
    removeCookie("UserId", cookies.UserId);
    removeCookie("AuthToken", cookies.AuthToken);
    navigate("/");
  };

  return (
    <div className="chat-container-header">
      <div className="profile">
        <div className="img-container">
          <img src={user.url_1} alt={"photo of " + user.first_name} />
        </div>
        <h3 className="chat-container-header__name">{user.first_name}</h3>
      </div>
      <i className="log-out-icon" onClick={logout}>
        ⇦
      </i>
    </div>
  );
}

export default ChatHeader;
