// HeroHeader.jsx - Modern Hero Section for Home Page
import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import '../../styles/HeroHeader.css';

const HeroHeader = () => {
  const navigate = useNavigate();

  return (
    <section className="modern-hero">
      {/* Background Image */}
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>

      {/* Hero Content */}
      <Container className="hero-content-container">
        <div className="hero-content">
          <h1 className="hero-heading">
            Discover Your Next
            <span className="hero-heading-accent"> Favorite Book</span>
          </h1>
          <p className="hero-description">
            Explore thousands of books online, from timeless classics to the latest releases. 
            Your perfect read is just a click away.
          </p>
          <div className="hero-buttons">
            <button 
              className="hero-btn-primary"
              onClick={() => navigate('/customer/books')}
            >
              Browse Books
            </button>
            <button 
              className="hero-btn-secondary"
              onClick={() => navigate('/customer/search')}
            >
              Search Library
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroHeader;
