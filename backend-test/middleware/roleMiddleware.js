// Role-based Authorization Middleware
import { USER_TYPES } from '../config/constants.js';

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  if (req.user.user_type !== USER_TYPES.ADMIN) {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }

  next();
};

export const requireCustomer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  if (req.user.user_type !== USER_TYPES.CUSTOMER) {
    return res.status(403).json({ 
      success: false, 
      message: 'Customer access required' 
    });
  }

  next();
};

