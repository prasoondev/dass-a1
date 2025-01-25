import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'universal-cookie';

function Support() {
  const cookies = new Cookies();
  const token = cookies.get('token');
  const uid = cookies.get('userId');
  const [sessionId, setSessionId] = useState(null); // Store session ID
  const [messages, setMessages] = useState([]); // Store messages for the chat
  const [input, setInput] = useState(""); // User input field
  const SUPPORT_URL=`http://localhost:3000/support`;
  useEffect(() => {
    const configuration = {
      method: "get",
      url: SUPPORT_URL,
      headers: {
        'Content-Type': 'application/json',
        'userId': uid,
        'token': token,
      },
    };
    axios(configuration)
      .then((response) => {
        setSessionId(response.data.sessionId);
      })
      .catch((error) => {
        console.error("Error starting session:", error);
      });
  }, []);

  // Handle user message submission
  const handleSendMessage = () => {
    if (!input.trim() || !sessionId) return;

    const userMessage = input.trim();

    // Add user message to the chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput(""); // Clear the input field
    const configuration = {
      method: "post",
      url: SUPPORT_URL,
      headers: {
        'Content-Type': 'application/json',
        'userId': uid,
        'token': token,
        'sessionId': sessionId,
        'message': userMessage,
      },
    };
    // Send the message to the backend
    axios(configuration)
      .then((response) => {
        // Add bot reply to the chat
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: response.data.reply },
        ]);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

   return (
    <div className="chat-container">
      <div className="chat-box">
        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="input-field"
          />
        </div>
        <button onClick={handleSendMessage} className="send-button">
            Send
          </button>
      </div>
    </div>
  );
}

export default Support;
