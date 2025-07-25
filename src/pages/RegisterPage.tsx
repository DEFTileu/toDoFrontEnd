import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from '../hooks/useTranslation';
import { RegisterForm } from '../components/auth/RegisterForm';
import { RegisterData } from '../types';

export const RegisterPage: React.FC = () => {
  const { register: registerUser, isAuthenticated, loading } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  const handleRegister = async (data: RegisterData) => {
    try {
      await registerUser(data.name, data.email, data.password);
      showToast(t('common.accountCreatedSuccess'), 'success');
      navigate('/tasks');
    } catch (error) {
      showToast((error as Error).message, 'error');
    }
  };

  return <RegisterForm onSubmit={handleRegister} />;
};