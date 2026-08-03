import React from 'react';
import Carousel from '../components/Carousel/Carousel';

function Home() {
  return (
    <div style={{ backgroundColor: '#F5FAF6' }}>
      {/* Introduction Section */}
      <section className="intro-section" style={{
        backgroundColor: '#F5FAF6',
        textAlign: 'center',
        padding: '3rem 1.5rem 0.5rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            color: '#123B66',
            fontSize: '30px',
            fontWeight: 700,
            marginBottom: '0.5rem',
            letterSpacing: '-0.01em'
          }}>
            Discover What FarmCall Can Do
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '16px',
            fontWeight: 400
          }}>
            Smart agricultural intelligence delivered directly to farmers.
          </p>
        </div>
      </section>

      <Carousel />
    </div>
  );
}

export default Home;
