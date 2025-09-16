import { useUser } from '../context/UserContext';
import { User } from '../types/user';
import React, { useState, useEffect } from 'react';

import { useTitle } from '../hooks/useTitle';
import { useAuth } from '../context/AuthContext';
import { Fine, FineCategory } from '../types/fine';
import { finesAPI } from '../services/apiService';
import { cashAPI, rulesAPI } from '../services/apiService';

// Ikoner
const categoryIcons: Record<string, string> = {
  training: '🏋️', match: '🏆', behavior: '⚡', equipment: '🎽', other: '💡',
};

// Fine type is now imported from types/fine.ts
interface CashEntry {
  id: string;
  type: 'jobb' | 'lotter' | 'pant' | 'böter' | 'utgift';
  amount: number;
  date: string;
  description: string;
}

const rules = [
  'Sen till träning eller match',
  'Glömt utrustning',
  'Dåligt uppförande',
  'Utvisning',
  'Ej svarat på kallelse',
  'Ej deltagit i lagaktivitet',
];

// Rätta getTopFinedPlayers för att undvika 'Object is possibly undefined'
// Remove duplicate getTopFinedPlayers. If needed, reimplement using correct Fine type.

const Fines: React.FC = () => {
  useTitle('Böter & Lagkassa');
  const { user } = useAuth();
  const { users } = useUser();
  // Modal för att lägga till böter
  const [showAddFine, setShowAddFine] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [fineForm, setFineForm] = useState({ reason: '', amount: '', date: '', dueDate: '', category: 'training' });

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
      setFines(prev => [...prev, res.data]);
      setShowAddFine(false);
      setSelectedPlayerId('');
      setFineForm({ reason: '', amount: '', date: '', dueDate: '', category: 'training' });
      setNotification('Böter tillagd!');
      setTimeout(() => setNotification(''), 2000);
    }
  };
  const isAdmin = user?.role === 'leader' || user?.role === 'admin';
  const [swishQr, setSwishQr] = useState<string>('');
  const [fines, setFines] = useState<Fine[]>([]);
  const [cashEntries, setCashEntries] = useState<CashEntry[]>([]);
  const [showAddCash, setShowAddCash] = useState(false);
  const [notification, setNotification] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Möjlighet att lägga till egna bötesregler
  const [customRules, setCustomRules] = useState<string[]>([]);
  const [newRule, setNewRule] = useState('');

  useEffect(() => {
    setLoading(true);
    finesAPI.getAll().then(res => {
      if (res.success) setFines(res.data);
      setLoading(false);
    });
    cashAPI.getAll().then(res => {
      if (res.success) setCashEntries(res.data);
    });
    rulesAPI.getAll().then(res => {
      if (res.success) setCustomRules(res.data.map((r: any) => r.rule));
    });
  }, [user]);

  // Böter-funktioner
  const handlePayFine = async (fineId: string) => {
    const res = await finesAPI.pay(fineId);
    if (res.success) {
      setFines(prev => prev.map(f => f.id === fineId ? { ...f, status: 'paid' } : f));
      // TODO: cashAPI.add({ id: Date.now().toString(), type: 'böter', amount: paidFine.amount, date: new Date().toISOString().slice(0, 10), description: `Betald böter: ${paidFine.reason}` });
      setNotification('Böter är nu markerad som betald och lagkassan har uppdaterats!');
      setShowConfetti(true);
      setTimeout(() => {
        setNotification('');
        setShowConfetti(false);
      }, 2000);
    }
  };

  // Insättningsformulär
  const CashForm = ({ onSave, onCancel }: { onSave: (e: CashEntry) => void; onCancel: () => void }) => {
    const [form, setForm] = useState<CashEntry>({ id: '', type: 'jobb', amount: 0, date: new Date().toISOString().slice(0, 10), description: '' });
    return (
      <div style={{ background: '#1e293b', borderRadius: 18, boxShadow: '0 4px 15px rgba(0,0,0,0.3)', padding: '2rem', maxWidth: 400, margin: '2rem auto', color: '#f8fafc' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '1rem' }}>Lägg till insättning</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as CashEntry['type'] }))} style={{ padding: '0.7rem', borderRadius: 8, border: '1px solid #64748b', fontSize: '1rem' }}>
            <option value="jobb">Jobb</option>
            <option value="lotter">Lotter</option>
            <option value="pant">Pant</option>
            <option value="utgift">Utgift</option>
          </select>
          <input type="number" placeholder="Belopp (kr)" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} style={{ padding: '0.7rem', borderRadius: 8, border: '1px solid #64748b', fontSize: '1rem' }} />
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ padding: '0.7rem', borderRadius: 8, border: '1px solid #64748b', fontSize: '1rem' }} />
          <input type="text" placeholder="Beskrivning" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ padding: '0.7rem', borderRadius: 8, border: '1px solid #64748b', fontSize: '1rem' }} />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => onSave({ ...form, id: Date.now().toString() })} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Spara</button>
            <button onClick={onCancel} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Avbryt</button>
          </div>
        </div>
      </div>
    );
  };

  // Statistik
  const cashTotal = cashEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const userFines = fines.filter(fine => fine.playerId === user?.id);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ width: '60px', height: '60px', border: '4px solid #22c55e', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>Laddar böter...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: 'inherit',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #14532d 100%)',
      color: '#F1F8E9',
      padding: '2rem 0.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Konfetti-animation vid betalning */}
      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9999,
        }}>
          <div style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '4rem',
            color: '#22c55e',
            animation: 'popCheck 0.7s',
          }}>✅</div>
          {/* Enkel konfetti med emojis */}
          <div style={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '2.5rem',
            animation: 'confettiDrop 1.2s',
          }}>🎉🎊🥳</div>
        </div>
      )}
      {/* Klubbkänsla utan logga */}
      <div style={{ width: '100%', maxWidth: 700, margin: '0 auto', textAlign: 'center', marginBottom: '1.2rem', position: 'relative', background: 'rgba(16,32,16,0.97)', borderRadius: '1.5rem', boxShadow: '0 8px 32px rgba(34,197,94,0.18)', padding: '2rem 1.2rem 1.5rem 1.2rem', backdropFilter: 'blur(10px)' }}>
        <h1 style={{ color: '#22c55e', fontWeight: 900, fontSize: '2.3rem', letterSpacing: '0.02em', marginBottom: '0.3rem', textShadow: '0 2px 12px #22c55e55' }}>
          Böter & Lagkassa
        </h1>
        <div style={{ color: '#F1F8E9', fontSize: '1.15rem', fontWeight: 500 }}>
          Här ser du alla dina lagböter, lagkassans saldo och kan betala direkt.
        </div>
      </div>
      {/* Swish QR-kod-sektion */}
      <div style={{
        width: '100%',
        maxWidth: 700,
        margin: '0 auto 2rem auto',
        textAlign: 'center',
        background: 'rgba(16,32,16,0.97)',
        borderRadius: '1.2rem',
        boxShadow: '0 4px 15px #22c55e22',
        padding: '1.2rem 1.5rem',
        backdropFilter: 'blur(6px)',
        border: '2px solid #22c55e',
      }}>
        <h2 style={{ color: '#22c55e', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.7rem', letterSpacing: '0.01em' }}>Betala böter med Swish</h2>
        {swishQr ? (
          <div>
            <img src={swishQr} alt="Swish QR" style={{ maxWidth: 180, borderRadius: 12, boxShadow: '0 4px 15px rgba(0,0,0,0.3)', marginBottom: '0.7rem' }} />
            <div style={{ color: '#cbd5e1', fontSize: '1.08rem' }}>Scanna QR-koden med Swish för att betala direkt!</div>
          </div>
        ) : isAdmin ? (
          <div style={{ color: '#cbd5e1', fontSize: '1.08rem', marginBottom: '0.7rem' }}>Ingen QR-kod inlagd ännu.</div>
        ) : (
          <div style={{ color: '#cbd5e1', fontSize: '1.08rem', marginBottom: '0.7rem' }}>QR-kod för Swish kommer snart!</div>
        )}
        {isAdmin && (
          <div style={{ marginTop: '1rem' }}>
            <input type="text" placeholder="Länk till QR-bild" value={swishQr} onChange={e => setSwishQr(e.target.value)} style={{ padding: '0.7rem', borderRadius: 8, border: '1px solid #64748b', fontSize: '1rem', maxWidth: 300 }} />
            <button onClick={() => setNotification('QR-kod uppdaterad!')} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginLeft: '1rem' }}>Spara</button>
          </div>
        )}
      </div>
      {/* Lägg till böter-knapp för alla */}
      <div style={{ width: '100%', maxWidth: 700, margin: '0 auto 2rem auto', textAlign: 'center' }}>
        <button onClick={() => setShowAddFine(true)} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 14, padding: '1rem 1.5rem', fontWeight: 700, fontSize: '1.15rem', cursor: 'pointer', boxShadow: '0 4px 15px #22c55e22', marginBottom: '1.5rem', marginTop: '1rem' }}>+ Lägg till böter</button>
      </div>
      {/* Modal för att lägga till böter */}
      {showAddFine && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }} onClick={() => setShowAddFine(false)}>
          <div style={{ background: '#181f2a', borderRadius: '1.2rem', padding: '2rem', minWidth: 320, boxShadow: '0 8px 24px #22c55e55', position: 'relative', color: '#F1F8E9' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: '#22c55e', fontWeight: 800, fontSize: '1.3rem', marginBottom: '1rem' }}>Lägg till böter</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: 600 }}>Välj spelare:</label>
              <select value={selectedPlayerId} onChange={e => setSelectedPlayerId(e.target.value)} style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1px solid #22c55e', background: '#181f2a', color: '#F1F8E9', marginTop: '0.5rem' }}>
                <option value="">Välj...</option>
                {users.filter((u: User) => u.isApproved).map((u: User) => (
                  <option key={u.id} value={u.id}>{u.name} #{u.jerseyNumber} ({u.role})</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: 600 }}>Anledning:</label>
              <input type="text" value={fineForm.reason} onChange={e => setFineForm(f => ({ ...f, reason: e.target.value }))} style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1px solid #22c55e', background: '#181f2a', color: '#F1F8E9', marginTop: '0.5rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: 600 }}>Belopp (kr):</label>
              <input type="number" value={fineForm.amount} onChange={e => setFineForm(f => ({ ...f, amount: e.target.value }))} style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1px solid #22c55e', background: '#181f2a', color: '#F1F8E9', marginTop: '0.5rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: 600 }}>Datum:</label>
              <input type="date" value={fineForm.date} onChange={e => setFineForm(f => ({ ...f, date: e.target.value }))} style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1px solid #22c55e', background: '#181f2a', color: '#F1F8E9', marginTop: '0.5rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: 600 }}>Senast betald:</label>
              <input type="date" value={fineForm.dueDate} onChange={e => setFineForm(f => ({ ...f, dueDate: e.target.value }))} style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1px solid #22c55e', background: '#181f2a', color: '#F1F8E9', marginTop: '0.5rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: 600 }}>Kategori:</label>
              <select value={fineForm.category} onChange={e => setFineForm(f => ({ ...f, category: e.target.value as Fine['category'] }))} style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1px solid #22c55e', background: '#181f2a', color: '#F1F8E9', marginTop: '0.5rem' }}>
                <option value="training">Träning</option>
                <option value="match">Match</option>
                <option value="behavior">Uppförande</option>
                <option value="equipment">Utrustning</option>
                <option value="other">Annat</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={handleAddFine} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Spara böter</button>
              <button onClick={() => setShowAddFine(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Avbryt</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ width: '100%', maxWidth: 700, margin: '0 auto 2rem auto', textAlign: 'center', background: 'rgba(16,32,16,0.97)', borderRadius: '1.2rem', boxShadow: '0 4px 15px #22c55e22', padding: '1.2rem 1.5rem', backdropFilter: 'blur(6px)', border: '2px solid #22c55e', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
          <span style={{ fontSize: '2.1rem', marginRight: '0.5rem' }}>💰</span>
          <div>
            <div style={{ color: '#cbd5e1', fontSize: '1.05rem', fontWeight: 500 }}>Lagkassa</div>
            <div style={{ color: '#22c55e', fontWeight: 800, fontSize: '1.7rem', marginTop: 2 }}>{cashTotal} kr</div>
          </div>
        </div>
        <button onClick={() => setShowAddCash(true)} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 14, padding: '0.8rem 1.3rem', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
          + Lägg till insättning
        </button>
      </div>
      {/* Formulär för insättning */}
      {showAddCash && (
        <CashForm onSave={async entry => {
          const res = await cashAPI.add(entry);
          if (res.success) setCashEntries(prev => [...prev, res.data]);
          setShowAddCash(false);
          setNotification('Insättning tillagd!');
          setTimeout(() => setNotification(''), 2000);
        }} onCancel={() => setShowAddCash(false)} />
      )}
      {/* Lista på alla med böter */}
      <div style={{ width: '100%', maxWidth: 700, margin: '0 auto 2rem auto', textAlign: 'center', background: 'rgba(16,32,16,0.97)', borderRadius: '1.2rem', boxShadow: '0 4px 15px #22c55e22', padding: '1.2rem 1.5rem', backdropFilter: 'blur(6px)', border: '2px solid #22c55e' }}>
        <h2 style={{ color: '#22c55e', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.7rem', letterSpacing: '0.01em' }}>Alla med böter</h2>
        {fines.length === 0 ? (
          <div style={{ color: '#cbd5e1', fontWeight: 500 }}>Ingen har fått böter ännu.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center' }}>
            {Array.from(new Set(fines.map(f => f.playerId))).map(pid => {
              const playerFines = fines.filter(f => f.playerId === pid);
              const player = users.find((u: User) => u.id === pid);
              if (!player) return null;
              return (
                <div key={pid} style={{ background: 'rgba(34,197,94,0.12)', borderRadius: 18, boxShadow: '0 4px 15px #22c55e22', padding: '1rem 1.3rem', minWidth: 220, textAlign: 'left', border: '2px solid #22c55e', backdropFilter: 'blur(6px)', width: '100%' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.18rem', color: '#22c55e', marginBottom: 4 }}>{player.name} #{player.jerseyNumber}</div>
                  <div style={{ color: '#cbd5e1', fontSize: '1.05rem', marginBottom: 6 }}>Totalt böter: <span style={{ color: '#ef4444', fontWeight: 700 }}>{playerFines.reduce((sum, f) => sum + f.amount, 0)} kr</span></div>
                  <ul style={{ color: '#cbd5e1', fontSize: '1.08rem', paddingLeft: '1.2rem', margin: 0 }}>
                    {playerFines.map(f => (
                      <li key={f.id} style={{ marginBottom: '0.4rem' }}>
                        {f.reason} ({f.amount} kr, {f.date}) <span style={{ color: f.status === 'paid' ? '#22c55e' : f.status === 'pending' ? '#ef4444' : '#e74c3c', fontWeight: 700 }}>• {f.status === 'paid' ? 'Betald' : f.status === 'pending' ? 'Obetald' : f.status === 'disputed' ? 'Tvist' : f.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Bötesregler */}
  <div style={{ width: '100%', maxWidth: 700, margin: '0 auto 2rem auto', background: 'rgba(16,32,16,0.97)', borderRadius: '1.2rem', boxShadow: '0 4px 15px #22c55e22', padding: '1.2rem 1.5rem', backdropFilter: 'blur(6px)', border: '2px solid #22c55e' }}>
        <h2 style={{ color: '#22c55e', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.7rem', letterSpacing: '0.01em' }}>Bötesregler & Vanliga anledningar</h2>
        <ul style={{ color: '#cbd5e1', fontSize: '1.08rem', paddingLeft: '1.2rem', margin: 0 }}>
          {rules.concat(customRules).map((r, i) => (
            <li key={i} style={{ marginBottom: '0.4rem' }}>{r}</li>
          ))}
        </ul>
        <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
          <input type="text" value={newRule} onChange={e => setNewRule(e.target.value)} placeholder="Lägg till egen regel..." style={{ padding: '0.7rem', borderRadius: 8, border: '1px solid #64748b', fontSize: '1rem', flex: 1 }} />
          <button onClick={async () => {
            if (newRule.trim()) {
              const res = await rulesAPI.add({ rule: newRule.trim(), createdBy: user?.name || 'Admin' });
              if (res.success) setCustomRules(rules => [...rules, res.data.rule]);
              setNewRule('');
            }
          }} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Lägg till</button>
        </div>
      </div>
  {/* Böter-lista */}
  <div style={{
    width: '100%',
    maxWidth: 700,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.3rem',
    boxSizing: 'border-box',
    background: 'rgba(16,32,16,0.97)',
    borderRadius: '1.2rem',
    boxShadow: '0 4px 15px #22c55e22',
    padding: '1.2rem 1.5rem',
    margin: '0 auto 2rem auto',
    border: '2px solid #22c55e',
    backdropFilter: 'blur(6px)',
  }}>
        {userFines.length === 0 ? (
          <div style={{ color: '#cbd5e1', fontWeight: 500, fontSize: '1.15rem', textAlign: 'center', background: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: '2.2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.18)', backdropFilter: 'blur(6px)', border: '2px solid #22c55e' }}>Inga böter hittades.</div>
        ) : (
          userFines.map(fine => (
            <div key={fine.id} style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 22,
              boxShadow: '0 4px 15px rgba(0,0,0,0.18)',
              padding: '1.5rem 1.7rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.3rem',
              position: 'relative',
              border: `2.5px solid ${fine.status === 'paid' ? '#22c55e' : fine.status === 'pending' ? '#ef4444' : '#e74c3c'}`,
              backdropFilter: 'blur(6px)',
              flexWrap: 'wrap',
              minWidth: 0,
              width: '100%',
              boxSizing: 'border-box',
            }}>
              <div style={{ width: 58, height: 58, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.35rem', boxShadow: '0 4px 15px rgba(34,197,94,0.18)', minWidth: 58 }}>
                {categoryIcons[fine.category]}
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontWeight: 700, fontSize: '1.18rem', color: '#f8fafc' }}>{fine.reason}</div>
                <div style={{ color: '#cbd5e1', fontSize: '1.05rem', marginTop: 2 }}>{fine.category.charAt(0).toUpperCase() + fine.category.slice(1)} • {fine.date}</div>
                <div style={{ color: fine.status === 'paid' ? '#22c55e' : fine.status === 'pending' ? '#ef4444' : '#e74c3c', fontWeight: 700, fontSize: '1.05rem', marginTop: 2 }}>{fine.status === 'paid' ? '✅ Betald' : fine.status === 'pending' ? '💸 Obetald' : fine.status === 'disputed' ? '⏰ Tvist' : fine.status}</div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 90 }}>
                <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.28rem' }}>{fine.amount} kr</div>
                <div style={{ color: '#cbd5e1', fontSize: '1rem' }}>Senast: {fine.dueDate}</div>
              </div>
              {fine.status === 'pending' || fine.status === 'disputed' ? (
                <button onClick={() => handlePayFine(fine.id)} style={{ background: 'linear-gradient(90deg, #22c55e 60%, #0a0a0a 100%)', color: '#fff', border: 'none', borderRadius: 14, padding: '0.8rem 1.3rem', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(34,197,94,0.18)', position: 'absolute', right: 22, bottom: 22, transition: 'background 0.2s', minWidth: 110 }}>Betala</button>
              ) : null}
            </div>
          ))
        )}
      </div>
      {/* Notifiering */}
      {notification && (
        <div style={{ background: 'linear-gradient(90deg, #22c55e 60%, #0a0a0a 100%)', color: '#fff', padding: '0.7rem 1.2rem', borderRadius: 12, fontWeight: 700, fontSize: '1.08rem', marginBottom: '1.2rem', boxShadow: '0 4px 15px rgba(34,197,94,0.18)', textAlign: 'center', maxWidth: 400 }}>
          {notification}
        </div>
      )}
      {/* Enkel fadeIn-animation och responsivitet */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popCheck {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes confettiDrop {
          0% { opacity: 0; transform: translateY(-40px); }
          60% { opacity: 1; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 600px) {
          body, html {
            font-size: 1.08rem !important;
            background: #0a0a0a !important;
          }
          .fbc-fine-card, .fbc-fine-list, .fbc-fine-section {
            border-radius: 1rem !important;
            box-shadow: none !important;
            padding: 1rem 0.5rem !important;
            margin: 0.5rem 0 !important;
          }
          .fbc-fine-card {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.7rem !important;
          }
          .fbc-fine-card > div {
            min-width: 0 !important;
            width: 100% !important;
            text-align: left !important;
          }
          .fbc-fine-card button {
            position: static !important;
            width: 100% !important;
            margin-top: 0.7rem !important;
            font-size: 1.1rem !important;
            padding: 1rem !important;
          }
          nav, .fbc-fine-section h1, .fbc-fine-section h2 {
            font-size: 1.2rem !important;
            padding: 0.7rem 0.2rem !important;
          }
          .fbc-fine-section {
            padding: 1rem 0.3rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Fines;
