// Modern Navbar Component - Main Navigation
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import '../../styles/Navbar.css';

function Navigation() {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="modern-navbar">
      <Container>
        <Navbar expand="lg" className="modern-navbar-inner">
          <Navbar.Toggle aria-controls="modern-navbar-nav" className="navbar-toggle" />
          <Navbar.Collapse id="modern-navbar-nav">
            <Nav className="modern-nav-menu">
              <Nav.Link 
                as={Link} 
                to="/" 
                className={`modern-nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Nav.Link>
              
              {isAuthenticated && (
                <>
                  {isAdmin ? (
                    <>
                      <Nav.Link 
                        as={Link} 
                        to="/admin" 
                        className={`modern-nav-link ${isActive('/admin') ? 'active' : ''}`}
                      >
                        Dashboard
                      </Nav.Link>
                      <Nav.Link 
                        as={Link} 
                        to="/admin/books" 
                        className={`modern-nav-link ${isActive('/admin/books') ? 'active' : ''}`}
                      >
                        Books
                      </Nav.Link>
                      <Nav.Link 
                        as={Link} 
                        to="/admin/orders" 
                        className={`modern-nav-link ${isActive('/admin/orders') ? 'active' : ''}`}
                      >
                        Orders
                      </Nav.Link>
                      <Nav.Link 
                        as={Link} 
                        to="/admin/reports" 
                        className={`modern-nav-link ${isActive('/admin/reports') ? 'active' : ''}`}
                      >
                        Reports
                      </Nav.Link>
                    </>
                  ) : (
                    <>
                      <Nav.Link 
                        as={Link} 
                        to="/customer/books" 
                        className={`modern-nav-link ${isActive('/customer/books') ? 'active' : ''}`}
                      >
                        Browse
                      </Nav.Link>
                      <Nav.Link 
                        as={Link} 
                        to="/customer/search" 
                        className={`modern-nav-link ${isActive('/customer/search') ? 'active' : ''}`}
                      >
                        Search
                      </Nav.Link>
                      <Nav.Link 
                        as={Link} 
                        to="/customer/orders" 
                        className={`modern-nav-link ${isActive('/customer/orders') ? 'active' : ''}`}
                      >
                        My Orders
                      </Nav.Link>
                    </>
                  )}
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Nav.Link 
                    as={Link} 
                    to="/customer/books" 
                    className={`modern-nav-link ${isActive('/customer/books') ? 'active' : ''}`}
                  >
                    Browse Books
                  </Nav.Link>
                </>
              )}
            </Nav>

            <Nav className="modern-nav-account">
              {isAuthenticated && (
                <NavDropdown 
                  title={
                    <span className="account-dropdown-trigger">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>{user?.first_name || user?.username || 'Account'}</span>
                    </span>
                  } 
                  id="account-dropdown"
                  className="modern-dropdown"
                >
                  {!isAdmin && (
                    <>
                      <NavDropdown.Item as={Link} to="/customer/profile" className="modern-dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Profile
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/customer/orders" className="modern-dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                        Order History
                      </NavDropdown.Item>
                      <NavDropdown.Divider className="modern-dropdown-divider" />
                    </>
                  )}
                  <NavDropdown.Item onClick={handleLogout} className="modern-dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
          </Nav>
        </Navbar.Collapse>
        </Navbar>
      </Container>
    </nav>
  );
}

export default Navigation;
