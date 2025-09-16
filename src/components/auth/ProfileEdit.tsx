import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, PersonalTrainingEntry } from '../../types/auth';
import { LoadingButton } from '../ui/LoadingButton';
import { Modal } from '../ui/Modal';



interface ProfileEditProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user, updateProfile, uploadProfilePicture, isLeader } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [_activeTab, _setActiveTab] = useState<'basic' | 'training' | 'privacy'>('basic');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || '',
    aboutMe: user?.aboutMe || '',
    favoritePosition: user?.favoritePosition || '',
    phone: user?.phone || '',
    jerseyNumber: user?.jerseyNumber || 0,
    previousClubs: user?.previousClubs || [],
    emergencyContact: user?.emergencyContact || {
      name: '',
      phone: '',
      relation: ''
    },
    notifications: user?.notifications || {
      activities: true,
      forum: true,
      statistics: true,
      fines: true
    },
    personalTrainingLog: user?.personalTrainingLog || []
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newTrainingEntry, setNewTrainingEntry] = useState<Partial<PersonalTrainingEntry>>({
    type: 'skills',
    feeling: 3,
    intensity: 3
  });

  // Training type options
  const trainingTypes = [
    { value: 'skills', label: 'Teknikträning' },
    { value: 'gym', label: 'Gym/Styrka' },
    { value: 'running', label: 'Löpning' },
    { value: 'recovery', label: 'Återhämtning' },
    { value: 'other', label: 'Annat' }
  ];

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

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent as string]: {
          ...(prev[parent as keyof User] as any),
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

  const handleNotificationChange = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      } as Required<User['notifications']>
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validera filtyp och storlek
    if (!file.type.startsWith('image/')) {
      setErrors({ image: 'Endast bildfiler är tillåtna' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setErrors({ image: 'Bilden får inte vara större än 5MB' });
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await uploadProfilePicture(file);
      if (imageUrl) {
        setFormData(prev => ({ ...prev, profilePicture: imageUrl }));
        setErrors(prev => ({ ...prev, image: '' }));
      }
    } catch (error) {
      setErrors({ image: 'Misslyckades med att ladda upp bilden' });
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Namn krävs';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const success = await updateProfile(formData);
      if (success) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      setErrors({ general: 'Misslyckades med att uppdatera profilen' });
    } finally {
      setIsLoading(false);
    }
  };

  // Training entry handlers
  const handleNewEntryChange = (field: string, value: any) => {
    setNewTrainingEntry(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTrainingEntry = () => {
    if (!newTrainingEntry.date || !newTrainingEntry.duration) {
      setErrors(prev => ({ ...prev, training: 'Datum och varaktighet krävs' }));
      return;
    }

    const entry: PersonalTrainingEntry = {
      id: Date.now().toString(),
      date: newTrainingEntry.date!,
      type: newTrainingEntry.type || 'skills',
      duration: newTrainingEntry.duration!,
      intensity: newTrainingEntry.intensity || 3,
      feeling: newTrainingEntry.feeling || 3
    };

    // Lägg till optional properties bara om de finns
    if (newTrainingEntry.notes) {
      entry.notes = newTrainingEntry.notes;
    }
    if (newTrainingEntry.stats) {
      entry.stats = newTrainingEntry.stats;
    }

    setFormData(prev => ({
      ...prev,
      personalTrainingLog: [...(prev.personalTrainingLog || []), entry]
    }));

    // Reset form
    setNewTrainingEntry({
      type: 'skills',
      feeling: 3,
      intensity: 3
    });

    setErrors(prev => ({ ...prev, training: '' }));
  };

  const handleDeleteEntry = (entryId: string) => {
    setFormData(prev => ({
      ...prev,
      personalTrainingLog: (prev.personalTrainingLog || []).filter(entry => entry.id !== entryId)
    }));
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Redigera profil" size="lg">
      <div className="profile-edit">
        {errors.general && (
          <div className="error-banner">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Profilbild */}
          <div className="profile-picture-section">
            <div className="current-picture">
              {formData.profilePicture || user.profilePicture ? (
                <img 
                  src={formData.profilePicture || user.profilePicture} 
                  alt="Profilbild"
                  className="profile-picture"
                />
              ) : (
                <div className="profile-picture-placeholder">
                  <span className="profile-initials">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>
            
            <div className="picture-actions">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <LoadingButton
                type="button"
                onClick={() => fileInputRef.current?.click()}
                loading={uploadingImage}
                className="btn btn-secondary btn-sm"
              >
                {uploadingImage ? 'Laddar upp...' : 'Byt bild'}
              </LoadingButton>
            </div>
            
            {errors.image && (
              <span className="error-message">{errors.image}</span>
            )}
          </div>

          {/* Grundläggande information */}
          <div className="form-section">
            <h3>Grundläggande information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Fullständigt namn *</label>
              <input
                type="text"
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="aboutMe">Om mig</label>
              <textarea
                id="aboutMe"
                value={formData.aboutMe || ''}
                onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                placeholder="Berätta om dig själv, dina mål och intressen..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefonnummer</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="070-123 45 67"
              />
            </div>
          </div>

          {/* Spelarinformation */}
          <div className="form-section">
            <h3>Spelarinformation</h3>
            
            <div className="form-group">
              <label htmlFor="favoritePosition">Favoritposition</label>
              <select
                id="favoritePosition"
                value={formData.favoritePosition || ''}
                onChange={(e) => handleInputChange('favoritePosition', e.target.value)}
              >
                <option value="">Välj position</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="jerseyNumber">Tröjnummer</label>
              <input
                type="number"
                id="jerseyNumber"
                value={formData.jerseyNumber || ''}
                onChange={(e) => handleInputChange('jerseyNumber', Number(e.target.value))}
                min="1"
                max="99"
              />
            </div>
          </div>

          {/* Tidigare klubbar */}
          <div className="form-section">
            <h3>Tidigare klubbar / spelarhistorik</h3>
            
            <div className="previous-clubs">
              {formData.previousClubs && formData.previousClubs.length > 0 ? (
                <ul className="clubs-list">
                  {formData.previousClubs.map((club, index) => (
                    <li key={index} className="club-entry">
                      <div className="club-info">
                        <strong>{club.name}</strong>
                        <span className="club-period">
                          {club.startYear} - {club.endYear || 'pågående'}
                        </span>
                        {club.division && (
                          <span className="club-division">({club.division})</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          const updatedClubs = formData.previousClubs?.filter((_, i) => i !== index) || [];
                          handleInputChange('previousClubs', updatedClubs);
                        }}
                      >
                        Ta bort
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-clubs">
                  Inga tidigare klubbar registrerade.
                </div>
              )}

              <div className="add-club-form">
                <h4>Lägg till tidigare klubb</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="clubName">Klubbnamn</label>
                    <input
                      type="text"
                      id="clubName"
                      placeholder="ex. Stockholm IBK"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="clubStartYear">Från år</label>
                    <input
                      type="number"
                      id="clubStartYear"
                      placeholder="2020"
                      min="1990"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="clubEndYear">Till år (valfritt)</label>
                    <input
                      type="number"
                      id="clubEndYear"
                      placeholder="2022"
                      min="1990"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="clubDivision">Division (valfritt)</label>
                    <input
                      type="text"
                      id="clubDivision"
                      placeholder="ex. Division 2"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const nameInput = document.getElementById('clubName') as HTMLInputElement;
                      const startYearInput = document.getElementById('clubStartYear') as HTMLInputElement;
                      const endYearInput = document.getElementById('clubEndYear') as HTMLInputElement;
                      const divisionInput = document.getElementById('clubDivision') as HTMLInputElement;
                      
                      if (nameInput.value && startYearInput.value) {
                        const newClub = {
                          name: nameInput.value,
                          startYear: Number(startYearInput.value),
                          endYear: endYearInput.value ? Number(endYearInput.value) : undefined,
                          division: divisionInput.value || undefined
                        };
                        
                        const updatedClubs = [...(formData.previousClubs || []), newClub];
                        handleInputChange('previousClubs', updatedClubs);
                        
                        // Reset form
                        nameInput.value = '';
                        startYearInput.value = '';
                        endYearInput.value = '';
                        divisionInput.value = '';
                      }
                    }}
                  >
                    Lägg till klubb
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Badges och milstolpar */}
          <div className="form-section">
            <h3>Badges och milstolpar</h3>
            
            <div className="badges-display">
              {user.badges && user.badges.length > 0 ? (
                <div className="badges-grid">
                  {user.badges.map((badge) => (
                    <div key={badge.id} className="badge-item">
                      <div className="badge-icon">{badge.icon}</div>
                      <div className="badge-info">
                        <div className="badge-name">{badge.name}</div>
                        <div className="badge-description">{badge.description}</div>
                        <div className="badge-earned">
                          Erhållen: {new Date(badge.earnedDate).toLocaleDateString('sv-SE')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-badges">
                  <p>🏆 Inga badges ännu!</p>
                  <p>Träna flitigt för att tjäna dina första utmärkelser:</p>
                  <ul className="badge-goals">
                    <li>🥇 Första träningsmålaren (10 träningar)</li>
                    <li>🔥 Träningsmaskin (50 träningar)</li>
                    <li>🏒 Första målet</li>
                    <li>🎯 Skarpskyttet (10 mål)</li>
                    <li>⚡ MVP av veckan</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Milstolpe-framsteg */}
            <div className="milestones-progress">
              <h4>Kommande milstolpar</h4>
              <div className="milestone-items">
                <div className="milestone-item">
                  <div className="milestone-info">
                    <span className="milestone-name">Träningscenturion</span>
                    <span className="milestone-desc">100 träningar genomförda</span>
                  </div>
                  <div className="milestone-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min((user.trainingCount || 0) / 100 * 100, 100)}%` }}
                      />
                    </div>
                    <span className="progress-text">
                      {user.trainingCount || 0}/100
                    </span>
                  </div>
                </div>

                <div className="milestone-item">
                  <div className="milestone-info">
                    <span className="milestone-name">Poängkung</span>
                    <span className="milestone-desc">25 poäng i säsong</span>
                  </div>
                  <div className="milestone-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min((user.seasonPoints || 0) / 25 * 100, 100)}%` }}
                      />
                    </div>
                    <span className="progress-text">
                      {user.seasonPoints || 0}/25
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ICE-kontakt (endast synligt för ledare eller användaren själv) */}
          <div className="form-section">
              <h3>
                Nödkontakt (ICE - In Case of Emergency)
                {!isLeader && <span className="privacy-note"> - Endast synligt för ledare</span>}
              </h3>
              
              <div className="form-group">
                <label htmlFor="emergencyName">Kontaktpersonens namn *</label>
                <input
                  type="text"
                  id="emergencyName"
                  value={formData.emergencyContact?.name || ''}
                  onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                  placeholder="ex. Anna Andersson"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergencyPhone">Telefonnummer *</label>
                <input
                  type="tel"
                  id="emergencyPhone"
                  value={formData.emergencyContact?.phone || ''}
                  onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                  placeholder="070-123 45 67"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergencyRelation">Relation *</label>
                <select
                  id="emergencyRelation"
                  value={formData.emergencyContact?.relation || ''}
                  onChange={(e) => handleInputChange('emergencyContact.relation', e.target.value)}
                >
                  <option value="">Välj relation</option>
                  {relations.map((relation) => (
                    <option key={relation} value={relation}>
                      {relation}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          {/* Notifieringsinställningar */}
          <div className="form-section">
            <h3>Notifieringar</h3>
            <p className="section-description">
              Välj vilka typer av notifieringar du vill få.
            </p>
            
            <div className="notification-settings">
              <div className="notification-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.notifications?.activities || false}
                    onChange={(e) => handleNotificationChange('activities', e.target.checked)}
                  />
                  <span>Aktiviteter och träningar</span>
                </label>
              </div>

              <div className="notification-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.notifications?.forum || false}
                    onChange={(e) => handleNotificationChange('forum', e.target.checked)}
                  />
                  <span>Forum och diskussioner</span>
                </label>
              </div>

              <div className="notification-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.notifications?.statistics || false}
                    onChange={(e) => handleNotificationChange('statistics', e.target.checked)}
                  />
                  <span>Statistik och prestationer</span>
                </label>
              </div>

              <div className="notification-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.notifications?.fines || false}
                    onChange={(e) => handleNotificationChange('fines', e.target.checked)}
                  />
                  <span>Böter och avgifter</span>
                </label>
              </div>
            </div>
          </div>

          {/* Träningsdagbok (endast för användaren själv) */}
          {user.id === user.id && (
            <div className="form-section">
              <h3>Träningsdagbok</h3>
              
              <div className="training-log">
                {formData.personalTrainingLog && formData.personalTrainingLog.length > 0 ? (
                  <ul className="training-entry-list">
                    {formData.personalTrainingLog.map((entry, _index) => (
                      <li key={entry.id} className="training-entry">
                        <div className="entry-details">
                          <div className="entry-date">
                            {new Date(entry.date).toLocaleDateString('sv-SE', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </div>
                          
                          <div className="entry-type">
                            Typ: {trainingTypes.find(t => t.value === entry.type)?.label || entry.type}
                          </div>
                          
                          <div className="entry-feeling">
                            Känsla: {entry.feeling}/5
                          </div>

                          <div className="entry-duration">
                            Varaktighet: {entry.duration} min
                          </div>

                          <div className="entry-intensity">
                            Intensitet: {entry.intensity}/5
                          </div>
                        </div>

                        {entry.notes && (
                          <div className="entry-notes">
                            <strong>Anteckningar:</strong> {entry.notes}
                          </div>
                        )}

                        <div className="entry-stats">
                          {entry.stats && (
                            <div className="stats-details">
                              {entry.stats.goals !== undefined && (
                                <div className="stat-item">
                                  <strong>Mål:</strong> {entry.stats.goals}
                                </div>
                              )}

                              {entry.stats.assists !== undefined && (
                                <div className="stat-item">
                                  <strong>Assist:</strong> {entry.stats.assists}
                                </div>
                              )}

                              {entry.stats.shots !== undefined && (
                                <div className="stat-item">
                                  <strong>Skott:</strong> {entry.stats.shots}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="entry-actions">
                          <button 
                            type="button" 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteEntry(entry.id)}
                          >
                            Ta bort
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-entries">
                    Ingen träningsdata hittades. Lägg till en ny post!
                  </div>
                )}

                <div className="new-entry-form">
                  <h4>Lägg till ny träningspost</h4>
                  
                  <div className="form-group">
                    <label htmlFor="trainingDate">Datum</label>
                    <input
                      type="date"
                      id="trainingDate"
                      value={newTrainingEntry.date?.split('T')[0] || ''}
                      onChange={(e) => handleNewEntryChange('date', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="trainingFeeling">Känsla (1-5)</label>
                    <input
                      type="number"
                      id="trainingFeeling"
                      value={newTrainingEntry.feeling || ''}
                      onChange={(e) => handleNewEntryChange('feeling', Number(e.target.value))}
                      min="1"
                      max="5"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="trainingDuration">Duration (min)</label>
                    <input
                      type="number"
                      id="trainingDuration"
                      value={newTrainingEntry.duration || ''}
                      onChange={(e) => handleNewEntryChange('duration', Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="trainingIntensity">Intensitet (1-5)</label>
                    <input
                      type="number"
                      id="trainingIntensity"
                      value={newTrainingEntry.intensity || ''}
                      onChange={(e) => handleNewEntryChange('intensity', Number(e.target.value))}
                      min="1"
                      max="5"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="trainingSkills">Fokusområden</label>
                    <input
                      type="text"
                      id="trainingSkills"
                      value={newTrainingEntry.skills?.join(', ') || ''}
                      onChange={(e) => handleNewEntryChange('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      placeholder="Separera med komma: Dribbling, Skott..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="trainingNote">Anteckning</label>
                    <textarea
                      id="trainingNote"
                      value={newTrainingEntry.notes || ''}
                      onChange={(e) => handleNewEntryChange('notes', e.target.value)}
                      placeholder="Eventuella anteckningar om träningen..."
                      rows={2}
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setNewTrainingEntry({})}
                    >
                      Avbryt
                    </button>
                    
                    <LoadingButton
                      type="button"
                      loading={isLoading}
                      className="btn btn-primary"
                      onClick={handleAddTrainingEntry}
                    >
                      Lägg till post
                    </LoadingButton>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
            >
              Avbryt
            </button>
            
            <LoadingButton
              type="submit"
              loading={isLoading}
              className="btn btn-primary"
            >
              Spara ändringar
            </LoadingButton>
          </div>
        </form>
      </div>
    </Modal>
  );
};
