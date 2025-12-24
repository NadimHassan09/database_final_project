import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getBooks, deleteBook } from '../../services/bookService';
import { formatPrice, formatISBN } from '../../utils/formatters';
import { getStockStatus } from '../../utils/helpers';
import LoadingSpinner from '../LoadingSpinner';
import CustomModal from '../Common/CustomModal';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBooks();
      setBooks(response.books || response.data || []);
    } catch (err) {
      setError('Failed to load books. Please try again.');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;

    try {
      await deleteBook(bookToDelete.isbn);
      setBooks(books.filter(b => b.isbn !== bookToDelete.isbn));
      setShowDeleteModal(false);
      setBookToDelete(null);
    } catch (err) {
      setError('Failed to delete book. Please try again.');
      console.error('Error deleting book:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className="my-4">
      <Row className="mb-3">
        <Col>
          <h2>Book Management</h2>
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
              const stockStatus = getStockStatus(book.quantity_in_stock, book.min_threshold);
              return (
                <tr key={book.isbn}>
                  <td>{formatISBN(book.isbn)}</td>
                  <td>{book.title}</td>
                  <td>
                    {book.authors?.map(a => a.name || a).join(', ') || 'N/A'}
                  </td>
                  <td>{formatPrice(book.price)}</td>
                  <td>{book.quantity_in_stock || 0}</td>
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

