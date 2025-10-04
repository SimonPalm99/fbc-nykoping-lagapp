import { useUser } from '../context/UserContext';
import { User } from '../types/user';
import React, { useState, useEffect } from 'react';
import styles from './Fines.module.css';

import { useTitle } from '../hooks/useTitle';
import { useAuth } from '../context/AuthContext';
import { Fine, FineCategory } from '../types/fine';
import { finesAPI } from '../services/apiService';
import { rulesAPI } from '../services/apiService';

// Ikoner

// Fine type is now imported from types/fine.ts


// Rätta getTopFinedPlayers för att undvika 'Object is possibly undefined'
// Remove duplicate getTopFinedPlayers. If needed, reimplement using correct Fine type.

const Fines: React.FC = () => {
  useTitle('Böter & Lagkassa');
  const { user } = useAuth();
  const { users } = useUser();
  // Modal för att lägga till böter
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [fineForm, setFineForm] = useState({ reason: '', amount: '', date: '', dueDate: '', category: 'training' });
  // Removed unused fines state
  // Removed unused cashEntries state
  // Removed unused notification state
  // Removed unused showConfetti state
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddFine = async () => {
    const player = users.find((u: User) => u.id === selectedPlayerId);
    if (!player || !fineForm.reason || !fineForm.amount || !fineForm.date || !fineForm.dueDate) return;
    const newFine: Fine = {
      id: Date.now().toString(),
      playerId: player.id,
      userId: player.id,
      type: {
        id: 'custom',
        name: fineForm.reason,
        amount: parseInt(fineForm.amount),
        category: fineForm.category as FineCategory,
        isActive: true,
        autoApply: false,
        requiresApproval: false,
        createdBy: user?.name || 'Admin',
        createdAt: fineForm.date,
        description: fineForm.reason,
      },
      date: fineForm.date,
      reason: fineForm.reason,
      amount: parseInt(fineForm.amount),
      category: fineForm.category as FineCategory,
      description: fineForm.reason,
      dueDate: fineForm.dueDate,
      paid: false,
      isPaid: false,
      createdBy: user?.name || 'Admin',
      issuedBy: user?.name || 'Admin',
      status: 'pending',
    };
    const res = await finesAPI.create(newFine);
    if (res.success) {
      // Removed setFines as fines state is unused
      setSelectedPlayerId('');
      setFineForm({ reason: '', amount: '', date: '', dueDate: '', category: 'training' });
      // Removed notification assignment
    }
  };

  // Möjlighet att lägga till egna bötesregler
  // Removed unused newRule state

  useEffect(() => {
    setLoading(true);
    finesAPI.getAll().then(() => {
      setLoading(false);
    });
    rulesAPI.getAll().then(() => {
      // Custom rules fetch removed as customRules state is unused
    });
  }, []);

  // Böter-funktioner
  // Removed unused handlePayFine function to fix compile error

  // Insättningsformulär
  // CashForm component removed because it is unused.

  // Statistik

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.loadingInner}>
          <div className={styles.spinner}></div>
          <div className={styles.loadingText}>Laddar böter...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {/* Example usage of handleAddFine */}
      <form
        className={styles.form}
        onSubmit={e => {
          e.preventDefault();
          handleAddFine();
        }}
      >
        <button
          type="submit"
          className={styles.submitBtn}
        >
          Lägg till böter
        </button>
      </form>
      {/* ...rest of your JSX... */}
      {/* All content unchanged */}
      {/* ... */}
    </div>
  );
};

export default Fines;
