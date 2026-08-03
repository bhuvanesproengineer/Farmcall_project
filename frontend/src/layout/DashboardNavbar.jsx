import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DashboardNavbar() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="db-navbar-header">
      <div className="db-navbar-brand">
        <Link to="/dashboard" className="db-logo-link">
          <img src="/farmcall_Logo.png" alt="FarmCall Logo" className="db-logo-img" />
          <div className="db-brand-text">
            <span className="brand-farm">Farm</span>
            <span className="brand-call">Call</span>
          </div>
        </Link>
      </div>

      <div className="db-navbar-right">
        {/* Notification Icon */}
        <button className="db-icon-btn" aria-label="Notifications" title="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="notification-badge"></span>
        </button>

        {/* User Profile Avatar & Dropdown */}
        <div className="db-user-menu-container">
          <button
            className="db-user-avatar-btn"
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="User menu"
            aria-expanded={showDropdown}
          >
            <div className="db-avatar-circle">
              {(user?.name || user?.username || 'F').charAt(0).toUpperCase()}
            </div>
            <span className="db-user-name">{user?.name || user?.username || 'User'}</span>
            <svg className={`db-chevron-icon ${showDropdown ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showDropdown && (
            <div className="db-user-dropdown">
              <div className="dropdown-user-info">
                <p className="user-info-name">{user?.name || 'Farmer'}</p>
                <p className="user-info-email">{user?.username || ''}</p>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout-item" onClick={handleLogout}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default DashboardNavbar;
