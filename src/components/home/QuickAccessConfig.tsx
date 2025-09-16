import React, { useState } from 'react';

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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1002,
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--card-background)',
        borderRadius: '20px',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ 
            color: 'var(--text-primary)', 
            marginBottom: '0.5rem',
            fontSize: '1.3rem',
            fontWeight: 700
          }}>
            ⚡ Anpassa snabbåtkomst
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.9rem',
            margin: 0
          }}>
            Välj 4 funktioner som ska visas på startsidan ({tempSelection.length}/4)
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          marginBottom: '2rem'
        }}>
          {availableItems.map(item => {
            const isSelected = tempSelection.includes(item.id);
            const canSelect = tempSelection.length < 4 || isSelected;
            
            return (
              <div
                key={item.id}
                onClick={() => canSelect && handleToggleItem(item.id)}
                style={{
                  background: isSelected 
                    ? `linear-gradient(135deg, ${item.color}20, ${item.color}10)`
                    : 'var(--card-background)',
                  border: isSelected 
                    ? `2px solid ${item.color}` 
                    : '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: canSelect ? 'pointer' : 'not-allowed',
                  opacity: canSelect ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <div style={{
                  fontSize: '1.5rem',
                  background: isSelected ? item.color : 'var(--text-secondary)',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  minWidth: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '0.25rem'
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {item.desc}
                  </div>
                </div>
                {isSelected && (
                  <div style={{
                    marginLeft: 'auto',
                    color: item.color,
                    fontSize: '1.2rem'
                  }}>
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Avbryt
          </button>
          <button
            onClick={handleSave}
            disabled={tempSelection.length !== 4}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: tempSelection.length === 4 
                ? 'var(--fbc-primary)' 
                : 'var(--text-secondary)',
              color: '#fff',
              fontWeight: 600,
              cursor: tempSelection.length === 4 ? 'pointer' : 'not-allowed',
              fontSize: '0.9rem',
              opacity: tempSelection.length === 4 ? 1 : 0.6
            }}
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
