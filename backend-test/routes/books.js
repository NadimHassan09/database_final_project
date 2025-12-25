// Book Routes
import express from 'express';
import {
  getAllBooks,
  searchBooks,
  getBookByISBN,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';
import { validateBook } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getAllBooks);
router.get('/search', optionalAuth, searchBooks);
router.get('/:isbn', optionalAuth, getBookByISBN);

// Admin only routes
router.post('/', authenticateToken, requireAdmin, validateBook, createBook);
router.put('/:isbn', authenticateToken, requireAdmin, updateBook);
router.delete('/:isbn', authenticateToken, requireAdmin, deleteBook);

export default router;

