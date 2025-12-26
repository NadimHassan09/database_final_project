// Order Model (Replenishment Orders) - New Database Structure
import pool from '../config/database.js';

export const Order = {
  // Get all orders
  async findAll() {
    const [rows] = await pool.execute(
      `SELECT op.*, b.Title as book_title, p.Name as publisher_name,
       a.Name as admin_name
       FROM order_publisher op
       LEFT JOIN book b ON op.ISBN = b.ISBN
       LEFT JOIN publisher p ON op.PublisherID = p.PublisherID
       LEFT JOIN admin a ON op.AdminID = a.AdminID
       ORDER BY op.OrderDate DESC`
    );
    
    return rows.map(row => ({
      order_id: row.OrderID,
      book_isbn: row.ISBN,
      publisher_id: row.PublisherID,
      admin_id: row.AdminID,
      order_date: row.OrderDate,
      quantity_ordered: row.QuantityOrdered,
      status: row.Status,
      expected_delivery_date: null, // Not in new schema
      book_title: row.book_title,
      publisher_name: row.publisher_name,
      admin_name: row.admin_name
    }));
  },

  // Find order by ID
  async findById(orderId) {
    const [rows] = await pool.execute(
      `SELECT op.*, b.Title as book_title, p.Name as publisher_name,
       a.Name as admin_name
       FROM order_publisher op
       LEFT JOIN book b ON op.ISBN = b.ISBN
       LEFT JOIN publisher p ON op.PublisherID = p.PublisherID
       LEFT JOIN admin a ON op.AdminID = a.AdminID
       WHERE op.OrderID = ?`,
      [orderId]
    );
    
    if (!rows[0]) return null;
    
    const row = rows[0];
    return {
      order_id: row.OrderID,
      book_isbn: row.ISBN,
      publisher_id: row.PublisherID,
      admin_id: row.AdminID,
      order_date: row.OrderDate,
      quantity_ordered: row.QuantityOrdered,
      status: row.Status,
      expected_delivery_date: null,
      book_title: row.book_title,
      publisher_name: row.publisher_name,
      admin_name: row.admin_name
    };
  },

  // Create order
  async create(orderData) {
    const [result] = await pool.execute(
      `INSERT INTO order_publisher (ISBN, PublisherID, AdminID, OrderDate, QuantityOrdered, Status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        orderData.book_isbn || orderData.isbn,
        orderData.publisher_id || orderData.publisherId,
        orderData.admin_id || orderData.adminId || 1, // Default to admin 1
        orderData.order_date || orderData.orderDate || new Date(),
        orderData.quantity_ordered || orderData.quantityOrdered,
        orderData.status || 'Pending'
      ]
    );
    return this.findById(result.insertId);
  },

  // Confirm order
  async confirm(orderId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Get order details first using the same connection
      const [orderRows] = await connection.execute(
        `SELECT op.*, b.Title as book_title, p.Name as publisher_name,
         a.Name as admin_name
         FROM order_publisher op
         LEFT JOIN book b ON op.ISBN = b.ISBN
         LEFT JOIN publisher p ON op.PublisherID = p.PublisherID
         LEFT JOIN admin a ON op.AdminID = a.AdminID
         WHERE op.OrderID = ?`,
        [orderId]
      );
      
      if (!orderRows[0]) {
        throw new Error('Order not found');
      }

      const order = orderRows[0];

      // Check if order is already confirmed
      if (order.Status && order.Status.toLowerCase() === 'confirmed') {
        await connection.commit();
        return this.findById(orderId); // Return using pool connection
      }

      // Get current book stock before update (for verification)
      const [bookRows] = await connection.execute(
        `SELECT StockQty FROM book WHERE ISBN = ?`,
        [order.ISBN]
      );
      
      if (bookRows.length === 0) {
        throw new Error(`Book with ISBN ${order.ISBN} not found`);
      }
      
      const currentStock = bookRows[0].StockQty;
      const expectedStock = currentStock + order.QuantityOrdered;

      // Update order status to Confirmed
      // The trigger `confirm_restock` will automatically update book stock when status changes to 'Confirmed'
      await connection.execute(
        `UPDATE order_publisher SET Status = 'Confirmed' WHERE OrderID = ?`,
        [orderId]
      );

      // Verify stock was updated by trigger
      const [verifyRows] = await connection.execute(
        `SELECT StockQty FROM book WHERE ISBN = ?`,
        [order.ISBN]
      );
      
      const actualStock = verifyRows[0].StockQty;
      
      // If trigger updated stock, we might have double-update (trigger + explicit)
      // Or if trigger didn't fire, stock won't be updated
      // So we'll set it to the correct value explicitly
      if (actualStock !== expectedStock) {
        // Update to correct value (handles both cases: trigger didn't fire, or double-update)
        const [updateResult] = await connection.execute(
          `UPDATE book SET StockQty = ? WHERE ISBN = ?`,
          [expectedStock, order.ISBN]
        );
        
        if (updateResult.affectedRows === 0) {
          throw new Error(`Failed to update stock for book with ISBN ${order.ISBN}`);
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Stock corrected: Was ${actualStock}, set to ${expectedStock} for book ${order.ISBN}`);
        }
      }

      await connection.commit();

      // Return updated order with stock info
      const updatedOrder = await this.findById(orderId);
      if (updatedOrder) {
        updatedOrder.old_stock = currentStock;
        updatedOrder.new_stock = newStock;
      }
      return updatedOrder;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Get replenishment count for a specific book
  async getReplenishmentCount(bookISBN) {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as count
       FROM order_publisher
       WHERE ISBN = ?`,
      [bookISBN]
    );
    return parseInt(rows[0].count) || 0;
  }
};
