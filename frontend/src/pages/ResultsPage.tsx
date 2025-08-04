import React from 'react';
import MatchList from '../components/MatchList';
import { useMatches } from '../hooks/useMatches';
import { Match } from '../types/match';

const ResultsPage: React.FC = () => {
  const { matches, loading, error, refetch } = useMatches({ status: 'finished' });

  const handleMatchClick = (match: Match) => {
    console.log('Result clicked:', match);
    // TODO: Navigate to match result detail page
  };

  return (
    <div className="results-page">
      <div className="container">
        <div className="page-header">
          <h1>📊 Results</h1>
          <p>Completed matches and final scores</p>
        </div>
        
        <MatchList
          matches={matches}
          loading={loading}
          error={error}
          onMatchClick={handleMatchClick}
          onRefresh={refetch}
          filters={{ status: 'finished' }}
        />
      </div>
    </div>
  );
};

export default ResultsPage;