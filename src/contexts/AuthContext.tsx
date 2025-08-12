import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/authService';
import { getAuthToken } from '../services/apiConfig';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
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
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'AUTH_START' });
      const token = getAuthToken();
      if (token) {
        const stored = localStorage.getItem('auth_user');
        if (stored) {
          dispatch({ type: 'AUTH_SUCCESS', payload: JSON.parse(stored) });
        }
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
            localStorage.setItem('auth_user', JSON.stringify(user));
          } else {
            dispatch({ type: 'AUTH_FAILURE' });
            localStorage.removeItem('auth_user');
          }
        } catch {
          dispatch({ type: 'AUTH_FAILURE' });
          localStorage.removeItem('auth_user');
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE' });
        localStorage.removeItem('auth_user');
      }
    };
    initializeAuth();

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
      const user = await authService.login(email, password);
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};