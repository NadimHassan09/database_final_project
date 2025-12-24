import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import SearchBar from './SearchBar';

function Navigation() {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (query) => {
    navigate(`/customer/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Book Store
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            
            {isAuthenticated && (
              <>
                {isAdmin ? (
                  <>
                    <Nav.Link as={Link} to="/admin">
                      Admin Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/books">
                      Manage Books
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/orders">
                      Orders
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/reports">
                      Reports
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/customer/books">
                      Browse Books
                    </Nav.Link>
                    <Nav.Link as={Link} to="/customer/search">
                      Search
                    </Nav.Link>
                    <Nav.Link as={Link} to="/customer/cart">
                      Cart {getCartItemCount() > 0 && `(${getCartItemCount()})`}
                    </Nav.Link>
                    <Nav.Link as={Link} to="/customer/orders">
                      Orders
                    </Nav.Link>
                  </>
                )}
              </>
            )}
          </Nav>

          <Nav>
            <div className="me-3 d-flex align-items-center">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            {isAuthenticated ? (
              <NavDropdown title={user?.first_name || user?.username || 'Account'} id="account-dropdown">
                {!isAdmin && (
                  <NavDropdown.Item as={Link} to="/customer/profile">
                    Profile
                  </NavDropdown.Item>
                )}
                {!isAdmin && (
                  <NavDropdown.Item as={Link} to="/customer/orders">
                    Order History
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
