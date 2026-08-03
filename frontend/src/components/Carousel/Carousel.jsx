import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Carousel.css';

const slidesData = [
  {
    id: 1,
    badge: 'AI ADVISORY',
    title: 'AI Weather & Farm Advisory',
    description: 'Hyper-local weather intelligence and real-time AI advisory calls delivered directly to farmers in their native language.',
    buttonText: 'Learn More',
    image: '/slide1.png',
    link: '/ai-advisory'
  },
  {
    id: 2,
    badge: 'AUTOMATION & BROADCAST',
    title: 'Automation & Emergency Broadcast',
    description: 'Scheduled daily advisory calls and instant broadcast alerts for critical weather conditions across regions.',
    buttonText: 'Learn More',
    image: '/slide2.png',
    link: '/automation-broadcast'
  },
  {
    id: 3,
    badge: 'SMS FALLBACK',
    title: 'Intelligent SMS Fallback',
    description: 'Automated short SMS delivery ensuring critical farming advice reaches every farmer even when calls are missed.',
    buttonText: 'Learn More',
    image: '/slide3.png',
    link: '/sms-fallback'
  }
];

function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slidesData.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slidesData.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slidesData.length) % slidesData.length);
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero-carousel-container">
      <div className="carousel-wrapper">
        {slidesData.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`carousel-slide ${isActive ? 'active' : ''}`}
            >
              {/* Left Side: Slide Image Container */}
              <div className="carousel-image-container">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="carousel-slide-img"
                />
              </div>

              {/* Right Side: Content */}
              <div className="carousel-content">
                <span className="carousel-badge">{slide.badge}</span>
                <h1 className="carousel-title">{slide.title}</h1>
                <p className="carousel-description">{slide.description}</p>
                <Link to={slide.link} className="carousel-btn">
                  {slide.buttonText} <span>→</span>
                </Link>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button className="carousel-arrow prev-arrow" onClick={handlePrev} aria-label="Previous Slide">
          &#10094;
        </button>
        <button className="carousel-arrow next-arrow" onClick={handleNext} aria-label="Next Slide">
          &#10095;
        </button>

        {/* Indicator Dots */}
        <div className="carousel-dots">
          {slidesData.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Carousel;
