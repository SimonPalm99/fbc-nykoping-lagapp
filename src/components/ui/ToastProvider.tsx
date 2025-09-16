import React, { createContext, useContext, useState, useCallback } from "react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{ 
  toasts: Toast[]; 
  onRemove: (id: string) => void; 
}> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  const getToastIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success": return "✅";
      case "error": return "❌";
      case "warning": return "⚠️";
      case "info": return "ℹ️";
      default: return "📢";
    }
  };

  const getToastColor = (type: Toast["type"]) => {
    switch (type) {
      case "success": return "#22c55e";
      case "error": return "#ef4444";
      case "warning": return "#f59e0b";
      case "info": return "#3b82f6";
      default: return "#64748b";
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: "6rem",
      right: "1rem",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      maxWidth: "400px"
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="toast animate-slideIn"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "12px",
            padding: "1rem 1.5rem",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderLeft: `4px solid ${getToastColor(toast.type)}`,
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
            minWidth: "300px"
          }}
        >
          <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>
            {getToastIcon(toast.type)}
          </span>
          
          <div style={{ flex: 1 }}>
            <p style={{ 
              margin: 0, 
              fontSize: "0.875rem", 
              fontWeight: "500",
              color: "#0f172a",
              lineHeight: "1.4"
            }}>
              {toast.message}
            </p>
            
            {toast.action && (
              <button
                onClick={() => {
                  toast.action!.onClick();
                  onRemove(toast.id);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: getToastColor(toast.type),
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "0.5rem",
                  padding: 0,
                  textDecoration: "underline"
                }}
              >
                {toast.action.label}
              </button>
            )}
          </div>

          <button
            onClick={() => onRemove(toast.id)}
            style={{
              background: "none",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              fontSize: "1rem",
              padding: 0,
              flexShrink: 0,
              opacity: 0.7,
              transition: "opacity 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastProvider;
