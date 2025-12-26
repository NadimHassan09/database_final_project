// Authentication Controller
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment.js';
import { validateRegister, validateLogin } from '../middleware/validationMiddleware.js';

export const register = async (req, res, next) => {
  try {
    const { username, password, email, phone, first_name, last_name, shipping_address } = req.body;

    // Check if username exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Check if email exists
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create user
    const newUser = await User.create({
      username,
      password,
      email,
      phone,
      first_name,
      last_name,
      shipping_address,
      user_type: 'customer'
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: newUser.user_id,
        username: newUser.username,
        user_type: newUser.user_type
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user (searches both admin and customer tables)
    const user = await User.findByUsername(username);
    if (!user) {
      console.log('Login failed: User not found', { username });
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Debug: Log user object keys to help diagnose
    if (process.env.NODE_ENV === 'development') {
      console.log('User found:', { 
        username: user.username, 
        user_id: user.user_id, 
        user_type: user.user_type,
        has_password: !!user.password 
      });
    }

    // Check if password exists
    if (!user.password) {
      console.error('User found but password is missing:', { 
        username, 
        user_id: user.user_id,
        user_type: user.user_type,
        user_keys: Object.keys(user)
      });
      return res.status(500).json({
        success: false,
        message: 'User data error. Please contact support.'
      });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      console.log('Login failed: Invalid password', { username });
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        user_type: user.user_type
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    // Remove password from response and ensure all fields are present
    const { password: _, ...userWithoutPassword } = user;
    
    // Ensure user object has all required fields
    const userResponse = {
      user_id: userWithoutPassword.user_id,
      username: userWithoutPassword.username,
      user_type: userWithoutPassword.user_type,
      first_name: userWithoutPassword.first_name || null,
      last_name: userWithoutPassword.last_name || null,
      email: userWithoutPassword.email || null,
      phone: userWithoutPassword.phone || null,
      shipping_address: userWithoutPassword.shipping_address || null
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('Login successful:', { 
        username: userResponse.username, 
        user_type: userResponse.user_type,
        user_id: userResponse.user_id
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

export const logout = async (req, res) => {
  // Since we're using JWT, logout is handled client-side by removing the token
  // But we can still provide a response
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await User.update(req.user.user_id, req.user.user_type, req.body);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};

