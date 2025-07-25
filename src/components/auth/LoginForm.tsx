import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, CheckSquare, Globe } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage, Language } from '../../contexts/LanguageContext';
import { LoginData } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface LoginFormProps {
  onSubmit: (data: LoginData) => Promise<void>;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginData>();

  const handleFormSubmit = async (data: LoginData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'kz', label: 'Қазақша' },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Language Selector */}
        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="w-4 h-4 text-white/70" />
              <span className="text-xs text-white/70 font-medium">{t('nav.language')}</span>
            </div>
            <div className="flex space-x-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-3 py-1 text-xs rounded transition-all duration-200 ${
                    language === lang.code
                      ? 'bg-white text-indigo-900 font-medium'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-6">
            <CheckSquare className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-white">{t('auth.welcomeBack')}</h2>
          <p className="mt-2 text-indigo-200">{t('auth.signInToAccount')}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
              autoComplete="email"
            />

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label={t('auth.password')}
                {...register('password', {
                  required: t('auth.passwordRequired'),
                  minLength: {
                    value: 6,
                    message: t('auth.passwordMinLength')
                  }
                })}
                error={errors.password?.message}
                placeholder={t('auth.enterPassword')}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? t('common.hidePassword') : t('common.showPassword')}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              loading={isSubmitting || isLoading}
              disabled={isSubmitting || isLoading}
              fullWidth
              size="lg"
            >
              {t('auth.signIn')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.dontHaveAccount')}{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                {t('auth.signUp')}
              </Link>
            </p>
          </div>

          {/*<div className="mt-4 p-3 bg-blue-50 rounded-md">*/}
          {/*  <p className="text-xs text-blue-800">*/}
          {/*    <strong>{t('auth.demoCredentials')}</strong><br />*/}
          {/*    {t('auth.email')} demo@example.com<br />*/}
          {/*    {t('auth.password')}: password123*/}
          {/*  </p>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
};