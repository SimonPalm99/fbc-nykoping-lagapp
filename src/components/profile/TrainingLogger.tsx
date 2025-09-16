import React, { useState, useCallback } from 'react';
import { TrainingLog } from '../../types/user';
import './TrainingLogger.css';

interface TrainingLoggerProps {
  onSave: (log: Omit<TrainingLog, 'id'>) => void;
  onCancel: () => void;
  existingLog?: TrainingLog; // För redigering
}

const TrainingLogger: React.FC<TrainingLoggerProps> = ({ onSave, onCancel, existingLog }) => {
  const [formData, setFormData] = useState({
    date: existingLog?.date || new Date().toISOString().split('T')[0],
    feeling: existingLog?.feeling || 3,
    note: existingLog?.note || '',
    duration: existingLog?.duration || 90,
    intensity: existingLog?.intensity || 3,
    skills: existingLog?.skills || [],
    stats: existingLog?.stats || {
      goals: 0,
      assists: 0,
      shots: 0
    }
  });

  const [customSkill, setCustomSkill] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'skills' | 'stats'>('basic');

  const predefinedSkills = [
    'Teknik', 'Skott', 'Passningar', 'Kondition', 'Styrka', 'Hastighet',
    'Balans', 'Koordination', 'Spelförståelse', 'Taktik', 'Defensiv', 'Offensiv',
    'Speluppbyggnad', 'Avslut', 'Reflexer', 'Positionering', 'Kommunikation',
    'Ledarskap', 'Mentalt', 'Återhämtning', 'Stretching', 'Mobilitet'
  ];

  const feelingLabels = {
    1: '😫 Mycket dåligt',
    2: '😞 Dåligt', 
    3: '😐 OK',
    4: '😊 Bra',
    5: '🤩 Fantastiskt'
  };

  const intensityLabels = {
    1: '🚶 Lätt',
    2: '🏃 Måttlig',
    3: '🏃‍♂️ Medel',
    4: '💪 Hård',
    5: '🔥 Maximal'
  };

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleStatsChange = useCallback((stat: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: Math.max(0, value)
      }
    }));
  }, []);

  const toggleSkill = useCallback((skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  }, []);

  const addCustomSkill = useCallback(() => {
    const trimmedSkill = customSkill.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill]
      }));
      setCustomSkill('');
    }
  }, [customSkill, formData.skills]);

  const removeSkill = useCallback((skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.note.trim()) {
      alert('Vänligen skriv en kort anteckning om träningen');
      return;
    }

    if (formData.duration < 5) {
      alert('Träningen måste vara minst 5 minuter');
      return;
    }

    onSave({
      date: formData.date || new Date().toISOString().split('T')[0] || '',
      feeling: formData.feeling,
      note: formData.note.trim(),
      duration: formData.duration,
      intensity: formData.intensity,
      skills: formData.skills,
      stats: formData.stats
    });
  }, [formData, onSave]);

  return (
    <div className="training-logger">
      <div className="logger-header">
        <h2>
          {existingLog ? 'Redigera träningslogg' : 'Ny träningslogg'}
        </h2>
        <p>Dokumentera din träning och följ dina framsteg</p>
      </div>

      {/* Tab Navigation */}
      <div className="logger-tabs">
        <button
          className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          📋 Grundinfo
        </button>
        <button
          className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          🎯 Färdigheter
        </button>
        <button
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistik
        </button>
      </div>

      {/* Tab Content */}
      <div className="logger-content">
        {activeTab === 'basic' && (
          <div className="basic-tab">
            <div className="form-grid">
              <div className="form-group">
                <label>Datum</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Träningslängd (minuter)</label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                />
              </div>

              <div className="form-group full-width">
                <label>Hur kände du dig? ({feelingLabels[formData.feeling as keyof typeof feelingLabels]})</label>
                <div className="feeling-slider">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.feeling}
                    onChange={(e) => handleInputChange('feeling', parseInt(e.target.value))}
                    className="slider feeling"
                  />
                  <div className="slider-labels">
                    <span>😫</span>
                    <span>😞</span>
                    <span>😐</span>
                    <span>😊</span>
                    <span>🤩</span>
                  </div>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Intensitet ({intensityLabels[formData.intensity as keyof typeof intensityLabels]})</label>
                <div className="intensity-slider">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.intensity}
                    onChange={(e) => handleInputChange('intensity', parseInt(e.target.value))}
                    className="slider intensity"
                  />
                  <div className="slider-labels">
                    <span>🚶</span>
                    <span>🏃</span>
                    <span>🏃‍♂️</span>
                    <span>💪</span>
                    <span>🔥</span>
                  </div>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Anteckningar</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  placeholder="Beskriv hur träningen gick, vad du fokuserade på, hur du kände dig..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="skills-tab">
            <h3>Vad fokuserade du på?</h3>
            
            <div className="selected-skills">
              {formData.skills.map((skill) => (
                <span key={skill} className="skill-tag selected">
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => removeSkill(skill)}
                    className="remove-skill"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="skills-grid">
              {predefinedSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className={`skill-button ${formData.skills.includes(skill) ? 'selected' : ''}`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="custom-skill">
              <div className="custom-skill-input">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Lägg till egen färdighet..."
                  onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                />
                <button type="button" onClick={addCustomSkill}>
                  Lägg till
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-tab">
            <h3>Prestationsstatistik</h3>
            <p className="stats-description">
              Fyll i om du gjorde mål, assist eller tog skott under träningen
            </p>
            
            <div className="stats-grid">
              <div className="stat-input">
                <label>⚽ Mål</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stats.goals}
                  onChange={(e) => handleStatsChange('goals', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="stat-input">
                <label>🎯 Assist</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stats.assists}
                  onChange={(e) => handleStatsChange('assists', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="stat-input">
                <label>🏒 Skott</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stats.shots}
                  onChange={(e) => handleStatsChange('shots', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="logger-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Avbryt
        </button>
        <button type="button" className="save-btn" onClick={handleSave}>
          {existingLog ? 'Uppdatera logg' : 'Spara träningslogg'}
        </button>
      </div>
    </div>
  );
};

export default TrainingLogger;
