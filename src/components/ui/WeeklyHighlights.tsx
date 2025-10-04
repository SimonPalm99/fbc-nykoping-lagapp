import React, { useState, useEffect } from 'react';
import styles from './WeeklyHighlights.module.css';

interface PlayerOfWeek {
  id: string;
  name: string;
  profilePicture?: string;
  reason: string;
  votes: number;
  week: string;
  jerseyNumber?: number;
  position?: string;
}

interface Birthday {
  id: string;
  name: string;
  profilePicture?: string;
  birthday: string;
  age: number;
  jerseyNumber?: number;
  isToday: boolean;
}

interface WeeklyHighlightsProps {
  showPlayerOfWeek?: boolean;
  showBirthdays?: boolean;
  showTeamNotices?: boolean;
}

export const WeeklyHighlights: React.FC<WeeklyHighlightsProps> = ({
  showPlayerOfWeek = true,
  showBirthdays = true,
  showTeamNotices = true
}) => {
  // const { user } = useAuth();
  const [playerOfWeek, setPlayerOfWeek] = useState<PlayerOfWeek | null>(null);
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [teamNotices, setTeamNotices] = useState<string[]>([]);

  useEffect(() => {
    // Mock data för veckans spelare
    if (showPlayerOfWeek) {
      setPlayerOfWeek({
        id: '1',
        name: 'Anna Andersson',
        reason: 'Fantastisk insats senaste matchen med 3 mål och 2 assist! Visar verkligen lagkänsla och ledarskap på plan.',
        votes: 8,
        week: '26',
        jerseyNumber: 10,
        position: 'Forward'
      });
    }

    // Mock data för födelsedagar denna vecka
    if (showBirthdays) {
      setBirthdays([
        {
          id: '1',
          name: 'Anna Andersson',
          birthday: '2025-06-27',
          age: calculateAge('1995-06-27'),
          jerseyNumber: 10,
          isToday: false
        },
        {
          id: '2',
          name: 'Erik Johansson',
          birthday: '2025-06-29',
          age: calculateAge('1992-06-29'),
          jerseyNumber: 7,
          isToday: false
        }
      ]);
    }

    // Mock data för lagnotiser
    if (showTeamNotices) {
      setTeamNotices([
        "🏒 Träningen tisdag flyttas till 19:00 istället för 18:00",
        "📅 Anmälan till cupen i Västerås öppnar måndag",
        "🍕 Lagmiddag efter matchen på lördag - anmäl er till ledarna",
        "⚠️ Kom ihåg att betala medlemsavgiften senast 30/6"
      ]);
    }
  }, [showPlayerOfWeek, showBirthdays, showTeamNotices]);


  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatBirthdayDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Idag!';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Imorgon';
    } else {
      return date.toLocaleDateString('sv-SE', { 
        weekday: 'long',
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const hasContent = (showPlayerOfWeek && playerOfWeek) || 
                    (showBirthdays && birthdays.length > 0) || 
                    (showTeamNotices && teamNotices.length > 0);

  if (!hasContent) {
    return null;
  }

  return (
    <section className={styles['weekly-highlights']}>
      <h2 className={styles['weekly-highlights-title']}>
        🌟 Veckans höjdpunkter
      </h2>
      <div className={styles['weekly-highlights-grid']}>
        {/* Veckans spelare */}
        {showPlayerOfWeek && playerOfWeek && (
          <div className={styles['player-of-week']}>
            <div className={styles['player-of-week-bg']} />
            <div className={styles['player-of-week-content']}>
              <div className={styles['player-of-week-icon']}>🌟</div>
              <h3 className={styles['player-of-week-title']}>
                Veckans spelare - v.{playerOfWeek.week}
              </h3>
              <div className={styles['player-of-week-name']}>
                {playerOfWeek.name}
              </div>
              {(playerOfWeek.jerseyNumber || playerOfWeek.position) && (
                <div className={styles['player-of-week-meta']}>
                  {playerOfWeek.jerseyNumber && `#${playerOfWeek.jerseyNumber}`}
                  {playerOfWeek.jerseyNumber && playerOfWeek.position && " • "}
                  {playerOfWeek.position}
                </div>
              )}
              <div className={styles['player-of-week-reason']}>
                "{playerOfWeek.reason}"
              </div>
              <div className={styles['player-of-week-votes']}>
                <span>🗳️</span>
                <span>{playerOfWeek.votes} röster</span>
              </div>
            </div>
          </div>
        )}

        {/* Födelsedagar */}
        {showBirthdays && birthdays.length > 0 && (
          <div className={styles['birthdays-card']}>
            <div className={styles['birthdays-header']}>
              <span className={styles['birthdays-header-icon']}>🎂</span>
              <h3 className={styles['birthdays-header-title']}>
                Födelsedagar denna vecka
              </h3>
            </div>
            <div className={styles['birthdays-list']}>
              {birthdays.map((birthday) => (
                <div
                  key={birthday.id}
                  className={
                    `${styles['birthday-item']} ` +
                    (birthday.isToday ? styles['birthday-item-today'] : styles['birthday-item-normal'])
                  }
                >
                  <div className={styles['birthday-avatar']}>
                    {birthday.profilePicture ? (
                      <img 
                        src={birthday.profilePicture} 
                        alt={birthday.name}
                        className={styles['birthday-avatar-img']}
                      />
                    ) : (
                      birthday.name.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                  <div className={styles['birthday-info']}>
                    <div className={styles['birthday-name']}>
                      {birthday.name}
                      {birthday.jerseyNumber && (
                        <span className={styles['birthday-jersey']}>
                          #{birthday.jerseyNumber}
                        </span>
                      )}
                    </div>
                    <div className={styles['birthday-date']}>
                      {formatBirthdayDate(birthday.birthday)} • Fyller {birthday.age} år
                    </div>
                  </div>
                  <div className={styles['birthday-cake']}>
                    {birthday.isToday ? "🎉" : "🎂"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lagnotiser */}
        {showTeamNotices && teamNotices.length > 0 && (
          <div className={styles['teamnotices-card']}>
            <div className={styles['teamnotices-header']}>
              <span className={styles['teamnotices-header-icon']}>📢</span>
              <h3 className={styles['teamnotices-header-title']}>
                Lagnotiser
              </h3>
            </div>
            <div className={styles['teamnotices-list']}>
              {teamNotices.map((notice, index) => (
                <div
                  key={index}
                  className={styles['teamnotices-item']}
                >
                  {notice}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WeeklyHighlights;
