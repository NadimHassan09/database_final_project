// HeroHeader.jsx
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import '../../styles/HeroHeader.css';

const HeroHeader = () => {
  return (
    <header className="hero-header text-light d-flex align-items-center">
      <Container>
        <Row className="align-items-center">
          {/* Book Image with Animation */}
          <Col md={6} className="text-center img-container">
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
              alt="Book"
              className="book-img animate-book"
            />
          </Col>

          {/* Heading and CTA */}
          <Col md={6}>
            <h1 className="h1 display-4 fw-bold">Discover Your Next Favorite Book!</h1>
            <p className="p lead my-3">
              Explore thousands of books online, from classics to the latest releases.
            </p>
            <Button className="hero-btn" variant="primary" size="lg">
              Buy Now
            </Button>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default HeroHeader;
