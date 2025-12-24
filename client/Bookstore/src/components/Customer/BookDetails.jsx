import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookByISBN } from '../../services/bookService';
import { formatPrice, formatISBN } from '../../utils/formatters';
import { getStockStatus } from '../../utils/helpers';
import { validateQuantity } from '../../utils/validators';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../LoadingSpinner';

const BookDetails = () => {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantityError, setQuantityError] = useState('');

  const { addToCart } = useCart();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    loadBook();
  }, [isbn]);

  const loadBook = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBookByISBN(isbn);
      setBook(response.book || response.data || response);
    } catch (err) {
      setError('Failed to load book details. Please try again.');
      console.error('Error loading book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value);

    if (book) {
      const validation = validateQuantity(value, book.quantity_in_stock);
      if (!validation.isValid) {
        setQuantityError(validation.message);
      } else {
        setQuantityError('');
      }
    }
  };

  const handleAddToCart = async () => {
    if (quantityError) {
      return;
    }

    const validation = validateQuantity(quantity, book.quantity_in_stock);
    if (!validation.isValid) {
      setQuantityError(validation.message);
      return;
    }

    const result = await addToCart(book, quantity);
    if (result.success) {
      showSuccess(`${quantity} x ${book.title} added to cart!`);
    } else {
      showError(result.error || 'Failed to add to cart');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!book) {
    return (
      <Container className="my-4">
        <Alert variant="warning">Book not found.</Alert>
        <Button onClick={() => navigate('/customer/books')}>Back to Books</Button>
      </Container>
    );
  }

  const stockStatus = getStockStatus(book.quantity_in_stock, book.min_threshold);

  return (
    <Container className="my-4">
      <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row>
        <Col md={4}>
          <Card>
            <Card.Img
              variant="top"
              src={book.image || book.cover_image || 'https://via.placeholder.com/400x600?text=Book'}
              style={{ height: '600px', objectFit: 'cover' }}
            />
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Body>
              <h2>{book.title}</h2>
              <p className="text-muted">
                by {book.authors?.map(a => a.name || a).join(', ') || 'Unknown Author'}
              </p>

              <div className="mb-3">
                <Badge bg={stockStatus.color} className="me-2">{stockStatus.text}</Badge>
                <span className="text-muted">ISBN: {formatISBN(book.isbn)}</span>
              </div>

              <div className="mb-3">
                <h3>{formatPrice(book.price)}</h3>
              </div>

              <div className="mb-3">
                <p><strong>Publication Year:</strong> {book.publication_year || 'N/A'}</p>
                <p><strong>Publisher:</strong> {book.publisher?.name || book.publisher_name || 'N/A'}</p>
                <p><strong>Stock Available:</strong> {book.quantity_in_stock || 0} units</p>
              </div>

              {stockStatus.available && (
                <div className="mb-3">
                  <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max={book.quantity_in_stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      isInvalid={!!quantityError}
                    />
                    {quantityError && (
                      <Form.Control.Feedback type="invalid">
                        {quantityError}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </div>
              )}

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!stockStatus.available || !!quantityError}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate('/customer/cart')}
                >
                  View Cart
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookDetails;

