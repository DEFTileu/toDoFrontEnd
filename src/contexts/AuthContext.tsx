import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/authService';
import {API_CONFIG, API_ENDPOINTS, fetchWithTimeout, getAuthToken, tokenStorage} from '../services/apiConfig';
import { userStorage } from '../services/userStorage';
import { registerPushNotifications, registerDeviceOnly } from '../services/pushNotificationService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean, message?: string }>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  setUserLocal: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true };
    case 'AUTH_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'AUTH_FAILURE':
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  const refreshSession = async () => {
    try {
      const currentRefresh = tokenStorage.getRefreshToken();
      if (!currentRefresh) {
        dispatch({ type: 'AUTH_FAILURE' });
        return;
      }

      const responseL = await fetchWithTimeout(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: currentRefresh }),
        }
      );

      if (!responseL.ok) {
        tokenStorage.clearTokens();
        dispatch({ type: 'AUTH_FAILURE' });
        return;
      }

      const response = await responseL.json();

      if (response.accessToken && response.refreshToken) {
        tokenStorage.setTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken });
      }

      if (response.user) {
        // было: localStorage.setItem('auth_user', JSON.stringify(response.user));
        userStorage.store(response.user);
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      } else {
        // fallback: попытка получить пользователя через /auth/me
        const accessToken = tokenStorage.getAuthToken();
        if (accessToken) {
          const meResp = await fetchWithTimeout(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ME}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          if (meResp.ok) {
            const data = await meResp.json();
            const user:User = data.user;
            // localStorage.setItem('auth_user', JSON.stringify(user));
            userStorage.store(user);
            localStorage.setItem('email_notifications_enabled',data.user.emailNotification);
            localStorage.setItem('push_notifications_enabled',data.user.pushNotification);
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
            return;
          }
        }
        dispatch({ type: 'AUTH_FAILURE' });
      }
    } catch (error) {
      tokenStorage.clearTokens();
      dispatch({ type: 'AUTH_FAILURE' });
      console.error('Failed to refresh session:', error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        await refreshSession();
      } else {
        const stored = userStorage.get();
        if (stored) {
          dispatch({ type: 'AUTH_SUCCESS', payload: stored });
        } else {
          dispatch({ type: 'AUTH_FAILURE' });
        }
      }
    };

    initAuth();

    const handleStorage = (event: StorageEvent) => {
      if (!event.key) return;
      if (event.key === 'auth_user') {
        const u = userStorage.get();
        if (u) {
          dispatch({ type: 'AUTH_SUCCESS', payload: u });
        } else {
          dispatch({ type: 'AUTH_FAILURE' });
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const data = await authService.login(email, password);
      const user = data.user;
      userStorage.store(user);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
      registerDeviceOnly().then(r => console.log('Device registered (login):', r));
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Не логиним пользователя сразу - это произойдет после верификации email
      return await authService.register(name, email, password);
    } catch (error) {
      throw error;
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const user = await authService.verifyEmail(email, code);
      userStorage.store(user);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
      registerDeviceOnly().then(r => console.log('Device registered (verifyEmail):', r));
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  const resendVerification = async (email: string) => {
    try {
      await authService.resendVerification(email);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
    // localStorage.removeItem('auth_user');
    userStorage.clear();
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!state.user) throw new Error('No user logged in');
    try {
      const updatedUser = await authService.updateProfile(data);
      userStorage.store(updatedUser);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    } catch (error) {
      throw error;
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!state.user) throw new Error('No user logged in');
    try {
      const updatedUser = await authService.uploadAvatar(file);
      userStorage.store(updatedUser);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
    } catch (error) {
      throw error;
    }
  };

  const setUserLocal = (patch: Partial<User>) => {
    if(!state.user) return;
    const merged = { ...state.user, ...patch } as User;
    userStorage.store(merged);
    dispatch({ type: 'UPDATE_USER', payload: merged });
  };

  const refreshUser = async () => {
    try {
      const u = await authService.getCurrentUser();
      if (u) {
        userStorage.store(u);
        dispatch({ type: 'UPDATE_USER', payload: u });
      }
    } catch (e) {
      console.warn('Не удалось обновить пользователя', e);
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    verifyEmail,
    resendVerification,
    logout,
    updateProfile,
    uploadAvatar,
    changePassword,
    refreshUser,
    setUserLocal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};