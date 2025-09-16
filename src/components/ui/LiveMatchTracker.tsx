import React, { useState, useEffect } from 'react';
import { useLive, MatchEvent } from '../../context/LiveContext';
import { useAuth } from '../../context/AuthContext';
import './LiveMatchTracker.css';

interface LiveMatchTrackerProps {
  className?: string;
}

const LiveMatchTracker: React.FC<LiveMatchTrackerProps> = ({ className = '' }) => {
  const { liveMatch, startLiveMatch, endLiveMatch, addMatchEvent, updateMatchScore, isConnected } = useLive();
  const { isLeader } = useAuth();
  const [newEventType, setNewEventType] = useState<'goal' | 'penalty' | 'timeout'>('goal');
  const [newEventPlayer, setNewEventPlayer] = useState('');
  const [newEventTeam, setNewEventTeam] = useState<'home' | 'away'>('home');
  const [matchTime, setMatchTime] = useState(20 * 60); // 20 minuter i sekunder

  // Timer för matchtid
  useEffect(() => {
    if (!liveMatch) return;

    const timer = setInterval(() => {
      setMatchTime(prev => {
        if (prev <= 0) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [liveMatch]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartMatch = () => {
    const matchId = `match-${Date.now()}`;
    startLiveMatch(matchId);
    setMatchTime(20 * 60); // Reset timer
  };

  const handleAddEvent = () => {
    if (!newEventPlayer.trim() || !liveMatch) return;

    const event: Omit<MatchEvent, 'id'> = {
      type: newEventType,
      team: newEventTeam,
      player: newEventPlayer,
      time: formatTime(20 * 60 - matchTime),
      description: `${newEventPlayer} - ${newEventType === 'goal' ? 'Mål' : newEventType === 'penalty' ? 'Utvisning' : 'Timeout'}`
    };

    addMatchEvent(event);
    setNewEventPlayer('');
  };

  const handleScoreUpdate = (team: 'home' | 'away', increment: boolean) => {
    if (!liveMatch) return;

    const { homeScore, awayScore } = liveMatch;
    if (team === 'home') {
      const newScore = increment ? homeScore + 1 : Math.max(0, homeScore - 1);
      updateMatchScore(newScore, awayScore);
    } else {
      const newScore = increment ? awayScore + 1 : Math.max(0, awayScore - 1);
      updateMatchScore(homeScore, newScore);
    }
  };

  if (!isConnected) {
    return (
      <div className={`live-match-tracker offline ${className}`}>
        <div className="offline-indicator">
          <span className="offline-icon">📡</span>
          <p>Inte ansluten till live-servern</p>
        </div>
      </div>
    );
  }

  if (!liveMatch) {
    return (
      <div className={`live-match-tracker no-match ${className}`}>
        <div className="no-match-state">
          <h3>🏒 Live Matchspårning</h3>
          <p>Ingen pågående match</p>
          {isLeader() && (
            <button className="btn primary" onClick={handleStartMatch}>
              Starta Live-match
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`live-match-tracker active ${className}`}>
      <div className="match-header">
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span>LIVE</span>
        </div>
        <div className="match-time">
          Period {liveMatch.period} - {formatTime(matchTime)}
        </div>
        {isLeader() && (
          <button className="btn secondary small" onClick={endLiveMatch}>
            Avsluta
          </button>
        )}
      </div>

      <div className="scoreboard">
        <div className="team home">
          <h4>{liveMatch.homeTeam}</h4>
          <div className="score-section">
            {isLeader() && (
              <div className="score-controls">
                <button 
                  className="score-btn minus"
                  onClick={() => handleScoreUpdate('home', false)}
                >
                  -
                </button>
              </div>
            )}
            <div className="score">{liveMatch.homeScore}</div>
            {isLeader() && (
              <div className="score-controls">
                <button 
                  className="score-btn plus"
                  onClick={() => handleScoreUpdate('home', true)}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="vs-separator">VS</div>

        <div className="team away">
          <h4>{liveMatch.awayTeam}</h4>
          <div className="score-section">
            {isLeader() && (
              <div className="score-controls">
                <button 
                  className="score-btn minus"
                  onClick={() => handleScoreUpdate('away', false)}
                >
                  -
                </button>
              </div>
            )}
            <div className="score">{liveMatch.awayScore}</div>
            {isLeader() && (
              <div className="score-controls">
                <button 
                  className="score-btn plus"
                  onClick={() => handleScoreUpdate('away', true)}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isLeader() && (
        <div className="event-controls">
          <h4>Lägg till händelse</h4>
          <div className="event-form">
            <select 
              value={newEventType} 
              onChange={(e) => setNewEventType(e.target.value as any)}
            >
              <option value="goal">Mål</option>
              <option value="penalty">Utvisning</option>
              <option value="timeout">Timeout</option>
            </select>
            
            <select 
              value={newEventTeam} 
              onChange={(e) => setNewEventTeam(e.target.value as any)}
            >
              <option value="home">{liveMatch.homeTeam}</option>
              <option value="away">{liveMatch.awayTeam}</option>
            </select>
            
            <input
              type="text"
              placeholder="Spelarnamn"
              value={newEventPlayer}
              onChange={(e) => setNewEventPlayer(e.target.value)}
            />
            
            <button className="btn primary" onClick={handleAddEvent}>
              Lägg till
            </button>
          </div>
        </div>
      )}

      <div className="match-events">
        <h4>Matchhändelser</h4>
        <div className="events-list">
          {liveMatch.events.length === 0 ? (
            <p className="no-events">Inga händelser än</p>
          ) : (
            liveMatch.events.slice().reverse().map((event) => (
              <div key={event.id} className={`event ${event.type}`}>
                <div className="event-time">{event.time}</div>
                <div className="event-content">
                  <div className="event-type">
                    {event.type === 'goal' && '⚽'}
                    {event.type === 'penalty' && '🟨'}
                    {event.type === 'timeout' && '⏱️'}
                  </div>
                  <div className="event-details">
                    <div className="event-description">{event.description}</div>
                    <div className="event-team">
                      {event.team === 'home' ? liveMatch.homeTeam : liveMatch.awayTeam}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveMatchTracker;
