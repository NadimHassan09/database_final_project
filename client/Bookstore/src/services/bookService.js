import api from './api';

/**
 * Get all books with pagination
 * @param {object} params - Query parameters (page, limit, search, etc.)
 * @returns {Promise} API response
 */
export const getBooks = async (params = {}) => {
  try {
    const response = await api.get('/books', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Search books
 * @param {string} query - Search query
 * @param {object} filters - Additional filters (category, author, publisher)
 * @returns {Promise} API response
 */
export const searchBooks = async (query, filters = {}) => {
  try {
    const response = await api.get('/books/search', {
      params: { query, ...filters },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get book by ISBN
 * @param {string} isbn - Book ISBN
 * @returns {Promise} API response
 */
export const getBookByISBN = async (isbn) => {
  try {
    const response = await api.get(`/books/${isbn}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get books by category
 * @param {string} category - Category name
 * @returns {Promise} API response
 */
export const getBooksByCategory = async (category) => {
  try {
    const response = await api.get(`/books/category/${category}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get books by author
 * @param {number} authorId - Author ID
 * @returns {Promise} API response
 */
export const getBooksByAuthor = async (authorId) => {
  try {
    const response = await api.get(`/books/author/${authorId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get books by publisher
 * @param {number} publisherId - Publisher ID
 * @returns {Promise} API response
 */
export const getBooksByPublisher = async (publisherId) => {
  try {
    const response = await api.get(`/books/publisher/${publisherId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add new book (Admin only)
 * @param {object} bookData - Book data
 * @returns {Promise} API response
 */
export const addBook = async (bookData) => {
  try {
    const response = await api.post('/books', bookData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update book (Admin only)
 * @param {string} isbn - Book ISBN
 * @param {object} bookData - Updated book data
 * @returns {Promise} API response
 */
export const updateBook = async (isbn, bookData) => {
  try {
    const response = await api.put(`/books/${isbn}`, bookData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete book (Admin only)
 * @param {string} isbn - Book ISBN
 * @returns {Promise} API response
 */
export const deleteBook = async (isbn) => {
  try {
    const response = await api.delete(`/books/${isbn}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all authors
 * @returns {Promise} API response
 */
export const getAuthors = async () => {
  try {
    const response = await api.get('/authors');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all publishers
 * @returns {Promise} API response
 */
export const getPublishers = async () => {
  try {
    const response = await api.get('/publishers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

