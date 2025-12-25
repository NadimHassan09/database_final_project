// Book Model
import pool from '../config/database.js';

export const Book = {
  // Get all books with pagination
  async findAll(page = 1, limit = 12) {
    const offset = (page - 1) * limit;
    
    const [rows] = await pool.execute(
      `SELECT b.*, p.name as publisher_name,
       GROUP_CONCAT(DISTINCT CONCAT(a.author_id, ':', a.name) ORDER BY a.name SEPARATOR '||') as authors_data
       FROM Books b
       LEFT JOIN Publishers p ON b.publisher_id = p.publisher_id
       LEFT JOIN Book_Author ba ON b.isbn = ba.book_isbn
       LEFT JOIN Authors a ON ba.author_id = a.author_id
       GROUP BY b.isbn
       ORDER BY b.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    // Parse authors into array format
    const books = rows.map(book => {
      if (book.authors_data) {
        book.authors = book.authors_data.split('||').map(authorStr => {
          const [id, name] = authorStr.split(':');
          return { author_id: parseInt(id), name };
        });
        // Also keep as string for backward compatibility
        book.authors_string = book.authors.map(a => a.name).join(', ');
      } else {
        book.authors = [];
        book.authors_string = '';
      }
      delete book.authors_data;
      return book;
    });

    const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM Books');
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
      `SELECT b.*, p.name as publisher_name, p.publisher_id,
       GROUP_CONCAT(DISTINCT CONCAT(a.author_id, ':', a.name) SEPARATOR '||') as authors_data
       FROM Books b
       LEFT JOIN Publishers p ON b.publisher_id = p.publisher_id
       LEFT JOIN Book_Author ba ON b.isbn = ba.book_isbn
       LEFT JOIN Authors a ON ba.author_id = a.author_id
       WHERE b.isbn = ?
       GROUP BY b.isbn`,
      [isbn]
    );

    if (!rows[0]) return null;

    const book = rows[0];
    // Parse authors
    if (book.authors_data) {
      book.authors = book.authors_data.split('||').map(authorStr => {
        const [id, name] = authorStr.split(':');
        return { author_id: parseInt(id), name };
      });
    } else {
      book.authors = [];
    }
    delete book.authors_data;

    return book;
  },

  // Search books
  async search(query, filters = {}) {
    let sql = `
      SELECT DISTINCT b.*, p.name as publisher_name,
      GROUP_CONCAT(DISTINCT CONCAT(a.author_id, ':', a.name) ORDER BY a.name SEPARATOR '||') as authors_data
      FROM Books b
      LEFT JOIN Publishers p ON b.publisher_id = p.publisher_id
      LEFT JOIN Book_Author ba ON b.isbn = ba.book_isbn
      LEFT JOIN Authors a ON ba.author_id = a.author_id
      WHERE 1=1
    `;
    const values = [];

    if (query) {
      sql += ` AND (b.title LIKE ? OR b.isbn LIKE ? OR a.name LIKE ?)`;
      const searchTerm = `%${query}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.category) {
      // Category filtering would need a category field or table
      // For now, skip if not in schema
    }

    if (filters.authorId) {
      sql += ` AND a.author_id = ?`;
      values.push(filters.authorId);
    }

    if (filters.publisherId) {
      sql += ` AND b.publisher_id = ?`;
      values.push(filters.publisherId);
    }

    sql += ` GROUP BY b.isbn ORDER BY b.title`;

    const [rows] = await pool.execute(sql, values);
    
    // Parse authors into array format
    return rows.map(book => {
      if (book.authors_data) {
        book.authors = book.authors_data.split('||').map(authorStr => {
          const [id, name] = authorStr.split(':');
          return { author_id: parseInt(id), name };
        });
        book.authors_string = book.authors.map(a => a.name).join(', ');
      } else {
        book.authors = [];
        book.authors_string = '';
      }
      delete book.authors_data;
      return book;
    });
  },

  // Create book
  async create(bookData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert book
      await connection.execute(
        `INSERT INTO Books (isbn, title, price, publication_year, quantity_in_stock, min_threshold, publisher_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          bookData.isbn,
          bookData.title,
          bookData.price,
          bookData.publication_year || null,
          bookData.quantity_in_stock || 0,
          bookData.min_threshold || 10,
          bookData.publisher_id
        ]
      );

      // Insert book-author relationships
      if (bookData.author_ids && bookData.author_ids.length > 0) {
        const authorValues = bookData.author_ids.map(authorId => [bookData.isbn, authorId]);
        await connection.query(
          'INSERT INTO Book_Author (book_isbn, author_id) VALUES ?',
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
        updates.push('title = ?');
        values.push(bookData.title);
      }
      if (bookData.price) {
        updates.push('price = ?');
        values.push(bookData.price);
      }
      if (bookData.publication_year) {
        updates.push('publication_year = ?');
        values.push(bookData.publication_year);
      }
      if (bookData.quantity_in_stock !== undefined) {
        updates.push('quantity_in_stock = ?');
        values.push(bookData.quantity_in_stock);
      }
      if (bookData.min_threshold !== undefined) {
        updates.push('min_threshold = ?');
        values.push(bookData.min_threshold);
      }
      if (bookData.publisher_id) {
        updates.push('publisher_id = ?');
        values.push(bookData.publisher_id);
      }

      if (updates.length > 0) {
        values.push(isbn);
        await connection.execute(
          `UPDATE Books SET ${updates.join(', ')} WHERE isbn = ?`,
          values
        );
      }

      // Update authors if provided
      if (bookData.author_ids && Array.isArray(bookData.author_ids)) {
        // Delete existing relationships
        await connection.execute(
          'DELETE FROM Book_Author WHERE book_isbn = ?',
          [isbn]
        );

        // Insert new relationships
        if (bookData.author_ids.length > 0) {
          const authorValues = bookData.author_ids.map(authorId => [isbn, authorId]);
          await connection.query(
            'INSERT INTO Book_Author (book_isbn, author_id) VALUES ?',
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
      'DELETE FROM Books WHERE isbn = ?',
      [isbn]
    );
    return result.affectedRows > 0;
  }
};

