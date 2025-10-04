import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/Toast";
import { OpponentTeam, OpponentMatch, OpponentAnalysis } from "../../types/opponent";
import styles from "./PreMatchOverview.module.css";

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


  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>
          🎯 Förmatch-analys
        </h1>
        <div className={styles.headerTeams}>
          FBC Nyköping vs {opponent.name}
        </div>
        {upcomingMatch && (
          <div className={styles.headerMatchInfo}>
            {new Date(upcomingMatch.date).toLocaleDateString('sv-SE')} • {upcomingMatch.venue}
            <span
              className={`${styles.headerMatchChip} ${upcomingMatch.homeOrAway === 'home' ? styles.homeChip : styles.awayChip}`}
            >
              {upcomingMatch.homeOrAway === 'home' ? '🏠 Hemma' : '✈️ Borta'}
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeSection === 'overview' ? styles.activeTab : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          📊 Översikt
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'history' ? styles.activeTab : ''}`}
          onClick={() => setActiveSection('history')}
        >
          📅 Historik
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'tactics' ? styles.activeTab : ''}`}
          onClick={() => setActiveSection('tactics')}
        >
          📋 Taktik
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'players' ? styles.activeTab : ''}`}
          onClick={() => setActiveSection('players')}
        >
          👥 Spelare
        </button>
      </div>

      {/* Content */}
      {activeSection === 'overview' && (
        <div>
          {/* Statistik-översikt */}
          <div className={styles.statistikGrid}>
            <div className={styles.statistikRuta}>
              <div className={styles.statistikNummer}>
                {ourRecord.wins}-{ourRecord.losses}-{ourRecord.draws}
              </div>
              <div className={styles.statistikEtikett}>Vårt facit mot dem</div>
            </div>
            
            <div className={styles.statistikRuta}>
              <div className={styles.statistikNummer}>
                {opponent.teamStats.wins}-{opponent.teamStats.losses}-{opponent.teamStats.draws}
              </div>
              <div className={styles.statistikEtikett}>Deras säsongsresultat</div>
            </div>
            
            <div className={styles.statistikRuta}>
              <div className={styles.statistikNummer}>
                {(opponent.teamStats.goalsFor / opponent.teamStats.gamesPlayed).toFixed(1)}
              </div>
              <div className={styles.statistikEtikett}>Deras mål per match</div>
            </div>
            
            <div className={styles.statistikRuta}>
              <div className={styles.statistikNummer}>
                {opponent.teamStats.powerplayPercentage.toFixed(1)}%
              </div>
              <div className={styles.statistikEtikett}>Deras powerplay</div>
            </div>
          </div>

          {/* Senaste mötet */}
          {lastMatch && (
            <div className={styles.kort}>
              <h3 className={styles.sektionTitel}>🔄 Senaste mötet</h3>
              <div className={styles.senasteMoteInfo}>
                <div>
                  <div className={styles.senasteMoteResultat}>
                    {lastMatch.result || `Resultat: ${lastMatchResult}`}
                  </div>
                  <div className={styles.senasteMoteDatum}>
                    {new Date(lastMatch.date).toLocaleDateString('sv-SE')} • {lastMatch.venue}
                  </div>
                </div>
                {lastMatch.ourPerformance.mvp && (
                  <div className={styles.mvpChip}>
                    MVP: {lastMatch.ourPerformance.mvp}
                  </div>
                )}
              </div>
              
              {lastMatch.keyEvents.length > 0 && (
                <div>
                  <h4 className={styles.nyckelhandelserTitel}>
                    Nyckelhändelser:
                  </h4>
                  <ul className={styles.nyckelhandelserLista}>
                    {lastMatch.keyEvents.map((event, index) => (
                      <li key={index}>{event}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Styrkor och svagheter */}
          <div className={styles.styrkorSvagheterGrid}>
            <div className={styles.kort}>
              <h3 className={styles.sektionTitel}>💪 Deras styrkor</h3>
              <div className={styles.chipContainer}>
                {opponent.strengths.map((strength, index) => (
                  <span key={index} className={styles.styrkaChip}>
                    {strength}
                  </span>
                ))}
              </div>
              
              <div className={styles.varningRuta}>
                <strong className={styles.varningText}>⚠️ Var uppmärksam på:</strong>
                <p className={styles.varningBeskrivning}>
                  De är starkast inom dessa områden. Undvik att ge dem möjligheter att utnyttja sina styrkor.
                </p>
              </div>
            </div>

            <div className={styles.kort}>
              <h3 className={styles.sektionTitel}>🎯 Deras svagheter</h3>
              <div className={styles.chipContainer}>
                {opponent.weaknesses.map((weakness, index) => (
                  <span key={index} className={styles.svaghetChip}>
                    {weakness}
                  </span>
                ))}
              </div>
              
              <div className={styles.utnyttjaRuta}>
                <strong className={styles.utnyttjaText}>💡 Utnyttja:</strong>
                <p className={styles.utnyttjaBeskrivning}>
                  Fokusera på att attackera dessa svaga punkter för att skapa chanser.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'history' && (
        <div>
          <h3 className={styles.sektionTitel}>📅 Matchhistorik mot {opponent.name}</h3>
          {previousMatches.length > 0 ? (
            <div className={styles.matchhistorikGrid}>
              {previousMatches.map((match, index) => (
                <div key={match.id} className={`${styles.kort} ${index === 0 ? styles.senasteMatchKort : styles.matchKort}`}>
                  <div className={styles.matchInfoRad}>
                    <div>
                      <div className={styles.matchDatum}>
                        {new Date(match.date).toLocaleDateString('sv-SE')}
                        {index === 0 && (
                          <span className={styles.senasteMatchChip}>
                            SENASTE
                          </span>
                        )}
                      </div>
                      <div className={styles.matchVenue}>
                        {match.venue} • {match.homeOrAway === 'home' ? 'Hemma' : 'Borta'}
                      </div>
                    </div>
                    <div className={styles.matchResultContainer}>
                      <div className={styles.matchResultat}>
                        {match.homeTeam === "FBC Nyköping" ? 
                          `${match.score.home}-${match.score.away}` : 
                          `${match.score.away}-${match.score.home}`}
                      </div>
                      <div className={`${styles.matchResultText} ${match.result?.includes('Vinst') ? styles.vinstText : styles.forlustText}`}>
                        {match.result}
                      </div>
                    </div>
                  </div>
                  {match.ourPerformance.mvp && (
                    <div className={styles.mvpMatchChip}>
                      MVP: {match.ourPerformance.mvp}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.ingenHistorikContainer}>
              <span className={styles.ingenHistorikIcon}>📅</span>
              <p>Ingen tidigare matchhistorik mot denna motståndare</p>
            </div>
          )}
        </div>
      )}

      {activeSection === 'tactics' && (
        <div>
          <h3 className={styles.sektionTitel}>📋 Taktisk analys</h3>
          {/* Spelstil */}
          <div className={styles.kort}>
            <h4 className={styles.spelstilTitel}>
              🎮 Deras spelstil
            </h4>
            <div className={styles.spelstilGrid}>
              <div>
                <strong className={styles.spelstilEtikett}>Offensiv:</strong>
                <span className={`${styles.spelstilChip} ${opponent.playStyle.offense === 'aggressive' ? styles.aggressivChip : opponent.playStyle.offense === 'balanced' ? styles.balanseradChip : styles.defensivChip}` }>
                  {opponent.playStyle.offense === 'aggressive' ? '⚡ Aggressiv' :
                   opponent.playStyle.offense === 'balanced' ? '⚖️ Balanserad' : '🛡️ Defensiv'}
                </span>
              </div>
              <div>
                <strong className={styles.spelstilEtikett}>Defensiv:</strong>
                <span className={`${styles.spelstilChip} ${opponent.playStyle.defense === 'aggressive' ? styles.aggressivChip : opponent.playStyle.defense === 'balanced' ? styles.balanseradChip : styles.defensivChip}` }>
                  {opponent.playStyle.defense === 'aggressive' ? '⚡ Aggressiv' :
                   opponent.playStyle.defense === 'balanced' ? '⚖️ Balanserad' : '🛡️ Konservativ'}
                </span>
              </div>
              <div>
                <strong className={styles.spelstilEtikett}>Tempo:</strong>
                <span className={`${styles.spelstilChip} ${opponent.playStyle.tempo === 'fast' ? styles.aggressivChip : opponent.playStyle.tempo === 'medium' ? styles.balanseradChip : styles.defensivChip}` }>
                  {opponent.playStyle.tempo === 'fast' ? '💨 Snabbt' :
                   opponent.playStyle.tempo === 'medium' ? '⚖️ Medel' : '🐌 Långsamt'}
                </span>
              </div>
              <div>
                <strong className={styles.spelstilEtikett}>Fysikalitet:</strong>
                <span className={`${styles.spelstilChip} ${opponent.playStyle.physicality === 'high' ? styles.aggressivChip : opponent.playStyle.physicality === 'medium' ? styles.balanseradChip : styles.defensivChip}` }>
                  {opponent.playStyle.physicality === 'high' ? '💪 Hög' :
                   opponent.playStyle.physicality === 'medium' ? '⚖️ Medel' : '🕊️ Låg'}
                </span>
              </div>
            </div>
          </div>

          {/* Analyser */}
          {analyses.length > 0 && (
            <div className={styles.kort}>
              <h4 className={styles.analysTitel}>
                🔍 Våra analyser
              </h4>
              {analyses.map((analysis) => (
                <div key={analysis.id} className={styles.analysRuta}>
                  <div className={styles.analysDatum}>
                    <strong className={styles.analysDatumText}>
                      Analys från {new Date(analysis.createdAt).toLocaleDateString('sv-SE')}
                    </strong>
                  </div>
                  <p className={styles.analysText}>
                    {analysis.tactics}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Rekommendationer */}
          <div className={styles.kort}>
            <h4 className={styles.rekommendationTitel}>
              💡 Taktiska rekommendationer
            </h4>
            <div className={styles.rekommendationRuta}>
              <ul className={styles.rekommendationLista}>
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
          <h3 className={styles.sektionTitel}>👥 Nyckelspelare</h3>
          {opponent.keyPlayers.length > 0 ? (
            <div className={styles.nyckelspelareGrid}>
              {opponent.keyPlayers.map(playerId => {
                const player = opponent.players.find(p => p.id === playerId);
                if (!player) return null;
                return (
                  <div key={player.id} className={styles.kort}>
                    <div className={styles.nyckelspelareInfoRad}>
                      <div>
                        <h4 className={styles.nyckelspelareTitel}>
                          #{player.number} {player.name}
                        </h4>
                        <div className={styles.nyckelspelarePosition}>
                          {player.position} • {player.age} år
                        </div>
                      </div>
                      {player.statistics && (
                        <div className={styles.nyckelspelareStatContainer}>
                          <div className={styles.nyckelspelarePoang}>
                            {player.statistics.points} poäng
                          </div>
                          <div className={styles.nyckelspelareMaalAssist}>
                            {player.statistics.goals}+{player.statistics.assists}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={styles.nyckelspelareStyrkorSvagheterGrid}>
                      <div>
                        <strong className={styles.nyckelspelareStyrkorTitel}>Styrkor:</strong>
                        <div className={styles.chipContainer}>
                          {player.strengths.map((strength, index) => (
                            <span key={index} className={styles.styrkaChip}>
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <strong className={styles.nyckelspelareSvagheterTitel}>Svagheter:</strong>
                        <div className={styles.chipContainer}>
                          {player.weaknesses.map((weakness, index) => (
                            <span key={index} className={styles.svaghetChip}>
                              {weakness}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {player.notes && (
                      <div className={styles.nyckelspelareAnteckning}>
                        📝 {player.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.ingenNyckelspelareContainer}>
              <span className={styles.ingenNyckelspelareIcon}>👥</span>
              <p>Inga nyckelspelare identifierade än</p>
              {isLeader() && (
                <button
                  className={styles.actionButton}
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
        <div className={styles.exportButtonContainer}>
          <button
            className={styles.actionButton}
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
