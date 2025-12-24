import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomerOrders, getOrderById } from '../../services/orderService';
import { formatPrice, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../LoadingSpinner';
import CustomModal from '../Common/CustomModal';

const OrderHistory = () => {
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (orderId) {
      loadOrderDetails(orderId);
    } else {
      loadOrders();
    }
  }, [orderId]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCustomerOrders();
      setOrders(response.orders || response.data || []);
    } catch (err) {
      setError('Failed to load order history. Please try again.');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetails = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrderById(id);
      setSelectedOrder(response.order || response.data || response);
      setShowModal(true);
    } catch (err) {
      setError('Failed to load order details. Please try again.');
      console.error('Error loading order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/customer/orders/${id}`);
  };

  if (loading && !selectedOrder) {
    return <LoadingSpinner />;
  }

  if (orderId && selectedOrder) {
    return (
      <Container className="my-4">
        <Button variant="outline-secondary" className="mb-3" onClick={() => navigate('/customer/orders')}>
          ← Back to Orders
        </Button>

        <Card>
          <Card.Header>
            <h4>Order Details - #{selectedOrder.sale_id || selectedOrder.order_id}</h4>
          </Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <p><strong>Order Date:</strong> {formatDate(selectedOrder.sale_date || selectedOrder.order_date)}</p>
                <p><strong>Total Amount:</strong> {formatPrice(selectedOrder.total_amount)}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.payment_method || 'Credit Card'}</p>
              </Col>
              <Col md={6}>
                <p><strong>Shipping Address:</strong></p>
                <p>{selectedOrder.shipping_address || 'N/A'}</p>
              </Col>
            </Row>

            <h5>Order Items</h5>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>ISBN</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(selectedOrder.items || selectedOrder.sale_items || []).map((item, index) => (
                  <tr key={item.sale_item_id || index}>
                    <td>{item.book_title || item.title || 'N/A'}</td>
                    <td>{item.book_isbn || item.isbn}</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.unit_price || item.price)}</td>
                    <td>{formatPrice((item.unit_price || item.price) * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Order History</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Alert variant="info">You have no orders yet.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.sale_id || order.order_id}>
                <td>#{order.sale_id || order.order_id}</td>
                <td>{formatDate(order.sale_date || order.order_date)}</td>
                <td>{formatPrice(order.total_amount)}</td>
                <td>{order.payment_method || 'Credit Card'}</td>
                <td>
                  <Badge bg="success">Completed</Badge>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleViewDetails(order.sale_id || order.order_id)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrderHistory;

