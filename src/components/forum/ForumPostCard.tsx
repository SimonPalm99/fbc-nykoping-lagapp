import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ForumPostCard.module.css";

interface ForumPostCardProps {
  post: {
    id: string;
    title: string;
    author: string;
    createdAt: string;
    content: string;
    media?: string;
    comments?: any[];
    likes?: number;
    isLocal?: boolean;
  };
}

const ForumPostCard: React.FC<ForumPostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  return (
    <div
      key={post.id}
      className={styles["forum-post-card"]}
      onClick={() => navigate("/forum")}
    >
      <div className={styles["forum-post-header"]}>
        <div className={styles["forum-post-avatar"]}>
          {post.author?.charAt(0).toUpperCase() || "?"}
        </div>
        <div className={styles["forum-post-title"]}>{post.title}</div>
      </div>
      {post.media && post.media.match(/.(jpg|jpeg|png|gif)$/i) && (
        <img src={post.media} alt="Bild" className={styles["forum-post-image"]} />
      )}
      <div className={styles["forum-post-content"]}>{post.content && post.content.length > 120 ? post.content.slice(0, 120) + "..." : post.content}</div>
      <div className={styles["forum-post-meta"]}>
        <span className={styles["forum-post-author"]}>{post.author}</span>
        <span className={styles["forum-post-date"]}>{post.createdAt}</span>
      </div>
      <div className={styles["forum-post-actions"]}>
        <span>💬 {post.comments ? post.comments.length : 0} kommentarer</span>
        <span>👍 {typeof post.likes === "number" ? post.likes : 0} likes</span>
      </div>
    </div>
  );
};

export default ForumPostCard;
