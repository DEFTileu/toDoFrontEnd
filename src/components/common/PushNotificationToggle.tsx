import React, { useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';

interface PushNotificationToggleProps {
  className?: string;
  id?: string;
  label?: string;
  descriptionOn?: string; // описание когда включено
  descriptionOff?: string; // описание когда выключено
  disabled?: boolean;
}

const PushNotificationToggle: React.FC<PushNotificationToggleProps> = ({ className = '', id = 'push-notifications' }) => {
  const { pushEnabled, enablePushNotifications, disablePushNotifications } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      let success;
      if (pushEnabled) {
        success = await disablePushNotifications();
        if (!success) {
          setError('Не удалось отключить пуш-уведомления');
        }
      } else {
        success = await enablePushNotifications();
        if (!success) {
          setError('Не удалось включить пуш-уведомления. Проверьте настройки браузера');
        }
      }
    } catch (err) {
      console.error('Ошибка при переключении пуш-уведомлений:', err);
      setError('Произошла ошибка. Пожалуйста, попробуйте позже');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-between p-3 bg-gray-50 rounded-xl relative ${className}`}>
      <div className="flex-1 min-w-0">
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          Пуш-уведомления
        </label>
        <p className="text-xs text-gray-500 mt-1">
          {pushEnabled
            ? 'Получайте мгновенные уведомления даже когда браузер закрыт'
            : 'Включите пуш-уведомления, чтобы получать мгновенные уведомления даже когда браузер закрыт'}
        </p>
        {error && (
          <div className="absolute right-14 top-3 bg-red-50 border border-red-200 text-red-600 text-xs py-1 px-2 rounded-md animate-fadeIn">
            {error}
            <button
              className="ml-2 text-red-400 hover:text-red-600"
              onClick={() => setError(null)}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={pushEnabled}
        aria-labelledby={`${id}-label`}
        onClick={handleToggle}
        disabled={loading}
        className={`
          relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2
          min-w-[44px] min-h-[44px] flex items-center justify-center
          ${pushEnabled 
            ? 'bg-indigo-600 hover:bg-indigo-700' 
            : 'bg-gray-200 hover:bg-gray-300'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span className="sr-only">Пуш-уведомления</span>
        <div className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out
          ${pushEnabled ? 'bg-indigo-600' : 'bg-gray-200'}
        `}>
          <span
            aria-hidden="true"
            className={`
              pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 
              transition duration-200 ease-in-out translate-y-0.5
              ${loading ? 'animate-pulse' : ''}
              ${pushEnabled ? 'translate-x-5' : 'translate-x-0.5'}
            `}
          />
        </div>
      </button>
    </div>
  );
};

export default PushNotificationToggle;
