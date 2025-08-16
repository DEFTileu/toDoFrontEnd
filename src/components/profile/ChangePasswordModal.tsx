import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();
  const { changePassword } = useAuth();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ChangePasswordData>();

  const newPassword = watch('newPassword');

  const handleFormSubmit = async (data: ChangePasswordData) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
      showToast(t('passwordChange.success'), 'success');
      reset();
      onClose();
    } catch (error) {
      showToast((error as Error).message || t('passwordChange.error'), 'error');
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
      title={t('passwordChange.title')}
      size="md"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
          <p className="text-gray-600">
            {t('passwordChange.description')}
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Current Password */}
          <div className="relative">
            <Input
              type={showCurrentPassword ? 'text' : 'password'}
              label={t('passwordChange.currentPassword')}
              {...register('currentPassword', {
                required: t('passwordChange.currentPasswordRequired')
              })}
              error={errors.currentPassword?.message}
              placeholder={t('passwordChange.currentPasswordPlaceholder')}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
            >
              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <Input
              type={showNewPassword ? 'text' : 'password'}
              label={t('passwordChange.newPassword')}
              {...register('newPassword', {
                required: t('passwordChange.newPasswordRequired'),
                minLength: {
                  value: 8,
                  message: t('passwordChange.passwordMinLength')
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: t('passwordChange.passwordPattern')
                }
              })}
              error={errors.newPassword?.message}
              placeholder={t('passwordChange.newPasswordPlaceholder')}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Confirm New Password */}
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              label={t('passwordChange.confirmPassword')}
              {...register('confirmPassword', {
                required: t('passwordChange.confirmPasswordRequired'),
                validate: value =>
                  value === newPassword || t('passwordChange.passwordsDoNotMatch')
              })}
              error={errors.confirmPassword?.message}
              placeholder={t('passwordChange.confirmPasswordPlaceholder')}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              {t('passwordChange.passwordRequirements')}
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• {t('passwordChange.requirementMinLength')}</li>
              <li>• {t('passwordChange.requirementUppercase')}</li>
              <li>• {t('passwordChange.requirementLowercase')}</li>
              <li>• {t('passwordChange.requirementNumber')}</li>
            </ul>
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
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {t('passwordChange.changePassword')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};