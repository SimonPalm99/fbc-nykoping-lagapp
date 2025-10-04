
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Matchverktyg.module.css';

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
  <div className={styles.root}>
    <h1 className={styles.title}>Matchverktyg</h1>
    <p className={styles.subtitle}>
      Välj ett verktyg nedan för att hantera matchen, planera taktiker, skapa laguppställningar eller analysera matcher.
    </p>
    <div className={styles.tools}>
      {verktyg.map(v => (
        <Link to={v.länk} key={v.titel} className={styles.toolLink}>
          <div className={styles.toolCard}>
            <span className={styles.icon}>{v.ikon}</span>
            <h2 className={styles.toolTitle}>{v.titel}</h2>
            <p className={styles.toolDesc}>{v.beskrivning}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
  );
};

export default Matchverktyg;