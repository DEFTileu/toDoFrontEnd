import React, { useEffect } from 'react';
import { Toast } from './Toast';
import { useToast } from '../../contexts/ToastContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast, showToast } = useToast();

  // Слушаем событие для показа toast от NotificationContext
  useEffect(() => {
    const handleShowNotificationToast = (event: CustomEvent) => {
      const { message, type, duration, isNotification } = event.detail;
      showToast(message, type, duration, isNotification);
    };

    window.addEventListener('showNotificationToast', handleShowNotificationToast as EventListener);

    return () => {
      window.removeEventListener('showNotificationToast', handleShowNotificationToast as EventListener);
    };
  }, [showToast]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm" data-toast-container>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};