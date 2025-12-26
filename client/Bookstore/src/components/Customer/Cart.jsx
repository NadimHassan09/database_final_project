import { Container, Row, Col, Card, Table, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { validateQuantity } from '../../utils/validators';
import { formatAuthors } from '../../utils/helpers';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../LoadingSpinner';

const Cart = () => {
  const {
    cartItems,
    loading,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useCart();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, newQuantity) => {
    const item = cartItems.find(i => i.cart_item_id === itemId || i.id === itemId);
    if (!item) return;

    const validation = validateQuantity(newQuantity, item.max_stock || item.quantity_in_stock);
    if (!validation.isValid) {
      showError(validation.message);
      return;
    }

    const result = await updateItemQuantity(itemId, newQuantity);
    if (result.success) {
      showSuccess('Cart updated');
    } else {
      showError(result.error || 'Failed to update cart');
    }
  };

  const handleRemove = async (itemId) => {
    const result = await removeFromCart(itemId);
    if (result.success) {
      showSuccess('Item removed from cart');
    } else {
      showError(result.error || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      const result = await clearCart();
      if (result.success) {
        showSuccess('Cart cleared');
      } else {
        showError(result.error || 'Failed to clear cart');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (cartItems.length === 0) {
    return (
      <Container className="my-4">
        <Alert variant="info">
          Your cart is empty. <Button variant="link" onClick={() => navigate('/customer/books')}>Browse Books</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Shopping Cart</h2>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>Cart Items</h5>
              <Button variant="outline-danger" size="sm" onClick={handleClearCart}>
                Clear Cart
              </Button>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const itemId = item.cart_item_id || item.id;
                    const price = item.price || item.unit_price || 0;
                    const subtotal = price * (item.quantity || 0);

                    return (
                      <tr key={itemId}>
                        <td>
                          <div>
                            <strong>{item.title}</strong>
                            <br />
                            <small className="text-muted">
                              {formatAuthors(item.authors || item.authors_string)}
                            </small>
                          </div>
                        </td>
                        <td>{formatPrice(price)}</td>
                        <td>
                          <Form.Control
                            type="number"
                            min="1"
                            max={item.max_stock || item.quantity_in_stock || 999}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(itemId, parseInt(e.target.value))}
                            style={{ width: '80px' }}
                          />
                        </td>
                        <td>{formatPrice(subtotal)}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemove(itemId)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal:</span>
                <strong>{formatPrice(getCartTotal())}</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Tax:</span>
                <strong>{formatPrice(0)}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <span><strong>Total:</strong></span>
                <strong>{formatPrice(getCartTotal())}</strong>
              </div>
              <Button
                variant="primary"
                className="w-100"
                size="lg"
                onClick={() => navigate('/customer/checkout')}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline-secondary"
                className="w-100 mt-2"
                onClick={() => navigate('/customer/books')}
              >
                Continue Shopping
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;

