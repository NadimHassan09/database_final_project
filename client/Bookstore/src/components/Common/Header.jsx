// Modern Header Component - Top Bar
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import SearchBar from './SearchBar';
import '../../styles/Header.css';

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartItemCount();

  const handleSearch = (query) => {
    if (query && query.trim()) {
      // Navigate to search page with query parameter
      navigate(`/customer/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="modern-header">
      <Container>
        <Row className="align-items-center">
          {/* Logo Section */}
          <Col xs={12} md={3} className="header-logo">
            <Link to="/" className="logo-link">
              <span className="logo-text">BOOKSTORE</span>
            </Link>
          </Col>

          {/* Search Bar Section */}
          <Col xs={12} md={6} className="header-search">
            <div className="search-wrapper">
              <SearchBar onSearch={handleSearch} />
            </div>
          </Col>

          {/* Actions Section */}
          <Col xs={12} md={3} className="header-actions">
            <div className="header-icons">
              {/* Login/Register Buttons or Account Icon */}
              {isAuthenticated ? (
                <>
                  {/* Cart Icon */}
                  {user?.user_type !== 'admin' && (
                    <Link to="/customer/cart" className="header-icon cart-icon" title="Shopping Cart">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      {cartCount > 0 && (
                        <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                      )}
                      <span className="icon-label">Cart</span>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login" className="header-button header-button-login" title="Login">
                    <span>Login</span>
                  </Link>
                  <Link to="/register" className="header-button header-button-register" title="Register">
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
