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
  const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);
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
    setShowLanguageMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
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
                  className="absolute right-6 top-9 text-gray-400 hover:text-gray-600 transition-colors"
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


        </div>
      </div>
      
      {/* Floating Language Selector */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Language Menu */}
          {showLanguageMenu && (
            <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-[140px] transform transition-all duration-200 ease-out">
              <div className="px-3 py-2 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{t('nav.language')}</span>
                </div>
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 flex items-center justify-between ${
                    language === lang.code
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{lang.label}</span>
                  {language === lang.code && (
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          )}
          
          {/* Floating Button */}
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="w-14 h-14 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:scale-105 border border-gray-200"
            aria-label={t('nav.language')}
          >
            <Globe className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors duration-200" />
          </button>
        </div>
      </div>
      
      {/* Click outside to close */}
      {showLanguageMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowLanguageMenu(false)}
        />
      )}
    </div>
  );
};