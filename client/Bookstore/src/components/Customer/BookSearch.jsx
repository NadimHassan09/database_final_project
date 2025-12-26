import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchBooks } from '../../services/bookService';
import { formatPrice } from '../../utils/formatters';
import { getStockStatus, formatAuthors } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
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
  const { isAdmin } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const query = searchParams.get('q');
    if (query && query.trim()) {
      handleSearch(query);
    } else {
      setHasSearched(false);
      setBooks([]);
      setError(null);
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
      
      // Backend returns: { success: true, data: { books: [...] } }
      // After axios, response.data is: { success: true, data: { books: [...] } }
      let booksArray = [];
      
      if (response && response.data) {
        // Standard backend response structure
        booksArray = Array.isArray(response.data.books) ? response.data.books : [];
      } else if (Array.isArray(response.books)) {
        // Fallback: direct books array
        booksArray = response.books;
      } else if (Array.isArray(response)) {
        // Fallback: response is directly an array
        booksArray = response;
      }
      
      setBooks(booksArray);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to search books. Please try again.';
      setError(errorMessage);
      setBooks([]); // Ensure books is always an array
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

  const currentQuery = searchParams.get('q') || '';

  return (
    <Container className="my-4">
      <h2 className="mb-4">Search Books</h2>

      <Row className="mb-4">
        <Col md={8} className="mx-auto">
          <SearchBar onSearch={handleSearch} />
        </Col>
      </Row>

      {currentQuery && (
        <Alert variant="light" className="mb-3">
          <strong>Search results for:</strong> "{currentQuery}"
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : hasSearched ? (
        <>
          {books.length === 0 ? (
            <Alert variant="info">
              <strong>No books found</strong>
              <br />
              No books match your search criteria. Try different keywords or browse all books.
              <div className="mt-3">
                <Button variant="primary" onClick={() => navigate('/customer/books')}>
                  Browse All Books
                </Button>
              </div>
            </Alert>
          ) : (
            <>
              <Alert variant="success" className="mb-3">
                Found {books.length} book{books.length !== 1 ? 's' : ''} matching your search
              </Alert>
              <Row>
                {books.map((book) => {
                  const stockStatus = getStockStatus(book.quantity_in_stock, book.min_threshold);
                  return (
                    <Col key={book.isbn} md={4} lg={3} className="mb-4">
                      <Card className="h-100">
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="h6 mb-2">{book.title}</Card.Title>
                          <Card.Text className="text-muted small mb-3">
                            {formatAuthors(book.authors || book.authors_string)}
                          </Card.Text>
                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <strong>{formatPrice(book.price)}</strong>
                              <Badge bg={stockStatus.color}>{stockStatus.text}</Badge>
                            </div>
                            <div className="d-grid gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => navigate(`/customer/books/${encodeURIComponent(book.isbn)}`)}
                              >
                                View Details
                              </Button>
                              {!isAdmin && (
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleAddToCart(book)}
                                  disabled={!stockStatus.available}
                                >
                                  Add to Cart
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </>
          )}
        </>
      ) : (
        <Alert variant="info">Enter a search term to find books by title, author, or ISBN.</Alert>
      )}
    </Container>
  );
};

export default BookSearch;

