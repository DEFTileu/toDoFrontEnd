import React, { useState, useRef, useEffect } from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import NotificationList from './NotificationList';
import { useNotification } from '../../contexts/NotificationContext';

const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { unreadCount, refreshNotifications } = useNotification();
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleBellClick = () => {
    setOpen((prev) => !prev);
  };

  const handleRefresh = () => {
    refreshNotifications();
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        className="relative focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors"
        onClick={handleBellClick}
        aria-label="Открыть уведомления"
      >
        <Bell
          className={`w-6 h-6 transition-colors ${
            unreadCount > 0 ? 'text-blue-600' : 'text-gray-700'
          }`}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-semibold animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white shadow-xl rounded-lg z-50 border border-gray-200 animate-fade-in">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Уведомления</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <span className="text-sm text-blue-600">
                    {unreadCount} новых
                  </span>
                )}
                <button
                    onClick={handleRefresh}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                    title="Обновить уведомления"
                >
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
          <NotificationList />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
