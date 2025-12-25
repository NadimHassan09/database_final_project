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
      
      // Backend returns: { success: true, data: { orders: [...] } }
      // orderService.getCustomerOrders() returns response.data, so:
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
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load order history. Please try again.';
      setError(errorMessage);
      console.error('Error loading orders:', err);
      setOrders([]); // Ensure orders is always an array
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetails = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrderById(id);
      
      // Backend returns: { success: true, data: { order: {...} } }
      // orderService.getOrderById() returns response.data, so:
      // response = { success: true, data: { order: {...} } }
      // response.data = { order: {...} }
      // response.data.order = {...}
      
      // Backend returns: { success: true, data: { order: {...} } }
      // orderService.getOrderById() returns response.data, so:
      // response = { success: true, data: { order: {...} } }
      // response.data = { order: {...} }
      // response.data.order = {...}
      
      let orderData = null;
      
      // Try multiple paths to extract order data
      if (response?.data?.order) {
        orderData = response.data.order;
      } else if (response?.data?.data?.order) {
        orderData = response.data.data.order;
      } else if (response?.order) {
        orderData = response.order;
      } else if (response && response.success !== false && !response.data) {
        orderData = response;
      }
      
      if (!orderData || (typeof orderData === 'object' && orderData.success === false)) {
        throw new Error(response?.data?.message || response?.message || 'Order not found');
      }
      
      // Ensure items is an array and preserve it
      if (!orderData.items) {
        // If items is missing, try to get it from alternative paths
        orderData.items = orderData.sale_items || orderData.order_items || [];
      }
      
      if (!Array.isArray(orderData.items)) {
        // If items is not an array, try to convert it
        if (typeof orderData.items === 'object' && orderData.items !== null) {
          orderData.items = Object.values(orderData.items);
        } else {
          orderData.items = [];
        }
      }
      
      // Create a clean copy to avoid mutation issues
      const cleanOrderData = {
        ...orderData,
        items: Array.isArray(orderData.items) ? [...orderData.items] : []
      };
      
      // Log for debugging (check browser console)
      console.log('=== ORDER DATA DEBUG ===');
      console.log('Full response:', response);
      console.log('Order data before cleanup:', orderData);
      console.log('Clean order data:', cleanOrderData);
      console.log('Shipping address:', cleanOrderData.shipping_address);
      console.log('Items:', cleanOrderData.items);
      console.log('Items count:', cleanOrderData.items?.length);
      console.log('========================');
      
      setSelectedOrder(cleanOrderData);
      // Note: Modal is not used, we show details directly when orderId is present
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load order details. Please try again.';
      setError(errorMessage);
      console.error('Error loading order:', err);
      console.error('Error response:', err.response);
      setSelectedOrder(null);
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
                {selectedOrder.first_name && selectedOrder.last_name && (
                  <p><strong>Customer:</strong> {selectedOrder.first_name} {selectedOrder.last_name}</p>
                )}
              </Col>
              <Col md={6}>
                <p><strong>Shipping Address:</strong></p>
                <p style={{ whiteSpace: 'pre-line' }}>
                  {selectedOrder.shipping_address || selectedOrder.user?.shipping_address || 'No shipping address provided'}
                </p>
              </Col>
            </Row>

            <h5 className="mt-4 mb-3">Order Items</h5>
            {(() => {
              // Try multiple possible paths for items
              const items = selectedOrder.items || 
                           selectedOrder.sale_items || 
                           selectedOrder.order_items || 
                           [];
              const itemsArray = Array.isArray(items) ? items : [];
              
              if (itemsArray.length === 0) {
                return (
                  <Alert variant="warning">
                    No items found for this order.
                  </Alert>
                );
              }
              
              return (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Book Title</th>
                      <th>ISBN</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsArray.map((item, index) => (
                      <tr key={item.sale_item_id || item.book_isbn || index}>
                        <td>{index + 1}</td>
                        <td>{item.book_title || item.title || 'N/A'}</td>
                        <td>{item.book_isbn || item.isbn || 'N/A'}</td>
                        <td>{item.quantity || 0}</td>
                        <td>{formatPrice(item.unit_price || item.price || 0)}</td>
                        <td>{formatPrice((item.unit_price || item.price || 0) * (item.quantity || 0))}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="5" className="text-end"><strong>Total:</strong></td>
                      <td><strong>{formatPrice(selectedOrder.total_amount || 0)}</strong></td>
                    </tr>
                  </tfoot>
                </Table>
              );
            })()}
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

      {!Array.isArray(orders) ? (
        <Alert variant="warning">Invalid orders data received.</Alert>
      ) : orders.length === 0 ? (
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

