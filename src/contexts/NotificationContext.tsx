import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { fetchNotifications, markAsRead, Notification } from '../services/notificationService';
import {
  registerPushNotifications,
  unregisterPushNotifications
} from '../services/pushNotificationService';
import { onMessageListener } from '../services/firebaseConfig';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  loadMoreNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  enablePushNotifications: () => Promise<boolean>;
  disablePushNotifications: () => Promise<boolean>;
  pushEnabled: boolean;
  setPushEnabledState: (enabled: boolean) => void;
  emailEnabled: boolean;
  setEmailEnabledState: (enabled: boolean) => void;
  loading: boolean;
  hasMore: boolean;
  totalElements: number; // Добавляем общее количество уведомлений
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

// Ключи для хранения состояния уведомлений в localStorage
const PUSH_ENABLED_KEY = 'push_notifications_enabled';
const EMAIL_ENABLED_KEY = 'email_notifications_enabled';

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0); // Добавляем состояние для unreadCount из бэкенда

  // Добавляем ref для предотвращения дублирующих запросов
  const loadingMoreRef = useRef(false);

  // Инициализируем состояние из localStorage или false, если его нет
  const [pushEnabled, setPushEnabled] = useState<boolean>(() => {
    const savedState = localStorage.getItem(PUSH_ENABLED_KEY);
    return savedState ? savedState === 'true' : false;
  });

  const [emailEnabled, setEmailEnabled] = useState<boolean>(() => {
    const savedState = localStorage.getItem(EMAIL_ENABLED_KEY);
    return savedState ? savedState === 'true' : false;
  });

  // Метод для прямой устан��вки состояния push-уведомлений
  // Это позволит синхронизировать состояние с данными пользователя из AuthContext
  const setPushEnabledState = (enabled: boolean) => {
    setPushEnabled(enabled);
    localStorage.setItem(PUSH_ENABLED_KEY, String(enabled));
  };

  const setEmailEnabledState = (enabled: boolean) => {
    setEmailEnabled(enabled);
    localStorage.setItem(EMAIL_ENABLED_KEY, String(enabled));
  };

  // При изменении pushEnabled сохраняем состояние в localStorage
  useEffect(() => {
    localStorage.setItem(PUSH_ENABLED_KEY, String(pushEnabled));
  }, [pushEnabled]);

  const refreshNotifications = async () => {
    if (loading) return; // Предотвращаем повторные запросы

    try {
      setLoading(true);
      const response = await fetchNotifications({ page: 0, size: 10 });
      setNotifications(response.content);
      setTotalElements(response.totalElements);
      setUnreadCount(response.unreadCount); // Используем unreadCount из ответа
      setCurrentPage(0);
      setHasMore(response.totalPages > 1); // Используем totalPages для определения hasMore
    } catch (error) {
      console.error('Ошибка загрузки уведомлений:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreNotifications = async () => {
    if (loading || !hasMore || loadingMoreRef.current) return; // Дополнительная защита

    try {
      loadingMoreRef.current = true;
      setLoading(true);
      const nextPage = currentPage + 1;
      const response = await fetchNotifications({ page: nextPage, size: 10 });

      setNotifications(prev => [...prev, ...response.content]);
      setTotalElements(response.totalElements);
      setUnreadCount(response.unreadCount); // Обновляем unreadCount
      setCurrentPage(nextPage);
      setHasMore(nextPage < response.totalPages - 1); // Проверяем, есть ли еще страницы
    } catch (error) {
      console.error('Ошибка загрузки дополнительных уведомлений:', error);
    } finally {
      setLoading(false);
      loadingMoreRef.current = false;
    }
  };

  const markNotificationAsRead = async (id: string) => {
    await markAsRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, status: 'READ' } : n));
    // Уменьшаем unreadCount при отметке как прочитанное
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const enablePushNotifications = async () => {
    const result = await registerPushNotifications();
    setPushEnabled(result);
    return result;
  };

  const disablePushNotifications = async () => {
    const result = await unregisterPushNotifications();
    // const result2 = await updatePushNotificationSettings(false);
    if (result) {
      setPushEnabled(false);
    }
    return result;
  };

  useEffect(() => {
    // Загружаем уведомления только если пользователь аутентифицирован
    refreshNotifications();

    let isMounted = true;
    onMessageListener()
      .then((payload: any) => {
        if (!isMounted) return;
        console.log('Получено уведомление в активном режиме:', payload);

        // Показываем простое браузерное уведомление как fallback
        const title = payload.notification?.title || payload.data?.title || 'Новое уведомление';
        const body = payload.notification?.message || payload.notification?.body || payload.data?.body || '';

        // Созд��ем событие для показа toast через глобальный EventBus
        const showToastEvent = new CustomEvent('showNotificationToast', {
          detail: {
            message: `${title}${body ? `: ${body}` : ''}`,
            type: 'info',
            duration: 6000,
            isNotification: true
          }
        });

        window.dispatchEvent(showToastEvent);

        // Обновляем список уведомлений
        refreshNotifications();
      })
      .catch(err => console.error('Оши��ка при получении сообщения:', err));

    return () => {
      isMounted = false;
    };
  }, []); // Убираем зависимости, чтобы загрузка происходила только при монтировании

  // Сохраняем emailEnabled при изменении
  useEffect(() => {
    localStorage.setItem(EMAIL_ENABLED_KEY, String(emailEnabled));
  }, [emailEnabled]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount, // Используем состояние из бэкенда
        refreshNotifications,
        loadMoreNotifications,
        markNotificationAsRead,
        enablePushNotifications,
        disablePushNotifications,
        pushEnabled,
        setPushEnabledState,
        emailEnabled,
        setEmailEnabledState,
        loading,
        hasMore,
        totalElements,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
