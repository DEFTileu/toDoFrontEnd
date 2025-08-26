import React, { useEffect, useRef } from 'react';
import { CheckCircle, Circle, Eye, Clock, Loader2 } from 'lucide-react';

import { useNotification } from '../../contexts/NotificationContext';
import { useTranslation } from '../../hooks/useTranslation';

const NotificationList: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    loadMoreNotifications,
    loading,
    hasMore
  } = useNotification();

  const { t } = useTranslation();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  // Возвращаем Intersection Observer для автоматической пагинации
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !isLoadingRef.current) {
          isLoadingRef.current = true;
          loadMoreNotifications().finally(() => {
            isLoadingRef.current = false;
          });
        }
      },
      {
        threshold: 0.1,
        rootMargin: '20px'
      }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      observer.disconnect();
      isLoadingRef.current = false;
    };
  }, [hasMore, loading, loadMoreNotifications]);

  useEffect(() => {
    if (!loading) {
      isLoadingRef.current = false;
    }
  }, [loading]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Только что';
    if (diffInHours < 24) return `${diffInHours}ч назад`;
    if (diffInHours < 48) return 'Вчера';
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMarkAsRead = async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      try {
        console.log('Отмечаем уведомление как прочитанное:', notificationId);
        await markNotificationAsRead(notificationId);
      } catch (error) {
        console.error('Ошибка при отметке уведомления как прочитанного:', error);
      }
    }
  };

  // Функция для получения стилей типа уведомления
  const getNotificationTypeStyles = (type: string) => {
    switch (type.toUpperCase()) {
      case 'TASK':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          label: t('notifications.types.TASK')
        };
      case 'SPRINT':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          label: t('notifications.types.SPRINT')
        };
      case 'SYSTEM':
        return {
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          label: t('notifications.types.SYSTEM')
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          label: type
        };
    }
  };

  if (notifications.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500 animate-fade-in">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Circle className="w-8 h-8 text-gray-400" />
        </div>
        <div className="text-lg font-medium mb-2">Нет уведомлений</div>
        <div className="text-sm text-center">Уведомления будут появляться здесь</div>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="max-h-96 overflow-y-auto divide-y divide-gray-100 scrollbar-thin"
    >
      {notifications.map((notification, index) => {
        const typeStyles = getNotificationTypeStyles(notification.type);

        return (
            <div
                key={notification.id}
                className={`p-3 sm:p-4 transition-all duration-200 hover:bg-gray-50 animate-slide-up ${
                    notification.status === 'READ'
                        ? 'bg-white'
                        : 'bg-blue-50/30 border-l-4 border-l-blue-500'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                        className={`font-medium text-sm sm:text-base truncate ${
                            notification.status === 'READ' ? 'text-gray-700' : 'text-gray-900'
                        }`}
                    >
                      {notification.title}
                    </h3>
                    {notification.status !== 'READ' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 animate-pulse" />
                    )}
                  </div>

                  <p
                      className={`text-xs sm:text-sm mb-2 line-clamp-2 ${
                          notification.status === 'READ' ? 'text-gray-500' : 'text-gray-600'
                      }`}
                  >
                    {notification.message}
                  </p>

                  <div className="flex items-center gap-2 mb-2">
          <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  typeStyles.bgColor
              } ${typeStyles.textColor}`}
          >
            {typeStyles.label}
          </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(notification.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Кнопка для отметки как прочитанное */}
                  <button
                      onClick={() => handleMarkAsRead(notification.id, notification.status === 'READ')}
                      className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95 flex items-center justify-center ${
                          notification.status === 'READ'
                              ? 'text-green-500 hover:bg-green-50 focus:ring-green-500'
                              : 'text-blue-500 hover:bg-blue-50 focus:ring-blue-500'
                      }`}
                      title={notification.status === 'READ' ? 'Прочитано' : 'Отметить как прочитанное'}
                      disabled={loading}
                  >
                    {notification.status === 'READ' ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
        )
      })}

      {/* Возвращаем индикатор загрузки для пагинации */}
      {(hasMore || loading) && (
        <div
          ref={loadingRef}
          className="flex items-center justify-center p-4"
        >
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500 animate-fade-in">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Загрузка...</span>
            </div>
          ) : hasMore ? (
            <div className="text-sm text-gray-400">Прокрутите для загрузки еще</div>
          ) : null}
        </div>
      )}

      {!hasMore && notifications.length > 0 && (
        <div className="text-center p-4 text-xs text-gray-400 border-t border-gray-100 animate-fade-in">
          Все уведомления загружены
        </div>
      )}
    </div>
  );
};

export default NotificationList;
