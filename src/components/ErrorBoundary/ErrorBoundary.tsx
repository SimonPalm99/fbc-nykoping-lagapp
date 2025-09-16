import React, { Component, ErrorInfo, ReactNode } from 'react';
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
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: '16px',
          margin: '2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          
          <h2 style={{
            color: '#dc3545',
            marginBottom: '1rem',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            Något gick fel
          </h2>
          
          <p style={{
            color: '#6c757d',
            marginBottom: '2rem',
            maxWidth: '500px',
            lineHeight: '1.5'
          }}>
            Ett oväntat fel har inträffat. Vi har automatiskt rapporterat problemet 
            och arbetar på att lösa det.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#218838';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#28a745';
              }}
            >
              🔄 Försök igen
            </button>
            
            <button
              onClick={this.handleReload}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0056b3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#007bff';
              }}
            >
              🔃 Ladda om sidan
            </button>
          </div>

          {/* Development mode: Show error details */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              textAlign: 'left',
              maxWidth: '600px',
              width: '100%'
            }}>
              <summary style={{
                cursor: 'pointer',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '0.5rem'
              }}>
                🐛 Utvecklingsdetaljer (klicka för att visa)
              </summary>
              
              <div style={{
                fontSize: '0.875rem',
                color: '#6c757d',
                fontFamily: 'monospace',
                backgroundColor: '#ffffff',
                padding: '1rem',
                borderRadius: '4px',
                border: '1px solid #dee2e6',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                <strong>Error:</strong> {this.state.error.message}
                <br /><br />
                <strong>Stack:</strong>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {this.state.error.stack}
                </pre>
                {this.state.errorInfo && (
                  <>
                    <br /><br />
                    <strong>Component Stack:</strong>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
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
