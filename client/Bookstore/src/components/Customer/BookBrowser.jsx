import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getBooks } from '../../services/bookService';
import { formatPrice } from '../../utils/formatters';
import { getStockStatus } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../LoadingSpinner';
import Pagination from '../Common/Pagination';

const BookBrowser = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  const { addToCart } = useCart();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    loadBooks();
  }, [currentPage]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBooks({
        page: currentPage,
        limit: itemsPerPage,
      });
      setBooks(response.books || response.data || []);
      setTotalPages(response.totalPages || Math.ceil((response.total || 0) / itemsPerPage) || 1);
    } catch (err) {
      setError('Failed to load books. Please try again.');
      console.error('Error loading books:', err);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Browse Books</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {books.length === 0 ? (
        <Alert variant="info">No books available at the moment.</Alert>
      ) : (
        <>
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

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default BookBrowser;

