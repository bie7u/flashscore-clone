import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Match, League } from '../utils/types';
import { filterMatchesByDate, filterMatchesByLeague } from '../utils/matchUtils';
import MatchList from '../components/match/MatchList';
import LeagueSelector from '../components/league/LeagueSelector';
import DatePicker from '../components/common/DatePicker';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Import mock data
import matchesData from '../mock-data/matches.json';
import leaguesData from '../mock-data/leagues.json';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setMatches(matchesData.matches as Match[]);
      setLeagues(leaguesData.leagues);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter matches based on selected date and league
  const filteredMatches = React.useMemo(() => {
    let filtered = matches;
    
    // Filter by date
    filtered = filterMatchesByDate(filtered, selectedDate);
    
    // Filter by league
    if (selectedLeague) {
      filtered = filterMatchesByLeague(filtered, selectedLeague);
    }
    
    return filtered;
  }, [matches, selectedDate, selectedLeague]);

  const handleMatchClick = (match: Match) => {
    navigate(`/match/${match.id}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Live Scores & Fixtures
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Follow your favorite teams and leagues
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Date Picker */}
        <div className="flex justify-center">
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        {/* League Selector */}
        <LeagueSelector
          leagues={leagues}
          selectedLeague={selectedLeague}
          onLeagueSelect={setSelectedLeague}
        />
      </div>

      {/* Live Matches Banner */}
      {matches.some(match => match.status === 'LIVE') && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-green-800 dark:text-green-200 font-medium">
              {matches.filter(match => match.status === 'LIVE').length} live match
              {matches.filter(match => match.status === 'LIVE').length !== 1 ? 'es' : ''} right now!
            </span>
          </div>
        </div>
      )}

      {/* Matches */}
      <MatchList matches={filteredMatches} onMatchClick={handleMatchClick} />
    </div>
  );
};

export default Home;