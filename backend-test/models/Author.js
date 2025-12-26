// Author Model - New Database Structure
// Note: In new DB, author is a junction table (ISBN, AuthorName)
// No separate author entity table
import pool from '../config/database.js';

export const Author = {
  // Get all unique author names
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT DISTINCT AuthorName as name FROM author ORDER BY AuthorName'
    );
    return rows;
  },

  // Find authors by ISBN
  async findByISBN(isbn) {
    const [rows] = await pool.execute(
      'SELECT AuthorName as name FROM author WHERE ISBN = ? ORDER BY AuthorName',
      [isbn]
    );
    return rows;
  },

  // Find books by author name
  async findBooksByAuthor(authorName) {
    const [rows] = await pool.execute(
      'SELECT DISTINCT ISBN FROM author WHERE AuthorName = ?',
      [authorName]
    );
    return rows.map(row => row.ISBN);
  },

  // Create author (adds author-book relationship)
  async create(authorData) {
    // In new structure, we just add the relationship
    if (authorData.isbn && authorData.name) {
      await pool.execute(
        'INSERT INTO author (ISBN, AuthorName) VALUES (?, ?)',
        [authorData.isbn, authorData.name]
      );
      return { name: authorData.name, isbn: authorData.isbn };
    }
    return null;
  },

  // Update author name (updates all relationships)
  async update(oldName, newName) {
    await pool.execute(
      'UPDATE author SET AuthorName = ? WHERE AuthorName = ?',
      [newName, oldName]
    );
    return { name: newName };
  },

  // Delete author-book relationship
  async delete(isbn, authorName) {
    const [result] = await pool.execute(
      'DELETE FROM author WHERE ISBN = ? AND AuthorName = ?',
      [isbn, authorName]
    );
    return result.affectedRows > 0;
  }
};
