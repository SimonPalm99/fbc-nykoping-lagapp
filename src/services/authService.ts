/**
 * Authentication service
 * Handles all authentication-related operations with comprehensive error handling
 */

import { apiService } from './apiService';

export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  jerseyNumber?: number;
  position?: string;
  role: 'player' | 'leader' | 'admin';
  status: 'pending' | 'approved' | 'suspended';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  phone?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  favoritePosition?: string;
  aboutMe?: string;
  previousClubs?: any[];
  joinedDate?: string;
  trainingCount?: number;
  seasonPoints?: number;
  matchCount?: number;
  goalCount?: number;
  assistCount?: number;
  badges?: any[];
  stats?: {
    totalTrainings: number;
    totalMatches: number;
    totalGoals: number;
    totalAssists: number;
  };
  notifications: {
    activities: boolean;
    forum: boolean;
    statistics: boolean;
    fines: boolean;
  };
  personalTrainingLog?: any[];
  statistics?: any;
  totalGamificationPoints?: number;
  avatarUrl?: string;
  isActive?: boolean;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

class AuthService {
  /**
   * Hämta aktuell användare från backend med token
   */
  async getCurrentUserFromBackend(token: string): Promise<any> {
    try {
      // Anropa backend med token i headern
      const res = await apiService.request<any>('/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }, false);
      return res;
    } catch (err) {
      return { success: false, error: (typeof err === 'object' && err && 'message' in err) ? (err as any).message : 'Kunde inte hämta användare' };
    }
  }
  private readonly TOKEN_KEY = 'fbc_access_token';
  private readonly REFRESH_TOKEN_KEY = 'fbc_refresh_token';
  private readonly USER_KEY = 'fbc_user';
  private refreshTokenPromise: Promise<string> | null = null;

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/users/login', credentials);
      if (!response.success || !response.data?.tokens) {
        throw new Error('Felaktiga inloggningsuppgifter');
      }
      this.storeTokens(response.data.tokens); // Spara tokens direkt vid login
      this.storeUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Inloggningen misslyckades. Kontrollera dina uppgifter.');
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Validate passwords match
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Lösenorden matchar inte');
      }

  const response = await apiService.post<AuthResponse>('/users/register', userData);
      
      this.storeTokens(response.data.tokens);
      this.storeUser(response.data.user);
      
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registreringen misslyckades. Försök igen.');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await apiService.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      this.clearStoredData();
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = this.performTokenRefresh();
    
    try {
      const newToken = await this.refreshTokenPromise;
      return newToken;
    } finally {
      this.refreshTokenPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiService.post<AuthTokens>('/auth/refresh', {
        refreshToken
      });

      this.storeTokens(response.data);
      return response.data.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearStoredData();
      throw new Error('Session expired. Please login again.');
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    try {
      const userJson = localStorage.getItem(this.USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Update current user data
   */
  updateCurrentUser(user: User): void {
    this.storeUser(user);
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: User['role']): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Check if user has admin privileges
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  /**
   * Check if user has coach privileges
   */
  isCoach(): boolean {
    const user = this.getCurrentUser();
  return user?.role === 'leader' || user?.role === 'admin';
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await apiService.post('/auth/forgot-password', { email });
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw new Error('Kunde inte skicka återställningslänk. Försök igen.');
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiService.post('/auth/reset-password', {
        token,
        password: newPassword
      });
    } catch (error) {
      console.error('Password reset failed:', error);
      throw new Error('Lösenordsåterställning misslyckades. Kontrollera länken.');
    }
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiService.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
    } catch (error) {
      console.error('Password change failed:', error);
      throw new Error('Lösenordsändring misslyckades. Kontrollera ditt nuvarande lösenord.');
    }
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      await apiService.post('/auth/verify-email', { token });
    } catch (error) {
      console.error('Email verification failed:', error);
      throw new Error('E-postverifiering misslyckades. Kontrollera länken.');
    }
  }

  /**
   * Resend email verification
   */
  async resendEmailVerification(): Promise<void> {
    try {
      await apiService.post('/auth/resend-verification', {});
    } catch (error) {
      console.error('Resend verification failed:', error);
      throw new Error('Kunde inte skicka verifieringslänk. Försök igen.');
    }
  }

  /**
   * Store authentication tokens
   */
  private storeTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  /**
   * Store user data
   */
  private storeUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear all stored authentication data
   */
  private clearStoredData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Setup automatic token refresh
   */
  setupTokenRefresh(): void {
    const checkTokenExpiry = () => {
      const token = this.getAccessToken();
      if (!token) return;

      try {
        // Decode JWT token to check expiry (basic implementation)
        const parts = token.split('.');
        if (parts.length !== 3 || !parts[1]) return;
        
        const payload = JSON.parse(atob(parts[1]));
        const now = Date.now() / 1000;
        
        // Refresh token 5 minutes before expiry
        if (payload.exp - now < 300) {
          this.refreshAccessToken().catch(console.error);
        }
      } catch (error) {
        console.error('Token expiry check failed:', error);
      }
    };

    // Check every minute
    setInterval(checkTokenExpiry, 60000);
    
    // Check immediately
    checkTokenExpiry();
  }
}

export const authService = new AuthService();
export const getCurrentUserFromBackend = authService.getCurrentUserFromBackend.bind(authService);
