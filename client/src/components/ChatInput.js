import axios from "axios";
import React, { useState } from "react";
import "./ChatInput.scss";

function ChatInput({
  user,
  clickedUser,
  getUsersMessages,
  getClickedUsersMessages,
}) {
  const [textArea, setTextArea] = useState("");
  const userId = user?.user_id;
  const clickedUserId = clickedUser?.user_id;

  // send user's message to backend
  const addMessage = async () => {
    // set message to include the same keys as messages database collection
    const message = {
      timestamp: new Date(), // today's date
      from_userId: userId,
      to_userId: clickedUserId,
      message: textArea,
    };
    try {
      await axios
        .post("http://localhost:8080/message", {
          message,
        })
        .then((res) => {
          getUsersMessages();
          getClickedUsersMessages();
          setTextArea("");
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="chat-input">
      <textarea
        value={textArea}
        placeholder="Type a message"
        onChange={(e) => setTextArea(e.target.value)}
      />
      <button className="secondary-button" onClick={addMessage}>
        Send
      </button>
    </div>
  );
}

export default ChatInput;
