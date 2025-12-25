// Order Model (Replenishment Orders)
import pool from '../config/database.js';

export const Order = {
  // Get all orders
  async findAll() {
    const [rows] = await pool.execute(
      `SELECT o.*, b.title as book_title, p.name as publisher_name
       FROM Orders o
       LEFT JOIN Books b ON o.book_isbn = b.isbn
       LEFT JOIN Publishers p ON o.publisher_id = p.publisher_id
       ORDER BY o.order_date DESC`
    );
    return rows;
  },

  // Find order by ID
  async findById(orderId) {
    const [rows] = await pool.execute(
      `SELECT o.*, b.title as book_title, p.name as publisher_name
       FROM Orders o
       LEFT JOIN Books b ON o.book_isbn = b.isbn
       LEFT JOIN Publishers p ON o.publisher_id = p.publisher_id
       WHERE o.order_id = ?`,
      [orderId]
    );
    return rows[0] || null;
  },

  // Create order
  async create(orderData) {
    const [result] = await pool.execute(
      `INSERT INTO Orders (book_isbn, publisher_id, quantity_ordered, status, expected_delivery_date)
       VALUES (?, ?, ?, ?, ?)`,
      [
        orderData.book_isbn,
        orderData.publisher_id,
        orderData.quantity_ordered,
        orderData.status || 'pending',
        orderData.expected_delivery_date || null
      ]
    );
    return this.findById(result.insertId);
  },

  // Confirm order
  async confirm(orderId) {
    await pool.execute(
      `UPDATE Orders SET status = 'confirmed' WHERE order_id = ?`,
      [orderId]
    );
    return this.findById(orderId);
  }
};

