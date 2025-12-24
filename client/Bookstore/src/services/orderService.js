import api from './api';

/**
 * Get customer's order history
 * @returns {Promise} API response
 */
export const getCustomerOrders = async () => {
  try {
    const response = await api.get('/customer-orders');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get order by ID
 * @param {number} orderId - Order ID
 * @returns {Promise} API response
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/customer-orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Process checkout
 * @param {object} checkoutData - Checkout data (payment info, etc.)
 * @returns {Promise} API response
 */
export const checkout = async (checkoutData) => {
  try {
    const response = await api.post('/checkout', checkoutData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get order confirmation
 * @param {number} orderId - Order ID
 * @returns {Promise} API response
 */
export const getOrderConfirmation = async (orderId) => {
  try {
    const response = await api.get(`/checkout/order/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all replenishment orders (Admin only)
 * @returns {Promise} API response
 */
export const getReplenishmentOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get replenishment order by ID (Admin only)
 * @param {number} orderId - Order ID
 * @returns {Promise} API response
 */
export const getReplenishmentOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Confirm replenishment order (Admin only)
 * @param {number} orderId - Order ID
 * @returns {Promise} API response
 */
export const confirmReplenishmentOrder = async (orderId) => {
  try {
    const response = await api.put(`/orders/${orderId}/confirm`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

