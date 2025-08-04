import React from 'react';
import { Match } from '../../types/match';
import './MatchCard.css';

interface MatchCardProps {
  match: Match;
  onClick?: (match: Match) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onClick }) => {
  const getStatusDisplay = () => {
    switch (match.status) {
      case 'live':
        return (
          <div className="match-status live">
            <span className="live-indicator">🔴</span>
            <span>{match.minute ? `${match.minute}'` : 'LIVE'}</span>
          </div>
        );
      case 'finished':
        return (
          <div className="match-status finished">
            <span>FT</span>
          </div>
        );
      case 'upcoming':
        return (
          <div className="match-status upcoming">
            <span>{new Date(match.startTime).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick(match);
    }
  };

  return (
    <div 
      className={`match-card ${match.status}`}
      onClick={handleClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="match-header">
        <span className="match-league">{match.league}</span>
        <span className="match-date">{formatDate(match.startTime)}</span>
      </div>
      
      <div className="match-content">
        <div className="team home-team">
          <span className="team-name">{match.homeTeam}</span>
          {match.status !== 'upcoming' && (
            <span className="team-score">{match.homeScore}</span>
          )}
        </div>
        
        <div className="match-center">
          {getStatusDisplay()}
          <div className="match-separator">vs</div>
        </div>
        
        <div className="team away-team">
          <span className="team-name">{match.awayTeam}</span>
          {match.status !== 'upcoming' && (
            <span className="team-score">{match.awayScore}</span>
          )}
        </div>
      </div>
      
      {match.events && match.events.length > 0 && (
        <div className="match-events">
          <div className="recent-events">
            {match.events.slice(-3).map((event, index) => (
              <span key={index} className={`event-icon ${event.type}`}>
                {event.type === 'goal' ? '⚽' : event.type === 'card' ? '🟨' : '🔄'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchCard;