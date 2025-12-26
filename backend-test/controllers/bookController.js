// Book Controller
import { Book } from '../models/Book.js';

export const getAllBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const result = await Book.findAll(page, limit);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const searchBooks = async (req, res, next) => {
  try {
    const { query, authorId, publisherId } = req.query;

    const books = await Book.search(query, {
      authorId: authorId ? parseInt(authorId) : null,
      publisherId: publisherId ? parseInt(publisherId) : null
    });

    res.json({
      success: true,
      data: { books }
    });
  } catch (error) {
    next(error);
  }
};

export const getBookByISBN = async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const book = await Book.findByISBN(isbn);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: { book }
    });
  } catch (error) {
    next(error);
  }
};

export const createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: { book }
    });
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const book = await Book.update(isbn, req.body);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: { book }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const { isbn } = req.params;
    
    // Check if book has existing orders (TC-30)
    const pool = (await import('../config/database.js')).default;
    const [orderRows] = await pool.execute(
      'SELECT COUNT(*) as count FROM order_books WHERE ISBN = ?',
      [isbn]
    );
    
    if (orderRows[0].count > 0) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete book: Book has existing orders. Please handle referential integrity first.'
      });
    }
    
    const deleted = await Book.delete(isbn);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

