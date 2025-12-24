/**
 * Format price to currency string
 * @param {number} price - Price value
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = '$') => {
  if (price === null || price === undefined || isNaN(price)) {
    return `${currency}0.00`;
  }
  return `${currency}${parseFloat(price).toFixed(2)}`;
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date value
 * @param {string} format - Format type ('short', 'long', 'datetime')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    datetime: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  };
  
  return dateObj.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Format ISBN for display
 * @param {string} isbn - ISBN string
 * @returns {string} Formatted ISBN
 */
export const formatISBN = (isbn) => {
  if (!isbn) return 'N/A';
  // Remove any existing formatting
  const cleaned = isbn.replace(/[-\s]/g, '');
  // Format as ISBN-13: XXX-XXX-XXXXX-X
  if (cleaned.length === 13) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 11)}-${cleaned.slice(11)}`;
  }
  return isbn;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

