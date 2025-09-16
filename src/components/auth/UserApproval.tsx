import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoadingButton } from '../ui/LoadingButton';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/EmptyState';

interface UserApprovalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserApproval: React.FC<UserApprovalProps> = ({
  isOpen,
  onClose
}) => {
  const { getPendingUsers, approveUser, canApproveUsers } = useAuth();
  const [loadingUsers, setLoadingUsers] = useState<{ [key: string]: boolean }>({});
  
  const pendingUsers = getPendingUsers();

  if (!canApproveUsers()) {
    return null;
  }

  const handleApprove = async (userId: string) => {
    setLoadingUsers(prev => ({ ...prev, [userId]: true }));
    try {
      await approveUser(userId);
    } finally {
      setLoadingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Godkänn användare" size="lg">
      <div className="user-approval">
        {pendingUsers.length === 0 ? (
          <EmptyState
            icon="👥"
            title="Inga väntande ansökningar"
            description="Det finns inga användare som väntar på godkännande just nu."
          />
        ) : (
          <div className="pending-users">
            <p className="approval-info">
              Granska och godkänn nya medlemmar som ansökt om att gå med i laget.
            </p>
            
            {pendingUsers.map((user) => (
              <div key={user.id} className="pending-user-card">
                <div className="user-header">
                  <div className="user-basic-info">
                    <h3>{user.name}</h3>
                    <span className="user-email">{user.email}</span>
                    <span className="registration-date">
                      Ansökte {formatDate(user.createdAt)}
                    </span>
                  </div>
                  <div className="approval-actions">
                    <LoadingButton
                      onClick={() => handleApprove(user.id)}
                      loading={loadingUsers[user.id] || false}
                      className="btn btn-primary btn-sm"
                    >
                      Godkänn
                    </LoadingButton>
                  </div>
                </div>

                <div className="user-details">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <strong>Position:</strong>
                      <span>{user.position}</span>
                    </div>
                    
                    {user.favoritePosition && (
                      <div className="detail-item">
                        <strong>Favoritposition:</strong>
                        <span>{user.favoritePosition}</span>
                      </div>
                    )}
                    
                    {user.jerseyNumber && (
                      <div className="detail-item">
                        <strong>Önskat tröjnummer:</strong>
                        <span>{user.jerseyNumber}</span>
                      </div>
                    )}
                    
                    {user.phone && (
                      <div className="detail-item">
                        <strong>Telefon:</strong>
                        <span>{user.phone}</span>
                      </div>
                    )}
                    
                    {user.previousClubs && user.previousClubs.length > 0 && (
                      <div className="detail-item">
                        <strong>Tidigare klubbar:</strong>
                        <span>{user.previousClubs.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {user.aboutMe && (
                    <div className="about-section">
                      <strong>Om spelaren:</strong>
                      <p>{user.aboutMe}</p>
                    </div>
                  )}

                  {user.emergencyContact && (
                    <div className="emergency-contact">
                      <strong>Nödkontakt:</strong>
                      <div className="contact-info">
                        <span>{user.emergencyContact.name}</span>
                        <span>{user.emergencyContact.phone}</span>
                        <span>({user.emergencyContact.relation})</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
