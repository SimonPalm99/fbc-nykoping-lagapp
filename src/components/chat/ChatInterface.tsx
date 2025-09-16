import React, { useState, useEffect, useRef } from 'react';
import { usersAPI } from '../../services/apiService';
import { useForum } from '../../context/ForumContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { ChatMessage, MessageReaction } from '../../types/forum';

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  icon: string;
  participants: number;
}

const ChatInterface: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  useEffect(() => {
    usersAPI.getAllUsers().then((res: any) => {
      // Visa endast riktiga användare med inlogg (t.ex. har email eller username och status 'approved')
      const approvedUsers = (res.data || []).filter((u: any) => u.status === 'approved' && u.email && !u.isDemo);
      setUsers(approvedUsers);
    });
  }, []);
  const [selectedRoom, setSelectedRoom] = useState('general');
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { addChatMessage, addChatReaction, markAsRead: _markAsRead, chat, loadMoreChatMessages, chatHasMore } = useForum();
  const { user } = useAuth();
  const { success, error: _error } = useToast();

  const rooms: ChatRoom[] = [
    {
      id: 'general',
      name: 'Allmän chatt',
      description: 'Allmänna diskussioner för hela laget',
      icon: '💬',
      participants: 12
    },
    {
      id: 'training',
      name: 'Träning',
      description: 'Diskussioner om träning och utveckling',
      icon: '🏒',
      participants: 8
    },
    {
      id: 'matches',
      name: 'Matcher',
      description: 'Matchdiskussioner och analys',
      icon: '🥅',
      participants: 15
    },
    {
      id: 'social',
      name: 'Socialt',
      description: 'Umgänge och aktiviteter utanför isen',
      icon: '🎉',
      participants: 10
    }
  ];

  const messages = chat;
  const currentRoom = rooms.find(r => r.id === selectedRoom);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Infinite scroll: ladda fler meddelanden när man scrollar upp
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (!messagesAreaRef.current || !chatHasMore) return;
      if (messagesAreaRef.current.scrollTop === 0) {
        loadMoreChatMessages && loadMoreChatMessages();
      }
    };
    const area = messagesAreaRef.current;
    if (area) area.addEventListener('scroll', handleScroll);
    return () => { if (area) area.removeEventListener('scroll', handleScroll); };
  }, [chatHasMore, loadMoreChatMessages]);

  const handleSendMessage = () => {
  if (!messageInput.trim() || !user || !selectedUser) return;

  // Skicka meddelande till vald användare
  addChatMessage(selectedRoom, messageInput.trim(), 'text');
  // Här kan du även skicka med mottagarens id till backend om du vill
  setMessageInput('');
  success('Meddelande skickat!');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    addChatReaction(messageId, emoji);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('sv-SE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Idag';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Igår';
    } else {
      return date.toLocaleDateString('sv-SE', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      const dateGroup = groups[date];
      if (dateGroup) {
        dateGroup.push(message);
      }
    });

    return Object.entries(groups).map(([date, msgs]) => ({
      date: new Date(date),
      messages: msgs
    }));
  };

  const messageGroups = groupMessagesByDate(messages);

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Du måste vara inloggad för att chatta</p>
          <button className="btn-primary">Logga in</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Chat Rooms Sidebar */}
      <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Chatrum</h3>
        </div>
        
        <div className="p-2">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room.id)}
              className={`w-full p-3 rounded-lg text-left transition-colors mb-2 ${
                selectedRoom === room.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{room.icon}</span>
                <div>
                  <div className="font-medium">{room.name}</div>
                  <div className="text-sm text-gray-500">{room.participants} deltagare</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentRoom?.icon}</span>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">{currentRoom?.name}</h2>
              <p className="text-sm text-gray-500">{currentRoom?.description}</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
  <div ref={messagesAreaRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messageGroups.map(({ date, messages: dayMessages }) => (
            <div key={date.toISOString()}>
              {/* Date Separator */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                <span className="text-sm text-gray-500 bg-white dark:bg-gray-800 px-3 py-1 rounded-full">
                  {formatDate(date.toISOString())}
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              </div>

              {/* Messages for this date */}
              {dayMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.userId === user.id ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                    {message.userId === user.id ? 'Du' : message.userId.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className={`max-w-xs lg:max-w-md ${
                    message.userId === user.id ? 'text-right' : ''
                  }`}>
                    <div className={`rounded-lg p-3 ${
                      message.userId === user.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}>
                      <p className="break-words">{message.content}</p>
                    </div>
                    
                    <div className={`flex items-center gap-2 mt-1 ${
                      message.userId === user.id ? 'justify-end' : ''
                    }`}>
                      <span className="text-xs text-gray-500">
                        {formatTime(message.createdAt)}
                      </span>
                      
                      {/* Reactions */}
                      {message.reactions.length > 0 && (
                        <div className="flex gap-1">
                          {message.reactions.map((reaction: MessageReaction, index: number) => (
                            <button
                              key={index}
                              onClick={() => handleReaction(message.id, reaction.emoji)}
                              className="text-sm hover:scale-110 transition-transform"
                            >
                              {reaction.emoji}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Add Reaction Button */}
                      <div className="relative">
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="text-gray-400 hover:text-gray-600 text-sm"
                        >
                          😊
                        </button>
                        
                        {showEmojiPicker && (
                          <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex gap-1 border border-gray-200 dark:border-gray-700">
                            {emojis.map(emoji => (
                              <button
                                key={emoji}
                                onClick={() => {
                                  handleReaction(message.id, emoji);
                                  setShowEmojiPicker(false);
                                }}
                                className="hover:scale-110 transition-transform p-1"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-2">
            <label htmlFor="user-select" className="mr-2">Välj mottagare:</label>
            <select
              id="user-select"
              value={selectedUser}
              onChange={e => setSelectedUser(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">-- Välj användare --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.email || u.username}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Skriv ett meddelande..."
              className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || !selectedUser}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Skicka
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
