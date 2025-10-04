import React, { useState } from 'react';
import { RehabPlan, RehabExercise, InjuryReport } from '../../types/health';
import { User } from '../../types/auth';
import { format } from 'date-fns';
import './RehabPlan.css';

interface RehabPlanProps {
  injury: InjuryReport;
  user: User;
  onSave: (plan: RehabPlan) => void;
}

export const RehabPlanComponent: React.FC<RehabPlanProps> = ({ injury, user, onSave }) => {
  const [plan, setPlan] = useState<RehabPlan>({
    id: '',
    injuryId: injury.id,
    playerId: injury.playerId,
    title: `Rehabiliteringsplan - ${injury.injuryType}`,
    description: '',
    startDate: new Date(),
    estimatedEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dagar
    status: 'active',
    phases: [],
    exercises: [],
    sessions: [],
    goals: [],
    restrictions: [],
    createdBy: user.id,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [currentPhase, setCurrentPhase] = useState(0);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState<Partial<RehabExercise>>({});

  const phases = [
    { name: 'Akut fas', duration: '1-3 dagar', focus: 'Vila och smärtlindring' },
    { name: 'Läkningsfas', duration: '3-14 dagar', focus: 'Gradvis rörlighet' },
    { name: 'Återuppbyggnad', duration: '2-6 veckor', focus: 'Styrka och uthållighet' },
    { name: 'Återgång till sport', duration: '1-2 veckor', focus: 'Sportspecifik träning' }
  ];

  const exerciseTemplates: Array<{name: string; type: 'strength' | 'stretching' | 'mobility' | 'balance' | 'cardio' | 'functional'; duration: number}> = [
    { name: 'Statisk sträckning', type: 'stretching', duration: 30 },
    { name: 'Isometrisk styrka', type: 'strength', duration: 15 },
    { name: 'ROM-övningar', type: 'mobility', duration: 20 },
    { name: 'Balansträning', type: 'balance', duration: 10 },
    { name: 'Kardioträning', type: 'cardio', duration: 20 },
    { name: 'Funktionell träning', type: 'functional', duration: 25 }
  ];

  const addExercise = () => {
    if (newExercise.name && newExercise.type) {
      const exercise: RehabExercise = {
        id: Date.now().toString(),
        name: newExercise.name,
        type: newExercise.type as any,
        description: newExercise.description || '',
        duration: newExercise.duration || 15,
        sets: newExercise.sets || 1,
        repetitions: newExercise.repetitions || 10,
        intensity: newExercise.intensity || 'low',
        phase: currentPhase,
        instructions: newExercise.instructions || '',
        precautions: newExercise.precautions || ''
      };

      setPlan(prev => ({
        ...prev,
        exercises: [...prev.exercises, exercise]
      }));

      setNewExercise({});
      setShowAddExercise(false);
    }
  };

  const removeExercise = (exerciseId: string) => {
    setPlan(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const updatePlanField = (field: keyof RehabPlan, value: any) => {
    setPlan(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date()
    }));
  };

  const savePlan = () => {
    const updatedPlan = {
      ...plan,
      id: plan.id || Date.now().toString(),
      phases: phases.map((phase, index) => ({
        name: phase.name,
        duration: phase.duration,
        focus: phase.focus,
        exercises: plan.exercises.filter(ex => ex.phase === index)
      }))
    };
    onSave(updatedPlan);
  };

  return (
    <div className="rehab-plan">
      <div className="rehab-plan-header">
        <h3>Rehabiliteringsplan</h3>
        <div className="injury-info">
          <span className="injury-type">{injury.injuryType}</span>
          <span className="severity">{injury.severity}</span>
          <span className="body-part">{injury.bodyPart}</span>
        </div>
      </div>

      <div className="plan-basic-info">
        <div className="form-group">
          <label>Titel</label>
          <input
            type="text"
            value={plan.title}
            onChange={(e) => updatePlanField('title', e.target.value)}
            placeholder="Ange titel för rehabiliteringsplan"
            title="Titel för rehabiliteringsplan"
          />
        </div>
        
        <div className="form-group">
          <label>Beskrivning</label>
          <textarea
            value={plan.description}
            onChange={(e) => updatePlanField('description', e.target.value)}
            rows={3}
            title="Beskrivning av rehabiliteringsplan"
            placeholder="Ange beskrivning för rehabiliteringsplan"
          />
        </div>

        <div className="date-range">
          <div className="form-group">
            <label>Startdatum</label>
            <input
              type="date"
              value={format(plan.startDate, 'yyyy-MM-dd')}
              onChange={(e) => updatePlanField('startDate', new Date(e.target.value))}
              title="Startdatum för rehabiliteringsplan"
              placeholder="Välj startdatum"
            />
          </div>
          
          <div className="form-group">
            <label>Uppskattat slutdatum</label>
            <input
              type="date"
              value={format(plan.estimatedEndDate, 'yyyy-MM-dd')}
              onChange={(e) => updatePlanField('estimatedEndDate', new Date(e.target.value))}
                title="Uppskattat slutdatum för rehabiliteringsplan"
                placeholder="Välj uppskattat slutdatum"
              />
          </div>
        </div>
      </div>

      <div className="rehab-phases">
        <h4>Rehabiliteringsfaser</h4>
        <div className="phase-tabs">
          {phases.map((phase, index) => (
            <button
              key={index}
              className={`phase-tab ${currentPhase === index ? 'active' : ''}`}
              onClick={() => setCurrentPhase(index)}
            >
              <div className="phase-name">{phase.name}</div>
              <div className="phase-duration">{phase.duration}</div>
            </button>
          ))}
        </div>

        <div className="current-phase">
          <div className="phase-info">
            <h5>{phases[currentPhase]?.name}</h5>
            <p><strong>Varaktighet:</strong> {phases[currentPhase]?.duration}</p>
            <p><strong>Fokus:</strong> {phases[currentPhase]?.focus}</p>
          </div>

          <div className="phase-exercises">
            <div className="exercises-header">
              <h6>Övningar för denna fas</h6>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddExercise(true)}
              >
                Lägg till övning
              </button>
            </div>

            <div className="exercises-list">
              {plan.exercises
                .filter(ex => ex.phase === currentPhase)
                .map(exercise => (
                  <div key={exercise.id} className="exercise-card">
                    <div className="exercise-header">
                      <h6>{exercise.name}</h6>
                      <div className="exercise-actions">
                        <span className={`exercise-type ${exercise.type}`}>
                          {exercise.type}
                        </span>
                        <button
                          className="btn-remove"
                          onClick={() => removeExercise(exercise.id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    
                    <div className="exercise-details">
                      <div className="exercise-params">
                        <span>⏱️ {exercise.duration} min</span>
                        {exercise.sets > 1 && <span>🔄 {exercise.sets} set</span>}
                        {exercise.repetitions && <span>🔢 {exercise.repetitions} reps</span>}
                        <span className={`intensity ${exercise.intensity}`}>
                          {exercise.intensity} intensitet
                        </span>
                      </div>
                      
                      {exercise.description && (
                        <p className="exercise-description">{exercise.description}</p>
                      )}
                      
                      {exercise.instructions && (
                        <div className="exercise-instructions">
                          <strong>Instruktioner:</strong> {exercise.instructions}
                        </div>
                      )}
                      
                      {exercise.precautions && (
                        <div className="exercise-precautions">
                          <strong>⚠️ Försiktighetsåtgärder:</strong> {exercise.precautions}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {showAddExercise && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h5>Lägg till övning - {phases[currentPhase]?.name}</h5>
              <button
                className="btn-close"
                onClick={() => setShowAddExercise(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="exercise-templates">
                <h6>Välj från mall</h6>
                <div className="template-grid">
                  {exerciseTemplates.map(template => (
                    <button
                      key={template.name}
                      className="template-btn"
                      onClick={() => setNewExercise({
                        name: template.name,
                        type: template.type,
                        duration: template.duration
                      })}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="exercise-form">
                <div className="form-group">
                  <label>Övningsnamn</label>
                  <input
                    type="text"
                    value={newExercise.name || ''}
                    onChange={(e) => setNewExercise(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    title="Övningsnamn"
                    placeholder="Ange övningsnamn"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Typ</label>
                    <select
                      title="Typ av övning"
                      value={newExercise.type || ''}
                      onChange={(e) => setNewExercise(prev => ({
                        ...prev,
                        type: e.target.value as 'strength' | 'stretching' | 'mobility' | 'balance' | 'cardio' | 'functional'
                      }))}
                    >
                      <option value="">Välj typ</option>
                      <option value="strength">Styrka</option>
                      <option value="stretching">Stretching</option>
                      <option value="mobility">Rörlighet</option>
                      <option value="balance">Balans</option>
                      <option value="cardio">Kondition</option>
                      <option value="functional">Funktionell</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Varaktighet (min)</label>
                    <input
                      type="number"
                      value={newExercise.duration || ''}
                      onChange={(e) => setNewExercise(prev => ({
                        ...prev,
                        duration: parseInt(e.target.value)
                      }))}
                      title="Varaktighet i minuter"
                      placeholder="Ange varaktighet (min)"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Set</label>
                    <input
                      type="number"
                      value={newExercise.sets || ''}
                      onChange={(e) => setNewExercise(prev => ({
                        ...prev,
                        sets: parseInt(e.target.value)
                      }))}
                      title="Antal set"
                      placeholder="Ange antal set"
                    />
                  </div>

                  <div className="form-group">
                    <label>Repetitioner</label>
                    <input
                      type="number"
                      value={newExercise.repetitions || ''}
                      onChange={(e) => setNewExercise(prev => ({
                        ...prev,
                        repetitions: parseInt(e.target.value)
                      }))}
                      title="Antal repetitioner"
                      placeholder="Ange antal repetitioner"
                    />
                  </div>

                  <div className="form-group">
                    <label>Intensitet</label>
                    <select
                      title="Intensitet"
                      value={newExercise.intensity || 'low'}
                      onChange={(e) => setNewExercise(prev => ({
                        ...prev,
                        intensity: e.target.value as any
                      }))}
                    >
                      <option value="low">Låg</option>
                      <option value="medium">Medel</option>
                      <option value="high">Hög</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Beskrivning</label>
                  <textarea
                    value={newExercise.description || ''}
                    onChange={(e) => setNewExercise(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    rows={2}
                    title="Beskrivning av övning"
                    placeholder="Ange beskrivning för övningen"
                  />
                </div>

                <div className="form-group">
                  <label>Instruktioner</label>
                  <textarea
                    value={newExercise.instructions || ''}
                    onChange={(e) => setNewExercise(prev => ({
                      ...prev,
                      instructions: e.target.value
                    }))}
                    rows={2}
                    title="Instruktioner för övning"
                    placeholder="Ange instruktioner för övningen"
                  />
                </div>

                <div className="form-group">
                  <label>Försiktighetsåtgärder</label>
                  <textarea
                    value={newExercise.precautions || ''}
                    onChange={(e) => setNewExercise(prev => ({
                      ...prev,
                      precautions: e.target.value
                    }))}
                    rows={2}
                    title="Försiktighetsåtgärder för övning"
                    placeholder="Ange försiktighetsåtgärder för övningen"
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowAddExercise(false)}
              >
                Avbryt
              </button>
              <button
                className="btn btn-primary"
                onClick={addExercise}
                disabled={!newExercise.name || !newExercise.type}
              >
                Lägg till övning
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="plan-goals">
        <h4>Mål och restriktioner</h4>
        <div className="goals-restrictions">
          <div className="form-group">
            <label>Rehabiliteringsmål</label>
            <textarea
              value={plan.goals.join('\n')}
              onChange={(e) => updatePlanField('goals', e.target.value.split('\n').filter(g => g.trim()))}
              placeholder="Ett mål per rad..."
              rows={3}
              title="Skriv ett mål per rad"
            />
          </div>
          
          <div className="form-group">
            <label>Restriktioner/Varningar</label>
            <textarea
              value={plan.restrictions.join('\n')}
              onChange={(e) => updatePlanField('restrictions', e.target.value.split('\n').filter(r => r.trim()))}
              placeholder="En restriktion per rad..."
              rows={3}
              title="Skriv en restriktion per rad"
            />
          </div>
        </div>
      </div>

      <div className="plan-actions">
        <button className="btn btn-secondary">Förhandsgranska</button>
        <button className="btn btn-primary" onClick={savePlan}>
          Spara rehabiliteringsplan
        </button>
      </div>
    </div>
  );
};
