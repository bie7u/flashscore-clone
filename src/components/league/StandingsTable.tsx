import React from 'react';
import type { Standing } from '../../utils/types';

interface StandingsTableProps {
  standing: Standing;
}

const StandingsTable: React.FC<StandingsTableProps> = ({ standing }) => {
  const getPositionColor = (position: number) => {
    if (position <= 4) return 'text-green-600 dark:text-green-400'; // Champions League
    if (position <= 6) return 'text-blue-600 dark:text-blue-400'; // Europa League
    if (position >= standing.table.length - 2) return 'text-red-600 dark:text-red-400'; // Relegation
    return 'text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          League Table
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Pos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Team
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                P
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                W
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                D
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                L
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                GF
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                GA
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                GD
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Pts
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {standing.table.map((entry) => (
              <tr key={entry.teamId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getPositionColor(entry.position)}`}>
                    {entry.position}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {entry.teamName.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {entry.teamName}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                  {entry.played}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                  {entry.won}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                  {entry.drawn}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                  {entry.lost}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                  {entry.goalsFor}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                  {entry.goalsAgainst}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-center text-sm">
                  <span className={entry.goalDifference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {entry.goalDifference > 0 ? '+' : ''}{entry.goalDifference}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {entry.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legend */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-300">Champions League</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-300">Europa League</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-300">Relegation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandingsTable;