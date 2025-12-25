// Publisher Routes
import express from 'express';
import {
  getAllPublishers,
  getPublisherById,
  createPublisher,
  updatePublisher
} from '../controllers/publisherController.js';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getAllPublishers);
router.get('/:id', optionalAuth, getPublisherById);

// Admin only routes
router.post('/', authenticateToken, requireAdmin, createPublisher);
router.put('/:id', authenticateToken, requireAdmin, updatePublisher);

export default router;

