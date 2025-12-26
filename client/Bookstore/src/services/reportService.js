import api from './api';

/**
 * Get monthly sales report (previous month)
 * @returns {Promise} API response
 */
export const getMonthlySalesReport = async () => {
  try {
    const response = await api.get('/reports/monthly-sales');
    // Backend returns: { success: true, data: { sales: [...], total_sales: ..., sales_count: ... } }
    return response.data?.data || response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get daily sales report
 * @param {string} date - Date string (YYYY-MM-DD)
 * @returns {Promise} API response
 */
export const getDailySalesReport = async (date) => {
  try {
    const response = await api.get('/reports/daily-sales', {
      params: { date },
    });
    // Backend returns: { success: true, data: { sales: [...], total_sales: ..., sales_count: ... } }
    return response.data?.data || response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get top 5 customers report (last 3 months)
 * @returns {Promise} API response
 */
export const getTopCustomersReport = async () => {
  try {
    const response = await api.get('/reports/top-customers');
    // Backend returns: { success: true, data: { customers: [...] } }
    return response.data?.data || response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get top 10 selling books report (last 3 months)
 * @returns {Promise} API response
 */
export const getTopBooksReport = async () => {
  try {
    const response = await api.get('/reports/top-books');
    // Backend returns: { success: true, data: { books: [...] } }
    return response.data?.data || response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get replenishment orders count for a book
 * @param {string} bookISBN - Book ISBN
 * @returns {Promise} API response
 */
export const getReplenishmentCount = async (bookISBN) => {
  try {
    const response = await api.get(`/reports/replenishment-count/${encodeURIComponent(bookISBN)}`);
    // Backend returns: { success: true, data: { count: ..., book_isbn: ... } }
    return response.data?.data || response.data;
  } catch (error) {
    throw error;
  }
};

