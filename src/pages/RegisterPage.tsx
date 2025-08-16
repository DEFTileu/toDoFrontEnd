import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from '../hooks/useTranslation';
import { RegisterForm } from '../components/auth/RegisterForm';
import { EmailVerificationModal } from '../components/auth/EmailVerificationModal';
import { RegisterData } from '../types';

export const RegisterPage: React.FC = () => {
  const { register: registerUser, isAuthenticated, loading } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showVerificationModal, setShowVerificationModal] = React.useState(false);
  const [registrationEmail, setRegistrationEmail] = React.useState('');

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
      const response = await registerUser(data.name, data.email, data.password);
      if (response.success) {
        setRegistrationEmail(data.email);
        setShowVerificationModal(true);
        showToast(response.message || t('auth.verificationEmailSent'), 'success');
      } else {
        showToast(response.message || t('auth.registrationFailed'), 'error');
      }
    } catch (error) {
      showToast((error as Error).message, 'error');
    }
  };

  const handleVerificationSuccess = async () => {
    try {
      setShowVerificationModal(false);
      showToast(t('common.accountCreatedSuccess'), 'success');
      navigate('/tasks');
    } catch (error) {
      setShowVerificationModal(false);
      showToast((error as Error).message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterForm onSubmit={handleRegister} />
        {showVerificationModal && (
          <EmailVerificationModal
            isOpen={showVerificationModal}
            onClose={() => setShowVerificationModal(false)}
            email={registrationEmail}
            onVerificationSuccess={handleVerificationSuccess}
          />
        )}
      </div>
    </div>
  );
};