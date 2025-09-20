export const chatRoomAPI = {
  // Skapa ny grupp
  create: (room: { name: string; description?: string; avatar?: string; participants: string[]; creatorId: string }) =>
    apiService.post<any>('/chatrooms', room),

  // Hämta alla grupper där användaren är deltagare
  getRoomsForUser: (userId: string) =>
    apiService.get<any[]>(`/chatrooms/user/${userId}`),

  // Ta bort grupp
  delete: (id: string) =>
    apiService.delete<any>(`/chatrooms/${id}`)
};
export const matchAPI = {
  getAll: () => apiService.get<any[]>('/matches'),
  getById: (id: string) => apiService.get<any>(`/matches/${id}`),
  create: (match: any) => apiService.post<any>('/matches', match),
  update: (id: string, match: any) => apiService.put<any>(`/matches/${id}`, match),
  delete: (id: string) => apiService.delete<any>(`/matches/${id}`)
};
export const matchStatsAPI = {
  getAll: () => apiService.get<any[]>('/matchstats'),
  getById: (id: string) => apiService.get<any>(`/matchstats/${id}`),
  create: (stats: any) => apiService.post<any>('/matchstats', stats),
  update: (id: string, stats: any) => apiService.put<any>(`/matchstats/${id}`, stats),
  delete: (id: string) => apiService.delete<any>(`/matchstats/${id}`)
};
export const checkQuestionAPI = {
  getAll: () => apiService.get<any[]>('/check-questions'),
  create: (question: any) => apiService.post<any>('/check-questions', question),
  update: (id: string, question: any) => apiService.put<any>(`/check-questions/${id}`, question),
  delete: (id: string) => apiService.delete<any>(`/check-questions/${id}`)
};
export const cashAPI = {
  getAll: () => apiService.get<any[]>('/cash'),
  add: (entry: any) => apiService.post<any>('/cash', entry)
};

export const rulesAPI = {
  getAll: () => apiService.get<any[]>('/rules'),
  add: (rule: any) => apiService.post<any>('/rules', rule)
};
export const messagesAPI = {
  // Hämta meddelanden för en användare (alla)
  getMessagesForUser: (userId: string) =>
    apiService.get<any[]>(`/messages/user/${userId}`),

  // Hämta meddelanden för en användare med paginering
  getMessagesForUserPaginated: (userId: string, page: number = 1, limit: number = 50) =>
    apiService.get<any[]>(`/messages/user/${userId}?page=${page}&limit=${limit}`),

  // Skicka nytt meddelande
  sendMessage: (message: { sender: string; receiver: string; content: string }) =>
    apiService.post<any>('/messages', message)
};
// Enhanced API service with proper error handling, caching, and retry logic
export interface APIConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expires: number;
}

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class APIService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  constructor(private config: APIConfig) {}

  // Cache methods
  private setCache<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expires: now + ttl
    });
    this.cleanupCache();
  }

  private getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  private cleanupCache(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }

  // Retry logic with exponential backoff
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Main request method with retry logic
  async request<T>(
    endpoint: string, 
    options: RequestInit = {},
    useCache: boolean = true,
    cacheTTL?: number
  ): Promise<APIResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    const cacheKey = `${options.method || 'GET'}:${url}:${JSON.stringify(options.body || {})}`;

    // Check cache first (only for GET requests)
    if (useCache && (!options.method || options.method === 'GET')) {
      const cached = this.getCache<APIResponse<T>>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    let lastError: Error | undefined;
    
    // Retry logic
    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new APIError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status
          );
        }

        const data = await response.json();
        const result: APIResponse<T> = {
          data,
          success: true
        };

        // Cache successful GET requests
        if (useCache && (!options.method || options.method === 'GET')) {
          this.setCache(cacheKey, result, cacheTTL);
        }

        return result;

      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (error instanceof APIError && error.status && error.status < 500) {
          break;
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < this.config.retries) {
          const delayMs = this.config.retryDelay * Math.pow(2, attempt);
          await this.delay(delayMs);
        }
      }
    }

    // All retries failed
    return {
      data: null as any,
      success: false,
      error: lastError?.message || 'Unknown error occurred'
    };
  }

  // Convenience methods
  async get<T>(endpoint: string, useCache: boolean = true, cacheTTL?: number): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, useCache, cacheTTL);
  }

  async post<T>(endpoint: string, body: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    }, false);
  }

  async put<T>(endpoint: string, body: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT', 
      body: JSON.stringify(body)
    }, false);
  }

  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, false);
  }

  // Clear all cache
  clearCache(): void {
    this.cache.clear();
  }

  // Clear specific cache entry
  clearCacheEntry(key: string): void {
    this.cache.delete(key);
  }
}

// Default API service instance
export const apiService = new APIService({
  baseURL: process.env.REACT_APP_API_URL || 'https://fbc-backend-qdil.onrender.com:10000/api',
  timeout: 10000, // 10 seconds
  retries: 3,
  retryDelay: 1000 // 1 second base delay
});

// Specific API services
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiService.post<{ user: any; token: string }>('/users/login', credentials),

  register: (userData: any) =>
    apiService.post<{ user: any }>('/users/register', userData),

  refresh: (token: string) =>
    apiService.post<{ token: string }>('/auth/refresh', { token }),

  logout: () =>
    apiService.post<{}>('/auth/logout', {})
};

export const activitiesAPI = {
  getAll: () =>
    apiService.get<any[]>('/activities'),
  
  getById: (id: string) =>
    apiService.get<any>(`/activities/${id}`),
  
  create: (activity: any) =>
    apiService.post<any>('/activities', activity),
  
  update: (id: string, activity: any) =>
    apiService.put<any>(`/activities/${id}`, activity),
  
  delete: (id: string) =>
    apiService.delete<any>(`/activities/${id}`),
  
  addComment: (activityId: string, comment: any) =>
    apiService.post<any>(`/activities/${activityId}/comments`, comment)
};

export const statisticsAPI = {
  getPersonal: (userId: string) =>
    apiService.get<any>(`/statistics/personal/${userId}`),
  
  getTeam: () =>
    apiService.get<any>('/statistics/team'),
  
  getLeaderboard: () =>
    apiService.get<any[]>('/statistics/leaderboard')
};

export const finesAPI = {
  getAll: () =>
    apiService.get<any[]>('/fines'),
  
  getByUser: (userId: string) =>
    apiService.get<any[]>(`/fines/user/${userId}`),
  
  create: (fine: any) =>
    apiService.post<any>('/fines', fine),
  
  update: (id: string, fine: any) =>
    apiService.put<any>(`/fines/${id}`, fine),
  
  delete: (id: string) =>
    apiService.delete<any>(`/fines/${id}`),
  
  pay: (id: string) =>
    apiService.post<any>(`/fines/${id}/pay`, {}),
  
  getStatistics: () =>
    apiService.get<any>('/fines/statistics')
};

export const forumAPI = {
  getPosts: (page: number = 1, limit: number = 20) =>
    apiService.get<{ posts: any[]; totalPages: number; currentPage: number }>(`/forum/posts?page=${page}&limit=${limit}`),
  
  getPost: (id: string) =>
    apiService.get<any>(`/forum/posts/${id}`),
  
  createPost: (post: any) =>
    apiService.post<any>('/forum/posts', post),
  
  updatePost: (id: string, post: any) =>
    apiService.put<any>(`/forum/posts/${id}`, post),
  
  deletePost: (id: string) =>
    apiService.delete<any>(`/forum/posts/${id}`),
  
  likePost: (id: string) =>
    apiService.post<any>(`/forum/posts/${id}/like`, {}),
  
  addComment: (postId: string, comment: any) =>
    apiService.post<any>(`/forum/posts/${postId}/comments`, comment),
  
  deleteComment: (postId: string, commentId: string) =>
    apiService.delete<any>(`/forum/posts/${postId}/comments/${commentId}`)
};

export const leagueAPI = {
  getStandings: () =>
    apiService.get<any[]>('/league/standings'),
  
  getFixtures: () =>
    apiService.get<any[]>('/league/fixtures'),
  
  getResults: () =>
    apiService.get<any[]>('/league/results'),
  
  getTeamStats: (teamId: string) =>
    apiService.get<any>(`/league/teams/${teamId}/stats`),
  
  getPlayerStats: (playerId: string) =>
    apiService.get<any>(`/league/players/${playerId}/stats`)
};

export const gamificationAPI = {
  getUserLevel: (userId: string) =>
    apiService.get<any>(`/gamification/users/${userId}/level`),
  
  getBadges: (userId: string) =>
    apiService.get<any[]>(`/gamification/users/${userId}/badges`),
  
  getAchievements: (userId: string) =>
    apiService.get<any[]>(`/gamification/users/${userId}/achievements`),
  
  getLeaderboard: (type: 'xp' | 'badges' | 'activities') =>
    apiService.get<any[]>(`/gamification/leaderboard?type=${type}`),
  
  awardBadge: (userId: string, badgeId: string) =>
    apiService.post<any>(`/gamification/users/${userId}/badges`, { badgeId }),
  
  updateXP: (userId: string, xp: number) =>
    apiService.post<any>(`/gamification/users/${userId}/xp`, { xp })
};

export const healthAPI = {
  getProfile: (userId: string) =>
    apiService.get<any>(`/health/users/${userId}/profile`),
  
  updateProfile: (userId: string, profile: any) =>
    apiService.put<any>(`/health/users/${userId}/profile`, profile),
  
  getWorkouts: (userId: string) =>
    apiService.get<any[]>(`/health/users/${userId}/workouts`),
  
  addWorkout: (userId: string, workout: any) =>
    apiService.post<any>(`/health/users/${userId}/workouts`, workout),
  
  getStats: (userId: string, period: 'week' | 'month' | 'year') =>
    apiService.get<any>(`/health/users/${userId}/stats?period=${period}`)
};

export const trainingAPI = {
  getSessions: () =>
    apiService.get<any[]>('/training/sessions'),
  
  getSession: (id: string) =>
    apiService.get<any>(`/training/sessions/${id}`),
  
  createSession: (session: any) =>
    apiService.post<any>('/training/sessions', session),
  
  updateSession: (id: string, session: any) =>
    apiService.put<any>(`/training/sessions/${id}`, session),
  
  deleteSession: (id: string) =>
    apiService.delete<any>(`/training/sessions/${id}`),
  
  joinSession: (id: string, userId: string) =>
    apiService.post<any>(`/training/sessions/${id}/join`, { userId }),
  
  leaveSession: (id: string, userId: string) =>
    apiService.post<any>(`/training/sessions/${id}/leave`, { userId }),
  
  getAttendance: (sessionId: string) =>
    apiService.get<any[]>(`/training/sessions/${sessionId}/attendance`)
};

export const usersAPI = {
  getAllUsers: () => apiService.get<any[]>(`/users`)
};

export const notificationsAPI = {
  getAll: (userId: string) =>
    apiService.get<any[]>(`/notifications/users/${userId}`),
  
  markAsRead: (id: string) =>
    apiService.put<any>(`/notifications/${id}/read`, {}),
  
  markAllAsRead: (userId: string) =>
    apiService.put<any>(`/notifications/users/${userId}/read-all`, {}),
  
  delete: (id: string) =>
    apiService.delete<any>(`/notifications/${id}`)
};

export const tacticsAPI = {
  getAll: () =>
    apiService.get<any[]>('/tactics'),
  getById: (id: string) =>
    apiService.get<any>(`/tactics/${id}`),
  create: (tactic: any) =>
    apiService.post<any>('/tactics', tactic),
  update: (id: string, tactic: any) =>
    apiService.put<any>(`/tactics/${id}`, tactic),
  delete: (id: string) =>
    apiService.delete<any>(`/tactics/${id}`)
};

export const exercisesAPI = {
  getAll: () =>
    apiService.get<any[]>('/exercises'),
  getById: (id: string) =>
    apiService.get<any>(`/exercises/${id}`),
  create: (exercise: any) =>
    apiService.post<any>('/exercises', exercise),
  update: (id: string, exercise: any) =>
    apiService.put<any>(`/exercises/${id}`, exercise),
  delete: (id: string) =>
    apiService.delete<any>(`/exercises/${id}`)
};

export const analysisAPI = {
  getAll: () =>
    apiService.get<any[]>('/analyses'),
  getById: (id: string) =>
    apiService.get<any>(`/analyses/${id}`),
  create: (analysis: any) =>
    apiService.post<any>('/analyses', analysis),
  update: (id: string, analysis: any) =>
    apiService.put<any>(`/analyses/${id}`, analysis),
  delete: (id: string) =>
    apiService.delete<any>(`/analyses/${id}`)
};

export const materialAPI = {
  getAll: () =>
    apiService.get<any[]>('/materials'),
  getById: (id: string) =>
    apiService.get<any>(`/materials/${id}`),
  create: (material: any) =>
    apiService.post<any>('/materials', material),
  update: (id: string, material: any) =>
    apiService.put<any>(`/materials/${id}`, material),
  delete: (id: string) =>
    apiService.delete<any>(`/materials/${id}`)
};
