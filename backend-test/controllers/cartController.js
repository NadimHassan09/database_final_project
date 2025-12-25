// Cart Controller
import { Cart } from '../models/Cart.js';
import { Book } from '../models/Book.js';

export const getCart = async (req, res, next) => {
  try {
    const cartData = await Cart.getCartWithItems(req.user.user_id);

    res.json({
      success: true,
      data: cartData
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { book_isbn, quantity } = req.body;

    // Validate book exists and has stock
    const book = await Book.findByISBN(book_isbn);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.quantity_in_stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${book.quantity_in_stock} available.`
      });
    }

    const cartData = await Cart.addItem(req.user.user_id, book_isbn, quantity);

    res.json({
      success: true,
      message: 'Item added to cart',
      data: cartData
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    const cartData = await Cart.updateItemQuantity(parseInt(itemId), quantity);

    if (!cartData) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Cart item updated',
      data: cartData
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cartData = await Cart.removeItem(parseInt(itemId));

    if (!cartData) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cartData
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cartData = await Cart.clearCart(req.user.user_id);

    res.json({
      success: true,
      message: 'Cart cleared',
      data: cartData
    });
  } catch (error) {
    next(error);
  }
};

