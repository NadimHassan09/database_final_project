-- ============================================
-- Database Triggers
-- Order Processing System
-- ============================================

USE order_processing;

-- ============================================
-- Trigger 1: Prevent Negative Stock
-- ============================================

DROP TRIGGER IF EXISTS `prevent_negative_stock`;
DELIMITER $$
CREATE TRIGGER `prevent_negative_stock` BEFORE UPDATE ON `book` FOR EACH ROW BEGIN
  IF NEW.StockQty < 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Stock cannot be negative';
  END IF;
END
$$
DELIMITER ;

-- ============================================
-- Trigger 2: Reorder Books (Auto-create replenishment order)
-- ============================================

DROP TRIGGER IF EXISTS `reorder_books`;
DELIMITER $$
CREATE TRIGGER `reorder_books` AFTER UPDATE ON `book` FOR EACH ROW BEGIN
  -- Only create order if stock dropped below threshold AND wasn't already below threshold
  -- This prevents duplicate orders when stock is already below threshold
  IF NEW.StockQty < NEW.ThresholdQty AND (OLD.StockQty IS NULL OR OLD.StockQty >= OLD.ThresholdQty) THEN
    -- Check if there's already a pending order for this book to avoid duplicates
    IF NOT EXISTS (
      SELECT 1 FROM order_publisher 
      WHERE ISBN = NEW.ISBN 
      AND Status = 'Pending'
    ) THEN
      INSERT INTO order_publisher(ISBN, PublisherID, AdminID, OrderDate, QuantityOrdered, Status)
      VALUES(NEW.ISBN, NEW.PublisherID, 1, CURDATE(), 20, 'Pending');
    END IF;
  END IF;
END
$$
DELIMITER ;

-- ============================================
-- Trigger 3: Confirm Restock (Add stock when order confirmed)
-- ============================================

DROP TRIGGER IF EXISTS `confirm_restock`;
DELIMITER $$
CREATE TRIGGER `confirm_restock` AFTER UPDATE ON `order_publisher` FOR EACH ROW BEGIN
  -- Only update stock if status changed from something else to 'Confirmed'
  -- This prevents double-updates when stock is already updated explicitly
  IF NEW.Status='Confirmed' AND (OLD.Status IS NULL OR OLD.Status != 'Confirmed') THEN
    UPDATE book
    SET StockQty = StockQty + NEW.QuantityOrdered
    WHERE ISBN = NEW.ISBN;
  END IF;
END
$$
DELIMITER ;

