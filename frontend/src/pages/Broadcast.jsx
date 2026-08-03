import React, { useState } from 'react';
import './Broadcast.css';

function Broadcast() {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [validationError, setValidationError] = useState('');

  const getApiBase = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    return 'https://farmcall-project-1.onrender.com';
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (validationError) {
      setValidationError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setValidationError('Please enter an alert message to broadcast.');
      return;
    }

    setIsSubmitting(true);
    setStatus(null);
    setValidationError('');

    try {
      const apiBase = getApiBase();
      const token = localStorage.getItem('farmcall_token');

      const response = await fetch(`${apiBase}/broadcast/alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const count = Array.isArray(data.results) ? data.results.length : 0;
        setStatus({
          type: 'success',
          text: `Broadcast alert sent successfully${count > 0 ? ` to ${count} farmers!` : '!'}`
        });
        setMessage('');
      } else {
        setStatus({
          type: 'error',
          text: data.message || 'Failed to send broadcast alert.'
        });
      }
    } catch (err) {
      console.error('Broadcast error:', err);
      setStatus({
        type: 'error',
        text: err.message || 'Error connecting to backend server.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="broadcast-page">
      <div className="broadcast-card">
        {/* Page Header */}
        <div className="broadcast-header">
          <h1 className="broadcast-title">Broadcast Alert</h1>
          <p className="broadcast-subtitle">
            Send instant voice alerts and emergency announcements to all registered farmers in their local language.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="broadcast-form" noValidate>
          <div className={`form-group ${validationError ? 'has-error' : ''}`}>
            <textarea
              className="broadcast-textarea"
              placeholder="Enter the alert message..."
              rows={8}
              value={message}
              onChange={handleMessageChange}
              disabled={isSubmitting}
            />
            {validationError && <span className="validation-error">{validationError}</span>}
          </div>

          <button
            type="submit"
            className="broadcast-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="btn-spinner"></div>
                Sending Broadcast Alert...
              </>
            ) : (
              '📢 Broadcast Alert to Everyone'
            )}
          </button>
        </form>

        {/* Status / Feedback Panel */}
        {isSubmitting && (
          <div className="broadcast-status loading">
            <div className="spinner"></div>
            <span>Translating message & placing voice broadcast calls to farmers...</span>
          </div>
        )}

        {status && (
          <div className={`broadcast-status ${status.type}`}>
            <div className="status-header">
              <span className="status-icon">{status.type === 'success' ? '✓' : '✕'}</span>
              <h3>{status.type === 'success' ? 'Broadcast Sent' : 'Broadcast Failed'}</h3>
            </div>
            <p className="status-text">{status.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Broadcast;
