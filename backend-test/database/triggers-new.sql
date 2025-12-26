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
-- Trigger 2: Reorder Books on INSERT (Auto-create replenishment order for new books)
-- ============================================

DROP TRIGGER IF EXISTS `reorder_books_insert`;
DELIMITER $$
CREATE TRIGGER `reorder_books_insert` AFTER INSERT ON `book` FOR EACH ROW BEGIN
  -- Create order if:
  -- 1. Stock is below threshold (NEW.StockQty < NEW.ThresholdQty)
  -- 2. Threshold is greater than 0
  -- 3. PublisherID is not NULL (book must have a publisher)
  -- 4. No pending order already exists for this book
  IF NEW.StockQty < NEW.ThresholdQty 
     AND NEW.ThresholdQty > 0
     AND NEW.PublisherID IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM order_publisher 
       WHERE ISBN = NEW.ISBN 
       AND Status = 'Pending'
     ) THEN
    INSERT INTO order_publisher(ISBN, PublisherID, AdminID, OrderDate, QuantityOrdered, Status)
    VALUES(NEW.ISBN, NEW.PublisherID, 1, CURDATE(), GREATEST(20, NEW.ThresholdQty * 2), 'Pending');
  END IF;
END
$$
DELIMITER ;

-- ============================================
-- Trigger 3: Reorder Books on UPDATE (Auto-create replenishment order when stock changes)
-- ============================================

DROP TRIGGER IF EXISTS `reorder_books`;
DELIMITER $$
CREATE TRIGGER `reorder_books` AFTER UPDATE ON `book` FOR EACH ROW BEGIN
  -- Create order if:
  -- 1. Stock quantity changed (NEW.StockQty != OLD.StockQty)
  -- 2. Stock is now below threshold (NEW.StockQty < NEW.ThresholdQty)
  -- 3. Threshold is greater than 0
  -- 4. PublisherID is not NULL (book must have a publisher)
  -- 5. No pending order already exists for this book
  -- Note: This trigger fires on ANY stock update (admin edit, customer purchase, order confirmation, etc.)
  IF NEW.StockQty != OLD.StockQty
     AND NEW.StockQty < NEW.ThresholdQty 
     AND NEW.ThresholdQty > 0
     AND NEW.PublisherID IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM order_publisher 
       WHERE ISBN = NEW.ISBN 
       AND Status = 'Pending'
     ) THEN
    INSERT INTO order_publisher(ISBN, PublisherID, AdminID, OrderDate, QuantityOrdered, Status)
    VALUES(NEW.ISBN, NEW.PublisherID, 1, CURDATE(), GREATEST(20, NEW.ThresholdQty * 2), 'Pending');
  END IF;
END
$$
DELIMITER ;

-- ============================================
-- Trigger 4: Confirm Restock (Add stock when order confirmed)
-- ============================================

DROP TRIGGER IF EXISTS `confirm_restock`;
DELIMITER $$
CREATE TRIGGER `confirm_restock` AFTER UPDATE ON `order_publisher` FOR EACH ROW BEGIN
  -- Only update stock if status changed from something else to 'Confirmed'
  -- This prevents double-updating if the trigger fires multiple times
  IF NEW.Status = 'Confirmed' AND (OLD.Status IS NULL OR OLD.Status != 'Confirmed') THEN
    UPDATE book
    SET StockQty = StockQty + NEW.QuantityOrdered
    WHERE ISBN = NEW.ISBN;
  END IF;
END
$$
DELIMITER ;

