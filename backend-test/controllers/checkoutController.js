// Checkout Controller
import { Cart } from '../models/Cart.js';
import { Sale } from '../models/Sale.js';
import { Book } from '../models/Book.js';
import pool from '../config/database.js';

export const checkout = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Get cart with items
    const cartData = await Cart.getCartWithItems(req.user.user_id);

    if (!cartData.items || cartData.items.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate stock availability and calculate total
    let totalAmount = 0;
    const saleItems = [];

    for (const item of cartData.items) {
      const itemISBN = item.isbn || item.book_isbn;
      const book = await Book.findByISBN(itemISBN);
      
      if (!book) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: `Book ${itemISBN} not found`
        });
      }

      // Use stock_qty or quantity_in_stock (for backward compatibility)
      const availableStock = book.stock_qty !== undefined ? book.stock_qty : (book.quantity_in_stock || 0);
      
      if (availableStock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${book.title}. Only ${availableStock} available.`
        });
      }

      const itemTotal = book.price * item.quantity;
      totalAmount += itemTotal;

      saleItems.push({
        isbn: item.isbn || item.book_isbn,
        book_isbn: item.isbn || item.book_isbn,
        quantity: item.quantity,
        unit_price: book.price,
        price_at_sale: book.price
      });
    }

    // Create sale
    const sale = await Sale.createSale({
      user_id: req.user.user_id,
      customerId: req.user.user_id,
      total_amount: totalAmount,
      payment_method: req.body.payment_method || 'credit_card',
      payment_card: req.body.payment_card || req.body.card_number || null,
      expiry_date: req.body.expiry_date || req.body.expiryDate || null,
      items: saleItems
    });

    // Clear cart
    await Cart.clearCart(req.user.user_id);

    await connection.commit();

    // Get full sale details
    const saleDetails = await Sale.findById(sale.sale_id);

    res.status(201).json({
      success: true,
      message: 'Checkout successful',
      data: {
        sale: saleDetails,
        order_id: saleDetails.sale_id
      }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

export const getOrderConfirmation = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Sale.findById(parseInt(orderId));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify order belongs to user (unless admin)
    if (req.user.user_type !== 'admin' && order.user_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

