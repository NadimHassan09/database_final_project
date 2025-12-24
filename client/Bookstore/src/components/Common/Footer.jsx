// Modern Footer Component
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../../styles/Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Newsletter subscription logic would go here
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <footer className="modern-footer">
      <Container>
        {/* Main Footer Content */}
        <Row className="footer-main">
          {/* Brand Section */}
          <Col xs={12} md={3} className="footer-section">
            <div className="footer-brand">
              <h3 className="footer-brand-title">BOOKSTORE</h3>
              <p className="footer-brand-description">
                Your trusted online bookstore for discovering and purchasing your favorite books.
                We are Alexandria University Faculty of Engineering students working on a final project
                for our Database course.
              </p>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={12} md={2} className="footer-section">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/customer/books">Browse Books</Link></li>
              <li><Link to="/customer/search">Search</Link></li>
              <li><Link to="/customer/orders">My Orders</Link></li>
              <li><Link to="/customer/profile">My Profile</Link></li>
            </ul>
          </Col>

          {/* Help & Support */}
          <Col xs={12} md={2} className="footer-section">
            <h5 className="footer-title">Help & Support</h5>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col xs={12} md={2} className="footer-section">
            <h5 className="footer-title">Contact</h5>
            <ul className="footer-contact">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>info@bookstore.com</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>+20 1501701022</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Alexandria, Egypt</span>
              </li>
            </ul>
          </Col>

          {/* Newsletter Section */}
          <Col xs={12} md={3} className="footer-section">
            <h5 className="footer-title">Newsletter</h5>
            <p className="footer-newsletter-text">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <Form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
              <div className="newsletter-input-group">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <Button type="submit" className="newsletter-button">
                  Subscribe
                </Button>
              </div>
            </Form>
          </Col>
        </Row>

        {/* Social Media & Payment */}
        <Row className="footer-bottom">
          <Col xs={12} md={6} className="footer-social">
            <h6 className="footer-social-title">Follow Us</h6>
            <div className="social-icons">
              <a href="#" className="social-icon" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </Col>

          <Col xs={12} md={6} className="footer-copyright">
            <p>&copy; {new Date().getFullYear()} Nadeem's Team. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
