import React from 'react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = [
    'loading-button',
    `loading-button-${variant}`,
    `loading-button-${size}`,
    fullWidth ? 'loading-button-full' : '',
    loading ? 'loading-button-loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={baseClasses}
    >
      <span className="loading-button-content">
        {loading ? (
          <>
            <span className="loading-spinner" />
            <span>Laddar...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="loading-button-icon-left">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="loading-button-icon-right">{rightIcon}</span>}
          </>
        )}
      </span>
    </button>
  );
};

// Specialized button variants
export const SubmitButton: React.FC<Omit<LoadingButtonProps, 'variant'>> = (props) => (
  <LoadingButton {...props} variant="primary" type="submit" />
);

export const CancelButton: React.FC<Omit<LoadingButtonProps, 'variant'>> = (props) => (
  <LoadingButton {...props} variant="outline" type="button" />
);

export const DeleteButton: React.FC<Omit<LoadingButtonProps, 'variant'>> = (props) => (
  <LoadingButton {...props} variant="danger" />
);
