import React from 'react';
import MatchList from '../components/MatchList';
import { useMatches } from '../hooks/useMatches';
import { Match } from '../types/match';

const HomePage: React.FC = () => {
  const { matches, loading, error, refetch } = useMatches();

  const handleMatchClick = (match: Match) => {
    console.log('Match clicked:', match);
    // TODO: Navigate to match detail page or show modal
  };

  return (
    <div className="home-page">
      <div className="container">
        <div className="page-header">
          <h1>All Matches</h1>
          <p>Stay updated with live scores and match results</p>
        </div>
        
        <MatchList
          matches={matches}
          loading={loading}
          error={error}
          onMatchClick={handleMatchClick}
          onRefresh={refetch}
        />
      </div>
    </div>
  );
};

export default HomePage;