import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
// import { players } from '../data/players';

// Responsiv styling för chatten
const chatResponsiveStyle = document.createElement('style');
chatResponsiveStyle.innerHTML = `
  @media (max-width: 800px) {
    .fbc-chat-root {
      flex-direction: column !important;
    }
    .fbc-chat-sidebar {
      width: 100vw !important;
      min-width: 0 !important;
      border-right: none !important;
      border-bottom: 2px solid #2E7D32 !important;
      box-shadow: none !important;
      border-radius: 0 0 1.2rem 1.2rem !important;
    }
    .fbc-chat-main {
      padding: 0 !important;
    }
    .fbc-chat-header {
      padding: 1rem 1.2rem !important;
      gap: 0.7rem !important;
    }
    .fbc-chat-messages {
      padding: 1.2rem 1rem 1rem 1rem !important;
    }
    .fbc-chat-input {
      padding: 1rem 1rem !important;
    }
  }
`;
document.head.appendChild(chatResponsiveStyle);

// Typer
type Message = {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  type: "text" | "image" | "file";
  replyTo?: string | undefined;
  likes?: string[];
  status?: "sent" | "delivered" | "read";
  fileUrl?: string;
  fileMime?: string;
};

// Typen ChatRoom:
type ChatRoom = {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  participants: string[];
  creatorId: string;
};

const getStyles = (isDark: boolean) => ({
  primaryGreen: "#2E7D32",
  accentGreen: "#4CAF50",
  fbcGold: "#FFB300",
  cardBackground: isDark ? "rgba(16, 32, 16, 0.97)" : "#FFFFFF",
  textPrimary: isDark ? "#F1F8E9" : "#1B5E20",
  textSecondary: isDark ? "#C8E6C9" : "#4A5568",
  gradients: {
    primary: "linear-gradient(135deg, #2E7D32 0%, #388E3C 50%, #4CAF50 100%)",
    gold: "linear-gradient(135deg, #FFB300 0%, #FF8F00 100%)",
    body: isDark
      ? "linear-gradient(135deg, #0A0A0A 0%, #0D1B0D 30%, #1B2E1B 100%)"
      : "linear-gradient(135deg, #FAFAFA 0%, #F1F8E9 30%, #E8F5E9 100%)",
    cardHover: isDark
      ? "linear-gradient(135deg, rgba(46, 125, 50, 0.25) 0%, rgba(56, 142, 60, 0.25) 100%)"
      : "linear-gradient(135deg, rgba(46, 125, 50, 0.07) 0%, rgba(56, 142, 60, 0.07) 100%)",
  },
});

const Chat: React.FC = () => {
  // Skapa grupp-modal
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', avatar: '', participants: [] as string[] });
  const chatMainRef = React.useRef<HTMLDivElement | null>(null);
  const { isDark } = useTheme();
  const { user, users } = useUser();
  const styles = getStyles(isDark);
  // Demo-data
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  // Swipe-funktion för att byta rum på mobil
  const touchStartX = React.useRef<number | null>(null);
  // Lägg till state för bekräftelse-popup och vald grupp att ta bort:
  const [confirmDeleteGroupId, setConfirmDeleteGroupId] = useState<string | null>(null);

  // Utility: Spara och hämta chatRooms och messages från localStorage
  const CHATROOMS_KEY = 'fbc-chat-rooms';
  const MESSAGES_KEY_PREFIX = 'fbc-chat-messages-';

  // Ladda chatRooms från localStorage vid start
  useEffect(() => {
    const storedRooms = localStorage.getItem(CHATROOMS_KEY);
    if (storedRooms) {
      setChatRooms(JSON.parse(storedRooms));
    }
  }, []);

  // Spara chatRooms till localStorage när de ändras
  useEffect(() => {
    localStorage.setItem(CHATROOMS_KEY, JSON.stringify(chatRooms));
  }, [chatRooms]);

  // useEffect för att ladda meddelanden per rum
  useEffect(() => {
    if (!selectedRoom) return;
    const storedMessages = localStorage.getItem(MESSAGES_KEY_PREFIX + selectedRoom);
    setMessages(storedMessages ? JSON.parse(storedMessages) : []);
  }, [selectedRoom]);

  // useEffect för att spara meddelanden per rum
  useEffect(() => {
    if (!selectedRoom) return;
    localStorage.setItem(MESSAGES_KEY_PREFIX + selectedRoom, JSON.stringify(messages));
  }, [messages, selectedRoom]);

  // useEffect för att scrolla till chatten när en grupp väljs
  useEffect(() => {
    if (selectedRoom && chatMainRef.current) {
      chatMainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedRoom]);

  // useEffect för att hantera "användare skriver..."
  useEffect(() => {
    setIsTyping(newMessage.length > 0);
  }, [newMessage]);

  // useEffect för att hantera meddelanden och rum (utan demo)
  useEffect(() => {
    setLoading(false);
  }, [user?.id]);

  // useEffect för att hantera datumavgränsare
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const lastMessageDate = lastMessage ? new Date(lastMessage.timestamp).toLocaleDateString() : null;
      const now = new Date();
      const isSameDay = lastMessageDate === now.toLocaleDateString();
      if (!isSameDay) {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: "date-separator-" + Date.now(),
            userId: "",
            userName: "",
            content: lastMessageDate,
            timestamp: new Date().toISOString(),
            type: "text",
            status: "sent",
          } as any
        ]);
      }
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    if (editingId) {
      setMessages(prev => prev.map(m => m.id === editingId ? { ...m, content: newMessage } : m));
      setEditingId(null);
      setNewMessage("");
      setReplyTo(null);
      return;
    }
    const message: Message = {
      id: Date.now().toString(),
      userId: user?.id || "current-user",
      userName: user?.name || "Du",
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
      replyTo: replyTo || undefined,
      likes: [],
      status: "sent",
    };
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    setReplyTo(null);
  };

  // Hantera filuppladdning
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Simulera uppladdning (ersätt med riktig uppladdning vid backend)
    setTimeout(() => {
      let url = URL.createObjectURL(file);
      let type: "image" | "file" = file.type.startsWith("image") ? "image" : "file";
      const message: Message = {
        id: Date.now().toString(),
        userId: user?.id || "current-user",
        userName: user?.name || "Du",
        content: file.name,
        timestamp: new Date().toISOString(),
        type,
        replyTo: replyTo || undefined,
        likes: [],
        status: "sent",
        fileUrl: url,
        fileMime: file.type,
      } as any;
      setMessages(prev => [...prev, message]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 1200);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: styles.gradients.body }}>
        <div style={{ color: styles.primaryGreen, fontWeight: 700, fontSize: "1.2rem" }}>Laddar chat...</div>
      </div>
    );
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches && typeof e.touches[0]?.clientX === 'number') {
      touchStartX.current = e.touches[0].clientX;
    } else {
      touchStartX.current = null;
    }
  };
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || !e.changedTouches || typeof e.changedTouches[0]?.clientX !== 'number') return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 80) {
      const idx = chatRooms.findIndex(r => r.id === selectedRoom);
      if (Array.isArray(chatRooms) && chatRooms.length > 0 && typeof idx === 'number' && idx >= 0) {
        if (deltaX < 0 && idx < chatRooms.length - 1) {
          const nextRoom = chatRooms[idx + 1];
          if (nextRoom && nextRoom.id) setSelectedRoom(nextRoom.id);
        } else if (deltaX > 0 && idx > 0) {
          const prevRoom = chatRooms[idx - 1];
          if (prevRoom && prevRoom.id) setSelectedRoom(prevRoom.id);
        }
      }
    }
    touchStartX.current = null;
  };

  // Vid borttagning av grupp, ta även bort dess meddelanden från localStorage
  const handleDeleteGroup = (groupId: string) => {
    setChatRooms(prev => prev.filter(r => r.id !== groupId));
    localStorage.removeItem(MESSAGES_KEY_PREFIX + groupId);
    if (selectedRoom === groupId) setSelectedRoom(null);
    setConfirmDeleteGroupId(null);
  };

  return (
    <div className="fbc-chat-root" style={{ minHeight: "100vh", background: styles.gradients.body, display: "flex", fontFamily: "inherit" }}>
      {/* Sidebar med chatrum */}
      <aside className="fbc-chat-sidebar" style={{
        width: 320,
        background: styles.cardBackground,
        borderRight: `2px solid ${styles.primaryGreen}`,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 24px rgba(46,125,50,0.10)",
        zIndex: 2,
        minWidth: 320,
      }}>
        <div style={{ padding: "2rem 1.2rem 1rem 1.2rem", borderBottom: `2px solid ${styles.primaryGreen}` }}>
          <div style={{ fontWeight: 900, fontSize: "1.45rem", color: styles.primaryGreen, letterSpacing: "1px", marginBottom: "0.5rem" }}>Lagchat</div>
          <div style={{ color: styles.textSecondary, fontSize: "1rem" }}>Välj rum eller skapa en grupp</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0" }}>
          {chatRooms.map(room => (
            <div
              key={room.id}
              style={{ position: 'relative' }}
            >
              <div
                onClick={() => setSelectedRoom(room.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.9rem 1.2rem",
                  marginBottom: "0.2rem",
                  borderRadius: "1rem",
                  background: selectedRoom === room.id ? styles.gradients.cardHover : "transparent",
                  cursor: "pointer",
                  border: selectedRoom === room.id ? `2px solid ${styles.primaryGreen}` : "2px solid transparent",
                  boxShadow: selectedRoom === room.id ? "0 2px 8px rgba(46,125,50,0.10)" : "none",
                  transition: "background 0.2s, border 0.2s",
                }}
              >
                {/* Avatar/ikon för rum */}
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: styles.gradients.primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: "1.25rem", boxShadow: "0 2px 8px rgba(46,125,50,0.10)" }}>
                  {room.avatar ? <img src={room.avatar} alt={room.name} style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} /> : room.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "1.08rem", color: styles.textPrimary }}>{room.name}</div>
                  <div style={{ color: styles.textSecondary, fontSize: "0.95rem" }}>{room.description}</div>
                </div>
              </div>
              {/* Ta bort grupp-knapp, visas bara om det är en grupp och inte default-rum */}
              {room.id.startsWith('group-') && room.creatorId === user?.id && (
                <button
                  style={{ position: 'absolute', top: 8, right: 8, background: '#d32f2f', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', zIndex: 10 }}
                  aria-label={`Ta bort grupp ${room.name}`}
                  onClick={() => setConfirmDeleteGroupId(room.id)}
                >×</button>
              )}
            </div>
          ))}
        </div>
        <div style={{ padding: "1.2rem", borderTop: `2px solid ${styles.primaryGreen}` }}>
          <button
            style={{ width: "100%", background: styles.gradients.primary, color: "white", border: "none", borderRadius: "1rem", padding: "0.7rem 1.2rem", fontWeight: 700, fontSize: "1.08rem", boxShadow: "0 2px 8px rgba(46,125,50,0.15)", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s" }}
            onClick={() => setShowCreateGroup(true)}
          >+ Skapa grupp</button>
        </div>
        {/* Modal för att skapa grupp */}
        {showCreateGroup && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form
              style={{ background: styles.cardBackground, padding: '2rem', borderRadius: '1.2rem', boxShadow: '0 4px 24px rgba(46,125,50,0.15)', minWidth: 320, display: 'flex', flexDirection: 'column', gap: '1rem' }}
              onSubmit={e => {
                e.preventDefault();
                if (!newGroup.name.trim() || newGroup.participants.length === 0) return;
                setChatRooms(prev => [
                  ...prev,
                  {
                    id: 'group-' + Date.now(),
                    name: newGroup.name,
                    description: newGroup.description,
                    avatar: newGroup.avatar,
                    participants: newGroup.participants,
                    creatorId: user?.id || "current-user",
                  }
                ]);
                setShowCreateGroup(false);
                setNewGroup({ name: '', description: '', avatar: '', participants: [] });
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1.15rem', color: styles.primaryGreen }}>Skapa ny grupp</div>
              <input
                type="text"
                placeholder="Gruppnamn"
                value={newGroup.name}
                onChange={e => setNewGroup(g => ({ ...g, name: e.target.value }))}
                style={{ padding: '0.7rem', borderRadius: '0.7rem', border: `2px solid ${styles.primaryGreen}`, fontSize: '1.05rem' }}
                required
              />
              <input
                type="text"
                placeholder="Beskrivning (valfritt)"
                value={newGroup.description}
                onChange={e => setNewGroup(g => ({ ...g, description: e.target.value }))}
                style={{ padding: '0.7rem', borderRadius: '0.7rem', border: `2px solid ${styles.primaryGreen}`, fontSize: '1.05rem' }}
              />
              <input
                type="text"
                placeholder="Bild-URL (valfritt)"
                value={newGroup.avatar}
                onChange={e => setNewGroup(g => ({ ...g, avatar: e.target.value }))}
                style={{ padding: '0.7rem', borderRadius: '0.7rem', border: `2px solid ${styles.primaryGreen}`, fontSize: '1.05rem' }}
              />
              <div style={{ fontWeight: 600, color: styles.primaryGreen, marginBottom: '0.5rem' }}>Välj deltagare:</div>
              <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {users.filter((u: import("../types/user").User) => u.isApproved && u.email).map((u: import("../types/user").User) => (
                  <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '1rem', color: styles.textPrimary }}>
                    <input
                      type="checkbox"
                      checked={newGroup.participants.includes(u.id)}
                      onChange={e => {
                        setNewGroup(g => ({
                          ...g,
                          participants: e.target.checked
                            ? [...g.participants, u.id]
                            : g.participants.filter(id => id !== u.id)
                        }));
                      }}
                    />
                    {u.name} {u.favoritePosition ? `(${u.favoritePosition})` : ''}
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" style={{ background: styles.gradients.primary, color: 'white', border: 'none', borderRadius: '0.7rem', padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer' }}>Skapa</button>
                <button type="button" style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: '0.7rem', padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer' }} onClick={() => setShowCreateGroup(false)}>Avbryt</button>
              </div>
            </form>
          </div>
        )}
      </aside>

      {/* Visa chatten endast om en grupp är vald */}
      {selectedRoom && (
        <main
          ref={chatMainRef}
          className="fbc-chat-main"
          style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Chat header för valt rum */}
          <div className="fbc-chat-header" style={{ background: styles.cardBackground, padding: "1.2rem 2rem", borderBottom: `2px solid ${styles.primaryGreen}`, display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: styles.gradients.primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: "1.25rem", boxShadow: "0 2px 8px rgba(46,125,50,0.10)" }}>
              {chatRooms.find(room => room.id === selectedRoom)?.avatar ? (
                <img src={chatRooms.find(room => room.id === selectedRoom)?.avatar || ""} alt={chatRooms.find(room => room.id === selectedRoom)?.name} style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                chatRooms.find(room => room.id === selectedRoom)?.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: "1.18rem", color: styles.primaryGreen }}>{chatRooms.find(room => room.id === selectedRoom)?.name}</div>
              <div style={{ color: styles.textSecondary, fontSize: "1rem" }}>{chatRooms.find(room => room.id === selectedRoom)?.description}</div>
            </div>
          </div>

          {/* Meddelanden */}
          <div className="fbc-chat-messages" style={{ flex: 1, overflowY: "auto", padding: "2rem 2.5rem 1.5rem 2.5rem", background: isDark ? "#162816" : "#F8F9FA" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {messages.map((message, idx) => {
                const prevMsg = messages[idx - 1];
                const currDate = new Date(message.timestamp).toLocaleDateString();
                const prevDate = prevMsg ? new Date(prevMsg.timestamp).toLocaleDateString() : null;
                return (
                  <React.Fragment key={message.id}>
                    {idx === 0 || currDate !== prevDate ? (
                      <div style={{ textAlign: 'center', color: styles.primaryGreen, fontWeight: 700, margin: '1.2rem 0 0.2rem 0', fontSize: '1rem' }}>{currDate}</div>
                    ) : null}
                    <div style={{ display: "flex", flexDirection: message.userId === user?.id ? "row-reverse" : "row", alignItems: "flex-end", gap: "0.7rem", animation: 'fadeIn 0.7s' }}>
                      {/* Avatar/initial för användare */}
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: styles.gradients.primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: "1.1rem", boxShadow: "0 2px 8px rgba(46,125,50,0.10)" }}>
                        {message.userName.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ maxWidth: "70%", background: message.userId === user?.id ? styles.gradients.primary : styles.cardBackground, color: message.userId === user?.id ? "#fff" : styles.textPrimary, padding: "0.85rem 1.2rem", borderRadius: "1.2rem", boxShadow: "0 2px 8px rgba(46,125,50,0.10)", position: "relative" }}>
                        <div style={{ fontWeight: 700, fontSize: "1.02rem", marginBottom: "0.15rem", color: message.userId === user?.id ? styles.fbcGold : styles.primaryGreen }}>{message.userName}{message.userId === user?.id ? " (du)" : ""}</div>
                        {/* Svarsfunktion: Visa om detta meddelande är ett svar */}
                        {message.replyTo && (
                          <div style={{ fontSize: "0.95rem", color: styles.textSecondary, background: styles.gradients.cardHover, borderRadius: "0.7rem", padding: "0.4rem 0.8rem", marginBottom: "0.3rem" }}>
                            Svar på: {messages.find(m => m.id === message.replyTo)?.userName}: "{messages.find(m => m.id === message.replyTo)?.content}"
                          </div>
                        )}
                        {/* Meddelandeinnehåll med @-taggning eller fil */}
                        <div style={{ fontSize: "1.08rem", wordBreak: "break-word" }}>
                          {message.type === 'image' && message.fileUrl ? (
                            <img src={message.fileUrl} alt={message.content} style={{ maxWidth: '100%', borderRadius: '0.7rem', marginBottom: '0.5rem' }} />
                          ) : message.type === 'file' && message.fileUrl ? (
                            <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: styles.fbcGold, textDecoration: 'underline', fontWeight: 700, fontSize: '1.05rem' }}>{message.content}</a>
                          ) : (
                            message.content.split(/(@\w+)/g).map((part, i) =>
                              part.startsWith("@") ? (
                                <span key={i} style={{ color: styles.fbcGold, fontWeight: 700 }}>{part}</span>
                              ) : (
                                part
                              )
                            )
                          )}
                        </div>
                        {/* Like-knapp och räknare, Svara, Redigera, Radera */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                          <button onClick={() => {
                            setMessages(prev => prev.map(m => m.id === message.id ? {
                              ...m,
                              likes: m.likes?.includes(user?.id || "demo") ? m.likes?.filter(id => id !== (user?.id || "demo")) : [...(m.likes || []), user?.id || "demo"]
                            } : m));
                          }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", color: message.likes?.includes(user?.id || "demo") ? styles.fbcGold : styles.primaryGreen }}>
                            ♥
                          </button>
                          <span style={{ fontSize: "0.95rem", color: styles.textSecondary }}>{message.likes?.length || 0}</span>
                          {/* Leveransstatus */}
                          {message.userId === user?.id && (
                            <span style={{ fontSize: "0.85rem", color: styles.textSecondary }}>
                              {message.status === "read" ? "Läst" : message.status === "delivered" ? "Levererat" : "Skickat"}
                            </span>
                          )}
                          <button onClick={() => setReplyTo(message.id)} style={{ background: styles.gradients.cardHover, border: "none", borderRadius: "0.7rem", padding: "0.2rem 0.7rem", fontSize: "0.85rem", color: '#fff', cursor: "pointer" }}>Svara</button>
                          {message.userId === user?.id && (
                            <button onClick={() => { setEditingId(message.id); setNewMessage(message.content); }} style={{ background: styles.gradients.cardHover, border: "none", borderRadius: "0.7rem", padding: "0.2rem 0.7rem", fontSize: "0.85rem", color: '#fff', cursor: "pointer" }}>Redigera</button>
                          )}
                          {message.userId === user?.id && (
                            <button onClick={() => setMessages(prev => prev.filter(m => m.id !== message.id))} style={{ background: '#d32f2f', border: "none", borderRadius: "0.7rem", padding: "0.2rem 0.7rem", fontSize: "0.85rem", color: '#fff', cursor: "pointer" }}>Radera</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
              {/* "Användare skriver..." indikator */}
              {isTyping && (
                <div style={{ color: styles.primaryGreen, fontWeight: 600, marginTop: '0.5rem', fontSize: '1rem' }}>Användare skriver...</div>
              )}
            </div>
          </div>

          {/* Meddelandeinmatning */}
          <div className="fbc-chat-input" style={{ background: styles.cardBackground, padding: "1.2rem 2.5rem", borderTop: `2px solid ${styles.primaryGreen}` }}>
            <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
              {/* Om man svarar på ett meddelande, visa det ovanför input */}
              {replyTo && (
                <div style={{ background: styles.gradients.cardHover, borderRadius: "0.7rem", padding: "0.4rem 0.8rem", marginBottom: "0.3rem", color: styles.primaryGreen, fontSize: "0.95rem" }}>
                  Svarar på: {messages.find(m => m.id === replyTo)?.userName}: "{messages.find(m => m.id === replyTo)?.content}"
                  <button onClick={() => setReplyTo(null)} style={{ marginLeft: 8, background: "none", border: "none", color: styles.textSecondary, cursor: "pointer" }}>Avbryt</button>
                </div>
              )}
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder={editingId ? "Redigera meddelande..." : "Skriv ett meddelande..."}
                style={{ flex: 1, padding: "0.85rem 1.2rem", border: `2px solid ${styles.primaryGreen}`, borderRadius: "1.2rem", fontSize: "1.08rem", outline: "none", background: isDark ? "#162816" : "#fff", color: styles.textPrimary, fontWeight: 500, boxShadow: "0 2px 8px rgba(46,125,50,0.10)" }}
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{ background: styles.gradients.cardHover, color: styles.primaryGreen, border: "none", borderRadius: "50%", width: 52, height: 52, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.35rem", fontWeight: 700, boxShadow: "0 2px 8px rgba(46,125,50,0.15)", transition: "background 0.2s" }}
              >
                📎
              </button>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                style={{ background: newMessage.trim() ? styles.gradients.primary : styles.gradients.cardHover, color: "white", border: "none", borderRadius: "50%", width: 52, height: 52, cursor: newMessage.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.35rem", fontWeight: 700, boxShadow: "0 2px 8px rgba(46,125,50,0.15)", transition: "background 0.2s" }}
              >
                ➤
              </button>
            </div>
          </div>

          {/* Bekräftelse-popup för borttagning av grupp */}
          {confirmDeleteGroupId && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: 'white', borderRadius: 16, padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', minWidth: 280, textAlign: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>Vill du verkligen ta bort gruppen?</div>
                <div style={{ marginBottom: '2rem', color: '#d32f2f', fontWeight: 500 }}>{chatRooms.find(r => r.id === confirmDeleteGroupId)?.name}</div>
                <button
                  style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 600, marginRight: 12, cursor: 'pointer' }}
                  onClick={() => {
                    handleDeleteGroup(confirmDeleteGroupId);
                  }}
                >Ta bort</button>
                <button
                  style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => setConfirmDeleteGroupId(null)}
                >Avbryt</button>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default Chat;

// Fade-in animation för meddelanden
const style = document.createElement('style');
style.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }`;
document.head.appendChild(style);
