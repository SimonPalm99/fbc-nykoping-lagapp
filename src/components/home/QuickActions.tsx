import React from 'react';
import { Link } from 'react-router-dom';

interface QuickAction {
  title: string;
  icon: string;
  path: string;
  description: string;
  gradient: string;
}

interface QuickActionsProps {
  styles: any;
  quickActions: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ styles, quickActions }) => {
  return (
    <section style={{ padding: "2rem 1.5rem 1rem" }}>
      <h3 style={{
        ...styles.typography.heading,
        color: styles.textPrimary,
        marginBottom: "1.5rem",
        fontSize: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem"
      }}>
        ⚡ Snabbåtgärder
      </h3>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {quickActions.map((action, index) => (
          <Link 
            key={index}
            to={action.path}
            style={{
              textDecoration: "none",
              display: "block",
              transform: "translateY(0)",
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              background: styles.gradients.card,
              border: `2px solid ${styles.borderColor}`,
              borderRadius: "20px",
              padding: "2rem",
              textAlign: "center",
              boxShadow: styles.shadows.medium,
              position: "relative",
              overflow: "hidden",
              backdropFilter: "blur(10px)"
            }}>
              {/* Gradient overlay */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: action.gradient
              }} />
              
              {/* Icon */}
              <div style={{
                fontSize: "3rem",
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80px"
              }}>
                {action.icon}
              </div>
              
              {/* Content */}
              <h4 style={{
                ...styles.typography.heading,
                color: styles.textPrimary,
                marginBottom: "0.75rem",
                fontSize: "1.25rem"
              }}>
                {action.title}
              </h4>
              
              <p style={{
                ...styles.typography.body,
                color: styles.textSecondary,
                margin: 0,
                fontSize: "0.95rem",
                lineHeight: "1.4"
              }}>
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
