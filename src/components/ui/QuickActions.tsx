import React, { useState, useEffect } from 'react';
import styles from './QuickActions.module.css';
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


  const getDefaultActions = React.useCallback((): QuickAction[] => {
    return defaultActions.map((action, index) => ({
      ...action,
      isEnabled: index < maxActions, // Aktivera de första actions som standard
      order: index
    }));
  }, [maxActions]);

  const loadUserPreferences = React.useCallback(() => {
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
  }, [user, isLeader, getDefaultActions]);

  useEffect(() => {
    loadUserPreferences();
  }, [loadUserPreferences]);

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
      <div className={styles['quick-actions-customizer']}>
        <div className={styles['quick-actions-customizer-header']}>
          <h3 className={styles['quick-actions-customizer-title']}>Anpassa snabbval</h3>
          <div className={styles['quick-actions-customizer-btns']}>
            <button
              onClick={resetToDefaults}
              className={`${styles['quick-actions-btn']} ${styles['quick-actions-btn-reset']}`}
            >
              Återställ
            </button>
            <button
              onClick={() => setIsCustomizing(false)}
              className={`${styles['quick-actions-btn']} ${styles['quick-actions-btn-done']}`}
            >
              Klar
            </button>
          </div>
        </div>
        <div className={styles['quick-actions-customizer-grid']}>
          {actions.map((action) => (
            <div
              key={action.id}
              className={
                `${styles['quick-actions-customizer-item']} ` +
                (action.isEnabled ? styles['quick-actions-customizer-item-enabled'] : styles['quick-actions-customizer-item-disabled']) +
                (action.isEnabled ? ` ${styles[`borderColor-${action.id}`]}` : '')
              }
              onClick={() => toggleAction(action.id)}
            >
              <div className={styles['quick-actions-customizer-item-row']}>
                <span className={styles['quick-actions-customizer-item-icon']}>{action.icon}</span>
                <span className={styles['quick-actions-customizer-item-title']}>{action.title}</span>
                <span className={
                  `${styles['quick-actions-customizer-item-status']} ` +
                  (action.isEnabled ? styles['quick-actions-customizer-item-status-enabled'] : styles['quick-actions-customizer-item-status-disabled'])
                }>
                  {action.isEnabled ? "✓" : "○"}
                </span>
              </div>
              <div className={styles['quick-actions-customizer-item-desc']}>{action.description}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles['quick-actions']}>
      <div className={styles['quick-actions-header']}>
        <h2 className={styles['quick-actions-title']}>⚡ Snabbval</h2>
        {showCustomizeButton && (
          <button
            onClick={() => setIsCustomizing(true)}
            className={`${styles['quick-actions-btn']} ${styles['quick-actions-btn-customize']}`}
          >
            ⚙️ Anpassa
          </button>
        )}
      </div>
      <div className={styles['quick-actions-grid']}>
        {enabledActions.map(action => (
          <Link
            key={action.id}
            to={action.path}
            className={styles['quick-actions-link']}
            style={{ borderColor: action.color, ['--hover-shadow-color' as any]: `${action.color}40` }}
          >
            <div className={styles['quick-actions-link-icon']}>{action.icon}</div>
            <div>
              <div className={styles['quick-actions-link-title']}>{action.title}</div>
              <div className={styles['quick-actions-link-desc']}>{action.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
