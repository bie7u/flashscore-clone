import React from 'react';
import MatchList from '../components/MatchList';
import { useMatches } from '../hooks/useMatches';
import { Match } from '../types/match';

const FixturesPage: React.FC = () => {
  const { matches, loading, error, refetch } = useMatches({ status: 'upcoming' });

  const handleMatchClick = (match: Match) => {
    console.log('Fixture clicked:', match);
    // TODO: Navigate to fixture detail page
  };

  return (
    <div className="fixtures-page">
      <div className="container">
        <div className="page-header">
          <h1>📅 Fixtures</h1>
          <p>Upcoming matches and schedules</p>
        </div>
        
        <MatchList
          matches={matches}
          loading={loading}
          error={error}
          onMatchClick={handleMatchClick}
          onRefresh={refetch}
          filters={{ status: 'upcoming' }}
        />
      </div>
    </div>
  );
};

export default FixturesPage;