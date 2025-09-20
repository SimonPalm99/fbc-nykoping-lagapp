import React, { useState, useRef, useEffect } from "react";
import { useForum } from "../../context/ForumContext";
import { useUser } from "../../context/UserContext";

const Chat: React.FC = () => {
  const { chat, addChatMessage } = useForum();
  const { user, users } = useUser();
  const [msg, setMsg] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !msg.trim()) return;
    addChatMessage("main-chat", msg.trim(), "text");
    setMsg("");
  };

  // Scrolla ner automatiskt vid nytt meddelande
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <section style={{ background: "#262626", borderRadius: 10, padding: 14, margin: "16px 0", maxWidth: 500 }}>
      <h2>Lagchatt</h2>
      <div style={{ maxHeight: 200, overflowY: "auto", background: "#181818", borderRadius: 6, padding: 8, marginBottom: 8 }}>
  {chat.map((m: any) =>
          <div key={m.id} style={{ marginBottom: 4 }}>
            <span style={{ fontWeight: 600, color: "#6fe" }}>{users.find(u => u.id === m.userId)?.name || m.userId}</span>:
            <span style={{ marginLeft: 4 }}>{m.content}</span>
            <span style={{ color: "#999", fontSize: "0.8em", marginLeft: 8 }}>{m.createdAt.slice(11, 16)}</span>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: "flex" }}>
        <input value={msg} onChange={e => setMsg(e.target.value)} style={{ flex: 1 }} />
        <button type="submit" style={{ marginLeft: 8 }}>Skicka</button>
      </form>
    </section>
  );
};

export default Chat;