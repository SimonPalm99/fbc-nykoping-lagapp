import React, { createContext, useContext, useState } from "react";
import { ChatMessage } from "./ChatWindow";

interface ChatContextType {
  messages: ChatMessage[];
  send: (msg: string, user: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", user: "Coach", text: "Välkommen till lagchatten!", timestamp: new Date().toISOString() }
  ]);
  const send = (msg: string, user: string) => {
    setMessages(msgs => [
      ...msgs,
      {
        id: String(Date.now()),
        user,
        text: msg,
        timestamp: new Date().toISOString(),
      }
    ]);
  };
  return (
    <ChatContext.Provider value={{ messages, send }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
};