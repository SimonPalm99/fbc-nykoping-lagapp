import React, { createContext, useState, ReactNode } from "react";
import { forumAPI } from '../services/apiService';

export const useForum = () => {
  const ctx = React.useContext(ForumContext);
  if (!ctx) throw new Error("useForum måste användas inom ForumProvider");
  return ctx;
};

export const ForumContext = createContext<any>(undefined);

export const ForumProvider = ({ children }: { children: ReactNode }) => {
  const [threads, setThreads] = useState<any[]>([]);

  // Hämta trådar/inlägg från backend vid mount
  React.useEffect(() => {
    forumAPI.getPosts()
      .then((res: any) => {
        if (Array.isArray(res)) {
          setThreads(res);
        } else if (res.success && Array.isArray(res.posts)) {
          setThreads(res.posts);
        }
      });
  }, []);

  const addThread = async (thread: { title: string; content: string; }) => {
    await forumAPI.createPost(thread);
    const posts = await forumAPI.getPosts();
    if (Array.isArray(posts)) {
      setThreads(posts);
    } else if (posts && Array.isArray(posts.data)) {
      setThreads(posts.data);
    }
  };

  const addComment = async (threadId: string, comment: { author: string; text: string; }) => {
    await forumAPI.addComment(threadId, comment);
    const posts = await forumAPI.getPosts();
    if (Array.isArray(posts)) {
      setThreads(posts);
    } else if (posts && Array.isArray(posts.data)) {
      setThreads(posts.data);
    }
  };

  const editThread = async (threadId: string, updates: Partial<any>) => {
    await forumAPI.updatePost(threadId, updates);
    const posts = await forumAPI.getPosts();
    if (Array.isArray(posts)) {
      setThreads(posts);
    } else if (posts && Array.isArray(posts.data)) {
      setThreads(posts.data);
    }
  };

  const deleteThread = async (threadId: string) => {
    await forumAPI.deletePost(threadId);
    const posts = await forumAPI.getPosts();
    if (Array.isArray(posts)) {
      setThreads(posts);
    } else if (posts && Array.isArray(posts.data)) {
      setThreads(posts.data);
    }
  };

  return (
    <ForumContext.Provider value={{
      threads,
      addThread,
      addComment,
      editThread,
      deleteThread
    }}>
      {children}
    </ForumContext.Provider>
  );
}