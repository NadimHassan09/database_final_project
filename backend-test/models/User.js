// User Model
import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import { BCRYPT_SALT_ROUNDS } from '../config/constants.js';

export const User = {
  // Find user by username
  async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT * FROM Users WHERE username = ?',
      [username]
    );
    return rows[0] || null;
  },

  // Find user by email
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  // Find user by ID
  async findById(userId) {
    const [rows] = await pool.execute(
      'SELECT user_id, username, email, phone, first_name, last_name, user_type, shipping_address, created_at FROM Users WHERE user_id = ?',
      [userId]
    );
    return rows[0] || null;
  },

  // Create new user
  async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, BCRYPT_SALT_ROUNDS);
    
    const [result] = await pool.execute(
      `INSERT INTO Users (username, password, email, phone, first_name, last_name, user_type, shipping_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.username,
        hashedPassword,
        userData.email,
        userData.phone || null,
        userData.first_name,
        userData.last_name,
        userData.user_type || 'customer',
        userData.shipping_address || null
      ]
    );

    return this.findById(result.insertId);
  },

  // Update user
  async update(userId, userData) {
    const updates = [];
    const values = [];

    if (userData.first_name) {
      updates.push('first_name = ?');
      values.push(userData.first_name);
    }
    if (userData.last_name) {
      updates.push('last_name = ?');
      values.push(userData.last_name);
    }
    if (userData.email) {
      updates.push('email = ?');
      values.push(userData.email);
    }
    if (userData.phone) {
      updates.push('phone = ?');
      values.push(userData.phone);
    }
    if (userData.shipping_address !== undefined) {
      updates.push('shipping_address = ?');
      values.push(userData.shipping_address);
    }
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, BCRYPT_SALT_ROUNDS);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return this.findById(userId);
    }

    values.push(userId);
    await pool.execute(
      `UPDATE Users SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    return this.findById(userId);
  },

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

