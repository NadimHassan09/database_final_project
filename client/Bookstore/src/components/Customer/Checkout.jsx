import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { checkout } from '../../services/orderService';
import { formatPrice } from '../../utils/formatters';
import { validateCreditCard, validateRequired } from '../../utils/validators';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../LoadingSpinner';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    shippingAddress: user?.shipping_address || '',
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!validateCreditCard(formData.cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid credit card number';
    }

    const cardHolderValidation = validateRequired(formData.cardHolder, 'Card holder name');
    if (!cardHolderValidation.isValid) {
      newErrors.cardHolder = cardHolderValidation.message;
    }

    if (!formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiryDate = 'Please enter expiry date in MM/YY format';
    }

    if (!formData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    const addressValidation = validateRequired(formData.shippingAddress, 'Shipping address');
    if (!addressValidation.isValid) {
      newErrors.shippingAddress = addressValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (cartItems.length === 0) {
      showError('Your cart is empty');
      return;
    }

    setProcessing(true);

    try {
      const checkoutData = {
        payment_method: 'credit_card',
        card_number: formData.cardNumber.replace(/\s/g, ''),
        card_holder: formData.cardHolder,
        expiry_date: formData.expiryDate,
        cvv: formData.cvv,
        shipping_address: formData.shippingAddress,
      };

      const response = await checkout(checkoutData);
      await clearCart();
      showSuccess('Order placed successfully!');
      navigate(`/customer/orders/${response.order_id || response.orderId}`);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to process checkout. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="my-4">
        <Alert variant="warning">Your cart is empty.</Alert>
        <Button onClick={() => navigate('/customer/books')}>Browse Books</Button>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Checkout</h2>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Payment Information</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Card Number *</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    isInvalid={!!errors.cardNumber}
                    maxLength={19}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cardNumber}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Card Holder Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardHolder"
                    value={formData.cardHolder}
                    onChange={handleChange}
                    placeholder="John Doe"
                    isInvalid={!!errors.cardHolder}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cardHolder}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Date (MM/YY) *</Form.Label>
                      <Form.Control
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="12/25"
                        isInvalid={!!errors.expiryDate}
                        maxLength={5}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.expiryDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>CVV *</Form.Label>
                      <Form.Control
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        isInvalid={!!errors.cvv}
                        maxLength={4}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cvv}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Shipping Address *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    isInvalid={!!errors.shippingAddress}
                    placeholder="Enter your shipping address"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.shippingAddress}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="w-100"
                  disabled={processing}
                >
                  {processing ? 'Processing...' : 'Place Order'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <Table>
                <tbody>
                  {cartItems.map((item) => {
                    const price = item.price || item.unit_price || 0;
                    const subtotal = price * (item.quantity || 0);
                    return (
                      <tr key={item.cart_item_id || item.id}>
                        <td>
                          {item.title} x {item.quantity}
                        </td>
                        <td className="text-end">{formatPrice(subtotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td><strong>Total:</strong></td>
                    <td className="text-end"><strong>{formatPrice(getCartTotal())}</strong></td>
                  </tr>
                </tfoot>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;

