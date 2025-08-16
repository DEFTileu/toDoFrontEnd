import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/authService';
import {API_CONFIG, API_ENDPOINTS, fetchWithTimeout, getAuthToken, refreshToken} from '../services/apiConfig';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean, message?: string }>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
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

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  const refreshSession = async () => {
    try {

      const responseL = await fetchWithTimeout(
          `${API_CONFIG.BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          }
      );
      const response = responseL.json();
      if (response.user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      } else {
        dispatch({ type: 'AUTH_FAILURE' });
      }
    } catch (error) {
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
        dispatch({ type: 'AUTH_FAILURE' });
      }
    };

    initAuth();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'auth_user') {
        if (event.newValue) {
          dispatch({ type: 'AUTH_SUCCESS', payload: JSON.parse(event.newValue) });
        } else {
          dispatch({ type: 'AUTH_FAILURE' });
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    // cleanup
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const data = await authService.login(email, password);
      const user = data.user;
      localStorage.setItem('auth_user', JSON.stringify(user));
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authService.register(name, email, password);
      // Не логиним пользователя сразу - это произойдет после верификации email
      return response;
    } catch (error) {
      throw error;
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const user = await authService.verifyEmail(email, code);
      localStorage.setItem('auth_user', JSON.stringify(user));
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
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
    localStorage.removeItem('auth_user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!state.user) throw new Error('No user logged in');
    try {
      const updatedUser = await authService.updateProfile(data);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    } catch (error) {
      throw error;
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!state.user) throw new Error('No user logged in');
    try {
      const updatedUser = await authService.uploadAvatar(file);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
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