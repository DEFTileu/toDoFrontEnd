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
      value = value[k as keyof typeof value];
    } else {
      // Fallback to English
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey as keyof typeof value];
        } else {
          return key;
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
};

export const formatDate = (dateString?: string): string => {
  if(!dateString) return '';
  let date: Date;
  try { date = parseISO(dateString); } catch { return dateString; }
  if (isNaN(date.getTime())) return dateString;

  if (isToday(date)) {
    return `${t('common.todayAt')} ${format(date, 'HH:mm')}`;
  }
  if (isYesterday(date)) {
    return `${t('common.yesterdayAt')} ${format(date, 'HH:mm')}`;
  }

  // Локализованное форматирование даты
  const language = getCurrentLanguage();
  switch (language) {
    case 'ru':
      return format(date, 'dd.MM.yyyy');
    case 'kz':
      return format(date, 'dd.MM.yyyy');
    default:
      return format(date, 'MMM d, yyyy');
  }
};

export const formatRelativeDate = (dateString?: string): string => {
  if(!dateString) return '';
  let date: Date; try { date = parseISO(dateString); } catch { return ''; }
  if (isNaN(date.getTime())) return '';
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatDeadline = (dateString?: string): string => {
  if(!dateString) return '';
  let date: Date; try { date = parseISO(dateString); } catch { return ''; }
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  if (date < now) {
    return `${t('common.overdue')}`;
  }
  if (isToday(date)) {
    return t('common.dueToday');
  }

  // Локализованное форматирование срока
  const language = getCurrentLanguage();
  switch (language) {
    case 'ru':
      return `До ${format(date, 'dd.MM.yyyy')}`;
    case 'kz':
      return `Дейін ${format(date, 'dd.MM.yyyy')}`;
    default:
      return `Due ${format(date, 'MMM d')}`;
  }
};

export const getInitials = (name?: string | null): string => {
  if (!name) return '';
  const cleaned = name.trim();
  if (!cleaned) return '';
  return cleaned
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Функция для обрезки HTML контента с сохранением изображений и их размеров
export const truncateHtmlContent = (html: string, maxTextLength: number): string => {
  if (!html) return '';

  // Создаем временный элемент для парсинга HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Сохраняем изображения с их классами
  const images = tempDiv.querySelectorAll('img');
  const imageMap = new Map();

  images.forEach((img, index) => {
    const placeholder = `[IMAGE_${index}]`;
    imageMap.set(placeholder, img.outerHTML);
    img.replaceWith(document.createTextNode(placeholder));
  });

  // Получаем текст без HTML тегов
  let textContent = tempDiv.textContent || '';

  // Обрезаем текст если нужно
  if (textContent.length > maxTextLength) {
    textContent = textContent.slice(0, maxTextLength) + '...';
  }

  // Возвращаем изображения обратно
  let result = textContent;
  imageMap.forEach((imgHtml, placeholder) => {
    result = result.replace(placeholder, imgHtml);
  });

  return result;
};
