import React from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from '../hooks/useTranslation';
import { LoginForm } from '../components/auth/LoginForm';
import { LoginData } from '../types';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем страницу, с которой пользователь был перенаправлен
  const from = location.state?.from?.pathname || '/tasks';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (data: LoginData) => {
    try {
      const response = await login(data.email, data.password);
      // Сервер вернул успешный ответ с токенами и данными пользователя
      if (response.success && response.accessToken && response.user) {
        showToast(t('common.welcomeMessage'), 'success');
        navigate(from, { replace: true });
      } else {
        throw new Error(t('auth.invalidCredentials'));
      }
    } catch (error) {
      showToast((error as Error).message, 'error');
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
};