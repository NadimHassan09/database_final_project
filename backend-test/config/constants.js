// Application Constants

export const USER_TYPES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
};

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal'
};

export const DEFAULT_MIN_THRESHOLD = 10;
export const DEFAULT_ORDER_QUANTITY_MULTIPLIER = 2; // Order 2x the threshold

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
export const JWT_EXPIRES_IN = '7d';

export const BCRYPT_SALT_ROUNDS = 10;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100
};

