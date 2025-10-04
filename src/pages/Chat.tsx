import React, { useState } from "react";
import stylesCss from "./Chat.module.css";
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
  // Skapa grupp-modal
  // const { isDark } = useTheme();
  // const { user } = useUser();
  // const styles = getStyles(isDark); // not needed, all styles moved to CSS module
  // Riktiga data
  const [chatRooms] = useState<ChatRoom[]>([]);
  // const [messages, setMessages] = useState<Message[]>([]);
  // Removed unused replyTo state
  // Swipe-funktion för att byta rum på mobil
  // Removed unused touchStartX ref to fix unused variable error.
  // Removed unused newMessage state
  // Removed unused confirmDeleteGroupId state

  // Modal flyttas till egen komponent nedan

  // Swipe-funktion för att byta rum på mobil
  // Removed unused handleTouchEnd function to fix unused variable error.

  // Funktion för att ta bort grupp
  // Removed unused handleDeleteGroup function to fix unused variable error.

  return (
    <div className={stylesCss.fbcChatRoot}>
      <div className={stylesCss.fbcChatFlexRow}>
        {/* Sidebar med chatrum */}
        <aside className={stylesCss.fbcChatSidebar}>
          <div className={stylesCss.fbcChatSidebarHeader}>
            <div className={stylesCss.fbcChatSidebarTitle}>Lagchat</div>
            <div className={stylesCss.fbcChatSidebarDesc}>Välj rum eller skapa en grupp</div>
          </div>
          <div className={stylesCss.fbcChatSidebarRooms}>
            {chatRooms.map(room => (
              <div key={room.id} className={stylesCss.fbcChatSidebarRoom}>
                {/* ...rest of your UI code here... */}
              </div>
            ))}
          </div>
        </aside>
        {/* ...rest of your UI code here... */}
      </div>
      {/* ...rest of your UI code here... */}
    </div>
  );
}

export default Chat;
