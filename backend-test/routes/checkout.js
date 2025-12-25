// Checkout Routes
import express from 'express';
import {
  checkout,
  getOrderConfirmation
} from '../controllers/checkoutController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireCustomer } from '../middleware/roleMiddleware.js';
import { validateCheckout } from '../middleware/validationMiddleware.js';

const router = express.Router();

// All routes require authentication and customer role
router.post('/', authenticateToken, requireCustomer, validateCheckout, checkout);
router.get('/order/:orderId', authenticateToken, getOrderConfirmation);

export default router;

