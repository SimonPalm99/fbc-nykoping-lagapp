import React, { useState, useRef, useEffect } from "react";

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
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 6,
        maxWidth: 400,
        width: '100%',
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        background: "#fafbfc",
        height: 350,
      }}
      className="chat-window-responsive"
    >
      <div
        style={{
          maxHeight: 250,
          overflowY: "auto",
          padding: 8,
          flex: 1,
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              margin: "6px 0",
              background: msg.user === currentUser ? "#d0ebff" : "#eee",
              borderRadius: 4,
              padding: "5px 10px",
              alignSelf: msg.user === currentUser ? "flex-end" : "flex-start",
              textAlign: msg.user === currentUser ? "right" : "left",
              maxWidth: "75%",
            }}
          >
            <span style={{ fontWeight: "bold", fontSize: 12 }}>
              {msg.user}:
            </span>{" "}
            <span style={{ fontSize: 14 }}>{msg.text}</span>
            <div style={{ fontSize: 10, color: "#888" }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", borderTop: "1px solid #ccc", padding: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Skriv ett meddelande..."
          style={{ flex: 1, padding: 8, border: "none", outline: "none", borderRadius: 4, background: "#fff" }}
        />
        <button type="submit" style={{ padding: "0 16px", marginLeft: 8 }}>
          Skicka
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;