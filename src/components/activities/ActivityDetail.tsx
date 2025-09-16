import React from "react";
const fbcTheme = {
  background: 'linear-gradient(135deg, #0a0a0a 0%, #0f172a 50%, #111827 100%)',
  cardBg: '#181f2a',
  accent: '#22c55e',
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
  }
};
import { Activity } from "../../types/activity";

interface Props {
  activity: Activity;
}

const ActivityDetail: React.FC<Props> = ({ activity }) => (
  <section
    style={{
      background: fbcTheme.background,
      borderRadius: '1.2rem',
      maxWidth: 600,
      margin: '2rem auto',
      padding: '2rem 1.2rem',
      color: fbcTheme.text.primary,
      fontFamily: 'inherit',
      boxShadow: '0 2px 16px #22c55e22',
    }}
  >
    <h2 style={{ color: fbcTheme.accent, fontSize: '2rem', margin: '0 0 1.2rem 0', fontWeight: 'bold', textAlign: 'center' }}>
      {activity.title}
      {activity.type && (
        <span style={{ fontSize: '1rem', color: fbcTheme.text.secondary, marginLeft: 12 }}>
          {activity.type}
        </span>
      )}
      {activity.important && (
        <span style={{ color: '#ff5252', marginLeft: 12, fontWeight: 700 }}>
          Viktigt!
        </span>
      )}
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.2rem', alignItems: 'center' }}>
      <div style={{ color: fbcTheme.text.secondary, fontSize: '1.1rem' }}>
        <strong>Datum:</strong> {activity.date}
        {activity.startTime && activity.endTime && (
          <> kl {activity.startTime}–{activity.endTime}</>
        )}
      </div>
      <div style={{ color: fbcTheme.text.secondary, fontSize: '1.1rem' }}>
        <strong>Plats:</strong> {activity.location || <i>Ej angiven</i>}
        {activity.mapUrl && (
          <span style={{ marginLeft: 10 }}>
            <a
              href={activity.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: fbcTheme.accent,
                textDecoration: 'underline',
                marginLeft: 4,
                fontWeight: 600,
              }}
            >
              Karta
            </a>
          </span>
        )}
      </div>
      {activity.absenceDeadline && (
        <div style={{ color: fbcTheme.text.secondary, fontSize: '1.1rem' }}>
          <strong>Sista dag för frånvaro:</strong> {activity.absenceDeadline}
        </div>
      )}
    </div>
    {activity.description && (
      <div style={{ marginBottom: '1.2rem', color: fbcTheme.text.secondary, fontSize: '1.1rem' }}>
        <strong>Beskrivning:</strong>
        <div style={{ color: fbcTheme.accent, marginTop: 2 }}>{activity.description}</div>
      </div>
    )}
    {activity.tags && activity.tags.length > 0 && (
      <div style={{ marginBottom: '1.2rem' }}>
        <strong style={{ color: fbcTheme.text.secondary }}>Taggar:</strong>{' '}
        {activity.tags.map(tag => (
          <span
            key={tag}
            style={{
              background: fbcTheme.accent,
              color: fbcTheme.cardBg,
              borderRadius: 8,
              padding: '3px 10px',
              fontSize: '1rem',
              marginRight: 6,
              fontWeight: 600,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    )}
    <div style={{ marginTop: '1.2rem', fontSize: '1rem', color: fbcTheme.text.secondary, textAlign: 'right' }}>
      <span>Skapad av: {activity.createdBy}</span>
    </div>
    <style>{`
      @media (max-width: 600px) {
        section {
          padding: 0.7rem;
          border-radius: 0.7rem;
          max-width: 99vw;
        }
        h2 {
          font-size: 1.2rem;
        }
        div, strong {
          font-size: 1rem;
        }
      }
    `}</style>
  </section>
);

export default ActivityDetail;