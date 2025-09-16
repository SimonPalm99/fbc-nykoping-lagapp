import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  centered?: boolean;
  animation?: 'fade' | 'slide' | 'zoom';
  destroyOnClose?: boolean;
  focusTriggerAfterClose?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  children,
  footer,
  className = '',
  centered = true,
  animation = 'fade',
  destroyOnClose = false,
  focusTriggerAfterClose = true,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle open/close with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus the modal after animation
      setTimeout(() => {
        setIsAnimating(false);
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 150);
    } else if (isVisible) {
      setIsAnimating(true);
      
      setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Restore focus
        if (focusTriggerAfterClose && previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }, 150);
    }
  }, [isOpen, isVisible, focusTriggerAfterClose]);

  // Handle keyboard events with focus trapping
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'Escape' && closeOnEsc) {
      onClose();
    }
    
    // Trap focus within modal
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    }
  }, [isOpen, onClose, closeOnEsc]);

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [isVisible, handleKeyDown]);

  // Don't render if not visible and destroyOnClose is true
  if (!isVisible && destroyOnClose) {
    return null;
  }

  if (!isVisible) return null;

  const sizeClasses = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl',
    full: 'modal-full'
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return createPortal(
    <div 
      className={`modal-overlay ${isOpen ? 'modal-overlay-open' : ''} ${isAnimating ? 'modal-animating' : ''}`}
      onClick={handleOverlayClick}
    >
      <div 
        ref={modalRef}
        className={`modal modal-${animation} ${sizeClasses[size]} ${centered ? 'modal-centered' : ''} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby || (title ? "modal-title" : undefined)}
        aria-describedby={ariaDescribedby}
        tabIndex={-1}
      >
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && (
              <h2 id="modal-title" className="modal-title">{title}</h2>
            )}
            {showCloseButton && (
              <button
                className="modal-close-button"
                onClick={onClose}
                aria-label="Stäng dialog"
                type="button"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M13 1L1 13M1 1l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        
        <div className="modal-body">
          {children}
        </div>
        
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

// Specialized modal components
interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Bekräfta",
  cancelText = "Avbryt",
  variant = "info"
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger': return '⚠️';
      case 'warning': return '🔔';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const getConfirmButtonClass = () => {
    switch (variant) {
      case 'danger': return 'loading-button loading-button-danger loading-button-md';
      case 'warning': return 'loading-button loading-button-secondary loading-button-md';
      case 'info': return 'loading-button loading-button-primary loading-button-md';
      default: return 'loading-button loading-button-primary loading-button-md';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            className="loading-button loading-button-outline loading-button-md"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={getConfirmButtonClass()}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ fontSize: '2rem', marginTop: '0.25rem' }}>
          {getIcon()}
        </div>
        <div>
          <p style={{ margin: 0, lineHeight: 1.5, color: '#374151' }}>
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};

// Hook for imperative modal usage
export const useModal = () => {
  const [modals, setModals] = useState<Array<{
    id: string;
    component: React.ReactNode;
  }>>([]);

  const openModal = useCallback((component: React.ReactNode) => {
    const id = Math.random().toString(36).substr(2, 9);
    setModals(prev => [...prev, { id, component }]);
    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  const confirm = useCallback((props: Omit<ConfirmModalProps, 'isOpen'>) => {
    return new Promise<boolean>((resolve) => {
      const id = openModal(
        <ConfirmModal
          {...props}
          isOpen={true}
          onConfirm={async () => {
            await props.onConfirm?.();
            closeModal(id);
            resolve(true);
          }}
          onCancel={() => {
            props.onCancel?.();
            closeModal(id);
            resolve(false);
          }}
        />
      );
    });
  }, [openModal, closeModal]);

  const ModalContainer = useCallback(() => (
    <>
      {modals.map(({ id, component }) => (
        <React.Fragment key={id}>
          {component}
        </React.Fragment>
      ))}
    </>
  ), [modals]);

  return {
    openModal,
    closeModal,
    closeAllModals,
    confirm,
    ModalContainer
  };
};
