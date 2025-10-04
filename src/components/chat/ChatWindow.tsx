import React, { useState, useRef, useEffect } from "react";

import styles from "./ChatWindow.module.css";

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  currentUser: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSend, currentUser }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length === 0) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatMessages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.chatMessage} ${msg.user === currentUser ? styles.chatMessageSelf : styles.chatMessageOther}`}
          >
            <span className={styles.chatMessageUser}>
              {msg.user}:
            </span>{" "}
            <span className={styles.chatMessageText}>{msg.text}</span>
            <div className={styles.chatMessageTime}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className={styles.chatInputForm}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Skriv ett meddelande..."
          className={styles.chatInput}
        />
        <button type="submit" className={styles.chatSendButton}>
          Skicka
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;