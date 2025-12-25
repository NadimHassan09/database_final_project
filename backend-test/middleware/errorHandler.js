// Global Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error Details:');
  console.error('  Message:', err.message);
  console.error('  Code:', err.code);
  console.error('  SQL State:', err.sqlState);
  console.error('  SQL Message:', err.sqlMessage);
  console.error('  Stack:', err.stack);
  console.error('  Request URL:', req.originalUrl);
  console.error('  Request Method:', req.method);

  // MySQL connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please check if MySQL is running.'
    });
  }

  if (err.code === 'ER_BAD_DB_ERROR') {
    return res.status(500).json({
      success: false,
      message: 'Database does not exist. Please run the setup script.'
    });
  }

  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(500).json({
      success: false,
      message: 'Database access denied. Please check your credentials in .env file.'
    });
  }

  // MySQL errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry. This record already exists.'
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Referenced record does not exist.'
    });
  }

  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete. This record is referenced by other records.'
    });
  }

  // Table doesn't exist error
  if (err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(500).json({
      success: false,
      message: 'Database tables not found. Please run: npm run setup-db in the backend-test directory',
      error: err.sqlMessage || 'Table does not exist',
      hint: 'The database needs to be initialized. Make sure you have run the setup script.'
    });
  }

  // SQL syntax errors
  if (err.code === 'ER_PARSE_ERROR' || err.code === 'ER_SYNTAX_ERROR') {
    return res.status(500).json({
      success: false,
      message: 'Database query error. Please check server logs.',
      ...(process.env.NODE_ENV === 'development' && { details: err.sqlMessage })
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message || 'Validation error'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 Handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

