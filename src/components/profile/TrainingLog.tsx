import React, { useState } from 'react';
import { PersonalTrainingEntry } from '../../types/auth';
import { LoadingButton } from '../ui/LoadingButton';

interface TrainingLogProps {
  entries: PersonalTrainingEntry[];
  onAddEntry: (entry: Omit<PersonalTrainingEntry, 'id'>) => void;
  onDeleteEntry: (entryId: string) => void;
  onEditEntry?: (entryId: string, updates: Partial<PersonalTrainingEntry>) => void;
  isReadOnly?: boolean;
}

export const TrainingLog: React.FC<TrainingLogProps> = ({
  entries,
  onAddEntry,
  onDeleteEntry,
  onEditEntry,
  isReadOnly = false
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);

  const getToday = (): string => new Date().toISOString().split('T')[0] || '';

  const [formData, setFormData] = useState<Partial<PersonalTrainingEntry>>(() => ({
    type: 'skills',
    feeling: 3,
    intensity: 3,
    date: getToday()
  }));

  const trainingTypes = [
    { value: 'skills', label: 'Teknikträning', icon: '🏒' },
    { value: 'gym', label: 'Gym/Styrka', icon: '💪' },
    { value: 'running', label: 'Löpning/Kondition', icon: '🏃' },
    { value: 'recovery', label: 'Återhämtning', icon: '🧘' },
    { value: 'other', label: 'Annat', icon: '⚽' }
  ];

  const intensityLabels = ['Mycket lätt', 'Lätt', 'Medel', 'Tung', 'Mycket tung'];
  const feelingLabels = ['Dåligt', 'Mindre bra', 'Okej', 'Bra', 'Utmärkt'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.duration) {
      return;
    }

    if (editingEntry) {
      onEditEntry?.(editingEntry, formData);
      setEditingEntry(null);
    } else {
      onAddEntry({
        date: formData.date!,
        type: formData.type || 'skills',
        duration: formData.duration!,
        intensity: formData.intensity || 3,
        feeling: formData.feeling || 3,
        ...(formData.notes && { notes: formData.notes }),
        ...(formData.stats && { stats: formData.stats })
      });
    }

    // Reset form
    setFormData(() => ({
      type: 'skills',
      feeling: 3,
      intensity: 3,
      date: getToday()
    }));
    setShowAddForm(false);
  };

  const startEdit = (entry: PersonalTrainingEntry) => {
    setFormData(entry);
    setEditingEntry(entry.id);
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingEntry(null);
    setShowAddForm(false);
    setFormData(() => ({
      type: 'skills',
      feeling: 3,
      intensity: 3,
      date: getToday()
    }));
  };

  const getTypeInfo = (type: string) => {
    return trainingTypes.find(t => t.value === type) || trainingTypes[0];
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
    return `${mins}min`;
  };

  const getStatsForType = (entry: PersonalTrainingEntry) => {
    if (!entry.stats) return null;

    switch (entry.type) {
      case 'skills':
        return (
          <div className="training-stats">
            {entry.stats.goals !== undefined && (
              <span className="stat-item">⚽ {entry.stats.goals} mål</span>
            )}
            {entry.stats.shots !== undefined && (
              <span className="stat-item">🎯 {entry.stats.shots} skott</span>
            )}
            {entry.stats.assists !== undefined && (
              <span className="stat-item">🤝 {entry.stats.assists} assist</span>
            )}
          </div>
        );
      case 'running':
        return entry.stats.distance ? (
          <div className="training-stats">
            <span className="stat-item">📏 {entry.stats.distance} km</span>
          </div>
        ) : null;
      case 'gym':
        return entry.stats.weight ? (
          <div className="training-stats">
            <span className="stat-item">🏋️ {entry.stats.weight} kg</span>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="training-log">
      <div className="training-log-header">
        <h3>📋 Personlig träningslogg</h3>
        {!isReadOnly && (
          <LoadingButton
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary btn-sm"
          >
            {showAddForm ? 'Avbryt' : '+ Lägg till träning'}
          </LoadingButton>
        )}
      </div>

      {/* Statistik översikt */}
      {entries.length > 0 && (
        <div className="training-overview">
          <div className="overview-stats">
            <div className="stat-card">
              <div className="stat-number">{entries.length}</div>
              <div className="stat-label">Träningar</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {Math.round(entries.reduce((sum, e) => sum + e.duration, 0) / 60)}h
              </div>
              <div className="stat-label">Total tid</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {(entries.reduce((sum, e) => sum + e.feeling, 0) / entries.length).toFixed(1)}
              </div>
              <div className="stat-label">Snitt känsla</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {(entries.reduce((sum, e) => sum + e.intensity, 0) / entries.length).toFixed(1)}
              </div>
              <div className="stat-label">Snitt intensitet</div>
            </div>
          </div>
        </div>
      )}

      {/* Lägg till träning formulär */}
      {showAddForm && !isReadOnly && (
        <form onSubmit={handleSubmit} className="add-training-form">
          <div className="form-row">
            <div className="form-group">
              <label>Datum</label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
                title="Välj datum för träningen"
              />
            </div>
            
            <div className="form-group">
              <label>Typ av träning</label>
              <select
                value={formData.type || 'skills'}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                title="Välj typ av träning"
              >
                {trainingTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Varaktighet (minuter)</label>
              <input
                type="number"
                min="1"
                max="300"
                value={formData.duration || ''}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                required
                title="Ange varaktighet i minuter"
                placeholder="Minuter"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Intensitet: {intensityLabels[(formData.intensity || 3) - 1]}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.intensity || 3}
                onChange={(e) => setFormData({...formData, intensity: parseInt(e.target.value) as any})}
                className="slider"
                title="Välj intensitet"
              />
              <div className="slider-labels">
                <span>Mycket lätt</span>
                <span>Mycket tung</span>
              </div>
            </div>

            <div className="form-group">
              <label>Känsla: {feelingLabels[(formData.feeling || 3) - 1]}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.feeling || 3}
                onChange={(e) => setFormData({...formData, feeling: parseInt(e.target.value) as any})}
                className="slider"
                title="Välj känsla"
              />
              <div className="slider-labels">
                <span>Dåligt</span>
                <span>Utmärkt</span>
              </div>
            </div>
          </div>

          {/* Dynamiska statistikfält baserat på träningstyp */}
          {(formData.type === 'skills') && (
            <div className="form-row stats-section">
              <h4>Statistik (valfritt)</h4>
              <div className="form-group">
                <label>Mål</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stats?.goals || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, ...(value > 0 && { goals: value }) }
                    });
                  }}
                  title="Antal mål"
                  placeholder="Mål"
                />
              </div>
              <div className="form-group">
                <label>Skott</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stats?.shots || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, ...(value > 0 && { shots: value }) }
                    });
                  }}
                  title="Antal skott"
                  placeholder="Skott"
                />
              </div>
              <div className="form-group">
                <label>Assist</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stats?.assists || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, ...(value > 0 && { assists: value }) }
                    });
                  }}
                  title="Antal assist"
                  placeholder="Assist"
                />
              </div>
            </div>
          )}

          {formData.type === 'running' && (
            <div className="form-row stats-section">
              <h4>Statistik (valfritt)</h4>
              <div className="form-group">
                <label>Distans (km)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.stats?.distance || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, ...(value > 0 && { distance: value }) }
                    });
                  }}
                  title="Distans i kilometer"
                  placeholder="km"
                />
              </div>
            </div>
          )}

          {formData.type === 'gym' && (
            <div className="form-row stats-section">
              <h4>Statistik (valfritt)</h4>
              <div className="form-group">
                <label>Max vikt (kg)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stats?.weight || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, ...(value > 0 && { weight: value }) }
                    });
                  }}
                  title="Max vikt i kg"
                  placeholder="kg"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Anteckningar</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Hur kändes träningen? Vad fokuserade du på?"
              rows={3}
            />
          </div>

          <div className="form-actions">
            <LoadingButton type="submit" className="btn btn-primary">
              {editingEntry ? 'Uppdatera träning' : 'Lägg till träning'}
            </LoadingButton>
            <button type="button" onClick={cancelEdit} className="btn btn-secondary">
              Avbryt
            </button>
          </div>
        </form>
      )}

      {/* Träningsloggar */}
      <div className="training-entries">
        {sortedEntries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h4>Inga träningar loggade än</h4>
            <p>Börja logga dina träningar för att följa din utveckling!</p>
          </div>
        ) : (
          sortedEntries.map((entry) => {
            const typeInfo = getTypeInfo(entry.type);
            
            return (
              <div key={entry.id} className="training-entry">
                <div className="entry-header">
                  <div className="entry-type">
                    <span className="type-icon">{typeInfo?.icon ?? '🏒'}</span>
                    <div className="type-info">
                      <h4>{typeInfo?.label ?? 'Träning'}</h4>
                      <span className="entry-date">
                        {new Date(entry.date).toLocaleDateString('sv-SE', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="entry-duration">
                    <span className="duration">{formatDuration(entry.duration)}</span>
                  </div>

                  {!isReadOnly && (
                    <div className="entry-actions">
                      <button
                        onClick={() => startEdit(entry)}
                        className="btn-icon"
                        title="Redigera"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDeleteEntry(entry.id)}
                        className="btn-icon btn-danger"
                        title="Ta bort"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>

                <div className="entry-details">
                  <div className="detail-item">
                    <span className="detail-label">Intensitet:</span>
                    <div className="rating">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className={`star ${i <= entry.intensity ? 'filled' : ''}`}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Känsla:</span>
                    <div className="rating">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className={`heart ${i <= entry.feeling ? 'filled' : ''}`}>
                          ❤️
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {getStatsForType(entry)}

                {entry.notes && (
                  <div className="entry-notes">
                    <p>"{entry.notes}"</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .training-log {
            background: var(--card-background);
            border-radius: 12px;
            padding: 1.5rem;
            border: 1px solid var(--border-color);
          }

          .training-log-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 1.5rem;
          }

          .training-log-header h3 {
            margin: 0;
            color: var(--text-primary);
            font-size: 1.25rem;
            font-weight: 700;
          }

          .training-overview {
            margin-bottom: 2rem;
            padding: 1rem;
            background: var(--background);
            border-radius: 8px;
            border: 1px solid var(--border-color);
          }

          .overview-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 1rem;
          }

          .stat-card {
            text-align: center;
            padding: 1rem;
            background: var(--card-background);
            border-radius: 8px;
            border: 1px solid var(--border-color);
          }

          .stat-number {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 0.25rem;
          }

          .stat-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
          }

          .add-training-form {
            background: var(--background);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            margin-bottom: 2rem;
          }

          .form-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .form-group label {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            padding: 0.75rem;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background: var(--card-background);
            color: var(--text-primary);
            font-size: 0.875rem;
          }

          .form-group input:focus,
          .form-group select:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px var(--primary-color-alpha);
          }

          .slider {
            -webkit-appearance: none;
            appearance: none;
            height: 6px;
            background: var(--border-color);
            border-radius: 3px;
            outline: none;
          }

          .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: var(--primary-color);
            border-radius: 50%;
            cursor: pointer;
          }

          .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: var(--primary-color);
            border-radius: 50%;
            cursor: pointer;
            border: none;
          }

          .slider-labels {
            display: flex;
            justify-content: space-between;
            margin-top: 0.25rem;
            font-size: 0.75rem;
            color: var(--text-secondary);
          }

          .stats-section {
            border-top: 1px solid var(--border-color);
            padding-top: 1rem;
            margin-top: 1rem;
          }

          .stats-section h4 {
            grid-column: 1 / -1;
            margin: 0 0 1rem 0;
            color: var(--text-primary);
            font-size: 1rem;
          }

          .form-actions {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
          }

          .training-entries {
            display: grid;
            gap: 1rem;
          }

          .training-entry {
            background: var(--background);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
          }

          .training-entry:hover {
            border-color: var(--primary-color);
            box-shadow: 0 2px 8px var(--shadow-color);
          }

          .entry-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .entry-type {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .type-icon {
            font-size: 1.5rem;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--primary-background);
            border-radius: 8px;
          }

          .type-info h4 {
            margin: 0;
            color: var(--text-primary);
            font-size: 1rem;
            font-weight: 600;
          }

          .entry-date {
            font-size: 0.875rem;
            color: var(--text-secondary);
          }

          .entry-duration .duration {
            background: var(--primary-color);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.875rem;
            font-weight: 600;
          }

          .entry-actions {
            display: flex;
            gap: 0.5rem;
          }

          .btn-icon {
            background: none;
            border: none;
            padding: 0.5rem;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }

          .btn-icon:hover {
            background: var(--hover-background);
          }

          .btn-icon.btn-danger:hover {
            background: var(--error-background);
          }

          .entry-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .detail-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .detail-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
            font-weight: 500;
          }

          .rating {
            display: flex;
            gap: 0.125rem;
          }

          .star, .heart {
            font-size: 0.875rem;
            opacity: 0.3;
            transition: opacity 0.2s ease;
          }

          .star.filled, .heart.filled {
            opacity: 1;
          }

          .training-stats {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
          }

          .stat-item {
            background: var(--secondary-background);
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.875rem;
            color: var(--text-primary);
            font-weight: 500;
          }

          .entry-notes {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
          }

          .entry-notes p {
            margin: 0;
            color: var(--text-secondary);
            font-style: italic;
            line-height: 1.5;
          }

          .empty-state {
            text-align: center;
            padding: 3rem 1rem;
            color: var(--text-secondary);
          }

          .empty-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }

          .empty-state h4 {
            margin: 0 0 0.5rem 0;
            color: var(--text-primary);
          }

          .empty-state p {
            margin: 0;
          }

          @media (max-width: 768px) {
            .training-log {
              padding: 1rem;
            }

            .training-log-header {
              flex-direction: column;
              align-items: stretch;
              gap: 1rem;
            }

            .form-row {
              grid-template-columns: 1fr;
            }

            .overview-stats {
              grid-template-columns: repeat(2, 1fr);
            }

            .entry-header {
              flex-direction: column;
              align-items: stretch;
              gap: 1rem;
            }

            .entry-actions {
              align-self: flex-end;
            }

            .entry-details {
              grid-template-columns: 1fr;
            }

            .training-stats {
              gap: 0.5rem;
            }
          }
        `
      }} />
    </div>
  );
};

export default TrainingLog;
