import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoadingButton } from '../ui/LoadingButton';
import { Modal } from '../ui/Modal';

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSuccess
}) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    
    // Rensa fel för detta fält
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!credentials.email) {
      newErrors.email = 'E-post krävs';
    }
    if (!credentials.password) {
      newErrors.password = 'Lösenord krävs';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const success = await login(credentials);
      if (success) {
        onSuccess?.();
        onClose();
      } else {
        setErrors({ general: 'Felaktiga inloggningsuppgifter' });
      }
    } catch (error) {
      setErrors({ general: 'Ett fel uppstod vid inloggning' });
    } finally {
      setIsLoading(false);
    }
  };

  const demoUsers = [
    { email: 'simon@fbcnykoping.se', role: 'Ledare' },
    { email: 'erik@fbcnykoping.se', role: 'Spelare' },
    { email: 'anna@example.com', role: 'Väntande godkännande' }
  ];

  const fillDemoUser = (email: string) => {
    setCredentials({
      email,
      password: 'password123'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="md" className="auth-modal">
      <div className="auth-form-container">
        {/* Header */}
        <div className="auth-form-header">
          <div className="auth-logo">🏒</div>
          <h2 className="auth-title">Välkommen tillbaka!</h2>
          <p className="auth-subtitle">Logga in på ditt FBC Nyköping-konto</p>
        </div>

        {errors.general && (
          <div className="auth-error-banner">
            <span className="error-icon">⚠️</span>
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="email" className="auth-label">
              <span className="label-icon">📧</span>
              E-postadress
            </label>
            <input
              type="email"
              id="email"
              value={credentials.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
              placeholder="din.email@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <span className="auth-error-message">
                <span className="error-icon">⚠️</span>
                {errors.email}
              </span>
            )}
          </div>

          <div className="auth-form-group">
            <label htmlFor="password" className="auth-label">
              <span className="label-icon">🔐</span>
              Lösenord
            </label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
              placeholder="Ditt lösenord"
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="auth-error-message">
                <span className="error-icon">⚠️</span>
                {errors.password}
              </span>
            )}
          </div>

          <LoadingButton
            type="submit"
            loading={isLoading}
            className="auth-submit-button"
          >
            <span className="button-icon">🚀</span>
            Logga in
          </LoadingButton>
        </form>

        <div className="auth-divider">
          <span>eller testa med</span>
        </div>

        <div className="demo-users-container">
          <h4 className="demo-users-title">
            <span className="demo-icon">🎮</span>
            Demo-användare
          </h4>
          <div className="demo-users-grid">
            {demoUsers.map((user, index) => (
              <button
                key={index}
                type="button"
                className="demo-user-card"
                onClick={() => fillDemoUser(user.email)}
              >
                <div className="demo-user-avatar">
                  {user.role === 'Ledare' ? '👑' : user.role === 'Spelare' ? '🏒' : '⏳'}
                </div>
                <div className="demo-user-info">
                  <span className="demo-email">{user.email}</span>
                  <span className="demo-role">{user.role}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Har du inget konto ännu?
          </p>
          <button 
            type="button" 
            className="auth-switch-button"
            onClick={onSwitchToRegister}
          >
            <span className="button-icon">✨</span>
            Registrera dig här
          </button>
        </div>
      </div>
    </Modal>
  );
};
