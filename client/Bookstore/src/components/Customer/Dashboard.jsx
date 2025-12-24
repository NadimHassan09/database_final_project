import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const cartItemCount = getCartItemCount();

  return (
    <Container className="my-4">
      <h2 className="mb-4">Customer Dashboard</h2>
      <p className="text-muted">Welcome, {user?.first_name || user?.username}!</p>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center h-100" style={{ cursor: 'pointer' }} onClick={() => navigate('/customer/books')}>
            <Card.Body>
              <Card.Title>Browse Books</Card.Title>
              <p className="text-muted">Explore our collection</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100" style={{ cursor: 'pointer' }} onClick={() => navigate('/customer/cart')}>
            <Card.Body>
              <Card.Title>Shopping Cart</Card.Title>
              <p className="text-muted">{cartItemCount} item(s) in cart</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100" style={{ cursor: 'pointer' }} onClick={() => navigate('/customer/orders')}>
            <Card.Body>
              <Card.Title>Order History</Card.Title>
              <p className="text-muted">View past orders</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5>Quick Links</h5>
            </Card.Header>
            <Card.Body>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#/customer/books" className="text-decoration-none">
                    Browse Books
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#/customer/search" className="text-decoration-none">
                    Search Books
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#/customer/cart" className="text-decoration-none">
                    Shopping Cart
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#/customer/orders" className="text-decoration-none">
                    Order History
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#/customer/profile" className="text-decoration-none">
                    My Profile
                  </a>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

