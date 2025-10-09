import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../../context/UserContext";
import { forumAPI } from "../../services/apiService";
import styles from "./ForumFeed.module.css";



const ForumFeed: React.FC = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ title: "", content: "", media: "" });
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // const isDark = false; // Byt till din theme-hook om du har
  // const styles = getStyles(isDark);

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
    <div className={styles.forumFeedRoot}>
      <div className={styles.forumFeedContainer}>
        <h1 className={styles.forumFeedTitle}>Forum</h1>
        {/* Skapa nytt inlägg */}
        <form onSubmit={handleCreatePost} className={styles.forumForm}>
          <input
            type="text"
            placeholder="Titel"
            value={newPost.title}
            onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
            className={styles.forumInput}
            required
            title="Titel på inlägg"
          />
          <textarea
            placeholder="Skriv ditt inlägg..."
            value={newPost.content}
            onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
            className={styles.forumTextarea}
            required
            title="Inläggstext"
          />
          {newPost.media && (
            <img src={newPost.media} alt="Uppladdad bild" className={styles.forumImagePreview} />
          )}
          <input
            type="file"
            ref={fileInputRef}
            className={styles.forumFileInput}
            accept="image/*"
            onChange={handleFileUpload}
            title="Ladda upp bild"
          />
          <div className={styles.forumFormActions}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={styles.forumButtonUpload}
              title="Ladda upp bild"
            >
              Ladda upp bild
            </button>
            <button
              type="submit"
              disabled={posting}
              className={styles.forumButtonSubmit}
              title="Skapa inlägg"
            >
              {posting ? "Skickar..." : "Skapa inlägg"}
            </button>
          </div>
        </form>
        {/* Felmeddelande */}
        {error && <div className={styles.forumError}>{error}</div>}
        {/* Inläggslista */}
        {loading ? (
          <div className={styles.forumLoading}>Laddar forum...</div>
        ) : (
          posts.length === 0 ? (
            <div className={styles.forumEmpty}>Inga inlägg ännu.</div>
          ) : (
            <div className={styles.forumPostsList}>
              {/* ForumPostCard borttagen, lägg till ny komponent här om du vill visa foruminlägg */}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ForumFeed;
