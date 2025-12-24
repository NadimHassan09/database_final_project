/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password string
 * @returns {object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  // Allow various phone formats
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Validate ISBN format
 * @param {string} isbn - ISBN string
 * @returns {boolean} True if valid
 */
export const validateISBN = (isbn) => {
  if (!isbn) return false;
  // Remove formatting characters
  const cleaned = isbn.replace(/[-\s]/g, '');
  // ISBN-10 or ISBN-13
  return cleaned.length === 10 || cleaned.length === 13;
};

/**
 * Validate quantity (positive integer)
 * @param {number|string} quantity - Quantity value
 * @param {number} maxStock - Maximum available stock (optional)
 * @returns {object} Validation result
 */
export const validateQuantity = (quantity, maxStock = null) => {
  const num = parseInt(quantity);
  
  if (isNaN(num) || num <= 0) {
    return { isValid: false, message: 'Quantity must be a positive number' };
  }
  
  if (maxStock !== null && num > maxStock) {
    return { isValid: false, message: `Quantity cannot exceed available stock (${maxStock})` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate credit card number (basic format check)
 * @param {string} cardNumber - Credit card number
 * @returns {boolean} True if valid format
 */
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber) return false;
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s\-]/g, '');
  // Check if it's 13-19 digits
  return /^\d{13,19}$/.test(cleaned);
};

/**
 * Validate required field
 * @param {any} value - Field value
 * @param {string} fieldName - Name of the field
 * @returns {object} Validation result
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true, message: '' };
};

