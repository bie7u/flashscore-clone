// Match utility functions
import type { Match, MatchStatus, MatchEvent } from './types';

export const getMatchStatusColor = (status: MatchStatus): string => {
  switch (status) {
    case 'LIVE':
      return 'text-green-500';
    case 'FINISHED':
      return 'text-gray-500';
    case 'SCHEDULED':
      return 'text-blue-500';
    case 'POSTPONED':
      return 'text-yellow-500';
    case 'CANCELLED':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const getMatchStatusText = (match: Match): string => {
  switch (match.status) {
    case 'LIVE':
      return match.minute ? `${match.minute}'` : 'LIVE';
    case 'FINISHED':
      return 'FT';
    case 'SCHEDULED':
      return new Date(match.date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    case 'POSTPONED':
      return 'POSTPONED';
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      return '';
  }
};

export const isMatchLive = (match: Match): boolean => {
  return match.status === 'LIVE';
};

export const isMatchFinished = (match: Match): boolean => {
  return match.status === 'FINISHED';
};

export const isMatchScheduled = (match: Match): boolean => {
  return match.status === 'SCHEDULED';
};

export const getMatchScore = (match: Match): string => {
  if (match.home_score !== null && match.away_score !== null) {
    return `${match.home_score} - ${match.away_score}`;
  }
  return '';
};

export const getMatchWinner = (match: Match): 'home' | 'away' | 'draw' | null => {
  if (match.home_score === null || match.away_score === null) {
    return null;
  }
  
  if (match.home_score > match.away_score) {
    return 'home';
  } else if (match.away_score > match.home_score) {
    return 'away';
  } else {
    return 'draw';
  }
};

export const sortMatchesByDate = (matches: Match[]): Match[] => {
  return matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const filterMatchesByDate = (matches: Match[], date: Date): Match[] => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  return matches.filter(match => {
    const matchDate = new Date(match.date);
    matchDate.setHours(0, 0, 0, 0);
    return matchDate.getTime() === targetDate.getTime();
  });
};

export const filterMatchesByLeague = (matches: Match[], leagueId: number): Match[] => {
  return matches.filter(match => match.league === leagueId);
};

export const filterMatchesByStatus = (matches: Match[], status: MatchStatus): Match[] => {
  return matches.filter(match => match.status === status);
};

export const getEventIcon = (eventType: string): string => {
  switch (eventType) {
    case 'GOAL':
      return '⚽';
    case 'YELLOW_CARD':
      return '🟨';
    case 'RED_CARD':
      return '🟥';
    case 'SUBSTITUTION':
      return '🔄';
    case 'PENALTY':
      return '🥅';
    case 'OWN_GOAL':
      return '⚽';
    default:
      return '';
  }
};

export const sortEventsByMinute = (events: MatchEvent[]): MatchEvent[] => {
  return events.sort((a, b) => a.minute - b.minute);
};