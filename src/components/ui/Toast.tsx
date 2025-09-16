import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = {
      ...toastData,
      id,
      duration: toastData.duration ?? 5000
    };

    setToasts(prev => [...prev, toast]);

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  }, [removeToast]);

  const success = useCallback((message: string, duration?: number) => {
    const toast: Omit<Toast, 'id'> = { message, type: 'success' };
    if (duration !== undefined) {
      toast.duration = duration;
    }
    return addToast(toast);
  }, [addToast]);

  const error = useCallback((message: string, duration?: number) => {
    const toast: Omit<Toast, 'id'> = { message, type: 'error' };
    if (duration !== undefined) {
      toast.duration = duration;
    }
    return addToast(toast);
  }, [addToast]);

  const warning = useCallback((message: string, duration?: number) => {
    const toast: Omit<Toast, 'id'> = { message, type: 'warning' };
    if (duration !== undefined) {
      toast.duration = duration;
    }
    return addToast(toast);
  }, [addToast]);

  const info = useCallback((message: string, duration?: number) => {
    const toast: Omit<Toast, 'id'> = { message, type: 'info' };
    if (duration !== undefined) {
      toast.duration = duration;
    }
    return addToast(toast);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      success,
      error,
      warning,
      info
    }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(onRemove, 300); // Wait for animation
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const getColorClass = () => {
    switch (toast.type) {
      case 'success': return 'toast-success';
      case 'error': return 'toast-error';
      case 'warning': return 'toast-warning';
      case 'info': return 'toast-info';
      default: return 'toast-info';
    }
  };

  return (
    <div 
      className={`toast ${getColorClass()} ${isVisible ? 'toast-visible' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{toast.message}</span>
      </div>
      
      <div className="toast-actions">
        {toast.action && (
          <button 
            className="toast-action-button"
            onClick={toast.action.onClick}
          >
            {toast.action.label}
          </button>
        )}
        <button 
          className="toast-close-button"
          onClick={handleRemove}
          aria-label="Stäng notifiering"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
