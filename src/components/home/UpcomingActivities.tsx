import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from '../../types/activity';

interface UpcomingActivitiesProps {
  styles: any;
  activities: Activity[];
}

export const UpcomingActivities: React.FC<UpcomingActivitiesProps> = ({ styles, activities }) => {
  // Visa endast de 3 närmaste aktiviteterna
  const nearestActivities = activities.slice(0, 3);

  return (
    <section style={{ padding: "1rem 1.5rem 2rem" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem"
      }}>
        <h3 style={{
          ...styles.typography.heading,
          color: styles.textPrimary,
          fontSize: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          margin: 0
        }}>
          📅 Kommande aktiviteter
        </h3>
        
        <Link 
          to="/activities"
          style={{
            ...styles.typography.body,
            color: styles.primaryGreen,
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: "600",
            padding: "0.5rem 1rem",
            borderRadius: "12px",
            border: `2px solid ${styles.primaryGreen}`,
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = styles.primaryGreen;
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = styles.primaryGreen;
          }}
        >
          Visa alla →
        </Link>
      </div>

      {nearestActivities.length === 0 ? (
        <div style={{
          background: styles.gradients.card,
          border: `2px solid ${styles.borderColor}`,
          borderRadius: "16px",
          padding: "3rem 2rem",
          textAlign: "center",
          boxShadow: styles.shadows.small
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📅</div>
          <h4 style={{
            ...styles.typography.heading,
            color: styles.textPrimary,
            marginBottom: "0.5rem",
            fontSize: "1.2rem"
          }}>
            Inga kommande aktiviteter
          </h4>
          <p style={{
            ...styles.typography.body,
            color: styles.textSecondary,
            margin: 0
          }}>
            Nya aktiviteter kommer snart att läggas till
          </p>
        </div>
      ) : (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
          {nearestActivities.map((activity) => (
            <div
              key={activity.id}
              style={{
                background: styles.gradients.card,
                border: `2px solid ${styles.borderColor}`,
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: styles.shadows.small,
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Type indicator */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: activity.type === 'match' 
                  ? "linear-gradient(135deg, #f44336, #d32f2f)"
                  : activity.type === 'träning'
                  ? "linear-gradient(135deg, #4caf50, #388e3c)"
                  : "linear-gradient(135deg, #2196f3, #1976d2)"
              }} />

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1rem"
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.75rem"
                  }}>
                    <span style={{
                      fontSize: "1.5rem"
                    }}>
                      {activity.type === 'match' ? '⚽' : 
                       activity.type === 'träning' ? '🏃‍♂️' : '📅'}
                    </span>
                    <h4 style={{
                      ...styles.typography.heading,
                      color: styles.textPrimary,
                      margin: 0,
                      fontSize: "1.1rem"
                    }}>
                      {activity.title}
                    </h4>
                    <span style={{
                      background: activity.type === 'match' 
                        ? "rgba(244, 67, 54, 0.1)" 
                        : activity.type === 'träning'
                        ? "rgba(76, 175, 80, 0.1)"
                        : "rgba(33, 150, 243, 0.1)",
                      color: activity.type === 'match' 
                        ? "#f44336" 
                        : activity.type === 'träning'
                        ? "#4caf50" 
                        : "#2196f3",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: "600"
                    }}>
                      {activity.type.toUpperCase()}
                    </span>
                  </div>
                  
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.9rem",
                      color: styles.textSecondary
                    }}>
                      <span>📅</span>
                      <span>{new Date(activity.date).toLocaleDateString('sv-SE', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.9rem",
                      color: styles.textSecondary
                    }}>
                      <span>⏰</span>
                      <span>{activity.startTime} - {activity.endTime}</span>
                    </div>
                    
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.9rem",
                      color: styles.textSecondary
                    }}>
                      <span>📍</span>
                      <span>{activity.location}</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <span style={{
                    background: styles.gradients.primary,
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "12px",
                    fontSize: "0.8rem",
                    fontWeight: "600"
                  }}>
                    {Math.ceil((new Date(activity.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dagar
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
