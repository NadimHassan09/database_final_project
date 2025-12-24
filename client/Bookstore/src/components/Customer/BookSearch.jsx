import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchBooks } from '../../services/bookService';
import { formatPrice } from '../../utils/formatters';
import { getStockStatus } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import SearchBar from '../Common/SearchBar';
import LoadingSpinner from '../LoadingSpinner';

const BookSearch = () => {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const { addToCart } = useCart();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      handleSearch(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      const response = await searchBooks(query);
      setBooks(response.books || response.data || []);
    } catch (err) {
      setError('Failed to search books. Please try again.');
      console.error('Error searching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (book) => {
    const result = await addToCart(book, 1);
    if (result.success) {
      showSuccess(`${book.title} added to cart!`);
    } else {
      showError(result.error || 'Failed to add to cart');
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Search Books</h2>

      <Row className="mb-4">
        <Col md={8} className="mx-auto">
          <SearchBar onSearch={handleSearch} />
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : hasSearched ? (
        books.length === 0 ? (
          <Alert variant="info">No books found matching your search.</Alert>
        ) : (
          <Row>
            {books.map((book) => {
              const stockStatus = getStockStatus(book.quantity_in_stock, book.min_threshold);
              return (
                <Col key={book.isbn} md={4} lg={3} className="mb-4">
                  <Card className="h-100">
                    <Card.Img
                      variant="top"
                      src={book.image || book.cover_image || 'https://via.placeholder.com/200x300?text=Book'}
                      style={{ height: '300px', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => navigate(`/customer/books/${book.isbn}`)}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h6">{book.title}</Card.Title>
                      <Card.Text className="text-muted small">
                        {book.authors?.map(a => a.name || a).join(', ') || 'Unknown Author'}
                      </Card.Text>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong>{formatPrice(book.price)}</strong>
                          <Badge bg={stockStatus.color}>{stockStatus.text}</Badge>
                        </div>
                        <div className="d-grid gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/customer/books/${book.isbn}`)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleAddToCart(book)}
                            disabled={!stockStatus.available}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )
      ) : (
        <Alert variant="info">Enter a search term to find books.</Alert>
      )}
    </Container>
  );
};

export default BookSearch;

