import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import ChatInput from "./ChatInput";
import axios from "axios";
import "./ChatDisplay.scss";

function ChatDisplay({ user, clickedUser }) {
  const [usersMessages, setUsersMessages] = useState(null);
  const [clickedUsersMessages, setClickedUsersMessages] = useState(null);

  const userId = user?.user_id;
  const clickedUserId = clickedUser?.user_id;

  // GET messages of user
  const getUsersMessages = async () => {
    try {
      await axios
        .get("http://localhost:8080/messages", {
          params: { userId: userId, correspondingUserId: clickedUserId },
        })
        .then((res) => {
          setUsersMessages(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // GET messages of clicked user
  const getClickedUsersMessages = async () => {
    try {
      await axios
        .get("http://localhost:8080/messages", {
          params: { userId: clickedUserId, correspondingUserId: userId },
        })
        .then((res) => {
          setClickedUsersMessages(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsersMessages();
    getClickedUsersMessages();
  }, []);

  // store all reformatted messages from user and clicked user
  const messages = [];
  // user messages
  usersMessages?.forEach((message) => {
    // reformat returned db message collection data to only include first name, message, timestamp and url
    const formattedMessage = {};
    formattedMessage["name"] = user?.first_name;
    formattedMessage["img"] = user?.url_1;
    formattedMessage["message"] = message?.message;
    formattedMessage["timestamp"] = message?.timestamp;
    messages.push(formattedMessage);
  });

  // clicked user's messages
  clickedUsersMessages?.forEach((message) => {
    // reformat returned db message collection data to only include first name, message, timestamp and url
    const formattedMessage = {};
    formattedMessage["name"] = clickedUser?.first_name;
    formattedMessage["img"] = clickedUser?.url_1;
    formattedMessage["message"] = message?.message;
    formattedMessage["timestamp"] = message?.timestamp;
    messages.push(formattedMessage);
  });

  // sort messages by timestamp
  const descendingOrderMessages = messages?.sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );

  return (
    <>
      <Chat
        clickedUser={clickedUser}
        descendingOrderMessages={descendingOrderMessages}
      />
      <ChatInput
        user={user}
        clickedUser={clickedUser}
        getUsersMessages={getUsersMessages}
        getClickedUsersMessages={getClickedUsersMessages}
      />
    </>
  );
}

export default ChatDisplay;
