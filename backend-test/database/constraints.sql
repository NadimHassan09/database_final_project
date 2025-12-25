-- ============================================
-- Database Constraints
-- Additional constraints and indexes
-- ============================================

-- Note: Most constraints are already defined in schema.sql
-- This file only adds additional indexes for performance

-- Additional indexes for performance (only if they don't exist)
-- Note: MySQL doesn't support IF NOT EXISTS for indexes, so errors are handled in the setup script
CREATE INDEX idx_books_publication_year ON Books(publication_year);
CREATE INDEX idx_sales_user_date ON Sales(user_id, sale_date);
CREATE INDEX idx_cart_items_cart ON CartItems(cart_id);
CREATE INDEX idx_order_details_order ON OrderDetails(order_id);

-- Additional indexes for performance
CREATE INDEX idx_books_publication_year ON Books(publication_year);
CREATE INDEX idx_sales_user_date ON Sales(user_id, sale_date);
CREATE INDEX idx_cart_items_cart ON CartItems(cart_id);
CREATE INDEX idx_order_details_order ON OrderDetails(order_id);

