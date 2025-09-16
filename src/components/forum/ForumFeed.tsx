import React, { useState, useEffect, useRef } from "react";
import ForumPostCard from "./ForumPostCard";
import { useUser } from "../../context/UserContext";
import { forumAPI } from "../../services/apiService";

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

const ForumFeed: React.FC = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ title: "", content: "", media: "" });
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isDark = false; // Byt till din theme-hook om du har
  const styles = getStyles(isDark);

  useEffect(() => {
    setLoading(true);
    forumAPI.getPosts()
      .then((res: any) => {
        if (res.success && Array.isArray(res.data?.posts)) {
          setPosts(res.data.posts);
        } else {
          setError("Kunde inte hämta foruminlägg.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Kunde inte hämta foruminlägg.");
        setLoading(false);
      });
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    setPosting(true);
    const post = {
      title: newPost.title,
      content: newPost.content,
      media: newPost.media,
      author: user?.name || "Anonym",
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    };
    const res = await forumAPI.createPost(post);
    if (res.success && res.data) {
      setPosts(prev => [res.data, ...prev]);
      setNewPost({ title: "", content: "", media: "" });
    } else {
      setError("Kunde inte skapa inlägg.");
    }
    setPosting(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Simulera uppladdning (ersätt med riktig uppladdning vid backend)
    setTimeout(() => {
      let url = URL.createObjectURL(file);
      setNewPost(p => ({ ...p, media: url }));
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", background: styles.gradients.body, padding: "2rem 0.5rem" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ color: styles.primaryGreen, fontWeight: 900, fontSize: "2rem", marginBottom: "1.2rem" }}>Forum</h1>
        {/* Skapa nytt inlägg */}
        <form onSubmit={handleCreatePost} style={{ background: styles.cardBackground, borderRadius: "1.2rem", boxShadow: "0 2px 8px #22c55e22", padding: "1.2rem", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          <input
            type="text"
            placeholder="Titel"
            value={newPost.title}
            onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
            style={{ padding: "0.7rem", borderRadius: "0.7rem", border: `2px solid ${styles.primaryGreen}`, fontSize: "1.05rem" }}
            required
          />
          <textarea
            placeholder="Skriv ditt inlägg..."
            value={newPost.content}
            onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
            style={{ padding: "0.7rem", borderRadius: "0.7rem", border: `2px solid ${styles.primaryGreen}`, fontSize: "1.05rem", minHeight: 80 }}
            required
          />
          {newPost.media && (
            <img src={newPost.media} alt="Uppladdad bild" style={{ maxWidth: "100%", borderRadius: 10, marginBottom: "0.5rem" }} />
          )}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileUpload}
          />
          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: styles.gradients.cardHover, color: styles.primaryGreen, border: "none", borderRadius: "0.7rem", padding: "0.7rem 1.2rem", fontWeight: 700, fontSize: "1.05rem", cursor: "pointer" }}>Ladda upp bild</button>
            <button type="submit" disabled={posting} style={{ background: styles.gradients.primary, color: "white", border: "none", borderRadius: "0.7rem", padding: "0.7rem 1.2rem", fontWeight: 700, fontSize: "1.05rem", cursor: posting ? "not-allowed" : "pointer" }}>{posting ? "Skickar..." : "Skapa inlägg"}</button>
          </div>
        </form>
        {/* Felmeddelande */}
        {error && <div style={{ color: "#e53935", fontWeight: 700, marginBottom: "1rem" }}>{error}</div>}
        {/* Inläggslista */}
        {loading ? (
          <div style={{ color: styles.primaryGreen, fontWeight: 700, fontSize: "1.2rem" }}>Laddar forum...</div>
        ) : (
          posts.length === 0 ? (
            <div style={{ color: styles.textSecondary, fontWeight: 600, fontSize: "1.1rem" }}>Inga inlägg ännu.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {posts.map(post => (
                <ForumPostCard key={post.id} post={post} styles={styles} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ForumFeed;
