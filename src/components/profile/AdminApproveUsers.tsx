import React, { useState } from "react";
import type { User } from "../../types/user";
import './AdminApproveUsers.css';

interface Props {
  users: User[];
  onApprove: (userId: string) => void;
  onReject?: (userId: string, reason: string) => void;
}

const AdminApproveUsers: React.FC<Props> = ({ users, onApprove, onReject }) => {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  
  const pending = users.filter((u) => !u.isApproved);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Okänt';
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (birthday?: string) => {
    if (!birthday) return 'Okänd';
    const birth = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} år`;
  };

  const handleReject = (userId: string) => {
    if (onReject && rejectReason.trim()) {
      onReject(userId, rejectReason);
      setShowRejectModal(null);
      setRejectReason('');
    }
  };

  if (pending.length === 0) {
    return (
      <div className="admin-approve-users">
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>Alla användare är godkända</h3>
          <p>Det finns inga väntande användarregistreringar att granska.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-approve-users">
      <div className="header">
        <h2>
          <span className="icon">👥</span>
          Väntande godkännanden
        </h2>
        <div className="badge">
          {pending.length} {pending.length === 1 ? 'användare' : 'användare'}
        </div>
      </div>

      <div className="users-list">
        {pending.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-header" onClick={() => 
              setExpandedUser(expandedUser === user.id ? null : user.id)
            }>
              <div className="user-basic-info">
                <div className="user-avatar">
                  {user.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user.name} 
                      onError={e => { e.currentTarget.src = '/default-avatar.png'; }}
                    />
                  ) : (
                    <img 
                      src="/default-avatar.png" 
                      alt={user.name} 
                    />
                  )}
                </div>
                
                <div className="user-details">
                  <h3>
                    {user.name}
                    {user.role === 'leader' && <span className="role-badge leader">👑 Ledare</span>}
                    {user.role === 'player' && <span className="role-badge player">🏒 Spelare</span>}
                    {user.role === 'admin' && <span className="role-badge admin">⚡ Admin</span>}
                  </h3>
                  <div className="user-meta">
                    <span>#{user.jerseyNumber}</span>
                    <span>{user.favoritePosition || 'Ej angiven'}</span>
                    <span>{calculateAge(user.birthday)}</span>
                  </div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>

              <div className="expand-arrow">
                {expandedUser === user.id ? '▲' : '▼'}
              </div>
            </div>

            {expandedUser === user.id && (
              <div className="user-expanded">
                <div className="user-info-grid">
                  <div className="info-section">
                    <h4>📞 Kontaktuppgifter</h4>
                    <div className="info-item">
                      <span className="label">Telefon:</span>
                      <span>{user.phone || 'Ej angiven'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Registrerad:</span>
                      <span>{formatDate(user.joinDate)}</span>
                    </div>
                  </div>

                  {user.iceContacts && user.iceContacts.length > 0 && (
                    <div className="info-section">
                      <h4>🚨 Nödkontakt</h4>
                      {user.iceContacts.map((contact, index) => (
                        <div key={index} className="emergency-contact">
                          <div className="info-item">
                            <span className="label">Namn:</span>
                            <span>{contact.name}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Relation:</span>
                            <span>{contact.relation}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Telefon:</span>
                            <span>
                              <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {user.about && (
                    <div className="info-section full-width">
                      <h4>💭 Om spelaren</h4>
                      <p className="about-text">"{user.about}"</p>
                    </div>
                  )}
                </div>

                <div className="action-buttons">
                  <button
                    className="approve-btn"
                    onClick={() => onApprove(user.id)}
                  >
                    ✅ Godkänn användare
                  </button>
                  
                  {onReject && (
                    <button
                      className="reject-btn"
                      onClick={() => setShowRejectModal(user.id)}
                    >
                      ❌ Avvisa
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="reject-modal">
            <h3>Avvisa användare</h3>
            <p>Ange en anledning för avvisandet:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="T.ex. Felaktiga uppgifter, dubblettregistrering..."
              rows={4}
            />
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason('');
                }}
              >
                Avbryt
              </button>
              <button
                className="confirm-reject-btn"
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectReason.trim()}
              >
                Avvisa användare
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApproveUsers;