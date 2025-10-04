import React, { useState, useEffect } from 'react';
import styles from './PersonalFeed.module.css';
import { useAuth } from '../../context/AuthContext';

interface FeedItem {
  id: string;
  type: 'activity' | 'stat' | 'achievement' | 'training' | 'forum' | 'fine';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
  data?: any;
}

interface PersonalFeedProps {
  maxItems?: number;
  showHeader?: boolean;
}

export const PersonalFeed: React.FC<PersonalFeedProps> = ({ 
  maxItems = 10, 
  showHeader = true 
}) => {
  const { user } = useAuth();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  const generateFeedItems = React.useCallback(() => {
    // Mock personlig feed data baserat på användarens aktiviteter
    const mockFeedItems: FeedItem[] = [
      {
        id: '1',
        type: 'training',
        title: 'Personlig träning registrerad',
        description: 'Du loggade teknikträning i 45 minuter med intensitet 4/5',
        timestamp: '2025-06-28T08:30:00Z',
        icon: '💪',
        color: '#22c55e'
      },
      {
        id: '2',
        type: 'achievement',
        title: 'Ny milstolpe!',
        description: 'Du har nått 50 träningar! 🎉',
        timestamp: '2025-06-27T19:15:00Z',
        icon: '🏆',
        color: '#f59e0b'
      },
      {
        id: '3',
        type: 'activity',
        title: 'Kommande match',
        description: 'Match mot Södermalm IBF imorgon 14:00',
        timestamp: '2025-06-27T12:00:00Z',
        icon: '🏒',
        color: '#ef4444'
      },
      {
        id: '4',
        type: 'stat',
        title: 'Ny statistik tillagd',
        description: '2 mål och 1 assist från senaste matchen',
        timestamp: '2025-06-26T22:30:00Z',
        icon: '📊',
        color: '#3b82f6'
      },
      {
        id: '5',
        type: 'forum',
        title: 'Nytt inlägg i forumet',
        description: 'Någon kommenterade på "Träningsupplägget nästa vecka"',
        timestamp: '2025-06-26T16:45:00Z',
        icon: '💬',
        color: '#8b5cf6'
      },
      {
        id: '6',
        type: 'fine',
        title: 'Böter betalda',
        description: 'Du betalade 50 kr för försenad frånvaroanmälan',
        timestamp: '2025-06-25T14:20:00Z',
        icon: '💰',
        color: '#f97316'
      }
    ];

    // Sortera efter timestamp
    const sortedItems = mockFeedItems.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    setFeedItems(sortedItems.slice(0, maxItems));
    setIsLoading(false);
  }, [maxItems]);

  useEffect(() => {
    generateFeedItems();
  }, [user, generateFeedItems]);

  const formatTimestamp = (timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just nu';
    } else if (diffInHours < 24) {
      return `${diffInHours}h sedan`;
    } else if (diffInHours < 48) {
      return 'Igår';
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} dagar sedan`;
    }
  };


      useEffect(() => {
        generateFeedItems();
      }, [generateFeedItems]);
  if (isLoading) {
    return (
      <div className={styles['personal-feed-loading']}>
  <div className={`${styles['skeleton-loader']} ${styles['skeleton-loader-large']}`}></div>
      </div>
    );
  }

  return (
    <div className={styles['personal-feed']}>
      {showHeader && (
        <div className={styles['feed-header']}>
          <h3>📱 Personlig feed</h3>
        </div>
      )}
      <div className={styles['feed-items']}>
        {feedItems.map((item) => (
          <div
            key={item.id}
            className={`${styles['feed-item']} ${styles['feed-item-bg']}`}
          >
            <div
              className={`${styles['feed-icon']} ${styles[`feed-icon-color-${item.color.replace('#', '')}`]}`}
            >
              {item.icon}
            </div>
            <div className={styles['feed-content']}>
              <div className={styles['feed-title']}>{item.title}</div>
              <div className={styles['feed-description']}>{item.description}</div>
              <div className={styles['feed-timestamp']}>{formatTimestamp(item.timestamp)}</div>
            </div>
          </div>
        ))}
      </div>
      {feedItems.length === 0 && (
        <div className={styles['feed-empty']}>
          <div className={styles['feed-empty-icon']}>📱</div>
          <div className={styles['feed-empty-text']}>Ingen aktivitet än. Din personliga feed kommer att fyllas på när du använder appen!</div>
        </div>
      )}
    </div>
  );
};

export default PersonalFeed;
