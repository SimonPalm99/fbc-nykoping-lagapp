export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  isLeaderOnly: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  authorId: string; // alias för bakåtkompatibilitet
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isLocked: boolean;
  isArchived: boolean;
  tags: string[];
  viewCount: number;
  replyCount: number;
  lastReplyAt?: string;
  lastReplyById?: string;
  attachments?: ForumAttachment[];
  poll?: ForumPoll;
  reactions: ForumReaction[];
  comments: ForumComment[]; // bakåtkompatibilitet
  locked?: boolean; // bakåtkompatibilitet
  sticky?: boolean; // bakåtkompatibilitet
}

export interface ForumPost {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
  parentPostId?: string; // för svar på specifika inlägg
  attachments?: ForumAttachment[];
  reactions: ForumReaction[];
  mentions: string[]; // user IDs som nämnts i inlägget
}

export interface ForumComment {
  id: string;
  threadId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
  parentCommentId?: string;
  attachments?: ForumAttachment[];
  reactions: ForumReaction[];
}

export interface ForumAttachment {
  id: string;
  filename: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ForumReaction {
  id: string;
  userId: string;
  type: "like" | "love" | "laugh" | "wow" | "sad" | "angry";
  createdAt: string;
}

export interface ForumPoll {
  id: string;
  question: string;
  options: ForumPollOption[];
  allowMultiple: boolean;
  isAnonymous: boolean;
  endDate?: string;
  isActive: boolean;
  totalVotes: number;
}

export interface ForumPollOption {
  id: string;
  text: string;
  votes: ForumPollVote[];
  voteCount: number;
}

export interface ForumPollVote {
  id: string;
  userId: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  userId: string; // alias för bakåtkompatibilitet
  chatId: string;
  timestamp: string;
  createdAt: string; // alias för bakåtkompatibilitet
  type: "text" | "image" | "audio" | "file" | "system";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isEdited: boolean;
  editedAt?: string;
  replyToId?: string; // svara på specifikt meddelande
  reactions: MessageReaction[];
  readBy: MessageRead[];
  isDeleted: boolean;
  deletedAt?: string;
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  createdAt: string;
}

export interface MessageRead {
  userId: string;
  readAt: string;
}

export interface Chat {
  id: string;
  name: string;
  type: "team" | "group" | "private";
  description?: string;
  participants: string[]; // user IDs
  admins: string[]; // user IDs som kan administrera chatten
  createdBy: string;
  createdAt: string;
  lastMessageId?: string;
  lastMessageAt?: string;
  isArchived: boolean;
  settings: {
    allowFiles: boolean;
    allowImages: boolean;
    allowAudio: boolean;
    maxFileSize: number;
    muteUntil?: string;
  };
}

export interface QuickReply {
  id: string;
  text: string;
  category: "träning" | "match" | "allmänt" | "tack";
  isActive: boolean;
  usageCount: number;
  createdBy: string;
}

// Automatiska trådar för matcher/träningar
export interface AutoThread {
  id: string;
  activityId: string;
  threadId: string;
  type: "pre_match" | "post_match" | "training_recap";
  createdAt: string;
  isActive: boolean;
}