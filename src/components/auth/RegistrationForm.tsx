import React, { useState } from 'react';
import styles from "./RegistrationForm.module.css";
import { useAuth } from '../../context/AuthContext';
import { UserRegistration } from '../../types/auth';
import { LoadingButton } from '../ui/LoadingButton';
import { Modal } from '../ui/Modal';

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserRegistration>({
    email: '',
    password: '',
    name: '',
    position: '',
    phone: '',
    aboutMe: '',
    favoritePosition: '',
    previousClubs: [],
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    }
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const positions = [
    'Målvakt',
    'Back',
    'Center',
    'Forward'
  ];

  const relations = [
    'Förälder',
    'Make/Maka',
    'Partner',
    'Syskon',
    'Vän',
    'Annan'
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.email) newErrors.email = 'E-post krävs';
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = 'Lösenord måste vara minst 6 tecken';
      }
      if (!formData.name) newErrors.name = 'Namn krävs';
    }

    if (step === 2) {
      if (!formData.position) newErrors.position = 'Position krävs';
      if (!formData.phone) newErrors.phone = 'Telefonnummer krävs';
    }

    if (step === 3) {
      if (!formData.emergencyContact?.name) {
        newErrors['emergencyContact.name'] = 'Nödkontaktens namn krävs';
      }
      if (!formData.emergencyContact?.phone) {
        newErrors['emergencyContact.phone'] = 'Nödkontaktens telefon krävs';
      }
      if (!formData.emergencyContact?.relation) {
        newErrors['emergencyContact.relation'] = 'Relation krävs';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent as string]: {
          ...(prev[parent as keyof UserRegistration] as any),
          [child as string]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Rensa fel för detta fält
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      const success = await register(formData);
      if (success) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="registration-step">
            <div className="step-header">
              <h3 className="step-title">
                <span className="step-icon">📝</span>
                Grundläggande information
              </h3>
              <p className="step-description">Låt oss börja med dina grunduppgifter</p>
            </div>
            
            <div className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="email" className="auth-label">
                  <span className="label-icon">📧</span>
                  E-postadress *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                  placeholder="din.email@example.com"
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
                  Lösenord *
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                  placeholder="Minst 6 tecken"
                />
                {errors.password && (
                  <span className="auth-error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="auth-form-group">
                <label htmlFor="name" className="auth-label">
                  <span className="label-icon">👤</span>
                  Fullständigt namn *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`auth-input ${errors.name ? 'auth-input-error' : ''}`}
                  placeholder="Förnamn Efternamn"
                />
                {errors.name && (
                  <span className="auth-error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="registration-step">
            <h3>Spelarinformation</h3>
            <div className="form-group">
              <label htmlFor="position">Position *</label>
              <select
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className={errors.position ? 'error' : ''}
              >
                <option value="">Välj position</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
              {errors.position && <span className="error-message">{errors.position}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="favoritePosition">Favoritposition</label>
              <input
                type="text"
                id="favoritePosition"
                value={formData.favoritePosition || ''}
                onChange={(e) => handleInputChange('favoritePosition', e.target.value)}
                placeholder="T.ex. Högerforward, Centerback..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="jerseyNumber">Önskat tröjnummer</label>
              <input
                type="number"
                id="jerseyNumber"
                value={formData.jerseyNumber || ''}
                onChange={(e) => handleInputChange('jerseyNumber', e.target.value ? parseInt(e.target.value) : undefined)}
                min="1"
                max="99"
                placeholder="1-99"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefonnummer *</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={errors.phone ? 'error' : ''}
                placeholder="070-123 45 67"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="aboutMe">Berätta om dig själv</label>
              <textarea
                id="aboutMe"
                value={formData.aboutMe || ''}
                onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                placeholder="Tidigare erfarenheter, spelstil, mål med spelet..."
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="registration-step">
            <h3>Nödkontakt</h3>
            <p className="info-text">
              Denna information är endast synlig för ledare och används vid nödsituationer.
            </p>

            <div className="form-group">
              <label htmlFor="emergencyName">Nödkontaktens namn *</label>
              <input
                type="text"
                id="emergencyName"
                value={formData.emergencyContact?.name || ''}
                onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                className={errors['emergencyContact.name'] ? 'error' : ''}
                placeholder="Förnamn Efternamn"
              />
              {errors['emergencyContact.name'] && (
                <span className="error-message">{errors['emergencyContact.name']}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="emergencyPhone">Nödkontaktens telefon *</label>
              <input
                type="tel"
                id="emergencyPhone"
                value={formData.emergencyContact?.phone || ''}
                onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                className={errors['emergencyContact.phone'] ? 'error' : ''}
                placeholder="070-123 45 67"
              />
              {errors['emergencyContact.phone'] && (
                <span className="error-message">{errors['emergencyContact.phone']}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="emergencyRelation">Relation *</label>
              <select
                id="emergencyRelation"
                value={formData.emergencyContact?.relation || ''}
                onChange={(e) => handleInputChange('emergencyContact.relation', e.target.value)}
                className={errors['emergencyContact.relation'] ? 'error' : ''}
              >
                <option value="">Välj relation</option>
                {relations.map(rel => (
                  <option key={rel} value={rel}>{rel}</option>
                ))}
              </select>
              {errors['emergencyContact.relation'] && (
                <span className="error-message">{errors['emergencyContact.relation']}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="previousClubs">Tidigare klubbar</label>
              <input
                type="text"
                id="previousClubs"
                value={formData.previousClubs?.join(', ') || ''}
                onChange={(e) => handleInputChange('previousClubs', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="Separera med komma: AIK, Djurgården..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
  <Modal isOpen={isOpen} onClose={onClose} title="" size="lg" className={styles.authModal ?? ''}>
      <div className={styles.authFormContainer}>
        {/* Header */}
        <div className={styles.authFormHeader}>
          <div className={styles.authLogo}>🏒</div>
          <h2 className={styles.authTitle}>Välkommen till FBC Nyköping!</h2>
          <p className={styles.authSubtitle}>Skapa ditt konto i bara några enkla steg</p>
        </div>

        {/* Progress Indicator */}
        <div className={styles.progressIndicator}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} data-width={Math.round((currentStep / 3) * 100)}></div>
          </div>
          <div className={styles.stepIndicators}>
            {[1, 2, 3].map(step => (
              <div 
                key={step} 
                className={`${styles.stepIndicator} ${currentStep === step ? styles.active : ''} ${currentStep > step ? styles.completed : ''}`}
              >
                <div className={styles.stepCircle}>
                  {currentStep > step ? '✓' : step}
                </div>
                <span className={styles.stepLabel}>
                  {step === 1 ? 'Grundinfo' : step === 2 ? 'Spelinfo' : 'Nödkontakt'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {renderStep()}

        <div className={styles.formActions}>
          {currentStep > 1 && (
            <button 
              type="button" 
              onClick={handlePrevious}
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              Föregående
            </button>
          )}
          
          {currentStep < 3 ? (
            <LoadingButton
              onClick={handleNext}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Nästa
            </LoadingButton>
          ) : (
            <LoadingButton
              onClick={handleSubmit}
              loading={isLoading}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Registrera
            </LoadingButton>
          )}
        </div>

        <div className={styles.registrationInfo}>
          <p>
            När du registrerar dig kommer din ansökan att granskas av en ledare. 
            Du får tillgång till appen när din ansökan godkänts.
          </p>
        </div>
      </div>
    </Modal>
  );
};
