// Cart Routes
import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireCustomer } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require authentication and customer role
router.get('/', authenticateToken, requireCustomer, getCart);
router.post('/', authenticateToken, requireCustomer, addToCart);
router.put('/:itemId', authenticateToken, requireCustomer, updateCartItem);
router.delete('/:itemId', authenticateToken, requireCustomer, removeFromCart);
router.delete('/', authenticateToken, requireCustomer, clearCart);

export default router;

