import React, { useRef, useEffect } from "react";
import "./MessageList.css";

function MessageList({ messages, currentUser }) {
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="messages-container">
      {(!messages || messages.length === 0) ? (
        <div className="no-messages">
          <div className="no-messages-icon">💬</div>
          <h3>No messages yet</h3>
          <p>Start the conversation! 👋</p>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isSentByMe = msg.type === "message" && msg.user === currentUser;

          return (
            <div
              key={index}
              className={`message ${
                msg.type === "system"
                  ? "system"
                  : isSentByMe
                  ? "sent"
                  : "received"
              }`}
            >
              {msg.type === "system" ? (
                <div className="message-text">{msg.text}</div>
              ) : (
                <>
                  <div className="message-user">{msg.user}</div>
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })
      )}
      <div ref={messageEndRef} />
    </div>
  );
}

export default MessageList;
