import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Fine, Payment } from '../../types/fine';
import './PaymentManager.css';

interface PaymentManagerProps {
  fines: Fine[];
  onPaymentComplete: (paymentId: string) => void;
}

export const PaymentManager: React.FC<PaymentManagerProps> = ({ 
  fines, 
  onPaymentComplete
}) => {
  const { user } = useAuth();
  
  // Mock users data
  const users = [
    { id: 'user1', name: 'Erik Andersson', email: 'erik@example.com', role: 'player', isActive: true },
    { id: 'user2', name: 'Anna Svensson', email: 'anna@example.com', role: 'player', isActive: true },
    { id: 'user3', name: 'Marcus Berg', email: 'marcus@example.com', role: 'player', isActive: true },
    { id: 'user4', name: 'Lisa Karlsson', email: 'lisa@example.com', role: 'leader', isActive: true },
  ];
  const [selectedFines, setSelectedFines] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'swish' | 'kontant' | 'banköverföring'>('swish');
  const [paymentReference, setPaymentReference] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [filterUserId, setFilterUserId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'paid'>('pending');

  const unpaidFines = fines.filter(fine => !fine.paid && fine.status !== 'waived');

  const filteredFines = unpaidFines.filter(fine => {
    const userMatch = filterUserId === 'all' || fine.playerId === filterUserId;
    const statusMatch = filterStatus === 'all' || fine.status === filterStatus;
    return userMatch && statusMatch;
  });

  const selectedFinesData = fines.filter(fine => selectedFines.includes(fine.id));
  const totalSelectedAmount = selectedFinesData.reduce((sum, fine) => sum + fine.amount, 0);

  const handleToggleFine = (fineId: string) => {
    setSelectedFines(prev => 
      prev.includes(fineId) 
        ? prev.filter(id => id !== fineId)
        : [...prev, fineId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFines.length === filteredFines.length) {
      setSelectedFines([]);
    } else {
      setSelectedFines(filteredFines.map(fine => fine.id));
    }
  };

  const handleProcessPayment = () => {
    if (!user || selectedFines.length === 0) return;

    const payment: Payment = {
      id: Date.now().toString(),
      playerId: selectedFinesData[0]!.playerId,
      amount: totalSelectedAmount,
      date: new Date().toISOString(),
      fineIds: selectedFines,
      createdBy: user.id,
      paymentMethod,
      notes: `Betalning av ${selectedFines.length} böter via ${paymentMethod}`
    };

    // Lägg till reference bara om det finns
    if (paymentReference) {
      payment.reference = paymentReference;
    }

    // Update fines (for demonstration - in real app this would be handled by backend)
    fines.forEach(fine => {
      if (selectedFines.includes(fine.id)) {
        fine.paid = true;
        fine.status = 'paid' as const;
        fine.paidDate = new Date().toISOString();
        fine.paidAmount = fine.amount;
        // Add payment method and reference if available
        if (paymentMethod) fine.paymentMethod = paymentMethod;
        if (paymentReference) fine.paymentReference = paymentReference;
      }
    });

    onPaymentComplete(payment.id);
    setSelectedFines([]);
    setPaymentReference('');
    setShowPaymentModal(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  const getUserName = (userId: string) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser ? foundUser.name : 'Okänd användare';
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'swish': return '📱';
      case 'kontant': return '💵';
      case 'banköverföring': return '🏦';
      default: return '💳';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'paid': return '💚';
      case 'waived': return '❌';
      case 'disputed': return '⚠️';
      default: return '❓';
    }
  };

  return (
    <div className="payment-manager">
      <div className="payment-header">
        <h2>Betalningshantering</h2>
        <div className="payment-summary">
          <span className="summary-text">
            Obetalt totalt: {formatCurrency(unpaidFines.reduce((sum, fine) => sum + fine.amount, 0))}
          </span>
        </div>
      </div>

      <div className="payment-filters">
        <div className="filter-group">
          <label>Spelare:</label>
          <select
            value={filterUserId}
            onChange={(e) => setFilterUserId(e.target.value)}
          >
            <option value="all">Alla spelare</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="all">Alla status</option>
            <option value="pending">Väntande</option>
            <option value="approved">Godkända</option>
            <option value="paid">Betalda</option>
          </select>
        </div>

        {selectedFines.length > 0 && (
          <div className="selected-summary">
            <span>
              {selectedFines.length} valda - {formatCurrency(totalSelectedAmount)}
            </span>
            <button
              className="btn btn-primary"
              onClick={() => setShowPaymentModal(true)}
            >
              💳 Behandla betalning
            </button>
          </div>
        )}
      </div>

      <div className="fines-list">
        <div className="list-header">
          <div className="select-all">
            <input
              type="checkbox"
              checked={selectedFines.length === filteredFines.length && filteredFines.length > 0}
              onChange={handleSelectAll}
            />
            <label>Välj alla ({filteredFines.length})</label>
          </div>
        </div>

        <div className="fines-grid">
          {filteredFines.map((fine) => (
            <div 
              key={fine.id} 
              className={`fine-card ${selectedFines.includes(fine.id) ? 'selected' : ''}`}
              onClick={() => handleToggleFine(fine.id)}
            >
              <div className="fine-header">
                <div className="fine-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedFines.includes(fine.id)}
                    onChange={() => handleToggleFine(fine.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="fine-status">
                  {getStatusIcon(fine.status)}
                  <span className="status-text">{fine.status}</span>
                </div>
                <div className="fine-amount">
                  {formatCurrency(fine.amount)}
                </div>
              </div>

              <div className="fine-content">
                <h4 className="fine-player">{getUserName(fine.playerId)}</h4>
                <p className="fine-type">{fine.type.name}</p>
                <p className="fine-reason">{fine.reason}</p>
                
                <div className="fine-meta">
                  <span className="fine-date">📅 {formatDate(fine.date)}</span>
                  <span className="fine-category">🏷️ {fine.category}</span>
                </div>

                {fine.dueDate && (
                  <div className="fine-due-date">
                    <span className="due-label">Förfallodatum:</span>
                    <span className="due-date">{formatDate(fine.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredFines.length === 0 && (
          <div className="no-fines">
            <div className="no-fines-icon">💚</div>
            <h3>Inga böter att visa</h3>
            <p>
              {filterStatus === 'pending' 
                ? 'Alla böter är betalda eller godkända!'
                : 'Inga böter matchar de valda filtren.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Behandla betalning</h3>
              <button
                className="modal-close"
                onClick={() => setShowPaymentModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="payment-summary-section">
                <h4>Betalningssammanfattning</h4>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Antal böter:</span>
                    <span>{selectedFines.length} st</span>
                  </div>
                  <div className="summary-row">
                    <span>Totalt belopp:</span>
                    <span className="total-amount">{formatCurrency(totalSelectedAmount)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Spelare:</span>
                    <span>{getUserName(selectedFinesData[0]?.playerId || '')}</span>
                  </div>
                </div>
              </div>

              <div className="payment-method-section">
                <h4>Betalningsmetod</h4>
                <div className="payment-methods">
                  {(['swish', 'kontant', 'banköverföring'] as const).map((method) => (
                    <button
                      key={method}
                      className={`payment-method-btn ${paymentMethod === method ? 'active' : ''}`}
                      onClick={() => setPaymentMethod(method)}
                    >
                      <span className="method-icon">{getPaymentMethodIcon(method)}</span>
                      <span className="method-name">{method.charAt(0).toUpperCase() + method.slice(1)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="payment-reference-section">
                <h4>Referens (valfritt)</h4>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="Referensnummer, kvittonummer etc."
                  className="reference-input"
                />
              </div>

              <div className="selected-fines-section">
                <h4>Valda böter</h4>
                <div className="selected-fines-list">
                  {selectedFinesData.map((fine) => (
                    <div key={fine.id} className="selected-fine-item">
                      <span className="fine-type-name">{fine.type.name}</span>
                      <span className="fine-amount">{formatCurrency(fine.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowPaymentModal(false)}
              >
                Avbryt
              </button>
              <button
                className="btn btn-primary"
                onClick={handleProcessPayment}
                disabled={selectedFines.length === 0}
              >
                💳 Bekräfta betalning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManager;
