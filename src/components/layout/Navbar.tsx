import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, Calendar, TrendingUp, Radio } from 'lucide-react';

const Navbar: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/live', icon: Radio, label: 'Live' },
    { to: '/leagues', icon: Trophy, label: 'Leagues' },
    { to: '/fixtures', icon: Calendar, label: 'Fixtures' },
    { to: '/standings', icon: TrendingUp, label: 'Standings' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;