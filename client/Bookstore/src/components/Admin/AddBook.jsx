import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { addBook, getAuthors, getPublishers } from '../../services/bookService';
import { validateRequired, validateISBN, validateQuantity } from '../../utils/validators';
import LoadingSpinner from '../LoadingSpinner';

const AddBook = () => {
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    price: '',
    publication_year: new Date().getFullYear(),
    quantity_in_stock: 0,
    min_threshold: 10,
    publisher_id: '',
    author_ids: [],
  });
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadAuthorsAndPublishers();
  }, []);

  const loadAuthorsAndPublishers = async () => {
    try {
      const [authorsData, publishersData] = await Promise.all([
        getAuthors(),
        getPublishers(),
      ]);
      setAuthors(authorsData.authors || authorsData.data || []);
      setPublishers(publishersData.publishers || publishersData.data || []);
    } catch (err) {
      console.error('Error loading authors/publishers:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAuthorChange = (authorId) => {
    const authorIdNum = parseInt(authorId);
    setFormData(prev => ({
      ...prev,
      author_ids: prev.author_ids.includes(authorIdNum)
        ? prev.author_ids.filter(id => id !== authorIdNum)
        : [...prev.author_ids, authorIdNum],
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!validateISBN(formData.isbn)) {
      newErrors.isbn = 'Please enter a valid ISBN (10 or 13 digits)';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    const quantityValidation = validateQuantity(formData.quantity_in_stock);
    if (!quantityValidation.isValid) {
      newErrors.quantity_in_stock = quantityValidation.message;
    }

    if (!formData.publisher_id) {
      newErrors.publisher_id = 'Publisher is required';
    }

    if (formData.author_ids.length === 0) {
      newErrors.author_ids = 'At least one author is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        publication_year: parseInt(formData.publication_year),
        quantity_in_stock: parseInt(formData.quantity_in_stock),
        min_threshold: parseInt(formData.min_threshold),
        publisher_id: parseInt(formData.publisher_id),
      };

      await addBook(bookData);
      navigate('/admin/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Add New Book</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ISBN *</Form.Label>
                  <Form.Control
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    isInvalid={!!errors.isbn}
                    placeholder="Enter ISBN (10 or 13 digits)"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.isbn}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    isInvalid={!!errors.title}
                    placeholder="Enter book title"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    isInvalid={!!errors.price}
                    placeholder="0.00"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Publication Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="publication_year"
                    value={formData.publication_year}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Publisher *</Form.Label>
                  <Form.Select
                    name="publisher_id"
                    value={formData.publisher_id}
                    onChange={handleChange}
                    isInvalid={!!errors.publisher_id}
                  >
                    <option value="">Select Publisher</option>
                    {publishers.map(publisher => (
                      <option key={publisher.publisher_id} value={publisher.publisher_id}>
                        {publisher.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.publisher_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity in Stock *</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="quantity_in_stock"
                    value={formData.quantity_in_stock}
                    onChange={handleChange}
                    isInvalid={!!errors.quantity_in_stock}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.quantity_in_stock}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Minimum Threshold</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="min_threshold"
                    value={formData.min_threshold}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Auto-order when stock falls below this level
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Authors *</Form.Label>
              <div className="border p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {authors.length === 0 ? (
                  <p className="text-muted">No authors available. Please add authors first.</p>
                ) : (
                  authors.map(author => (
                    <Form.Check
                      key={author.author_id}
                      type="checkbox"
                      id={`author-${author.author_id}`}
                      label={author.name}
                      checked={formData.author_ids.includes(author.author_id)}
                      onChange={() => handleAuthorChange(author.author_id)}
                    />
                  ))
                )}
              </div>
              {errors.author_ids && (
                <div className="text-danger small">{errors.author_ids}</div>
              )}
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Book'}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/admin/books')}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddBook;

