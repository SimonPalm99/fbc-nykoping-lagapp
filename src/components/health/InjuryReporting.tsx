import styles from './InjuryReporting.module.css';
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
  const [selectedInjury, setSelectedInjury] = useState<InjuryReport | null>(null);
  
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
    <div className={styles.injuryReportingRoot}>
      {/* Injury Details Modal */}
      {selectedInjury && (
        <div className={styles.injuryReportingModalOverlay}>
          <div className={styles.injuryReportingModal}>
            <button
              className={styles.injuryReportingModalClose}
              onClick={() => setSelectedInjury(null)}
              title="Stäng"
            >
              ✖
            </button>
            <h3 className={styles.injuryReportingModalTitle}>
              {getCategoryIcon(selectedInjury.bodyPart)} {selectedInjury.injuryType} - {selectedInjury.bodyPart}
            </h3>
            <div className={styles.injuryReportingModalSection}>
              <strong>Beskrivning:</strong>
              <p>{selectedInjury.description}</p>
            </div>
            <div className={styles.injuryReportingModalSection}>
              <strong>Rapporterad:</strong> {new Date(selectedInjury.dateReported).toLocaleDateString('sv-SE')}
            </div>
            {selectedInjury.dateOfInjury && (
              <div className={styles.injuryReportingModalSection}>
                <strong>Skadedatum:</strong> {new Date(selectedInjury.dateOfInjury).toLocaleDateString('sv-SE')}
              </div>
            )}
            {selectedInjury.expectedRecoveryDate && (
              <div className={styles.injuryReportingModalSection}>
                <strong>Förväntad återkomst:</strong> {new Date(selectedInjury.expectedRecoveryDate).toLocaleDateString('sv-SE')}
              </div>
            )}
            <div className={styles.injuryReportingModalSection}>
              <strong>Status:</strong> {getStatusText(selectedInjury.status)}
            </div>
            <div className={styles.injuryReportingModalSection}>
              <strong>Allvarlighetsgrad:</strong> {selectedInjury.severity === 'minor' ? 'Lindrig' : selectedInjury.severity === 'moderate' ? 'Måttlig' : selectedInjury.severity === 'severe' ? 'Allvarlig' : 'Kritisk'}
            </div>
            {selectedInjury.treatmentNotes.length > 0 && (
              <div className={styles.injuryReportingModalSection}>
                <strong>Behandlingsplan:</strong>
                <ul>
                  {selectedInjury.treatmentNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Add more details if needed */}
          </div>
        </div>
      )}
      {/* Header */}
      <div className={styles.injuryReportingHeader}>
        <h2 className={styles.injuryReportingTitle}>🏥 Skaderapport & Hälsa</h2>
        <p className={styles.injuryReportingSubtitle}>
          Anmäl skador, följ rehabilitering och håll koll på lagets hälsostatus
        </p>
      </div>

      {/* Tabs */}
      <div className={styles.injuryReportingTabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={
              selectedTab === tab.id
                ? `${styles.injuryReportingTabButton} ${styles.injuryReportingTabButtonActive}`
                : styles.injuryReportingTabButton
            }
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
            <div className={`${styles.injuryReportingForm} ${styles.injuryReportingFormCentered}`}>
              <div className={styles.injuryReportingFormIcon}>🏥</div>
              <h3 className={styles.injuryReportingFormTitle}>Anmäl en skada</h3>
              <p className={styles.injuryReportingFormSubtitle}>
                Rapportera skador så att våra ledare kan hjälpa dig med rehabilitering
              </p>
              <button
                onClick={() => setShowReportForm(true)}
                className={styles.injuryReportingButton}
              >
                📝 Anmäl Skada
              </button>
            </div>
          ) : (
            <div className={styles.injuryReportingForm}>
              <h3 className={styles.injuryReportingFormTitle}>Anmäl ny skada</h3>
              <div className={styles.injuryReportingFormGrid}>
                <div>
                  <label className={styles.injuryReportingLabel}>
                    Beskrivning *
                  </label>
                  <textarea
                    value={newReport.description || ''}
                    onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Beskriv skadan och hur den uppstod..."
                    rows={3}
                    className={styles.injuryReportingTextarea}
                  />
                </div>

                <div>
                  <label className={styles.injuryReportingLabel}>
                    Kroppsdel
                  </label>
                  <select
                    value={newReport.bodyPart || ''}
                    onChange={(e) => setNewReport(prev => ({ ...prev, bodyPart: e.target.value }))}
                    className={styles.injuryReportingSelect}
                    title="Välj kroppsdel"
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
                  <label className={styles.injuryReportingLabel}>
                    Typ av skada
                  </label>
                  <input
                    type="text"
                    value={newReport.injuryType || ''}
                    onChange={(e) => setNewReport(prev => ({ ...prev, injuryType: e.target.value }))}
                    placeholder="T.ex. Stukning, Träning, Överbelastning..."
                    className={styles.injuryReportingInput}
                  />
                </div>

                <div>
                  <label className={styles.injuryReportingLabel}>
                    Allvarlighetsgrad
                  </label>
                  <select
                    value={newReport.severity}
                    onChange={(e) => setNewReport(prev => ({ ...prev, severity: e.target.value as any }))}
                    className={styles.injuryReportingSelect}
                    title="Välj allvarlighetsgrad"
                  >
                    <option value="minor">Lindrig</option>
                    <option value="moderate">Måttlig</option>
                    <option value="severe">Allvarlig</option>
                    <option value="critical">Kritisk</option>
                  </select>
                </div>

                <div>
                  <label className={styles.injuryReportingLabel}>
                    När inträffade skadan?
                  </label>
                  <input
                    type="date"
                    value={newReport.dateOfInjury ? 
                      (newReport.dateOfInjury instanceof Date ? 
                        newReport.dateOfInjury.toISOString().split('T')[0] : 
                        newReport.dateOfInjury) : ''}
                    onChange={(e) => setNewReport(prev => ({ ...prev, dateOfInjury: new Date(e.target.value) }))}
                    className={styles.injuryReportingInput}
                    title="Välj datum för skadan"
                    placeholder="Välj datum"
                  />
                </div>
              </div>

              <div className={styles.injuryReportingCheckboxRow}>
                <label className={styles.injuryReportingCheckboxLabel}>
                  <input
                    type="checkbox"
                    checked={newReport.isPrivate}
                    onChange={(e) => setNewReport(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  />
                  <span className={styles.injuryReportingCheckboxText}>
                    🔒 Privat rapport (endast synlig för ledare)
                  </span>
                </label>
              </div>

              <div className={styles.injuryReportingFormActions}>
                <button
                  onClick={() => setShowReportForm(false)}
                  className={`${styles.injuryReportingButton} ${styles.injuryReportingButtonCancel}`}
                >
                  Avbryt
                </button>
                <button
                  onClick={submitReport}
                  className={styles.injuryReportingButton}
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
          <h3 className={styles.injuryReportingSectionTitle}>Mina Skador</h3>
          {myInjuries.length === 0 ? (
            <div className={styles.injuryReportingEmptyCard}>
              <div className={styles.injuryReportingEmptyIcon}>💪</div>
              <h4 className={styles.injuryReportingEmptyTitle}>Inga aktiva skador!</h4>
              <p className={styles.injuryReportingEmptyText}>
                Håll dig skadefri och fortsätt träna hårt!
              </p>
            </div>
          ) : (
            <div className={styles.injuryReportingInjuryList}>
              {myInjuries.map(injury => (
                <div
                  key={injury.id}
                  className={
                    `${styles.injuryReportingInjuryCard} ` +
                    (injury.status === 'reported' ? styles.statusReported :
                     injury.status === 'under_treatment' ? styles.statusUnderTreatment :
                     injury.status === 'recovering' ? styles.statusRecovering :
                     injury.status === 'ready_to_play' ? styles.statusReadyToPlay :
                     injury.status === 'long_term' ? styles.statusLongTerm :
                     styles.statusDefault)
                  }
                >
                  <div className={styles.injuryReportingInjuryHeader}>
                    <div className={styles.injuryReportingInjuryHeaderLeft}>
                      <div className={styles.injuryReportingInjuryHeaderIconTitle}>
                        <span className={styles.injuryReportingInjuryIcon}> {getCategoryIcon(injury.bodyPart)} </span>
                        <h4 className={styles.injuryReportingInjuryTitle}>
                          {injury.injuryType} - {injury.bodyPart}
                        </h4>
                      </div>
                      <p className={styles.injuryReportingInjuryDesc}>
                        {injury.description}
                      </p>
                    </div>
                    <div
                      className={
                        `${styles.injuryReportingInjuryStatus} ` +
                        (injury.status === 'reported' ? styles.statusReportedBg :
                         injury.status === 'under_treatment' ? styles.statusUnderTreatmentBg :
                         injury.status === 'recovering' ? styles.statusRecoveringBg :
                         injury.status === 'ready_to_play' ? styles.statusReadyToPlayBg :
                         injury.status === 'long_term' ? styles.statusLongTermBg :
                         styles.statusDefaultBg)
                      }
                    >
                      {getStatusText(injury.status)}
                    </div>
                  </div>
                  <div className={styles.injuryReportingInjuryMetaGrid}>
                    <div>
                      <div className={styles.injuryReportingInjuryMetaLabel}>Rapporterad</div>
                      <div className={styles.injuryReportingInjuryMetaValue}>
                        {new Date(injury.dateReported).toLocaleDateString('sv-SE')}
                      </div>
                    </div>
                    {injury.expectedRecoveryDate && (
                      <div>
                        <div className={styles.injuryReportingInjuryMetaLabel}>Förväntad återkomst</div>
                        <div className={styles.injuryReportingInjuryMetaValue}>
                          {new Date(injury.expectedRecoveryDate).toLocaleDateString('sv-SE')}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className={styles.injuryReportingInjuryMetaLabel}>Allvarlighetsgrad</div>
                      <div
                        className={
                          `${styles.injuryReportingInjuryMetaValue} ` +
                          (injury.severity === 'minor' ? styles.severityMinor :
                           injury.severity === 'moderate' ? styles.severityModerate :
                           injury.severity === 'severe' ? styles.severitySevere :
                           styles.severityCritical)
                        }
                      >
                        {injury.severity === 'minor' ? 'Lindrig' :
                         injury.severity === 'moderate' ? 'Måttlig' :
                         injury.severity === 'severe' ? 'Allvarlig' : 'Kritisk'}
                      </div>
                    </div>
                  </div>
                  {injury.treatmentNotes.length > 0 && (
                    <div className={styles.injuryReportingInjuryPlanCard}>
                      <div className={styles.injuryReportingInjuryPlanLabel}>
                        Behandlingsplan:
                      </div>
                      <ul className={styles.injuryReportingInjuryPlanList}>
                        {injury.treatmentNotes.map((note, index) => (
                          <li key={index} className={styles.injuryReportingInjuryPlanListItem}>
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className={styles.injuryReportingInjuryActions}>
                    <button
                      onClick={() => setSelectedInjury(injury)}
                      className={styles.injuryReportingInjuryActionButton}
                    >
                      📋 Detaljer
                    </button>
                    {injury.status !== 'ready_to_play' && (
                      <button
                        className={styles.injuryReportingInjuryActionButtonGreen}
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
          <div className={styles.injuryReportingOverviewHeader}>
            <h3 className={styles.injuryReportingSectionTitle}>Lagöversikt - Skador</h3>
            {isLeader() && (
              <button className={styles.injuryReportingExportButton}>
                📊 Exportera Rapport
              </button>
            )}
          </div>
          {/* Status Overview */}
          <div className={styles.injuryReportingStatusGrid}>
            {[
              { status: 'reported', label: 'Rapporterade', count: teamInjuries.filter(i => i.status === 'reported').length },
              { status: 'under_treatment', label: 'Under behandling', count: teamInjuries.filter(i => i.status === 'under_treatment').length },
              { status: 'recovering', label: 'Återhämtning', count: teamInjuries.filter(i => i.status === 'recovering').length },
              { status: 'ready_to_play', label: 'Redo att spela', count: teamInjuries.filter(i => i.status === 'ready_to_play').length }
            ].map(item => (
              <div
                key={item.status}
                className={
                  `${styles.injuryReportingStatusCard} ` +
                  (item.status === 'reported' ? styles.statusReported :
                   item.status === 'under_treatment' ? styles.statusUnderTreatment :
                   item.status === 'recovering' ? styles.statusRecovering :
                   item.status === 'ready_to_play' ? styles.statusReadyToPlay :
                   item.status === 'long_term' ? styles.statusLongTerm :
                   styles.statusDefault)
                }
              >
                <div
                  className={
                    `${styles.injuryReportingStatusCount} ` +
                    (item.status === 'reported' ? styles.statusReportedText :
                     item.status === 'under_treatment' ? styles.statusUnderTreatmentText :
                     item.status === 'recovering' ? styles.statusRecoveringText :
                     item.status === 'ready_to_play' ? styles.statusReadyToPlayText :
                     item.status === 'long_term' ? styles.statusLongTermText :
                     styles.statusDefaultText)
                  }
                >
                  {item.count}
                </div>
                <div className={styles.injuryReportingStatusLabel}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
          {/* Team Injuries List */}
          <div className={styles.injuryReportingTeamList}>
            {teamInjuries.map(injury => {
              const playerName = injury.playerId === '1' ? 'Simon Andersson' : 
                                injury.playerId === '2' ? 'Anna Svensson' : 
                                injury.playerId === '3' ? 'Erik Nilsson' : 'Okänd spelare';
              return (
                <div
                  key={injury.id}
                  className={
                    `${styles.injuryReportingTeamCard} ` +
                    (injury.status === 'reported' ? styles.statusReported :
                     injury.status === 'under_treatment' ? styles.statusUnderTreatment :
                     injury.status === 'recovering' ? styles.statusRecovering :
                     injury.status === 'ready_to_play' ? styles.statusReadyToPlay :
                     injury.status === 'long_term' ? styles.statusLongTerm :
                     styles.statusDefault)
                  }
                >
                  <div className={styles.injuryReportingTeamCardHeader}>
                    <div className={styles.injuryReportingTeamCardHeaderLeft}>
                      <span className={styles.injuryReportingTeamCardIcon}>{getCategoryIcon(injury.bodyPart)}</span>
                      <span className={styles.injuryReportingTeamCardPlayer}>{playerName}</span>
                      <span className={styles.injuryReportingTeamCardDash}>-</span>
                      <span>{injury.injuryType} - {injury.bodyPart}</span>
                    </div>
                    <div
                      className={
                        `${styles.injuryReportingTeamCardStatus} ` +
                        (injury.status === 'reported' ? styles.statusReportedBg :
                         injury.status === 'under_treatment' ? styles.statusUnderTreatmentBg :
                         injury.status === 'recovering' ? styles.statusRecoveringBg :
                         injury.status === 'ready_to_play' ? styles.statusReadyToPlayBg :
                         injury.status === 'long_term' ? styles.statusLongTermBg :
                         styles.statusDefaultBg)
                      }
                    >
                      {getStatusText(injury.status)}
                    </div>
                  </div>
                  {!injury.isPrivate && (
                    <p className={styles.injuryReportingTeamCardDesc}>
                      {injury.description}
                    </p>
                  )}
                  <div className={styles.injuryReportingTeamCardMeta}>
                    Rapporterad: {new Date(injury.dateReported).toLocaleDateString('sv-SE')}
                    {injury.expectedRecoveryDate && (
                      <span> | Återkomst: {new Date(injury.expectedRecoveryDate).toLocaleDateString('sv-SE')}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {teamInjuries.length === 0 && (
            <div className={styles.injuryReportingEmptyCard}>
              <div className={styles.injuryReportingEmptyIcon}>💪</div>
              <h4 className={styles.injuryReportingEmptyTitle}>Inga aktiva skador i laget!</h4>
              <p className={styles.injuryReportingEmptyText}>
                Fantastiskt! Alla spelare är redo för träning och match.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Emergency Info Tab */}
      {selectedTab === 'emergency' && (
        <div>
          <h3 className={styles.injuryReportingEmergencyTitle}>🚨 Nödinformation</h3>
          <div className={styles.injuryReportingEmergencyCard}>
            <h4 className={styles.injuryReportingEmergencyCardTitle}>Vid akut skada:</h4>
            <ol className={styles.injuryReportingEmergencyList}>
              <li>Kontakta 112 vid allvarlig skada</li>
              <li>Administrera första hjälpen</li>
              <li>Kontakta förälder/vårdnadshavare (under 18 år)</li>
              <li>Rapportera skadan i appen</li>
              <li>Kontakta ledare: <strong>+46 70 123 45 67</strong></li>
            </ol>
          </div>
          <div className={styles.injuryReportingEmergencyGrid}>
            <div className={styles.injuryReportingEmergencyInfoCard}>
              <h4 className={styles.injuryReportingEmergencyInfoTitle}>📞 Viktiga Kontakter</h4>
              <div className={styles.injuryReportingEmergencyInfoText}>
                <div className={styles.injuryReportingEmergencyInfoRow}>
                  <strong>Akutvård:</strong> 112
                </div>
                <div className={styles.injuryReportingEmergencyInfoRow}>
                  <strong>Vårdguiden:</strong> 1177
                </div>
                <div className={styles.injuryReportingEmergencyInfoRow}>
                  <strong>Huvudtränare:</strong> +46 70 123 45 67
                </div>
                <div className={styles.injuryReportingEmergencyInfoRow}>
                  <strong>Lagläkare:</strong> +46 70 987 65 43
                </div>
                <div>
                  <strong>Fysioterapeut:</strong> +46 70 555 12 34
                </div>
              </div>
            </div>
            <div className={styles.injuryReportingEmergencyInfoCard}>
              <h4 className={styles.injuryReportingEmergencyInfoTitle}>🏥 Närliggande Vårdcentral</h4>
              <div className={styles.injuryReportingEmergencyInfoText}>
                <div className={styles.injuryReportingEmergencyInfoRow}>
                  <strong>Nyköpings Vårdcentral</strong>
                </div>
                <div className={styles.injuryReportingEmergencyInfoRowSecondary}>
                  Västra Storgatan 15, Nyköping
                </div>
                <div className={styles.injuryReportingEmergencyInfoRowSecondary}>
                  Tel: 0155-24 80 00
                </div>
                <div className={styles.injuryReportingEmergencyInfoRowSecondary}>
                  Öppet: Mån-Fre 8-17, Akut: 24/7
                </div>
              </div>
            </div>
            <div className={styles.injuryReportingEmergencyInfoCard}>
              <h4 className={styles.injuryReportingEmergencyInfoTitle}>🚑 Första Hjälpen</h4>
              <div className={styles.injuryReportingEmergencyInfoText}>
                <div className={styles.injuryReportingEmergencyInfoRow}>
                  <strong>RICE-metoden:</strong>
                </div>
                <ul className={styles.injuryReportingEmergencyInfoList}>
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
