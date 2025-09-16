import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface QuickAction {
  id: string;
  path: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: 'core' | 'social' | 'stats' | 'admin';
  requiresLeader?: boolean;
  isEnabled: boolean;
  order: number;
}

interface QuickActionsProps {
  onCustomize?: () => void;
  maxActions?: number;
  showCustomizeButton?: boolean;
}

const defaultActions: Omit<QuickAction, 'isEnabled' | 'order'>[] = [
  {
    id: 'activities',
    path: '/activities',
    title: 'Aktiviteter',
    description: 'Träningar & matcher',
    icon: '📅',
    color: '#22c55e',
    category: 'core'
  },
  {
    id: 'statistics',
    path: '/statistics',
    title: 'Statistik',
    description: 'Personliga stats',
    icon: '📊',
    color: '#3b82f6',
    category: 'stats'
  },
  {
    id: 'forum',
    path: '/forum',
    title: 'Forum',
    description: 'Diskussioner',
    icon: '💬',
    color: '#8b5cf6',
    category: 'social'
  },
  {
    id: 'chat',
    path: '/chat',
    title: 'Chat',
    description: 'Lagchat',
    icon: '💭',
    color: '#06b6d4',
    category: 'social'
  },
  {
    id: 'fines',
    path: '/fines',
    title: 'Böter',
    description: 'Lagkassa & böter',
    icon: '💰',
    color: '#f59e0b',
    category: 'core'
  },
  {
    id: 'tactics',
    path: '/tactics',
    title: 'Ritverktyg',
    description: 'Taktik & övningar',
    icon: '🎯',
    color: '#ef4444',
    category: 'admin',
    requiresLeader: true
  },
  {
    id: 'matchplan',
    path: '/matchplan',
    title: 'Matchplan',
    description: 'Spelschema',
    icon: '🏒',
    color: '#f97316',
    category: 'core'
  },
  {
    id: 'league',
    path: '/league',
    title: 'Liga',
    description: 'Tabell & resultat',
    icon: '🏆',
    color: '#10b981',
    category: 'stats'
  },
  {
    id: 'profile',
    path: '/profile',
    title: 'Profil',
    description: 'Min profil',
    icon: '👤',
    color: '#6366f1',
    category: 'core'
  },
  {
    id: 'opponents',
    path: '/opponents',
    title: 'Motståndare',
    description: 'Motståndaranalys',
    icon: '🔍',
    color: '#84cc16',
    category: 'admin',
    requiresLeader: true
  },
  {
    id: 'postmatch',
    path: '/postmatch',
    title: 'Matchrapport',
    description: 'Efter matcher',
    icon: '📝',
    color: '#a855f7',
    category: 'admin',
    requiresLeader: true
  },
  {
    id: 'gamification',
    path: '/gamification',
    title: 'Achievements',
    description: 'Utmärkelser',
    icon: '🎖️',
    color: '#ec4899',
    category: 'social'
  }
];

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  maxActions = 8,
  showCustomizeButton = true 
}) => {
  const { user, isLeader } = useAuth();
  const [actions, setActions] = useState<QuickAction[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    loadUserPreferences();
  }, [user, isLeader]);

  const loadUserPreferences = () => {
    // Ladda användarens anpassade snabbval från localStorage
    const savedPreferences = localStorage.getItem(`quickActions_${user?.id}`);
    
    let userActions: QuickAction[];
    
    if (savedPreferences) {
      try {
        userActions = JSON.parse(savedPreferences);
      } catch {
        userActions = getDefaultActions();
      }
    } else {
      userActions = getDefaultActions();
    }

    // Filtrera bort ledare-specifika funktioner för vanliga spelare
    const filteredActions = userActions.filter(action => 
      !action.requiresLeader || isLeader
    );

    setActions(filteredActions);
  };

  const getDefaultActions = (): QuickAction[] => {
    return defaultActions.map((action, index) => ({
      ...action,
      isEnabled: index < maxActions, // Aktivera de första actions som standard
      order: index
    }));
  };

  const saveUserPreferences = (newActions: QuickAction[]) => {
    localStorage.setItem(`quickActions_${user?.id}`, JSON.stringify(newActions));
    setActions(newActions);
  };

  const toggleAction = (actionId: string) => {
    const updatedActions = actions.map(action => 
      action.id === actionId 
        ? { ...action, isEnabled: !action.isEnabled }
        : action
    );
    saveUserPreferences(updatedActions);
  };

  // const _reorderActions = (_dragIndex: number, _hoverIndex: number) => {
  //   const updatedActions = [...actions];
  //   const draggedAction = updatedActions[_dragIndex];
  //   if (!draggedAction) return;
  //   updatedActions.splice(_dragIndex, 1);
  //   updatedActions.splice(_hoverIndex, 0, draggedAction);
  //   
  //   // Uppdatera order
  //   const reorderedActions = updatedActions.map((action, index) => ({
  //     ...action,
  //     order: index
  //   }));
  //   
  //   saveUserPreferences(reorderedActions);
  // };

  const resetToDefaults = () => {
    const defaultUserActions = getDefaultActions();
    saveUserPreferences(defaultUserActions);
    setIsCustomizing(false);
  };

  const enabledActions = actions
    .filter(action => action.isEnabled)
    .sort((a, b) => a.order - b.order)
    .slice(0, maxActions);

  if (isCustomizing) {
    return (
      <div className="quick-actions-customizer">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem"
        }}>
          <h3 style={{
            margin: 0,
            fontSize: "1.25rem",
            fontWeight: "700",
            color: "var(--text-primary)"
          }}>
            Anpassa snabbval
          </h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={resetToDefaults}
              style={{
                padding: "0.5rem 1rem",
                background: "var(--error-color)",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.875rem",
                cursor: "pointer"
              }}
            >
              Återställ
            </button>
            <button
              onClick={() => setIsCustomizing(false)}
              style={{
                padding: "0.5rem 1rem",
                background: "var(--primary-green)",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.875rem",
                cursor: "pointer"
              }}
            >
              Klar
            </button>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem"
        }}>
          {actions.map((action) => (
            <div
              key={action.id}
              style={{
                padding: "1rem",
                background: action.isEnabled ? "var(--card-background)" : "var(--muted-background)",
                border: `2px solid ${action.isEnabled ? action.color : 'var(--border-color)'}`,
                borderRadius: "12px",
                cursor: "pointer",
                opacity: action.isEnabled ? 1 : 0.6,
                transition: "all 0.2s ease"
              }}
              onClick={() => toggleAction(action.id)}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "0.5rem"
              }}>
                <span style={{ fontSize: "1.5rem" }}>{action.icon}</span>
                <span style={{
                  fontWeight: "600",
                  color: "var(--text-primary)"
                }}>
                  {action.title}
                </span>
                <span style={{
                  marginLeft: "auto",
                  fontSize: "1.25rem",
                  color: action.isEnabled ? "var(--success-color)" : "var(--text-muted)"
                }}>
                  {action.isEnabled ? "✓" : "○"}
                </span>
              </div>
              <div style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)"
              }}>
                {action.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="quick-actions">
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem"
      }}>
        <h2 style={{ 
          fontSize: "clamp(1.5rem, 4vw, 2rem)", 
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          color: "var(--text-primary)",
          fontWeight: "700"
        }}>
          ⚡ Snabbval
        </h2>
        
        {showCustomizeButton && (
          <button
            onClick={() => setIsCustomizing(true)}
            style={{
              padding: "0.5rem 1rem",
              background: "var(--secondary-green)",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.875rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--primary-green)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--secondary-green)";
            }}
          >
            ⚙️ Anpassa
          </button>
        )}
      </div>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "1.5rem"
      }}>
        {enabledActions.map(action => (
          <Link
            key={action.id}
            to={action.path}
            style={{
              background: "var(--card-background)",
              border: `2px solid ${action.color}`,
              textDecoration: "none",
              padding: "2rem 1.5rem",
              borderRadius: "20px",
              textAlign: "center",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "var(--shadow-small)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              minHeight: "140px",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 8px 32px ${action.color}40`;
              e.currentTarget.style.borderColor = action.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "var(--shadow-small)";
            }}
          >
            <div style={{ 
              fontSize: "2.5rem",
              lineHeight: 1
            }}>
              {action.icon}
            </div>
            <div>
              <div style={{ 
                fontSize: "1rem", 
                fontWeight: "700",
                color: "var(--text-primary)",
                marginBottom: "0.25rem"
              }}>
                {action.title}
              </div>
              <div style={{ 
                fontSize: "0.75rem", 
                color: "var(--text-secondary)",
                lineHeight: 1.3
              }}>
                {action.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
