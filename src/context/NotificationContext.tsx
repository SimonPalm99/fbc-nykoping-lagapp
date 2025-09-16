import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type Notification } from '../types/extra';
import { useAuth } from './AuthContext';
import { useToast } from '../components/ui/Toast';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'userId' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: () => void;
  getNotificationsByType: (type: Notification['type']) => Notification[];
  requestPermission: () => Promise<boolean>;
  sendPushNotification: (title: string, body: string, data?: any) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Initialize with some mock notifications
  useEffect(() => {
    if (user) {
      const mockNotifications: Notification[] = [
        {
          id: 'notif-1',
          userId: user.id,
          type: 'activity',
          title: 'Ny träning schemalagd',
          message: 'Träning på måndag 19:00 i Nyköpings Sporthall',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
          priority: 'medium',
          actionUrl: '/activities'
        },
        {
          id: 'notif-2',
          userId: user.id,
          type: 'achievement',
          title: 'Ny utmärkelse!',
          message: 'Du har låst upp "Träningsdjur" - 10 träningar i rad!',
          isRead: false,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5h ago
          priority: 'high',
          actionUrl: '/gamification'
        },
        {
          id: 'notif-3',
          userId: user.id,
          type: 'forum',
          title: 'Nytt inlägg i forumet',
          message: 'Marcus kommenterade på "Matchförberedelser inför helgen"',
          isRead: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1d ago
          readAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
          priority: 'low',
          actionUrl: '/forum'
        },
        {
          id: 'notif-4',
          userId: user.id,
          type: 'fine',
          title: 'Påminnelse om böter',
          message: 'Du har 150 kr i utestående böter som behöver betalas',
          isRead: false,
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2d ago
          priority: 'urgent',
          actionUrl: '/fines'
        }
      ];
      
      setNotifications(mockNotifications);
    }
  }, [user]);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (notificationData: Omit<Notification, 'id' | 'userId' | 'isRead' | 'createdAt'>) => {
    if (!user) return;

    const newNotification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast for new notification
    toast.info(notificationData.title, 5000);

    // Send push notification if permission granted
    if (permission === 'granted') {
      sendPushNotification(notificationData.title, notificationData.message, notificationData.data);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true, readAt: new Date().toISOString() }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    const now = new Date().toISOString();
    setNotifications(prev => 
      prev.map(notification => ({ 
        ...notification, 
        isRead: true, 
        readAt: notification.readAt || now 
      }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationsByType = (type: Notification['type']) => {
    return notifications.filter(n => n.type === type);
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast.error('Denna webbläsare stöder inte notifikationer');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        toast.success('Notifikationer aktiverade!');
        return true;
      } else {
        toast.warning('Notifikationer nekade');
        return false;
      }
    } catch (error) {
      toast.error('Kunde inte begära notifikationstillstånd');
      return false;
    }
  };

  const sendPushNotification = (title: string, body: string, data?: any) => {
    if (permission === 'granted' && 'Notification' in window) {
      try {
        const notification = new Notification(title, {
          body,
          icon: '/logo192.png',
          badge: '/fbc-logo.jpg',
          data,
          requireInteraction: false,
          tag: 'fbc-nykoping'
        });

        // Auto close after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);

        // Handle notification click
        notification.onclick = function(event) {
          event.preventDefault();
          window.focus();
          if (data?.actionUrl) {
            window.location.href = data.actionUrl;
          }
        };
      } catch (error) {
        console.error('Failed to send push notification:', error);
      }
    }
  };

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    getNotificationsByType,
    requestPermission,
    sendPushNotification
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
