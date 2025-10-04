import React, { Component, ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to error reporting service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    }
    
    this.setState({ error, errorInfo });
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error!} resetError={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}
interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div className="error-fallback-container">
      <div className="error-fallback-emoji">😵</div>
      <h2 className="error-fallback-title">
        Något gick fel
      </h2>
      <p className="error-fallback-message">
        Ett oväntat fel uppstod. Vi ber om ursäkt för besväret.
      </p>
      
      {process.env.NODE_ENV === 'development' && error && (
        <details className="error-fallback-details">
          <summary className="error-fallback-summary">
            Teknisk information (endast i utvecklingsläge)
          </summary>
          <pre className="error-fallback-stack">
            {error.stack}
          </pre>
        </details>
      )}
      
      <div className="error-fallback-actions">
        <button
          onClick={resetError}
          className="error-fallback-btn error-fallback-btn-retry"
        >
          Försök igen
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="error-fallback-btn error-fallback-btn-reload"
        >
          Ladda om sidan
        </button>
      </div>
    </div>
  );
};

// Higher-order component for easy wrapping
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};
