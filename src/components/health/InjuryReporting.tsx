import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { InjuryReport } from '../../types/health';
import { User } from '../../types/auth';

interface InjuryReportingProps {
  user: User;
}

const InjuryReporting: React.FC<InjuryReportingProps> = ({ user }) => {
  const { isLeader } = useAuth();
  
  const [selectedTab, setSelectedTab] = useState<'report' | 'my_injuries' | 'team_overview' | 'emergency'>('report');
  const [injuries, setInjuries] = useState<InjuryReport[]>([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [_selectedInjury, setSelectedInjury] = useState<InjuryReport | null>(null);
  
  const [newReport, setNewReport] = useState<Partial<InjuryReport>>({
    injuryType: 'Akut skada',
    bodyPart: 'Annan',
    severity: 'minor',
    status: 'reported',
    isPrivate: false,
    reportedBy: 'player',
    treatmentNotes: [],
    followUpSchedule: [],
    affectedActivities: []
  });

  useEffect(() => {
    // Mock data för demonstration
    const mockInjuries: InjuryReport[] = [
      {
        id: 'inj1',
        playerId: user?.id || '1',
        injuryType: 'Stukning',
        bodyPart: 'Fotled',
        severity: 'moderate',
        status: 'under_treatment',
        description: 'Stukning under träning, svullnad och smärta',
        dateReported: new Date('2025-06-25'),
        dateOfInjury: new Date('2025-06-24'),
        expectedRecoveryDate: new Date('2025-07-10'),
        treatmentNotes: [
          'RICE-behandling första 48h',
          'Vila från träning 1 vecka',
          'Fysioterapi 3x/vecka'
        ],
        medicalClearance: false,
        affectedActivities: ['training', 'matches'],
        followUpSchedule: [],
        isPrivate: false,
        reportedBy: 'player',
        attachments: []
      },
      {
        id: 'inj2',
        playerId: '2',
        injuryType: 'Kronisk smärta',
        bodyPart: 'Knä',
        severity: 'minor',
        status: 'recovering',
        description: 'Återkommande smärta efter träning',
        dateReported: new Date('2025-06-20'),
        dateOfInjury: new Date('2025-06-15'),
        expectedRecoveryDate: new Date('2025-07-15'),
        treatmentNotes: [
          'Styrketräning för quadriceps',
          'Modifierad träning',
          'Anti-inflammatorisk medicin'
        ],
        medicalClearance: false,
        affectedActivities: ['high_intensity_training'],
        followUpSchedule: [],
        isPrivate: false,
        reportedBy: 'coach',
        attachments: []
      }
    ];
    
    setInjuries(mockInjuries);
  }, [user?.id]);

  const submitReport = () => {
    if (!newReport.injuryType || !newReport.description) {
      console.log("Fyll i skadetyp och beskrivning");
      return;
    }

    const report: InjuryReport = {
      ...newReport as InjuryReport,
      id: `inj_${Date.now()}`,
      playerId: user?.id || '',
      dateReported: new Date(),
      treatmentNotes: [],
      followUpSchedule: [],
      medicalClearance: false,
      affectedActivities: []
    };

    setInjuries(prev => [report, ...prev]);
    setNewReport({
      injuryType: 'Akut skada',
      bodyPart: 'Annan', 
      severity: 'minor',
      status: 'reported',
      isPrivate: false,
      reportedBy: 'player',
      treatmentNotes: [],
      followUpSchedule: [],
      affectedActivities: []
    });
    setShowReportForm(false);
    console.log("Skaderapport skickad");
  };

  const getCategoryIcon = (bodyPart: string) => {
    switch (bodyPart) {
      case 'Fotled/Fot': 
      case 'Fotled':
      case 'Fot': return '🦶';
      case 'Knä/Ben':
      case 'Knä':
      case 'Ben': return '🦵';
      case 'Axel/Arm':
      case 'Axel':
      case 'Arm': return '💪';
      case 'Rygg': return '🔙';
      case 'Handled/Hand':
      case 'Handled':
      case 'Hand': return '🤲';
      case 'Huvud/Nacke':
      case 'Huvud':
      case 'Nacke': return '🧠';
      default: return '🏥';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'severe': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#64748b';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return '#3b82f6';
      case 'under_treatment': return '#f59e0b';
      case 'recovering': return '#10b981';
      case 'ready_to_play': return '#22c55e';
      case 'long_term': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'reported': return 'Rapporterad';
      case 'under_treatment': return 'Under behandling';
      case 'recovering': return 'Återhämtning';
      case 'ready_to_play': return 'Klar för spel';
      case 'long_term': return 'Långtidsskada';
      default: return status;
    }
  };

  const myInjuries = injuries.filter(injury => injury.playerId === user?.id);
  const teamInjuries = isLeader() ? injuries : injuries.filter(injury => !injury.isPrivate);

  const tabs = [
    { id: 'report', name: 'Anmäl Skada', icon: '📝' },
    { id: 'my_injuries', name: `Mina Skador (${myInjuries.length})`, icon: '👤' },
    { id: 'team_overview', name: 'Lagöversikt', icon: '👥' },
    { id: 'emergency', name: 'Nödinformation', icon: '🚨' }
  ];

  return (
    <div style={{
      background: "#1a202c",
      padding: "20px",
      borderRadius: "12px",
      color: "#fff"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>
          🏥 Skaderapport & Hälsa
        </h2>
        <p style={{ margin: "4px 0 0 0", color: "#a0aec0" }}>
          Anmäl skador, följ rehabilitering och håll koll på lagets hälsostatus
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "20px",
        borderBottom: "1px solid #4a5568",
        paddingBottom: "12px",
        flexWrap: "wrap"
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            style={{
              padding: "8px 16px",
              background: selectedTab === tab.id ? "#3b82f6" : "transparent",
              border: "none",
              borderRadius: "6px",
              color: selectedTab === tab.id ? "#fff" : "#a0aec0",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px"
            }}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Report Injury Tab */}
      {selectedTab === 'report' && (
        <div>
          {!showReportForm ? (
            <div style={{
              background: "#2d3748",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏥</div>
              <h3 style={{ margin: "0 0 8px 0" }}>Anmäl en skada</h3>
              <p style={{ margin: "0 0 20px 0", color: "#a0aec0" }}>
                Rapportera skador så att våra ledare kan hjälpa dig med rehabilitering
              </p>
              <button
                onClick={() => setShowReportForm(true)}
                style={{
                  padding: "12px 24px",
                  background: "#ef4444",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "16px"
                }}
              >
                📝 Anmäl Skada
              </button>
            </div>
          ) : (
            <div style={{
              background: "#2d3748",
              padding: "20px",
              borderRadius: "8px"
            }}>
              <h3 style={{ margin: "0 0 16px 0" }}>Anmäl ny skada</h3>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
                marginBottom: "16px"
              }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#a0aec0" }}>
                    Beskrivning *
                  </label>
                  <textarea
                    value={newReport.description || ''}
                    onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Beskriv skadan och hur den uppstod..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "#1a202c",
                      border: "1px solid #4a5568",
                      borderRadius: "4px",
                      color: "#fff",
                      resize: "vertical"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#a0aec0" }}>
                    Kroppsdel
                  </label>
                  <select
                    value={newReport.bodyPart || ''}
                    onChange={(e) => setNewReport(prev => ({ ...prev, bodyPart: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "#1a202c",
                      border: "1px solid #4a5568",
                      borderRadius: "4px",
                      color: "#fff"
                    }}
                  >
                    <option value="Fotled/Fot">Fotled/Fot</option>
                    <option value="Knä/Ben">Knä/Ben</option>
                    <option value="Axel/Arm">Axel/Arm</option>
                    <option value="Rygg">Rygg</option>
                    <option value="Handled/Hand">Handled/Hand</option>
                    <option value="Huvud/Nacke">Huvud/Nacke</option>
                    <option value="Annan">Övrigt</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#a0aec0" }}>
                    Typ av skada
                  </label>
                  <input
                    type="text"
                    value={newReport.injuryType || ''}
                    onChange={(e) => setNewReport(prev => ({ ...prev, injuryType: e.target.value }))}
                    placeholder="T.ex. Stukning, Träning, Överbelastning..."
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "#1a202c",
                      border: "1px solid #4a5568",
                      borderRadius: "4px",
                      color: "#fff"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#a0aec0" }}>
                    Allvarlighetsgrad
                  </label>
                  <select
                    value={newReport.severity}
                    onChange={(e) => setNewReport(prev => ({ ...prev, severity: e.target.value as any }))}
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "#1a202c",
                      border: "1px solid #4a5568",
                      borderRadius: "4px",
                      color: "#fff"
                    }}
                  >
                    <option value="minor">Lindrig</option>
                    <option value="moderate">Måttlig</option>
                    <option value="severe">Allvarlig</option>
                    <option value="critical">Kritisk</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#a0aec0" }}>
                    När inträffade skadan?
                  </label>
                  <input
                    type="date"
                    value={newReport.dateOfInjury ? 
                      (newReport.dateOfInjury instanceof Date ? 
                        newReport.dateOfInjury.toISOString().split('T')[0] : 
                        newReport.dateOfInjury) : ''}
                    onChange={(e) => setNewReport(prev => ({ ...prev, dateOfInjury: new Date(e.target.value) }))}
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: "#1a202c",
                      border: "1px solid #4a5568",
                      borderRadius: "4px",
                      color: "#fff"
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer"
                }}>
                  <input
                    type="checkbox"
                    checked={newReport.isPrivate}
                    onChange={(e) => setNewReport(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  />
                  <span style={{ fontSize: "14px" }}>
                    🔒 Privat rapport (endast synlig för ledare)
                  </span>
                </label>
              </div>

              <div style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end"
              }}>
                <button
                  onClick={() => setShowReportForm(false)}
                  style={{
                    padding: "8px 16px",
                    background: "#4a5568",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Avbryt
                </button>
                <button
                  onClick={submitReport}
                  style={{
                    padding: "8px 16px",
                    background: "#ef4444",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  📝 Skicka Rapport
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* My Injuries Tab */}
      {selectedTab === 'my_injuries' && (
        <div>
          <h3 style={{ margin: "0 0 16px 0" }}>Mina Skador</h3>
          
          {myInjuries.length === 0 ? (
            <div style={{
              background: "#2d3748",
              padding: "40px",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>💪</div>
              <h4 style={{ margin: "0 0 8px 0" }}>Inga aktiva skador!</h4>
              <p style={{ margin: 0, color: "#a0aec0" }}>
                Håll dig skadefri och fortsätt träna hårt!
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gap: "16px"
            }}>
              {myInjuries.map(injury => (
                <div
                  key={injury.id}
                  style={{
                    background: "#2d3748",
                    padding: "16px",
                    borderRadius: "8px",
                    border: `2px solid ${getStatusColor(injury.status)}`
                  }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px"
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px"
                      }}>
                        <span style={{ fontSize: "20px" }}>
                          {getCategoryIcon(injury.bodyPart)}
                        </span>
                        <h4 style={{ margin: 0, fontWeight: "600" }}>
                          {injury.injuryType} - {injury.bodyPart}
                        </h4>
                      </div>
                      <p style={{ margin: "0 0 8px 0", color: "#a0aec0", fontSize: "14px" }}>
                        {injury.description}
                      </p>
                    </div>
                    
                    <div style={{
                      background: getStatusColor(injury.status),
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      {getStatusText(injury.status)}
                    </div>
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "12px",
                    marginBottom: "12px"
                  }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "#a0aec0" }}>Rapporterad</div>
                      <div style={{ fontSize: "14px", fontWeight: "600" }}>
                        {new Date(injury.dateReported).toLocaleDateString('sv-SE')}
                      </div>
                    </div>
                    
                    {injury.expectedRecoveryDate && (
                      <div>
                        <div style={{ fontSize: "12px", color: "#a0aec0" }}>Förväntad återkomst</div>
                        <div style={{ fontSize: "14px", fontWeight: "600" }}>
                          {new Date(injury.expectedRecoveryDate).toLocaleDateString('sv-SE')}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div style={{ fontSize: "12px", color: "#a0aec0" }}>Allvarlighetsgrad</div>
                      <div style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: getSeverityColor(injury.severity)
                      }}>
                        {injury.severity === 'minor' ? 'Lindrig' :
                         injury.severity === 'moderate' ? 'Måttlig' :
                         injury.severity === 'severe' ? 'Allvarlig' : 'Kritisk'}
                      </div>
                    </div>
                  </div>

                  {injury.treatmentNotes.length > 0 && (
                    <div style={{
                      background: "#1a202c",
                      padding: "12px",
                      borderRadius: "6px"
                    }}>
                      <div style={{ fontSize: "12px", color: "#a0aec0", marginBottom: "6px" }}>
                        Behandlingsplan:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: "16px" }}>
                        {injury.treatmentNotes.map((note, index) => (
                          <li key={index} style={{ fontSize: "14px", marginBottom: "2px" }}>
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "12px"
                  }}>
                    <button
                      onClick={() => setSelectedInjury(injury)}
                      style={{
                        padding: "6px 12px",
                        background: "#3b82f6",
                        border: "none",
                        borderRadius: "4px",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600"
                      }}
                    >
                      📋 Detaljer
                    </button>
                    {injury.status !== 'ready_to_play' && (
                      <button
                        style={{
                          padding: "6px 12px",
                          background: "#10b981",
                          border: "none",
                          borderRadius: "4px",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "600"
                        }}
                      >
                        📝 Uppdatera Status
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Team Overview Tab */}
      {selectedTab === 'team_overview' && (
        <div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px"
          }}>
            <h3 style={{ margin: 0 }}>Lagöversikt - Skador</h3>
            {isLeader() && (
              <button
                style={{
                  padding: "8px 16px",
                  background: "#10b981",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px"
                }}
              >
                📊 Exportera Rapport
              </button>
            )}
          </div>

          {/* Status Overview */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px",
            marginBottom: "20px"
          }}>
            {[
              { status: 'reported', label: 'Rapporterade', count: teamInjuries.filter(i => i.status === 'reported').length },
              { status: 'under_treatment', label: 'Under behandling', count: teamInjuries.filter(i => i.status === 'under_treatment').length },
              { status: 'recovering', label: 'Återhämtning', count: teamInjuries.filter(i => i.status === 'recovering').length },
              { status: 'ready_to_play', label: 'Redo att spela', count: teamInjuries.filter(i => i.status === 'ready_to_play').length }
            ].map(item => (
              <div
                key={item.status}
                style={{
                  background: "#2d3748",
                  padding: "16px",
                  borderRadius: "8px",
                  textAlign: "center",
                  border: `2px solid ${getStatusColor(item.status)}`
                }}
              >
                <div style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: getStatusColor(item.status),
                  marginBottom: "4px"
                }}>
                  {item.count}
                </div>
                <div style={{ fontSize: "12px", color: "#a0aec0" }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Team Injuries List */}
          <div style={{
            display: "grid",
            gap: "12px"
          }}>
            {teamInjuries.map(injury => {
              const playerName = injury.playerId === '1' ? 'Simon Andersson' : 
                                injury.playerId === '2' ? 'Anna Svensson' : 
                                injury.playerId === '3' ? 'Erik Nilsson' : 'Okänd spelare';
              
              return (
                <div
                  key={injury.id}
                  style={{
                    background: "#2d3748",
                    padding: "16px",
                    borderRadius: "8px",
                    border: `1px solid ${getStatusColor(injury.status)}`
                  }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start"
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px"
                      }}>
                        <span style={{ fontSize: "16px" }}>
                          {getCategoryIcon(injury.bodyPart)}
                        </span>
                        <span style={{ fontWeight: "600" }}>{playerName}</span>
                        <span style={{ color: "#a0aec0" }}>-</span>
                        <span>{injury.injuryType} - {injury.bodyPart}</span>
                      </div>
                      
                      {!injury.isPrivate && (
                        <p style={{ margin: "0 0 8px 0", color: "#a0aec0", fontSize: "14px" }}>
                          {injury.description}
                        </p>
                      )}
                      
                      <div style={{ fontSize: "12px", color: "#718096" }}>
                        Rapporterad: {new Date(injury.dateReported).toLocaleDateString('sv-SE')}
                        {injury.expectedRecoveryDate && (
                          <span> | Återkomst: {new Date(injury.expectedRecoveryDate).toLocaleDateString('sv-SE')}</span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{
                      background: getStatusColor(injury.status),
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      {getStatusText(injury.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {teamInjuries.length === 0 && (
            <div style={{
              background: "#2d3748",
              padding: "40px",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>💪</div>
              <h4 style={{ margin: "0 0 8px 0" }}>Inga aktiva skador i laget!</h4>
              <p style={{ margin: 0, color: "#a0aec0" }}>
                Fantastiskt! Alla spelare är redo för träning och match.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Emergency Info Tab */}
      {selectedTab === 'emergency' && (
        <div>
          <h3 style={{ margin: "0 0 16px 0" }}>🚨 Nödinformation</h3>
          
          <div style={{
            background: "#dc2626",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "20px"
          }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#fff" }}>Vid akut skada:</h4>
            <ol style={{ margin: 0, paddingLeft: "20px", color: "#fee2e2" }}>
              <li>Kontakta 112 vid allvarlig skada</li>
              <li>Administrera första hjälpen</li>
              <li>Kontakta förälder/vårdnadshavare (under 18 år)</li>
              <li>Rapportera skadan i appen</li>
              <li>Kontakta ledare: <strong>+46 70 123 45 67</strong></li>
            </ol>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px"
          }}>
            <div style={{
              background: "#2d3748",
              padding: "16px",
              borderRadius: "8px"
            }}>
              <h4 style={{ margin: "0 0 12px 0" }}>📞 Viktiga Kontakter</h4>
              <div style={{ fontSize: "14px" }}>
                <div style={{ marginBottom: "8px" }}>
                  <strong>Akutvård:</strong> 112
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <strong>Vårdguiden:</strong> 1177
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <strong>Huvudtränare:</strong> +46 70 123 45 67
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <strong>Lagläkare:</strong> +46 70 987 65 43
                </div>
                <div>
                  <strong>Fysioterapeut:</strong> +46 70 555 12 34
                </div>
              </div>
            </div>

            <div style={{
              background: "#2d3748",
              padding: "16px",
              borderRadius: "8px"
            }}>
              <h4 style={{ margin: "0 0 12px 0" }}>🏥 Närliggande Vårdcentral</h4>
              <div style={{ fontSize: "14px" }}>
                <div style={{ marginBottom: "8px" }}>
                  <strong>Nyköpings Vårdcentral</strong>
                </div>
                <div style={{ marginBottom: "4px", color: "#a0aec0" }}>
                  Västra Storgatan 15, Nyköping
                </div>
                <div style={{ marginBottom: "4px", color: "#a0aec0" }}>
                  Tel: 0155-24 80 00
                </div>
                <div style={{ color: "#a0aec0" }}>
                  Öppet: Mån-Fre 8-17, Akut: 24/7
                </div>
              </div>
            </div>

            <div style={{
              background: "#2d3748",
              padding: "16px",
              borderRadius: "8px"
            }}>
              <h4 style={{ margin: "0 0 12px 0" }}>🚑 Första Hjälpen</h4>
              <div style={{ fontSize: "14px" }}>
                <div style={{ marginBottom: "8px" }}>
                  <strong>RICE-metoden:</strong>
                </div>
                <ul style={{ margin: 0, paddingLeft: "16px", color: "#a0aec0" }}>
                  <li>Rest (Vila)</li>
                  <li>Ice (Kyla)</li>
                  <li>Compression (Kompression)</li>
                  <li>Elevation (Höjdläge)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InjuryReporting;
