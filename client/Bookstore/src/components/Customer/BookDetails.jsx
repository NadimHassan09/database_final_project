import { useState, useEffect } from 'react';
import { Container, Card, Button, Badge, Alert, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookByISBN } from '../../services/bookService';
import { formatPrice, formatISBN } from '../../utils/formatters';
import { getStockStatus, formatAuthors } from '../../utils/helpers';
import { validateQuantity } from '../../utils/validators';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { createReplenishmentOrder } from '../../services/orderService';
import LoadingSpinner from '../LoadingSpinner';

const BookDetails = () => {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantityError, setQuantityError] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(20); // Default replenishment quantity
  const [creatingOrder, setCreatingOrder] = useState(false);

  const { addToCart } = useCart();
  const { isAdmin, user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    loadBook();
    
    // Listen for order confirmation events to refresh book data
    const handleOrderConfirmed = (event) => {
      // Only refresh if this is the book that was restocked
      if (event.detail?.bookISBN === book?.isbn) {
        loadBook();
      }
    };
    
    window.addEventListener('orderConfirmed', handleOrderConfirmed);
    
    return () => {
      window.removeEventListener('orderConfirmed', handleOrderConfirmed);
    };
  }, [isbn, book?.isbn]);

  const loadBook = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Decode ISBN in case it's URL encoded
      const decodedISBN = decodeURIComponent(isbn);
      
      const response = await getBookByISBN(decodedISBN);
      
      // Backend returns: { success: true, data: { book: {...} } }
      // bookService.getBookByISBN() returns response.data, so:
      // response = { success: true, data: { book: {...} } }
      // response.data = { book: {...} }
      // response.data.book = {...}
      
      let bookData = null;
      
      if (response && response.data && response.data.book) {
        bookData = response.data.book;
      } else if (response && response.book) {
        bookData = response.book;
      } else if (response && response.success !== false && !response.data) {
        // Response might be the book itself
        bookData = response;
      }
      
      if (!bookData || (typeof bookData === 'object' && bookData.success === false)) {
        throw new Error(response?.data?.message || response?.message || 'Book not found');
      }
      
      // Ensure book has required properties
      if (!bookData.isbn || !bookData.title) {
        console.warn('Book data missing required fields:', bookData);
        throw new Error('Invalid book data received');
      }
      
      setBook(bookData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load book details. Please try again.';
      setError(errorMessage);
      console.error('Error loading book:', err);
      console.error('ISBN used:', isbn);
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value);

    if (book) {
      const stockQty = book.stock_qty !== undefined ? book.stock_qty : (book.quantity_in_stock !== undefined ? book.quantity_in_stock : 0);
      const validation = validateQuantity(value, stockQty);
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

    const stockQty = book.stock_qty !== undefined ? book.stock_qty : (book.quantity_in_stock !== undefined ? book.quantity_in_stock : 0);
    const validation = validateQuantity(quantity, stockQty);
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

  const handleCreateReplenishmentOrder = async () => {
    if (!book || !book.publisher_id) {
      showError('Book publisher information is missing');
      return;
    }

    if (orderQuantity <= 0) {
      showError('Order quantity must be greater than 0');
      return;
    }

    setCreatingOrder(true);
    try {
      const orderData = {
        isbn: book.isbn,
        book_isbn: book.isbn,
        publisher_id: book.publisher_id,
        admin_id: user?.user_id || 1, // Use logged-in admin ID
        quantity_ordered: orderQuantity,
        status: 'Pending'
      };

      const response = await createReplenishmentOrder(orderData);
      
      if (response.success) {
        showSuccess(`Replenishment order created successfully for ${orderQuantity} copies of ${book.title}`);
        // Optionally navigate to orders page
        setTimeout(() => {
          navigate('/admin/orders');
        }, 1500);
      } else {
        showError(response.message || 'Failed to create replenishment order');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create replenishment order';
      showError(errorMessage);
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !book) {
    return (
      <Container className="my-4">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => navigate('/customer/books')} className="mt-3">
          Back to Books
        </Button>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container className="my-4">
        <Alert variant="warning">Book not found.</Alert>
        <Button onClick={() => navigate('/customer/books')} className="mt-3">
          Back to Books
        </Button>
      </Container>
    );
  }

  const stockQty = book.stock_qty !== undefined ? book.stock_qty : (book.quantity_in_stock !== undefined ? book.quantity_in_stock : 0);
  const stockStatus = getStockStatus(stockQty, book.min_threshold);

  return (
    <Container className="my-4 d-flex justify-content-center">
      <div style={{ width: '60%', minHeight: '100vh' }}>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card style={{ minHeight: '100vh' }}>
            <Card.Body>
              <h2>{book.title}</h2>
              <p className="text-muted">
                by {formatAuthors(book.authors || book.authors_string)}
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
                <p><strong>Stock Available:</strong> {book.stock_qty !== undefined ? book.stock_qty : (book.quantity_in_stock !== undefined ? book.quantity_in_stock : 0)} units</p>
                {book.min_threshold !== undefined && (
                  <p><strong>Minimum Threshold:</strong> {book.min_threshold} units</p>
                )}
                {isAdmin && book.publisher_id && (
                  <p className="text-muted"><small>Publisher ID: {book.publisher_id}</small></p>
                )}
              </div>

              {isAdmin ? (
                // Admin view: Replenishment Order
                <>
                  <div className="mb-3">
                    <Form.Group>
                      <Form.Label>Order Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                      />
                      <Form.Text className="text-muted">
                        Number of copies to order from the publisher
                      </Form.Text>
                    </Form.Group>
                  </div>
                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleCreateReplenishmentOrder}
                      disabled={creatingOrder || orderQuantity <= 0}
                    >
                      {creatingOrder ? 'Creating Order...' : 'Create Replenishment Order'}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate('/admin/orders')}
                    >
                      View Replenishment Orders
                    </Button>
                  </div>
                </>
              ) : !isAdmin ? (
                // Customer view: Add to Cart (only show if not admin)
                <>
                  {stockStatus.available && (
                    <div className="mb-3">
                      <Form.Group>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          max={book.quantity_in_stock || book.stock_qty}
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
                </>
              ) : null}
            </Card.Body>
          </Card>
        </div>
    </Container>
  );
};

export default BookDetails;

