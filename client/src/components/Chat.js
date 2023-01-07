import React from "react";
import moment from "moment/moment";
import "./Chat.scss";

function Chat({ clickedUser, descendingOrderMessages }) {
  return (
    <>
      <div className="chat-display">
        <div className="chat-display-header">
          You matched with {clickedUser.first_name}
        </div>
        {descendingOrderMessages.map((message, _index) => {
          const messageDateFormatted = moment(message.timestamp).format(
            "MM/DD/YYYY, h:mm A"
          );
          return (
            <div className="chat-message-container" key={{ _index }}>
              <div className="chat-message-timestamp">
                {messageDateFormatted}
              </div>
              <div className="chat-message-header">
                <div className="img-container">
                  <img src={message.img} alt={message.name + " profile"}></img>
                </div>
              </div>
              <p className="message">{message.message}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Chat;
