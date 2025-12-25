// Publisher Model
import pool from '../config/database.js';

export const Publisher = {
  // Get all publishers
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM Publishers ORDER BY name'
    );
    return rows;
  },

  // Find publisher by ID
  async findById(publisherId) {
    const [rows] = await pool.execute(
      'SELECT * FROM Publishers WHERE publisher_id = ?',
      [publisherId]
    );
    return rows[0] || null;
  },

  // Create publisher
  async create(publisherData) {
    const [result] = await pool.execute(
      'INSERT INTO Publishers (name, address, phone_number) VALUES (?, ?, ?)',
      [publisherData.name, publisherData.address || null, publisherData.phone_number || null]
    );
    return this.findById(result.insertId);
  },

  // Update publisher
  async update(publisherId, publisherData) {
    const updates = [];
    const values = [];

    if (publisherData.name) {
      updates.push('name = ?');
      values.push(publisherData.name);
    }
    if (publisherData.address !== undefined) {
      updates.push('address = ?');
      values.push(publisherData.address);
    }
    if (publisherData.phone_number !== undefined) {
      updates.push('phone_number = ?');
      values.push(publisherData.phone_number);
    }

    if (updates.length === 0) {
      return this.findById(publisherId);
    }

    values.push(publisherId);
    await pool.execute(
      `UPDATE Publishers SET ${updates.join(', ')} WHERE publisher_id = ?`,
      values
    );

    return this.findById(publisherId);
  }
};

