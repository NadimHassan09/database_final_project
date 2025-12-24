import { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Alert } from 'react-bootstrap';
import {
  getMonthlySalesReport,
  getDailySalesReport,
  getTopCustomersReport,
  getTopBooksReport,
} from '../../services/reportService';
import { formatPrice, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../LoadingSpinner';

const Reports = () => {
  const [activeReport, setActiveReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const loadMonthlySales = async () => {
    try {
      setLoading(true);
      setError(null);
      setActiveReport('monthly');
      const response = await getMonthlySalesReport();
      setReportData(response);
    } catch (err) {
      setError('Failed to load monthly sales report.');
      console.error('Error:', err);
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
      setReportData(response);
    } catch (err) {
      setError('Failed to load daily sales report.');
      console.error('Error:', err);
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
      setReportData(response);
    } catch (err) {
      setError('Failed to load top customers report.');
      console.error('Error:', err);
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
      setReportData(response);
    } catch (err) {
      setError('Failed to load top books report.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

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
              {reportData.sales && (
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
                        <td>{formatPrice(sale.total_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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
              {reportData.sales && (
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
                        <td>{formatPrice(sale.total_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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
                      <td>{customer.name || `${customer.first_name} ${customer.last_name}`}</td>
                      <td>{customer.email}</td>
                      <td>{formatPrice(customer.total_spent || customer.total_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        );

      case 'books':
        return (
          <Card>
            <Card.Header>
              <h5>Top 10 Selling Books (Last 3 Months)</h5>
            </Card.Header>
            <Card.Body>
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
                  {(reportData.books || reportData.data || []).map((book, index) => (
                    <tr key={book.isbn || index}>
                      <td>{index + 1}</td>
                      <td>{book.title}</td>
                      <td>{book.isbn}</td>
                      <td>{book.copies_sold || book.quantity_sold || 0}</td>
                      <td>{formatPrice(book.revenue || book.total_revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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

