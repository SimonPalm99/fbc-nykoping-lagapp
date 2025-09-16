import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    generateFeedItems();
  }, [user]);

  const generateFeedItems = () => {
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
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

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

  if (isLoading) {
    return (
      <div className="personal-feed-loading">
        <div className="skeleton-loader" style={{ height: '200px', borderRadius: '16px' }}></div>
      </div>
    );
  }

  return (
    <div className="personal-feed">
      {showHeader && (
        <div className="feed-header">
          <h3 style={{
            margin: "0 0 1.5rem 0",
            fontSize: "1.25rem",
            fontWeight: "700",
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            📱 Personlig feed
          </h3>
        </div>
      )}
      
      <div className="feed-items" style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxHeight: "400px",
        overflowY: "auto",
        paddingRight: "0.5rem"
      }}>
        {feedItems.map((item) => (
          <div
            key={item.id}
            className="feed-item"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              padding: "1rem",
              background: "var(--card-background)",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
              transition: "all 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              className="feed-icon"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${item.color}20, ${item.color}40)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                flexShrink: 0,
                border: `2px solid ${item.color}40`
              }}
            >
              {item.icon}
            </div>
            
            <div className="feed-content" style={{ flex: 1, minWidth: 0 }}>
              <div
                className="feed-title"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "0.25rem",
                  lineHeight: 1.4
                }}
              >
                {item.title}
              </div>
              
              <div
                className="feed-description"
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.4,
                  marginBottom: "0.5rem"
                }}
              >
                {item.description}
              </div>
              
              <div
                className="feed-timestamp"
                style={{
                  fontSize: "0.6875rem",
                  color: "var(--text-muted)",
                  fontWeight: "500",
                  textTransform: "uppercase",
                  letterSpacing: "0.025em"
                }}
              >
                {formatTimestamp(item.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {feedItems.length === 0 && (
        <div
          className="feed-empty"
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "var(--text-secondary)",
            fontSize: "0.875rem"
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📱</div>
          <div>Ingen aktivitet än. Din personliga feed kommer att fyllas på när du använder appen!</div>
        </div>
      )}
    </div>
  );
};

export default PersonalFeed;
