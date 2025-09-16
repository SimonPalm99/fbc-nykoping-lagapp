import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  action,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'empty-state-sm',
    md: 'empty-state-md',
    lg: 'empty-state-lg'
  };

  return (
    <div className={`empty-state ${sizeClasses[size]} ${className}`}>
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && (
        <p className="empty-state-description">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className={`empty-state-action ${action.variant === 'secondary' ? 'secondary' : 'primary'}`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

// Pre-built empty states for common scenarios
export const NoActivities: React.FC<{ onCreateActivity?: () => void }> = ({ onCreateActivity }) => (
  <EmptyState
    icon="📅"
    title="Inga aktiviteter"
    description="Det finns inga aktiviteter att visa. Skapa en ny aktivitet för att komma igång."
    {...(onCreateActivity && {
      action: {
        label: "Skapa aktivitet",
        onClick: onCreateActivity,
        variant: "primary"
      }
    })}
  />
);

export const NoMessages: React.FC = () => (
  <EmptyState
    icon="💬"
    title="Inga meddelanden"
    description="Starta en konversation genom att skriva ditt första meddelande."
    size="sm"
  />
);

export const NoStats: React.FC = () => (
  <EmptyState
    icon="📊"
    title="Ingen statistik tillgänglig"
    description="Statistik kommer att visas här när data finns tillgänglig."
    size="sm"
  />
);

export const NoResults: React.FC<{ searchTerm?: string }> = ({ searchTerm }) => (
  <EmptyState
    icon="🔍"
    title="Inga resultat"
    description={searchTerm ? `Inga resultat hittades för "${searchTerm}".` : "Inga resultat hittades."}
    size="sm"
  />
);

export const NoConnection: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <EmptyState
    icon="🌐"
    title="Ingen internetanslutning"
    description="Kontrollera din internetanslutning och försök igen."
    {...(onRetry && {
      action: {
        label: "Försök igen",
        onClick: onRetry,
        variant: "primary"
      }
    })}
  />
);

export const ErrorState: React.FC<{ onRetry?: () => void; message?: string }> = ({ 
  onRetry, 
  message = "Ett fel uppstod när data skulle hämtas." 
}) => (
  <EmptyState
    icon="⚠️"
    title="Något gick fel"
    description={message}
    {...(onRetry && {
      action: {
        label: "Försök igen",
        onClick: onRetry,
        variant: "primary"
      }
    })}
  />
);
