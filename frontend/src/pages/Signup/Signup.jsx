import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Login/Login.css'; // Reuse core auth layout styles
import './Signup.css';

function Signup() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!username.trim() || !validateEmail(username.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await signup(name.trim(), username.trim(), password);

    if (result.success) {
      setSuccessMsg('Account created successfully! Logging you in...');
      // Automatically attempt login after signup
      const loginResult = await login(username.trim(), password);
      setLoading(false);

      if (loginResult.success) {
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1200);
      } else {
        // If auto-login failed for any reason, redirect to login page
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } else {
      setLoading(false);
      setError(result.error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container signup-container">
        <div className="login-form-card">
          <div className="form-header">
            <h1 className="login-title">Create an Account</h1>
            <p className="login-subtitle">Fill in your details below to get started with FarmCall</p>
          </div>

          {error && (
            <div className="auth-alert alert-error" role="alert">
              <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-alert alert-success" role="alert">
              <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="signup-name">Full Name</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="name@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-confirm-password">Confirm Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <input
                  id="signup-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="btn-spinner"></span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
