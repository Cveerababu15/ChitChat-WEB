import React, { useState } from "react";
import "./ChatInput.css";

function ChatInput({ onSendMessage, onTyping }) {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  const handleSend = () => {
    if (!message.trim() || !username.trim()) return;

    // Send correct format to server
    onSendMessage(message, username);

    setMessage("");
    onTyping(username); // Stop typing after sent
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (username.trim()) {
      onTyping(username); // notify server user is typing
    }
  };

  return (
    <div className="chat-input-container">
      <input
        type="text"
        className="username-input"
        placeholder="Your name..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="text"
        className="message-input"
        placeholder="Type a message..."
        value={message}
        onChange={handleMessageChange}
        onKeyDown={handleKeyDown}
      />

      <button
        className="send-button"
        onClick={handleSend}
        disabled={!message.trim() || !username.trim()}
      >
        Send
      </button>
    </div>
  );
}

export default ChatInput;
