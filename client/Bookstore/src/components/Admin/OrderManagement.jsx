import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getReplenishmentOrders, confirmReplenishmentOrder } from '../../services/orderService';
import { formatDate } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../LoadingSpinner';
import Pagination from '../Common/Pagination';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const itemsPerPage = 20; // Show 20 orders per page
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadOrders();
    
    // Listen for new order events (when auto-orders are created by triggers)
    const handleNewOrder = () => {
      loadOrders();
    };
    
    window.addEventListener('newReplenishmentOrder', handleNewOrder);
    
    return () => {
      window.removeEventListener('newReplenishmentOrder', handleNewOrder);
    };
  }, [currentPage]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReplenishmentOrders({
        page: currentPage,
        limit: itemsPerPage,
      });
      
      // Backend returns: { success: true, data: { orders: [...], total, page, totalPages } }
      // orderService.getReplenishmentOrders() returns response.data, so:
      // response = { success: true, data: { orders: [...], total, page, totalPages } }
      // response.data = { orders: [...], total, page, totalPages }
      // response.data.orders = [...]
      
      let ordersArray = [];
      let totalPagesValue = 1;
      let totalOrdersValue = 0;
      
      if (response && response.data) {
        // Standard backend response structure
        ordersArray = Array.isArray(response.data.orders) ? response.data.orders : [];
        totalPagesValue = response.data.totalPages || Math.ceil((response.data.total || 0) / itemsPerPage) || 1;
        totalOrdersValue = response.data.total || 0;
      } else if (Array.isArray(response.orders)) {
        // Fallback: direct orders array
        ordersArray = response.orders;
        totalPagesValue = response.totalPages || Math.ceil((response.total || 0) / itemsPerPage) || 1;
        totalOrdersValue = response.total || 0;
      } else if (Array.isArray(response)) {
        // Fallback: response is directly an array
        ordersArray = response;
        totalPagesValue = 1;
        totalOrdersValue = response.length;
      }
      
      setOrders(ordersArray);
      setTotalPages(totalPagesValue);
      setTotalOrders(totalOrdersValue);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      console.error('Error loading orders:', err);
      setOrders([]); // Ensure orders is always an array
      setTotalPages(1);
      setTotalOrders(0);
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
        
        // Check for new auto-orders that may have been created by the trigger
        // (when stock was updated, if it's still below threshold, a new order may have been created)
        // Wait a bit for the trigger to complete, then reload orders
        setTimeout(() => {
          loadOrders();
          window.dispatchEvent(new CustomEvent('newReplenishmentOrder'));
        }, 500);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          {totalOrders > 0 && (
            <p className="text-muted mb-0">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalOrders)} of {totalOrders} orders
            </p>
          )}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default OrderManagement;

