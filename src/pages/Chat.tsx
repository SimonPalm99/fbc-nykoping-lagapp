import React, { useEffect, useState, useCallback } from "react";
import CreateGroupModal from '../components/chat/CreateGroupModal';
import { messagesAPI } from '../services/apiService';
import stylesCss from "./Chat.module.css";
import { chatRoomAPI } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { socketService } from '../services/socketService';
// import { players } from '../data/players';

// All responsivitet och FBC-tema hanteras nu i Chat.module.css

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

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  // Realtidsanslutning och hämta meddelanden för valt rum
  useEffect(() => {
    if (!user?.id) return;
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, [user]);

  const [typingUser, setTypingUser] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedRoom) return;
    socketService.joinRoom(selectedRoom);
    messagesAPI.getMessagesForUser(selectedRoom)
      .then(res => {
        setMessages(res.data || []);
      });
    // Lyssna på inkommande meddelanden
    socketService.onMessage((data) => {
      if (data.roomId === selectedRoom || (selectedRoom === 'teamchat' && (!data.roomId || data.roomId === 'teamchat'))) {
        setMessages(prev => [...prev, data]);
      }
    });
    // Lyssna på typing-event
    socketService.onTyping((userName) => {
      setTypingUser(userName);
      setTimeout(() => setTypingUser(null), 2000);
    });
    return () => {
      socketService.disconnect();
    };
  }, [selectedRoom]);
  // Skicka meddelande
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user?.id || !selectedRoom) return;
    // Skicka till backend (sparas i DB)
    await messagesAPI.sendMessage({ sender: user.id, receiver: selectedRoom, content: messageInput.trim() });
    // Skicka till Socket.io för realtid
    socketService.sendMessage({ roomId: selectedRoom, message: messageInput.trim(), userId: user.id, userName: user.name });
    setMessageInput('');
  };

  const reloadRooms = useCallback(() => {
    if (!user?.id) return;
    setLoading(true);
    chatRoomAPI.getRoomsForUser(user.id)
      .then(res => {
        setChatRooms(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [user]);
  useEffect(() => {
    reloadRooms();
    // usersAPI.getAllUsers().then(res => {
    //   setAllUsers(res.data || []);
    // });
  }, [user, reloadRooms]);

  // Like/reagera på meddelande
  const handleLikeMessage = async (messageId: string) => {
    if (!user?.id) return;
    setMessages(prev => prev.map(msg =>
      (msg._id || msg.id) === messageId
        ? { ...msg, likes: msg.likes ? [...msg.likes, user.id] : [user.id] }
        : msg
    ));
  };

  return (
    <div className={stylesCss.fbcChatRoot}>
      {/* Sidebar med grupper */}
      <aside className={stylesCss.fbcChatSidebar}>
        <div className={stylesCss.fbcChatSidebarHeader}>
          <div className={stylesCss.fbcChatSidebarTitle}>Chattar</div>
          <input className={stylesCss.fbcChatCreateInput} placeholder="Sök i Messenger" />
        </div>
        <div className={stylesCss.fbcChatSidebarRooms}>
          <button className={stylesCss.fbcChatSidebarCreateBtn} onClick={() => setShowCreateGroup(true)}>Skapa grupp</button>
          {/* Automatisk lagchatt */}
          <div
            className={selectedRoom === 'teamchat' ? `${stylesCss.fbcChatSidebarRoom} ${stylesCss.fbcChatSidebarRoomBtn} selected` : `${stylesCss.fbcChatSidebarRoom} ${stylesCss.fbcChatSidebarRoomBtn}`}
            onClick={() => setSelectedRoom('teamchat')}
          >
            <div className={stylesCss.fbcChatSidebarRoomAvatar}>L</div>
            <div className={stylesCss.fbcChatSidebarRoomInfo}>
              <div className={stylesCss.fbcChatSidebarRoomName}>Lagchatt</div>
              <div className={stylesCss.fbcChatSidebarRoomDesc}>Alla i laget</div>
            </div>
          </div>
          {chatRooms.map(room => (
            <div
              key={room.id}
              className={selectedRoom === room.id ? `${stylesCss.fbcChatSidebarRoom} ${stylesCss.fbcChatSidebarRoomBtn} selected` : `${stylesCss.fbcChatSidebarRoom} ${stylesCss.fbcChatSidebarRoomBtn}`}
              onClick={() => setSelectedRoom(room.id)}
            >
              <div className={stylesCss.fbcChatSidebarRoomAvatar}>{room.avatar ? <img src={room.avatar} alt={room.name} /> : room.name[0]}</div>
              <div className={stylesCss.fbcChatSidebarRoomInfo}>
                <div className={stylesCss.fbcChatSidebarRoomName}>{room.name}</div>
                <div className={stylesCss.fbcChatSidebarRoomDesc}>{room.description}</div>
              </div>
              {/* Ta bort-knapp om skapare */}
              {room.creatorId === user?.id && (
                <button className={stylesCss.fbcChatSidebarRoomDeleteBtn} title="Ta bort grupp">×</button>
              )}
            </div>
          ))}
          {(!loading && chatRooms.length === 0) && <div>Inga chatrum hittades.</div>}
        </div>
        <CreateGroupModal open={showCreateGroup} onClose={() => setShowCreateGroup(false)} onGroupCreated={reloadRooms} />
      </aside>
      {/* Chattfönster */}
      <main className={stylesCss.fbcChatMain}>
        {selectedRoom ? (
          <div className={stylesCss.fbcChatWindow}>
            {/* Header med profilbild och namn */}
            <div className={stylesCss.fbcChatHeader}>
              <div className={stylesCss.fbcChatHeaderAvatar}>
                {/* Visa avatar för rum eller lagchatt */}
                {selectedRoom === 'teamchat' ? <span className={stylesCss.fbcChatHeaderAvatarLetter}>L</span> : <img src={chatRooms.find(r=>r.id===selectedRoom)?.avatar||''} alt="avatar" className={stylesCss.fbcChatHeaderAvatarImg} />}
              </div>
              <div>
                <div className={stylesCss.fbcChatHeaderName}>{selectedRoom === 'teamchat' ? 'Lagchatt' : chatRooms.find(r=>r.id===selectedRoom)?.name}</div>
                <div className={stylesCss.fbcChatHeaderDesc}>{selectedRoom === 'teamchat' ? 'Alla i laget' : chatRooms.find(r=>r.id===selectedRoom)?.description}</div>
              </div>
            </div>
            {/* Meddelanden */}
            <div className={stylesCss.fbcChatMessages}>
              <div className={stylesCss.fbcChatMessagesList}>
                {(selectedRoom === 'teamchat'
                  ? messages.filter(msg => !msg.roomId || msg.roomId === 'teamchat')
                  : messages
                ).map(msg => (
                  <div key={msg._id || msg.id} className={stylesCss.fbcChatMessageRow + (msg.sender === user?.id ? ' reverse' : '')}>
                    <div className={stylesCss.fbcChatMessageAvatar}>{msg.avatar ? <img src={msg.avatar} alt={msg.sender} /> : (msg.senderName ? msg.senderName[0] : '?')}</div>
                    <div className={stylesCss.fbcChatMessageBubble + (msg.sender === user?.id ? '' : ' other')}>
                      <div className={stylesCss.fbcChatMessageName + (msg.sender === user?.id ? '' : ' other')}>{msg.senderName || msg.sender}</div>
                      <div className={stylesCss.fbcChatMessageContent}>{msg.content}</div>
                      <div className={stylesCss.fbcChatMessageTime}>{new Date(msg.createdAt).toLocaleTimeString()}</div>
                      <div className={stylesCss.fbcChatMessageReactions}>
                        <button className={stylesCss.fbcChatLikeBtn} onClick={() => handleLikeMessage(msg._id || msg.id)}>
                          👍 {msg.likes ? msg.likes.length : 0}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {typingUser && <div className={stylesCss.fbcChatTyping}>{typingUser} skriver...</div>}
              </div>
            </div>
            {/* Inputfält med emoji, fil, GIF */}
            <div className={stylesCss.fbcChatInput}>
              <div className={stylesCss.fbcChatInputRow}>
                <button className={stylesCss.fbcChatInputIconBtn} title="Emoji">😊</button>
                <button className={stylesCss.fbcChatInputIconBtn} title="Skicka fil">📎</button>
                <button className={stylesCss.fbcChatInputIconBtn} title="GIF">GIF</button>
                <input
                  value={messageInput}
                  onChange={e => {
                    setMessageInput(e.target.value);
                    if (user?.name && selectedRoom) {
                      socketService.sendTyping(selectedRoom, user.name);
                    }
                  }}
                  placeholder="Aa"
                  className={stylesCss.fbcChatInputField}
                  onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                />
                <button onClick={handleSendMessage} className={stylesCss.fbcChatInputSendBtn}>➤</button>
              </div>
            </div>
          </div>
        ) : (
          <div className={stylesCss.fbcChatNoRoom}>Välj ett rum för att börja chatta.</div>
        )}
      </main>
    </div>
  );
}

export default Chat;
