import React, { useState, useEffect } from 'react';
import { Achievement, LeaderboardEntry } from '../../types/gamification';
import { useAuth } from '../../context/AuthContext';

const GamificationDashboard: React.FC = () => {
	const { user } = useAuth();
	const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'challenges' | 'leaderboard'>('overview');
	const [achievements, setAchievements] = useState<Achievement[]>([]);
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [approvedUsers, setApprovedUsers] = useState<string[]>([]);

	useEffect(() => {
		if (!user) return;
		import('../../services/apiService').then(({ gamificationAPI, usersAPI }) => {
			gamificationAPI.getAchievements(user.id).then(res => {
				if (res.success) setAchievements(res.data);
			});
			gamificationAPI.getLeaderboard('xp').then(res => {
				if (res.success) setLeaderboard(res.data);
			});
			usersAPI.getAllUsers().then(res => {
				if (res.success) {
					// Filtrera ut godkända användare med profilkort
					const approved = res.data
						.filter((u: any) => u.isApproved && u.profileImageUrl !== undefined)
						.map((u: any) => u.userName || u.name);
					setApprovedUsers(approved);
				}
			});
		});
	}, [user]);

	if (!user) {
		return (
			<div className="text-center py-12">
				<div className="text-4xl mb-4">🎮</div>
				<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
					Logga in för att se din utveckling
				</h3>
				<p className="text-gray-500">
					Följ dina prestationer, utmärkelser och utmaningar
				</p>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto space-y-6">
			{/* Header */}
			<div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold mb-2">Gamification</h1>
						<p className="text-purple-100">Följ din utveckling och nå nya höjder</p>
					</div>
					<div className="text-center">
						<div className="text-4xl font-bold bg-white bg-opacity-20 rounded-lg p-4">-</div>
						<p className="text-sm mt-2">Level</p>
					</div>
				</div>
			</div>
			{/* Tabs */}
			<div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
				{[ 
					{ id: 'overview', label: 'Översikt', icon: '📊' },
					{ id: 'achievements', label: 'Utmärkelser', icon: '🏆' },
					{ id: 'challenges', label: 'Utmaningar', icon: '🎯' },
					{ id: 'leaderboard', label: 'Ranking', icon: '👑' }
				].map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id as any)}
						className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
							activeTab === tab.id
								? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
								: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
						}`}
					>
						<span>{tab.icon}</span>
						<span className="font-medium">{tab.label}</span>
					</button>
				))}
			</div>
			{/* Content */}
			{activeTab === 'overview' && (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-6">
						{/* Här kan du lägga till statistik, XP, mm */}
					</div>
								<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dagens Utmaningar</h3>
									<p className="text-gray-500">Inga utmaningar tillgängliga.</p>
								</div>
				</div>
			)}
			{activeTab === 'achievements' && (
				<div className="space-y-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Utmärkelser</h3>
					<ul>
						{achievements.map((achievement: Achievement) => (
							<li key={achievement.id} className="mb-2">
								<span className="font-semibold">{achievement.title}</span> — <span>{achievement.rarity}</span>
							</li>
						))}
					</ul>
				</div>
			)}
					{activeTab === 'challenges' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Utmaningar</h3>
							<p className="text-gray-500">Inga utmaningar tillgängliga.</p>
						</div>
					)}
			{activeTab === 'leaderboard' && (
				<div className="space-y-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ranking</h3>
					<table className="w-full">
						<thead>
							<tr>
								<th className="px-4 py-2">Rank</th>
								<th className="px-4 py-2">Spelare</th>
								<th className="px-4 py-2">Poäng</th>
							</tr>
						</thead>
						<tbody>
							{leaderboard
								.filter((entry: LeaderboardEntry) => approvedUsers.includes(entry.userName))
								.map((entry: LeaderboardEntry) => (
									<tr key={entry.rank}>
										<td className="px-4 py-2">{entry.rank}</td>
										<td className="px-4 py-2">{entry.userName}</td>
										<td className="px-4 py-2">{entry.value}</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default GamificationDashboard;
