import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRegistration } from '../../types/auth';
import styles from './OnboardingWizard.module.css';

type UserRole = 'player' | 'leader';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface OnboardingData extends UserRegistration {
  role: UserRole;
  birthday: string;
}

interface OnboardingWizardProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onComplete,
  onSkip
}) => {
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    email: '',
    password: '',
    position: '',
    role: 'player',
    aboutMe: '',
    phone: '',
    birthday: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    }
  });

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Välkommen till FBC Nyköping!',
      description: 'Låt oss sätta upp din profil',
      completed: false
    },
    {
      id: 'basic-info',
      title: 'Grundläggande information',
      description: 'Berätta lite om dig själv',
      completed: false
    },
    {
      id: 'hockey-info',
      title: 'Hockeyinformation',
      description: 'Din position och spelstil',
      completed: false
    },
    {
      id: 'contact-info',
      title: 'Kontaktuppgifter',
      description: 'För säkerhet och kommunikation',
      completed: false
    },
    {
      id: 'emergency-contact',
      title: 'Nödkontakt',
      description: 'Viktig säkerhetsinformation',
      completed: false
    },
    {
      id: 'complete',
      title: 'Klart!',
      description: 'Din profil är nu konfigurerad',
      completed: false
    }
  ];

  const positions = [
    'Center',
    'Forward',
    'Back',
    'Målvakt',
    'Tränare',
    'Annan'
  ];

  const relations = [
    'Förälder',
    'Partner',
    'Syskon',
    'Vän',
    'Annan familjemedlem'
  ];

  const isStepValid = () => {
    switch (currentStep) {
      case 1: // Basic info
        return formData.name && formData.email && formData.password && formData.birthday;
      case 2: // Hockey info
        return formData.position && formData.jerseyNumber;
      case 3: // Contact info
        return formData.phone;
      case 4: // Emergency contact
        return formData.emergencyContact?.name && 
               formData.emergencyContact?.phone && 
               formData.emergencyContact?.relation;
      default:
        return true;
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('emergencyContact.')) {
      const contactField = field.split('.')[1] as keyof NonNullable<OnboardingData['emergencyContact']>;
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact!,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field as keyof OnboardingData]: value
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Konvertera formData till rätt format för register
      const registrationData: UserRegistration = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.jerseyNumber && { jerseyNumber: formData.jerseyNumber }),
        ...(formData.position && { position: formData.position }),
        ...(formData.position && { favoritePosition: formData.position }),
        ...(formData.aboutMe && { aboutMe: formData.aboutMe }),
        ...(formData.emergencyContact && { emergencyContact: formData.emergencyContact })
      };
      
      await register(registrationData);
      onComplete();
    } catch (error) {
      console.error('Registreringsfel:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="welcome-step">
            <div className="welcome-icon">🏒</div>
            <h2>Välkommen till FBC Nyköping!</h2>
            <p>
              Vi är glada att ha dig i laget! Låt oss ställa in din profil 
              så att du kan få ut det mesta av appen.
            </p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">📅</span>
                <span>Håll koll på träningar och matcher</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Följ din utveckling och statistik</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🏆</span>
                <span>Samla badges och utmärkelser</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💬</span>
                <span>Kommunicera med lagkamrater</span>
              </div>
            </div>
          </div>
        );

      case 1: // Basic info
        return (
          <div className="form-step">
            <h2>Grundläggande information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Fullständigt namn *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Förnamn Efternamn"
                  title="Fullständigt namn"
                />
              </div>
              <div className="form-group">
                <label>E-postadress *</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="din@email.se"
                  title="E-postadress"
                />
              </div>
              <div className="form-group">
                <label>Lösenord *</label>
                <input
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Välj ett säkert lösenord"
                  title="Lösenord"
                />
              </div>
              <div className="form-group">
                <label>Födelsedag *</label>
                <input
                  type="date"
                  value={formData.birthday || ''}
                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                  title="Födelsedag"
                />
              </div>
              <div className="form-group full-width">
                <label>Om mig (valfritt)</label>
                <textarea
                  value={formData.aboutMe || ''}
                  onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                  placeholder="Berätta lite om dig själv, dina mål eller vad som motiverar dig..."
                  rows={3}
                  title="Om mig"
                />
              </div>
            </div>
          </div>
        );

      case 2: // Hockey info
        return (
          <div className="form-step">
            <h2>Hockeyinformation</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Tröjnummer *</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={formData.jerseyNumber || ''}
                  onChange={(e) => handleInputChange('jerseyNumber', parseInt(e.target.value))}
                  placeholder="Välj ett nummer"
                  title="Tröjnummer"
                />
              </div>
              <div className="form-group">
                <label>Position *</label>
                <select
                  value={formData.position || ''}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  title="Position"
                >
                  <option value="">Välj position</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Roll i laget</label>
                <select
                  value={formData.role || 'player'}
                  onChange={(e) => handleInputChange('role', e.target.value as UserRole)}
                  title="Roll i laget"
                >
                  <option value="player">Spelare</option>
                  <option value="leader">Ledare/Tränare</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3: // Contact info
        return (
          <div className="form-step">
            <h2>Kontaktuppgifter</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Telefonnummer *</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="070-123 45 67"
                  title="Telefonnummer"
                />
              </div>
            </div>
            <div className="info-box">
              <span className="info-icon">ℹ️</span>
              <p>
                Ditt telefonnummer används för viktig lagkommunikation och 
                nödsituationer. Vi delar aldrig din information med tredje part.
              </p>
            </div>
          </div>
        );

      case 4: // Emergency contact
        return (
          <div className="form-step">
            <h2>Nödkontakt</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Kontaktens namn *</label>
                <input
                  type="text"
                  value={formData.emergencyContact?.name || ''}
                  onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                  placeholder="Förnamn Efternamn"
                  title="Kontaktens namn"
                />
              </div>
              <div className="form-group">
                <label>Telefonnummer *</label>
                <input
                  type="tel"
                  value={formData.emergencyContact?.phone || ''}
                  onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                  placeholder="070-123 45 67"
                  title="Kontaktens telefonnummer"
                />
              </div>
              <div className="form-group">
                <label>Relation *</label>
                <select
                  value={formData.emergencyContact?.relation || ''}
                  onChange={(e) => handleInputChange('emergencyContact.relation', e.target.value)}
                  title="Relation"
                >
                  <option value="">Välj relation</option>
                  {relations.map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="info-box">
              <span className="info-icon">🚨</span>
              <p>
                Nödkontakten används endast i akuta situationer under träning 
                eller matcher. Denna information är endast tillgänglig för ledare.
              </p>
            </div>
          </div>
        );

      case 5: // Complete
        return (
          <div className="complete-step">
            <div className="success-icon">✅</div>
            <h2>Välkommen ombord!</h2>
            <p>
              Din profil är nu konfigurerad och redo att användas. 
              Ditt konto väntar på godkännande från en ledare.
            </p>
            <div className="next-steps">
              <h3>Nästa steg:</h3>
              <ul>
                <li>En ledare kommer att granska och godkänna ditt konto</li>
                <li>Du får en bekräftelse när du är godkänd</li>
                <li>Utforska appen och börja logga träningar</li>
                <li>Anmäl dig till kommande aktiviteter</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-wizard">
        {/* Progress indicator */}
        <div className="progress-header">
          <div className="progress-bar">
            <div 
              className={styles.progressFill}
              data-progress-width={(currentStep / (steps.length - 1)) * 100}
            />
          </div>
          <div className="step-indicators">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`step-indicator ${
                  index === currentStep ? 'active' : 
                  index < currentStep ? 'completed' : ''
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="step-content">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="step-navigation">
          <div className="nav-left">
            {currentStep > 0 && (
              <button 
                type="button" 
                className="btn-secondary"
                onClick={prevStep}
              >
                ← Tillbaka
              </button>
            )}
          </div>
          
          <div className="nav-right">
            <button 
              type="button" 
              className="btn-text"
              onClick={onSkip}
            >
              Hoppa över
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                className="btn-primary"
                onClick={nextStep}
                disabled={!isStepValid()}
              >
                {currentStep === 0 ? 'Kom igång' : 'Fortsätt'} →
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={handleComplete}
              >
                Slutför registrering
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
