import React, { useState, useEffect } from 'react';
import './Forum.css';
import fbcLogo from '../assets/image/FBC_ logo.jpg';
import { forumAPI } from '../services/apiService';
import { useUser } from '../context/UserContext';
import { useTitle } from '../hooks/useTitle';


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
	// Felsökningslogg: visa authUser i konsolen
	React.useEffect(() => {
		console.log('Forum DEBUG: authUser', authUser);
	}, [authUser]);
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
	// const [commentText, setCommentText] = useState('');
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
		<div className="forum-root">
			{/* Glassmorphism overlay */}
			<div className="forum-glassmorphism-overlay" />
			<div className="forum-main-container">
				{/* FBC-rubrik */}
				<div className="forum-header">
					<h1 className="forum-title">
						Forum & Diskussion
					</h1>
					<div className="forum-subtitle">
						Här kan du diskutera, ställa frågor och dela information med laget.
					</div>
				</div>
				{/* Push-notis */}
				{pushMessage && (
					<div className="forum-push-message">
						{pushMessage}
					</div>
				)}
				{/* Viktigt/Forum filter */}
				<div className="forum-filter-bar">
					<button
						onClick={() => setShowImportant(false)}
						className={`forum-filter-btn${!showImportant ? ' active' : ''}`}
					>
						Forum
					</button>
					<button
						onClick={() => setShowImportant(true)}
						className={`forum-filter-btn${showImportant ? ' active' : ''}`}
					>
						Viktigt
					</button>
				</div>
				{/* Nytt inlägg: media och omröstning */}
				{showNewPostForm && (
					<div className="forum-new-post-form">
						<h3 className="forum-new-post-title">Nytt inlägg</h3>
						<label htmlFor="newPostTitle" className="forum-label-title">Titel</label>
						<input
							id="newPostTitle"
							type="text"
							placeholder="Titel"
							aria-label="Titel"
							value={newPostTitle}
							onChange={e => setNewPostTitle(e.target.value)}
							className="forum-input-title"
						/>
						<textarea
							placeholder="Skriv ditt inlägg här..."
							value={newPostContent}
							onChange={e => setNewPostContent(e.target.value)}
							className="forum-new-post-textarea"
						/>
									{/* Filuppladdning och förhandsvisning */}
									<div className="forum-upload-section">
										<label htmlFor="newPostFile" className="forum-upload-label">Ladda upp fil</label>
										<input
											id="newPostFile"
											type="file"
											accept="image/*,video/*"
											aria-label="Ladda upp fil"
											className="forum-upload-input"
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
									</div>
						{newPostPreview && (
							<div className="forum-new-post-preview">
								{newPostFile?.type.startsWith('image') ? (
									<img src={newPostPreview} alt="Förhandsvisning" className="forum-new-post-preview-img" />
								) : (
									<video src={newPostPreview} controls className="forum-new-post-preview-video" />
									)}
								</div>
							)
						}
						<div className="forum-poll-section">
							<label className="forum-poll-label">Omröstning (valfritt):</label>
										{newPollOptions.map((opt, i) => (
											<div key={i}>
												<label htmlFor={`pollOption${i}`} className="forum-poll-option-label">{`Alternativ ${i+1}`}</label>
												<input id={`pollOption${i}`} type="text" value={opt} placeholder={`Alternativ ${i+1}`} aria-label={`Alternativ ${i+1}`} onChange={e => {
													const arr = [...newPollOptions]; arr[i] = e.target.value; setNewPollOptions(arr);
												}} className="forum-poll-option-input" />
											</div>
										))}
							<button
								type="button"
								onClick={() => setNewPollOptions([...newPollOptions, ''])}
								className="forum-poll-add-option-btn"
							>
								Lägg till alternativ
							</button>
						</div>
						<button
							disabled={!authUser || !authUser.id}
							onClick={async () => {
								if (!authUser || !authUser.id) {
									setPushMessage('Fel: Du är inte korrekt inloggad! Logga ut och in igen.');
									setTimeout(() => setPushMessage(''), 3500);
									return;
								}
								const poll = newPollOptions.filter(opt => opt.trim()).length > 1 ? newPollOptions.filter(opt => opt.trim()) : undefined;
								let mediaUrl = newPostMedia;
								if (newPostFile) {
									mediaUrl = newPostPreview;
								}
								const newPost: ForumPost = {
									id: crypto.randomUUID(), // Generate a temporary unique id
									title: newPostTitle,
									content: newPostContent,
									author: authUser.id,
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
							className={`forum-publish-btn${(!authUser || !authUser.id) ? ' disabled' : ''}`}
						>Publicera</button>
					</div>
				)}
				<button
					onClick={() => setShowNewPostForm(true)}
					className="forum-new-post-btn"
				>
					Nytt inlägg
				</button>
						{/* Visa inlägg med media, omröstning, kommentarer och nålning */}
						<div className="forum-posts-list">
							{loading ? (
								<div className="forum-loading-message">
									Laddar inlägg...
								</div>
							) : filteredPosts.length === 0 ? (
								<div className="forum-loading-message">
									Inga inlägg att visa
								</div>
							) : (
									filteredPosts.map((post, idx) => (
															<div
																key={post.id}
																className={`forum-post-card${post.pinned ? ' forum-post-card-pinned' : ''}`}
															>
								{/* Rollbaserade rättigheter: ledare kan redigera/ta bort allt, spelare bara sina egna */}
												{authUser && (
															(authUser.role === 'leader' || (post.author && authUser.name && post.author.trim().toLowerCase() === authUser.name.trim().toLowerCase())) && (
														<div className="forum-post-actions">
															<button className="forum-edit-btn" onClick={() => { setEditPostId(post.id); setEditContent(post.content); }}>Redigera</button>
															<button className="forum-delete-btn" onClick={() => setShowDeleteId(post.id)}>Ta bort</button>
														</div>
													)
												)}
				{/* Modal för redigering */}
								{editPostId && (
										<div className="forum-modal-overlay">
											<div className="forum-modal-edit">
												<div className="forum-modal-title">Redigera inlägg</div>
												<label htmlFor="editPostContent" className="forum-modal-label">Redigera innehåll</label>
													<textarea
														id="editPostContent"
														className="forum-edit-textarea"
														value={editContent}
														onChange={e => setEditContent(e.target.value)}
														placeholder="Redigera ditt inlägg här..."
														title="Redigera innehåll"
													/>
													<div className="forum-modal-actions">
														<button className="forum-modal-save-btn" onClick={() => {
															const updatedPosts = posts.map(p => p.id === editPostId ? { ...p, content: editContent } : p);
															setPosts(updatedPosts);
															setEditPostId(null);
															setEditContent("");
															setPushMessage('Inlägg uppdaterat!');
															setTimeout(() => setPushMessage(''), 2000);
														}}>Spara</button>
														<button className="forum-modal-cancel-btn" onClick={() => setEditPostId(null)}>Avbryt</button>
													</div>
						</div>
					</div>
				)}
				{/* Modal för ta bort */}
								{showDeleteId && (
										<div className="forum-modal-overlay">
											<div className="forum-modal-delete">
												<div className="forum-modal-title forum-modal-title-delete">Ta bort inlägg</div>
												<div className="forum-modal-delete-text">Är du säker på att du vill ta bort detta inlägg?</div>
												<div className="forum-modal-actions">
													<button className="forum-modal-delete-btn" onClick={() => {
														const updatedPosts = posts.filter(p => p.id !== showDeleteId);
														setPosts(updatedPosts);
														setShowDeleteId(null);
														setPushMessage('Inlägg borttaget!');
														setTimeout(() => setPushMessage(''), 2000);
													}}>Ta bort</button>
													<button className="forum-modal-cancel-btn" onClick={() => setShowDeleteId(null)}>Avbryt</button>
												</div>
						</div>
					</div>
				)}
								{post.pinned && <span className="forum-post-pinned">📌 Nålat</span>}
								<div className="forum-post-title">{post.title}</div>
								<div className="forum-post-content">{post.content}</div>
												{post.media && post.media.match(/.(jpg|jpeg|png|gif)$/i) && (
													<img src={post.media} alt="Bild" className="forum-post-media-img" />
												)}
												{post.media && post.media.match(/.(mp4|webm|ogg)$/i) && (
													<video src={post.media} controls className="forum-post-media-video" />
												)}
												{post.poll && post.poll.length > 1 && (
													<div className="forum-post-poll">
														<strong className="forum-post-poll-title">Omröstning:</strong>
														{post.poll.map((opt: string, i: number) => (
															<div key={i} className="forum-post-poll-option">
																<span>{opt}</span>
																<span className="forum-post-poll-votes">{post.pollVotes ? post.pollVotes[i] : 0} röster</span>
																<button className="forum-post-poll-vote-btn"
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
												<div className="forum-post-meta">
													<img src={fbcLogo} alt="Profil" className="forum-post-meta-img" />
													<span>{post.author}</span> • {new Date(post.date).toLocaleDateString('sv-SE')}
												</div>
												<div className="forum-post-actions-bar">
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
														className="forum-post-like-btn"
													>👍 {post.likes}</button>
												</div>
								{/* ...existing code... */}
								{/* Knappar och formulär ska vara barn till div, inte direkt kod! */}
																{/* Remove or replace this button with the correct variable if needed */}
														</div>
										))
							)}
							{/* Paginering */}
											<div className="forum-pagination-bar">
												<button
													onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
													disabled={currentPage === 1}
													className={`forum-pagination-btn${currentPage === 1 ? ' disabled' : ''}`}
												>Föregående</button>
												<span className="forum-pagination-info">Sida {currentPage} av {totalPages}</span>
												<button
													onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
													disabled={currentPage === totalPages}
													className={`forum-pagination-btn${currentPage === totalPages ? ' disabled' : ''}`}
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
