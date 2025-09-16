import React, { useState, useEffect } from 'react';

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
    loadWeeklyData();
  }, []);

  const loadWeeklyData = () => {
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
      // const _today = new Date();
      // const _nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
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
  };

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
    <section className="weekly-highlights" style={{ marginBottom: "3rem" }}>
      <h2 style={{
        fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
        marginBottom: "2rem",
        color: "var(--accent-green)",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        🌟 Veckans höjdpunkter
      </h2>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "1.5rem"
      }}>
        {/* Veckans spelare */}
        {showPlayerOfWeek && playerOfWeek && (
          <div style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "#ffffff",
            borderRadius: "20px",
            padding: "2rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Background pattern */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"2\" fill=\"white\" opacity=\"0.1\"/><circle cx=\"20\" cy=\"20\" r=\"1\" fill=\"white\" opacity=\"0.1\"/><circle cx=\"80\" cy=\"30\" r=\"1.5\" fill=\"white\" opacity=\"0.1\"/></svg>')",
              backgroundSize: "50px 50px",
              opacity: 0.3
            }} />
            
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌟</div>
              
              <h3 style={{
                margin: "0 0 0.5rem 0",
                fontSize: "1.25rem",
                fontWeight: "700"
              }}>
                Veckans spelare - v.{playerOfWeek.week}
              </h3>
              
              <div style={{ 
                fontSize: "1.5rem", 
                fontWeight: "700", 
                marginBottom: "0.5rem" 
              }}>
                {playerOfWeek.name}
              </div>
              
              {(playerOfWeek.jerseyNumber || playerOfWeek.position) && (
                <div style={{ 
                  fontSize: "0.875rem", 
                  opacity: 0.9, 
                  marginBottom: "1rem" 
                }}>
                  {playerOfWeek.jerseyNumber && `#${playerOfWeek.jerseyNumber}`}
                  {playerOfWeek.jerseyNumber && playerOfWeek.position && " • "}
                  {playerOfWeek.position}
                </div>
              )}
              
              <div style={{ 
                fontSize: "0.875rem", 
                opacity: 0.9, 
                lineHeight: 1.5,
                marginBottom: "1rem",
                fontStyle: "italic"
              }}>
                "{playerOfWeek.reason}"
              </div>
              
              <div style={{ 
                fontSize: "0.75rem", 
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}>
                <span>🗳️</span>
                <span>{playerOfWeek.votes} röster</span>
              </div>
            </div>
          </div>
        )}

        {/* Födelsedagar */}
        {showBirthdays && birthdays.length > 0 && (
          <div style={{
            background: "var(--card-background)",
            borderRadius: "20px",
            padding: "2rem",
            border: "2px solid #f59e0b",
            boxShadow: "var(--shadow-medium)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem"
            }}>
              <span style={{ fontSize: "2rem" }}>🎂</span>
              <h3 style={{
                margin: 0,
                fontSize: "1.25rem",
                fontWeight: "700",
                color: "var(--text-primary)"
              }}>
                Födelsedagar denna vecka
              </h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {birthdays.map((birthday) => (
                <div
                  key={birthday.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    background: birthday.isToday ? "#fef3c7" : "var(--muted-background)",
                    borderRadius: "12px",
                    border: birthday.isToday ? "2px solid #f59e0b" : "1px solid var(--border-color)"
                  }}
                >
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: birthday.profilePicture ? "none" : "linear-gradient(135deg, #f59e0b, #d97706)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    flexShrink: 0
                  }}>
                    {birthday.profilePicture ? (
                      <img 
                        src={birthday.profilePicture} 
                        alt={birthday.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}
                      />
                    ) : (
                      birthday.name.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: "600",
                      color: "var(--text-primary)",
                      marginBottom: "0.25rem"
                    }}>
                      {birthday.name}
                      {birthday.jerseyNumber && (
                        <span style={{ 
                          fontSize: "0.75rem", 
                          color: "var(--text-secondary)",
                          marginLeft: "0.5rem"
                        }}>
                          #{birthday.jerseyNumber}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)"
                    }}>
                      {formatBirthdayDate(birthday.birthday)} • Fyller {birthday.age} år
                    </div>
                  </div>
                  
                  <div style={{ fontSize: "1.5rem" }}>
                    {birthday.isToday ? "🎉" : "🎂"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lagnotiser */}
        {showTeamNotices && teamNotices.length > 0 && (
          <div style={{
            background: "var(--card-background)",
            borderRadius: "20px",
            padding: "2rem",
            border: "2px solid #3b82f6",
            boxShadow: "var(--shadow-medium)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem"
            }}>
              <span style={{ fontSize: "2rem" }}>📢</span>
              <h3 style={{
                margin: 0,
                fontSize: "1.25rem",
                fontWeight: "700",
                color: "var(--text-primary)"
              }}>
                Lagnotiser
              </h3>
            </div>
            
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.75rem",
              maxHeight: "200px",
              overflowY: "auto"
            }}>
              {teamNotices.map((notice, index) => (
                <div
                  key={index}
                  style={{
                    padding: "0.75rem 1rem",
                    background: "var(--muted-background)",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                    color: "var(--text-primary)",
                    borderLeft: "4px solid #3b82f6"
                  }}
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
