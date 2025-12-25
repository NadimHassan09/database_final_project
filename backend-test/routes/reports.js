// Reports Routes
import express from 'express';
import {
  getMonthlySales,
  getDailySales,
  getTopCustomers,
  getTopBooks,
  getReplenishmentCount
} from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require admin
router.get('/monthly-sales', authenticateToken, requireAdmin, getMonthlySales);
router.get('/daily-sales', authenticateToken, requireAdmin, getDailySales);
router.get('/top-customers', authenticateToken, requireAdmin, getTopCustomers);
router.get('/top-books', authenticateToken, requireAdmin, getTopBooks);
router.get('/replenishment-count/:bookId', authenticateToken, requireAdmin, getReplenishmentCount);

export default router;

