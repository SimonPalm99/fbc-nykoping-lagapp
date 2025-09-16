import React, { useState } from 'react';
import { useTitle } from '../hooks/useTitle';

const Settings: React.FC = () => {
  useTitle('Inställningar - FBC Nyköping');
  
  const [notifications, setNotifications] = useState({
    matchReminders: true,
    trainingReminders: true,
    forumUpdates: false,
    fineNotifications: true,
    healthReminders: true
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showStats: true,
    showHealthData: false
  });

  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('sv');

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = () => {
    // Här skulle vi spara inställningar till backend
    console.log('Sparar inställningar:', { notifications, privacy, theme, language });
    alert('Inställningar sparade!');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <header style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            color: '#2c3e50',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            Inställningar
          </h1>
          <p style={{
            color: '#7f8c8d',
            fontSize: '1.1rem'
          }}>
            Anpassa appen efter dina behov
          </p>
        </header>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          {/* Notifikationer */}
          <section style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              color: '#2c3e50',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🔔 Notifikationer
            </h2>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {[
                { key: 'matchReminders', label: 'Matchpåminnelser', description: 'Få påminnelser före matcher' },
                { key: 'trainingReminders', label: 'Träningspåminnelser', description: 'Få påminnelser före träningar' },
                { key: 'forumUpdates', label: 'Forumuppdateringar', description: 'Notifiering vid nya inlägg i forumet' },
                { key: 'fineNotifications', label: 'Böter', description: 'Notifiering om nya böter och betalningsfrister' },
                { key: 'healthReminders', label: 'Hälsopåminnelser', description: 'Påminnelser om hälsokontroller och konditionstester' }
              ].map(item => (
                <div key={item.key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #ecf0f1'
                }}>
                  <div>
                    <div style={{
                      color: '#2c3e50',
                      fontWeight: '600',
                      marginBottom: '0.25rem'
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      color: '#7f8c8d',
                      fontSize: '0.9rem'
                    }}>
                      {item.description}
                    </div>
                  </div>
                  
                  <label style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '60px',
                    height: '34px'
                  }}>
                    <input
                      type="checkbox"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={() => handleNotificationChange(item.key as keyof typeof notifications)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: notifications[item.key as keyof typeof notifications] ? '#3498db' : '#ccc',
                      transition: '0.4s',
                      borderRadius: '34px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '26px',
                        width: '26px',
                        left: notifications[item.key as keyof typeof notifications] ? '30px' : '4px',
                        bottom: '4px',
                        backgroundColor: 'white',
                        transition: '0.4s',
                        borderRadius: '50%'
                      }} />
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Sekretess */}
          <section style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              color: '#2c3e50',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🔒 Sekretess
            </h2>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {[
                { key: 'showProfile', label: 'Visa profil för andra', description: 'Låt andra lagmedlemmar se din profil' },
                { key: 'showStats', label: 'Visa statistik', description: 'Låt andra se din matchstatistik' },
                { key: 'showHealthData', label: 'Visa hälsodata', description: 'Dela hälso- och konditionsinformation med tränare' }
              ].map(item => (
                <div key={item.key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #ecf0f1'
                }}>
                  <div>
                    <div style={{
                      color: '#2c3e50',
                      fontWeight: '600',
                      marginBottom: '0.25rem'
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      color: '#7f8c8d',
                      fontSize: '0.9rem'
                    }}>
                      {item.description}
                    </div>
                  </div>
                  
                  <label style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '60px',
                    height: '34px'
                  }}>
                    <input
                      type="checkbox"
                      checked={privacy[item.key as keyof typeof privacy]}
                      onChange={() => handlePrivacyChange(item.key as keyof typeof privacy)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: privacy[item.key as keyof typeof privacy] ? '#27ae60' : '#ccc',
                      transition: '0.4s',
                      borderRadius: '34px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '26px',
                        width: '26px',
                        left: privacy[item.key as keyof typeof privacy] ? '30px' : '4px',
                        bottom: '4px',
                        backgroundColor: 'white',
                        transition: '0.4s',
                        borderRadius: '50%'
                      }} />
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Utseende & Språk */}
          <section style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              color: '#2c3e50',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🎨 Utseende & Språk
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  color: '#2c3e50',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  Tema
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    background: '#fff'
                  }}
                >
                  <option value="light">Ljust tema</option>
                  <option value="dark">Mörkt tema</option>
                  <option value="auto">Automatiskt</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: '#2c3e50',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  Språk
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    background: '#fff'
                  }}
                >
                  <option value="sv">Svenska</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </section>

          {/* Konto */}
          <section style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              color: '#2c3e50',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              👤 Konto
            </h2>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <button
                style={{
                  background: '#3498db',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                🔑 Ändra lösenord
              </button>

              <button
                style={{
                  background: '#f39c12',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                📱 Hantera enheter
              </button>

              <button
                style={{
                  background: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                🗑️ Ta bort konto
              </button>
            </div>
          </section>

          {/* Spara knapp */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1rem'
          }}>
            <button
              onClick={handleSaveSettings}
              style={{
                background: '#27ae60',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '1rem 3rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
            >
              💾 Spara alla inställningar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;