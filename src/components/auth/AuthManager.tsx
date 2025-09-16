import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoginForm } from './LoginForm';
import { RegistrationForm } from './RegistrationForm';
import { UserApproval } from './UserApproval';
import { ProfileEdit } from './ProfileEdit';
import './Auth.css';

export const AuthManager: React.FC = () => {
  const { user, isAuthenticated, logout, canApproveUsers, getPendingUsers, login } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  const pendingCount = getPendingUsers().length;

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleAuthSuccess = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleProfileSuccess = () => {
    setShowProfileEdit(false);
  };

  // Demo-inloggningar
  const handleDemoLogin = async (userType: 'spelare' | 'ledare' | 'admin') => {
    const demoCredentials = {
      spelare: { email: 'erik@demo.se', password: 'demo123' },
      ledare: { email: 'sara@demo.se', password: 'demo123' },
      admin: { email: 'admin@demo.se', password: 'demo123' }
    };
    
    const credentials = demoCredentials[userType];
    try {
      await login(credentials);
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-manager">
        {/* Förbättrad Hero Section */}
        <div className="auth-hero-section">
          <div className="auth-hero-content">
            <div className="auth-hero-icon">🏒</div>
            <h1 className="auth-hero-title">Välkommen till FBC Nyköping</h1>
            <p className="auth-hero-subtitle">
              Anslut dig till laget och få tillgång till alla funktioner
            </p>
          </div>

          {/* Demo inloggningar */}
          <div className="demo-section">
            <h3 className="demo-title">🚀 Testa appen direkt</h3>
            <p className="demo-subtitle">Välj en demoroll för att utforska appen:</p>
            
            <div className="demo-buttons-grid">
              <button 
                className="demo-button demo-player"
                onClick={() => handleDemoLogin('spelare')}
              >
                <div className="demo-button-icon">⚽</div>
                <div className="demo-button-content">
                  <span className="demo-button-title">Demo Spelare</span>
                  <span className="demo-button-subtitle">Se spelarfunktioner</span>
                </div>
              </button>

              <button 
                className="demo-button demo-leader"
                onClick={() => handleDemoLogin('ledare')}
              >
                <div className="demo-button-icon">👑</div>
                <div className="demo-button-content">
                  <span className="demo-button-title">Demo Ledare</span>
                  <span className="demo-button-subtitle">Se ledarfunktioner</span>
                </div>
              </button>

              <button 
                className="demo-button demo-admin"
                onClick={() => handleDemoLogin('admin')}
              >
                <div className="demo-button-icon">⚙️</div>
                <div className="demo-button-content">
                  <span className="demo-button-title">Demo Admin</span>
                  <span className="demo-button-subtitle">Se alla funktioner</span>
                </div>
              </button>
            </div>
          </div>

          {/* Eller sektion */}
          <div className="divider-section">
            <div className="divider-line"></div>
            <span className="divider-text">eller</span>
            <div className="divider-line"></div>
          </div>
          
          <div className="auth-buttons-grid">
            <button 
              className="auth-button auth-button-login"
              onClick={() => setShowLogin(true)}
            >
              <div className="auth-button-icon">🔐</div>
              <div className="auth-button-content">
                <span className="auth-button-title">Logga in</span>
                <span className="auth-button-subtitle">Har du redan ett konto?</span>
              </div>
              <div className="auth-button-arrow">→</div>
            </button>

            <button 
              className="auth-button auth-button-register"
              onClick={() => setShowRegister(true)}
            >
              <div className="auth-button-icon">✨</div>
              <div className="auth-button-content">
                <span className="auth-button-title">Registrera dig</span>
                <span className="auth-button-subtitle">Ny spelare? Välkommen!</span>
              </div>
              <div className="auth-button-arrow">→</div>
            </button>
          </div>

          <div className="auth-features-preview">
            <div className="feature-item">
              <span className="feature-icon">📅</span>
              <span>Aktiviteter & Träningar</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Statistik & Resultat</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <span>Lagkommunikation</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏆</span>
              <span>Tabeller & Matcher</span>
            </div>
          </div>
        </div>

        <LoginForm
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={handleSwitchToRegister}
          onSuccess={handleAuthSuccess}
        />

        <RegistrationForm
          isOpen={showRegister}
          onClose={() => setShowRegister(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  // Status för väntande användare
  if (user?.status === 'pending') {
    return (
      <div className="auth-manager">
        <div className="pending-approval">
          <div className="pending-message">
            <h2>Ansökan inskickad</h2>
            <p>
              Tack för din ansökan! Din registrering granskas nu av en ledare. 
              Du kommer att få tillgång till appen när din ansökan godkänts.
            </p>
            <p className="contact-info">
              Har du frågor? Kontakta oss på <a href="mailto:info@fbcnykoping.se">info@fbcnykoping.se</a>
            </p>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={logout}
          >
            Logga ut
          </button>
        </div>
      </div>
    );
  }

  // Inloggad användare
  return (
    <div className="auth-manager">
      <div className="user-menu">
        <div className="user-info">
          <div className="user-avatar">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profilbild" />
            ) : (
              <span className="user-initials">
                {user?.name.split(' ').map(n => n[0]).join('')}
              </span>
            )}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role === 'leader' ? 'Ledare' : 'Spelare'}</span>
          </div>
        </div>

        <div className="user-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setShowProfileEdit(true)}
          >
            Redigera profil
          </button>
          
          {canApproveUsers() && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setShowApproval(true)}
            >
              Godkänn användare
              {pendingCount > 0 && (
                <span className="notification-badge">{pendingCount}</span>
              )}
            </button>
          )}
          
          <button 
            className="btn btn-ghost btn-sm"
            onClick={logout}
          >
            Logga ut
          </button>
        </div>
      </div>

      <UserApproval
        isOpen={showApproval}
        onClose={() => setShowApproval(false)}
      />

      <ProfileEdit
        isOpen={showProfileEdit}
        onClose={() => setShowProfileEdit(false)}
        onSuccess={handleProfileSuccess}
      />
    </div>
  );
};
