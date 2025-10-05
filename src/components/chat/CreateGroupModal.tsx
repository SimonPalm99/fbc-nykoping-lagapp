import React, { useState, useEffect } from 'react';
import styles from './CreateGroupModal.module.css';
import { usersAPI, chatRoomAPI } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

interface User {
  id: string;
  name: string;
  profileImageUrl?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onGroupCreated: () => void;
}

const CreateGroupModal: React.FC<Props> = ({ open, onClose, onGroupCreated }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<string[]>(user ? [user.id] : []);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    usersAPI.getAllUsers().then(res => {
      setUsers(res.data || []);
    });
  }, []);

  const handleToggle = (id: string) => {
    setSelected(sel => sel.includes(id) ? sel.filter(u => u !== id) : [...sel, id]);
  };

  const handleCreate = async () => {
    if (!name.trim() || selected.length < 2) {
      setError('Gruppnamn och minst två deltagare krävs.');
      return;
    }
    setLoading(true);
    setError(null);
    if (!user) {
      setError('Du måste vara inloggad för att skapa en grupp.');
      setLoading(false);
      return;
    }
    await chatRoomAPI.create({
      name,
      description: desc,
      participants: selected,
      creatorId: user.id
    });
    setLoading(false);
    onGroupCreated();
    onClose();
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Skapa ny grupp</h2>
        <input
          className={styles.modalInput}
          placeholder="Gruppnamn"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className={styles.modalInput}
          placeholder="Beskrivning (valfritt)"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
        <div className={styles.userList}>
          {users.map(u => (
            <div key={u.id} className={styles.userRow}>
              <img src={u.profileImageUrl || '/default-avatar.png'} alt={u.name} className={styles.userAvatar} />
              <span className={styles.userName}>{u.name}</span>
              <input
                type="checkbox"
                checked={selected.includes(u.id)}
                onChange={() => handleToggle(u.id)}
                title={`Välj ${u.name}`}
              />
            </div>
          ))}
        </div>
        {error && <div className={styles.modalError}>{error}</div>}
        <div className={styles.modalBtnRow}>
          <button className={styles.modalBtn} onClick={handleCreate} disabled={loading}>Skapa grupp</button>
          <button className={styles.modalBtnCancel} onClick={onClose}>Avbryt</button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
