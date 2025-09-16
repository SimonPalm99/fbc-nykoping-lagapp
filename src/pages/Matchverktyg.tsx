import React from 'react';
import { Link } from 'react-router-dom';

const verktyg = [
  {
    titel: 'Digital Whiteboard',
    beskrivning: 'Rita och planera taktiker live tillsammans med laget.',
    länk: '/whiteboard',
    ikon: '📝',
    färg: '#38bdf8',
  },
  {
    titel: 'Live Matchstatistik',
    beskrivning: 'Registrera och följ statistik under pågående match.',
    länk: '/livestatistik',
    ikon: '📊',
    färg: '#fbbf24',
  },
  {
    titel: 'Matchanalys (efter match)',
    beskrivning: 'Ladda upp och analysera matcher efter slutsignal.',
    länk: '/matchanalys',
    ikon: '📈',
    färg: '#34d399',
  },
  {
    titel: 'Laguppställningar',
    beskrivning: 'Skapa och visa laguppställningar inför match.',
    länk: '/laguppstallning',
    ikon: '👥',
    färg: '#f472b6',
  },
  {
    titel: 'Övningar & Taktiker',
    beskrivning: 'Samling av övningar och taktiker för träning och match.',
    länk: '/ovningar-taktiker',
    ikon: '⚡',
    färg: '#818cf8',
  },
];

const Matchverktyg: React.FC = () => {
  return (
  <div style={{ minHeight: '100vh', background: '#101a10', padding: '2rem' }}>
  <h1 style={{ color: '#22c55e', fontWeight: 900, fontSize: '2.5rem', textAlign: 'center', marginBottom: '2rem', letterSpacing: '2px', textShadow: '0 2px 8px #000' }}>Matchverktyg</h1>
  <p style={{ color: '#fff', textAlign: 'center', fontSize: '1.1rem', marginBottom: '2.5rem', textShadow: '0 1px 4px #000' }}>
        Välj ett verktyg nedan för att hantera matchen, planera taktiker, skapa laguppställningar eller analysera matcher.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
        {verktyg.map(v => (
          <Link to={v.länk} key={v.titel} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff',
              borderRadius: '1.5rem',
              boxShadow: '0 4px 24px #22c55e44',
              padding: '2rem',
              minWidth: '260px',
              maxWidth: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.2s',
              border: `4px solid ${v.färg}`,
              color: '#101a10',
            }}>
              <span style={{ fontSize: '3rem', marginBottom: '1rem', color: '#22c55e', textShadow: '0 2px 8px #000' }}>{v.ikon}</span>
              <h2 style={{ color: v.färg, fontWeight: 700, fontSize: '1.3rem', marginBottom: '0.5rem', textAlign: 'center', letterSpacing: '1px' }}>{v.titel}</h2>
              <p style={{ color: '#222', fontSize: '1rem', textAlign: 'center', marginBottom: '0.5rem' }}>{v.beskrivning}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Matchverktyg;