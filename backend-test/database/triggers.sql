-- ============================================
-- Database Triggers
-- Business Logic Automation
-- ============================================

USE bookstore_test;

-- ============================================
-- Trigger 1: Prevent Negative Stock on Update
-- ============================================

DELIMITER $$

CREATE TRIGGER before_books_update_quantity
BEFORE UPDATE ON Books
FOR EACH ROW
BEGIN
    IF NEW.quantity_in_stock < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock quantity cannot be negative';
    END IF;
END$$

-- ============================================
-- Trigger 2: Auto-create Replenishment Order
-- When stock falls below threshold
-- ============================================

CREATE TRIGGER after_books_update_stock
AFTER UPDATE ON Books
FOR EACH ROW
BEGIN
    IF NEW.quantity_in_stock < NEW.min_threshold AND 
       OLD.quantity_in_stock >= OLD.min_threshold AND
       NEW.publisher_id IS NOT NULL THEN
        INSERT INTO Orders (
            book_isbn,
            publisher_id,
            quantity_ordered,
            status,
            expected_delivery_date
        ) VALUES (
            NEW.isbn,
            NEW.publisher_id,
            NEW.min_threshold * 2, -- Order 2x the threshold
            'pending',
            DATE_ADD(CURDATE(), INTERVAL 14 DAY)
        );
    END IF;
END$$

-- ============================================
-- Trigger 3: Validate Order Quantity
-- ============================================

CREATE TRIGGER before_orders_insert
BEFORE INSERT ON Orders
FOR EACH ROW
BEGIN
    IF NEW.quantity_ordered <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Order quantity must be greater than 0';
    END IF;
END$$

CREATE TRIGGER before_orders_update
BEFORE UPDATE ON Orders
FOR EACH ROW
BEGIN
    IF NEW.quantity_ordered <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Order quantity must be greater than 0';
    END IF;
END$$

-- ============================================
-- Trigger 4: Confirm Order - Add Stock
-- When order status changes to 'confirmed'
-- ============================================

CREATE TRIGGER after_orders_confirm
AFTER UPDATE ON Orders
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        UPDATE Books
        SET quantity_in_stock = quantity_in_stock + NEW.quantity_ordered,
            updated_at = CURRENT_TIMESTAMP
        WHERE isbn = NEW.book_isbn;
    END IF;
END$$

-- ============================================
-- Trigger 5: Prevent Book Deletion with Active Orders
-- ============================================

CREATE TRIGGER before_books_delete
BEFORE DELETE ON Books
FOR EACH ROW
BEGIN
    DECLARE order_count INT;
    SELECT COUNT(*) INTO order_count
    FROM Orders
    WHERE book_isbn = OLD.isbn AND status = 'pending';
    
    IF order_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete book with pending orders';
    END IF;
END$$

-- ============================================
-- Trigger 6: Update Cart Updated_at
-- ============================================

CREATE TRIGGER after_cart_items_insert
AFTER INSERT ON CartItems
FOR EACH ROW
BEGIN
    UPDATE Cart
    SET updated_at = CURRENT_TIMESTAMP
    WHERE cart_id = NEW.cart_id;
END$$

CREATE TRIGGER after_cart_items_update
AFTER UPDATE ON CartItems
FOR EACH ROW
BEGIN
    UPDATE Cart
    SET updated_at = CURRENT_TIMESTAMP
    WHERE cart_id = NEW.cart_id;
END$$

CREATE TRIGGER after_cart_items_delete
AFTER DELETE ON CartItems
FOR EACH ROW
BEGIN
    UPDATE Cart
    SET updated_at = CURRENT_TIMESTAMP
    WHERE cart_id = OLD.cart_id;
END$$

-- ============================================
-- Trigger 7: Deduct Stock on Sale
-- ============================================

CREATE TRIGGER after_sale_items_insert
AFTER INSERT ON SaleItems
FOR EACH ROW
BEGIN
    UPDATE Books
    SET quantity_in_stock = quantity_in_stock - NEW.quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE isbn = NEW.book_isbn;
END$$

DELIMITER ;

