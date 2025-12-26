// Publisher Model - New Database Structure
import pool from '../config/database.js';

export const Publisher = {
  // Get all publishers
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT PublisherID as publisher_id, Name as name, Address as address, Phone as phone_number FROM publisher ORDER BY Name'
    );
    return rows;
  },

  // Find publisher by ID
  async findById(publisherId) {
    const [rows] = await pool.execute(
      'SELECT PublisherID as publisher_id, Name as name, Address as address, Phone as phone_number FROM publisher WHERE PublisherID = ?',
      [publisherId]
    );
    return rows[0] || null;
  },

  // Create publisher
  async create(publisherData) {
    const [result] = await pool.execute(
      'INSERT INTO publisher (Name, Address, Phone) VALUES (?, ?, ?)',
      [publisherData.name, publisherData.address || null, publisherData.phone_number || publisherData.phone || null]
    );
    return this.findById(result.insertId);
  },

  // Update publisher
  async update(publisherId, publisherData) {
    const updates = [];
    const values = [];

    if (publisherData.name) {
      updates.push('Name = ?');
      values.push(publisherData.name);
    }
    if (publisherData.address !== undefined) {
      updates.push('Address = ?');
      values.push(publisherData.address);
    }
    if (publisherData.phone_number !== undefined || publisherData.phone !== undefined) {
      updates.push('Phone = ?');
      values.push(publisherData.phone_number || publisherData.phone);
    }

    if (updates.length === 0) {
      return this.findById(publisherId);
    }

    values.push(publisherId);
    await pool.execute(
      `UPDATE publisher SET ${updates.join(', ')} WHERE PublisherID = ?`,
      values
    );

    return this.findById(publisherId);
  }
};
