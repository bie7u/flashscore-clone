import React, { useState, useEffect } from 'react';
import type { League, Season, Match } from '../utils/types';
import { filterMatchesByLeague } from '../utils/matchUtils';
import LeagueSelector from '../components/league/LeagueSelector';
import SeasonSelector from '../components/league/SeasonSelector';
import MatchList from '../components/match/MatchList';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Import mock data
import leaguesData from '../mock-data/leagues.json';
import seasonsData from '../mock-data/seasons.json';
import matchesData from '../mock-data/matches.json';

const LeagueOverview: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setLeagues(leaguesData.leagues);
      setSeasons(seasonsData.seasons);
      setMatches(matchesData.matches as Match[]);
      setLoading(false);
    }, 800);
  }, []);

  // Filter seasons based on selected league
  const filteredSeasons = React.useMemo(() => {
    if (!selectedLeague) return [];
    return seasons.filter(season => season.leagueId === selectedLeague);
  }, [seasons, selectedLeague]);

  // Filter matches based on selected league and season
  const filteredMatches = React.useMemo(() => {
    let filtered = matches;
    
    if (selectedLeague) {
      filtered = filterMatchesByLeague(filtered, selectedLeague);
    }
    
    if (selectedSeason) {
      filtered = filtered.filter(match => match.seasonId === selectedSeason);
    }
    
    return filtered;
  }, [matches, selectedLeague, selectedSeason]);

  const selectedLeagueData = leagues.find(league => league.id === selectedLeague);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {selectedLeagueData ? selectedLeagueData.name : 'Leagues'}
        </h1>
        {selectedLeagueData && (
          <p className="text-gray-600 dark:text-gray-400">
            {selectedLeagueData.country}
          </p>
        )}
      </div>

      {/* League Selector */}
      <LeagueSelector
        leagues={leagues}
        selectedLeague={selectedLeague}
        onLeagueSelect={(leagueId) => {
          setSelectedLeague(leagueId);
          setSelectedSeason(''); // Reset season when league changes
        }}
      />

      {/* Season Selector */}
      {selectedLeague && (
        <SeasonSelector
          seasons={filteredSeasons}
          selectedSeason={selectedSeason}
          onSeasonSelect={setSelectedSeason}
        />
      )}

      {/* Content */}
      {selectedLeague ? (
        <div className="mt-6">
          {filteredMatches.length > 0 ? (
            <MatchList matches={filteredMatches} />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">🏆</div>
              <p className="text-gray-600 dark:text-gray-400">
                No matches found for the selected criteria
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagues.map((league) => (
            <div
              key={league.id}
              onClick={() => setSelectedLeague(league.id)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                    🏆
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {league.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {league.country}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeagueOverview;