// Sale Model
import pool from '../config/database.js';

export const Sale = {
  // Create sale with items
  async createSale(saleData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Create sale
      const [saleResult] = await connection.execute(
        `INSERT INTO Sales (user_id, total_amount, payment_method)
         VALUES (?, ?, ?)`,
        [
          saleData.user_id,
          saleData.total_amount,
          saleData.payment_method || 'credit_card'
        ]
      );

      const saleId = saleResult.insertId;

      // Create sale items
      if (saleData.items && saleData.items.length > 0) {
        const itemValues = saleData.items.map(item => [
          saleId,
          item.book_isbn,
          item.quantity,
          item.unit_price
        ]);

        await connection.query(
          'INSERT INTO SaleItems (sale_id, book_isbn, quantity, unit_price) VALUES ?',
          [itemValues]
        );
      }

      await connection.commit();

      return this.findById(saleId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Find sale by ID
  async findById(saleId) {
    const [rows] = await pool.execute(
      `SELECT s.*, u.first_name, u.last_name, u.email, u.shipping_address
       FROM Sales s
       LEFT JOIN Users u ON s.user_id = u.user_id
       WHERE s.sale_id = ?`,
      [saleId]
    );

    if (!rows[0]) return null;

    const sale = rows[0];

    // Get sale items
    const [items] = await pool.execute(
      `SELECT si.*, b.title as book_title, b.isbn as book_isbn
       FROM SaleItems si
       JOIN Books b ON si.book_isbn = b.isbn
       WHERE si.sale_id = ?
       ORDER BY si.sale_item_id`,
      [saleId]
    );

    sale.items = items || [];
    return sale;
  },

  // Get customer orders
  async findByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT s.*, u.shipping_address
       FROM Sales s
       LEFT JOIN Users u ON s.user_id = u.user_id
       WHERE s.user_id = ?
       ORDER BY s.sale_date DESC`,
      [userId]
    );

    // Get items for each sale
    for (let sale of rows) {
      const [items] = await pool.execute(
        `SELECT si.*, b.title as book_title, b.isbn as book_isbn
         FROM SaleItems si
         JOIN Books b ON si.book_isbn = b.isbn
         WHERE si.sale_id = ?
         ORDER BY si.sale_item_id`,
        [sale.sale_id]
      );
      sale.items = items || [];
    }

    return rows;
  },

  // Get monthly sales report
  async getMonthlySales() {
    const [rows] = await pool.execute(
      `SELECT s.*, u.first_name, u.last_name,
       CONCAT(u.first_name, ' ', u.last_name) as customer_name
       FROM Sales s
       LEFT JOIN Users u ON s.user_id = u.user_id
       WHERE MONTH(s.sale_date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
       AND YEAR(s.sale_date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
       ORDER BY s.sale_date DESC`
    );

    const [totalRow] = await pool.execute(
      `SELECT SUM(total_amount) as total_sales, COUNT(*) as sales_count
       FROM Sales
       WHERE MONTH(sale_date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
       AND YEAR(sale_date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))`
    );

    return {
      sales: rows,
      total_sales: totalRow[0].total_sales || 0,
      sales_count: totalRow[0].sales_count || 0
    };
  },

  // Get daily sales report
  async getDailySales(date) {
    const [rows] = await pool.execute(
      `SELECT s.*, u.first_name, u.last_name,
       CONCAT(u.first_name, ' ', u.last_name) as customer_name
       FROM Sales s
       LEFT JOIN Users u ON s.user_id = u.user_id
       WHERE DATE(s.sale_date) = ?
       ORDER BY s.sale_date DESC`,
      [date]
    );

    const [totalRow] = await pool.execute(
      `SELECT SUM(total_amount) as total_sales, COUNT(*) as sales_count
       FROM Sales
       WHERE DATE(sale_date) = ?`,
      [date]
    );

    return {
      sales: rows,
      total_sales: totalRow[0].total_sales || 0,
      sales_count: totalRow[0].sales_count || 0
    };
  },

  // Get top customers (last 3 months)
  async getTopCustomers() {
    const [rows] = await pool.execute(
      `SELECT u.user_id, u.first_name, u.last_name, u.email,
       CONCAT(u.first_name, ' ', u.last_name) as name,
       SUM(s.total_amount) as total_spent
       FROM Users u
       JOIN Sales s ON u.user_id = s.user_id
       WHERE s.sale_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
       GROUP BY u.user_id, u.first_name, u.last_name, u.email
       ORDER BY total_spent DESC
       LIMIT 5`
    );
    return rows;
  },

  // Get top selling books (last 3 months)
  async getTopBooks() {
    const [rows] = await pool.execute(
      `SELECT b.isbn, b.title,
       SUM(si.quantity) as copies_sold,
       SUM(si.quantity * si.unit_price) as revenue
       FROM Books b
       JOIN SaleItems si ON b.isbn = si.book_isbn
       JOIN Sales s ON si.sale_id = s.sale_id
       WHERE s.sale_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
       GROUP BY b.isbn, b.title
       ORDER BY copies_sold DESC
       LIMIT 10`
    );
    return rows;
  },

  // Get replenishment count for a book
  async getReplenishmentCount(bookISBN) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM Orders WHERE book_isbn = ?',
      [bookISBN]
    );
    return rows[0].count;
  }
};

