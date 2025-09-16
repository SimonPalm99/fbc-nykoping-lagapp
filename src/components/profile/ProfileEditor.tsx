import React, { useState } from 'react';
import { User } from '../../types/user';
import './ProfileEditor.css';

interface ProfileEditorProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, onSave, onCancel }) => {
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const [activeSection, setActiveSection] = useState<'basic' | 'contact' | 'social' | 'preferences'>('basic');
  const [avatarPreview, setAvatarPreview] = useState<string>(user.profileImageUrl);

  const handleInputChange = (field: string, value: any) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setEditedUser(prev => {
      const parentObj = prev[parent as keyof User] as any;
      return {
        ...prev,
        [parent]: {
          ...parentObj,
          [field]: value
        }
      };
    });
  };

  const handleIceContactChange = (index: number, field: string, value: any) => {
    const updatedContacts = [...editedUser.iceContacts];
    const existingContact = updatedContacts[index];
    if (existingContact) {
      updatedContacts[index] = {
        ...existingContact,
        [field]: value
      };
      setEditedUser(prev => ({
        ...prev,
        iceContacts: updatedContacts
      }));
    }
  };

  const addIceContact = () => {
    setEditedUser(prev => ({
      ...prev,
      iceContacts: [
        ...prev.iceContacts,
        {
          name: '',
          phone: '',
          relation: '',
          isPrimary: false
        }
      ]
    }));
  };

  const removeIceContact = (index: number) => {
    setEditedUser(prev => ({
      ...prev,
      iceContacts: prev.iceContacts.filter((_, i) => i !== index)
    }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        handleInputChange('profileImageUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Validering
    if (!editedUser.name.trim()) {
      alert('Namn är obligatoriskt');
      return;
    }
    if (!editedUser.email.trim()) {
      alert('E-post är obligatoriskt');
      return;
    }
    if (editedUser.jerseyNumber < 1 || editedUser.jerseyNumber > 99) {
      alert('Tröjnummer måste vara mellan 1-99');
      return;
    }

    onSave(editedUser);
  };

  const positions = [
    'Målvakt',
    'Forward',
    'Back',
    'Mittfältare',
    'Center',
    'Anfallare',
    'Försvarare',
    'Tränare',
    'Assisterande tränare',
    'Materialare'
  ];

  const relations = [
    'Mamma',
    'Pappa',
    'Vårdnadshavare',
    'Syster',
    'Bror',
    'Mormor',
    'Morfar',
    'Farmor',
    'Farfar',
    'Partner',
    'Vän',
    'Annan'
  ];

  return (
    <div className="profile-editor">
      <div className="editor-header">
        <h2>Redigera profil</h2>
        <div className="editor-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Avbryt
          </button>
          <button className="save-btn" onClick={handleSave}>
            Spara ändringar
          </button>
        </div>
      </div>

      <div className="editor-nav">
        <button
          className={`nav-btn ${activeSection === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveSection('basic')}
        >
          Grundläggande
        </button>
        <button
          className={`nav-btn ${activeSection === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveSection('contact')}
        >
          Kontakt & Nöd
        </button>
        <button
          className={`nav-btn ${activeSection === 'social' ? 'active' : ''}`}
          onClick={() => setActiveSection('social')}
        >
          Sociala medier
        </button>
        <button
          className={`nav-btn ${activeSection === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveSection('preferences')}
        >
          Inställningar
        </button>
      </div>

      <div className="editor-content">
        {activeSection === 'basic' && (
          <div className="basic-section">
            <div className="avatar-section">
              <h3>Profilbild</h3>
              <div className="avatar-editor">
                <div className="avatar-preview">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profil" />
                  ) : (
                    <div className="avatar-placeholder">
                      {editedUser.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <div className="avatar-actions">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="avatar-upload" className="upload-btn">
                    Välj bild
                  </label>
                  {avatarPreview && (
                    <button
                      className="remove-btn"
                      onClick={() => {
                        setAvatarPreview('');
                        handleInputChange('profileImageUrl', '');
                      }}
                    >
                      Ta bort
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Namn *</label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Förnamn Efternamn"
                />
              </div>

              <div className="form-group">
                <label>E-post *</label>
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="exempel@email.com"
                />
              </div>

              <div className="form-group">
                <label>Tröjnummer *</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={editedUser.jerseyNumber}
                  onChange={(e) => handleInputChange('jerseyNumber', parseInt(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Favoritposition</label>
                <select
                  value={editedUser.favoritePosition}
                  onChange={(e) => handleInputChange('favoritePosition', e.target.value)}
                >
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Födelsedatum</label>
                <input
                  type="date"
                  value={editedUser.birthday}
                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Telefonnummer</label>
                <input
                  type="tel"
                  value={editedUser.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="070-123 45 67"
                />
              </div>

              <div className="form-group full-width">
                <label>Adress</label>
                <input
                  type="text"
                  value={editedUser.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Gatunamn 123, 12345 Stad"
                />
              </div>

              <div className="form-group full-width">
                <label>Om mig</label>
                <textarea
                  value={editedUser.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  placeholder="Berätta lite om dig själv, din innebandykarriär, intressen..."
                  rows={4}
                />
              </div>

              <div className="form-group full-width">
                <label>Medicinsk information (nödfall)</label>
                <textarea
                  value={editedUser.emergencyMedicalInfo || ''}
                  onChange={(e) => handleInputChange('emergencyMedicalInfo', e.target.value)}
                  placeholder="Allergier, mediciner, eller annan viktig medicinsk information..."
                  rows={3}
                />
                <small>Endast synligt för ledare</small>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'contact' && (
          <div className="contact-section">
            <h3>Nödkontakter</h3>
            <p className="section-description">
              Dessa kontakter kan bara ses av ledare och används vid nödsituationer.
            </p>

            <div className="ice-contacts">
              {editedUser.iceContacts.map((contact, index) => (
                <div key={index} className="ice-contact-card">
                  <div className="contact-header">
                    <h4>Kontakt {index + 1}</h4>
                    <button
                      className="remove-contact-btn"
                      onClick={() => removeIceContact(index)}
                    >
                      ×
                    </button>
                  </div>

                  <div className="contact-form">
                    <div className="form-group">
                      <label>Namn</label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => handleIceContactChange(index, 'name', e.target.value)}
                        placeholder="Förnamn Efternamn"
                      />
                    </div>

                    <div className="form-group">
                      <label>Telefonnummer</label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => handleIceContactChange(index, 'phone', e.target.value)}
                        placeholder="070-123 45 67"
                      />
                    </div>

                    <div className="form-group">
                      <label>Relation</label>
                      <select
                        value={contact.relation}
                        onChange={(e) => handleIceContactChange(index, 'relation', e.target.value)}
                      >
                        <option value="">Välj relation</option>
                        {relations.map(rel => (
                          <option key={rel} value={rel}>{rel}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={contact.isPrimary}
                          onChange={(e) => {
                            // Om denna markeras som primär, avmarkera alla andra
                            if (e.target.checked) {
                              const updatedContacts = editedUser.iceContacts.map((c, i) => ({
                                ...c,
                                isPrimary: i === index
                              }));
                              setEditedUser(prev => ({
                                ...prev,
                                iceContacts: updatedContacts
                              }));
                            } else {
                              handleIceContactChange(index, 'isPrimary', false);
                            }
                          }}
                        />
                        Primär kontakt
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              <button className="add-contact-btn" onClick={addIceContact}>
                + Lägg till nödkontakt
              </button>
            </div>
          </div>
        )}

        {activeSection === 'social' && (
          <div className="social-section">
            <h3>Sociala medier</h3>
            <p className="section-description">
              Frivilligt att fylla i. Visas på din profil om du har aktiverat offentlig profil.
            </p>

            <div className="form-grid">
              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="text"
                  value={editedUser.socialMedia?.instagram || ''}
                  onChange={(e) => handleNestedInputChange('socialMedia', 'instagram', e.target.value)}
                  placeholder="@dittanvändarnamn"
                />
              </div>

              <div className="form-group">
                <label>Facebook</label>
                <input
                  type="text"
                  value={editedUser.socialMedia?.facebook || ''}
                  onChange={(e) => handleNestedInputChange('socialMedia', 'facebook', e.target.value)}
                  placeholder="Ditt namn på Facebook"
                />
              </div>

              <div className="form-group">
                <label>Twitter/X</label>
                <input
                  type="text"
                  value={editedUser.socialMedia?.twitter || ''}
                  onChange={(e) => handleNestedInputChange('socialMedia', 'twitter', e.target.value)}
                  placeholder="@dittanvändarnamn"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'preferences' && (
          <div className="preferences-section">
            <h3>Inställningar</h3>

            <div className="preferences-grid">
              <div className="preference-group">
                <h4>Notifikationer</h4>
                <label className="switch-label">
                  <input
                    type="checkbox"
                    checked={editedUser.preferences.notifications}
                    onChange={(e) => handleNestedInputChange('preferences', 'notifications', e.target.checked)}
                  />
                  <span className="switch"></span>
                  Push-notifikationer
                </label>
              </div>

              <div className="preference-group">
                <h4>Integritet</h4>
                <label className="switch-label">
                  <input
                    type="checkbox"
                    checked={editedUser.preferences.publicProfile}
                    onChange={(e) => handleNestedInputChange('preferences', 'publicProfile', e.target.checked)}
                  />
                  <span className="switch"></span>
                  Offentlig profil
                </label>
                <small>Låter andra spelare se din profil och statistik</small>

                <label className="switch-label">
                  <input
                    type="checkbox"
                    checked={editedUser.preferences.showStats}
                    onChange={(e) => handleNestedInputChange('preferences', 'showStats', e.target.checked)}
                  />
                  <span className="switch"></span>
                  Visa statistik offentligt
                </label>

                <label className="switch-label">
                  <input
                    type="checkbox"
                    checked={editedUser.preferences.shareLocation}
                    onChange={(e) => handleNestedInputChange('preferences', 'shareLocation', e.target.checked)}
                  />
                  <span className="switch"></span>
                  Dela plats för samåkning
                </label>
              </div>

              <div className="preference-group">
                <h4>Språk</h4>
                <select
                  value={editedUser.preferences.language}
                  onChange={(e) => handleNestedInputChange('preferences', 'language', e.target.value)}
                >
                  <option value="sv">Svenska</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="preference-group">
                <h4>Tema</h4>
                <select
                  value={editedUser.preferences.theme}
                  onChange={(e) => handleNestedInputChange('preferences', 'theme', e.target.value)}
                >
                  <option value="auto">Automatiskt</option>
                  <option value="light">Ljust</option>
                  <option value="dark">Mörkt</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileEditor;
