import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getReplenishmentOrders, confirmReplenishmentOrder } from '../../services/orderService';
import { formatDate } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../LoadingSpinner';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReplenishmentOrders();
      
      // Backend returns: { success: true, data: { orders: [...] } }
      // orderService.getReplenishmentOrders() returns response.data, so:
      // response = { success: true, data: { orders: [...] } }
      // response.data = { orders: [...] }
      // response.data.orders = [...]
      
      let ordersArray = [];
      
      if (response && response.data) {
        // Standard backend response structure
        ordersArray = Array.isArray(response.data.orders) ? response.data.orders : [];
      } else if (Array.isArray(response.orders)) {
        // Fallback: direct orders array
        ordersArray = response.orders;
      } else if (Array.isArray(response)) {
        // Fallback: response is directly an array
        ordersArray = response;
      }
      
      setOrders(ordersArray);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      console.error('Error loading orders:', err);
      setOrders([]); // Ensure orders is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to confirm this order? The book stock will be updated automatically.')) {
      return;
    }

    setConfirmingOrderId(orderId);
    try {
      const response = await confirmReplenishmentOrder(orderId);
      
      if (response.success) {
        showSuccess(`Order confirmed successfully! Book stock has been updated by ${response.data?.order?.quantity_ordered || 'the ordered quantity'} units.`);
        // Reload orders to reflect the updated status
        await loadOrders();
        
        // Trigger a custom event to notify other components (like BookManagement) to refresh
        window.dispatchEvent(new CustomEvent('orderConfirmed', { 
          detail: { 
            orderId, 
            bookISBN: response.data?.order?.book_isbn,
            quantity: response.data?.order?.quantity_ordered 
          } 
        }));
      } else {
        showError(response.message || 'Failed to confirm order');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to confirm order. Please try again.';
      showError(errorMessage);
      console.error('Error confirming order:', err);
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'danger',
    };
    const statusText = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'Unknown';
    return <Badge bg={variants[status?.toLowerCase()] || 'secondary'}>{statusText}</Badge>;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className="my-4">
      <Row className="mb-3">
        <Col>
          <h2>Replenishment Orders</h2>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Book ISBN</th>
            <th>Book Title</th>
            <th>Publisher</th>
            <th>Quantity</th>
            <th>Order Date</th>
            <th>Expected Delivery</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.book_isbn}</td>
                <td>{order.book_title || 'N/A'}</td>
                <td>{order.publisher_name || 'N/A'}</td>
                <td>{order.quantity_ordered}</td>
                <td>{formatDate(order.order_date)}</td>
                <td>{formatDate(order.expected_delivery_date)}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>
                  {order.status?.toLowerCase() === 'pending' ? (
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleConfirmOrder(order.order_id)}
                      disabled={confirmingOrderId === order.order_id}
                    >
                      {confirmingOrderId === order.order_id ? 'Confirming...' : 'Confirm'}
                    </Button>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default OrderManagement;

