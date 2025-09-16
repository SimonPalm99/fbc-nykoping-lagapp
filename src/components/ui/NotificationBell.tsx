import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationPanel } from './NotificationPanel';

export const NotificationBell: React.FC = () => {
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifikationer ${unreadCount > 0 ? `(${unreadCount} olästa)` : ''}`}
      >
        <span className="notification-bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-bell-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      <NotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
