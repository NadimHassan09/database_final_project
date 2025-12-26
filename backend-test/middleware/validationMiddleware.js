// Validation Middleware

export const validateRegister = (req, res, next) => {
  const { username, password, email, first_name, last_name } = req.body;

  if (!username || username.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Username must be at least 3 characters'
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Valid email is required'
    });
  }

  if (!first_name || !last_name) {
    return res.status(400).json({
      success: false,
      message: 'First name and last name are required'
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }

  next();
};

export const validateBook = (req, res, next) => {
  const { isbn, title, price, publisher_id, authors, author_ids } = req.body;

  if (!isbn || isbn.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Valid ISBN is required (at least 10 characters)'
    });
  }

  if (!title || title.trim().length < 1) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }

  if (!price || parseFloat(price) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Price must be greater than 0'
    });
  }

  if (!publisher_id) {
    return res.status(400).json({
      success: false,
      message: 'Publisher is required'
    });
  }

  // Check for authors (array of author names) or author_ids (for backward compatibility)
  const authorsArray = authors || author_ids;
  
  // Debug log
  if (process.env.NODE_ENV === 'development') {
    console.log('validateBook - authors check:', {
      authors,
      author_ids,
      authorsArray,
      isArray: Array.isArray(authorsArray),
      length: authorsArray?.length
    });
  }
  
  if (!authorsArray || !Array.isArray(authorsArray) || authorsArray.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one author is required'
    });
  }

  // Validate that authors array contains valid strings
  const validAuthors = authorsArray.filter(author => {
    if (typeof author === 'string') {
      return author.trim().length > 0;
    }
    // Allow objects with name property for backward compatibility
    if (typeof author === 'object' && author !== null && author.name) {
      return author.name.trim().length > 0;
    }
    return false;
  });
  
  if (validAuthors.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one valid author name is required'
    });
  }

  next();
};

export const validateCheckout = (req, res, next) => {
  const { payment_method, shipping_address } = req.body;

  if (!payment_method) {
    return res.status(400).json({
      success: false,
      message: 'Payment method is required'
    });
  }

  if (!shipping_address || shipping_address.trim().length < 5) {
    return res.status(400).json({
      success: false,
      message: 'Valid shipping address is required'
    });
  }

  next();
};

