// Author Model
import pool from '../config/database.js';

export const Author = {
  // Get all authors
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM Authors ORDER BY name'
    );
    return rows;
  },

  // Find author by ID
  async findById(authorId) {
    const [rows] = await pool.execute(
      'SELECT * FROM Authors WHERE author_id = ?',
      [authorId]
    );
    return rows[0] || null;
  },

  // Create author
  async create(authorData) {
    const [result] = await pool.execute(
      'INSERT INTO Authors (name, bio) VALUES (?, ?)',
      [authorData.name, authorData.bio || null]
    );
    return this.findById(result.insertId);
  },

  // Update author
  async update(authorId, authorData) {
    const updates = [];
    const values = [];

    if (authorData.name) {
      updates.push('name = ?');
      values.push(authorData.name);
    }
    if (authorData.bio !== undefined) {
      updates.push('bio = ?');
      values.push(authorData.bio);
    }

    if (updates.length === 0) {
      return this.findById(authorId);
    }

    values.push(authorId);
    await pool.execute(
      `UPDATE Authors SET ${updates.join(', ')} WHERE author_id = ?`,
      values
    );

    return this.findById(authorId);
  }
};

