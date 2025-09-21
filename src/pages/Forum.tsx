import React, { useState, useEffect } from 'react';
import './Forum.css';
import fbcLogo from '../assets/image/FBC_ logo.jpg';
import { forumAPI } from '../services/apiService';
import { useUser } from '../context/UserContext';
import { useTitle } from '../hooks/useTitle';

// 1. Mörkare design och modernare kort:
const fbcTheme = {
	background: 'linear-gradient(135deg, #0A0A0A 0%, #1B2E1B 100%)',
	cardBg: 'rgba(16,32,16,0.97)',
	accent: '#2E7D32', // primaryGreen från Home
	accentDark: '#388E3C', // accentGreen från Home
	accentLight: '#4CAF50', // accentGreen från Home
	text: {
		primary: '#F1F8E9',
		secondary: '#C8E6C9',
	}
};

export type ForumComment = {
	author: string;
	text: string;
	date: string;
	likes: number;
	replies?: ForumComment[];
};

export type ForumPost = {
	id: string;
	title: string;
	content: string;
	author: string;
	date: string;
	pinned: boolean;
	media?: string;
	poll?: string[] | undefined;
	pollVotes?: number[] | undefined;
	pollVoters?: string[] | undefined;
	likes: number;
	comments?: ForumComment[];
};


const Forum: React.FC = () => {
	const { user: authUser } = useUser();
	useTitle('Forum - FBC Nyköping');
	const [posts, setPosts] = useState<ForumPost[]>([]);
	const [loading, setLoading] = useState(true);
	const [editPostId, setEditPostId] = useState<string|null>(null);
	const [editContent, setEditContent] = useState<string>("");
	const [showDeleteId, setShowDeleteId] = useState<string|null>(null);
	const [showNewPostForm, setShowNewPostForm] = useState(false);
	const [newPostTitle, setNewPostTitle] = useState('');
	const [newPostContent, setNewPostContent] = useState('');
	const [newPostMedia, setNewPostMedia] = useState('');
	const [newPollOptions, setNewPollOptions] = useState<string[]>(['']);
	const [pushMessage, setPushMessage] = useState('');
	// Paginering
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const POSTS_PER_PAGE = 20;

	// Ladda inlägg från backend vid mount och sidbyte
	useEffect(() => {
		setLoading(true);
		forumAPI.getPosts(currentPage, POSTS_PER_PAGE).then(res => {
			if (res.success && res.data?.posts) {
				setPosts(res.data.posts);
				setTotalPages(res.data.totalPages || 1);
			}
			setLoading(false);
		});
	}, [currentPage]);
	const [commentText, setCommentText] = useState('');
	const [showImportant, setShowImportant] = useState(false);
	// Lägg till state för filuppladdning och förhandsvisning
	const [newPostFile, setNewPostFile] = useState<File | null>(null);
	const [newPostPreview, setNewPostPreview] = useState<string>('');

		// Sortera: Viktiga först, sedan senaste
		let filteredPosts = posts.slice();
		if (showImportant) {
			filteredPosts = filteredPosts.filter(post => post.pinned);
		}
		filteredPosts = filteredPosts.sort((a, b) => {
			if (a.pinned && !b.pinned) return -1;
			if (!a.pinned && b.pinned) return 1;
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		});

	return (
		<div style={{
			minHeight: '100vh',
			background: fbcTheme.background,
			color: fbcTheme.text.primary,
			padding: '2rem 0.5rem',
			width: '100%',
			fontFamily: 'inherit',
			position: 'relative',
		}}>
			{/* Glassmorphism overlay */}
			<div style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				pointerEvents: 'none',
				zIndex: 0,
				background: 'radial-gradient(circle at 60% 20%, rgba(34,197,94,0.10) 0%, rgba(34,197,94,0.03) 70%, transparent 100%)',
				backdropFilter: 'blur(2px)',
			}} />
			<div style={{ maxWidth: 800, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
				{/* FBC-rubrik */}
				<div style={{ textAlign: 'center', marginBottom: '2.2rem', marginTop: '-0.5rem' }}>
					<h1 style={{
						color: fbcTheme.text.primary,
						fontWeight: 900,
						fontSize: '2.3rem',
						letterSpacing: '0.02em',
						textShadow: '0 2px 12px rgba(34,197,94,0.25)',
						marginBottom: '0.3rem',
					}}>
						Forum & Diskussion
					</h1>
					<div style={{ color: fbcTheme.text.secondary, fontSize: '1.15rem', fontWeight: 500 }}>
						Här kan du diskutera, ställa frågor och dela information med laget.
					</div>
				</div>
				{/* Push-notis */}
				{pushMessage && (
					<div style={{ background: fbcTheme.accent, color: '#fff', padding: '1rem', borderRadius: 12, marginBottom: '1rem', fontWeight: 'bold', textAlign: 'center', maxWidth: 400 }}>
						{pushMessage}
					</div>
				)}
				{/* Viktigt/Forum filter */}
				<div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
					<button onClick={() => setShowImportant(false)} style={{ background: !showImportant ? fbcTheme.accent : 'rgba(34,197,94,0.10)', color: !showImportant ? '#fff' : fbcTheme.accent, border: `2px solid ${fbcTheme.accent}`, borderRadius: '1rem', padding: '0.5rem 1.2rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: !showImportant ? '0 2px 8px #22c55e44' : 'none', transition: 'background 0.2s' }}>Forum</button>
					<button onClick={() => setShowImportant(true)} style={{ background: showImportant ? fbcTheme.accent : 'rgba(34,197,94,0.10)', color: showImportant ? '#fff' : fbcTheme.accent, border: `2px solid ${fbcTheme.accent}`, borderRadius: '1rem', padding: '0.5rem 1.2rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: showImportant ? '0 2px 8px #22c55e44' : 'none', transition: 'background 0.2s' }}>Viktigt</button>
				</div>
				{/* Nytt inlägg: media och omröstning */}
				{showNewPostForm && (
					<div style={{ background: fbcTheme.cardBg, borderRadius: '1.2rem', padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 12px #22c55e44', width: '100%', backdropFilter: 'blur(6px)', border: `2px solid ${fbcTheme.accent}` }}>
						<h3 style={{ color: fbcTheme.accent, fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Nytt inlägg</h3>
						<input
							type="text"
							placeholder="Titel"
							value={newPostTitle}
							onChange={e => setNewPostTitle(e.target.value)}
							style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1px solid #444', marginBottom: '1rem', fontSize: '1rem', background: fbcTheme.cardBg, color: fbcTheme.text.primary }}
						/>
						<textarea
							placeholder="Skriv ditt inlägg här..."
							value={newPostContent}
							onChange={e => setNewPostContent(e.target.value)}
							style={{ width: '100%', minHeight: 80, borderRadius: 8, border: '1px solid #444', marginBottom: '1rem', fontSize: '1rem', background: fbcTheme.cardBg, color: fbcTheme.text.primary }}
						/>
						{/* Filuppladdning och förhandsvisning */}
						<input
							type="file"
							accept="image/*,video/*"
							style={{ marginBottom: '1rem' }}
							onChange={e => {
								const file = e.target.files?.[0];
								setNewPostFile(file || null);
								if (file) {
									setNewPostPreview(URL.createObjectURL(file));
								} else {
									setNewPostPreview('');
								}
							}}
						/>
						{newPostPreview && (
							<div style={{ marginBottom: '1rem' }}>
								{newPostFile?.type.startsWith('image') ? (
									<img src={newPostPreview} alt="Förhandsvisning" style={{ maxWidth: '100%', borderRadius: 12, boxShadow: '0 2px 12px #22c55e44', border: `2px solid ${fbcTheme.accent}` }} />
								) : (
									<video src={newPostPreview} controls style={{ maxWidth: '100%', borderRadius: 12, boxShadow: '0 2px 12px #22c55e44', border: `2px solid ${fbcTheme.accent}` }} />
								)}
							</div>
						)}
						<div style={{ marginBottom: '1rem' }}>
							<label style={{ color: fbcTheme.text.secondary, fontWeight: 'bold' }}>Omröstning (valfritt):</label>
							{newPollOptions.map((opt, i) => (
								<input key={i} type="text" value={opt} placeholder={`Alternativ ${i+1}`} onChange={e => {
									const arr = [...newPollOptions]; arr[i] = e.target.value; setNewPollOptions(arr);
								}} style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem', borderRadius: 8, border: '1px solid #444', background: fbcTheme.cardBg, color: fbcTheme.text.primary }} />
							))}
							<button type="button" onClick={() => setNewPollOptions([...newPollOptions, ''])} style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', marginTop: '0.5rem' }}>Lägg till alternativ</button>
						</div>
						<button
							onClick={async () => {
								const poll = newPollOptions.filter(opt => opt.trim()).length > 1 ? newPollOptions.filter(opt => opt.trim()) : undefined;
								let mediaUrl = newPostMedia;
								if (newPostFile) {
									mediaUrl = newPostPreview;
								}
												const newPost: ForumPost = {
													id: Date.now().toString(),
													title: newPostTitle,
													content: newPostContent,
													  author: authUser?._id || '', // Skicka alltid MongoDB ObjectId
													date: new Date().toISOString(),
													pinned: false,
													media: mediaUrl,
													poll: poll,
													pollVotes: poll ? Array(poll.length).fill(0) : undefined,
													pollVoters: [],
													likes: 0,
													comments: [],
												};
								try {
									const res = await forumAPI.createPost(newPost);
									if (res && res.success && res.data) {
										// Hämta nya inlägg från backend
										const postsRes = await forumAPI.getPosts(1, 20);
										if (postsRes.success && postsRes.data?.posts) {
											setPosts(postsRes.data.posts);
										}
										setPushMessage('Nytt inlägg publicerat!');
										setTimeout(() => setPushMessage(''), 2000);
										setShowNewPostForm(false);
										setNewPostTitle('');
										setNewPostContent('');
										setNewPostMedia('');
										setNewPollOptions(['']);
										setNewPostFile(null);
										setNewPostPreview('');
									}
								} catch {
									setPushMessage('Kunde inte publicera inlägget!');
									setTimeout(() => setPushMessage(''), 2000);
								}
							}}
							style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', marginTop: '1rem' }}
						>Publicera</button>
					</div>
				)}
				<button onClick={() => setShowNewPostForm(true)} style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', marginBottom: '2rem', width: '100%', boxShadow: '0 2px 8px #22c55e44', transition: 'background 0.2s' }}>Nytt inlägg</button>
						{/* Visa inlägg med media, omröstning, kommentarer och nålning */}
						<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
							{loading ? (
								<div style={{ background: fbcTheme.cardBg, borderRadius: '1.2rem', padding: '2rem', textAlign: 'center', color: fbcTheme.text.secondary, boxShadow: '0 2px 12px #22c55e22' }}>
									Laddar inlägg...
								</div>
							) : filteredPosts.length === 0 ? (
								<div style={{ background: fbcTheme.cardBg, borderRadius: '1.2rem', padding: '2rem', textAlign: 'center', color: fbcTheme.text.secondary, boxShadow: '0 2px 12px #22c55e22' }}>
									Inga inlägg att visa
								</div>
							) : (
									filteredPosts.map((post, idx) => (
										<div
											key={post.id}
											style={{
												background: fbcTheme.cardBg,
												borderRadius: '1rem',
												boxShadow: '0 2px 8px #22c55e44',
												padding: '1.2rem 1rem',
												borderLeft: post.pinned ? `4px solid ${fbcTheme.accent}` : 'none',
												display: 'flex',
												flexDirection: 'column',
												gap: '0.7rem',
												position: 'relative',
												width: '100%',
												backdropFilter: 'blur(4px)',
												border: `2px solid ${post.pinned ? fbcTheme.accent : 'rgba(34,197,94,0.10)'}`,
												transition: 'border 0.2s',
											}}
										>
								{/* Rollbaserade rättigheter: ledare kan redigera/ta bort allt, spelare bara sina egna */}
								{authUser && (
									  (authUser.role === 'leader' || (post.author && authUser.name && post.author.trim().toLowerCase() === authUser.name.trim().toLowerCase())) && (
										<div style={{ display: 'flex', gap: '0.7rem', marginTop: '0.7rem' }}>
											<button style={{ background: fbcTheme.accent, color: '#fff', borderRadius: 8, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.95rem', border: 'none' }} onClick={() => { setEditPostId(post.id); setEditContent(post.content); }}>Redigera</button>
											<button style={{ background: '#e53935', color: '#fff', borderRadius: 8, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.95rem', border: 'none' }} onClick={() => setShowDeleteId(post.id)}>Ta bort</button>
										</div>
									)
								)}
				{/* Modal för redigering */}
				{editPostId && (
					<div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						<div style={{ background: fbcTheme.cardBg, borderRadius: '1.2rem', padding: '2rem 2rem 1.5rem 2rem', boxShadow: '0 8px 32px #22c55e44', minWidth: 280, maxWidth: 400, border: `2px solid ${fbcTheme.accent}` }}>
							<div style={{ fontWeight: 900, fontSize: '1.15rem', color: fbcTheme.accent, marginBottom: '1.2rem' }}>Redigera inlägg</div>
							<textarea value={editContent} onChange={e => setEditContent(e.target.value)} style={{ width: '100%', minHeight: 80, fontSize: '1rem', borderRadius: 8, border: `1.5px solid ${fbcTheme.accent}`, marginBottom: '1.2rem', padding: '0.5rem', background: fbcTheme.cardBg, color: fbcTheme.text.primary }} />
							<div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
												<button style={{ background: fbcTheme.accent, color: '#fff', borderRadius: 8, padding: '0.4rem 1.2rem', fontWeight: 700, fontSize: '1.05rem', border: 'none' }} onClick={() => {
													const updatedPosts = posts.map(p => p.id === editPostId ? { ...p, content: editContent } : p);
													setPosts(updatedPosts);
													// borttaget: ingen localStorage
													setEditPostId(null);
													setEditContent("");
													setPushMessage('Inlägg uppdaterat!');
													setTimeout(() => setPushMessage(''), 2000);
												}}>Spara</button>
								<button style={{ background: '#e53935', color: '#fff', borderRadius: 8, padding: '0.4rem 1.2rem', fontWeight: 700, fontSize: '1.05rem', border: 'none' }} onClick={() => setEditPostId(null)}>Avbryt</button>
							</div>
						</div>
					</div>
				)}
				{/* Modal för ta bort */}
				{showDeleteId && (
					<div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						<div style={{ background: fbcTheme.cardBg, borderRadius: '1.2rem', padding: '2rem 2rem 1.5rem 2rem', boxShadow: '0 8px 32px #22c55e44', minWidth: 280, maxWidth: 400, border: `2px solid #e53935` }}>
							<div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#e53935', marginBottom: '1.2rem' }}>Ta bort inlägg</div>
							<div style={{ color: fbcTheme.text.secondary, fontSize: '1.05rem', marginBottom: '1.2rem' }}>Är du säker på att du vill ta bort detta inlägg?</div>
							<div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
												<button style={{ background: '#e53935', color: '#fff', borderRadius: 8, padding: '0.4rem 1.2rem', fontWeight: 700, fontSize: '1.05rem', border: 'none' }} onClick={() => {
													const updatedPosts = posts.filter(p => p.id !== showDeleteId);
													setPosts(updatedPosts);
													// borttaget: ingen localStorage
													setShowDeleteId(null);
													setPushMessage('Inlägg borttaget!');
													setTimeout(() => setPushMessage(''), 2000);
												}}>Ta bort</button>
								<button style={{ background: fbcTheme.accent, color: '#fff', borderRadius: 8, padding: '0.4rem 1.2rem', fontWeight: 700, fontSize: '1.05rem', border: 'none' }} onClick={() => setShowDeleteId(null)}>Avbryt</button>
							</div>
						</div>
					</div>
				)}
								{post.pinned && <span style={{ position: 'absolute', top: 16, right: 20, color: fbcTheme.accent, fontWeight: 'bold', fontSize: '1.1rem' }}>📌 Nålat</span>}
								<div style={{ fontWeight: 'bold', fontSize: '1.15rem', color: fbcTheme.accent, textShadow: '0 2px 8px #22c55e22' }}>{post.title}</div>
								<div style={{ color: fbcTheme.text.secondary, fontSize: '1rem', lineHeight: 1.6 }}>{post.content}</div>
								{post.media && post.media.match(/.(jpg|jpeg|png|gif)$/i) && (
									<img src={post.media} alt="Bild" style={{ maxWidth: '100%', borderRadius: 12, margin: '1rem 0', boxShadow: '0 2px 12px #22c55e44', border: `2px solid ${fbcTheme.accent}` }} />
								)}
								{post.media && post.media.match(/.(mp4|webm|ogg)$/i) && (
									<video src={post.media} controls style={{ maxWidth: '100%', borderRadius: 12, margin: '1rem 0', boxShadow: '0 2px 12px #22c55e44', border: `2px solid ${fbcTheme.accent}` }} />
								)}
								{post.poll && post.poll.length > 1 && (
									<div style={{ margin: '1rem 0' }}>
										<strong style={{ color: fbcTheme.accent }}>Omröstning:</strong>
										{post.poll.map((opt: string, i: number) => (
											<div key={i} style={{ margin: '0.5rem 0', background: '#222', borderRadius: 8, padding: '0.5rem 1rem', color: fbcTheme.text.primary, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
												<span>{opt}</span>
												<span style={{ marginLeft: '1rem', color: fbcTheme.accent }}>{post.pollVotes ? post.pollVotes[i] : 0} röster</span>
												<button style={{ marginLeft: '1rem', background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}
													onClick={() => {
														const newPosts = [...posts];
														let pollVotes: number[] | undefined = undefined;
														if (Array.isArray(newPosts[idx]?.pollVotes)) {
															pollVotes = newPosts[idx]?.pollVotes;
														}
														if (!pollVotes || typeof pollVotes[i] !== 'number') return;
														// Max 1 röst per användare
														const user = authUser?.id || '';
														if (Array.isArray(newPosts[idx]?.pollVoters) && newPosts[idx]?.pollVoters?.includes(user)) {
															setPushMessage('Du har redan röstat!');
															setTimeout(() => setPushMessage(''), 2000);
															return;
														}
														pollVotes[i]++;
														if (Array.isArray(newPosts[idx]?.pollVoters)) {
															newPosts[idx]?.pollVoters?.push(user);
														}
														setPosts(newPosts);
														setPushMessage('Din röst är registrerad!');
														setTimeout(() => setPushMessage(''), 2000);
													}}
												>Rösta</button>
											</div>
										))}
									</div>
								)}
								<div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.95rem', color: '#b6c2d6', fontWeight: 500 }}>
									<img src={fbcLogo} alt="Profil" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #22c55e', boxShadow: '0 2px 8px #22c55e22' }} />
									<span>{post.author}</span> • {new Date(post.date).toLocaleDateString('sv-SE')}
								</div>
								<div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
									<button
										onClick={async () => {
											try {
												const postToLike = posts[idx];
												if (postToLike) {
													const res = await forumAPI.likePost(postToLike.id);
													if (res && res.success) {
														const postsRes = await forumAPI.getPosts(1, 20);
														if (postsRes.success && postsRes.data?.posts) {
															setPosts(postsRes.data.posts);
														}
													}
												}
											} catch {}
										}}
										style={{ background: fbcTheme.accentDark, color: fbcTheme.accentLight, border: 'none', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 600, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 2px 8px #22c55e44', transition: 'background 0.2s' }}
									>👍 {post.likes}</button>
								</div>
								<div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
									<button onClick={() => {
										const newPosts = [...posts];
										if (!newPosts[idx]) return;
										if (typeof newPosts[idx]?.pinned === 'boolean') {
											newPosts[idx]!.pinned = !newPosts[idx]!.pinned;
										}
										setPosts(newPosts);
										setPushMessage(newPosts[idx] && typeof newPosts[idx]?.pinned === 'boolean' && newPosts[idx]?.pinned ? 'Inlägg nålat som viktigt!' : 'Inlägg är inte längre nålat.');
										setTimeout(() => setPushMessage(''), 2000);
									}} style={{ background: post.pinned ? fbcTheme.accent : '#222', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>
										{post.pinned ? 'Ta bort från Viktigt' : 'Nåla som Viktigt'}
									</button>
									<span style={{ color: fbcTheme.text.secondary, fontSize: '0.95rem' }}>Kommentarer: {post.comments ? post.comments.length : 0}</span>
								</div>
								{/* Kommentarer */}
								<div style={{ marginTop: '1rem', background: 'rgba(34,197,94,0.07)', borderRadius: 10, padding: '1rem 0.7rem' }}>
									<strong style={{ color: fbcTheme.accent, fontSize: '1.08rem' }}>Kommentarer:</strong>
									{post.comments && post.comments.length > 0 ? (
										post.comments.map((c, i) => (
											<div key={i} style={{ background: fbcTheme.accentDark, borderRadius: 8, padding: '0.5rem 1rem', color: fbcTheme.text.primary, margin: '0.5rem 0', boxShadow: '0 2px 8px #22c55e22', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
												<img src={fbcLogo} alt="Profil" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid #22c55e', boxShadow: '0 2px 8px #22c55e22' }} />
												<span style={{ fontWeight: 'bold', color: fbcTheme.accent }}>{c.author}</span>: {c.text} <span style={{ color: fbcTheme.text.secondary, fontSize: '0.85rem' }}>({new Date(c.date).toLocaleDateString('sv-SE')})</span>
												<button onClick={() => {
													const newPosts = [...posts];
													const comments = Array.isArray(newPosts[idx]?.comments) ? newPosts[idx]?.comments : undefined;
													const comment = comments && comments[i] ? comments[i] : undefined;
													if (comment && typeof comment.likes === 'number') {
														comment.likes++;
														setPosts(newPosts);
													}
												}} style={{ background: fbcTheme.accentDark, color: fbcTheme.accentLight, border: 'none', borderRadius: 8, padding: '0.2rem 0.7rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', marginLeft: '0.5rem', boxShadow: '0 2px 8px #22c55e22' }}>👍 {typeof c.likes === 'number' ? c.likes : 0}</button>
												{/* Svarstråd */}
												<div style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
													{Array.isArray(c.replies) && c.replies.length > 0 && c.replies.map((r, ri) => (
														<div key={ri} style={{ background: fbcTheme.accentDark, borderRadius: 8, padding: '0.4rem 1rem', color: fbcTheme.text.primary, margin: '0.3rem 0', boxShadow: '0 2px 8px #22c55e22' }}>
															<span style={{ fontWeight: 'bold', color: fbcTheme.accent }}>{r.author}</span>: {r.text} <span style={{ color: fbcTheme.text.secondary, fontSize: '0.8rem' }}>({new Date(r.date).toLocaleDateString('sv-SE')})</span>
															<button onClick={() => {
																const newPosts = [...posts];
																const comments = Array.isArray(newPosts[idx]?.comments) ? newPosts[idx]?.comments : undefined;
																const comment = comments && comments[i] ? comments[i] : undefined;
																const replies = comment && Array.isArray(comment.replies) ? comment.replies : undefined;
																const reply = replies && replies[ri] ? replies[ri] : undefined;
																if (reply && typeof reply.likes === 'number') {
																	reply.likes++;
																	setPosts(newPosts);
																}
															}} style={{ background: fbcTheme.accentDark, color: fbcTheme.accentLight, border: 'none', borderRadius: 8, padding: '0.2rem 0.7rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', marginLeft: '0.5rem', boxShadow: '0 2px 8px #22c55e22' }}>👍 {typeof r.likes === 'number' ? r.likes : 0}</button>
														</div>
													))}
													<input type="text" placeholder="Svara..." style={{ width: '70%', marginTop: '0.3rem', padding: '0.3rem', borderRadius: 8, border: `1px solid ${fbcTheme.accentDark}`, background: fbcTheme.cardBg, color: fbcTheme.text.primary }}
														onKeyDown={e => {
															if (e.key === 'Enter' && e.currentTarget.value.trim()) {
																const newPosts = [...posts];
																const comments = Array.isArray(newPosts[idx]?.comments) ? newPosts[idx]?.comments : undefined;
																const comment = comments && comments[i] ? comments[i] : undefined;
																if (comment) {
																	if (!Array.isArray(comment.replies)) {
																		comment.replies = [];
																	}
																	if (Array.isArray(comment.replies)) {
																		comment.replies.push({ author: authUser?.id || '', text: e.currentTarget.value, date: new Date().toISOString(), likes: 0 });
																		setPosts(newPosts);
																		e.currentTarget.value = '';
																	}
																}
															}
														}}
													/>
												</div>
											</div>
										))
									) : (
										<div style={{ color: fbcTheme.text.secondary, fontSize: '0.95rem', margin: '0.5rem 0' }}>Inga kommentarer än.</div>
									)}
									<div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
										<input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Skriv en kommentar..." style={{ flex: 1, padding: '0.5rem', borderRadius: 8, border: `1px solid ${fbcTheme.accentDark}`, background: fbcTheme.cardBg, color: fbcTheme.text.primary }} />
										<button onClick={async () => {
											if (!commentText.trim()) return;
											const postId = posts[idx]?.id;
											if (postId) {
												const comment = { author: authUser?.id || '', text: commentText, date: new Date().toISOString(), likes: 0, replies: [] };
												try {
													const res = await forumAPI.addComment(postId, comment);
													if (res && res.success) {
														const postsRes = await forumAPI.getPosts(1, 20);
														if (postsRes.success && postsRes.data?.posts) {
															setPosts(postsRes.data.posts);
														}
														setCommentText('');
														setPushMessage('Ny kommentar publicerad!');
														setTimeout(() => setPushMessage(''), 2000);
													}
												} catch {}
											}
										}} style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 2px 8px #22c55e44', transition: 'background 0.2s' }}>Kommentera</button>
									</div>
								</div>
							</div>
								))
							)}
							{/* Paginering */}
							<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
								<button
									onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
									disabled={currentPage === 1}
									style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
								>Föregående</button>
								<span style={{ color: fbcTheme.text.secondary, fontWeight: 600, fontSize: '1.05rem' }}>Sida {currentPage} av {totalPages}</span>
								<button
									onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
									disabled={currentPage === totalPages}
									style={{ background: fbcTheme.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
								>Nästa</button>
							</div>
						</div>
			</div>
		{/* Responsivitet och animationer */}
		<style>{`
			@media (max-width: 700px) {
				.fbc-forum-card {
					padding: 0.7rem 0.3rem !important;
					font-size: 0.98rem !important;
				}
				.fbc-forum-media {
					max-width: 100% !important;
					border-radius: 10px !important;
				}
			}
			@media (max-width: 500px) {
				.fbc-forum-card {
					padding: 0.5rem 0.1rem !important;
					font-size: 0.95rem !important;
				}
			}
		`}</style>
	  </div>
	);
}

export default Forum;
