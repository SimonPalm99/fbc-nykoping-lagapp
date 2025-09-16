import React, { useState, useEffect } from "react";
import { Activity } from "../../types/activity";
import { User } from "../../types/auth";

interface FineRule {
  id: string;
  name: string;
  amount: number;
  description: string;
  activityTypes: string[];
  enabled: boolean;
  beforeDeadline: boolean; // true = fine only if absent without reporting before deadline
}

interface AutoFine {
  id: string;
  userId: string;
  activityId: string;
  ruleId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'paid' | 'waived' | 'appealed';
  createdAt: string;
  dueDate: string;
  paidAt?: string;
  waivedBy?: string;
  waivedReason?: string;
}

interface Props {
  activities: Activity[];
  users: User[];
  isLeader?: boolean;
  onFineCreated?: (fine: AutoFine) => void;
}

const AutomaticFineManager: React.FC<Props> = ({ 
  activities, 
  users, 
  isLeader = false,
  onFineCreated
}) => {
  const [fineRules, setFineRules] = useState<FineRule[]>([
    {
      id: 'absence-no-report-training',
      name: 'Uteblivet från träning utan anmälan',
      amount: 50,
      description: 'Böter för att utebli från träning utan att anmäla frånvaro före deadline',
      activityTypes: ['träning', 'styrketräning', 'taktikträning', 'målvaktsträning'],
      enabled: true,
      beforeDeadline: true
    },
    {
      id: 'absence-no-report-match',
      name: 'Uteblivet från match utan anmälan',
      amount: 100,
      description: 'Böter för att utebli från match utan att anmäla frånvaro före deadline',
      activityTypes: ['match'],
      enabled: true,
      beforeDeadline: true
    },
    {
      id: 'absence-no-report-cup',
      name: 'Uteblivet från cup utan anmälan',
      amount: 150,
      description: 'Böter för att utebli från cup utan att anmäla frånvaro före deadline',
      activityTypes: ['cup'],
      enabled: true,
      beforeDeadline: true
    },
    {
      id: 'late-report',
      name: 'Sen frånvaroanmälan',
      amount: 25,
      description: 'Böter för frånvaroanmälan efter deadline men före aktivitet',
      activityTypes: ['träning', 'match', 'cup'],
      enabled: false,
      beforeDeadline: false
    }
  ]);

  const [autoFines, setAutoFines] = useState<AutoFine[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Process activities that have passed and check for fines
  const processActivitiesForFines = async () => {
    if (!isLeader) return;
    
    setIsProcessing(true);
    const now = new Date();
    const newFines: AutoFine[] = [];

    const pastActivities = activities.filter(activity => {
      const activityDate = new Date(`${activity.date}T${activity.endTime || activity.startTime || '23:59'}`);
      return activityDate < now;
    });

    for (const activity of pastActivities) {
      const deadlineDate = activity.absenceDeadline ? 
        new Date(activity.absenceDeadline) : 
        new Date(`${activity.date}T${activity.startTime || '00:00'}`);

      // Skip if already processed
      if (autoFines.some(f => f.activityId === activity.id)) continue;

      for (const participant of activity.participants) {
        if (participant.status === 'absent') {
          // Check if absence was reported before deadline
          const absenceReportDate = participant.absenceDate ? new Date(participant.absenceDate) : null;
          
          // Find applicable fine rules
          const applicableRules = fineRules.filter(rule => 
            rule.enabled && 
            rule.activityTypes.includes(activity.type) &&
            (rule.beforeDeadline ? (!absenceReportDate || absenceReportDate > deadlineDate) : true)
          );

          for (const rule of applicableRules) {
            // Check if this specific fine already exists
            const existingFine = autoFines.find(f => 
              f.userId === participant.userId && 
              f.activityId === activity.id && 
              f.ruleId === rule.id
            );

            if (!existingFine) {
              const fine: AutoFine = {
                id: `fine-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                userId: participant.userId,
                activityId: activity.id,
                ruleId: rule.id,
                amount: rule.amount,
                reason: `${rule.name} - ${activity.title} (${activity.date})`,
                status: 'pending',
                createdAt: now.toISOString(),
                dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days to pay
              };

              newFines.push(fine);
            }
          }
        }
      }
    }

    if (newFines.length > 0) {
      setAutoFines(prev => [...prev, ...newFines]);
      newFines.forEach(fine => onFineCreated?.(fine));
    }

    setIsProcessing(false);
  };

  useEffect(() => {
    const interval = setInterval(processActivitiesForFines, 60000); // Check every minute
    processActivitiesForFines(); // Check immediately
    return () => clearInterval(interval);
  }, [activities, fineRules]);

  const handleFineStatusUpdate = (fineId: string, status: AutoFine['status'], reason?: string) => {
    setAutoFines(prev => prev.map(fine => {
      if (fine.id === fineId) {
        const updatedFine: AutoFine = {
          ...fine,
          status
        };
        
        if (status === 'paid') {
          updatedFine.paidAt = new Date().toISOString();
        }
        
        if (status === 'waived') {
          updatedFine.waivedBy = 'current-user';
          if (reason) {
            updatedFine.waivedReason = reason;
          }
        }
        
        return updatedFine;
      }
      return fine;
    }));
  };

  const handleRuleUpdate = (ruleId: string, updates: Partial<FineRule>) => {
    setFineRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ));
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : `Användare ${userId}`;
  };

  const getActivityTitle = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    return activity ? activity.title : `Aktivitet ${activityId}`;
  };

  const pendingFines = autoFines.filter(f => f.status === 'pending');
  const totalPendingAmount = pendingFines.reduce((sum, f) => sum + f.amount, 0);

  if (!isLeader) {
    // Show player view - only their own fines
    const userFines = autoFines.filter(f => f.userId === 'current-user-id'); // Replace with actual user ID
    
    if (userFines.length === 0) {
      return (
        <div className="fine-manager-player">
          <div className="no-fines">
            <div className="no-fines-icon">✅</div>
            <h3>Inga böter</h3>
            <p>Du har för närvarande inga obetalda böter</p>
          </div>
        </div>
      );
    }

    return (
      <div className="fine-manager-player">
        <h3>Mina böter</h3>
        <div className="fines-list">
          {userFines.map(fine => (
            <div key={fine.id} className={`fine-card ${fine.status}`}>
              <div className="fine-header">
                <span className="fine-amount">{fine.amount} kr</span>
                <span className={`fine-status status-${fine.status}`}>
                  {fine.status === 'pending' ? 'Obetald' : 
                   fine.status === 'paid' ? 'Betald' : 
                   fine.status === 'waived' ? 'Efterskänkt' : 'Överklagad'}
                </span>
              </div>
              <div className="fine-reason">{fine.reason}</div>
              <div className="fine-date">
                Skapad: {new Date(fine.createdAt).toLocaleDateString('sv-SE')}
              </div>
              {fine.status === 'pending' && (
                <div className="fine-due">
                  Förfaller: {new Date(fine.dueDate).toLocaleDateString('sv-SE')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="automatic-fine-manager">
      <div className="manager-header">
        <h3>
          <span className="icon">💰</span>
          Automatisk böteshantering
        </h3>
        <div className="stats">
          <div className="stat">
            <span className="stat-number">{pendingFines.length}</span>
            <span className="stat-label">Pågående böter</span>
          </div>
          <div className="stat">
            <span className="stat-number">{totalPendingAmount} kr</span>
            <span className="stat-label">Totalt att betala</span>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="processing-indicator">
          <span className="spinner"></span>
          Kontrollerar aktiviteter för böter...
        </div>
      )}

      <div className="manager-sections">
        <div className="section">
          <h4>Bötesregler</h4>
          <div className="rules-list">
            {fineRules.map(rule => (
              <div key={rule.id} className={`rule-card ${rule.enabled ? 'enabled' : 'disabled'}`}>
                <div className="rule-header">
                  <label className="rule-toggle">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={(e) => handleRuleUpdate(rule.id, { enabled: e.target.checked })}
                    />
                    <span className="rule-name">{rule.name}</span>
                  </label>
                  <div className="rule-amount">{rule.amount} kr</div>
                </div>
                <div className="rule-description">{rule.description}</div>
                <div className="rule-types">
                  Gäller för: {rule.activityTypes.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h4>Aktiva böter ({pendingFines.length})</h4>
          {pendingFines.length === 0 ? (
            <div className="no-fines">
              <p>Inga pågående böter för tillfället</p>
            </div>
          ) : (
            <div className="fines-list">
              {pendingFines.map(fine => (
                <div key={fine.id} className="fine-card">
                  <div className="fine-details">
                    <div className="fine-user">{getUserName(fine.userId)}</div>
                    <div className="fine-reason">{fine.reason}</div>
                    <div className="fine-activity">
                      Aktivitet: {getActivityTitle(fine.activityId)}
                    </div>
                    <div className="fine-dates">
                      Skapad: {new Date(fine.createdAt).toLocaleDateString('sv-SE')} | 
                      Förfaller: {new Date(fine.dueDate).toLocaleDateString('sv-SE')}
                    </div>
                  </div>
                  <div className="fine-actions">
                    <div className="fine-amount">{fine.amount} kr</div>
                    <div className="action-buttons">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleFineStatusUpdate(fine.id, 'paid')}
                      >
                        Markera betald
                      </button>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => {
                          const reason = prompt('Anledning till efterskänkning:');
                          if (reason) handleFineStatusUpdate(fine.id, 'waived', reason);
                        }}
                      >
                        Efterskänk
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .automatic-fine-manager {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin: 16px 0;
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .manager-header h3 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #374151;
        }

        .stats {
          display: flex;
          gap: 20px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: #dc2626;
        }

        .stat-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
        }

        .processing-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 6px;
          color: #0369a1;
          margin-bottom: 20px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .manager-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .section h4 {
          margin: 0 0 12px 0;
          color: #374151;
          font-size: 16px;
          font-weight: 600;
        }

        .rules-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rule-card {
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 12px;
          transition: all 0.2s ease;
        }

        .rule-card.enabled {
          background: #f0fdf4;
          border-color: #22c55e;
        }

        .rule-card.disabled {
          background: #f9fafb;
          opacity: 0.7;
        }

        .rule-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .rule-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .rule-name {
          font-weight: 500;
          color: #374151;
        }

        .rule-amount {
          font-weight: 600;
          color: #dc2626;
        }

        .rule-description {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .rule-types {
          font-size: 12px;
          color: #9ca3af;
        }

        .fines-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .fine-card {
          border: 1px solid #fecaca;
          background: #fef2f2;
          border-radius: 6px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: start;
        }

        .fine-details {
          flex: 1;
        }

        .fine-user {
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
        }

        .fine-reason {
          color: #dc2626;
          margin-bottom: 8px;
        }

        .fine-activity {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .fine-dates {
          font-size: 12px;
          color: #9ca3af;
        }

        .fine-actions {
          text-align: right;
        }

        .fine-amount {
          font-size: 18px;
          font-weight: 700;
          color: #dc2626;
          margin-bottom: 8px;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
        }

        .btn-success {
          background: #22c55e;
          color: white;
        }

        .btn-warning {
          background: #f59e0b;
          color: white;
        }

        .btn-sm {
          padding: 4px 8px;
          font-size: 11px;
        }

        .no-fines {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
        }

        .no-fines-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .fine-manager-player {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin: 16px 0;
        }

        .fine-manager-player h3 {
          margin: 0 0 16px 0;
          color: #374151;
        }

        .fine-status {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-pending {
          background: #fecaca;
          color: #dc2626;
        }

        .status-paid {
          background: #d1fae5;
          color: #065f46;
        }

        .status-waived {
          background: #fef3c7;
          color: #92400e;
        }

        @media (max-width: 900px) {
          .manager-sections {
            grid-template-columns: 1fr;
          }

          .manager-header {
            flex-direction: column;
            gap: 16px;
            align-items: start;
          }

          .fine-card {
            flex-direction: column;
            gap: 12px;
          }

          .fine-actions {
            text-align: left;
          }

          .action-buttons {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
};

export default AutomaticFineManager;
