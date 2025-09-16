import React, { useState, useEffect } from 'react';
import { HealthProfile, EmergencyContact, MedicalCondition } from '../../types/health';
import './HealthProfileManager.css';

interface HealthProfileManagerProps {
  userId: string;
  onUpdate?: (profile: HealthProfile) => void;
}

export const HealthProfileManager: React.FC<HealthProfileManagerProps> = ({ 
  userId, 
  onUpdate 
}) => {
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Mock data för demonstration
  useEffect(() => {
    const mockProfile: HealthProfile = {
      id: `profile-${userId}`,
      playerId: userId,
      bloodType: 'A+',
      allergies: ['Pollen', 'Jordnötter'],
      medications: [
        {
          name: 'Cetirizin',
          dosage: '10mg',
          frequency: 'Dagligen',
          prescribedBy: 'Dr. Andersson',
          startDate: new Date('2024-01-15'),
          notes: 'För allergi'
        }
      ],
      medicalConditions: [
        {
          condition: 'Astma',
          severity: 'mild',
          diagnosedDate: new Date('2020-03-10'),
          status: 'controlled',
          notes: 'Ansträngningsutlöst, kontrollerad med medicin',
          treatment: 'Inhalator vid behov'
        }
      ],
      emergencyContacts: [
        {
          name: 'Anna Svensson',
          relationship: 'Mamma',
          phone: '070-123 45 67',
          email: 'anna.svensson@example.com',
          isPrimary: true
        },
        {
          name: 'Lars Svensson',
          relationship: 'Pappa',
          phone: '070-987 65 43',
          email: 'lars.svensson@example.com',
          isPrimary: false
        }
      ],
      doctorInfo: {
        name: 'Dr. Maria Andersson',
        clinic: 'Vårdcentralen Nyköping',
        phone: '0155-123 456',
        email: 'maria.andersson@vgr.se'
      },
      insuranceInfo: {
        provider: 'Folksam',
        policyNumber: 'FS-123456789',
        expirationDate: new Date('2024-12-31')
      },
      lastUpdated: new Date(),
      createdAt: new Date('2024-01-01')
    };

    setProfile(mockProfile);
  }, [userId]);

  const updateProfile = (updates: Partial<HealthProfile>) => {
    if (profile) {
      const updatedProfile = {
        ...profile,
        ...updates,
        lastUpdated: new Date()
      };
      setProfile(updatedProfile);
      onUpdate?.(updatedProfile);
    }
  };

  const addMedication = (medication: HealthProfile['medications'][0]) => {
    if (profile) {
      updateProfile({
        medications: [...profile.medications, medication]
      });
    }
  };

  const removeMedication = (index: number) => {
    if (profile) {
      updateProfile({
        medications: profile.medications.filter((_, i) => i !== index)
      });
    }
  };

  const addMedicalCondition = (condition: MedicalCondition) => {
    if (profile) {
      updateProfile({
        medicalConditions: [...profile.medicalConditions, condition]
      });
    }
  };

  const removeMedicalCondition = (index: number) => {
    if (profile) {
      updateProfile({
        medicalConditions: profile.medicalConditions.filter((_, i) => i !== index)
      });
    }
  };

  const addEmergencyContact = (contact: EmergencyContact) => {
    if (profile) {
      updateProfile({
        emergencyContacts: [...profile.emergencyContacts, contact]
      });
    }
  };

  const removeEmergencyContact = (index: number) => {
    if (profile) {
      updateProfile({
        emergencyContacts: profile.emergencyContacts.filter((_, i) => i !== index)
      });
    }
  };

  const addAllergy = (allergy: string) => {
    if (profile && allergy.trim() && !profile.allergies.includes(allergy.trim())) {
      updateProfile({
        allergies: [...profile.allergies, allergy.trim()]
      });
    }
  };

  const removeAllergy = (allergy: string) => {
    if (profile) {
      updateProfile({
        allergies: profile.allergies.filter(a => a !== allergy)
      });
    }
  };

  if (!profile) {
    return <div className="loading">Laddar hälsoprofil...</div>;
  }

  return (
    <div className="health-profile-manager">
      <div className="profile-header">
        <h3>Hälsoprofil</h3>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Visa' : 'Redigera'}
          </button>
        </div>
      </div>

      <div className="profile-sections">
        {/* Grundläggande information */}
        <div className="profile-section">
          <div className="section-header">
            <h4>Grundläggande information</h4>
            {isEditing && (
              <button
                className="btn-edit"
                onClick={() => setEditingSection(
                  editingSection === 'basic' ? null : 'basic'
                )}
              >
                {editingSection === 'basic' ? '✓' : '✏️'}
              </button>
            )}
          </div>

          <div className="section-content">
            {editingSection === 'basic' ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Blodgrupp</label>
                  <select
                    value={profile.bloodType || ''}
                    onChange={(e) => updateProfile({ bloodType: e.target.value })}
                  >
                    <option value="">Välj blodgrupp</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="info-grid">
                <div className="info-item">
                  <label>Blodgrupp</label>
                  <span>{profile.bloodType || 'Ej angivet'}</span>
                </div>
                <div className="info-item">
                  <label>Senast uppdaterad</label>
                  <span>{profile.lastUpdated.toLocaleDateString('sv-SE')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Allergier */}
        <div className="profile-section">
          <div className="section-header">
            <h4>Allergier</h4>
            {isEditing && (
              <button
                className="btn-edit"
                onClick={() => setEditingSection(
                  editingSection === 'allergies' ? null : 'allergies'
                )}
              >
                {editingSection === 'allergies' ? '✓' : '✏️'}
              </button>
            )}
          </div>

          <div className="section-content">
            <div className="allergies-list">
              {profile.allergies.map((allergy, index) => (
                <div key={index} className="allergy-tag">
                  <span>{allergy}</span>
                  {isEditing && (
                    <button
                      className="btn-remove-tag"
                      onClick={() => removeAllergy(allergy)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {editingSection === 'allergies' && (
              <div className="add-allergy">
                <input
                  type="text"
                  placeholder="Lägg till allergi..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addAllergy(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Mediciner */}
        <div className="profile-section">
          <div className="section-header">
            <h4>Aktuella mediciner</h4>
            {isEditing && (
              <button
                className="btn-edit"
                onClick={() => setEditingSection(
                  editingSection === 'medications' ? null : 'medications'
                )}
              >
                {editingSection === 'medications' ? '✓' : '+ Medicin'}
              </button>
            )}
          </div>

          <div className="section-content">
            <div className="medications-list">
              {profile.medications.map((medication, index) => (
                <div key={index} className="medication-card">
                  <div className="medication-header">
                    <h5>{medication.name}</h5>
                    {isEditing && (
                      <button
                        className="btn-remove"
                        onClick={() => removeMedication(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  <div className="medication-details">
                    <div className="detail-item">
                      <label>Dos:</label>
                      <span>{medication.dosage}</span>
                    </div>
                    <div className="detail-item">
                      <label>Frekvens:</label>
                      <span>{medication.frequency}</span>
                    </div>
                    <div className="detail-item">
                      <label>Förskriven av:</label>
                      <span>{medication.prescribedBy}</span>
                    </div>
                    {medication.notes && (
                      <div className="detail-item">
                        <label>Anteckningar:</label>
                        <span>{medication.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {editingSection === 'medications' && (
              <AddMedicationForm onAdd={addMedication} />
            )}
          </div>
        </div>

        {/* Medicinska tillstånd */}
        <div className="profile-section">
          <div className="section-header">
            <h4>Medicinska tillstånd</h4>
            {isEditing && (
              <button
                className="btn-edit"
                onClick={() => setEditingSection(
                  editingSection === 'conditions' ? null : 'conditions'
                )}
              >
                {editingSection === 'conditions' ? '✓' : '+ Tillstånd'}
              </button>
            )}
          </div>

          <div className="section-content">
            <div className="conditions-list">
              {profile.medicalConditions.map((condition, index) => (
                <div key={index} className="condition-card">
                  <div className="condition-header">
                    <h5>{condition.condition}</h5>
                    <div className="condition-meta">
                      <span className={`severity ${condition.severity}`}>
                        {condition.severity}
                      </span>
                      <span className={`status ${condition.status}`}>
                        {condition.status}
                      </span>
                      {isEditing && (
                        <button
                          className="btn-remove"
                          onClick={() => removeMedicalCondition(index)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="condition-details">
                    <div className="detail-item">
                      <label>Diagnostiserad:</label>
                      <span>{condition.diagnosedDate?.toLocaleDateString('sv-SE')}</span>
                    </div>
                    {condition.treatment && (
                      <div className="detail-item">
                        <label>Behandling:</label>
                        <span>{condition.treatment}</span>
                      </div>
                    )}
                    {condition.notes && (
                      <div className="detail-item">
                        <label>Anteckningar:</label>
                        <span>{condition.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {editingSection === 'conditions' && (
              <AddConditionForm onAdd={addMedicalCondition} />
            )}
          </div>
        </div>

        {/* Nödkontakter */}
        <div className="profile-section">
          <div className="section-header">
            <h4>Nödkontakter</h4>
            {isEditing && (
              <button
                className="btn-edit"
                onClick={() => setEditingSection(
                  editingSection === 'emergency' ? null : 'emergency'
                )}
              >
                {editingSection === 'emergency' ? '✓' : '+ Kontakt'}
              </button>
            )}
          </div>

          <div className="section-content">
            <div className="contacts-list">
              {profile.emergencyContacts.map((contact, index) => (
                <div key={index} className="contact-card">
                  <div className="contact-header">
                    <div className="contact-name">
                      <h5>{contact.name}</h5>
                      {contact.isPrimary && (
                        <span className="primary-badge">Primär</span>
                      )}
                    </div>
                    {isEditing && (
                      <button
                        className="btn-remove"
                        onClick={() => removeEmergencyContact(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  <div className="contact-details">
                    <div className="detail-item">
                      <label>Relation:</label>
                      <span>{contact.relationship}</span>
                    </div>
                    <div className="detail-item">
                      <label>Telefon:</label>
                      <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                    </div>
                    {contact.email && (
                      <div className="detail-item">
                        <label>E-post:</label>
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {editingSection === 'emergency' && (
              <AddContactForm onAdd={addEmergencyContact} />
            )}
          </div>
        </div>

        {/* Läkar- och försäkringsinformation */}
        <div className="profile-section">
          <div className="section-header">
            <h4>Läkare & Försäkring</h4>
            {isEditing && (
              <button
                className="btn-edit"
                onClick={() => setEditingSection(
                  editingSection === 'medical-info' ? null : 'medical-info'
                )}
              >
                {editingSection === 'medical-info' ? '✓' : '✏️'}
              </button>
            )}
          </div>

          <div className="section-content">
            {editingSection === 'medical-info' ? (
              <div className="edit-form">
                <div className="form-section">
                  <h5>Läkarinformation</h5>
                  <div className="form-group">
                    <label>Läkarens namn</label>                  <input
                    type="text"
                    value={profile.doctorInfo?.name || ''}
                    onChange={(e) => updateProfile({
                      doctorInfo: {
                        name: e.target.value,
                        clinic: profile.doctorInfo?.clinic || '',
                        phone: profile.doctorInfo?.phone || '',
                        ...(profile.doctorInfo?.email && { email: profile.doctorInfo.email })
                      }
                    })}
                  />
                  </div>
                  <div className="form-group">
                    <label>Klinik/Vårdcentral</label>                  <input
                    type="text"
                    value={profile.doctorInfo?.clinic || ''}
                    onChange={(e) => updateProfile({
                      doctorInfo: {
                        name: profile.doctorInfo?.name || '',
                        clinic: e.target.value,
                        phone: profile.doctorInfo?.phone || '',
                        ...(profile.doctorInfo?.email && { email: profile.doctorInfo.email })
                      }
                    })}
                  />
                  </div>
                  <div className="form-group">
                    <label>Telefon</label>                  <input
                    type="tel"
                    value={profile.doctorInfo?.phone || ''}
                    onChange={(e) => updateProfile({
                      doctorInfo: {
                        name: profile.doctorInfo?.name || '',
                        clinic: profile.doctorInfo?.clinic || '',
                        phone: e.target.value,
                        ...(profile.doctorInfo?.email && { email: profile.doctorInfo.email })
                      }
                    })}
                  />
                  </div>
                </div>

                <div className="form-section">
                  <h5>Försäkringsinformation</h5>
                  <div className="form-group">
                    <label>Försäkringsbolag</label>                  <input
                    type="text"
                    value={profile.insuranceInfo?.provider || ''}
                    onChange={(e) => updateProfile({
                      insuranceInfo: {
                        provider: e.target.value,
                        policyNumber: profile.insuranceInfo?.policyNumber || '',
                        expirationDate: profile.insuranceInfo?.expirationDate || new Date()
                      }
                    })}
                  />
                  </div>
                  <div className="form-group">
                    <label>Försäkringsnummer</label>                  <input
                    type="text"
                    value={profile.insuranceInfo?.policyNumber || ''}
                    onChange={(e) => updateProfile({
                      insuranceInfo: {
                        provider: profile.insuranceInfo?.provider || '',
                        policyNumber: e.target.value,
                        expirationDate: profile.insuranceInfo?.expirationDate || new Date()
                      }
                    })}
                  />
                  </div>
                </div>
              </div>
            ) : (
              <div className="medical-info-display">
                <div className="info-section">
                  <h5>Läkare</h5>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Namn:</label>
                      <span>{profile.doctorInfo?.name || 'Ej angivet'}</span>
                    </div>
                    <div className="info-item">
                      <label>Klinik:</label>
                      <span>{profile.doctorInfo?.clinic || 'Ej angivet'}</span>
                    </div>
                    <div className="info-item">
                      <label>Telefon:</label>
                      <span>
                        {profile.doctorInfo?.phone ? (
                          <a href={`tel:${profile.doctorInfo.phone}`}>
                            {profile.doctorInfo.phone}
                          </a>
                        ) : 'Ej angivet'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h5>Försäkring</h5>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Bolag:</label>
                      <span>{profile.insuranceInfo?.provider || 'Ej angivet'}</span>
                    </div>
                    <div className="info-item">
                      <label>Nummer:</label>
                      <span>{profile.insuranceInfo?.policyNumber || 'Ej angivet'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
// Hjälpkomponenter för formulär
const AddMedicationForm: React.FC<{
  onAdd: (medication: any) => void;
}> = ({ onAdd }) => {
  const [medication, setMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    prescribedBy: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (medication.name && medication.dosage) {
      onAdd({
        ...medication,
        startDate: new Date()
      });
      setMedication({
        name: '',
        dosage: '',
        frequency: '',
        prescribedBy: '',
        notes: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <div className="form-row">
        <input
          type="text"
          placeholder="Medicinnamn"
          value={medication.name}
          onChange={(e) => setMedication(prev => ({ ...prev, name: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Dosering"
          value={medication.dosage}
          onChange={(e) => setMedication(prev => ({ ...prev, dosage: e.target.value }))}
          required
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          placeholder="Frekvens"
          value={medication.frequency}
          onChange={(e) => setMedication(prev => ({ ...prev, frequency: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Förskriven av"
          value={medication.prescribedBy}
          onChange={(e) => setMedication(prev => ({ ...prev, prescribedBy: e.target.value }))}
        />
      </div>
      <textarea
        placeholder="Anteckningar (valfritt)"
        value={medication.notes}
        onChange={(e) => setMedication(prev => ({ ...prev, notes: e.target.value }))}
        rows={2}
      />
      <button type="submit" className="btn btn-primary">
        Lägg till medicin
      </button>
    </form>
  );
};

const AddConditionForm: React.FC<{
  onAdd: (condition: MedicalCondition) => void;
}> = ({ onAdd }) => {
  const [condition, setCondition] = useState({
    condition: '',
    severity: 'mild' as 'mild' | 'moderate' | 'severe',
    status: 'active' as 'active' | 'controlled' | 'chronic',
    treatment: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (condition.condition) {
      onAdd({
        ...condition,
        diagnosedDate: new Date()
      });
      setCondition({
        condition: '',
        severity: 'mild',
        status: 'active',
        treatment: '',
        notes: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <input
        type="text"
        placeholder="Medicinskt tillstånd"
        value={condition.condition}
        onChange={(e) => setCondition(prev => ({ ...prev, condition: e.target.value }))}
        required
      />
      <div className="form-row">
        <select
          value={condition.severity}
          onChange={(e) => setCondition(prev => ({ 
            ...prev, 
            severity: e.target.value as any 
          }))}
        >
          <option value="mild">Mild</option>
          <option value="moderate">Måttlig</option>
          <option value="severe">Allvarlig</option>
        </select>
        <select
          value={condition.status}
          onChange={(e) => setCondition(prev => ({ 
            ...prev, 
            status: e.target.value as any 
          }))}
        >
          <option value="active">Aktiv</option>
          <option value="controlled">Kontrollerad</option>
          <option value="chronic">Kronisk</option>
        </select>
      </div>
      <input
        type="text"
        placeholder="Behandling (valfritt)"
        value={condition.treatment}
        onChange={(e) => setCondition(prev => ({ ...prev, treatment: e.target.value }))}
      />
      <textarea
        placeholder="Anteckningar (valfritt)"
        value={condition.notes}
        onChange={(e) => setCondition(prev => ({ ...prev, notes: e.target.value }))}
        rows={2}
      />
      <button type="submit" className="btn btn-primary">
        Lägg till tillstånd
      </button>
    </form>
  );
};

const AddContactForm: React.FC<{
  onAdd: (contact: EmergencyContact) => void;
}> = ({ onAdd }) => {
  const [contact, setContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    isPrimary: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contact.name && contact.phone) {
      onAdd(contact);
      setContact({
        name: '',
        relationship: '',
        phone: '',
        email: '',
        isPrimary: false
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <div className="form-row">
        <input
          type="text"
          placeholder="Namn"
          value={contact.name}
          onChange={(e) => setContact(prev => ({ ...prev, name: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Relation"
          value={contact.relationship}
          onChange={(e) => setContact(prev => ({ ...prev, relationship: e.target.value }))}
        />
      </div>
      <div className="form-row">
        <input
          type="tel"
          placeholder="Telefonnummer"
          value={contact.phone}
          onChange={(e) => setContact(prev => ({ ...prev, phone: e.target.value }))}
          required
        />
        <input
          type="email"
          placeholder="E-post (valfritt)"
          value={contact.email}
          onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))}
        />
      </div>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={contact.isPrimary}
          onChange={(e) => setContact(prev => ({ ...prev, isPrimary: e.target.checked }))}
        />
        Primär kontakt
      </label>
      <button type="submit" className="btn btn-primary">
        Lägg till kontakt
      </button>
    </form>
  );
};
