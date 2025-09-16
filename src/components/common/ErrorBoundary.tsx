import React, { Component, ReactNode } from 'react';

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
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      background: '#fff',
      border: '2px solid #f44336',
      borderRadius: '12px',
      margin: '2rem',
      boxShadow: '0 4px 12px rgba(244, 67, 54, 0.1)'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😵</div>
      <h2 style={{ color: '#f44336', marginBottom: '1rem' }}>
        Något gick fel
      </h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Ett oväntat fel uppstod. Vi ber om ursäkt för besväret.
      </p>
      
      {process.env.NODE_ENV === 'development' && error && (
        <details style={{ 
          textAlign: 'left', 
          background: '#f5f5f5', 
          padding: '1rem', 
          borderRadius: '8px',
          marginBottom: '1rem',
          overflow: 'auto'
        }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            Teknisk information (endast i utvecklingsläge)
          </summary>
          <pre style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {error.stack}
          </pre>
        </details>
      )}
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={resetError}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Försök igen
        </button>
        
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
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
