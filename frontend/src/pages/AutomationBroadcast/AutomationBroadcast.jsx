import React from 'react';
import { Link } from 'react-router-dom';
import './AutomationBroadcast.css';

function AutomationBroadcast() {
  return (
    <div className="automation-page">
      {/* Hero Section */}
      <section className="automation-hero">
        <div className="automation-hero-container">
          <span className="automation-badge">FEATURE DETAIL</span>
          <h1 className="automation-title">Automation & Emergency Broadcast</h1>
          <p className="automation-tagline">The right information reaches farmers at the right time.</p>
          <p className="automation-intro">
            FarmCall automates regular agricultural advisory calls while also allowing important alerts to be broadcast instantly to registered farmers.
          </p>
        </div>
      </section>

      <div className="automation-content-container">
        <h2 className="section-heading">Two Major Capabilities</h2>

        {/* 2-Column Capability Flowcharts */}
        <section className="capabilities-grid-section">
          <div className="capabilities-grid">
            
            {/* Capability 1: Scheduled Automation */}
            <div className="capability-card">
              <div className="capability-header">
                <span className="cap-icon">⏰</span>
                <div>
                  <h3>Scheduled Automation</h3>
                  <p className="cap-sub">Daily automated weather dispatches</p>
                </div>
              </div>

              <div className="flow-list">
                <div className="flow-step-item">
                  <span className="flow-num">1</span>
                  <span>Scheduled Time</span>
                </div>
                <div className="flow-mini-arrow">↓</div>

                <div className="flow-step-item">
                  <span className="flow-num">2</span>
                  <span>Get Latest Weather</span>
                </div>
                <div className="flow-mini-arrow">↓</div>

                <div className="flow-step-item">
                  <span className="flow-num">3</span>
                  <span>Generate Advisory</span>
                </div>
                <div className="flow-mini-arrow">↓</div>

                <div className="flow-step-item">
                  <span className="flow-num">4</span>
                  <span>Generate Local-Language Voice</span>
                </div>
                <div className="flow-mini-arrow">↓</div>

                <div className="flow-step-item flow-active">
                  <span className="flow-num">5</span>
                  <span>Call Registered Farmers</span>
                </div>
              </div>

              <p className="capability-note">
                💡 This allows regular advisories to run automatically without someone manually calling every farmer.
              </p>
            </div>

            {/* Capability 2: Emergency Broadcast */}
            <div className="capability-card">
              <div className="capability-header">
                <span className="cap-icon">📢</span>
                <div>
                  <h3>Emergency Broadcast</h3>
                  <p className="cap-sub">Instant bulk alert dispatches</p>
                </div>
              </div>

              <div className="flow-list">
                <div className="flow-step-item">
                  <span className="flow-num">1</span>
                  <span>Emergency Alert</span>
                </div>
                <div className="flow-mini-arrow">↓</div>

                <div className="flow-step-item">
                  <span className="flow-num">2</span>
                  <span>Select Farmers</span>
                </div>
                <div className="flow-mini-arrow">↓</div>

                <div className="flow-step-item">
                  <span className="flow-num">3</span>
                  <span>Translate Alert</span>
                </div>
                <div className="flow-mini-arrow">↓</div>

                <div className="flow-step-item">
                  <span className="flow-num">4</span>
                  <span>Generate Voice</span>
                </div>
                <div className="flow-mini-arrow">↓</div>

                <div className="flow-step-item flow-active-urgent">
                  <span className="flow-num">5</span>
                  <span>Bulk Voice Calls</span>
                </div>
              </div>

              <div className="example-scenarios">
                <h4>Example Situations:</h4>
                <ul>
                  <li>🐘 <strong>Wild Elephant Alert</strong> — Warn villages about nearby elephant movement.</li>
                  <li>🌊 <strong>Dam Emergency</strong> — Alert communities about water release or flood risks.</li>
                  <li>🌱 <strong>Seeds & Subsidies</strong> — Share government scheme and distribution updates.</li>
                  <li>📢 <strong>Village Meetings</strong> — Announce meetings, camps and training programs.</li>
                  <li>📰 <strong>Agriculture Updates</strong> — Share important farming and government news.</li>
                  <li>🐛 <strong>Pest & Disease Alerts</strong> — Warn farmers about nearby crop threats.</li>
                  <li>🌧️ <strong>Severe Weather</strong> — Alert farmers about storms, heavy rain or heat waves.</li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* Key Message Callout */}
        <section className="key-message-box">
          <div className="key-message-content">
            <span className="quote-mark">“</span>
            <p>One alert. Multiple farmers. Delivered automatically.</p>
          </div>
        </section>

        {/* Back Link */}
        <div className="back-link-container">
          <Link to="/" className="back-btn">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AutomationBroadcast;
