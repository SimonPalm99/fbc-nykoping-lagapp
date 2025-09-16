// Detta är en utility för att konvertera mellan auth och profile user-typer
// För närvarande inaktiverad på grund av typskillnader

// Tom export för att göra detta till en modul
export {};

/*
export const convertAuthUserToProfileUser = (authUser: AuthUser): ProfileUser => {
  return {
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    jerseyNumber: authUser.jerseyNumber || 0,
    role: authUser.role === 'leader' ? 'ledare' : authUser.role === 'admin' ? 'admin' : 'spelare',
    isApproved: authUser.status === 'approved',
    profileImageUrl: authUser.profilePicture || '',
    favoritePosition: authUser.position || 'Ej vald',
    about: authUser.aboutMe || '',
    badges: [],
    milestones: [],
    clubHistory: [],
    iceContacts: [],
    trainingLogs: authUser.personalTrainingLog?.map(log => ({
      id: log.id,
      date: log.date,
      feeling: log.feeling,
      note: log.notes || '',
      duration: log.duration,
      intensity: log.intensity,
      skills: [] // Auth-typen har inte skills, så vi sätter tom array
    })) || [],
    injuries: [],
    statistics: {
      gamesPlayed: authUser.stats?.totalMatches || 0,
      goals: authUser.stats?.totalGoals || 0,
      assists: authUser.stats?.totalAssists || 0,
      points: (authUser.stats?.totalGoals || 0) + (authUser.stats?.totalAssists || 0),
      shots: 0,
      shotPercentage: 0,
      plusMinus: 0,
      penaltyMinutes: 0,
      blocks: 0,
      steals: 0
    },
    birthday: authUser.dateOfBirth || '1990-01-01',
    phone: authUser.phone || '',
    address: authUser.address,
    emergencyMedicalInfo: authUser.emergencyContact,
    joinDate: authUser.createdAt,
    lastActive: authUser.lastLoginAt || new Date().toISOString(),
    totalGamificationPoints: 0,
    preferences: {
      notifications: authUser.preferences?.notifications ?? true,
      publicProfile: authUser.preferences?.publicProfile ?? true,
      showStats: authUser.preferences?.showStats ?? true,
      language: authUser.preferences?.language || 'sv',
      theme: authUser.preferences?.theme || 'auto',
      shareLocation: false
    },
    fines: {
      total: 0,
      paid: 0,
      outstanding: 0
    },
    socialMedia: authUser.socialMedia,
    achievements: {
      mvpVotes: 0,
      playerOfTheWeek: 0,
      consecutiveTrainings: 0,
      bestStreak: 0
    }
  };
};

export const convertProfileUserToAuthUser = (profileUser: ProfileUser): Partial<AuthUser> => {
  return {
    id: profileUser.id,
    name: profileUser.name,
    email: profileUser.email,
    profilePicture: profileUser.profileImageUrl,
    jerseyNumber: profileUser.jerseyNumber,
    position: profileUser.favoritePosition,
  role: profileUser.role === 'leader' ? 'leader' : profileUser.role === 'admin' ? 'admin' : 'player',
    status: profileUser.isApproved ? 'approved' : 'pending',
    about: profileUser.about,
    phone: profileUser.phone,
    address: profileUser.address,
    dateOfBirth: profileUser.birthday,
    emergencyContact: profileUser.emergencyMedicalInfo,
    socialMedia: profileUser.socialMedia,
    preferences: {
      notifications: profileUser.preferences.notifications,
      publicProfile: profileUser.preferences.publicProfile,
      showStats: profileUser.preferences.showStats,
      language: profileUser.preferences.language,
      theme: profileUser.preferences.theme
    },
    personalTrainingLog: profileUser.trainingLogs.map(log => ({
      id: log.id,
      date: log.date,
      feeling: log.feeling,
      notes: log.note,
      duration: log.duration,
      intensity: log.intensity,
      skills: log.skills
    })),
    statistics: {
      gamesPlayed: profileUser.statistics.gamesPlayed,
      goals: profileUser.statistics.goals,
      assists: profileUser.statistics.assists,
      shots: profileUser.statistics.shots,
      shotPercentage: profileUser.statistics.shotPercentage,
      plusMinus: profileUser.statistics.plusMinus,
      penaltyMinutes: profileUser.statistics.penaltyMinutes,
      blocks: profileUser.statistics.blocks,
      steals: profileUser.statistics.steals,
      saves: profileUser.statistics.saves,
      savePercentage: profileUser.statistics.savePercentage,
      goalsAgainst: profileUser.statistics.goalsAgainst,
      gaa: profileUser.statistics.gaa
    }
  };
};
*/
