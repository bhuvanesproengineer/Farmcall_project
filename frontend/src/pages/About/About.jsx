import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  const [activeSection, setActiveSection] = useState('about-hero');
  const [showEmail, setShowEmail] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const offset = 95; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = section.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    document.title = 'About Us | FarmCall - Empowering Farmers with AI Voice Intelligence';
    
    window.scrollTo(0, 0);

    const sections = [
      'about-hero',
      'our-story',
      'mission-vision',
      'meet-founder',
      'technology-stack'
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  const scrollToStory = () => scrollToSection('our-story');

  return (
    <div className="about-layout-container">
      {/* LEFT SIDEBAR NAVBAR */}
      <aside className="about-sidebar">
        <div className="sidebar-sticky-wrapper">
          <h2 className="sidebar-brand">About Us</h2>
          <ul className="sidebar-nav-links">
            <li className={activeSection === 'about-hero' ? 'active' : ''}>
              <button type="button" onClick={() => scrollToSection('about-hero')}>
                <span className="nav-icon">🏠</span> Overview
              </button>
            </li>
            <li className={activeSection === 'our-story' ? 'active' : ''}>
              <button type="button" onClick={() => scrollToSection('our-story')}>
                <span className="nav-icon">📖</span> Our Story
              </button>
            </li>
            <li className={activeSection === 'mission-vision' ? 'active' : ''}>
              <button type="button" onClick={() => scrollToSection('mission-vision')}>
                <span className="nav-icon">🎯</span> Mission & Vision
              </button>
            </li>
            <li className={activeSection === 'meet-founder' ? 'active' : ''}>
              <button type="button" onClick={() => scrollToSection('meet-founder')}>
                <span className="nav-icon">👨‍💻</span> Founder
              </button>
            </li>
            <li className={activeSection === 'technology-stack' ? 'active' : ''}>
              <button type="button" onClick={() => scrollToSection('technology-stack')}>
                <span className="nav-icon">⚙️</span> Tech Stack
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* RIGHT SIDE CONTENT WRAPPER */}
      <div className="about-content-wrapper">
        <div className="about-page">
      {/* 1. HERO SECTION */}
      <section className="about-hero" id="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container about-hero-container">
          <div className="hero-badge">
            <span className="badge-dot"></span> About FarmCall
          </div>
          <h1 className="about-hero-title">About FarmCall</h1>
          <p className="about-hero-subheading">
            Empowering farmers with AI-powered voice alerts, weather intelligence, and emergency communication in their local language.
          </p>
          <div className="about-hero-buttons">
            <button
              id="learn-more-btn"
              className="btn-primary hero-btn"
              onClick={scrollToStory}
            >
              Learn More
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 13l5 5 5-5M12 6v12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY (FOUNDING JOURNEY) SECTION */}
      <section className="section story-section" id="our-story">
        <div className="container story-container">
          <div className="story-card card">
            <div className="story-grid">
              {/* Left Column: Agriculture / Founding Illustration */}
              <div className="story-image-col">
                <div className="story-image-wrapper">
                  <img
                    src="/founding_story_img.png"
                    alt="Founding Journey - FarmCall Inspiration"
                    className="story-img"
                  />
                  <div className="story-image-badge">
                    <span className="story-badge-icon">🌱</span>
                    <span>AgriTech Innovation</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Content */}
              <div className="story-text-col">
                <div className="story-badge-pill">
                  <span className="pill-dot"></span>
                  Founding Journey
                </div>

                <h2 className="story-heading">Our Story</h2>

                <div className="story-body-text">
                  <p className="story-paragraph story-lead font-medium">
                    FarmCall began with a simple conversation at home.
                  </p>
                  <p className="story-paragraph">
                    Every morning, my grandfather asked, <em>"What's the weather today?"</em> before going to the fields. One day, when I asked why he couldn't check it himself, he quietly handed me his basic keypad phone.
                  </p>
                  <p className="story-paragraph story-highlight-line">
                    That moment changed everything.
                  </p>
                  <p className="story-paragraph">
                    Realizing millions of farmers rely on feature phones without access to digital apps, FarmCall was created to deliver weather alerts, emergency notifications, and AI-powered voice guidance in local languages.
                  </p>
                </div>

                <div className="story-quote-card">
                  <div className="quote-mark">“</div>
                  <blockquote className="story-quote-text">
                    "A simple question from my grandfather became the inspiration for FarmCall."
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION SECTION */}
      <section className="section-alt mission-vision-section" id="mission-vision">
        <div className="container">
          <div className="section-header text-center">
            <span className="sub-tag">PURPOSE & DIRECTION</span>
            <h2>Mission & Vision</h2>
            <p className="section-subtitle">Guiding our daily commitment and long-term aspirations</p>
          </div>

          <div className="mv-grid">
            {/* Mission Card */}
            <div className="mv-card card mission-card">
              <div className="mv-icon-wrapper mission-icon-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mv-icon">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                  <path d="M12 2a10 10 0 1 0 10 10" />
                  <polygon points="12 2 15 8 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 8 12 2" />
                </svg>
              </div>
              <h3>🌱 Mission</h3>
              <p>
                To empower farmers with timely, AI-powered agricultural intelligence that helps them make better decisions—from seed selection and crop planning to weather, irrigation, pest management, and market insights. Through simple voice calls and SMS, FarmCall makes modern farming information accessible to every farmer.
              </p>
            </div>

            {/* Vision Card */}
            <div className="mv-card card vision-card">
              <div className="mv-icon-wrapper vision-icon-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mv-icon">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z"/>
                </svg>
              </div>
              <h3>🚀 Vision</h3>
              <p>
                <strong>A farmer's profit is not measured in crores or lakhs—it's measured in thousands. Let's protect every rupee that matters.</strong> Our vision is to protect every rupee that matters by ensuring every farmer receives the right information at the right time. Together, let's strengthen the backbone of our nation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MEET THE FOUNDER SECTION */}
      <section className="section founder-section" id="meet-founder">
        <div className="container">
          <div className="founder-card card">
            <div className="founder-grid">
              {/* Left Side: Circular Photo + Name + Role + Connect with Me */}
              <div className="founder-left-col">
                <div className="founder-avatar-wrapper">
                  <img
                    src="/image.png"
                    alt="Bhuvaneswaran - Founder & Full Stack Developer"
                    className="founder-avatar-img"
                  />
                </div>
                <h3 className="founder-left-name">Bhuvaneswaran</h3>
                <p className="founder-left-role">Founder & Full Stack Developer</p>

                {/* Connect with Me Section - Moved Under Avatar */}
                <div className="connect-section">
                  <h4 className="connect-title font-semibold">Connect with Me</h4>
                  <div className="connect-icon-buttons">
                    {/* LinkedIn */}
                    <a
                      href="https://linkedin.com/in/bhuvaneswaran26"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="connect-icon-btn linkedin-btn"
                      title="LinkedIn"
                      aria-label="LinkedIn"
                    >
                      <svg className="connect-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://instagram.com/callmebhuvanes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="connect-icon-btn instagram-btn"
                      title="Instagram"
                      aria-label="Instagram"
                    >
                      <svg className="connect-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>

                    {/* Email */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowEmail(!showEmail);
                      }}
                      className="connect-icon-btn email-btn"
                      title="Email - Click to show"
                      aria-label="Email"
                    >
                      <svg className="connect-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </button>
                  </div>
                  {showEmail && (
                    <div className="email-display-text font-semibold">
                      bhuvanes.proengineer@gmail.com
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Content */}
              <div className="founder-right-col">
                <div className="founder-badge-pill">
                  <span className="pill-dot"></span>
                  Meet the Founder
                </div>

                <h2 className="founder-heading">Bhuvaneswaran</h2>
                <div className="founder-subtitle font-semibold">Founder & Full Stack Developer</div>

                <div className="founder-bio">
                  <p>
                    Growing up in an agricultural family, I witnessed the everyday challenges farmers face due to delayed access to critical information. A simple conversation with my grandfather inspired me to build FarmCall, an AI-powered platform that delivers weather alerts, emergency notifications, and farming guidance through voice calls and SMS.
                  </p>
                  <p>
                    My mission is to use technology to make farming smarter, more accessible, and more profitable for every farmer, regardless of the phone they use.
                  </p>
                </div>

                {/* Quote */}
                <blockquote className="founder-quote">
                  "Technology has the greatest impact when it reaches the people who need it most."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TECHNOLOGY SECTION */}
      <section className="section-alt tech-section" id="technology-stack">
        <div className="container">
          <div className="section-header text-center">
            <span className="sub-tag">OUR TECH STACK</span>
            <h2>Technology Behind FarmCall</h2>
            <p className="section-subtitle">Engineered with modern, scalable, and resilient technologies</p>
          </div>

          <div className="tech-grid">
            {/* React */}
            <div className="tech-item card">
              <div className="tech-icon-box react-box">
                <svg viewBox="-11.5 -10.23174 23 20.46348" className="tech-svg">
                  <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
                  <g stroke="#61dafb" strokeWidth="1" fill="none">
                    <ellipse rx="11" ry="4.2"/>
                    <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                    <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                  </g>
                </svg>
              </div>
              <span className="tech-name">React</span>
            </div>

            {/* Node.js */}
            <div className="tech-item card">
              <div className="tech-icon-box node-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tech-svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="tech-name">Node.js</span>
            </div>

            {/* Express.js */}
            <div className="tech-item card">
              <div className="tech-icon-box express-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tech-svg">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="tech-name">Express.js</span>
            </div>

            {/* MongoDB */}
            <div className="tech-item card">
              <div className="tech-icon-box mongo-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tech-svg">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M12 8v8"/>
                </svg>
              </div>
              <span className="tech-name">MongoDB</span>
            </div>

            {/* AI */}
            <div className="tech-item card">
              <div className="tech-icon-box ai-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tech-svg">
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z"/>
                  <path d="M12 12L2.5 7.5"/>
                  <path d="M12 12v9.5"/>
                  <circle cx="12" cy="12" r="3" fill="#8b5cf6" fillOpacity="0.2"/>
                  <path d="M12 2l3 3-3 3-3-3 3-3z"/>
                </svg>
              </div>
              <span className="tech-name">AI</span>
            </div>

            {/* Cloud */}
            <div className="tech-item card">
              <div className="tech-icon-box cloud-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tech-svg">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/>
                </svg>
              </div>
              <span className="tech-name">Cloud</span>
            </div>
          </div>
        </div>
      </section>


        </div>
      </div>
    </div>
  );
}

export default About;
