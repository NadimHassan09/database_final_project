// User Model - Works with admin and customer tables
import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import { BCRYPT_SALT_ROUNDS } from '../config/constants.js';

export const User = {
  // Find user by username (checks both admin and customer tables)
  async findByUsername(username) {
    if (!username) {
      return null;
    }

    // Check customer table first (case-insensitive)
    let [rows] = await pool.execute(
      'SELECT CustomerID as user_id, Username as username, Password as password, FirstName as first_name, LastName as last_name, Email as email, Phone as phone, ShippingAddress as shipping_address, "customer" as user_type FROM customer WHERE LOWER(Username) = LOWER(?)',
      [username]
    );
    
    if (rows[0]) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Found user in customer table:', { username, user_id: rows[0].user_id, user_type: rows[0].user_type });
      }
      return rows[0];
    }
    
    // Check admin table (case-insensitive)
    [rows] = await pool.execute(
      'SELECT AdminID as user_id, Username as username, Password as password, Name as first_name, NULL as last_name, NULL as email, NULL as phone, NULL as shipping_address, "admin" as user_type FROM admin WHERE LOWER(Username) = LOWER(?)',
      [username]
    );
    
    if (rows[0]) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Found user in admin table:', { username, user_id: rows[0].user_id, user_type: rows[0].user_type });
      }
      return rows[0];
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('User not found in either table:', { username });
    }
    
    return null;
  },

  // Find user by email (only customers have email)
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT CustomerID as user_id, Username as username, Password as password, FirstName as first_name, LastName as last_name, Email as email, Phone as phone, ShippingAddress as shipping_address, "customer" as user_type FROM customer WHERE Email = ?',
      [email]
    );
    return rows[0] || null;
  },

  // Find user by ID (checks both tables)
  async findById(userId, userType = null) {
    if (userType === 'admin' || !userType) {
      let [rows] = await pool.execute(
        'SELECT AdminID as user_id, Username as username, NULL as email, NULL as phone, Name as first_name, NULL as last_name, "admin" as user_type, NULL as shipping_address FROM admin WHERE AdminID = ?',
        [userId]
      );
      if (rows[0]) return rows[0];
    }
    
    if (userType === 'customer' || !userType) {
      const [rows] = await pool.execute(
        'SELECT CustomerID as user_id, Username as username, Email as email, Phone as phone, FirstName as first_name, LastName as last_name, "customer" as user_type, ShippingAddress as shipping_address FROM customer WHERE CustomerID = ?',
        [userId]
      );
      if (rows[0]) return rows[0];
    }
    
    return null;
  },

  // Create new user (customer only - admins are created separately)
  async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, BCRYPT_SALT_ROUNDS);
    
    const [result] = await pool.execute(
      `INSERT INTO customer (Username, Password, FirstName, LastName, Email, Phone, ShippingAddress)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.username,
        hashedPassword,
        userData.first_name || userData.firstName,
        userData.last_name || userData.lastName,
        userData.email,
        userData.phone || null,
        userData.shipping_address || userData.shippingAddress || null
      ]
    );

    return this.findById(result.insertId, 'customer');
  },

  // Update user
  async update(userId, userType, userData) {
    if (userType === 'admin') {
      const updates = [];
      const values = [];

      if (userData.name || userData.first_name) {
        updates.push('Name = ?');
        values.push(userData.name || userData.first_name);
      }
      if (userData.password) {
        const hashedPassword = await bcrypt.hash(userData.password, BCRYPT_SALT_ROUNDS);
        updates.push('Password = ?');
        values.push(hashedPassword);
      }

      if (updates.length === 0) {
        return this.findById(userId, 'admin');
      }

      values.push(userId);
      await pool.execute(
        `UPDATE admin SET ${updates.join(', ')} WHERE AdminID = ?`,
        values
      );

      return this.findById(userId, 'admin');
    } else {
      // Customer update
      const updates = [];
      const values = [];

      if (userData.first_name || userData.firstName) {
        updates.push('FirstName = ?');
        values.push(userData.first_name || userData.firstName);
      }
      if (userData.last_name || userData.lastName) {
        updates.push('LastName = ?');
        values.push(userData.last_name || userData.lastName);
      }
      if (userData.email) {
        updates.push('Email = ?');
        values.push(userData.email);
      }
      if (userData.phone) {
        updates.push('Phone = ?');
        values.push(userData.phone);
      }
      if (userData.shipping_address !== undefined || userData.shippingAddress !== undefined) {
        updates.push('ShippingAddress = ?');
        values.push(userData.shipping_address || userData.shippingAddress);
      }
      if (userData.password) {
        const hashedPassword = await bcrypt.hash(userData.password, BCRYPT_SALT_ROUNDS);
        updates.push('Password = ?');
        values.push(hashedPassword);
      }

      if (updates.length === 0) {
        return this.findById(userId, 'customer');
      }

      values.push(userId);
      await pool.execute(
        `UPDATE customer SET ${updates.join(', ')} WHERE CustomerID = ?`,
        values
      );

      return this.findById(userId, 'customer');
    }
  },

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    if (!plainPassword || !hashedPassword) {
      throw new Error('Password verification failed: missing password or hash');
    }
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};
