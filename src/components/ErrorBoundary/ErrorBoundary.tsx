import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';
import { apiService } from '../../services/apiService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error,
      errorId: Date.now().toString()
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send error to monitoring service (would be Sentry in production)
    this.logErrorToService(error, errorInfo);
  }

  private async logErrorToService(error: Error, errorInfo: ErrorInfo) {
    try {
      // In production, this would send to Sentry or similar service
      await apiService.post('/errors/report', {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        errorInfo: {
          componentStack: errorInfo.componentStack,
        },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  private handleReload = () => {
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className={styles.errorBoundaryWrapper}>
          <div className={styles.errorBoundaryIcon}>⚠️</div>
          <h2 className={styles.errorBoundaryTitle}>Något gick fel</h2>
          <p className={styles.errorBoundaryText}>
            Ett oväntat fel har inträffat. Vi har automatiskt rapporterat problemet
            och arbetar på att lösa det.
          </p>
          <div className={styles.errorBoundaryActions}>
            <button
              onClick={this.handleRetry}
              className={styles.errorBoundaryBtn}
              type="button"
            >
              🔄 Försök igen
            </button>
            <button
              onClick={this.handleReload}
              className={`${styles.errorBoundaryBtn} ${styles.errorBoundaryBtnReload}`}
              type="button"
            >
              🔃 Ladda om sidan
            </button>
          </div>
          {/* Development mode: Show error details */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className={styles.errorBoundaryDetails}>
              <summary className={styles.errorBoundarySummary}>
                🐛 Utvecklingsdetaljer (klicka för att visa)
              </summary>
              <div className={styles.errorBoundaryDev}>
                <strong>Error:</strong> {this.state.error.message}
                <br /><br />
                <strong>Stack:</strong>
                <pre className={styles.errorBoundaryPre}>
                  {this.state.error.stack}
                </pre>
                {this.state.errorInfo && (
                  <>
                    <br /><br />
                    <strong>Component Stack:</strong>
                    <pre className={styles.errorBoundaryPre}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </>
                )}
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary 
      fallback={fallback} 
      {...(onError && { onError })}
    >
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// React hook for error boundary (requires React 18+)
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // In React 18+, you can use this to trigger error boundaries
    throw error;
  };
}
