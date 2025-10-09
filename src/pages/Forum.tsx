

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Forum.css';

// Mockade inlägg
const posts = [
	{
		id: '1',
		author: 'Tobias Palm',
		role: 'Administratör',
		avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
		time: '10 tim',
		date: '2025-10-06 19:45',
		content:
			'Nån som har ett par vita “fotbollsstrumpor” att låna ut? (Helst adidas)',
		image: '',
		likes: 2,
		comments: [
			{
				id: 'c1',
				author: 'Rasmus Widén',
				role: 'Stigande medskapare',
				avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
				text:
					'Kan hämta upp honom,👌\nmen har vi någon som gillar att åka tidigt som kan köra tillbaka honom?',
				date: '2025-10-06 20:01',
			},
			{
				id: 'c2',
				author: 'Tobias Palm',
				role: 'Administratör',
				avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
				text: '@alla',
				date: '2025-10-06 20:05',
			},
		],
	},
	{
		id: '2',
		author: 'Sebastian Karlsson',
		role: 'Administratör',
		avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
		time: 'Igår kl. 10:56',
		date: '2025-10-05 10:56',
		content:
			'Skön start på helgen - fler såna tack! 💚\n\nHär kommer samtliga XpG (förväntade mål) FÖR och EMOT i olika spelfaser för att se hur vi kan spetsa till oss i avgörande lägen men också vad vi ska fortsätta göra för att skapa målchanser. 🔥\n\nKolla igenom filmklippet, funkar det inte så skickar jag en länk. 🎥',
		image:
			'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80',
		likes: 1,
		comments: [],
	},
];

const Forum: React.FC = () => {
	const [openComments, setOpenComments] = useState<string | null>(null);
	const [likes, setLikes] = useState<Record<string, number>>(() => {
		const likeObj: Record<string, number> = {};
		posts.forEach((post) => {
			likeObj[post.id] = post.likes || 0;
		});
		return likeObj;
	});
	const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});

	const handleLike = (id: string) => {
		setLikes((l) => ({ ...l, [id]: (l[id] ?? 0) + 1 }));
	};

	const navigate = useNavigate();
	const handleBack = () => {
		navigate('/');
	};

	const toggleExpand = (id: string) => {
		setExpandedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<div className="forum-bg">
			<header className="forum-header">
				<button className="forum-back-btn" onClick={handleBack}>
					Tillbaka
				</button>
				<h1 className="forum-title">FBC Nyköpings Forum</h1>
			</header>
			<main className="forum-main">
				<div className="forum-feed">
					{posts.map((post) => {
						const latestComments = post.comments.slice(-3);
						const showAll = openComments === post.id;
						const isLong = post.content.length > 220;
						const expanded = expandedPosts[post.id];
						return (
							<div key={post.id} className="forum-card">
								<div className="forum-card-header">
									<img src={post.avatar} alt="avatar" className="forum-avatar" />
									<div className="forum-author-info">
										<span className="forum-author">{post.author}</span>
										<span className="forum-role">{post.role}</span>
										<span className="forum-time">{post.time}</span>
										<span className="forum-date">{post.date}</span>
									</div>
								</div>
								<div className="forum-card-content">
									<div className="forum-card-text">
										{isLong && !expanded
											? post.content.slice(0, 220) + '...'
											: post.content}
									</div>
									{isLong && (
										<button
											className="forum-expand-btn"
											onClick={() => toggleExpand(post.id)}
										>
											{expanded ? 'Visa mindre' : 'Visa mer'}
										</button>
									)}
									{post.image && (
										<img
											src={post.image}
											alt="post"
											className="forum-card-image"
										/>
									)}
								</div>
								{/* Actions direkt under inlägget */}
								<div className="forum-card-actions">
									<button
										className="forum-like-btn"
										onClick={() => handleLike(post.id)}
									>
										<span className="forum-icon" role="img" aria-label="like">
											👍
										</span>
										<span className="forum-action-label">{likes[post.id]}</span>
									</button>
									<button
										className="forum-comment-btn"
										onClick={() => setOpenComments(showAll ? null : post.id)}
									>
										<span className="forum-icon" role="img" aria-label="comment">
											💬
										</span>
										<span className="forum-action-label">
											{post.comments.length}
										</span>
									</button>
								</div>
								{/* Visa de 3 senaste kommentarerna */}
								{latestComments.length > 0 && !showAll && (
									<div className="forum-comments-preview">
										{latestComments.map((comment) => (
											<div key={comment.id} className="forum-comment">
												<div className="forum-comment-header">
													<img
														src={comment.avatar}
														alt="avatar"
														className="forum-comment-avatar"
													/>
													<span className="forum-comment-author">
														{comment.author}
													</span>
													<span className="forum-comment-role">
														{comment.role}
													</span>
													<span className="forum-comment-date">
														{comment.date}
													</span>
												</div>
												<div className="forum-comment-text">{comment.text}</div>
												<div className="forum-comment-actions">
													<span className="forum-icon" role="img" aria-label="like">
														👍
													</span>
													<span className="forum-comment-likes">1</span>
													<button className="forum-comment-like-btn" disabled>
														Gilla
													</button>
													<button className="forum-comment-reply-btn" disabled>
														Svara
													</button>
												</div>
											</div>
										))}
										{post.comments.length > 3 && (
											<button
												className="forum-show-all-btn"
												onClick={() => setOpenComments(post.id)}
											>
												Visa alla kommentarer
											</button>
										)}
									</div>
								)}
								{/* Visa alla kommentarer om öppnad */}
								{showAll && (
									<div className="forum-comments">
										{post.comments.length === 0 ? (
											<div className="forum-no-comments">
												Inga kommentarer ännu.
											</div>
										) : (
											post.comments.map((comment) => (
												<div key={comment.id} className="forum-comment">
													<div className="forum-comment-header">
														<img
															src={comment.avatar}
															alt="avatar"
															className="forum-comment-avatar"
														/>
														<span className="forum-comment-author">
															{comment.author}
														</span>
														<span className="forum-comment-role">
															{comment.role}
														</span>
														<span className="forum-comment-date">
															{comment.date}
														</span>
													</div>
													<div className="forum-comment-text">{comment.text}</div>
													<div className="forum-comment-actions">
														<span className="forum-icon" role="img" aria-label="like">
															👍
														</span>
														<span className="forum-comment-likes">1</span>
														<button className="forum-comment-like-btn" disabled>
															Gilla
														</button>
														<button className="forum-comment-reply-btn" disabled>
															Svara
														</button>
													</div>
												</div>
											))
										)}
										<button
											className="forum-hide-all-btn"
											onClick={() => setOpenComments(null)}
										>
											Stäng kommentarer
										</button>
										<div className="forum-comment-input">
											<input
												type="text"
												placeholder="Skriv en kommentar..."
												disabled
											/>
											<button disabled>Skicka</button>
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</main>
		</div>
	);
};

export default Forum;
