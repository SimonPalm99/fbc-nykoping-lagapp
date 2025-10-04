
import React, { useState } from 'react';
import styles from './QuickAccessConfig.module.css';

interface QuickAccessItem {
  id: string;
  icon: string;
  label: string;
  path: string;
  desc: string;
  color: string;
}

const availableItems: QuickAccessItem[] = [
  { id: 'profile', icon: '👤', label: 'Min Profil', path: '/profile', desc: 'Hantera din profil', color: '#1976D2' },
  { id: 'statistics', icon: '📊', label: 'Statistik', path: '/statistics', desc: 'Se dina prestationer', color: '#2E7D32' },
  { id: 'forum', icon: '💬', label: 'Forum', path: '/forum', desc: 'Diskutera med laget', color: '#9C27B0' },
  { id: 'fines', icon: '💰', label: 'Böter', path: '/fines', desc: 'Kontrollera böter', color: '#FF5722' },
  { id: 'tactics', icon: '🎯', label: 'Taktik', path: '/tactics', desc: 'Spelstrategier', color: '#FF9800' },
  { id: 'training', icon: '🏃', label: 'Träning', path: '/training', desc: 'Träningspass', color: '#4CAF50' },
  { id: 'health', icon: '💪', label: 'Hälsa', path: '/health', desc: 'Hälsouppföljning', color: '#00BCD4' },
  { id: 'gamification', icon: '🏅', label: 'Utmärkelser', path: '/gamification', desc: 'Achievements', color: '#FFC107' },
  { id: 'league', icon: '🏆', label: 'Serier', path: '/league', desc: 'Tabeller & resultat', color: '#795548' },
  { id: 'chat', icon: '💬', label: 'Chat', path: '/chat', desc: 'Lagchat', color: '#607D8B' }
];

interface QuickAccessConfigProps {
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onClose: () => void;
}

const QuickAccessConfig: React.FC<QuickAccessConfigProps> = ({
  selectedItems,
  onSelectionChange,
  onClose
}) => {
  const [tempSelection, setTempSelection] = useState<string[]>(selectedItems);

  const handleToggleItem = (itemId: string) => {
    if (tempSelection.includes(itemId)) {
      setTempSelection(prev => prev.filter(id => id !== itemId));
    } else if (tempSelection.length < 4) {
      setTempSelection(prev => [...prev, itemId]);
    }
  };

  const handleSave = () => {
    onSelectionChange(tempSelection);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.kort}>
        <div className={styles.titel}>
          <h3 className={styles.titelRubrik}>
            ⚡ Anpassa snabbåtkomst
          </h3>
          <p className={styles.titelBeskrivning}>
            Välj 4 funktioner som ska visas på startsidan ({tempSelection.length}/4)
          </p>
        </div>

        <div className={styles.valGrid}>
          {availableItems.map(item => {
            const isSelected = tempSelection.includes(item.id);
            const canSelect = tempSelection.length < 4 || isSelected;

            // Flytta färg till data-attribut för CSS
            return (
              <div
                key={item.id}
                onClick={() => canSelect && handleToggleItem(item.id)}
                className={
                  `${styles.valKort} ` +
                  (isSelected ? styles.selected : styles.unselected) +
                  (!canSelect ? ' ' + styles.disabled : '')
                }
                data-selected={isSelected ? 'true' : 'false'}
                data-color={item.color}
              >
                <div
                  className={styles.valIcon}
                  data-selected={isSelected ? 'true' : 'false'}
                  data-color={item.color}
                >
                  {item.icon}
                </div>
                <div>
                  <div className={styles.valText}>{item.label}</div>
                  <div className={styles.valDesc}>{item.desc}</div>
                </div>
                {isSelected && (
                  <div
                    className={styles.valCheck}
                    data-color={item.color}
                  >
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.knappRad}>
          <button
            onClick={onClose}
            className={`${styles.knapp} ${styles.knappAvbryt}`}
          >
            Avbryt
          </button>
          <button
            onClick={handleSave}
            disabled={tempSelection.length !== 4}
            className={
              `${styles.knapp} ${styles.knappSpara}` +
              (tempSelection.length !== 4 ? ' ' + styles.disabled : '')
            }
          >
            Spara ({tempSelection.length}/4)
          </button>
        </div>
      </div>
    </div>
  );
};

export { availableItems };
export default QuickAccessConfig;
