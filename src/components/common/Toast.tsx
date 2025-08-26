import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X, Bell } from 'lucide-react';
import { ToastMessage } from '../../types';

interface ToastProps extends ToastMessage {
  onClose: (id: string) => void;
  isNotification?: boolean; // Новый проп для push-уведомлений
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  onClose,
  duration = 5000,
  isNotification = false
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    info: isNotification ? <Bell className="w-5 h-5 text-blue-600" /> : <Info className="w-5 h-5 text-blue-600" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: isNotification ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300' : 'bg-blue-50 border-blue-200'
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: isNotification ? 'text-blue-900' : 'text-blue-800'
  };

  return (
    <div className={`
      flex items-center p-4 rounded-lg border shadow-lg
      transform transition-all duration-300 ease-in-out
      animate-slide-in-right
      ${bgColors[type]}
      ${isNotification ? 'ring-2 ring-blue-200 ring-opacity-50' : ''}
    `}>
      <div className="flex-shrink-0">
        {isNotification && type === 'info' ? (
          <div className="relative">
            {icons[type]}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
          </div>
        ) : (
          icons[type]
        )}
      </div>
      <div className="ml-3 flex-1">
        {isNotification ? (
          <div>
            <p className={`text-sm font-semibold ${textColors[type]} mb-1`}>
              📱 Новое уведомление
            </p>
            <p className={`text-sm ${textColors[type]} opacity-90`}>{message}</p>
          </div>
        ) : (
          <p className={`text-sm font-medium ${textColors[type]}`}>{message}</p>
        )}
      </div>
      <button
        onClick={() => onClose(id)}
        className="ml-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
        aria-label="Закрыть уведомление"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};