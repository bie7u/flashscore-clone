import { useState, useEffect, useCallback } from 'react';
import { Match } from '../types/match';
import { matchApi } from '../services/api';
import { socketService } from '../services/socket';

interface UseMatchesReturn {
  matches: Match[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMatches = (filters?: {
  status?: string;
  league?: string;
  date?: string;
}): UseMatchesReturn => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await matchApi.getMatches(filters);
      setMatches(data);
    } catch (err) {
      setError('Failed to fetch matches');
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    // Connect to WebSocket
    socketService.connect();

    // Listen for real-time updates
    socketService.onMatchCreated((newMatch) => {
      setMatches((prev) => [...prev, newMatch]);
    });

    socketService.onMatchUpdated((updatedMatch) => {
      setMatches((prev) =>
        prev.map((match) =>
          match._id === updatedMatch._id ? updatedMatch : match
        )
      );
    });

    socketService.onMatchDeleted((matchId) => {
      setMatches((prev) => prev.filter((match) => match._id !== matchId));
    });

    socketService.onScoreUpdated(({ matchId, homeScore, awayScore }) => {
      setMatches((prev) =>
        prev.map((match) =>
          match._id === matchId
            ? { ...match, homeScore, awayScore }
            : match
        )
      );
    });

    socketService.onStatusChanged(({ matchId, status, minute }) => {
      setMatches((prev) =>
        prev.map((match) =>
          match._id === matchId
            ? { ...match, status: status as any, minute }
            : match
        )
      );
    });

    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, []);

  return {
    matches,
    loading,
    error,
    refetch: fetchMatches,
  };
};