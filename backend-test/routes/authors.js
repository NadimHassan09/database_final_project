// Author Routes
import express from 'express';
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor
} from '../controllers/authorController.js';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getAllAuthors);
router.get('/:id', optionalAuth, getAuthorById);

// Admin only routes
router.post('/', authenticateToken, requireAdmin, createAuthor);
router.put('/:id', authenticateToken, requireAdmin, updateAuthor);

export default router;

