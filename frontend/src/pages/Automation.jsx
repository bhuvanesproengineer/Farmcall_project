import React, { useState, useEffect } from 'react';
import './Automation.css';

function Automation() {
  const [callTime, setCallTime] = useState('07:00');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const getApiBase = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    return 'https://farmcall-project-1.onrender.com';
  };

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const apiBase = getApiBase();
      const token = localStorage.getItem('farmcall_token');
      const response = await fetch(`${apiBase}/automation/status`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      if (response.ok && data.success && data.data) {
        setIsActive(Boolean(data.data.is_active));
        if (data.data.call_time) {
          setCallTime(data.data.call_time);
        }
      }
    } catch (err) {
      console.error('Error fetching automation status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const showToast = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const handleStartAutomation = async (e) => {
    e.preventDefault();
    if (!callTime) {
      showToast('error', 'Please select a valid time for the automated calls.');
      return;
    }

    setIsSubmitting(true);
    try {
      const apiBase = getApiBase();
      const token = localStorage.getItem('farmcall_token');

      const response = await fetch(`${apiBase}/automation/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ callTime, call_time: callTime }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsActive(true);
        showToast('success', `Daily automated calls scheduled successfully for ${formatTime12h(callTime)}!`);
        fetchStatus();
      } else {
        showToast('error', data.message || 'Failed to start automation schedule.');
      }
    } catch (err) {
      console.error('Error starting automation:', err);
      showToast('error', 'Error connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStopAutomation = async () => {
    setIsSubmitting(true);
    try {
      const apiBase = getApiBase();
      const token = localStorage.getItem('farmcall_token');

      const response = await fetch(`${apiBase}/automation/stop`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsActive(false);
        showToast('success', 'Daily automation schedule stopped.');
        fetchStatus();
      } else {
        showToast('error', data.message || 'Failed to stop automation schedule.');
      }
    } catch (err) {
      console.error('Error stopping automation:', err);
      showToast('error', 'Error connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime12h = (time24) => {
    if (!time24) return '';
    const [hStr, mStr] = time24.split(':');
    let hours = parseInt(hStr, 10);
    const minutes = mStr || '00';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="automation-page">
      {/* Toast Feedback Banner */}
      {feedback && (
        <div className={`automation-toast ${feedback.type}`}>
          <span>{feedback.type === 'success' ? '✓' : '✕'}</span>
          {feedback.text}
        </div>
      )}

      <div className="automation-card">
        {/* Header with Modern Pill Status Badge */}
        <div className="automation-header">
          <div>
            <h1 className="automation-title">Call Automation Scheduler</h1>
            <p className="automation-subtitle">
              Configure daily automated AI voice advisory calls to all registered farmers.
            </p>
          </div>
          <div className={`status-pill ${isActive ? 'pill-active' : 'pill-inactive'}`}>
            <span className="pill-dot"></span>
            <span className="pill-text">{isActive ? 'ACTIVE' : 'INACTIVE'}</span>
          </div>
        </div>

        {/* Hero Prominent Scheduled Time Card */}
        <div className="scheduled-time-hero">
          <div className="hero-time-info">
            <span className="hero-time-label">Current Scheduled Daily Time</span>
            <div className="hero-time-display">
              <span className="hero-time-value">{formatTime12h(callTime)}</span>
              <span className="hero-time-zone">({callTime} IST)</span>
            </div>
          </div>
          <div className="hero-status-note">
            {isActive ? (
              <span className="note-active">● Running daily at this time</span>
            ) : (
              <span className="note-inactive">○ Automation currently stopped</span>
            )}
          </div>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleStartAutomation} className="automation-form">
          <div className="form-section">
            <label htmlFor="callTime" className="time-picker-label">
              Select New Daily Call Time <span className="required">*</span>
            </label>
            <div className="time-picker-row">
              <input
                type="time"
                id="callTime"
                name="callTime"
                value={callTime}
                onChange={(e) => setCallTime(e.target.value)}
                disabled={isSubmitting}
                className="time-input"
              />
            </div>
            <p className="field-hint">
              Every day at this exact time, FarmCall will automatically analyze weather data, generate local voice guidance, and dial all registered farmers.
            </p>
          </div>

          {/* Visually Balanced Action Buttons */}
          <div className="button-group">
            <button
              type="submit"
              className="start-automation-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Updating Schedule...'
                : isActive
                ? '💾 Update Scheduled Time'
                : '⏰ Start Daily Automation'}
            </button>

            {isActive && (
              <button
                type="button"
                className="stop-automation-btn"
                onClick={handleStopAutomation}
                disabled={isSubmitting}
              >
                🛑 Stop Automation
              </button>
            )}
          </div>
        </form>

        {/* Workflow Process Section with Enlarged Step Numbers, Headings and Icons */}
        <div className="workflow-section">
          <h3 className="workflow-title">Automated Calling Process</h3>
          <div className="workflow-grid">
            {/* Step 1 */}
            <div className="workflow-step">
              <div className="step-header">
                <div className="step-num">1</div>
                <span className="step-icon">⏰</span>
              </div>
              <h4>Scheduled Trigger</h4>
              <p>Cron engine triggers daily at the scheduled time.</p>
            </div>

            {/* Step 2 */}
            <div className="workflow-step">
              <div className="step-header">
                <div className="step-num">2</div>
                <span className="step-icon">🌦️</span>
              </div>
              <h4>Weather Intelligence</h4>
              <p>Fetches real-time weather & farm advisory for each village.</p>
            </div>

            {/* Step 3 */}
            <div className="workflow-step">
              <div className="step-header">
                <div className="step-num">3</div>
                <span className="step-icon">🤖</span>
              </div>
              <h4>AI Voice Synthesis</h4>
              <p>Translates advisory into the farmer's native language & converts to audio.</p>
            </div>

            {/* Step 4 */}
            <div className="workflow-step">
              <div className="step-header">
                <div className="step-num">4</div>
                <span className="step-icon">📞</span>
              </div>
              <h4>Twilio Call & SMS</h4>
              <p>Dials farmer's phone via Twilio, with SMS fallback if unanswered.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Automation;
