/**
 * Advanced Notification/Toast system with multiple types and positioning
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Notification.css';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type NotificationPosition = 
  | 'top-right' 
  | 'top-left' 
  | 'top-center'
  | 'bottom-right' 
  | 'bottom-left' 
  | 'bottom-center';

export interface NotificationOptions {
  type?: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  showClose?: boolean;
  closable?: boolean;
  position?: NotificationPosition;
  action?: {
    text: string;
    handler: () => void;
  };
  onClose?: () => void;
}

export interface Notification extends NotificationOptions {
  id: string;
  timestamp: number;
}

interface NotificationContextValue {
  notifications: Notification[];
  show: (options: NotificationOptions) => string;
  hide: (id: string) => void;
  hideAll: () => void;
  success: (message: string, options?: Partial<NotificationOptions>) => string;
  error: (message: string, options?: Partial<NotificationOptions>) => string;
  warning: (message: string, options?: Partial<NotificationOptions>) => string;
  info: (message: string, options?: Partial<NotificationOptions>) => string;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

// Default configuration
const DEFAULT_DURATION = 4500;
const DEFAULT_POSITION: NotificationPosition = 'top-right';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const show = useCallback((options: NotificationOptions): string => {
    const id = generateId();
    const notification: Notification = {
      id,
      timestamp: Date.now(),
      duration: DEFAULT_DURATION,
      position: DEFAULT_POSITION,
      showClose: true,
      closable: true,
      type: 'info',
      ...options
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-hide notification
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        hide(id);
      }, notification.duration);
    }

    return id;
  }, [generateId]);

  const hide = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const hideAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const success = useCallback((message: string, options: Partial<NotificationOptions> = {}) => {
    return show({ ...options, message, type: 'success' });
  }, [show]);

  const error = useCallback((message: string, options: Partial<NotificationOptions> = {}) => {
    return show({ ...options, message, type: 'error', duration: 0 }); // Errors don't auto-hide
  }, [show]);

  const warning = useCallback((message: string, options: Partial<NotificationOptions> = {}) => {
    return show({ ...options, message, type: 'warning' });
  }, [show]);

  const info = useCallback((message: string, options: Partial<NotificationOptions> = {}) => {
    return show({ ...options, message, type: 'info' });
  }, [show]);

  const value: NotificationContextValue = {
    notifications,
    show,
    hide,
    hideAll,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Notification container component
const NotificationContainer: React.FC = () => {
  const { notifications } = useNotification();

  // Group notifications by position
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const position = notification.position || DEFAULT_POSITION;
    if (!groups[position]) {
      groups[position] = [];
    }
    groups[position].push(notification);
    return groups;
  }, {} as Record<NotificationPosition, Notification[]>);

  const getContainerRoot = () => {
    let container = document.getElementById('notification-root');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-root';
      document.body.appendChild(container);
    }
    return container;
  };

  return createPortal(
    <>
      {Object.entries(groupedNotifications).map(([position, positionNotifications]) => (
        <div
          key={position}
          className={`notification-container notification-container-${position}`}
        >
          {positionNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      ))}
    </>,
    getContainerRoot()
  );
};

// Individual notification item
interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { hide } = useNotification();
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    if (!notification.closable) return;
    
    setIsExiting(true);
    setTimeout(() => {
      hide(notification.id);
      notification.onClose?.();
    }, 300);
  }, [notification, hide]);

  const handleAction = useCallback(() => {
    notification.action?.handler();
    handleClose();
  }, [notification.action, handleClose]);

  // Auto-close on duration (handled in provider, but we need to handle manual close)
  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [notification.duration, handleClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M16.25 5.625L8.125 13.75L3.75 9.375"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 6.25V10.625M10 14.375H10.0063M18.125 10C18.125 14.4873 14.4873 18.125 10 18.125C5.51269 18.125 1.875 14.4873 1.875 10C1.875 5.51269 5.51269 1.875 10 1.875C14.4873 1.875 18.125 5.51269 18.125 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 9.375V13.125M10 6.875H10.0063M18.125 10C18.125 14.4873 14.4873 18.125 10 18.125C5.51269 18.125 1.875 14.4873 1.875 10C1.875 5.51269 5.51269 1.875 10 1.875C14.4873 1.875 18.125 5.51269 18.125 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={`
        notification
        notification-${notification.type}
        ${isExiting ? 'notification-exit' : 'notification-enter'}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="notification-icon">
        {getIcon()}
      </div>
      
      <div className="notification-content">
        {notification.title && (
          <div className="notification-title">
            {notification.title}
          </div>
        )}
        <div className="notification-message">
          {notification.message}
        </div>
        
        {notification.action && (
          <button
            className="notification-action"
            onClick={handleAction}
          >
            {notification.action.text}
          </button>
        )}
      </div>
      
      {notification.showClose && notification.closable && (
        <button
          className="notification-close"
          onClick={handleClose}
          aria-label="Stäng notifiering"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M11 3L3 11M3 3l8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      
      {notification.duration && notification.duration > 0 && (
        <div
          className="notification-progress"
          style={{
            animationDuration: `${notification.duration}ms`
          }}
        />
      )}
    </div>
  );
};

// Convenience hook for common notification patterns
export const useNotifications = () => {
  const notification = useNotification();

  return {
    ...notification,
    
    // Promise-based notifications
    promise: <T,>(
      promise: Promise<T>,
      options: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: Error) => string);
      }
    ) => {
      const loadingId = notification.info(options.loading, { duration: 0 });
      
      return promise
        .then((data) => {
          notification.hide(loadingId);
          const message = typeof options.success === 'function' 
            ? options.success(data) 
            : options.success;
          notification.success(message);
          return data;
        })
        .catch((error) => {
          notification.hide(loadingId);
          const message = typeof options.error === 'function' 
            ? options.error(error) 
            : options.error;
          notification.error(message);
          throw error;
        });
    },

    // Form validation notifications
    validationError: (errors: Record<string, string>) => {
      const errorMessages = Object.values(errors);
      if (errorMessages.length === 1) {
        const firstError = errorMessages[0];
        if (firstError) {
          notification.error(firstError);
        }
      } else {
        notification.error(`${errorMessages.length} fel måste korrigeras`, {
          title: 'Valideringsfel'
        });
      }
    },

    // Network error notifications
    networkError: (_error: Error) => {
      notification.error('Nätverksfel. Kontrollera din internetanslutning.', {
        title: 'Anslutningsfel'
      });
    },

    // Permission denied notifications
    permissionDenied: (action: string) => {
      notification.warning(`Du har inte behörighet för att ${action}.`, {
        title: 'Åtkomst nekad'
      });
    }
  };
};
