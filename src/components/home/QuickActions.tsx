
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './QuickActions.module.css';

interface QuickAction {
  title: string;
  icon: string;
  path: string;
  description: string;
  gradient: string;
}


interface QuickActionsProps {
  quickActions: QuickAction[];
}


export const QuickActions: React.FC<QuickActionsProps> = ({ quickActions }) => {
  return (
    <section className={styles.snabbSection}>
      <h3 className={styles.snabbRubrik}>⚡ Snabbåtgärder</h3>
      <div className={styles.snabbGrid}>
        {quickActions.map((action: QuickAction, index: number) => (
          <Link
            key={index}
            to={action.path}
            className={styles.snabbLank}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-8px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div className={styles.snabbKort} data-shadow="medium">
              <div className={styles.snabbGradient} data-gradient={action.gradient} />
              <div className={styles.snabbIcon}>{action.icon}</div>
              <h4 className={styles.snabbKortRubrik}>{action.title}</h4>
              <p className={styles.snabbKortText}>{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
