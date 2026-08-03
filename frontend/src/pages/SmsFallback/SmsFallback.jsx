import React from 'react';
import { Link } from 'react-router-dom';
import './SmsFallback.css';

function SmsFallback() {
  return (
    <div className="sms-page">
      {/* Hero Section */}
      <section className="sms-hero">
        <div className="sms-hero-container">
          <span className="sms-badge">FEATURE DETAIL</span>
          <h1 className="sms-title">Intelligent SMS Fallback</h1>
          <p className="sms-tagline">Important farming information shouldn't disappear with a missed call.</p>
          <p className="sms-intro">
            Farmers may sometimes be unable to answer a FarmCall advisory. FarmCall monitors the call result and can automatically deliver a shorter version of the advisory through SMS.
          </p>
        </div>
      </section>

      <div className="sms-content-container">
        {/* Branching Flowchart Section */}
        <section className="sms-section">
          <h2 className="section-heading">How It Works</h2>
          <div className="sms-flow-wrapper">
            <div className="flow-root-node">
              <span className="node-icon">📞</span>
              <span>FarmCall Voice Call</span>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-decision-node">
              <span className="node-icon">🔍</span>
              <span>Call Status Evaluation</span>
            </div>

            {/* Branching Paths */}
            <div className="branches-container">
              {/* Branch 1: Success Path */}
              <div className="branch-column branch-success">
                <div className="branch-label">Answered</div>
                <div className="flow-arrow">↓</div>
                <div className="branch-card success-card">
                  <span className="branch-icon">✅</span>
                  <div>
                    <h4>Done</h4>
                    <p>Advisory delivered via call</p>
                  </div>
                </div>
              </div>

              {/* Branch 2: Fallback Path */}
              <div className="branch-column branch-fallback">
                <div className="branch-label label-orange">Missed / Failed</div>
                <div className="flow-arrow">↓</div>
                <div className="branch-card fallback-card">
                  <span className="branch-icon">⚙️</span>
                  <div>
                    <h4>Generate Short Advisory</h4>
                    <p>AI condenses key actions</p>
                  </div>
                </div>
                <div className="flow-arrow">↓</div>
                <div className="branch-card fallback-card">
                  <span className="branch-icon">💬</span>
                  <div>
                    <h4>SMS Sent</h4>
                    <p>Delivered to farmer's mobile</p>
                  </div>
                </div>
                <div className="flow-arrow">↓</div>
                <div className="branch-card fallback-active-card">
                  <span className="branch-icon">📱</span>
                  <div>
                    <h4>Farmer Receives SMS</h4>
                    <p>Critical advice preserved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Breakdown Section (2 Columns) */}
        <section className="sms-grid-section">
          <div className="sms-grid">
            {/* Column 1: Conditions */}
            <div className="sms-card">
              <div className="card-header">
                <span className="card-icon">⚠️</span>
                <h3>Fallback Can Happen When:</h3>
              </div>
              <ul className="sms-list">
                <li><span>📵</span> Call isn't answered</li>
                <li><span>❌</span> Call fails or line is busy</li>
                <li><span>⏱️</span> Call is disconnected too quickly</li>
              </ul>
            </div>

            {/* Column 2: Why It Matters */}
            <div className="sms-card">
              <div className="card-header">
                <span className="card-icon">🌾</span>
                <h3>Why It Matters</h3>
              </div>
              <p className="why-matters-text">
                Farmers working in fields cannot always answer their phones. The SMS fallback provides a reliable second communication channel so critical weather warnings and farming advice always reach them.
              </p>
            </div>
          </div>
        </section>

        {/* Key Message Callout */}
        <section className="key-message-box">
          <div className="key-message-content">
            <span className="quote-mark">“</span>
            <p>Missed the call? Don't miss the advice.</p>
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

export default SmsFallback;
