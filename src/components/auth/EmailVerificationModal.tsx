import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Shield, RefreshCw, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import {API_CONFIG, API_ENDPOINTS, createRequestConfig, fetchWithTimeout} from "../../services/apiConfig.ts"; // keep for backward compatibility
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
    let timer: NodeJS.Timeout;
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
      showToast('Email verified successfully!', 'success');
      reset();
      onVerificationSuccess();
    } catch (error) {
      showToast((error as Error).message || 'Verification failed', 'error');
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    setIsResending(true);
    try {
      // Use AuthContext to resend verification code
      await resendVerification(email);
      showToast('Verification code sent!', 'success');
      setCountdown(60); // Reset countdown
    } catch (error) {
      showToast((error as Error).message || 'Failed to resend code', 'error');
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
          title="Verify Your Email"
          size="md"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Check Your Email
            </h3>
            <p className="text-gray-600">
              We've sent a verification code to
            </p>
            <p className="text-indigo-600 font-medium">{email}</p>
          </div>

          <form onSubmit={handleSubmit(handleVerifyCode)} className="space-y-6">
            {/* Verification Code Input */}
            <div>
              <Input
                  type="text"
                  label="Verification Code"
                  {...register('verificationCode', {
                    required: 'Verification code is required',
                    pattern: {
                      value: /^\d{6}$/,
                      message: 'Please enter a valid 6-digit code'
                    }
                  })}
                  error={errors.verificationCode?.message}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="text-center text-lg font-mono tracking-widest"
                  autoComplete="one-time-code"
              />
            </div>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Didn't receive the code?
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
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
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
                Cancel
              </Button>
              <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Email
              </Button>
            </div>
          </form>

          {/* Help Text */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Security Note:</p>
                <p>
                  The verification code will expire in 10 minutes.
                  If you don't see the email, check your spam folder.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
  );
};