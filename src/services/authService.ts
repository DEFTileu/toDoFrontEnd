import { User, LoginData, RegisterData } from '../types';
import { API_CONFIG, API_ENDPOINTS, HTTP_STATUS, fetchWithAuth, setAuthToken, setRefreshToken, getAuthToken, getRefreshToken, removeAuthToken, removeRefreshToken } from "./apiConfig.ts";

const DEMO_TOKEN = 'demo_auth_token_12345';

// Demo account credentials
const DEMO_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'password123'
};

// Demo user data
const DEMO_USER: User = {
  id: 'demo-user-123',
  email: 'demo@example.com',
  name: 'Demo User',
  createdAt: '2024-01-01T00:00:00.000Z',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
};

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(email: string, password: string): Promise<User> {
    // Check if it's demo account
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      // Simulate network delay
      await delay(800);

      // Save demo token
      setAuthToken(DEMO_TOKEN);

      return DEMO_USER;
    }

    // Otherwise, try real API call
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        setAuthToken(data.token);
      }

      if (data.refreshToken) {
        setRefreshToken(data.refreshToken);
      }

      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(name: string, email: string, password: string): Promise<{ success: boolean, message?: string }> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      // Не сохраняем токены здесь - это произойдет после верификации email
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    // Check if token exists
    const token = getAuthToken();

    if (!token) {
      return null;
    }

    // Check if it's demo token
    if (token === DEMO_TOKEN) {
      return DEMO_USER;
    }

    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.ME}`,
        { method: 'GET' }
      );

      if (response.status === 401) {
        // Token is invalid, remove both tokens
        removeAuthToken();
        removeRefreshToken();
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      // If there's an error getting user info, remove both tokens
      removeAuthToken();
      removeRefreshToken();
      return null;
    }
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    // Update profile with automatic token refresh
    const token = getAuthToken();

    // Check if it's demo token
    if (token === DEMO_TOKEN) {
      await delay(800);

      // For demo mode, just return updated user data
      const updatedUser = { ...DEMO_USER, ...data };
      return updatedUser;
    }

    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPDATE_PROFILE}`,
        { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }
      );

      const responseData = await response.json();
      return responseData.user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  async uploadAvatar(file: File): Promise<User> {
    const token = getAuthToken();

    // Check if it's demo token
    if (token === DEMO_TOKEN) {
      await delay(1200);

      // For demo mode, create a fake URL for the uploaded image
      const fakeAvatarUrl = URL.createObjectURL(file);
      const updatedUser = { ...DEMO_USER, avatar: fakeAvatarUrl };
      return updatedUser;
    }

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPLOAD_AVATAR}`,
        { method: 'POST', body: formData }
      );

      const responseData = await response.json();
      return responseData.user;
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const token = getAuthToken();

    // Check if it's demo token
    if (token === DEMO_TOKEN) {
      await delay(800);
      // For demo mode, just simulate success
      return;
    }

    try {
      const response = await fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CHANGE_PASSWORD}`,
        { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword }) }
      );

      await response.json();
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  logout(): void {
    const refreshToken = getRefreshToken();

    removeAuthToken();
    removeRefreshToken();

    // Call logout endpoint to invalidate tokens on server
    if (refreshToken) {
      fetchWithAuth(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.LOGOUT}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }) }
      ).catch(() => {});
    }
  },

  async verifyEmail(email: string, code: string): Promise<User> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (data.token) {
        setAuthToken(data.token);
      }

      if (data.refreshToken) {
        setRefreshToken(data.refreshToken);
      }

      return data.user;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  },

  async resendVerification(email: string): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      await response.json();
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  },
};
