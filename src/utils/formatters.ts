import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { en } from '../locales/en';
import { ru } from '../locales/ru';
import { kz } from '../locales/kz';

const translations = { en, ru, kz };

// Get current language from localStorage or default to 'en'
const getCurrentLanguage = (): 'en' | 'ru' | 'kz' => {
  try {
    const stored = localStorage.getItem('app_language');
    return stored && ['en', 'ru', 'kz'].includes(stored) ? stored as 'en' | 'ru' | 'kz' : 'en';
  } catch {
    return 'en';
  }
};

const t = (key: string): string => {
  const language = getCurrentLanguage();
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key;
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
};

export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  
  if (isToday(date)) {
    return `${t('common.todayAt')} ${format(date, 'h:mm a')}`;
  }
  
  if (isYesterday(date)) {
    return `${t('common.yesterdayAt')} ${format(date, 'h:mm a')}`;
  }
  
  return format(date, 'MMM d, yyyy');
};

export const formatRelativeDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatDeadline = (dateString: string): string => {
  const date = parseISO(dateString);
  const now = new Date();
  
  if (date < now) {
    return `${t('common.overdue')} (${formatRelativeDate(dateString)})`;
  }
  
  if (isToday(date)) {
    return t('common.dueToday');
  }
  
  return `Due ${formatRelativeDate(dateString)}`;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};