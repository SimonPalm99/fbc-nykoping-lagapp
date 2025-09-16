import React, { useState } from "react";
import { Activity } from "../../types/activity";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { LoadingButton } from "../ui/LoadingButton";

interface Props {
  initial?: Partial<Activity>;
  onSave: (activity: Activity) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit' | 'copy';
}

const activityTypes = [
  { value: 'träning', label: 'Träning', icon: '🏒', color: '#22c55e' },
  { value: 'match', label: 'Match', icon: '⚽', color: '#ef4444' },
  { value: 'cup', label: 'Cup/Turnering', icon: '🏆', color: '#f59e0b' },
  { value: 'lagfest', label: 'Lagfest', icon: '🎉', color: '#8b5cf6' },
  { value: 'möte', label: 'Möte', icon: '👥', color: '#3b82f6' },
  { value: 'annat', label: 'Annat', icon: '📅', color: '#6b7280' }
];

const predefinedTags = [
  'teknik', 'kondition', 'taktik', 'powerplay', 'boxplay', 
  'målvakt', 'skott', 'passning', 'derby', 'final',
  'playoff', 'hemmamatch', 'bortamatch', 'träningsmatch'
];

const activityColors = [
  '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', 
  '#3b82f6', '#06b6d4', '#f97316', '#10b981'
];

const ActivityForm: React.FC<Props> = ({ 
  initial = {}, 
  onSave, 
  onCancel,
  mode = 'create'
}) => {
  const { user, isLeader } = useAuth();
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState<Partial<Activity>>(() => {
    const baseData: Partial<Activity> = {
      title: '',
      type: 'träning',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      important: false,
      tags: [],
      color: '#22c55e',
      absenceDeadline: '',
      mapUrl: '',
      ...initial
    };

    // Om det är copy-läge, ta bort ID och justera datum
    if (mode === 'copy') {
      delete baseData.id;
      baseData.title = initial.title ? `Kopia av ${initial.title}` : '';
      baseData.date = '';
      baseData.participants = [];
    }

    return baseData;
  });

  const [customTag, setCustomTag] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Rensa fel för detta fält
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
    setCustomTag('');
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Titel krävs';
    }

    if (!formData.date) {
      newErrors.date = 'Datum krävs';
    }

    if (!formData.location?.trim()) {
      newErrors.location = 'Plats krävs';
    }

    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        newErrors.endTime = 'Sluttid måste vara efter starttid';
      }
    }

    if (formData.absenceDeadline && formData.date) {
      const deadline = new Date(formData.absenceDeadline);
      const activityDate = new Date(formData.date);
      if (deadline >= activityDate) {
        newErrors.absenceDeadline = 'Deadline måste vara före aktivitetsdatum';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const activityData: Activity = {
        id: formData.id || `activity_${Date.now()}`,
        title: formData.title!,
        type: formData.type!,
        date: formData.date!,
        location: formData.location!,
        important: formData.important || false,
        tags: formData.tags || [],
        color: formData.color || '#22c55e',
        createdBy: user?.id || 'unknown',
        participants: formData.participants || [],
        comments: formData.comments || []
      };

      // Lägg till optional properties bara om de har värden
      if (formData.startTime) {
        activityData.startTime = formData.startTime;
      }
      if (formData.endTime) {
        activityData.endTime = formData.endTime;
      }
      if (formData.description) {
        activityData.description = formData.description;
      }
      if (formData.absenceDeadline) {
        activityData.absenceDeadline = formData.absenceDeadline;
      }
      if (formData.mapUrl) {
        activityData.mapUrl = formData.mapUrl;
      }
      if (formData.maxParticipants) {
        activityData.maxParticipants = formData.maxParticipants;
      }

      onSave(activityData);
    } catch (error) {
      setErrors({ general: 'Misslyckades med att spara aktiviteten' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLeader && mode !== 'copy') {
    return (
      <div className={`activity-form-unauthorized ${isDark ? 'dark' : ''}`}>
        <div className="unauthorized-icon">🔒</div>
        <h3>
          Endast ledare kan {mode === 'edit' ? 'redigera' : 'skapa'} aktiviteter
        </h3>
        <p>
          Kontakta en lagledare om du behöver {mode === 'edit' ? 'ändra' : 'lägga till'} aktiviteter.
        </p>
      </div>
    );
  }

  return (
    <div className={`activity-form ${isDark ? 'dark' : ''}`}>
      {errors.general && (
        <div className="error-banner">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Grundläggande information */}
        <div className="form-section">
          <h3>{mode === 'create' ? 'Skapa ny aktivitet' : mode === 'edit' ? 'Redigera aktivitet' : 'Kopiera aktivitet'}</h3>
          
          <div className="form-group">
            <label htmlFor="title">Titel *</label>
            <input
              type="text"
              id="title"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'error' : ''}
              placeholder="ex. Träning - Teknik & Kondition"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="type">Typ av aktivitet *</label>
            <div className="activity-type-grid">
              {activityTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  className={`type-button ${formData.type === type.value ? 'active' : ''}`}
                  onClick={() => {
                    handleInputChange('type', type.value);
                    handleInputChange('color', type.color);
                  }}
                  style={{
                    borderColor: formData.type === type.value ? type.color : 'var(--border-color)',
                    background: formData.type === type.value ? type.color : 'transparent'
                  }}
                >
                  <span className="type-icon">{type.icon}</span>
                  <span className="type-label">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Datum *</label>
              <input
                type="date"
                id="date"
                value={formData.date || ''}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={errors.date ? 'error' : ''}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="startTime">Starttid</label>
              <input
                type="time"
                id="startTime"
                value={formData.startTime || ''}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">Sluttid</label>
              <input
                type="time"
                id="endTime"
                value={formData.endTime || ''}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className={errors.endTime ? 'error' : ''}
              />
              {errors.endTime && <span className="error-message">{errors.endTime}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Plats *</label>
            <input
              type="text"
              id="location"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={errors.location ? 'error' : ''}
              placeholder="ex. Rosvalla Ishall"
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mapUrl">Länk till karta (valfritt)</label>
            <input
              type="url"
              id="mapUrl"
              value={formData.mapUrl || ''}
              onChange={(e) => handleInputChange('mapUrl', e.target.value)}
              placeholder="https://maps.google.com/..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Beskrivning</label>
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Beskriv vad som kommer att hända under aktiviteten..."
              rows={3}
            />
          </div>
        </div>

        {/* Avancerade inställningar */}
        <div className="form-section">
          <h4>Avancerade inställningar</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="absenceDeadline">Deadline för frånvaroanmälan</label>
              <input
                type="datetime-local"
                id="absenceDeadline"
                value={formData.absenceDeadline || ''}
                onChange={(e) => handleInputChange('absenceDeadline', e.target.value)}
                className={errors.absenceDeadline ? 'error' : ''}
              />
              {errors.absenceDeadline && <span className="error-message">{errors.absenceDeadline}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="maxParticipants">Max antal deltagare (valfritt)</label>
              <input
                type="number"
                id="maxParticipants"
                value={formData.maxParticipants || ''}
                onChange={(e) => handleInputChange('maxParticipants', e.target.value ? Number(e.target.value) : undefined)}
                min="1"
                placeholder="Obegränsat"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.important || false}
                  onChange={(e) => handleInputChange('important', e.target.checked)}
                />
                <span>Markera som viktig aktivitet</span>
              </label>
            </div>
          </div>

          {/* Färgval */}
          <div className="form-group">
            <label>Färg för aktivitet</label>
            <div className="color-picker">
              {activityColors.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${formData.color === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleInputChange('color', color)}
                  title={`Välj färg ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Taggar/Etiketter */}
          <div className="form-group">
            <label>Taggar/Etiketter</label>
            
            <div className="current-tags">
              {formData.tags?.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => handleTagRemove(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="tag-input-section">
              <div className="predefined-tags">
                {predefinedTags
                  .filter(tag => !formData.tags?.includes(tag))
                  .slice(0, 8)
                  .map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className="predefined-tag"
                      onClick={() => handleTagAdd(tag)}
                    >
                      + {tag}
                    </button>
                  ))}
              </div>

              <div className="custom-tag-input">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Lägg till egen tagg..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTagAdd(customTag);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleTagAdd(customTag)}
                  disabled={!customTag.trim()}
                  className="btn btn-secondary btn-sm"
                >
                  Lägg till
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Formuläråtgärder */}
        <div className="form-actions">
          {onCancel && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Avbryt
            </button>
          )}
          
          <LoadingButton
            type="submit"
            loading={isLoading}
            className="btn btn-primary"
          >
            {mode === 'create' ? 'Skapa aktivitet' : mode === 'edit' ? 'Spara ändringar' : 'Skapa kopia'}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;