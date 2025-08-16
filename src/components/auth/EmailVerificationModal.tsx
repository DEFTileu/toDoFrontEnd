import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Shield, RefreshCw, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useAuth } from '../../contexts/AuthContext';



interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess: () => void;
}

interface VerificationData {
  verificationCode: string;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onVerificationSuccess
}) => {
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { verifyEmail, resendVerification } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<VerificationData>();

  // Countdown timer for resend button
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Start countdown when modal opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(60); // 60 seconds cooldown
    }
  }, [isOpen]);

  const handleVerifyCode = async (data: VerificationData) => {
    try {
      // Use AuthContext to verify email which stores tokens and user info
      await verifyEmail(email, data.verificationCode);
      showToast(t('emailVerification.success'), 'success');
      reset();
      onVerificationSuccess();
    } catch (error) {
      showToast((error as Error).message || t('emailVerification.failed'), 'error');
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    setIsResending(true);
    try {
      // Use AuthContext to resend verification code
      await resendVerification(email);
      showToast(t('emailVerification.codeSent'), 'success');
      setCountdown(60); // Reset countdown
    } catch (error) {
      showToast((error as Error).message || t('emailVerification.resendFailed'), 'error');
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
      <Modal
          isOpen={isOpen}
          onClose={handleClose}
          title={t('emailVerification.title')}
          size="md"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('emailVerification.checkEmail')}
            </h3>
            <p className="text-gray-600">
              {t('emailVerification.sentCode')}
            </p>
            <p className="text-indigo-600 font-medium">{email}</p>
          </div>

          <form onSubmit={handleSubmit(handleVerifyCode)} className="space-y-6">
            {/* Verification Code Input */}
            <div>
              <Input
                  type="text"
                  label={t('emailVerification.verificationCode')}
                  {...register('verificationCode', {
                    required: t('emailVerification.codeRequired'),
                    pattern: {
                      value: /^\d{6}$/,
                      message: t('emailVerification.invalidCode')
                    }
                  })}
                  error={errors.verificationCode?.message}
                  placeholder={t('emailVerification.codePlaceholder')}
                  maxLength={6}
                  className="text-center text-lg font-mono tracking-widest"
                  autoComplete="one-time-code"
              />
            </div>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                {t('emailVerification.didNotReceive')}
              </p>
              <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendCode}
                  disabled={countdown > 0 || isResending}
                  loading={isResending}
                  size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {countdown > 0 ? t('emailVerification.resendIn') : t('emailVerification.resendCode')}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  disabled={isSubmitting}
              >
                {t('common.cancel')}
              </Button>
              <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {t('emailVerification.verifyEmail')}
              </Button>
            </div>
          </form>

          {/* Help Text */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">{t('emailVerification.securityNoteTitle')}</p>
                <p>
                  {t('emailVerification.securityNote')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
  );
};