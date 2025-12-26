-- ============================================
-- Seed Data for Order Processing Database
-- ============================================

USE order_processing;

-- ============================================
-- Clear existing data
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE order_books;
TRUNCATE TABLE customer_order;
TRUNCATE TABLE items_cart;
TRUNCATE TABLE shopping_cart;
TRUNCATE TABLE order_publisher;
TRUNCATE TABLE author;
TRUNCATE TABLE book;
TRUNCATE TABLE publisher;
TRUNCATE TABLE customer;
TRUNCATE TABLE admin;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Insert Publishers
-- ============================================

INSERT INTO publisher (Name, Address, Phone) VALUES
('Penguin Random House', '1745 Broadway, New York, NY 10019', '+1-212-782-9000'),
('HarperCollins', '195 Broadway, New York, NY 10007', '+1-212-207-7000'),
('Simon & Schuster', '1230 Avenue of the Americas, New York, NY 10020', '+1-212-698-7000'),
('Macmillan Publishers', '120 Broadway, New York, NY 10271', '+1-646-307-5151'),
('Hachette Book Group', '1290 Avenue of the Americas, New York, NY 10104', '+1-212-364-1100'),
('Scholastic Corporation', '557 Broadway, New York, NY 10012', '+1-212-343-6100'),
('Oxford University Press', '198 Madison Avenue, New York, NY 10016', '+1-212-726-6000'),
('Cambridge University Press', '32 Avenue of the Americas, New York, NY 10013', '+1-212-337-5000'),
('Little, Brown and Company', '1290 Avenue of the Americas, New York, NY 10104', '+1-212-364-1100'),
('Tor Books', '175 Fifth Avenue, New York, NY 10010', '+1-646-307-5151');

-- ============================================
-- Insert Admins
-- Password for all: "password123" (will be hashed by setup script)
-- ============================================

INSERT INTO admin (Username, Password, Name) VALUES
('admin', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Admin User'),
('admin2', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Sarah Johnson'),
('manager', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Michael Chen');

-- ============================================
-- Insert Customers
-- Password for all: "password123" (will be hashed by setup script)
-- ============================================

INSERT INTO customer (Username, Password, FirstName, LastName, Email, Phone, ShippingAddress) VALUES
('john_doe', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZq', 'John', 'Doe', 'john.doe@email.com', '+20-100-123-4567', '456 Main Street, Alexandria, Egypt'),
('jane_smith', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZq', 'Jane', 'Smith', 'jane.smith@email.com', '+20-100-234-5678', '789 Oak Avenue, Cairo, Egypt'),
('mike_jones', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZq', 'Mike', 'Jones', 'mike.jones@email.com', '+20-100-345-6789', '321 Elm Street, Giza, Egypt'),
('emily_wilson', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZq', 'Emily', 'Wilson', 'emily.wilson@email.com', '+20-100-456-7890', '654 Pine Street, Alexandria, Egypt'),
('david_brown', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZq', 'David', 'Brown', 'david.brown@email.com', '+20-100-567-8901', '987 Maple Drive, Cairo, Egypt'),
('sarah_davis', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZq', 'Sarah', 'Davis', 'sarah.davis@email.com', '+20-100-678-9012', '147 Cedar Lane, Giza, Egypt'),
('robert_taylor', '$2b$10$rOzJqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Robert', 'Taylor', 'robert.taylor@email.com', '+20-100-789-0123', '258 Birch Road, Alexandria, Egypt'),
('lisa_anderson', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZq', 'Lisa', 'Anderson', 'lisa.anderson@email.com', '+20-100-890-1234', '369 Willow Way, Cairo, Egypt'),
('james_martinez', '$2b$10$rOzJqZqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZq', 'James', 'Martinez', 'james.martinez@email.com', '+20-100-901-2345', '741 Spruce Street, Giza, Egypt'),
('maria_garcia', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZq', 'Maria', 'Garcia', 'maria.garcia@email.com', '+20-100-012-3456', '852 Poplar Avenue, Alexandria, Egypt');

-- ============================================
-- Insert Books
-- ============================================

INSERT INTO book (ISBN, Title, PublicationYear, Price, Category, StockQty, ThresholdQty, PublisherID) VALUES
-- Harry Potter Series
('978-0-7475-3269-6', 'Harry Potter and the Philosopher''s Stone', 1997, 12.99, 'Art', 50, 10, 1),
('978-0-7475-3849-0', 'Harry Potter and the Chamber of Secrets', 1998, 12.99, 'Art', 45, 10, 1),
('978-0-7475-4215-2', 'Harry Potter and the Prisoner of Azkaban', 1999, 13.99, 'Art', 40, 10, 1),
('978-0-7475-4624-2', 'Harry Potter and the Goblet of Fire', 2000, 14.99, 'Art', 35, 10, 1),
('978-0-7475-5100-3', 'Harry Potter and the Order of the Phoenix', 2003, 15.99, 'Art', 30, 10, 1),

-- Game of Thrones
('978-0-553-57340-3', 'A Game of Thrones', 1996, 16.99, 'Art', 35, 10, 2),
('978-0-553-57341-0', 'A Clash of Kings', 1998, 16.99, 'Art', 30, 10, 2),
('978-0-553-57342-7', 'A Storm of Swords', 2000, 17.99, 'Art', 25, 10, 2),
('978-0-553-57343-4', 'A Feast for Crows', 2005, 18.99, 'Art', 20, 10, 2),
('978-0-553-57344-1', 'A Dance with Dragons', 2011, 19.99, 'Art', 15, 10, 2),

-- Stephen King
('978-0-670-81364-2', 'The Shining', 1977, 14.99, 'Art', 25, 10, 3),
('978-0-345-33968-3', 'It', 1986, 15.99, 'Art', 20, 10, 3),
('978-0-544-17678-1', 'The Stand', 1978, 16.99, 'Art', 15, 10, 3),
('978-0-670-81365-9', 'Pet Sematary', 1983, 13.99, 'Art', 18, 10, 3),
('978-0-670-81366-6', 'Misery', 1987, 14.99, 'Art', 22, 10, 3),

-- Tolkien
('978-0-544-17678-2', 'The Hobbit', 1937, 13.99, 'Art', 60, 10, 4),
('978-0-544-17678-3', 'The Lord of the Rings: The Fellowship of the Ring', 1954, 17.99, 'Art', 55, 10, 4),
('978-0-544-17678-4', 'The Lord of the Rings: The Two Towers', 1954, 17.99, 'Art', 50, 10, 4),
('978-0-544-17678-5', 'The Lord of the Rings: The Return of the King', 1955, 17.99, 'Art', 45, 10, 4),

-- Classic Literature
('978-0-14-143951-8', 'Pride and Prejudice', 1813, 9.99, 'Art', 50, 10, 1),
('978-0-14-143960-0', 'Sense and Sensibility', 1811, 9.99, 'Art', 45, 10, 1),
('978-0-684-80145-3', 'The Old Man and the Sea', 1952, 10.99, 'Art', 30, 10, 3),
('978-0-7432-7356-5', 'The Great Gatsby', 1925, 11.99, 'Art', 40, 10, 2),
('978-0-14-243717-9', 'The Adventures of Huckleberry Finn', 1884, 10.99, 'Art', 35, 10, 1),
('978-0-14-143956-3', 'A Tale of Two Cities', 1859, 9.99, 'History', 30, 10, 1),
('978-0-06-112010-7', 'The Catcher in the Rye', 1951, 12.99, 'Art', 25, 10, 2),
('978-0-06-112011-4', 'To Kill a Mockingbird', 1960, 13.99, 'Art', 40, 10, 2),

-- Mystery/Thriller
('978-0-06-112008-4', 'Murder on the Orient Express', 1934, 11.99, 'Art', 40, 10, 2),
('978-0-06-112009-1', 'And Then There Were None', 1939, 11.99, 'Art', 35, 10, 2),
('978-0-385-50420-5', 'The Da Vinci Code', 2003, 14.99, 'Art', 50, 10, 5),
('978-0-385-50421-2', 'Angels & Demons', 2000, 14.99, 'Art', 45, 10, 5),
('978-0-440-21285-1', 'The Firm', 1991, 13.99, 'Art', 40, 10, 2),
('978-0-316-69364-3', 'The Pelican Brief', 1992, 13.99, 'Art', 35, 10, 2),

-- Science Fiction
('978-0-553-29335-7', 'Foundation', 1951, 12.99, 'Science', 30, 10, 1),
('978-0-345-53857-2', 'Dune', 1965, 15.99, 'Science', 25, 10, 2),
('978-0-345-53858-9', 'Fahrenheit 451', 1953, 11.99, 'Science', 35, 10, 2),
('978-0-06-112008-5', 'The Martian', 2011, 13.99, 'Science', 40, 10, 2),
('978-0-7653-1698-1', 'The Way of Kings', 2010, 16.99, 'Art', 20, 10, 10),
('978-0-7653-1699-8', 'Words of Radiance', 2014, 16.99, 'Art', 18, 10, 10),

-- Contemporary Fiction
('978-0-307-26543-2', 'The Kite Runner', 2003, 13.99, 'Art', 45, 10, 2),
('978-0-307-26544-9', 'A Thousand Splendid Suns', 2007, 13.99, 'Art', 40, 10, 2),
('978-0-06-112008-6', 'The Alchemist', 1988, 12.99, 'Art', 60, 10, 2),
('978-0-385-50422-9', 'One Hundred Years of Solitude', 1967, 14.99, 'Art', 30, 10, 2),
('978-0-06-112008-7', 'Norwegian Wood', 1987, 13.99, 'Art', 35, 10, 2),
('978-0-06-112008-8', '1Q84', 2009, 15.99, 'Art', 25, 10, 2),

-- Fantasy
('978-0-06-112008-9', 'American Gods', 2001, 14.99, 'Art', 30, 10, 2),
('978-0-06-112009-0', 'The Ocean at the End of the Lane', 2013, 12.99, 'Art', 35, 10, 2),
('978-0-7653-1700-1', 'Mistborn: The Final Empire', 2006, 15.99, 'Art', 22, 10, 10),
('978-0-06-112009-2', 'The Handmaid''s Tale', 1985, 13.99, 'Art', 40, 10, 2),
('978-0-06-112009-3', 'Half of a Yellow Sun', 2006, 12.99, 'History', 28, 10, 2);

-- ============================================
-- Insert Authors (Many-to-Many with Books)
-- ============================================

INSERT INTO author (ISBN, AuthorName) VALUES
-- Harry Potter books
('978-0-7475-3269-6', 'J.K. Rowling'),
('978-0-7475-3849-0', 'J.K. Rowling'),
('978-0-7475-4215-2', 'J.K. Rowling'),
('978-0-7475-4624-2', 'J.K. Rowling'),
('978-0-7475-5100-3', 'J.K. Rowling'),
-- Game of Thrones
('978-0-553-57340-3', 'George R.R. Martin'),
('978-0-553-57341-0', 'George R.R. Martin'),
('978-0-553-57342-7', 'George R.R. Martin'),
('978-0-553-57343-4', 'George R.R. Martin'),
('978-0-553-57344-1', 'George R.R. Martin'),
-- Stephen King
('978-0-670-81364-2', 'Stephen King'),
('978-0-345-33968-3', 'Stephen King'),
('978-0-544-17678-1', 'Stephen King'),
('978-0-670-81365-9', 'Stephen King'),
('978-0-670-81366-6', 'Stephen King'),
-- Tolkien
('978-0-544-17678-2', 'J.R.R. Tolkien'),
('978-0-544-17678-3', 'J.R.R. Tolkien'),
('978-0-544-17678-4', 'J.R.R. Tolkien'),
('978-0-544-17678-5', 'J.R.R. Tolkien'),
-- Agatha Christie
('978-0-06-112008-4', 'Agatha Christie'),
('978-0-06-112009-1', 'Agatha Christie'),
-- Jane Austen
('978-0-14-143951-8', 'Jane Austen'),
('978-0-14-143960-0', 'Jane Austen'),
-- Hemingway
('978-0-684-80145-3', 'Ernest Hemingway'),
-- Fitzgerald
('978-0-7432-7356-5', 'F. Scott Fitzgerald'),
-- Mark Twain
('978-0-14-243717-9', 'Mark Twain'),
-- Dickens
('978-0-14-143956-3', 'Charles Dickens'),
-- Asimov
('978-0-553-29335-7', 'Isaac Asimov'),
-- Bradbury
('978-0-345-53858-9', 'Ray Bradbury'),
-- Dan Brown
('978-0-385-50420-5', 'Dan Brown'),
('978-0-385-50421-2', 'Dan Brown'),
-- John Grisham
('978-0-440-21285-1', 'John Grisham'),
('978-0-316-69364-3', 'John Grisham'),
-- Brandon Sanderson
('978-0-7653-1698-1', 'Brandon Sanderson'),
('978-0-7653-1699-8', 'Brandon Sanderson'),
('978-0-7653-1700-1', 'Brandon Sanderson'),
-- Khaled Hosseini
('978-0-307-26543-2', 'Khaled Hosseini'),
('978-0-307-26544-9', 'Khaled Hosseini'),
-- Paulo Coelho
('978-0-06-112008-6', 'Paulo Coelho'),
-- Gabriel García Márquez
('978-0-385-50422-9', 'Gabriel García Márquez'),
-- Haruki Murakami
('978-0-06-112008-7', 'Haruki Murakami'),
('978-0-06-112008-8', 'Haruki Murakami'),
-- Neil Gaiman
('978-0-06-112008-9', 'Neil Gaiman'),
('978-0-06-112009-0', 'Neil Gaiman'),
-- Margaret Atwood
('978-0-06-112009-2', 'Margaret Atwood'),
-- Chimamanda Ngozi Adichie
('978-0-06-112009-3', 'Chimamanda Ngozi Adichie');

-- ============================================
-- Insert Sample Replenishment Orders (order_publisher)
-- ============================================

INSERT INTO order_publisher (ISBN, PublisherID, AdminID, OrderDate, QuantityOrdered, Status) VALUES
('978-0-670-81364-2', 3, 1, CURDATE(), 20, 'Pending'),
('978-0-345-33968-3', 3, 1, CURDATE(), 20, 'Pending'),
('978-0-544-17678-1', 3, 1, CURDATE(), 20, 'Pending'),
('978-0-684-80145-3', 3, 1, CURDATE(), 20, 'Confirmed'),
('978-0-7653-1698-1', 10, 1, CURDATE(), 15, 'Pending'),
('978-0-7653-1699-8', 10, 1, CURDATE(), 15, 'Pending'),
('978-0-06-112008-8', 2, 1, CURDATE(), 20, 'Pending'),
('978-0-553-57344-1', 2, 1, CURDATE(), 20, 'Pending');

-- ============================================
-- Insert Sample Customer Orders
-- ============================================

INSERT INTO customer_order (CustomerID, OrderDate, TotalAmount, PaymentCard, ExpiryDate) VALUES
(1, DATE_SUB(CURDATE(), INTERVAL 15 DAY), 45.97, '1234-5678-9012-3456', '12/25'),
(1, DATE_SUB(CURDATE(), INTERVAL 10 DAY), 28.98, '1234-5678-9012-3456', '12/25'),
(1, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 31.98, '1234-5678-9012-3456', '12/25'),
(2, DATE_SUB(CURDATE(), INTERVAL 20 DAY), 38.97, '2345-6789-0123-4567', '06/26'),
(2, DATE_SUB(CURDATE(), INTERVAL 12 DAY), 25.98, '2345-6789-0123-4567', '06/26'),
(2, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 42.97, '2345-6789-0123-4567', '06/26'),
(3, DATE_SUB(CURDATE(), INTERVAL 18 DAY), 33.98, '3456-7890-1234-5678', '09/26'),
(3, DATE_SUB(CURDATE(), INTERVAL 8 DAY), 29.98, '3456-7890-1234-5678', '09/26'),
(4, DATE_SUB(CURDATE(), INTERVAL 14 DAY), 51.96, '4567-8901-2345-6789', '03/27'),
(4, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 27.98, '4567-8901-2345-6789', '03/27'),
(5, DATE_SUB(CURDATE(), INTERVAL 16 DAY), 39.97, '5678-9012-3456-7890', '08/27'),
(5, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 35.97, '5678-9012-3456-7890', '08/27'),
(6, DATE_SUB(CURDATE(), INTERVAL 11 DAY), 44.97, '6789-0123-4567-8901', '11/27'),
(7, DATE_SUB(CURDATE(), INTERVAL 9 DAY), 32.98, '7890-1234-5678-9012', '02/28'),
(7, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 28.98, '7890-1234-5678-9012', '02/28'),
(8, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 46.97, '8901-2345-6789-0123', '05/28'),
(9, DATE_SUB(CURDATE(), INTERVAL 13 DAY), 41.97, '9012-3456-7890-1234', '07/28'),
(10, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 37.97, '0123-4567-8901-2345', '10/28');

-- ============================================
-- Insert Order Books (Items in customer orders)
-- ============================================

INSERT INTO order_books (OrderNo, ISBN, Quantity, PriceAtSale) VALUES
-- Order 1 (John Doe - 15 days ago)
(1, '978-0-7475-3269-6', 2, 12.99),
(1, '978-0-7475-3849-0', 1, 12.99),
(1, '978-0-7475-4215-2', 1, 13.99),
-- Order 2 (John Doe - 10 days ago)
(2, '978-0-553-57340-3', 1, 16.99),
(2, '978-0-553-57341-0', 1, 16.99),
-- Order 3 (John Doe - 5 days ago)
(3, '978-0-14-143951-8', 1, 9.99),
(3, '978-0-14-143960-0', 1, 9.99),
(3, '978-0-7432-7356-5', 1, 11.99),
-- Order 4 (Jane Smith - 20 days ago)
(4, '978-0-14-143951-8', 2, 9.99),
(4, '978-0-14-143960-0', 2, 9.99),
(4, '978-0-7432-7356-5', 1, 11.99),
-- Order 5 (Jane Smith - 12 days ago)
(5, '978-0-06-112008-4', 1, 11.99),
(5, '978-0-06-112009-1', 1, 11.99),
(5, '978-0-14-143956-3', 1, 9.99),
-- Order 6 (Jane Smith - 3 days ago)
(6, '978-0-385-50420-5', 1, 14.99),
(6, '978-0-385-50421-2', 1, 14.99),
(6, '978-0-440-21285-1', 1, 13.99),
-- Order 7 (Mike Jones - 18 days ago)
(7, '978-0-544-17678-2', 1, 13.99),
(7, '978-0-544-17678-3', 1, 17.99),
(7, '978-0-14-243717-9', 1, 10.99),
-- Order 8 (Mike Jones - 8 days ago)
(8, '978-0-670-81364-2', 1, 14.99),
(8, '978-0-345-33968-3', 1, 15.99),
-- Order 9 (Emily Wilson - 14 days ago)
(9, '978-0-307-26543-2', 2, 13.99),
(9, '978-0-307-26544-9', 1, 13.99),
(9, '978-0-06-112008-6', 1, 12.99),
-- Order 10 (Emily Wilson - 6 days ago)
(10, '978-0-06-112008-7', 1, 13.99),
(10, '978-0-06-112008-8', 1, 15.99),
-- Order 11 (David Brown - 16 days ago)
(11, '978-0-06-112008-9', 1, 14.99),
(11, '978-0-06-112009-0', 1, 12.99),
(11, '978-0-7653-1698-1', 1, 16.99),
-- Order 12 (David Brown - 4 days ago)
(12, '978-0-7653-1699-8', 1, 16.99),
(12, '978-0-06-112009-2', 1, 13.99),
(12, '978-0-06-112009-3', 1, 12.99),
-- Order 13 (Sarah Davis - 11 days ago)
(13, '978-0-553-29335-7', 1, 12.99),
(13, '978-0-345-53857-2', 1, 15.99),
(13, '978-0-345-53858-9', 1, 11.99),
(13, '978-0-06-112008-5', 1, 13.99),
-- Order 14 (Robert Taylor - 9 days ago)
(14, '978-0-06-112010-7', 1, 12.99),
(14, '978-0-06-112011-4', 1, 13.99),
(14, '978-0-14-143956-3', 1, 9.99),
-- Order 15 (Robert Taylor - 2 days ago)
(15, '978-0-670-81365-9', 1, 13.99),
(15, '978-0-670-81366-6', 1, 14.99),
-- Order 16 (Lisa Anderson - 7 days ago)
(16, '978-0-7475-4624-2', 1, 14.99),
(16, '978-0-7475-5100-3', 1, 15.99),
(16, '978-0-553-57342-7', 1, 17.99),
-- Order 17 (James Martinez - 13 days ago)
(17, '978-0-385-50422-9', 1, 14.99),
(17, '978-0-316-69364-3', 1, 13.99),
(17, '978-0-06-112008-6', 1, 12.99),
(17, '978-0-06-112008-7', 1, 13.99),
-- Order 18 (Maria Garcia - 1 day ago)
(18, '978-0-553-57343-4', 1, 18.99),
(18, '978-0-553-57344-1', 1, 19.99);

-- ============================================
-- Insert Sample Shopping Carts
-- ============================================

INSERT INTO shopping_cart (CustomerID) VALUES 
(1), -- John Doe
(2), -- Jane Smith
(4), -- Emily Wilson
(6); -- Sarah Davis

-- ============================================
-- Insert Cart Items
-- ============================================

INSERT INTO items_cart (CartID, ISBN, Quantity) VALUES
-- John Doe's cart
(1, '978-0-670-81364-2', 2),
(1, '978-0-345-33968-3', 1),
(1, '978-0-06-112008-9', 1),
-- Jane Smith's cart
(2, '978-0-06-112009-2', 1),
(2, '978-0-06-112009-3', 1),
(2, '978-0-7653-1700-1', 2),
-- Emily Wilson's cart
(3, '978-0-7475-3269-6', 1),
(3, '978-0-7475-3849-0', 1),
-- Sarah Davis's cart
(4, '978-0-385-50420-5', 1),
(4, '978-0-385-50421-2', 1),
(4, '978-0-440-21285-1', 1);

