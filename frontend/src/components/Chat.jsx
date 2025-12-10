import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ChatIn from "./ChatInput.jsx";
import MessageList from "./MessageList.jsx";
import "./Chat.css";

const socket = io( process.env.REACT_APP_SOCKET_URL ||"http://localhost:3001");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    // when socket connects
    socket.on("connect", () => {
      setConnected(true);
      setCurrentUser(socket.id);
    });

    // when socket disconnects
    socket.on("disconnect", () => {
      setConnected(false);
    });

    // system messages (join/leave etc.)
    socket.on("message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, type: "system" },
      ]);
    });

    // normal chat messages
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, type: "message" },
      ]);
    });

    // typing event
    socket.on("typing", (userId) => {
      setTypingUser(userId);
      setTimeout(() => {
        setTypingUser("");
      }, 2000);
    });

    // cleanup listeners on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
      socket.off("receiveMessage");
      socket.off("typing");
    };
  }, []);

  // send message to server
  const sendMessage = (text, user) => {
    if (text.trim()) {
      if (!currentUser && user) {
        setCurrentUser(user);
      }
      socket.emit("sendMessage", { text, user });
    }
  };

  // notify server that user is typing
  const handleTyping = (user) => {
    if (!currentUser && user) {
      setCurrentUser(user);
    }
    socket.emit("typing", user);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <div className="header-icon">💬</div>
          <div className="header-info">
            <h1>Real-Time Chat</h1>
          </div>
        </div>

        <div className="status">
          <div
            className={`status-dot ${
              connected ? "connected" : "disconnected"
            }`}
          ></div>
          <span>{connected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      <MessageList messages={messages} currentUser={currentUser} />

      {typingUser && typingUser !== currentUser && (
        <div className="typing-indicator">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>{typingUser} is typing...</span>
        </div>
      )}

      <ChatIn onSendMessage={sendMessage} onTyping={handleTyping} />
    </div>
  );
}

export default Chat;
