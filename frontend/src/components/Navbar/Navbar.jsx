import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header">
      <nav className="navbar">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/farmcall_Logo.png" alt="FarmCall Logo" className="navbar-logo-img" />
          <div className="navbar-brand-text">
            <div className="brand-name">
              <span className="brand-farm">Farm</span>
              <span className="brand-call">Call</span>
            </div>
          </div>
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="hamburger-btn"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        <ul className={`navbar-links ${isMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <Link to="/" className={isActive('/') ? 'active-link' : ''} onClick={closeMenu}>Home</Link>
          </li>
          <li>
            <Link to="/about" className={isActive('/about') ? 'active-link' : ''} onClick={closeMenu}>About</Link>
          </li>
          <li>
            <Link to="/contact" className={isActive('/contact') ? 'active-link' : ''} onClick={closeMenu}>Contact</Link>
          </li>

          {isLoggedIn ? (
            <>
              <li className="user-badge-item">
                <span className="user-avatar-badge" title={user?.username || user?.name}>
                  <svg className="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="user-email-text">{user?.name || user?.username}</span>
                </span>
              </li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className={isActive('/login') ? 'active-link' : ''} onClick={closeMenu}>Login</Link>
              </li>
              <li>
                <Link to="/signup" className="signup-btn" onClick={closeMenu}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;

