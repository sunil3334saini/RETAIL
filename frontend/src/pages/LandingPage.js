import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

/**
 * Landing Page Component
 * - Displays welcome message
 * - Navigation to menu
 */
function LandingPage() {
  const navigate = useNavigate();

  const handleStartShopping = () => {
    navigate('/menu');
  };

  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Pizza & Breads</h1>
          <p>Order delicious pizzas, cold drinks, and fresh breads online</p>
          <button className="btn btn-primary hero-btn" onClick={handleStartShopping}>
            Start Shopping
          </button>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature">
              <span className="feature-icon">🚚</span>
              <h3>Quick Delivery</h3>
              <p>Fast and reliable carryout service</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🍕</span>
              <h3>Fresh Ingredients</h3>
              <p>Made with quality ingredients</p>
            </div>
            <div className="feature">
              <span className="feature-icon">💰</span>
              <h3>Great Prices</h3>
              <p>Affordable and competitive pricing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
