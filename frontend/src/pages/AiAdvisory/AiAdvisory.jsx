import React from 'react';
import { Link } from 'react-router-dom';
import './AiAdvisory.css';

function AiAdvisory() {
  return (
    <div className="advisory-page">
      {/* Hero Section */}
      <section className="advisory-hero">
        <div className="advisory-hero-container">
          <span className="advisory-badge">FEATURE DETAIL</span>
          <h1 className="advisory-title">AI Weather & Farm Advisory</h1>
          <p className="advisory-tagline">From weather data to actionable farming decisions.</p>
          <p className="advisory-intro">
            FarmCall analyzes hyper-local weather conditions and transforms them into practical agricultural recommendations. Instead of giving farmers raw weather numbers, it tells them what action they should take.
          </p>
        </div>
      </section>

      <div className="advisory-content-container">
        {/* How It Works Section */}
        <section className="advisory-section">
          <h2 className="section-heading">How It Works</h2>
          <div className="flowchart-container">
            <div className="flow-step">
              <div className="step-icon">📍</div>
              <div className="step-title">Farmer Location</div>
            </div>
            <div className="flow-arrow">↓</div>

            <div className="flow-step">
              <div className="step-icon">🌤️</div>
              <div className="step-title">Hyper-Local Weather Data</div>
            </div>
            <div className="flow-arrow">↓</div>

            <div className="flow-step">
              <div className="step-icon">⚙️</div>
              <div className="step-title">Agricultural Rule Analysis</div>
            </div>
            <div className="flow-arrow">↓</div>

            <div className="flow-step">
              <div className="step-icon">🤖</div>
              <div className="step-title">AI-Generated Advisory</div>
            </div>
            <div className="flow-arrow">↓</div>

            <div className="flow-step">
              <div className="step-icon">🌐</div>
              <div className="step-title">Local Language Conversion</div>
            </div>
            <div className="flow-arrow">↓</div>

            <div className="flow-step active-step">
              <div className="step-icon">📞</div>
              <div className="step-title">Voice Call to Farmer</div>
            </div>
          </div>
        </section>

        {/* Feature Breakdown Section (2 Columns) */}
        <section className="advisory-grid-section">
          <div className="advisory-grid">
            {/* Column 1 */}
            <div className="advisory-card">
              <div className="card-header">
                <span className="card-icon">📊</span>
                <h3>What FarmCall Analyzes</h3>
              </div>
              <ul className="advisory-list">
                <li><span>🌡️</span> Temperature</li>
                <li><span>💧</span> Humidity</li>
                <li><span>🌧️</span> Rainfall</li>
                <li><span>🌿</span> Dew conditions</li>
                <li><span>🌫️</span> Fog and weather conditions</li>
                <li><span>📅</span> Hourly/multi-day forecasts</li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="advisory-card">
              <div className="card-header">
                <span className="card-icon">💡</span>
                <h3>Advice Generated For</h3>
              </div>
              <ul className="advisory-list">
                <li><span>🌱</span> Sowing</li>
                <li><span>💧</span> Irrigation</li>
                <li><span>🌾</span> Harvesting</li>
                <li><span>🧪</span> Pesticide spraying</li>
                <li><span>🌧️</span> Rain/crop protection</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Message Callout */}
        <section className="key-message-box">
          <div className="key-message-content">
            <span className="quote-mark">“</span>
            <p>FarmCall doesn't just tell farmers the weather. It tells them what to do about it.</p>
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

export default AiAdvisory;
