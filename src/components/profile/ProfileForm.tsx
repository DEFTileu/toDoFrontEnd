import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '../../hooks/useTranslation';
import { User } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface ProfileFormProps {
  user: User;
  onSubmit: (data: Partial<User>) => Promise<void>;
  isLoading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSubmit, isLoading }) => {
  const { t } = useTranslation();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Partial<User>>({
    defaultValues: {
      name: user.name,
      email: user.email,
    }
  });

  const handleFormSubmit = async (data: Partial<User>) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        type="text"
        label={t('auth.fullName')}
        {...register('name', {
          required: t('auth.nameRequired'),
          minLength: {
            value: 2,
            message: t('auth.nameMinLength')
          }
        })}
        error={errors.name?.message}
        placeholder={t('auth.enterFullName')}
      />

      <Input
        type="email"
        label={t('auth.emailAddress')}
        {...register('email', {
          required: t('auth.emailRequired'),
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: t('auth.invalidEmail')
          }
        })}
        error={errors.email?.message}
        placeholder={t('auth.enterEmail')}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading}
        >
          {t('tasks.saveChanges')}
        </Button>
      </div>
    </form>
  );
};