import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import { UserRole } from "../../types/user";

const roles: UserRole[] = ["player", "leader"];

const Onboarding: React.FC = () => {
  const { register } = useUser();
  const [form, setForm] = useState({
    name: "",
    email: "",
    jerseyNumber: "",
  role: "player" as UserRole,
    favoritePosition: "",
    about: "",
    profileImageUrl: "",
    birthday: "",
    phone: "",
    iceContacts: [{ name: "", phone: "", relation: "", isPrimary: true }]
  });
  const [done, setDone] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleICE = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({
      ...f,
      iceContacts: f.iceContacts.map((contact, index) => 
        index === 0 ? { ...contact, [e.target.name]: e.target.value } : contact
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      ...form,
      jerseyNumber: parseInt(form.jerseyNumber) || 0,
      iceContacts: form.iceContacts,
      injuries: [],
      statistics: {
        gamesPlayed: 0,
        goals: 0,
        assists: 0,
        points: 0,
        shots: 0,
        shotPercentage: 0,
        plusMinus: 0,
        penaltyMinutes: 0,
        blocks: 0,
        steals: 0
      },
      joinDate: new Date().toISOString().split('T')[0] || '',
      lastActive: new Date().toISOString(),
      preferences: {
        notifications: true,
        publicProfile: true,
        showStats: true,
        language: "sv",
        theme: "light",
        shareLocation: false
      },
      fines: {
        total: 0,
        paid: 0,
        outstanding: 0
      },
      milestones: [],
      totalGamificationPoints: 0,
      achievements: {
        mvpVotes: 0,
        playerOfTheWeek: 0,
        consecutiveTrainings: 0,
        bestStreak: 0
      }
    });
    setDone(true);
  };

  if (done) return <div>Registrering skickad! Invändar på ledargodkännande.</div>;

  return (
    <form onSubmit={handleSubmit} style={{maxWidth: 400, margin: "0 auto"}}>
      <h2>Skapa konto</h2>
      <label>
        Namn
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        E-post
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>
      <label>
        Tröjnummer
        <input name="jerseyNumber" type="number" value={form.jerseyNumber} onChange={handleChange} required />
      </label>
      <label>
        Födelsedag
        <input name="birthday" type="date" value={form.birthday} onChange={handleChange} />
      </label>
      <label>
        Roll
        <select name="role" value={form.role} onChange={handleChange}>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </label>
      <label>
        Position (favorit)
        <input name="favoritePosition" value={form.favoritePosition} onChange={handleChange} />
      </label>
      <label>
        Om mig
        <input name="about" value={form.about} onChange={handleChange} />
      </label>
      <label>
        Mobilnummer
        <input name="phone" value={form.phone} onChange={handleChange} />
      </label>
      <label>
        Profilbild (URL)
        <input name="profileImageUrl" value={form.profileImageUrl} onChange={handleChange} />
      </label>
      <fieldset>
        <legend>Nödkontakt (ICE)</legend>
        <label>
          Namn
          <input name="name" value={form.iceContacts[0]?.name || ""} onChange={handleICE} />
        </label>
        <label>
          Relation
          <input name="relation" value={form.iceContacts[0]?.relation || ""} onChange={handleICE} />
        </label>
        <label>
          Telefon
          <input name="phone" value={form.iceContacts[0]?.phone || ""} onChange={handleICE} />
        </label>
      </fieldset>
      <button type="submit" style={{marginTop:10}}>Registrera</button>
    </form>
  );
};

export default Onboarding;