import React from 'react';
import MatchList from '../components/MatchList';
import { useMatches } from '../hooks/useMatches';
import { Match } from '../types/match';

const LivePage: React.FC = () => {
  const { matches, loading, error, refetch } = useMatches({ status: 'live' });

  const handleMatchClick = (match: Match) => {
    console.log('Live match clicked:', match);
    // TODO: Navigate to live match detail page
  };

  return (
    <div className="live-page">
      <div className="container">
        <div className="page-header">
          <h1>🔴 Live Matches</h1>
          <p>Follow live matches in real-time</p>
        </div>
        
        <MatchList
          matches={matches}
          loading={loading}
          error={error}
          onMatchClick={handleMatchClick}
          onRefresh={refetch}
          filters={{ status: 'live' }}
        />
      </div>
    </div>
  );
};

export default LivePage;