import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/Toast";
import { OpponentTeam, OpponentMatch, OpponentAnalysis } from "../../types/opponent";

interface Props {
  opponent: OpponentTeam;
  previousMatches: OpponentMatch[];
  analyses: OpponentAnalysis[];
  upcomingMatch?: {
    date: string;
    venue: string;
    homeOrAway: "home" | "away";
  };
}

const PreMatchOverview: React.FC<Props> = ({ 
  opponent, 
  previousMatches, 
  analyses, 
  upcomingMatch 
}) => {
  const { isLeader } = useAuth();
  const toast = useToast();
  const [activeSection, setActiveSection] = useState<"overview" | "history" | "tactics" | "players">("overview");

  // Beräkna statistik mot denna motståndare
  const ourRecord = previousMatches.reduce((acc, match) => {
    const isHome = match.homeTeam === "FBC Nyköping";
    const ourScore = isHome ? match.score.home : match.score.away;
    const theirScore = isHome ? match.score.away : match.score.home;
    
    if (ourScore > theirScore) acc.wins++;
    else if (ourScore < theirScore) acc.losses++;
    else acc.draws++;
    
    return acc;
  }, { wins: 0, losses: 0, draws: 0 });

  const lastMatch = previousMatches[0];
  const lastMatchResult = lastMatch ? 
    (lastMatch.homeTeam === "FBC Nyköping" ? 
      `${lastMatch.score.home}-${lastMatch.score.away}` : 
      `${lastMatch.score.away}-${lastMatch.score.home}`) : null;

  const styles = {
    container: {
      background: 'var(--card-background)',
      borderRadius: '12px',
      padding: '2rem',
      border: '1px solid var(--border-color)',
      maxWidth: '1000px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '2rem',
      padding: '2rem',
      background: 'linear-gradient(135deg, #1a1a1a, #262626)',
      borderRadius: '12px',
      color: '#ffffff'
    },
    tabs: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      borderBottom: '1px solid var(--border-color)',
      paddingBottom: '1rem'
    },
    tab: {
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      background: 'var(--background-color)',
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '500' as const,
      flex: 1,
      textAlign: 'center' as const
    },
    activeTab: {
      background: 'var(--primary-color)',
      color: '#ffffff',
      borderColor: 'var(--primary-color)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    card: {
      background: 'rgba(0,0,0,0.2)',
      borderRadius: '12px',
      padding: '1.5rem',
      border: '1px solid var(--border-color)'
    },
    sectionTitle: {
      color: 'var(--text-primary)',
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1rem'
    },
    statBox: {
      textAlign: 'center' as const,
      padding: '1rem',
      background: 'rgba(59, 130, 246, 0.1)',
      borderRadius: '8px',
      border: '1px solid rgba(59, 130, 246, 0.2)'
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: 'var(--primary-color)',
      marginBottom: '0.5rem'
    },
    statLabel: {
      fontSize: '0.875rem',
      color: 'var(--text-secondary)'
    },
    chipContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '0.5rem',
      marginTop: '0.5rem'
    },
    strengthChip: {
      background: '#10b981',
      color: '#ffffff',
      padding: '0.25rem 0.75rem',
      borderRadius: '16px',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    weaknessChip: {
      background: '#ef4444',
      color: '#ffffff',
      padding: '0.25rem 0.75rem',
      borderRadius: '16px',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    warningBox: {
      background: 'rgba(245, 158, 11, 0.1)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      borderRadius: '8px',
      padding: '1rem',
      marginTop: '1rem'
    },
    actionButton: {
      background: 'var(--primary-color)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      padding: '0.75rem 1.5rem',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.875rem'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={{ margin: '0 0 1rem 0', fontSize: '2.5rem' }}>
          🎯 Förmatch-analys
        </h1>
        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          FBC Nyköping vs {opponent.name}
        </div>
        {upcomingMatch && (
          <div style={{ fontSize: '1.125rem', opacity: 0.9 }}>
            {new Date(upcomingMatch.date).toLocaleDateString('sv-SE')} • {upcomingMatch.venue}
            <span style={{ 
              marginLeft: '1rem',
              padding: '0.25rem 0.75rem',
              background: upcomingMatch.homeOrAway === 'home' ? '#10b981' : '#3b82f6',
              borderRadius: '12px',
              fontSize: '0.875rem'
            }}>
              {upcomingMatch.homeOrAway === 'home' ? '🏠 Hemma' : '✈️ Borta'}
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeSection === 'overview' ? styles.activeTab : {})
          }}
          onClick={() => setActiveSection('overview')}
        >
          📊 Översikt
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeSection === 'history' ? styles.activeTab : {})
          }}
          onClick={() => setActiveSection('history')}
        >
          📅 Historik
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeSection === 'tactics' ? styles.activeTab : {})
          }}
          onClick={() => setActiveSection('tactics')}
        >
          📋 Taktik
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeSection === 'players' ? styles.activeTab : {})
          }}
          onClick={() => setActiveSection('players')}
        >
          👥 Spelare
        </button>
      </div>

      {/* Content */}
      {activeSection === 'overview' && (
        <div>
          {/* Statistik-översikt */}
          <div style={styles.grid}>
            <div style={styles.statBox}>
              <div style={styles.statNumber}>
                {ourRecord.wins}-{ourRecord.losses}-{ourRecord.draws}
              </div>
              <div style={styles.statLabel}>Vårt facit mot dem</div>
            </div>
            
            <div style={styles.statBox}>
              <div style={styles.statNumber}>
                {opponent.teamStats.wins}-{opponent.teamStats.losses}-{opponent.teamStats.draws}
              </div>
              <div style={styles.statLabel}>Deras säsongsresultat</div>
            </div>
            
            <div style={styles.statBox}>
              <div style={styles.statNumber}>
                {(opponent.teamStats.goalsFor / opponent.teamStats.gamesPlayed).toFixed(1)}
              </div>
              <div style={styles.statLabel}>Deras mål per match</div>
            </div>
            
            <div style={styles.statBox}>
              <div style={styles.statNumber}>
                {opponent.teamStats.powerplayPercentage.toFixed(1)}%
              </div>
              <div style={styles.statLabel}>Deras powerplay</div>
            </div>
          </div>

          {/* Senaste mötet */}
          {lastMatch && (
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>🔄 Senaste mötet</h3>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {lastMatch.result || `Resultat: ${lastMatchResult}`}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {new Date(lastMatch.date).toLocaleDateString('sv-SE')} • {lastMatch.venue}
                  </div>
                </div>
                {lastMatch.ourPerformance.mvp && (
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: '#f59e0b',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    MVP: {lastMatch.ourPerformance.mvp}
                  </div>
                )}
              </div>
              
              {lastMatch.keyEvents.length > 0 && (
                <div>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0.5rem 0' }}>
                    Nyckelhändelser:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                    {lastMatch.keyEvents.map((event, index) => (
                      <li key={index}>{event}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Styrkor och svagheter */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>💪 Deras styrkor</h3>
              <div style={styles.chipContainer}>
                {opponent.strengths.map((strength, index) => (
                  <span key={index} style={styles.strengthChip}>
                    {strength}
                  </span>
                ))}
              </div>
              
              <div style={styles.warningBox}>
                <strong style={{ color: '#f59e0b' }}>⚠️ Var uppmärksam på:</strong>
                <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-primary)' }}>
                  De är starkast inom dessa områden. Undvik att ge dem möjligheter att utnyttja sina styrkor.
                </p>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>🎯 Deras svagheter</h3>
              <div style={styles.chipContainer}>
                {opponent.weaknesses.map((weakness, index) => (
                  <span key={index} style={styles.weaknessChip}>
                    {weakness}
                  </span>
                ))}
              </div>
              
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <strong style={{ color: '#10b981' }}>💡 Utnyttja:</strong>
                <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-primary)' }}>
                  Fokusera på att attackera dessa svaga punkter för att skapa chanser.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'history' && (
        <div>
          <h3 style={styles.sectionTitle}>📅 Matchhistorik mot {opponent.name}</h3>
          {previousMatches.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {previousMatches.map((match, index) => (
                <div key={match.id} style={{
                  ...styles.card,
                  border: index === 0 ? '2px solid var(--primary-color)' : '1px solid var(--border-color)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                        {new Date(match.date).toLocaleDateString('sv-SE')}
                        {index === 0 && (
                          <span style={{
                            marginLeft: '0.5rem',
                            padding: '0.25rem 0.5rem',
                            background: 'var(--primary-color)',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            color: '#ffffff'
                          }}>
                            SENASTE
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {match.venue} • {match.homeOrAway === 'home' ? 'Hemma' : 'Borta'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold',
                        color: 'var(--text-primary)'
                      }}>
                        {match.homeTeam === "FBC Nyköping" ? 
                          `${match.score.home}-${match.score.away}` : 
                          `${match.score.away}-${match.score.home}`}
                      </div>
                      <div style={{ 
                        fontSize: '0.875rem',
                        color: match.result?.includes('Vinst') ? '#10b981' : '#ef4444'
                      }}>
                        {match.result}
                      </div>
                    </div>
                  </div>
                  
                  {match.ourPerformance.mvp && (
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#f59e0b',
                      marginTop: '0.5rem'
                    }}>
                      MVP: {match.ourPerformance.mvp}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-secondary)'
            }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📅</span>
              <p>Ingen tidigare matchhistorik mot denna motståndare</p>
            </div>
          )}
        </div>
      )}

      {activeSection === 'tactics' && (
        <div>
          <h3 style={styles.sectionTitle}>📋 Taktisk analys</h3>
          
          {/* Spelstil */}
          <div style={styles.card}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
              🎮 Deras spelstil
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <strong style={{ color: 'var(--text-secondary)' }}>Offensiv:</strong>
                <span style={{ 
                  marginLeft: '0.5rem',
                  color: opponent.playStyle.offense === 'aggressive' ? '#ef4444' :
                        opponent.playStyle.offense === 'balanced' ? '#f59e0b' : '#10b981'
                }}>
                  {opponent.playStyle.offense === 'aggressive' ? '⚡ Aggressiv' :
                   opponent.playStyle.offense === 'balanced' ? '⚖️ Balanserad' : '🛡️ Defensiv'}
                </span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-secondary)' }}>Defensiv:</strong>
                <span style={{ 
                  marginLeft: '0.5rem',
                  color: opponent.playStyle.defense === 'aggressive' ? '#ef4444' :
                        opponent.playStyle.defense === 'balanced' ? '#f59e0b' : '#10b981'
                }}>
                  {opponent.playStyle.defense === 'aggressive' ? '⚡ Aggressiv' :
                   opponent.playStyle.defense === 'balanced' ? '⚖️ Balanserad' : '🛡️ Konservativ'}
                </span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-secondary)' }}>Tempo:</strong>
                <span style={{ 
                  marginLeft: '0.5rem',
                  color: opponent.playStyle.tempo === 'fast' ? '#ef4444' :
                        opponent.playStyle.tempo === 'medium' ? '#f59e0b' : '#10b981'
                }}>
                  {opponent.playStyle.tempo === 'fast' ? '💨 Snabbt' :
                   opponent.playStyle.tempo === 'medium' ? '⚖️ Medel' : '🐌 Långsamt'}
                </span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-secondary)' }}>Fysikalitet:</strong>
                <span style={{ 
                  marginLeft: '0.5rem',
                  color: opponent.playStyle.physicality === 'high' ? '#ef4444' :
                        opponent.playStyle.physicality === 'medium' ? '#f59e0b' : '#10b981'
                }}>
                  {opponent.playStyle.physicality === 'high' ? '💪 Hög' :
                   opponent.playStyle.physicality === 'medium' ? '⚖️ Medel' : '🕊️ Låg'}
                </span>
              </div>
            </div>
          </div>

          {/* Analyser */}
          {analyses.length > 0 && (
            <div style={styles.card}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
                🔍 Våra analyser
              </h4>
              {analyses.map((analysis, index) => (
                <div key={analysis.id} style={{
                  marginBottom: index < analyses.length - 1 ? '1rem' : 0,
                  padding: '1rem',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '8px'
                }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      Analys från {new Date(analysis.createdAt).toLocaleDateString('sv-SE')}
                    </strong>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    {analysis.tactics}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Rekommendationer */}
          <div style={styles.card}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
              💡 Taktiska rekommendationer
            </h4>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <ul style={{ margin: 0, color: 'var(--text-primary)', paddingLeft: '1.5rem' }}>
                <li>Anpassa vårt spel mot deras {opponent.playStyle.tempo} tempo</li>
                <li>Förbered dig på {opponent.playStyle.physicality} fysikalitet</li>
                <li>Utnyttja deras svagheter i {opponent.weaknesses[0] || 'defensiven'}</li>
                <li>Var uppmärksam på deras {opponent.strengths[0] || 'starka offensiv'}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'players' && (
        <div>
          <h3 style={styles.sectionTitle}>👥 Nyckelspelare</h3>
          
          {opponent.keyPlayers.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {opponent.keyPlayers.map(playerId => {
                const player = opponent.players.find(p => p.id === playerId);
                if (!player) return null;
                
                return (
                  <div key={player.id} style={styles.card}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem'
                    }}>
                      <div>
                        <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                          #{player.number} {player.name}
                        </h4>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                          {player.position} • {player.age} år
                        </div>
                      </div>
                      {player.statistics && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            {player.statistics.points} poäng
                          </div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {player.statistics.goals}+{player.statistics.assists}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>Styrkor:</strong>
                        <div style={styles.chipContainer}>
                          {player.strengths.map((strength, index) => (
                            <span key={index} style={styles.strengthChip}>
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>Svagheter:</strong>
                        <div style={styles.chipContainer}>
                          {player.weaknesses.map((weakness, index) => (
                            <span key={index} style={styles.weaknessChip}>
                              {weakness}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {player.notes && (
                      <div style={{ 
                        marginTop: '1rem',
                        padding: '0.75rem',
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        color: 'var(--text-primary)'
                      }}>
                        📝 {player.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-secondary)'
            }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>👥</span>
              <p>Inga nyckelspelare identifierade än</p>
              {isLeader() && (
                <button
                  style={styles.actionButton}
                  onClick={() => {
                    toast?.info('Redigera motståndarprofil för att lägga till nyckelspelare');
                  }}
                >
                  📝 Lägg till nyckelspelare
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Export-knapp */}
      {isLeader() && (
        <div style={{ 
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          <button
            style={styles.actionButton}
            onClick={() => {
              const content = `
FÖRMATCH-ANALYS: ${opponent.name}
=====================================

ÖVERSIKT:
- Vårt facit: ${ourRecord.wins}-${ourRecord.losses}-${ourRecord.draws}
- Deras säsong: ${opponent.teamStats.wins}-${opponent.teamStats.losses}-${opponent.teamStats.draws}
- Mål/match: ${(opponent.teamStats.goalsFor / opponent.teamStats.gamesPlayed).toFixed(1)}
- Powerplay: ${opponent.teamStats.powerplayPercentage.toFixed(1)}%

STYRKOR:
${opponent.strengths.map(s => `- ${s}`).join('\n')}

SVAGHETER:
${opponent.weaknesses.map(w => `- ${w}`).join('\n')}

SPELSTIL:
- Offensiv: ${opponent.playStyle.offense}
- Defensiv: ${opponent.playStyle.defense}
- Tempo: ${opponent.playStyle.tempo}
- Fysikalitet: ${opponent.playStyle.physicality}

ANTECKNINGAR:
${opponent.notes}
              `;
              
              const blob = new Blob([content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Formatch_analys_${opponent.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
              a.click();
              URL.revokeObjectURL(url);
              toast?.success('Förmatch-analys exporterad!');
            }}
          >
            📤 Exportera analys
          </button>
        </div>
      )}
    </div>
  );
};

export default PreMatchOverview;
