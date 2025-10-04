import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';
import './NotificationPanel.css';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll,
    requestPermission
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'activity': return '📅';
      case 'achievement': return '🏆';
      case 'forum': return '💬';
      case 'chat': return '💭';
      case 'fine': return '💰';
      case 'system': return '⚙️';
      default: return '📢';
    }
  };


  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Nu';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="notification-overlay" onClick={onClose} />
      <div className="notification-panel">
        <div className="notification-header">
          <div className="notification-title">
            <span>Notifikationer</span>
            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </div>
          <div className="notification-actions">
            <button 
              className="notification-filter-btn"
              onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            >
              {filter === 'all' ? 'Visa olästa' : 'Visa alla'}
            </button>
            <button className="notification-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="notification-controls">
          <button 
            className="notification-control-btn"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Markera alla som lästa
          </button>
          <button 
            className="notification-control-btn"
            onClick={requestPermission}
          >
            Aktivera push-notifikationer
          </button>
          <button 
            className="notification-control-btn danger"
            onClick={clearAll}
            disabled={notifications.length === 0}
          >
            Rensa alla
          </button>
        </div>

        <div className="notification-list">
          {filteredNotifications.length === 0 ? (
            <div className="notification-empty">
              <span className="notification-empty-icon">🔔</span>
              <p>
                {filter === 'unread' ? 'Inga olästa notifikationer' : 'Inga notifikationer'}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-content">
                  <div className="notification-header-item">
                    <span className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <span 
                      className={`notification-priority priority-${notification.priority}`}
                    >
                      ●
                    </span>
                    <span className="notification-time">
                      {formatTime(notification.createdAt)}
                    </span>
                    <button
                      className="notification-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                  
                  <div className="notification-body">
                    <h4 className="notification-title-text">{notification.title}</h4>
                    <p className="notification-message">{notification.message}</p>
                  </div>

                  {notification.actionUrl && (
                    <Link
                      to={notification.actionUrl}
                      className="notification-action"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visa mer →
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
