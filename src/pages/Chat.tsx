import React, { useState } from "react";
import { chatRoomAPI, messagesAPI } from "../services/apiService";
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

// export default Chat; (moved to end of file)


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
  // Riktiga data
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  // const [messages, setMessages] = useState<Message[]>([]);
  // Removed unused replyTo state
  // Swipe-funktion för att byta rum på mobil
  const touchStartX = React.useRef<number | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
  const [confirmDeleteGroupId, setConfirmDeleteGroupId] = useState<string | null>(null);

  // Hämta meddelanden från backend för valt rum
  React.useEffect(() => {
    if (!selectedRoom || !user) return;
    messagesAPI.getMessagesForUser(selectedRoom).then((res: any) => {
      setMessages(res.data || []);
    });
  }, [selectedRoom, user]);

  // Funktion för att rendera modal för att skapa grupp
  const renderCreateGroupModal = () => (
    showCreateGroup ? (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <form
          style={{ background: styles.cardBackground, borderRadius: 16, padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', minWidth: 320, maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          onSubmit={async e => {
            e.preventDefault();
            if (!newGroup.name.trim() || newGroup.participants.length === 0 || !user) return;
            const payload = {
              name: newGroup.name,
              description: newGroup.description,
              avatar: newGroup.avatar,
              participants: newGroup.participants,
              creatorId: user.id
            };
            const res = await chatRoomAPI.create(payload);
            if (res.success && res.data) {
              setChatRooms(prev => [...prev, res.data]);
              setSelectedRoom(res.data._id || res.data.id);
            }
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
                {/* Meddelanden */}
                <div className="fbc-chat-messages" style={{ flex: 1, overflowY: "auto", padding: "2rem 2.5rem 1.5rem 2.5rem", background: isDark ? "#162816" : "#F8F9FA" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                  {messages.map((message, idx) => (
                    <div key={message._id || idx} style={{ display: "flex", flexDirection: user && message.sender === user.id ? "row-reverse" : "row", alignItems: "flex-end", gap: "0.7rem" }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: styles.gradients.primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: "1.1rem", boxShadow: "0 2px 8px rgba(46,125,50,0.10)" }}>
                        {user && message.sender === user.id ? user.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div style={{ maxWidth: "70%", background: user && message.sender === user.id ? styles.gradients.primary : styles.cardBackground, color: user && message.sender === user.id ? "#fff" : styles.textPrimary, padding: "0.85rem 1.2rem", borderRadius: "1.2rem", boxShadow: "0 2px 8px rgba(46,125,50,0.10)", position: "relative" }}>
                        <div style={{ fontWeight: 700, fontSize: "1.02rem", marginBottom: "0.15rem", color: user && message.sender === user.id ? styles.fbcGold : styles.primaryGreen }}>{user && message.sender === user.id ? user.name : ""}</div>
                        <div style={{ fontSize: "1.08rem", wordBreak: "break-word" }}>{message.content}</div>
                        <div style={{ fontSize: "0.85rem", color: styles.textSecondary, marginTop: "0.3rem" }}>{new Date(message.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
                {/* Meddelandeinmatning */}
                <div className="fbc-chat-input" style={{ background: styles.cardBackground, padding: "1.2rem 2.5rem", borderTop: `2px solid ${styles.primaryGreen}` }}>
                  <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Skriv ett meddelande..."
                      style={{ flex: 1, padding: "0.85rem 1.2rem", border: `2px solid ${styles.primaryGreen}`, borderRadius: "1.2rem", fontSize: "1.08rem", outline: "none", background: isDark ? "#162816" : "#fff", color: styles.textPrimary, fontWeight: 500, boxShadow: "0 2px 8px rgba(46,125,50,0.10)" }}
                    />
                    <button
                      onClick={async () => {
                        if (!newMessage.trim() || !user || !selectedRoom) return;
                        messagesAPI.sendMessage({ sender: user.id, receiver: selectedRoom, content: newMessage }).then(res => {
                          if (res.success && res.data) {
                            setMessages(prev => [...prev, res.data]);
                            setNewMessage("");
                          }
                        });
                      }}
                      disabled={!newMessage.trim()}
                      style={{ background: newMessage.trim() ? styles.gradients.primary : styles.gradients.cardHover, color: "white", border: "none", borderRadius: "50%", width: 52, height: 52, cursor: newMessage.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.35rem", fontWeight: 700, boxShadow: "0 2px 8px rgba(46,125,50,0.15)", transition: "background 0.2s" }}
                    >
                      ➤
                    </button>
                  </div>
                </div>
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
    ) : null
  );

  // Swipe-funktion för att byta rum på mobil
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
    const idx = chatRooms.findIndex(r => r.id === selectedRoom);
    if (Math.abs(deltaX) > 80) {
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
  };

  // Funktion för att ta bort grupp
  const handleDeleteGroup = async (groupId: string) => {
    // Ta bort gruppen från backend (om API finns)
    const res = await chatRoomAPI.delete(groupId);
    if (res.success) {
      setChatRooms(prev => prev.filter(room => room.id !== groupId));
      if (selectedRoom === groupId) setSelectedRoom(null);
    }
    setConfirmDeleteGroupId(null);
  };

  return (
    <div className="fbc-chat-root" style={{ minHeight: "100vh", background: styles.gradients.body, display: "flex", fontFamily: "inherit" }}>
      <div style={{ display: "flex", width: "100%" }}>
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
          {renderCreateGroupModal()}
        </aside>
        {/* Chatten */}
        <div style={{ flex: 1 }}>
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
              {/* ...resten av chatten... */}
            </main>
          )}
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
    </div>
  );
};

export default Chat;
