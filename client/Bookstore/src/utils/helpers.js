/**
 * Get user role display name
 * @param {string} userType - User type ('admin' or 'customer')
 * @returns {string} Display name
 */
export const getUserRoleName = (userType) => {
  const roles = {
    admin: 'Administrator',
    customer: 'Customer'
  };
  return roles[userType] || 'User';
};

/**
 * Check if user is admin
 * @param {object} user - User object
 * @returns {boolean} True if admin
 */
export const isAdmin = (user) => {
  return user?.user_type === 'admin' || user?.role === 'admin';
};

/**
 * Calculate total price for cart items
 * @param {Array} items - Array of cart items with price and quantity
 * @returns {number} Total price
 */
export const calculateTotal = (items) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((total, item) => {
    const price = parseFloat(item.price || item.unit_price || 0);
    const quantity = parseInt(item.quantity || 0);
    return total + (price * quantity);
  }, 0);
};

/**
 * Get stock status text and color
 * @param {number} quantity - Available quantity
 * @param {number} threshold - Minimum threshold
 * @returns {object} Status info
 */
export const getStockStatus = (quantity, threshold = 0) => {
  if (quantity === 0) {
    return { text: 'Out of Stock', color: 'danger', available: false };
  }
  if (threshold > 0 && quantity <= threshold) {
    return { text: 'Low Stock', color: 'warning', available: true };
  }
  return { text: 'In Stock', color: 'success', available: true };
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Get error message from error object
 * @param {Error|object|string} error - Error object
 * @returns {string} Error message
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};

/**
 * Generate order number
 * @returns {string} Order number
 */
export const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

/**
 * Check if date is in past
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if in past
 */
export const isPastDate = (date) => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
};

/**
 * Get initials from name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} Initials
 */
export const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}`;
};

/**
 * Format authors for display
 * Handles both array format [{author_id, name}] and string format
 * @param {Array|string} authors - Authors data
 * @param {string} fallback - Fallback text if no authors
 * @returns {string} Formatted author string
 */
export const formatAuthors = (authors, fallback = 'Unknown Author') => {
  if (!authors) return fallback;
  
  if (Array.isArray(authors)) {
    if (authors.length === 0) return fallback;
    return authors.map(a => a.name || a).join(', ') || fallback;
  } else if (typeof authors === 'string') {
    return authors || fallback;
  }
  
  return fallback;
};

