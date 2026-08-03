import React, { useState, useEffect } from 'react';
import './CallLogs.css';

function CallLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  const getApiBase = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    return '';
  };

  const formatLastUpdatedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const fetchCallLogs = async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true);
    } else if (logs.length === 0) {
      setLoading(true);
    }
    setError(null);

    try {
      const apiBase = getApiBase();
      const token = localStorage.getItem('farmcall_token');

      // Primary endpoint /calls/logs with fallback to /api/call-logs
      let response = await fetch(`${apiBase}/calls/logs`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok && response.status === 404) {
        response = await fetch(`${apiBase}/api/call-logs`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      }

      const data = await response.json();

      if (response.ok) {
        setLogs(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
        setLastUpdated(formatLastUpdatedTime());
      } else {
        throw new Error(data.message || data.error || 'Failed to fetch call logs.');
      }
    } catch (err) {
      console.error('Error fetching call logs:', err);
      setError(err.message || 'Unable to load call logs. Please check your backend connection.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCallLogs();

    // 30-Second Automatic Refresh Interval
    const intervalId = setInterval(() => {
      fetchCallLogs();
    }, 30000);

    // Clean up interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const formatDuration = (seconds) => {
    const sec = parseInt(seconds || 0, 10);
    if (!sec || sec <= 0) return '0s';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m > 0) {
      return `${m}m ${s}s`;
    }
    return `${s}s`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="call-logs-page">
      <div className="call-logs-card">
        {/* Page Header */}
        <div className="call-logs-header">
          <div>
            <h1 className="call-logs-title">Call Logs</h1>
            <p className="call-logs-subtitle">
              Monitor all outgoing calls made by FarmCall.
            </p>
          </div>
          <button
            className="refresh-btn"
            onClick={() => fetchCallLogs(true)}
            disabled={isRefreshing || loading}
          >
            <span className={`refresh-icon ${isRefreshing ? 'spin' : ''}`}>🔄</span>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Sub-header: Last Updated Timestamp Bar */}
        <div className="last-updated-bar">
          <span>Last Updated: <strong>{lastUpdated || 'Updating...'}</strong></span>
          <span className="auto-refresh-badge">⚡ Auto-refreshes every 30s</span>
        </div>

        {/* States Container */}
        {loading ? (
          <div className="logs-loading">
            <div className="spinner"></div>
            <p>Fetching call logs...</p>
          </div>
        ) : error ? (
          <div className="logs-error-box">
            <div className="error-icon">⚠️</div>
            <h3>Failed to Load Call Logs</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={() => fetchCallLogs(true)}>
              🔄 Retry Now
            </button>
          </div>
        ) : logs.length === 0 ? (
          <div className="empty-logs-state">
            <div className="empty-icon">📞</div>
            <h3>No Call Logs Available</h3>
            <p>No outgoing call history found in your account yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Farmer Name</th>
                  <th>Phone Number</th>
                  <th>Call Status</th>
                  <th>Duration</th>
                  <th>SMS Status</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => {
                  const status = (log.call_status || log.status || 'completed').toLowerCase();
                  const smsStatus = (log.sms_status || 'not_required').toLowerCase();
                  return (
                    <tr key={log._id || index}>
                      <td className="farmer-name-cell">
                        {log.farmer_name || log.farmerName || 'Unknown Farmer'}
                      </td>
                      <td className="phone-cell">
                        {log.phone_number || log.phoneNumber || 'N/A'}
                      </td>
                      <td>
                        <span className={`status-badge call-status ${status}`}>
                          {status === 'completed' ? '✓ Completed' : status}
                        </span>
                      </td>
                      <td className="duration-cell">
                        {formatDuration(log.call_duration || log.duration)}
                      </td>
                      <td>
                        <span className={`status-badge sms-status ${smsStatus}`}>
                          {smsStatus === 'delivered'
                            ? '💬 Delivered'
                            : smsStatus === 'not_required'
                            ? '— Not Required'
                            : '✕ Failed'}
                        </span>
                      </td>
                      <td className="date-cell">
                        {formatDate(log.createdAt || log.date || log.timestamp)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CallLogs;
