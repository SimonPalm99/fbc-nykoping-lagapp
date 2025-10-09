import React, { useState, useRef, useEffect } from 'react';
import styles from '../pages/Forum.module.css';

export interface ForumComment {
  id: string;
  author: string;
  avatar: string;
  role: string;
  date: string;
  time: string;
  content: string;
}

export interface ForumPoll {
  question: string;
  options: string[];
 }

export interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  role: string;
  date: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  commentList?: ForumComment[];
  poll?: ForumPoll;
}

const MAX_LINES = 4;

const ForumPostCard: React.FC<{ post: ForumPost }> = ({ post }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [commentActive, setCommentActive] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Count lines in post content
  const lineCount = post.content.split(/\r?\n/).length;
  const shouldTruncate = lineCount > MAX_LINES || post.content.length > 220;

  // Mock comments if not provided
  const comments: ForumComment[] = post.commentList ?? [
    {
      id: 'c1',
      author: 'Sebastian Karlsson',
      avatar: '/default-avatar.png',
      role: 'Administratör',
      date: '9 okt',
      time: '10:22',
      content: 'Bra info, tack!'
    },
    {
      id: 'c2',
      author: 'Rabi Kahlaji',
      avatar: '/default-avatar.png',
      role: 'Spelare',
      date: '9 okt',
      time: '10:25',
      content: 'Jag har fått kortet!'
    },
    {
      id: 'c3',
      author: 'Leo Johansson',
      avatar: '/default-avatar.png',
      role: 'Spelare',
      date: '8 okt',
      time: '18:42',
      content: 'Jag har en klubba 👍'
    }
  ];

  // Show max 2 comments, with 'Visa fler kommentarer' link
  const [showAllComments, setShowAllComments] = useState(false);
  const visibleComments = showAllComments ? comments : comments.slice(0, 2);

  return (
    <div className={styles.forumPostCard}>
      <div className={styles.forumPostHeader}>
        <img src={post.avatar} alt={post.author} className={styles.forumPostAvatar} />
        <div className={styles.forumPostHeaderMeta}>
          <span className={styles.forumPostAuthor}>{post.author}</span>
          <span className={styles.forumPostRoleBadge}>{post.role}</span>
          <span className={styles.forumPostDate}>{post.date} kl. {post.time}</span>
        </div>
        <div className={styles.forumPostMenuWrapper} ref={menuRef}>
          <button
            className={styles.forumPostMenuBtn}
            title="Fler alternativ"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            &#8942;
          </button>
          {menuOpen && (
            <div className={styles.forumPostDropdownMenu}>
              <button className={styles.forumPostDropdownItem}>Redigera</button>
              <button className={styles.forumPostDropdownItem}>Ta bort</button>
              <button className={styles.forumPostDropdownItem}>Rapportera</button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.forumPostContent}>
        {expanded || !shouldTruncate ? (
          post.content
        ) : (
          <>
            {post.content.length > 220
              ? post.content.slice(0, 220) + '...'
              : post.content.split(/\r?\n/).slice(0, MAX_LINES).join('\n') + '...'}
            <button
              className={styles.forumPostShowMoreBtn}
              onClick={() => setExpanded(true)}
            >
              Visa mer
            </button>
          </>
        )}
        {expanded && shouldTruncate && (
          <button
            className={styles.forumPostShowMoreBtn}
            onClick={() => setExpanded(false)}
          >
            Visa mindre
          </button>
        )}
        {post.poll && post.poll.options.length > 0 && (
          <div className={styles.forumPostPollSection}>
            <div className={styles.forumPostPollQuestion}>{post.poll.question}</div>
            <div className={styles.forumPostPollOptionsRow}>
              {post.poll.options.map((opt, idx) => (
                <button key={idx} className={styles.forumPostPollOptionBtn}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={styles.forumPostActions}>
        <button
          className={liked ? `${styles.forumPostActionBtn} ${styles.active}` : styles.forumPostActionBtn}
          onClick={() => {
            setLiked(l => !l);
            setLikeCount(c => liked ? c - 1 : c + 1);
          }}
        >
          <span role="img" aria-label="Gilla">👍</span> Gilla
        </button>
        <button
          className={commentActive ? `${styles.forumPostActionBtn} ${styles.active}` : styles.forumPostActionBtn}
          onClick={() => setCommentActive(a => !a)}
        >
          <span role="img" aria-label="Kommentera">💬</span> Kommentera
        </button>
        <span className={styles.forumPostLikes}>{likeCount}</span>
        <span className={styles.forumPostComments}>{post.comments}</span>
      </div>
      {/* Comments section - compact style */}
      <div className={styles.forumPostCommentsSection}>
        {visibleComments.map(comment => (
          <div key={comment.id} className={styles.forumPostComment}>
            <img src={comment.avatar} alt={comment.author} className={styles.forumPostCommentAvatar} />
            <div className={styles.forumPostCommentMeta}>
              <div className={styles.forumPostCommentHeaderRow}>
                <span className={styles.forumPostCommentAuthor}>{comment.author}</span>
                <span className={styles.forumPostCommentRoleBadge}>{comment.role}</span>
                <span className={styles.forumPostCommentDate}>{comment.date} kl. {comment.time}</span>
              </div>
              <div className={styles.forumPostCommentContent}>{comment.content}</div>
              <div className={styles.forumPostCommentActionsRow}>
                <button className={styles.forumPostCommentActionBtn}>Gilla</button>
                <button className={styles.forumPostCommentActionBtn}>Svara</button>
              </div>
            </div>
          </div>
        ))}
        {comments.length > 2 && !showAllComments && (
          <button
            className={styles.forumPostShowMoreCommentsBtn}
            onClick={() => setShowAllComments(true)}
          >
            Visa fler kommentarer
          </button>
        )}
        {showAllComments && comments.length > 2 && (
          <button
            className={styles.forumPostShowMoreCommentsBtn}
            onClick={() => setShowAllComments(false)}
          >
            Visa färre kommentarer
          </button>
        )}
      </div>
      <div className={styles.forumPostCommentInputRow}>
        <label className={styles.forumPostFileUploadBtn} title="Bifoga bild, video eller fil">
          <span role="img" aria-label="Bifoga fil">�</span>
          <input
            type="file"
            className={styles.forumPostHiddenFileInput}
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            // onChange={handleFileChange} // implementera preview vid behov
          />
        </label>
        <input className={styles.forumPostCommentInput} placeholder="Skriv en kommentar ..." />
      </div>
    </div>
  );
};

export default ForumPostCard;
