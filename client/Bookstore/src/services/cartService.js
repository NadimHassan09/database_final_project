import api from './api';

/**
 * Get user's cart
 * @returns {Promise} API response
 */
export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add item to cart
 * @param {string} bookISBN - Book ISBN
 * @param {number} quantity - Quantity to add
 * @returns {Promise} API response
 */
export const addToCart = async (bookISBN, quantity) => {
  try {
    const response = await api.post('/cart', {
      book_isbn: bookISBN,
      quantity,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update cart item quantity
 * @param {number} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise} API response
 */
export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Remove item from cart
 * @param {number} itemId - Cart item ID
 * @returns {Promise} API response
 */
export const removeFromCart = async (itemId) => {
  try {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Clear entire cart
 * @returns {Promise} API response
 */
export const clearCart = async () => {
  try {
    const response = await api.delete('/cart');
    return response.data;
  } catch (error) {
    throw error;
  }
};

