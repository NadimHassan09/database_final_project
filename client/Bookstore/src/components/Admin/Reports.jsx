import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Alert } from 'react-bootstrap';
import {
  getMonthlySalesReport,
  getDailySalesReport,
  getTopCustomersReport,
  getTopBooksReport,
  getReplenishmentCount,
} from '../../services/reportService';
import { getBooks } from '../../services/bookService';
import { formatPrice, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../LoadingSpinner';

const Reports = () => {
  const [activeReport, setActiveReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBookISBN, setSelectedBookISBN] = useState('');
  const [books, setBooks] = useState([]);

  const loadMonthlySales = async () => {
    try {
      setLoading(true);
      setError(null);
      setActiveReport('monthly');
      const response = await getMonthlySalesReport();
      // Response structure: { sales: [...], total_sales: ..., sales_count: ... }
      setReportData(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load monthly sales report.');
      console.error('Error:', err);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const loadDailySales = async () => {
    try {
      setLoading(true);
      setError(null);
      setActiveReport('daily');
      const response = await getDailySalesReport(date);
      // Response structure: { sales: [...], total_sales: ..., sales_count: ... }
      setReportData(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load daily sales report.');
      console.error('Error:', err);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const loadTopCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      setActiveReport('customers');
      const response = await getTopCustomersReport();
      // Response structure: { customers: [...] }
      setReportData(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load top customers report.');
      console.error('Error:', err);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const loadTopBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      setActiveReport('books');
      const response = await getTopBooksReport();
      // Response structure: { books: [...] }
      setReportData(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load top books report.');
      console.error('Error:', err);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  // Load books for replenishment count report
  const loadBooks = async () => {
    try {
      const response = await getBooks({ page: 1, limit: 1000 });
      const booksData = response.data?.books || response.books || [];
      setBooks(booksData);
    } catch (err) {
      console.error('Error loading books:', err);
    }
  };

  // Load replenishment count for a book
  const loadReplenishmentCount = async () => {
    if (!selectedBookISBN) {
      setError('Please select a book');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setActiveReport('replenishment');
      const response = await getReplenishmentCount(selectedBookISBN);
      // Response structure: { count: ..., book_isbn: ... }
      setReportData(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load replenishment count.');
      console.error('Error:', err);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  // Load books on component mount
  useEffect(() => {
    loadBooks();
  }, []);

  const renderReport = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    if (!reportData || activeReport === null) {
      return <p className="text-muted">Select a report to view.</p>;
    }

    switch (activeReport) {
      case 'monthly':
        return (
          <Card>
            <Card.Header>
              <h5>Monthly Sales Report (Previous Month)</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Total Sales:</strong> {formatPrice(reportData.total_sales || reportData.total || 0)}</p>
              <p><strong>Number of Sales:</strong> {reportData.sales_count || reportData.count || 0}</p>
              {reportData.sales && reportData.sales.length > 0 ? (
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Sale ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.sales.map((sale) => (
                      <tr key={sale.sale_id}>
                        <td>{sale.sale_id}</td>
                        <td>{formatDate(sale.sale_date)}</td>
                        <td>{sale.customer_name || 'N/A'}</td>
                        <td>{formatPrice(sale.total_amount || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">No sales found for the previous month.</p>
              )}
            </Card.Body>
          </Card>
        );

      case 'daily':
        return (
          <Card>
            <Card.Header>
              <h5>Daily Sales Report - {formatDate(date)}</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Total Sales:</strong> {formatPrice(reportData.total_sales || reportData.total || 0)}</p>
              <p><strong>Number of Sales:</strong> {reportData.sales_count || reportData.count || 0}</p>
              {reportData.sales && reportData.sales.length > 0 ? (
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Sale ID</th>
                      <th>Customer</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.sales.map((sale) => (
                      <tr key={sale.sale_id}>
                        <td>{sale.sale_id}</td>
                        <td>{sale.customer_name || 'N/A'}</td>
                        <td>{formatPrice(sale.total_amount || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">No sales found for the selected date.</p>
              )}
            </Card.Body>
          </Card>
        );

      case 'customers':
        return (
          <Card>
            <Card.Header>
              <h5>Top 5 Customers (Last 3 Months)</h5>
            </Card.Header>
            <Card.Body>
              {(reportData.customers || reportData.data || []).length > 0 ? (
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Customer Name</th>
                      <th>Email</th>
                      <th>Total Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(reportData.customers || reportData.data || []).map((customer, index) => (
                      <tr key={customer.user_id || index}>
                        <td>{index + 1}</td>
                        <td>{customer.name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'N/A'}</td>
                        <td>{customer.email || 'N/A'}</td>
                        <td>{formatPrice(customer.total_spent || customer.total_amount || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">No customer data available for the last 3 months.</p>
              )}
            </Card.Body>
          </Card>
        );

      case 'books':
        const booksList = reportData.books || reportData.data || [];
        return (
          <Card>
            <Card.Header>
              <h5>Top 10 Selling Books (Last 3 Months)</h5>
            </Card.Header>
            <Card.Body>
              {booksList.length === 0 ? (
                <p className="text-muted">No books sold in the last 3 months.</p>
              ) : (
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Book Title</th>
                      <th>ISBN</th>
                      <th>Copies Sold</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booksList.map((book, index) => (
                      <tr key={book.isbn || index}>
                        <td>{index + 1}</td>
                        <td>{book.title}</td>
                        <td>{book.isbn}</td>
                        <td>{book.copies_sold || book.quantity_sold || 0}</td>
                        <td>{formatPrice(book.revenue || book.total_revenue || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        );

      case 'replenishment':
        return (
          <Card>
            <Card.Header>
              <h5>Replenishment Orders Count</h5>
            </Card.Header>
            <Card.Body>
              {reportData.count !== undefined ? (
                <>
                  <p><strong>Book ISBN:</strong> {reportData.book_isbn || selectedBookISBN}</p>
                  <p><strong>Total Replenishment Orders:</strong> {reportData.count}</p>
                  <p className="text-muted">
                    This book has been ordered from publishers {reportData.count} time{reportData.count !== 1 ? 's' : ''}.
                  </p>
                </>
              ) : (
                <p className="text-muted">No data available.</p>
              )}
            </Card.Body>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Reports</h2>

      <Row>
        <Col md={3}>
          <Card>
            <Card.Header>
              <h5>Available Reports</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" onClick={loadMonthlySales}>
                  Monthly Sales
                </Button>
                <div>
                  <Form.Group className="mb-2">
                    <Form.Label>Select Date:</Form.Label>
                    <Form.Control
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="outline-primary" className="w-100" onClick={loadDailySales}>
                    Daily Sales
                  </Button>
                </div>
                <Button variant="outline-primary" onClick={loadTopCustomers}>
                  Top Customers
                </Button>
                <Button variant="outline-primary" onClick={loadTopBooks}>
                  Top Books
                </Button>
                <div>
                  <Form.Group className="mb-2">
                    <Form.Label>Select Book (ISBN):</Form.Label>
                    <Form.Select
                      value={selectedBookISBN}
                      onChange={(e) => setSelectedBookISBN(e.target.value)}
                    >
                      <option value="">Select a book...</option>
                      {books.map((book) => (
                        <option key={book.isbn} value={book.isbn}>
                          {book.title} ({book.isbn})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Button 
                    variant="outline-primary" 
                    className="w-100" 
                    onClick={loadReplenishmentCount}
                    disabled={!selectedBookISBN}
                  >
                    Replenishment Count
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          {renderReport()}
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;

