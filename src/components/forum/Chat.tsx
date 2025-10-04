import React, { useState, useRef, useEffect } from "react";
import { useForum } from "../../context/ForumContext";
import { useUser } from "../../context/UserContext";
import styles from "./Chat.module.css";

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
    <section className={styles.chatSection}>
      <h2 className={styles.chatHeader}>Lagchatt</h2>
      <div className={styles.chatMessages}>
        {chat.map((m: any) =>
          <div key={m.id} className={styles.chatMessage}>
            <span className={styles.chatUser}>{users.find(u => u.id === m.userId)?.name || m.userId}</span>:
            <span className={styles.chatContent}>{m.content}</span>
            <span className={styles.chatTime}>{m.createdAt.slice(11, 16)}</span>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSend} className={styles.chatForm}>
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          className={styles.chatInput}
          placeholder="Skriv ett meddelande..."
          title="Skriv ett meddelande"
        />
        <button type="submit" className={styles.chatButton}>Skicka</button>
      </form>
    </section>
  );
};

export default Chat;