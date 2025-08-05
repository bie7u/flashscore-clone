import React from 'react';
import type { Match, MatchEvent } from '../../utils/types';
import { getMatchStatusColor, getMatchStatusText } from '../../utils/matchUtils';
import { formatDateTime } from '../../utils/dateUtils';
import MatchTimeline from './MatchTimeline';

interface MatchDetailsProps {
  match: Match;
  events: MatchEvent[];
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ match, events }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      {/* Match Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formatDateTime(match.date)}
          </span>
          <span className={`text-sm font-semibold ${getMatchStatusColor(match.status)}`}>
            {getMatchStatusText(match)}
          </span>
        </div>
        
        {match.venue && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            📍 {match.venue}
          </p>
        )}
      </div>

      {/* Teams and Score */}
      <div className="flex items-center justify-between mb-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
        {/* Home Team */}
        <div className="flex flex-col items-center space-y-2 flex-1">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-gray-600 dark:text-gray-400">
              {match.homeTeam.name.charAt(0)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
            {match.homeTeam.name}
          </h3>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center space-y-2 px-8">
          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {match.homeTeam.score ?? '-'}
            </span>
            <span className="text-2xl text-gray-400">:</span>
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {match.awayTeam.score ?? '-'}
            </span>
          </div>
          {match.status === 'LIVE' && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-500">LIVE</span>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center space-y-2 flex-1">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-gray-600 dark:text-gray-400">
              {match.awayTeam.name.charAt(0)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
            {match.awayTeam.name}
          </h3>
        </div>
      </div>

      {/* Match Timeline */}
      <MatchTimeline events={events} />
    </div>
  );
};

export default MatchDetails;