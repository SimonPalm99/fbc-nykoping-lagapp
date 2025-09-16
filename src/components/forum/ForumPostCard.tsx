import React from "react";
import { useNavigate } from "react-router-dom";

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
  styles: any;
}

const ForumPostCard: React.FC<ForumPostCardProps> = ({ post, styles }) => {
  const navigate = useNavigate();
  return (
    <div
      key={post.id}
      style={{
        background: styles.cardBackground,
        borderRadius: "1.2rem",
        boxShadow: "0 4px 16px rgba(46,125,50,0.18)",
        border: `2px solid ${styles.primaryGreen}`,
        padding: "1.2rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.7rem",
        cursor: "pointer",
        transition: "box-shadow 0.2s, border 0.2s",
        position: "relative"
      }}
      onClick={() => navigate("/forum")}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(46,125,50,0.18)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(46,125,50,0.18)")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: styles.gradients.primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: "1.1rem" }}>
          {post.author?.charAt(0).toUpperCase() || "?"}
        </div>
        <div style={{ fontWeight: 700, fontSize: "1.05rem", color: styles.textPrimary }}>{post.title}</div>
      </div>
      {post.media && post.media.match(/.(jpg|jpeg|png|gif)$/i) && (
        <img src={post.media} alt="Bild" style={{ maxWidth: "100%", borderRadius: 10, marginBottom: "0.5rem" }} />
      )}
      <div style={{ color: styles.textSecondary, fontSize: "0.95rem" }}>{post.content && post.content.length > 120 ? post.content.slice(0, 120) + "..." : post.content}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.3rem" }}>
        <span style={{ color: styles.primaryGreen, fontWeight: 600, fontSize: "0.92rem" }}>{post.author}</span>
        <span style={{ color: styles.textSecondary, fontSize: "0.88rem" }}>{post.createdAt}</span>
      </div>
      <div style={{ display: "flex", gap: "1.2rem", marginTop: "0.3rem", fontSize: "0.92rem", color: styles.textSecondary }}>
        <span>💬 {post.comments ? post.comments.length : 0} kommentarer</span>
        <span>👍 {typeof post.likes === "number" ? post.likes : 0} likes</span>
      </div>
    </div>
  );
};

export default ForumPostCard;
