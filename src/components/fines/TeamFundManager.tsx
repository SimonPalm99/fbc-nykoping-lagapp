import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TeamFund, FundTransaction, FundAllocation } from '../../types/fine';
import styles from './TeamFundManager.module.css';

interface TeamFundManagerProps {
  fund: TeamFund;
  onUpdateFund: (fund: TeamFund) => void;
  userRole: string;
}

export const TeamFundManager: React.FC<TeamFundManagerProps> = ({ fund, onUpdateFund, userRole }) => {
  const { user } = useAuth();
  const isLeader = userRole === 'leader' || userRole === 'admin';
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'allocations' | 'expenses'>('overview');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<FundTransaction>>({
    type: 'income',
    amount: 0,
    description: '',
    category: 'böter',
    date: new Date().toISOString().split('T')[0]!
  });
  const [newAllocation, setNewAllocation] = useState<Partial<FundAllocation>>({
    purpose: '',
    budgetAmount: 0,
    isActive: true
  });

  const handleAddTransaction = () => {
    if (!user || !newTransaction.amount || !newTransaction.description) return;

    const transaction: FundTransaction = {
      id: Date.now().toString(),
      type: newTransaction.type as 'income' | 'expense',
      amount: newTransaction.amount!,
      description: newTransaction.description!,
      date: newTransaction.date || new Date().toISOString().split('T')[0]!,
      category: newTransaction.category as any,
      approvedBy: user.id
    };

    // Lägg till reference bara om det finns
    if (newTransaction.reference) {
      transaction.reference = newTransaction.reference;
    }

    const updatedFund = {
      ...fund,
      transactions: [...fund.transactions, transaction],
      currentBalance: transaction.type === 'income' 
        ? fund.currentBalance + transaction.amount 
        : fund.currentBalance - transaction.amount,
      totalAmount: transaction.type === 'income' 
        ? fund.totalAmount + transaction.amount 
        : fund.totalAmount,
      lastUpdated: new Date().toISOString()
    };

    onUpdateFund(updatedFund);
    setNewTransaction({
      type: 'income',
      amount: 0,
      description: '',
      category: 'böter',
      date: new Date().toISOString().split('T')[0]!
    });
    setShowTransactionModal(false);
  };

  const handleAddAllocation = () => {
    if (!user || !newAllocation.purpose || !newAllocation.budgetAmount) return;

    const allocation: FundAllocation = {
      id: Date.now().toString(),
      purpose: newAllocation.purpose,
      budgetAmount: newAllocation.budgetAmount,
      spentAmount: 0,
      isActive: true,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };

    const updatedFund = {
      ...fund,
      allocations: [...fund.allocations, allocation],
      lastUpdated: new Date().toISOString()
    };

    onUpdateFund(updatedFund);
    setNewAllocation({
      purpose: '',
      budgetAmount: 0,
      isActive: true
    });
    setShowAllocationModal(false);
  };

  const getTransactionsByCategory = () => {
    const categories = fund.transactions.reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = { income: 0, expense: 0, count: 0 };
      }
      const categoryData = acc[category];
      if (categoryData) {
        categoryData[transaction.type] += transaction.amount;
        categoryData.count += 1;
      }
      return acc;
    }, {} as Record<string, { income: number; expense: number; count: number }>);

    return categories;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount);
  };

  return (
  <div className={styles.teamFundManager}>
  <div className={styles.fundHeader}>
        <h2>Lagkassa</h2>
  <div className={styles.fundBalance}>
          <span className={styles.balanceLabel}>Saldo:</span>
          <span className={styles.balanceAmount}>{formatCurrency(fund.currentBalance)}</span>
        </div>
      </div>

  <div className={styles.fundTabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Översikt
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'transactions' ? styles.active : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          💰 Transaktioner
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'allocations' ? styles.active : ''}`}
          onClick={() => setActiveTab('allocations')}
        >
          📋 Budget
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'expenses' ? styles.active : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          🧾 Utgifter
        </button>
      </div>

  <div className={styles.fundContent}>
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="overview-cards">
              <div className="overview-card">
                <div className="card-icon">💰</div>
                <div className="card-content">
                  <h3>Total inkomst</h3>
                  <p className="card-value">{formatCurrency(fund.totalAmount)}</p>
                </div>
              </div>

              <div className="overview-card">
                <div className="card-icon">📊</div>
                <div className="card-content">
                  <h3>Aktuellt saldo</h3>
                  <p className="card-value">{formatCurrency(fund.currentBalance)}</p>
                </div>
              </div>

              <div className="overview-card">
                <div className="card-icon">🎯</div>
                <div className="card-content">
                  <h3>Budgeterade medel</h3>
                  <p className="card-value">
                    {formatCurrency(fund.allocations.reduce((sum, a) => sum + a.budgetAmount, 0))}
                  </p>
                </div>
              </div>

              <div className="overview-card">
                <div className="card-icon">🧾</div>
                <div className="card-content">
                  <h3>Spenderat</h3>
                  <p className="card-value">
                    {formatCurrency(fund.allocations.reduce((sum, a) => sum + a.spentAmount, 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="category-breakdown">
              <h3>Fördelning per kategori</h3>
              <div className="category-list">
                {Object.entries(getTransactionsByCategory()).map(([category, data]) => (
                  <div key={category} className="category-item">
                    <div className="category-info">
                      <span className="category-name">{category}</span>
                      <span className="category-count">{data.count} transaktioner</span>
                    </div>
                    <div className="category-amounts">
                      <span className="income">+{formatCurrency(data.income)}</span>
                      {data.expense > 0 && <span className="expense">-{formatCurrency(data.expense)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-section">
            <div className="section-header">
              <h3>Transaktioner</h3>
              {isLeader && (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowTransactionModal(true)}
                >
                  ➕ Ny transaktion
                </button>
              )}
            </div>

            <div className="transactions-list">
              {fund.transactions.map((transaction) => (
                <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                  <div className="transaction-info">
                    <div className="transaction-header">
                      <span className="transaction-description">{transaction.description}</span>
                      <span className={`transaction-amount ${transaction.type}`}>
                        {transaction.type === 'income' ? '+ ' : '- '}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                    <div className="transaction-meta">
                      <span className="transaction-date">{transaction.date}</span>
                      <span className="transaction-category">{transaction.category}</span>
                      {transaction.reference && (
                        <span className="transaction-reference">Ref: {transaction.reference}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'allocations' && (
          <div className="allocations-section">
            <div className="section-header">
              <h3>Budgetallokering</h3>
              {isLeader && (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAllocationModal(true)}
                >
                  ➕ Ny budget
                </button>
              )}
            </div>

            <div className="allocations-list">
              {fund.allocations.map((allocation) => (
                <div key={allocation.id} className="allocation-item">
                  <div className="allocation-info">
                    <h4>{allocation.purpose}</h4>
                    <div className="allocation-progress">
                      <div className="progress-bar">
                        <div
                          className={styles.progressFill + ' ' + styles[`progressFill${Math.round(Math.min((allocation.spentAmount / allocation.budgetAmount) * 100, 100))}`]}
                          aria-label={`Progress: ${Math.min((allocation.spentAmount / allocation.budgetAmount) * 100, 100)}%`}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {formatCurrency(allocation.spentAmount)} / {formatCurrency(allocation.budgetAmount)}
                      </span>
                    </div>
                  </div>
                  <div className="allocation-status">
                    {allocation.isActive ? (
                      <span className="status active">Aktiv</span>
                    ) : (
                      <span className="status inactive">Inaktiv</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Ny transaktion</h3>
              <button
                className="modal-close"
                onClick={() => setShowTransactionModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Typ</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as 'income' | 'expense'})}
                  className={styles.input}
                  title="Välj typ av transaktion"
                >
                  <option value="income">Inkomst</option>
                  <option value="expense">Utgift</option>
                </select>
              </div>

              <div className="form-group">
                <label>Kategori</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value as any})}
                  className={styles.input}
                  title="Välj kategori"
                >
                  <option value="böter">Böter</option>
                  <option value="sponsring">Sponsring</option>
                  <option value="försäljning">Försäljning</option>
                  <option value="utgift">Utgift</option>
                  <option value="övrigt">Övrigt</option>
                </select>
              </div>

              <div className="form-group">
                <label>Belopp (SEK)</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                  title="Belopp (SEK)"
                />
              </div>

              <div className="form-group">
                <label>Beskrivning</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  placeholder="Beskrivning av transaktionen"
                />
              </div>

              <div className="form-group">
                <label>Datum</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  title="Datum"
                  placeholder="Datum"
                />
              </div>

              <div className="form-group">
                <label>Referens (valfritt)</label>
                <input
                  type="text"
                  value={newTransaction.reference || ''}
                  onChange={(e) => setNewTransaction({...newTransaction, reference: e.target.value})}
                  placeholder="Referensnummer eller beskrivning"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowTransactionModal(false)}
              >
                Avbryt
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddTransaction}
              >
                Lägg till
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Allocation Modal */}
      {showAllocationModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Ny budgetallokering</h3>
              <button
                className="modal-close"
                onClick={() => setShowAllocationModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Syfte</label>
                <input
                  type="text"
                  value={newAllocation.purpose}
                  onChange={(e) => setNewAllocation({...newAllocation, purpose: e.target.value})}
                  placeholder="T.ex. Lagresa, Utrustning, etc."
                  title="Syfte"
                />
              </div>

              <div className="form-group">
                <label>Budget (SEK)</label>
                <input
                  type="number"
                  value={newAllocation.budgetAmount}
                  onChange={(e) => setNewAllocation({...newAllocation, budgetAmount: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                  title="Budget (SEK)"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowAllocationModal(false)}
              >
                Avbryt
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddAllocation}
              >
                Skapa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamFundManager;
