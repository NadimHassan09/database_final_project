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
    category: '',
    quantity_in_stock: 0,
    min_threshold: 10,
    publisher_id: '',
    authors: [], // Array of author names (strings)
  });
  
  const VALID_CATEGORIES = ['Science', 'Art', 'Religion', 'History', 'Geography'];
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
      
      // Backend returns: { success: true, data: { authors: [...] } }
      // Service returns response.data, so: { success: true, data: { authors: [...] } }
      // response.data.data.authors = [...]
      
      let authorsArray = [];
      if (authorsData && authorsData.data) {
        authorsArray = Array.isArray(authorsData.data.authors) ? authorsData.data.authors : 
                      Array.isArray(authorsData.data) ? authorsData.data : [];
      } else if (Array.isArray(authorsData.authors)) {
        authorsArray = authorsData.authors;
      } else if (Array.isArray(authorsData)) {
        authorsArray = authorsData;
      }
      
      let publishersArray = [];
      if (publishersData && publishersData.data) {
        publishersArray = Array.isArray(publishersData.data.publishers) ? publishersData.data.publishers :
                         Array.isArray(publishersData.data) ? publishersData.data : [];
      } else if (Array.isArray(publishersData.publishers)) {
        publishersArray = publishersData.publishers;
      } else if (Array.isArray(publishersData)) {
        publishersArray = publishersData;
      }
      
      setAuthors(authorsArray);
      setPublishers(publishersArray);
    } catch (err) {
      console.error('Error loading authors/publishers:', err);
      setAuthors([]);
      setPublishers([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAuthorChange = (authorName) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.includes(authorName)
        ? prev.authors.filter(name => name !== authorName)
        : [...prev.authors, authorName],
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

    if (formData.authors.length === 0) {
      newErrors.authors = 'At least one author is required';
    }

    // Category validation
    if (formData.category && !VALID_CATEGORIES.includes(formData.category)) {
      newErrors.category = `Category must be one of: ${VALID_CATEGORIES.join(', ')}`;
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
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    isInvalid={!!errors.category}
                  >
                    <option value="">Select Category (Optional)</option>
                    {VALID_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
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
                  authors.map((author, index) => {
                    const authorName = author.name || author;
                    return (
                      <Form.Check
                        key={authorName || index}
                        type="checkbox"
                        id={`author-${index}`}
                        label={authorName}
                        checked={formData.authors.includes(authorName)}
                        onChange={() => handleAuthorChange(authorName)}
                      />
                    );
                  })
                )}
              </div>
              {errors.authors && (
                <div className="text-danger small">{errors.authors}</div>
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

