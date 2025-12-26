import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Table, Button, Badge, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { getBooks, deleteBook } from '../../services/bookService';
import { formatPrice, formatISBN } from '../../utils/formatters';
import { getStockStatus, formatAuthors } from '../../utils/helpers';
import LoadingSpinner from '../LoadingSpinner';
import CustomModal from '../Common/CustomModal';
import Pagination from '../Common/Pagination';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const itemsPerPage = 20; // Show 20 books per page for admin
  const navigate = useNavigate();
  const location = useLocation();

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBooks({
        page: currentPage,
        limit: itemsPerPage,
      });
      
      // Backend returns: { success: true, data: { books: [...], total, page, totalPages } }
      // bookService.getBooks() returns response.data, so:
      // response = { success: true, data: { books: [...], total, page, totalPages } }
      // response.data = { books: [...], total, page, totalPages }
      // response.data.books = [...]
      
      let booksArray = [];
      let totalPagesValue = 1;
      let totalBooksValue = 0;
      
      if (response && response.data) {
        // Standard backend response structure
        booksArray = Array.isArray(response.data.books) ? response.data.books : [];
        totalPagesValue = response.data.totalPages || Math.ceil((response.data.total || 0) / itemsPerPage) || 1;
        totalBooksValue = response.data.total || 0;
      } else if (Array.isArray(response.books)) {
        // Fallback: direct books array
        booksArray = response.books;
        totalPagesValue = response.totalPages || Math.ceil((response.total || 0) / itemsPerPage) || 1;
        totalBooksValue = response.total || 0;
      } else if (Array.isArray(response)) {
        // Fallback: response is directly an array
        booksArray = response;
        totalPagesValue = 1;
        totalBooksValue = response.length;
      }
      
      setBooks(booksArray);
      setTotalPages(totalPagesValue);
      setTotalBooks(totalBooksValue);
    } catch (err) {
      setError('Failed to load books. Please try again.');
      console.error('Error loading books:', err);
      setBooks([]); // Ensure books is always an array
      setTotalPages(1);
      setTotalBooks(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [currentPage]);

  useEffect(() => {
    // Listen for order confirmation events to refresh book list
    const handleOrderConfirmed = () => {
      loadBooks();
    };
    
    // Listen for book added/updated events to refresh book list
    const handleBookAdded = () => {
      // Reset to page 1 when a new book is added
      setCurrentPage(1);
    };
    
    const handleBookUpdated = () => {
      loadBooks();
    };
    
    window.addEventListener('orderConfirmed', handleOrderConfirmed);
    window.addEventListener('bookAdded', handleBookAdded);
    window.addEventListener('bookUpdated', handleBookUpdated);
    
    return () => {
      window.removeEventListener('orderConfirmed', handleOrderConfirmed);
      window.removeEventListener('bookAdded', handleBookAdded);
      window.removeEventListener('bookUpdated', handleBookUpdated);
    };
  }, [currentPage]);

  // Reload books when navigating to this page from a different route (e.g., after adding/editing a book)
  // Use a ref to track if this is the initial mount
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return; // Skip reload on initial mount (already loaded in first useEffect)
    }
    
    // Only reload if we're on the books page and came from a different route
    if (location.pathname === '/admin/books') {
      // Reset to page 1 when navigating back from add/edit
      setCurrentPage(1);
    }
  }, [location.pathname]);

  const handleDelete = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;

    try {
      await deleteBook(bookToDelete.isbn);
      // Reload books to refresh the list and pagination
      await loadBooks();
      setShowDeleteModal(false);
      setBookToDelete(null);
    } catch (err) {
      setError('Failed to delete book. Please try again.');
      console.error('Error deleting book:', err);
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
      <Row className="mb-3">
        <Col>
          <h2>Book Management</h2>
          {totalBooks > 0 && (
            <p className="text-muted mb-0">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalBooks)} of {totalBooks} books
            </p>
          )}
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => navigate('/admin/books/add')}>
            Add New Book
          </Button>
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
            <th>ISBN</th>
            <th>Title</th>
            <th>Authors</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No books found. Add your first book!
              </td>
            </tr>
          ) : (
            books.map((book) => {
              const stockStatus = getStockStatus(book.stock_qty || book.quantity_in_stock, book.min_threshold || book.threshold_qty);
              return (
                <tr key={book.isbn}>
                  <td>{formatISBN(book.isbn)}</td>
                  <td>{book.title}</td>
                  <td>
                    {formatAuthors(book.authors || book.authors_string, 'N/A')}
                  </td>
                  <td>{formatPrice(book.price)}</td>
                  <td>{book.stock_qty || book.quantity_in_stock || 0}</td>
                  <td>
                    <Badge bg={stockStatus.color}>{stockStatus.text}</Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/admin/books/edit/${book.isbn}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(book)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })
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

      <CustomModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setBookToDelete(null);
        }}
        title="Confirm Delete"
        onConfirm={confirmDelete}
        confirmText="Delete"
      >
        <p>
          Are you sure you want to delete the book "{bookToDelete?.title}"?
          This action cannot be undone.
        </p>
      </CustomModal>
    </Container>
  );
};

export default BookManagement;

