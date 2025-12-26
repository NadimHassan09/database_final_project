import { Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for dashboard stats
  const stats = {
    totalBooks: 1250,
    totalOrders: 342,
    totalSales: 45678.90,
    pendingOrders: 12,
  };

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      <p className="text-muted">Welcome back, {user?.first_name || user?.username}!</p>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Books</Card.Title>
              <h3>{stats.totalBooks}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Orders</Card.Title>
              <h3>{stats.totalOrders}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Sales</Card.Title>
              <h3>{formatPrice(stats.totalSales)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Pending Orders</Card.Title>
              <h3 className="text-warning">{stats.pendingOrders}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

