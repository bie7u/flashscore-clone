import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Flashscore Clone' }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/live', label: 'Live', icon: '🔴' },
    { path: '/fixtures', label: 'Fixtures', icon: '📅' },
    { path: '/results', label: 'Results', icon: '📊' },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">⚽</span>
            <h1 className="brand-title">{title}</h1>
          </Link>
        </div>
        
        <nav className="header-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button className="refresh-btn" title="Refresh">
            <span>🔄</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;