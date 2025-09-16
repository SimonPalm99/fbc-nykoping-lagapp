import React, { createContext, useContext, useState, ReactNode } from "react";
import { ForumThread, ForumComment, ChatMessage } from "../types/forum";
import { messagesAPI } from '../services/apiService';
import { webSocketHelpers } from '../services/webSocketService';
import { useAuth } from "./AuthContext";
import { useToast } from "../components/ui/Toast";

// Dummydata
const initialThreads: ForumThread[] = [
  {
    id: "t1",
    title: "Samåkning till cupen?",
    content: "Finns det plats i någon bil på lördag?",
    createdBy: "2",
    authorId: "2",
    createdAt: "2025-06-05T12:00",
    updatedAt: "2025-06-05T12:00",
    isPinned: false,
    isLocked: false,
    isArchived: false,
    tags: ["transport", "cup"],
    viewCount: 5,
    replyCount: 1,
    lastReplyAt: "2025-06-05T12:30",
    lastReplyById: "3",
    reactions: [],
    comments: [
      {
        id: "c1",
        threadId: "t1",
        userId: "3",
        content: "Jag har en plats över.",
        createdAt: "2025-06-05T12:30",
        isEdited: false,
        reactions: []
      }
    ]
  },
  {
    id: "t2",
    title: "Träning inställd 10/6",
    content: "Vi måste tyvärr ställa in tisdagens träning.",
    createdBy: "1",
    authorId: "1",
    createdAt: "2025-06-05T08:00",
    updatedAt: "2025-06-05T08:00",
    isPinned: true,
    isLocked: true,
    isArchived: false,
    tags: ["träning", "info"],
    viewCount: 12,
    replyCount: 0,
    reactions: [],
    comments: [],
    locked: true,
    sticky: true
  }
];


interface ForumContextType {
  threads: ForumThread[];
  chat: ChatMessage[];
  addThread: (thread: Omit<ForumThread, "id" | "createdAt" | "updatedAt" | "comments" | "replyCount" | "viewCount">) => void;
  addComment: (threadId: string, content: string) => void;
  addReaction: (threadId: string, reaction: string) => void;
  lockThread: (threadId: string) => void;
  unlockThread: (threadId: string) => void;
  pinThread: (threadId: string) => void;
  unpinThread: (threadId: string) => void;
  deleteThread: (threadId: string) => void;
  editThread: (threadId: string, updates: Partial<ForumThread>) => void;
  addChatMessage: (chatId: string, content: string, type?: "text" | "system") => void;
  addChatReaction: (messageId: string, emoji: string) => void;
  markAsRead: (messageId: string) => void;
  getThreadsByCategory: (category?: string) => ForumThread[];
  searchThreads: (query: string) => ForumThread[];
  getChatHistory: (chatId: string, limit?: number) => ChatMessage[];
  loadMoreChatMessages?: () => void;
  chatHasMore?: boolean;
}

export const ForumContext = createContext<ForumContextType | undefined>(undefined);

export const ForumProvider = ({ children }: { children: ReactNode }) => {
  const [threads, setThreads] = useState<ForumThread[]>(initialThreads);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [chatPage, setChatPage] = useState(1);
  const [chatHasMore, setChatHasMore] = useState(true);
  const { user } = useAuth();
  React.useEffect(() => {
    const userId = user?.id;
    if (!userId) return;
    // Ladda första sidan meddelanden
    messagesAPI.getMessagesForUserPaginated(userId, 1, 50)
      .then(res => {
        setChat(res.data || []);
        setChatHasMore((res.data || []).length === 50);
        setChatPage(1);
      })
      .catch(() => {
        setChat([]);
        setChatHasMore(false);
      });
  }, [user]);

  // Funktion för att ladda fler meddelanden (äldre)
  const loadMoreChatMessages = () => {
    if (!user) return;
    const nextPage = chatPage + 1;
    messagesAPI.getMessagesForUserPaginated(user.id, nextPage, 50)
      .then(res => {
        const newMessages = res.data || [];
        setChat(prev => [...newMessages, ...prev]);
        setChatPage(nextPage);
        setChatHasMore(newMessages.length === 50);
      });
  };
  // user, success, error, info finns redan längre ner

  // Koppla in WebSocket för att ta emot meddelanden
  React.useEffect(() => {
  const unsubscribe = webSocketHelpers.subscribeToChatMessages((msg: any) => {
      // msg bör innehålla chatId, content, senderId, timestamp etc.
      setChat(prev => [...prev, {
        id: msg.id || Math.random().toString(36).slice(2),
        content: msg.message,
        senderId: msg.senderId || msg.userId || 'unknown',
        userId: msg.senderId || msg.userId || 'unknown',
        chatId: msg.roomId || msg.chatId || 'general',
        timestamp: msg.timestamp ? new Date(msg.timestamp).toISOString() : new Date().toISOString(),
        createdAt: new Date().toISOString(),
        type: 'text',
        isEdited: false,
        reactions: [],
        readBy: [],
        isDeleted: false
      }]);
    });
    return () => { unsubscribe && unsubscribe(); };
  }, []);
  const { success, error, info } = useToast();

  const addThread = (thread: Omit<ForumThread, "id" | "createdAt" | "updatedAt" | "comments" | "replyCount" | "viewCount">) => {
    if (!user) {
      error("Du måste vara inloggad för att skapa ett inlägg");
      return;
    }

    const newThread: ForumThread = {
      ...thread,
      id: Math.random().toString(36).slice(2),
      createdBy: user.id,
      authorId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      replyCount: 0,
      viewCount: 0,
      reactions: []
    };

    setThreads(prev => [newThread, ...prev]);
    success("Inlägg skapat!");
  };

  const addComment = (threadId: string, content: string) => {
    if (!user) {
      error("Du måste vara inloggad för att kommentera");
      return;
    }

    const newComment: ForumComment = {
      id: Math.random().toString(36).slice(2),
      threadId,
      userId: user.id,
      content,
      createdAt: new Date().toISOString(),
      isEdited: false,
      reactions: []
    };

    setThreads(prev =>
      prev.map(t =>
        t.id === threadId
          ? {
              ...t,
              comments: [...t.comments, newComment],
              replyCount: t.replyCount + 1,
              lastReplyAt: new Date().toISOString(),
              lastReplyById: user.id,
              updatedAt: new Date().toISOString()
            }
          : t
      )
    );
    success("Kommentar tillagd!");
  };

  const addReaction = (threadId: string, reaction: string) => {
    if (!user) return;

    setThreads(prev =>
      prev.map(t =>
        t.id === threadId
          ? {
              ...t,
              reactions: t.reactions.some(r => r.userId === user.id && r.type === reaction as any)
                ? t.reactions.filter(r => !(r.userId === user.id && r.type === reaction as any))
                : [...t.reactions, { 
                    id: Math.random().toString(36).slice(2),
                    userId: user.id, 
                    type: reaction as any,
                    createdAt: new Date().toISOString()
                  }]
            }
          : t
      )
    );
  };

  const isLeader = user?.role === "leader" || user?.role === "admin";

  const lockThread = (threadId: string) => {
    if (!isLeader) return;
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, isLocked: true } : t));
    info("Tråd låst");
  };

  const unlockThread = (threadId: string) => {
    if (!isLeader) return;
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, isLocked: false } : t));
    info("Tråd upplåst");
  };

  const pinThread = (threadId: string) => {
    if (!isLeader) return;
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, isPinned: true } : t));
    info("Tråd fäst");
  };

  const unpinThread = (threadId: string) => {
    if (!isLeader) return;
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, isPinned: false } : t));
    info("Tråd avfäst");
  };

  const deleteThread = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread || (!isLeader && thread.authorId !== user?.id)) return;
    
    setThreads(prev => prev.filter(t => t.id !== threadId));
    info("Tråd borttagen");
  };

  const editThread = (threadId: string, updates: Partial<ForumThread>) => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread || (!isLeader && thread.authorId !== user?.id)) return;
    
    setThreads(prev => prev.map(t => 
      t.id === threadId 
        ? { ...t, ...updates, updatedAt: new Date().toISOString() }
        : t
    ));
    success("Tråd uppdaterad");
  };

  const addChatMessage = (chatId: string, content: string, type: "text" | "system" = "text") => {
    if (!user && type !== "system") {
      error("Du måste vara inloggad för att chatta");
      return;
    }

    // Spara meddelande till backend
    messagesAPI.sendMessage({
      sender: user?.id || 'system',
      receiver: '',
      content
    }).then(res => {
      if (res.data) setChat(prev => [...prev, res.data]);
    });
    // Skicka meddelande via WebSocket
  webSocketHelpers.sendChatMessage(chatId, content);
  };

  const addChatReaction = (messageId: string, emoji: string) => {
    if (!user) return;

    setChat(prev =>
      prev.map(m =>
        m.id === messageId
          ? {
              ...m,
              reactions: m.reactions.some(r => r.userId === user.id && r.emoji === emoji)
                ? m.reactions.filter(r => !(r.userId === user.id && r.emoji === emoji))
                : [...m.reactions, { 
                    userId: user.id, 
                    emoji, 
                    createdAt: new Date().toISOString() 
                  }]
            }
          : m
      )
    );
  };

  const markAsRead = (messageId: string) => {
    if (!user) return;

    setChat(prev =>
      prev.map(m =>
        m.id === messageId && !m.readBy.some(r => r.userId === user.id)
          ? { 
              ...m, 
              readBy: [...m.readBy, { userId: user.id, readAt: new Date().toISOString() }] 
            }
          : m
      )
    );
  };

  const getThreadsByCategory = (category?: string) => {
    if (!category || category === "all") return threads;
    return threads.filter(t => t.tags.includes(category));
  };

  const searchThreads = (query: string) => {
    if (!query.trim()) return threads;
    const lowerQuery = query.toLowerCase();
    return threads.filter(t => 
      t.title.toLowerCase().includes(lowerQuery) ||
      t.content.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const getChatHistory = (chatId: string, limit = 50) => {
    return chat
      .filter(m => m.chatId === chatId)
      .slice(-limit)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  return (
    <ForumContext.Provider
      value={{
        threads,
        chat,
        addThread,
        addComment,
        addReaction,
        lockThread,
        unlockThread,
        pinThread,
        unpinThread,
        deleteThread,
        editThread,
        addChatMessage,
        addChatReaction,
        markAsRead,
        getThreadsByCategory,
        searchThreads,
  getChatHistory,
  loadMoreChatMessages,
        chatHasMore,
      }}>
      {children}
    </ForumContext.Provider>
  );
};

export const useForum = () => {
  const ctx = useContext(ForumContext);
  if (!ctx) throw new Error("useForum måste användas inom ForumProvider");
  return ctx;
};