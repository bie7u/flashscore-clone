import React, { useState } from 'react';
import { Match } from '../../types/match';
import MatchCard from '../MatchCard';
import './MatchList.css';

interface MatchListProps {
  matches: Match[];
  loading?: boolean;
  error?: string | null;
  onMatchClick?: (match: Match) => void;
  onRefresh?: () => void;
  filters?: {
    status?: string;
    league?: string;
  };
  onFiltersChange?: (filters: { status?: string; league?: string }) => void;
}

const MatchList: React.FC<MatchListProps> = ({
  matches,
  loading = false,
  error = null,
  onMatchClick,
  onRefresh,
  filters = {},
  onFiltersChange,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
  const [selectedLeague, setSelectedLeague] = useState(filters.league || 'all');

  // Get unique leagues from matches
  const leagues = Array.from(new Set(matches.map(match => match.league)));

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        status: status === 'all' ? undefined : status,
      });
    }
  };

  const handleLeagueChange = (league: string) => {
    setSelectedLeague(league);
    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        league: league === 'all' ? undefined : league,
      });
    }
  };

  const filteredMatches = matches.filter(match => {
    const statusMatch = selectedStatus === 'all' || match.status === selectedStatus;
    const leagueMatch = selectedLeague === 'all' || match.league === selectedLeague;
    return statusMatch && leagueMatch;
  });

  // Group matches by date
  const groupedMatches = filteredMatches.reduce((groups, match) => {
    const date = new Date(match.startTime).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(match);
    return groups;
  }, {} as Record<string, Match[]>);

  if (loading) {
    return (
      <div className="match-list">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="match-list">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error}</p>
          {onRefresh && (
            <button className="retry-button" onClick={onRefresh}>
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="match-list">
      <div className="match-list-header">
        <h2 className="match-list-title">
          {filteredMatches.length > 0 ? `${filteredMatches.length} Matches` : 'No Matches'}
        </h2>
        
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          
          {leagues.length > 0 && (
            <div className="filter-group">
              <label htmlFor="league-filter">League:</label>
              <select
                id="league-filter"
                value={selectedLeague}
                onChange={(e) => handleLeagueChange(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Leagues</option>
                {leagues.map(league => (
                  <option key={league} value={league}>
                    {league}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="matches-container">
        {Object.keys(groupedMatches).length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⚽</div>
            <h3>No matches found</h3>
            <p>Try adjusting your filters or check back later</p>
          </div>
        ) : (
          Object.entries(groupedMatches)
            .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
            .map(([date, dateMatches]) => (
              <div key={date} className="match-group">
                <h3 className="match-group-header">
                  {new Date(date).toLocaleDateString([], {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                <div className="match-group-content">
                  {dateMatches
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .map((match) => (
                      <MatchCard
                        key={match._id}
                        match={match}
                        onClick={onMatchClick}
                      />
                    ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default MatchList;