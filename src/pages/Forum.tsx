import React, { useState } from 'react';
import styles from './Forum.module.css';
import ForumPostCard, { ForumPost } from '../components/ForumPostCard';
import { socketService } from '../services/socketService';
import { useNavigate } from 'react-router-dom';

const Forum: React.FC = () => {
	const navigate = useNavigate();

	// Live-uppdatering: anslut till socket vid mount
	React.useEffect(() => {
		socketService.connect();
		socketService.joinRoom('forum');
		socketService.socket?.on('newPost', (newPost: ForumPost) => {
			setPosts(prev => [newPost, ...prev]);
		});
		socketService.socket?.on('newComment', (data: { postId: string; comment: any }) => {
			setPosts(prev => prev.map(post =>
				post.id === data.postId
					? { ...post, comments: (post.comments ?? 0) + 1 } // eller uppdatera commentList om det finns
					: post
			));
		});
		return () => {
			socketService.disconnect();
		};
	}, []);
	const [posts, setPosts] = useState<ForumPost[]>([
		{
			id: '1',
			author: 'Simon Palm',
			avatar: '/default-avatar.png',
			role: 'Tränare',
			date: '9 okt',
			time: '10:15',
			content: 'Välkommen till forumet! Här kan du diskutera allt kring laget.',
			likes: 12,
			comments: 3,
		},
		{
			id: '2',
			author: 'Anna Svensson',
			avatar: '/default-avatar.png',
			role: 'Spelare',
			date: '8 okt',
			time: '18:42',
			content: 'Bra träning idag! Någon som vill ses och köra extra pass imorgon?',
			likes: 7,
			comments: 2,
		},
	]);
	const [showForm, setShowForm] = useState(false);
	const [newPostText, setNewPostText] = useState('');
	const [files, setFiles] = useState<File[]>([]);
	// Poll state
	const [showPoll, setShowPoll] = useState(false);
	const [pollQuestion, setPollQuestion] = useState('');
	const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFiles(Array.from(e.target.files));
		}
	};

	const handleRemoveFile = (idx: number) => {
		setFiles(files => files.filter((_, i) => i !== idx));
	};

	const handlePollOptionChange = (idx: number, value: string) => {
		setPollOptions(opts => opts.map((opt, i) => i === idx ? value : opt));
	};

	const handleAddPollOption = () => {
		setPollOptions(opts => [...opts, '']);
	};

	const handleRemovePollOption = (idx: number) => {
		setPollOptions(opts => opts.filter((_, i) => i !== idx));
	};

	const handleCreatePost = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newPostText.trim() && !showPoll) return;
		const now = new Date();
		const post: ForumPost = {
			id: Math.random().toString(36).slice(2),
			author: 'Ditt Namn', // Byt ut mot inloggad användare
			avatar: '/default-avatar.png',
			role: 'Spelare',
			date: now.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }),
			time: now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
			content: newPostText,
			likes: 0,
			comments: 0,
			...(showPoll && pollQuestion.trim() ? {
				poll: {
					question: pollQuestion,
					options: pollOptions.filter(opt => opt.trim()),
				}
			} : {}),
			// You can add a files property if ForumPost supports it
		};
	setPosts([post, ...posts]);
	// Skicka till server via socket för live-uppdatering
	socketService.socket?.emit('newPost', post);
		setNewPostText('');
		setFiles([]);
		setShowPoll(false);
		setPollQuestion('');
		setPollOptions(['', '']);
		setShowForm(false);
	};

	return (
		<div className={styles.forumWrapper}>
			<button
				className={styles.forumBackBtn}
				onClick={() => navigate('/')}
				aria-label="Tillbaka till startsidan"
			>
				Tillbaka
			</button>
			<div className={styles.forumGradientTop} />
			<div className={styles.forumContainer}>
				<div className={styles.forumHeader}>
					<img src="/fbc-logo.jpg" alt="FBC Nyköping" className={styles.forumHeaderLogo} />
					<span className={styles.forumTitle}>FBC Nyköpings Forum</span>
				</div>
				<div className={styles.forumCreatePostRow}>
					<button
						className={styles.forumCreatePostBtn}
						onClick={() => setShowForm(f => !f)}
					>
						Skapa inlägg
					</button>
				</div>
				{showForm && (
					<form className={styles.forumCreatePostForm} onSubmit={handleCreatePost}>
						<textarea
							className={styles.forumCreatePostTextarea}
							value={newPostText}
							onChange={e => setNewPostText(e.target.value)}
							placeholder="Skriv ditt inlägg här..."
							rows={3}
						/>
						<label className={styles.forumCreatePostFileBtn}>
							<span role="img" aria-label="Bifoga fil">📎</span> Bifoga fil/bild
							<input
								type="file"
								multiple
								accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
								className={styles.forumCreatePostFileInput}
								onChange={handleFileChange}
							/>
						</label>
						{files.length > 0 && (
							<div className={styles.forumCreatePostFilePreviewRow}>
								{files.map((file, idx) => (
									<div key={idx} className={styles.forumCreatePostFilePreview}>
										{file.type.startsWith('image/') ? (
											<img
												src={URL.createObjectURL(file)}
												alt={file.name}
												className={styles.forumCreatePostFileImg}
											/>
										) : (
											<span className={styles.forumCreatePostFileName}>{file.name}</span>
										)}
										<button type="button" className={styles.forumCreatePostFileRemoveBtn} onClick={() => handleRemoveFile(idx)}>
											Ta bort
										</button>
									</div>
								))}
							</div>
						)}
						<div className={styles.forumCreatePostPollRow}>
							<button
								type="button"
								className={styles.forumCreatePostPollBtn}
								onClick={() => setShowPoll(p => !p)}
							>
								{showPoll ? 'Ta bort omröstning' : 'Lägg till omröstning'}
							</button>
						</div>
						{showPoll && (
							<div className={styles.forumCreatePostPollForm}>
								<input
									className={styles.forumCreatePostPollQuestion}
									type="text"
									value={pollQuestion}
									onChange={e => setPollQuestion(e.target.value)}
									placeholder="Omröstningsfråga..."
								/>
								{pollOptions.map((opt, idx) => (
									<div key={idx} className={styles.forumCreatePostPollOptionRow}>
										<input
											className={styles.forumCreatePostPollOption}
											type="text"
											value={opt}
											onChange={e => handlePollOptionChange(idx, e.target.value)}
											placeholder={`Alternativ ${idx + 1}`}
										/>
										{pollOptions.length > 2 && (
											<button type="button" className={styles.forumCreatePostPollRemoveBtn} onClick={() => handleRemovePollOption(idx)}>
												Ta bort
											</button>
										)}
									</div>
								))}
								<button type="button" className={styles.forumCreatePostPollAddBtn} onClick={handleAddPollOption}>
									Lägg till alternativ
								</button>
							</div>
						)}
						<button type="submit" className={styles.forumCreatePostSubmitBtn}>
							Publicera
						</button>
					</form>
				)}
				<div className={styles.forumFeed}>
					{posts.map(post => (
						<ForumPostCard key={post.id} post={post} />
					))}
				</div>
			</div>
		</div>
	);
};

export default Forum;
