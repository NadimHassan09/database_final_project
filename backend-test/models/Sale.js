// Sale Model - New Database Structure (customer_order and order_books)
import pool from '../config/database.js';

export const Sale = {
  // Create sale with items
  async createSale(saleData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Create customer order
      const [orderResult] = await connection.execute(
        `INSERT INTO customer_order (CustomerID, TotalAmount, PaymentCard, ExpiryDate)
         VALUES (?, ?, ?, ?)`,
        [
          saleData.user_id || saleData.customerId,
          saleData.total_amount,
          saleData.payment_card || saleData.paymentCard || null,
          saleData.expiry_date || saleData.expiryDate || null
        ]
      );

      const orderNo = orderResult.insertId;

      // Create order books (items)
      if (saleData.items && saleData.items.length > 0) {
        const itemValues = saleData.items.map(item => [
          orderNo,
          item.isbn || item.book_isbn,
          item.quantity,
          item.price_at_sale || item.unit_price || item.price
        ]);

        await connection.query(
          'INSERT INTO order_books (OrderNo, ISBN, Quantity, PriceAtSale) VALUES ?',
          [itemValues]
        );

        // Update book stock (TC-07: Update Book Quantity After Sale)
        // This happens after payment validation, so stock is only deducted on successful checkout
        for (const item of saleData.items) {
          await connection.execute(
            'UPDATE book SET StockQty = StockQty - ? WHERE ISBN = ?',
            [item.quantity, item.isbn || item.book_isbn]
          );
        }
      }

      await connection.commit();

      return this.findById(orderNo);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Find sale by ID
  async findById(orderNo) {
    const [rows] = await pool.execute(
      `SELECT co.*, c.FirstName as first_name, c.LastName as last_name, 
       c.Email as email, c.ShippingAddress as shipping_address
       FROM customer_order co
       LEFT JOIN customer c ON co.CustomerID = c.CustomerID
       WHERE co.OrderNo = ?`,
      [orderNo]
    );

    if (!rows[0]) return null;

    const order = rows[0];

    // Get order items
    const [items] = await pool.execute(
      `SELECT ob.*, b.Title as book_title, b.ISBN as book_isbn
       FROM order_books ob
       JOIN book b ON ob.ISBN = b.ISBN
       WHERE ob.OrderNo = ?
       ORDER BY ob.ISBN`,
      [orderNo]
    );

    order.items = items || [];
    
    // Map to frontend-expected format
    return {
      sale_id: order.OrderNo,
      order_id: order.OrderNo,
      user_id: order.CustomerID,
      customer_id: order.CustomerID,
      sale_date: order.OrderDate,
      order_date: order.OrderDate,
      total_amount: parseFloat(order.TotalAmount) || 0,
      payment_method: order.PaymentCard ? 'credit_card' : 'other',
      payment_card: order.PaymentCard,
      expiry_date: order.ExpiryDate,
      first_name: order.first_name,
      last_name: order.last_name,
      email: order.email,
      shipping_address: order.shipping_address,
      items: items.map(item => ({
        sale_item_id: `${order.OrderNo}_${item.ISBN}`,
        sale_id: order.OrderNo,
        book_isbn: item.ISBN,
        isbn: item.ISBN,
        quantity: item.Quantity,
        unit_price: parseFloat(item.PriceAtSale) || 0,
        price: parseFloat(item.PriceAtSale) || 0,
        book_title: item.book_title,
        title: item.book_title
      }))
    };
  },

  // Get customer orders
  async findByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT co.*, c.ShippingAddress as shipping_address,
       c.FirstName as first_name, c.LastName as last_name, c.Email as email
       FROM customer_order co
       LEFT JOIN customer c ON co.CustomerID = c.CustomerID
       WHERE co.CustomerID = ?
       ORDER BY co.OrderDate DESC`,
      [userId]
    );

    // Get items for each order
    for (let order of rows) {
      const [items] = await pool.execute(
        `SELECT ob.*, b.Title as book_title, b.ISBN as book_isbn
         FROM order_books ob
         JOIN book b ON ob.ISBN = b.ISBN
         WHERE ob.OrderNo = ?
         ORDER BY ob.ISBN`,
        [order.OrderNo]
      );
      
      order.items = items.map(item => ({
        sale_item_id: `${order.OrderNo}_${item.ISBN}`,
        sale_id: order.OrderNo,
        book_isbn: item.ISBN,
        isbn: item.ISBN,
        quantity: item.Quantity,
        unit_price: parseFloat(item.PriceAtSale) || 0,
        price: parseFloat(item.PriceAtSale) || 0,
        book_title: item.book_title,
        title: item.book_title
      })) || [];
    }

    // Map to frontend-expected format
    return rows.map(order => ({
      sale_id: order.OrderNo,
      order_id: order.OrderNo,
      user_id: order.CustomerID,
      customer_id: order.CustomerID,
      sale_date: order.OrderDate,
      order_date: order.OrderDate,
      total_amount: parseFloat(order.TotalAmount) || 0,
      payment_method: order.PaymentCard ? 'credit_card' : 'other',
      payment_card: order.PaymentCard,
      expiry_date: order.ExpiryDate,
      first_name: order.first_name,
      last_name: order.last_name,
      email: order.email,
      shipping_address: order.shipping_address,
      items: order.items
    }));
  },

  // Get monthly sales report
  async getMonthlySales() {
    const [rows] = await pool.execute(
      `SELECT co.OrderNo as sale_id, co.OrderDate as sale_date, co.TotalAmount as total_amount,
       c.FirstName as first_name, c.LastName as last_name,
       CONCAT(c.FirstName, ' ', c.LastName) as customer_name
       FROM customer_order co
       LEFT JOIN customer c ON co.CustomerID = c.CustomerID
       WHERE MONTH(co.OrderDate) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
       AND YEAR(co.OrderDate) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
       ORDER BY co.OrderDate DESC`
    );

    const [totalRow] = await pool.execute(
      `SELECT SUM(TotalAmount) as total_sales, COUNT(*) as sales_count
       FROM customer_order
       WHERE MONTH(OrderDate) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
       AND YEAR(OrderDate) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))`
    );

    return {
      sales: rows.map(row => ({
        sale_id: row.sale_id,
        sale_date: row.sale_date,
        total_amount: parseFloat(row.total_amount) || 0,
        customer_name: row.customer_name || 'N/A'
      })),
      total_sales: parseFloat(totalRow[0].total_sales) || 0,
      sales_count: parseInt(totalRow[0].sales_count) || 0
    };
  },

  // Get daily sales report
  async getDailySales(date) {
    const [rows] = await pool.execute(
      `SELECT co.OrderNo as sale_id, co.OrderDate as sale_date, co.TotalAmount as total_amount,
       c.FirstName as first_name, c.LastName as last_name,
       CONCAT(c.FirstName, ' ', c.LastName) as customer_name
       FROM customer_order co
       LEFT JOIN customer c ON co.CustomerID = c.CustomerID
       WHERE DATE(co.OrderDate) = ?
       ORDER BY co.OrderDate DESC`,
      [date]
    );

    const [totalRow] = await pool.execute(
      `SELECT SUM(TotalAmount) as total_sales, COUNT(*) as sales_count
       FROM customer_order
       WHERE DATE(OrderDate) = ?`,
      [date]
    );

    return {
      sales: rows.map(row => ({
        sale_id: row.sale_id,
        sale_date: row.sale_date,
        total_amount: parseFloat(row.total_amount) || 0,
        customer_name: row.customer_name || 'N/A'
      })),
      total_sales: parseFloat(totalRow[0].total_sales) || 0,
      sales_count: parseInt(totalRow[0].sales_count) || 0
    };
  },

  // Get top customers (last 3 months)
  async getTopCustomers() {
    const [rows] = await pool.execute(
      `SELECT c.CustomerID as user_id, c.FirstName as first_name, c.LastName as last_name, c.Email as email,
       CONCAT(c.FirstName, ' ', c.LastName) as name,
       SUM(co.TotalAmount) as total_spent
       FROM customer c
       JOIN customer_order co ON c.CustomerID = co.CustomerID
       WHERE co.OrderDate >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
       GROUP BY c.CustomerID, c.FirstName, c.LastName, c.Email
       ORDER BY total_spent DESC
       LIMIT 5`
    );
    return rows.map(row => ({
      ...row,
      total_spent: parseFloat(row.total_spent) || 0
    }));
  },

  // Get top selling books (last 3 months)
  async getTopBooks() {
    const [rows] = await pool.execute(
      `SELECT b.ISBN as isbn, b.Title as title,
       SUM(ob.Quantity) as copies_sold,
       SUM(ob.Quantity * ob.PriceAtSale) as revenue
       FROM book b
       JOIN order_books ob ON b.ISBN = ob.ISBN
       JOIN customer_order co ON ob.OrderNo = co.OrderNo
       WHERE co.OrderDate >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
       GROUP BY b.ISBN, b.Title
       ORDER BY copies_sold DESC
       LIMIT 10`
    );
    return rows.map(row => ({
      ...row,
      copies_sold: parseInt(row.copies_sold) || 0,
      revenue: parseFloat(row.revenue) || 0
    }));
  }
};
