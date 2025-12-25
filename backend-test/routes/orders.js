// Order Routes (Replenishment Orders)
import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  confirmOrder
} from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require admin
router.get('/', authenticateToken, requireAdmin, getAllOrders);
router.get('/:id', authenticateToken, requireAdmin, getOrderById);
router.post('/', authenticateToken, requireAdmin, createOrder);
router.put('/:id/confirm', authenticateToken, requireAdmin, confirmOrder);

export default router;

