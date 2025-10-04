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
      <div className={"root"}>
        <div className={"container"}>
          {/* Header */}
          <header className={"header"}>
            <h1 className={"heading"}>Inställningar</h1>
            <p>Anpassa appen efter dina behov</p>
          </header>
  
          <div className={"flexColumn"}>
            {/* Notifikationer */}
            <section className={"section"}>
              <h2 className={"heading"}>🔔 Notifikationer</h2>
  
              <div className={"flexColumn"}>
                {[
                  { key: 'matchReminders', label: 'Matchpåminnelser', description: 'Få påminnelser före matcher' },
                  { key: 'trainingReminders', label: 'Träningspåminnelser', description: 'Få påminnelser före träningar' },
                  { key: 'forumUpdates', label: 'Forumuppdateringar', description: 'Notifiering vid nya inlägg i forumet' },
                  { key: 'fineNotifications', label: 'Böter', description: 'Notifiering om nya böter och betalningsfrister' },
                  { key: 'healthReminders', label: 'Hälsopåminnelser', description: 'Påminnelser om hälsokontroller och konditionstester' }
                ].map(item => (
                  <div key={item.key} className={"row"}>
                    <div>
                      <div className={"label"}>{item.label}</div>
                      <div className={"description"}>{item.description}</div>
                    </div>
                    
                    <label className={"switch"}>
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={() => handleNotificationChange(item.key as keyof typeof notifications)}
                        className={"input"}
                        title={item.label}
                      />
                      <span className={notifications[item.key as keyof typeof notifications] ? "slider checked" : "slider"}>
                        <span className={"sliderKnob"} />
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </section>
  
            {/* Sekretess */}
            <section className={"section"}>
              <h2 className={"heading"}>🔒 Sekretess</h2>
              <div className={"flexColumn"}>
                {[
                  { key: 'showProfile', label: 'Visa profil för andra', description: 'Låt andra lagmedlemmar se din profil' },
                  { key: 'showStats', label: 'Visa statistik', description: 'Låt andra se din matchstatistik' },
                  { key: 'showHealthData', label: 'Visa hälsodata', description: 'Dela hälso- och konditionsinformation med tränare' }
                ].map(item => (
                  <div key={item.key} className={"row"}>
                    <div>
                      <div className={"label"}>{item.label}</div>
                      <div className={"description"}>{item.description}</div>
                    </div>
                    <label className={"switch"}>
                      <input
                        type="checkbox"
                        checked={privacy[item.key as keyof typeof privacy]}
                        onChange={() => handlePrivacyChange(item.key as keyof typeof privacy)}
                        className={"input"}
                        title={item.label}
                      />
                      <span className={privacy[item.key as keyof typeof privacy] ? "slider checked" : "slider"}>
                        <span className={"sliderKnob"} />
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </section>
  
            {/* Utseende & Språk */}
            <section className={"section"}>
              <h2 className={"heading"}>🎨 Utseende & Språk</h2>
              <div className={"grid"}>
                <div>
                  <label className={"label"} htmlFor="theme">Tema</label>
                  <select
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className={"select"}
                    title="Välj tema"
                  >
                    <option value="light">Ljust tema</option>
                    <option value="dark">Mörkt tema</option>
                    <option value="auto">Automatiskt</option>
                  </select>
                </div>
                <div>
                  <label className={"label"} htmlFor="language">Språk</label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className={"select"}
                    title="Välj språk"
                  >
                    <option value="sv">Svenska</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </section>
  
            {/* Konto */}
            <section className={"section"}>
              <h2 className={"heading"}>👤 Konto</h2>
              <div className={"flexColumn"}>
                <button className={"button blue"}>🔑 Ändra lösenord</button>
                <button className={"button orange"}>📱 Hantera enheter</button>
                <button className={"button red"}>🗑️ Ta bort konto</button>
              </div>
            </section>
  
            {/* Spara knapp */}
            <div className={"centered"}>
              <button
                className={"button green"}
                onClick={handleSaveSettings}
              >
                💾 Spara inställningar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Settings;