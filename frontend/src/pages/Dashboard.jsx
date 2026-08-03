import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  RefreshIcon,
  UsersIcon,
  PhoneIcon,
  PhoneCallIcon,
  PhoneOffIcon,
  MessageSquareIcon,
  ClockIcon,
  RadioIcon,
  MicIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '../components/Icons';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [farmersCount, setFarmersCount] = useState(0);
  const [automation, setAutomation] = useState({ is_active: false, call_time: null });
  const [lastUpdated, setLastUpdated] = useState('');

  const getApiBase = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    return '';
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const apiBase = getApiBase();
      const token = localStorage.getItem('farmcall_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch Call Logs
      let logsRes = await fetch(`${apiBase}/calls/logs`, { headers });
      if (!logsRes.ok && logsRes.status === 404) {
        logsRes = await fetch(`${apiBase}/api/call-logs`, { headers });
      }
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(Array.isArray(logsData.data) ? logsData.data : []);
      }

      // Fetch Farmers
      const farmersRes = await fetch(`${apiBase}/farmers/`, { headers });
      if (farmersRes.ok) {
        const farmersData = await farmersRes.json();
        setFarmersCount(Array.isArray(farmersData.data) ? farmersData.data.length : 0);
      }

      // Fetch Automation Status
      const autoRes = await fetch(`${apiBase}/automation/status`, { headers });
      if (autoRes.ok) {
        const autoData = await autoRes.json();
        if (autoData.data) {
          setAutomation({
            is_active: Boolean(autoData.data.is_active),
            call_time: autoData.data.call_time || null,
          });
        }
      }

      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- Calculate Overall Statistics ---
  const totalCalls = logs.length;
  const answeredCalls = logs.filter(
    (l) => (l.call_status || l.status || '').toLowerCase() === 'completed'
  ).length;
  const unansweredCalls = totalCalls - answeredCalls;
  const smsSent = logs.filter(
    (l) => (l.sms_status || '').toLowerCase() === 'delivered'
  ).length;

  const totalDurationSeconds = logs.reduce(
    (acc, l) => acc + parseInt(l.call_duration || l.duration || 0, 10),
    0
  );
  const avgDurationSeconds = totalCalls > 0 ? Math.round(totalDurationSeconds / totalCalls) : 0;

  // --- Calculate Today's Performance ---
  const todayStr = new Date().toDateString();
  const todayLogs = logs.filter((l) => {
    const logDate = l.createdAt || l.date || l.timestamp;
    return logDate ? new Date(logDate).toDateString() === todayStr : false;
  });

  const callsToday = todayLogs.length;
  const answeredToday = todayLogs.filter(
    (l) => (l.call_status || l.status || '').toLowerCase() === 'completed'
  ).length;
  const unansweredToday = callsToday - answeredToday;
  const smsSentToday = todayLogs.filter(
    (l) => (l.sms_status || '').toLowerCase() === 'delivered'
  ).length;
  const todayDurationSeconds = todayLogs.reduce(
    (acc, l) => acc + parseInt(l.call_duration || l.duration || 0, 10),
    0
  );
  const avgDurationTodaySeconds = callsToday > 0 ? Math.round(todayDurationSeconds / callsToday) : 0;
  const broadcastsToday = todayLogs.filter(
    (l) => (l.callType || l.call_type || '').toLowerCase() === 'broadcast'
  ).length;

  const formatSec = (sec) => {
    if (!sec) return '0s';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
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

  const formatDateShort = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Page Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard Overview</h1>
            <p className="dashboard-subtitle">
              Real-time analytics and performance monitor for FarmCall.
            </p>
            <div className="last-updated-text">
              Last Updated: <strong>{lastUpdated || 'Updating...'}</strong>
            </div>
          </div>
          <div className="header-actions">
            <button className="refresh-dashboard-btn" onClick={fetchDashboardData} disabled={loading}>
              <RefreshIcon className={loading ? 'spin' : ''} size={16} />
              <span>Refresh Stats</span>
            </button>
          </div>
        </div>

        {/* Section 1: Overall Statistics */}
        <section className="dashboard-section compact-gap">
          <div className="section-header">
            <h2 className="section-title">Overall Statistics</h2>
            <span className="section-subtitle-label">• Lifetime Summary</span>
          </div>

          <div className="stats-grid">
            {/* Card 1: Total Farmers */}
            <div className="stat-card">
              <div className="stat-icon-wrapper blue-bg">
                <UsersIcon size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Farmers</span>
                <span className="stat-value">{loading ? '...' : farmersCount}</span>
              </div>
            </div>

            {/* Card 2: Total Calls */}
            <div className="stat-card">
              <div className="stat-icon-wrapper indigo-bg">
                <PhoneIcon size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Calls</span>
                <span className="stat-value">{loading ? '...' : totalCalls}</span>
              </div>
            </div>

            {/* Card 3: Answered Calls */}
            <div className="stat-card">
              <div className="stat-icon-wrapper green-bg">
                <PhoneCallIcon size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Answered Calls</span>
                <span className="stat-value">{loading ? '...' : answeredCalls}</span>
              </div>
            </div>

            {/* Card 4: Unanswered Calls */}
            <div className="stat-card">
              <div className="stat-icon-wrapper red-bg">
                <PhoneOffIcon size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Unanswered Calls</span>
                <span className="stat-value">{loading ? '...' : unansweredCalls}</span>
              </div>
            </div>

            {/* Card 5: SMS Sent */}
            <div className="stat-card">
              <div className="stat-icon-wrapper purple-bg">
                <MessageSquareIcon size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">SMS Sent</span>
                <span className="stat-value">{loading ? '...' : smsSent}</span>
              </div>
            </div>

            {/* Card 6: Avg Call Duration */}
            <div className="stat-card">
              <div className="stat-icon-wrapper teal-bg">
                <ClockIcon size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Avg Duration</span>
                <span className="stat-value">{loading ? '...' : formatSec(avgDurationSeconds)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Today's Performance */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Today's Performance</h2>
            <span className="section-subtitle-label">• Today: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </div>

          <div className="stats-grid">
            {/* Calls Today */}
            <div className="stat-card">
              <div className="stat-icon-wrapper indigo-bg">
                <PhoneIcon size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Calls Today</span>
                <span className="stat-value">{loading ? '...' : callsToday}</span>
              </div>
            </div>

            {/* Answered Today */}
            <div className="stat-card">
              <div className="stat-icon-wrapper green-bg">
                <PhoneCallIcon size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Answered Today</span>
                <span className="stat-value">{loading ? '...' : answeredToday}</span>
              </div>
            </div>

            {/* Unanswered Today */}
            <div className="stat-card">
              <div className="stat-icon-wrapper red-bg">
                <PhoneOffIcon size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Unanswered Today</span>
                <span className="stat-value">{loading ? '...' : unansweredToday}</span>
              </div>
            </div>

            {/* SMS Sent Today */}
            <div className="stat-card">
              <div className="stat-icon-wrapper purple-bg">
                <MessageSquareIcon size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">SMS Sent Today</span>
                <span className="stat-value">{loading ? '...' : smsSentToday}</span>
              </div>
            </div>

            {/* Avg Duration Today */}
            <div className="stat-card">
              <div className="stat-icon-wrapper teal-bg">
                <ClockIcon size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Avg Duration Today</span>
                <span className="stat-value">{loading ? '...' : formatSec(avgDurationTodaySeconds)}</span>
              </div>
            </div>

            {/* Broadcasts Today */}
            <div className="stat-card">
              <div className="stat-icon-wrapper blue-bg">
                <RadioIcon size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Broadcasts Today</span>
                <span className="stat-value">{loading ? '...' : broadcastsToday}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 & 4: Two-column layout for Recent Logs & Automation Status */}
        <div className="dashboard-row-two">
          {/* Section 3: Recent Call Logs */}
          <div className="dashboard-card-box logs-box">
            <div className="card-box-header">
              <h3>Recent Call Logs</h3>
              <Link to="/call-logs" className="view-all-link">
                View All Logs <ArrowRightIcon size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="mini-loader">Fetching recent calls...</div>
            ) : logs.length === 0 ? (
              <div className="empty-state-container">
                <div className="empty-state-icon">
                  <PhoneIcon size={28} />
                </div>
                <p className="empty-state-title">No call logs available yet.</p>
                <p className="empty-state-desc">Call activity will appear here once calls are made.</p>
              </div>
            ) : (
              <div className="mini-table-wrapper">
                <table className="mini-table">
                  <thead>
                    <tr>
                      <th>Farmer Name</th>
                      <th>Status</th>
                      <th>Duration</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.slice(0, 5).map((log, idx) => {
                      const st = (log.call_status || log.status || 'completed').toLowerCase();
                      return (
                        <tr key={log._id || idx}>
                          <td className="bold">{log.farmer_name || log.farmerName || 'Farmer'}</td>
                          <td>
                            <span className={`mini-status ${st}`}>
                              {st === 'completed' ? (
                                <>
                                  <CheckCircleIcon size={12} /> Completed
                                </>
                              ) : (
                                <>
                                  <XCircleIcon size={12} /> {st}
                                </>
                              )}
                            </span>
                          </td>
                          <td>{formatSec(log.call_duration || log.duration)}</td>
                          <td className="subtle">{formatDateShort(log.createdAt || log.date)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 4: Automation Status */}
          <div className="dashboard-card-box automation-box">
            <div className="card-box-header">
              <h3>Automation Status</h3>
              <Link to="/automation" className="view-all-link">
                Manage <ArrowRightIcon size={14} />
              </Link>
            </div>

            <div className="automation-widget">
              {automation.call_time ? (
                <>
                  <div className={`auto-pill ${automation.is_active ? 'active' : 'inactive'}`}>
                    <span className="dot"></span>
                    <span>{automation.is_active ? 'AUTOMATION ACTIVE' : 'AUTOMATION INACTIVE'}</span>
                  </div>

                  <div className="auto-time-card">
                    <span className="auto-time-label">Scheduled Call Time</span>
                    <div className="auto-time-val">{formatTime12h(automation.call_time)}</div>
                    <span className="auto-time-sub">({automation.call_time} IST Daily)</span>
                  </div>

                  <p className="auto-desc">
                    {automation.is_active
                      ? 'FarmCall automatically fetches daily weather and dials all farmers at this scheduled time.'
                      : 'Daily automated call scheduler is currently stopped.'}
                  </p>
                </>
              ) : (
                <div className="empty-state-container">
                  <div className="empty-state-icon teal-icon-bg">
                    <ClockIcon size={28} />
                  </div>
                  <p className="empty-state-title">No automation schedule configured.</p>
                  <p className="empty-state-desc">Set up daily calling time in automation settings.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 5: Quick Actions */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
          </div>

          <div className="quick-actions-grid">
            <div className="action-card" onClick={() => navigate('/test-call')}>
              <div className="action-icon-box green-icon">
                <MicIcon size={20} />
              </div>
              <div className="action-info">
                <h4>Start Test Call</h4>
                <p>Initiate a live voice test call to a farmer</p>
              </div>
            </div>

            <div className="action-card" onClick={() => navigate('/broadcast')}>
              <div className="action-icon-box blue-icon">
                <RadioIcon size={20} />
              </div>
              <div className="action-info">
                <h4>Broadcast Alert</h4>
                <p>Send emergency voice alert to all farmers</p>
              </div>
            </div>

            <div className="action-card" onClick={() => navigate('/farmers')}>
              <div className="action-icon-box purple-icon">
                <UsersIcon size={20} />
              </div>
              <div className="action-info">
                <h4>Manage Farmers</h4>
                <p>Register, edit & view farmer directory</p>
              </div>
            </div>

            <div className="action-card" onClick={() => navigate('/automation')}>
              <div className="action-icon-box teal-icon">
                <ClockIcon size={20} />
              </div>
              <div className="action-info">
                <h4>Schedule Automation</h4>
                <p>Set daily call automation time & settings</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
