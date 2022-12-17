import React from 'react'
import ChatHeader from './ChatHeader'
import MatchesDisplay from "./MatchesDisplay"
import ChatDisplay from "./ChatDisplay"
import "./ChatContainer.scss"

function ChatContainer({user}) {
  return (
    <div className="chat-container">
      <ChatHeader user={user}/>

      <button className="option">Matches</button>
      <button className="option">Chat</button>

      <MatchesDisplay/>
      <ChatDisplay/>
    </div>
  )
}

export default ChatContainer