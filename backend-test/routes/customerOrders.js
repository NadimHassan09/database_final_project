// Customer Orders Routes (Sales/Transactions)
import express from 'express';
import {
  getCustomerOrders,
  getOrderById
} from '../controllers/customerOrderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireCustomer } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require authentication and customer role
router.get('/', authenticateToken, requireCustomer, getCustomerOrders);
router.get('/:orderId', authenticateToken, requireCustomer, getOrderById);

export default router;

