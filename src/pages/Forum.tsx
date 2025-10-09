import React, { useState } from 'react';
import styles from './Forum.module.css';
import ForumPostCard, { ForumPost } from '../components/ForumPostCard';
import { forumAPI } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const Forum: React.FC = () => {
	const navigate = useNavigate();

	// Hämta inlägg från backend vid mount
	const [posts, setPosts] = useState<ForumPost[]>([]);
	React.useEffect(() => {
		forumAPI.getPosts().then((res: any) => {
			if (res.success && Array.isArray(res.data?.posts)) {
				setPosts(res.data.posts);
			}
		});
	}, []);
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
		// Skapa inlägg via backend
		const postData: any = {
			content: newPostText,
			poll: showPoll && pollQuestion.trim() ? {
				question: pollQuestion,
				options: pollOptions.filter(opt => opt.trim()),
			} : undefined,
			files,
		};
		forumAPI.createPost(postData).then((res: any) => {
			if (res.success && res.data) {
				setPosts(prev => [res.data, ...prev]);
			}
		});
	// Skicka till server via socket för live-uppdatering
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
					{posts.length === 0 ? (
						<div>Inga inlägg ännu.</div>
					) : (
						posts.map(post => (
							<ForumPostCard key={post.id} post={post} />
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default Forum;
