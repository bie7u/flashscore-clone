import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { Match, MatchEvent } from '../utils/types';
import MatchDetails from '../components/match/MatchDetails';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

// Import mock data
import matchesData from '../mock-data/matches.json';
import eventsData from '../mock-data/events.json';

const MatchDetailsPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) {
      setError('Match ID not provided');
      setLoading(false);
      return;
    }

    // Simulate API loading
    setTimeout(() => {
      const foundMatch = matchesData.matches.find(m => m.id === matchId);
      if (!foundMatch) {
        setError('Match not found');
        setLoading(false);
        return;
      }

      const matchEvents = eventsData.events.filter(e => e.matchId === matchId);
      
      setMatch(foundMatch as Match);
      setEvents(matchEvents as MatchEvent[]);
      setLoading(false);
    }, 800);
  }, [matchId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !match) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorMessage message={error || 'Match not found'} onRetry={handleBack} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to matches</span>
      </button>

      {/* Match Details */}
      <MatchDetails match={match} events={events} />
    </div>
  );
};

export default MatchDetailsPage;