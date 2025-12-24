import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getReplenishmentOrderById, confirmReplenishmentOrder } from '../../services/orderService';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../LoadingSpinner';
import CustomModal from '../Common/CustomModal';

const ConfirmOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReplenishmentOrderById(orderId);
      setOrder(response.order || response.data || response);
    } catch (err) {
      setError('Failed to load order. Please try again.');
      console.error('Error loading order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setConfirming(true);
      setError(null);
      await confirmReplenishmentOrder(orderId);
      setShowConfirmModal(false);
      navigate('/admin/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm order. Please try again.');
      setConfirming(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return (
      <Container className="my-4">
        <Alert variant="warning">Order not found.</Alert>
        <Button onClick={() => navigate('/admin/orders')}>Back to Orders</Button>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Confirm Replenishment Order</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Header>
          <h5>Order Details</h5>
        </Card.Header>
        <Card.Body>
          <Table>
            <tbody>
              <tr>
                <td><strong>Order ID:</strong></td>
                <td>{order.order_id}</td>
              </tr>
              <tr>
                <td><strong>Book ISBN:</strong></td>
                <td>{order.book_isbn}</td>
              </tr>
              <tr>
                <td><strong>Book Title:</strong></td>
                <td>{order.book_title || 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Publisher:</strong></td>
                <td>{order.publisher_name || 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Quantity Ordered:</strong></td>
                <td>{order.quantity_ordered}</td>
              </tr>
              <tr>
                <td><strong>Order Date:</strong></td>
                <td>{formatDate(order.order_date)}</td>
              </tr>
              <tr>
                <td><strong>Expected Delivery:</strong></td>
                <td>{formatDate(order.expected_delivery_date)}</td>
              </tr>
              <tr>
                <td><strong>Status:</strong></td>
                <td>{order.status}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {order.status === 'pending' && (
        <div className="d-flex gap-2">
          <Button
            variant="success"
            onClick={() => setShowConfirmModal(true)}
            disabled={confirming}
          >
            Confirm Order Received
          </Button>
          <Button variant="secondary" onClick={() => navigate('/admin/orders')}>
            Cancel
          </Button>
        </div>
      )}

      {order.status === 'confirmed' && (
        <Alert variant="info">
          This order has already been confirmed.
        </Alert>
      )}

      <CustomModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Order"
        onConfirm={handleConfirm}
        confirmText={confirming ? 'Confirming...' : 'Confirm'}
      >
        <p>
          Are you sure you want to confirm this order? This will add {order.quantity_ordered} units
          to the book's stock.
        </p>
      </CustomModal>
    </Container>
  );
};

export default ConfirmOrder;

