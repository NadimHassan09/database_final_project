// Book Model - New Database Structure
import pool from '../config/database.js';

export const Book = {
  // Get all books with pagination
  async findAll(page = 1, limit = 12) {
    const offset = (page - 1) * limit;
    
    const [rows] = await pool.execute(
      `SELECT b.*, p.Name as publisher_name,
       GROUP_CONCAT(DISTINCT a.AuthorName ORDER BY a.AuthorName SEPARATOR '||') as authors_data
       FROM book b
       LEFT JOIN publisher p ON b.PublisherID = p.PublisherID
       LEFT JOIN author a ON b.ISBN = a.ISBN
       GROUP BY b.ISBN
       ORDER BY b.ISBN DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    // Parse authors into array format
    const books = rows.map(book => {
      if (book.authors_data) {
        book.authors = book.authors_data.split('||').map(name => ({ name }));
        book.authors_string = book.authors.map(a => a.name).join(', ');
      } else {
        book.authors = [];
        book.authors_string = '';
      }
      delete book.authors_data;
      
      // Map to frontend-expected format
      return {
        isbn: book.ISBN,
        title: book.Title,
        publication_year: book.PublicationYear,
        price: parseFloat(book.Price) || 0,
        category: book.Category,
        stock_qty: book.StockQty, // New database field name
        quantity_in_stock: book.StockQty, // Backward compatibility
        min_threshold: book.ThresholdQty,
        publisher_id: book.PublisherID,
        publisher_name: book.publisher_name,
        authors: book.authors,
        authors_string: book.authors_string
      };
    });

    const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM book');
    const total = parseInt(countRows[0].total);

    return {
      books,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  },

  // Find book by ISBN
  async findByISBN(isbn) {
    const [rows] = await pool.execute(
      `SELECT b.*, p.Name as publisher_name, p.PublisherID,
       GROUP_CONCAT(DISTINCT a.AuthorName SEPARATOR '||') as authors_data
       FROM book b
       LEFT JOIN publisher p ON b.PublisherID = p.PublisherID
       LEFT JOIN author a ON b.ISBN = a.ISBN
       WHERE b.ISBN = ?
       GROUP BY b.ISBN`,
      [isbn]
    );

    if (!rows[0]) return null;

    const book = rows[0];
    // Parse authors
    if (book.authors_data) {
      book.authors = book.authors_data.split('||').map(name => ({ name }));
      book.authors_string = book.authors.map(a => a.name).join(', ');
    } else {
      book.authors = [];
      book.authors_string = '';
    }
    delete book.authors_data;

    // Map to frontend-expected format
    return {
      isbn: book.ISBN,
      title: book.Title,
      publication_year: book.PublicationYear,
      price: parseFloat(book.Price) || 0,
      category: book.Category,
      stock_qty: book.StockQty, // New database field name
      quantity_in_stock: book.StockQty, // Backward compatibility
      min_threshold: book.ThresholdQty,
      publisher_id: book.PublisherID,
      publisher_name: book.publisher_name,
      authors: book.authors,
      authors_string: book.authors_string
    };
  },

  // Search books
  async search(query, filters = {}) {
    let sql = `
      SELECT DISTINCT b.*, p.Name as publisher_name,
      GROUP_CONCAT(DISTINCT a.AuthorName ORDER BY a.AuthorName SEPARATOR '||') as authors_data
      FROM book b
      LEFT JOIN publisher p ON b.PublisherID = p.PublisherID
      LEFT JOIN author a ON b.ISBN = a.ISBN
      WHERE 1=1
    `;
    const values = [];

    if (query) {
      sql += ` AND (b.Title LIKE ? OR b.ISBN LIKE ? OR a.AuthorName LIKE ?)`;
      const searchTerm = `%${query}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.category) {
      sql += ` AND b.Category = ?`;
      values.push(filters.category);
    }

    if (filters.publisherId) {
      sql += ` AND b.PublisherID = ?`;
      values.push(filters.publisherId);
    }

    sql += ` GROUP BY b.ISBN ORDER BY b.Title`;

    const [rows] = await pool.execute(sql, values);
    
    // Parse authors into array format
    return rows.map(book => {
      if (book.authors_data) {
        book.authors = book.authors_data.split('||').map(name => ({ name }));
        book.authors_string = book.authors.map(a => a.name).join(', ');
      } else {
        book.authors = [];
        book.authors_string = '';
      }
      delete book.authors_data;
      
      // Map to frontend-expected format
      return {
        isbn: book.ISBN,
        title: book.Title,
        publication_year: book.PublicationYear,
        price: parseFloat(book.Price) || 0,
        category: book.Category,
        stock_qty: book.StockQty, // New database field name
        quantity_in_stock: book.StockQty, // Backward compatibility
        min_threshold: book.ThresholdQty,
        publisher_id: book.PublisherID,
        publisher_name: book.publisher_name,
        authors: book.authors,
        authors_string: book.authors_string
      };
    });
  },

  // Create book
  async create(bookData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert book
      await connection.execute(
        `INSERT INTO book (ISBN, Title, PublicationYear, Price, Category, StockQty, ThresholdQty, PublisherID)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bookData.isbn,
          bookData.title,
          bookData.publication_year || null,
          bookData.price,
          bookData.category || null,
          bookData.quantity_in_stock || bookData.stockQty || 0,
          bookData.min_threshold || bookData.thresholdQty || 10,
          bookData.publisher_id || bookData.publisherId
        ]
      );

      // Insert book-author relationships
      if (bookData.authors && Array.isArray(bookData.authors)) {
        const authorValues = bookData.authors.map(authorName => [bookData.isbn, authorName]);
        await connection.query(
          'INSERT INTO author (ISBN, AuthorName) VALUES ?',
          [authorValues]
        );
      }

      await connection.commit();
      return this.findByISBN(bookData.isbn);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Update book
  async update(isbn, bookData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const updates = [];
      const values = [];

      if (bookData.title) {
        updates.push('Title = ?');
        values.push(bookData.title);
      }
      if (bookData.price !== undefined) {
        updates.push('Price = ?');
        values.push(bookData.price);
      }
      if (bookData.publication_year !== undefined) {
        updates.push('PublicationYear = ?');
        values.push(bookData.publication_year);
      }
      if (bookData.category) {
        updates.push('Category = ?');
        values.push(bookData.category);
      }
      if (bookData.quantity_in_stock !== undefined || bookData.stockQty !== undefined) {
        updates.push('StockQty = ?');
        values.push(bookData.quantity_in_stock || bookData.stockQty);
      }
      if (bookData.min_threshold !== undefined || bookData.thresholdQty !== undefined) {
        updates.push('ThresholdQty = ?');
        values.push(bookData.min_threshold || bookData.thresholdQty);
      }
      if (bookData.publisher_id || bookData.publisherId) {
        updates.push('PublisherID = ?');
        values.push(bookData.publisher_id || bookData.publisherId);
      }

      if (updates.length > 0) {
        values.push(isbn);
        await connection.execute(
          `UPDATE book SET ${updates.join(', ')} WHERE ISBN = ?`,
          values
        );
      }

      // Update authors if provided
      if (bookData.authors && Array.isArray(bookData.authors)) {
        // Delete existing relationships
        await connection.execute(
          'DELETE FROM author WHERE ISBN = ?',
          [isbn]
        );

        // Insert new relationships
        if (bookData.authors.length > 0) {
          const authorValues = bookData.authors.map(authorName => [isbn, authorName]);
          await connection.query(
            'INSERT INTO author (ISBN, AuthorName) VALUES ?',
            [authorValues]
          );
        }
      }

      await connection.commit();
      return this.findByISBN(isbn);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Delete book
  async delete(isbn) {
    const [result] = await pool.execute(
      'DELETE FROM book WHERE ISBN = ?',
      [isbn]
    );
    return result.affectedRows > 0;
  }
};
