-- ============================================
-- Seed Data for Testing
-- Comprehensive test data for frontend testing
-- ============================================

USE backend_test;

-- ============================================
-- Clear existing data (for testing)
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE SaleItems;
TRUNCATE TABLE Sales;
TRUNCATE TABLE CartItems;
TRUNCATE TABLE Cart;
TRUNCATE TABLE OrderDetails;
TRUNCATE TABLE Orders;
TRUNCATE TABLE Book_Author;
TRUNCATE TABLE Books;
TRUNCATE TABLE Authors;
TRUNCATE TABLE Publishers;
TRUNCATE TABLE Users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Insert Publishers
-- ============================================

INSERT INTO Publishers (name, address, phone_number) VALUES
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
-- Insert Authors
-- ============================================

INSERT INTO Authors (name, bio) VALUES
('J.K. Rowling', 'British author, best known for the Harry Potter fantasy series'),
('George R.R. Martin', 'American novelist and short-story writer, author of A Song of Ice and Fire'),
('Stephen King', 'American author of horror, supernatural fiction, suspense, and fantasy novels'),
('J.R.R. Tolkien', 'English writer, poet, philologist, and academic, best known for The Hobbit and The Lord of the Rings'),
('Agatha Christie', 'English writer known for her detective novels'),
('Jane Austen', 'English novelist known primarily for her six major novels'),
('Ernest Hemingway', 'American novelist, short-story writer, and journalist'),
('F. Scott Fitzgerald', 'American novelist and short story writer'),
('Mark Twain', 'American writer, humorist, entrepreneur, publisher, and lecturer'),
('Charles Dickens', 'English writer and social critic'),
('Isaac Asimov', 'American writer and professor of biochemistry, known for science fiction'),
('Ray Bradbury', 'American author and screenwriter, known for science fiction and fantasy'),
('Toni Morrison', 'American novelist, essayist, book editor, and college professor'),
('Maya Angelou', 'American poet, memoirist, and civil rights activist'),
('Chimamanda Ngozi Adichie', 'Nigerian writer whose works include novels, short stories and nonfiction'),
('Dan Brown', 'American author best known for his thriller novels'),
('John Grisham', 'American novelist, attorney, and politician, known for legal thrillers'),
('James Patterson', 'American author and philanthropist, known for thriller novels'),
('Margaret Atwood', 'Canadian poet, novelist, literary critic, and essayist'),
('Haruki Murakami', 'Japanese writer whose novels, essays, and short stories have been bestsellers'),
('Gabriel García Márquez', 'Colombian novelist, short-story writer, screenwriter and journalist'),
('Paulo Coelho', 'Brazilian lyricist and novelist, best known for The Alchemist'),
('Khaled Hosseini', 'Afghan-American novelist and physician, author of The Kite Runner'),
('Neil Gaiman', 'English author of short fiction, novels, comic books, and graphic novels'),
('Brandon Sanderson', 'American fantasy and science fiction writer');

-- ============================================
-- Insert Users (with hashed passwords)
-- Password for all test users: "password123"
-- NOTE: Run "npm run setup-db" to generate proper bcrypt hashes automatically
-- ============================================

INSERT INTO Users (username, password, email, phone, first_name, last_name, user_type, shipping_address) VALUES
-- Admin users
('admin', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'admin@bookstore.com', '+20-150-170-1022', 'Admin', 'User', 'admin', '123 Admin Street, Alexandria, Egypt'),
('admin2', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'admin2@bookstore.com', '+20-150-170-1023', 'Sarah', 'Johnson', 'admin', '456 Management Ave, Cairo, Egypt'),
('manager', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'manager@bookstore.com', '+20-150-170-1024', 'Michael', 'Chen', 'admin', '789 Operations Road, Giza, Egypt'),

-- Customer users
('john_doe', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'john.doe@email.com', '+20-100-123-4567', 'John', 'Doe', 'customer', '456 Main Street, Alexandria, Egypt'),
('jane_smith', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'jane.smith@email.com', '+20-100-234-5678', 'Jane', 'Smith', 'customer', '789 Oak Avenue, Cairo, Egypt'),
('mike_jones', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'mike.jones@email.com', '+20-100-345-6789', 'Mike', 'Jones', 'customer', '321 Elm Street, Giza, Egypt'),
('emily_wilson', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'emily.wilson@email.com', '+20-100-456-7890', 'Emily', 'Wilson', 'customer', '654 Pine Street, Alexandria, Egypt'),
('david_brown', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'david.brown@email.com', '+20-100-567-8901', 'David', 'Brown', 'customer', '987 Maple Drive, Cairo, Egypt'),
('sarah_davis', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'sarah.davis@email.com', '+20-100-678-9012', 'Sarah', 'Davis', 'customer', '147 Cedar Lane, Giza, Egypt'),
('robert_taylor', '$2b$10$rOzJqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'robert.taylor@email.com', '+20-100-789-0123', 'Robert', 'Taylor', 'customer', '258 Birch Road, Alexandria, Egypt'),
('lisa_anderson', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'lisa.anderson@email.com', '+20-100-890-1234', 'Lisa', 'Anderson', 'customer', '369 Willow Way, Cairo, Egypt'),
('james_martinez', '$2b$10$rOzJqZqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZq', 'james.martinez@email.com', '+20-100-901-2345', 'James', 'Martinez', 'customer', '741 Spruce Street, Giza, Egypt'),
('maria_garcia', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'maria.garcia@email.com', '+20-100-012-3456', 'Maria', 'Garcia', 'customer', '852 Poplar Avenue, Alexandria, Egypt');

-- ============================================
-- Insert Books (50 books)
-- ============================================

INSERT INTO Books (isbn, title, price, publication_year, quantity_in_stock, min_threshold, publisher_id) VALUES
-- Harry Potter Series
('978-0-7475-3269-6', 'Harry Potter and the Philosopher''s Stone', 12.99, 1997, 50, 10, 1),
('978-0-7475-3849-0', 'Harry Potter and the Chamber of Secrets', 12.99, 1998, 45, 10, 1),
('978-0-7475-4215-2', 'Harry Potter and the Prisoner of Azkaban', 13.99, 1999, 40, 10, 1),
('978-0-7475-4624-2', 'Harry Potter and the Goblet of Fire', 14.99, 2000, 35, 10, 1),
('978-0-7475-5100-3', 'Harry Potter and the Order of the Phoenix', 15.99, 2003, 30, 10, 1),

-- Game of Thrones
('978-0-553-57340-3', 'A Game of Thrones', 16.99, 1996, 35, 10, 2),
('978-0-553-57341-0', 'A Clash of Kings', 16.99, 1998, 30, 10, 2),
('978-0-553-57342-7', 'A Storm of Swords', 17.99, 2000, 25, 10, 2),
('978-0-553-57343-4', 'A Feast for Crows', 18.99, 2005, 20, 10, 2),
('978-0-553-57344-1', 'A Dance with Dragons', 19.99, 2011, 15, 10, 2),

-- Stephen King
('978-0-670-81364-2', 'The Shining', 14.99, 1977, 25, 10, 3),
('978-0-345-33968-3', 'It', 15.99, 1986, 20, 10, 3),
('978-0-544-17678-1', 'The Stand', 16.99, 1978, 15, 10, 3),
('978-0-670-81365-9', 'Pet Sematary', 13.99, 1983, 18, 10, 3),
('978-0-670-81366-6', 'Misery', 14.99, 1987, 22, 10, 3),

-- Tolkien
('978-0-544-17678-2', 'The Hobbit', 13.99, 1937, 60, 10, 4),
('978-0-544-17678-3', 'The Lord of the Rings: The Fellowship of the Ring', 17.99, 1954, 55, 10, 4),
('978-0-544-17678-4', 'The Lord of the Rings: The Two Towers', 17.99, 1954, 50, 10, 4),
('978-0-544-17678-5', 'The Lord of the Rings: The Return of the King', 17.99, 1955, 45, 10, 4),

-- Classic Literature
('978-0-14-143951-8', 'Pride and Prejudice', 9.99, 1813, 50, 10, 1),
('978-0-14-143960-0', 'Sense and Sensibility', 9.99, 1811, 45, 10, 1),
('978-0-684-80145-3', 'The Old Man and the Sea', 10.99, 1952, 30, 10, 3),
('978-0-7432-7356-5', 'The Great Gatsby', 11.99, 1925, 40, 10, 2),
('978-0-14-243717-9', 'The Adventures of Huckleberry Finn', 10.99, 1884, 35, 10, 1),
('978-0-14-143956-3', 'A Tale of Two Cities', 9.99, 1859, 30, 10, 1),
('978-0-06-112010-7', 'The Catcher in the Rye', 12.99, 1951, 25, 10, 2),
('978-0-06-112011-4', 'To Kill a Mockingbird', 13.99, 1960, 40, 10, 2),

-- Mystery/Thriller
('978-0-06-112008-4', 'Murder on the Orient Express', 11.99, 1934, 40, 10, 2),
('978-0-06-112009-1', 'And Then There Were None', 11.99, 1939, 35, 10, 2),
('978-0-385-50420-5', 'The Da Vinci Code', 14.99, 2003, 50, 10, 5),
('978-0-385-50421-2', 'Angels & Demons', 14.99, 2000, 45, 10, 5),
('978-0-440-21285-1', 'The Firm', 13.99, 1991, 40, 10, 2),
('978-0-316-69364-3', 'The Pelican Brief', 13.99, 1992, 35, 10, 2),

-- Science Fiction
('978-0-553-29335-7', 'Foundation', 12.99, 1951, 30, 10, 1),
('978-0-345-53857-2', 'Dune', 15.99, 1965, 25, 10, 2),
('978-0-345-53858-9', 'Fahrenheit 451', 11.99, 1953, 35, 10, 2),
('978-0-06-112008-5', 'The Martian', 13.99, 2011, 40, 10, 2),
('978-0-7653-1698-1', 'The Way of Kings', 16.99, 2010, 20, 10, 10),
('978-0-7653-1699-8', 'Words of Radiance', 16.99, 2014, 18, 10, 10),

-- Contemporary Fiction
('978-0-307-26543-2', 'The Kite Runner', 13.99, 2003, 45, 10, 2),
('978-0-307-26544-9', 'A Thousand Splendid Suns', 13.99, 2007, 40, 10, 2),
('978-0-06-112008-6', 'The Alchemist', 12.99, 1988, 60, 10, 2),
('978-0-385-50422-9', 'One Hundred Years of Solitude', 14.99, 1967, 30, 10, 2),
('978-0-06-112008-7', 'Norwegian Wood', 13.99, 1987, 35, 10, 2),
('978-0-06-112008-8', '1Q84', 15.99, 2009, 25, 10, 2),

-- Fantasy
('978-0-06-112008-9', 'American Gods', 14.99, 2001, 30, 10, 2),
('978-0-06-112009-0', 'The Ocean at the End of the Lane', 12.99, 2013, 35, 10, 2),
('978-0-7653-1700-1', 'Mistborn: The Final Empire', 15.99, 2006, 22, 10, 10),
('978-0-06-112009-2', 'The Handmaid''s Tale', 13.99, 1985, 40, 10, 2),
('978-0-06-112009-3', 'Half of a Yellow Sun', 12.99, 2006, 28, 10, 2);

-- ============================================
-- Link Books to Authors (Many-to-Many)
-- ============================================

INSERT INTO Book_Author (book_isbn, author_id) VALUES
-- Harry Potter books
('978-0-7475-3269-6', 1), ('978-0-7475-3849-0', 1), ('978-0-7475-4215-2', 1),
('978-0-7475-4624-2', 1), ('978-0-7475-5100-3', 1),
-- Game of Thrones
('978-0-553-57340-3', 2), ('978-0-553-57341-0', 2), ('978-0-553-57342-7', 2),
('978-0-553-57343-4', 2), ('978-0-553-57344-1', 2),
-- Stephen King
('978-0-670-81364-2', 3), ('978-0-345-33968-3', 3), ('978-0-544-17678-1', 3),
('978-0-670-81365-9', 3), ('978-0-670-81366-6', 3),
-- Tolkien
('978-0-544-17678-2', 4), ('978-0-544-17678-3', 4), ('978-0-544-17678-4', 4),
('978-0-544-17678-5', 4),
-- Agatha Christie
('978-0-06-112008-4', 5), ('978-0-06-112009-1', 5),
-- Jane Austen
('978-0-14-143951-8', 6), ('978-0-14-143960-0', 6),
-- Hemingway
('978-0-684-80145-3', 7),
-- Fitzgerald
('978-0-7432-7356-5', 8),
-- Mark Twain
('978-0-14-243717-9', 9),
-- Dickens
('978-0-14-143956-3', 10),
-- Asimov
('978-0-553-29335-7', 11),
-- Bradbury
('978-0-345-53858-9', 12),
-- Dan Brown
('978-0-385-50420-5', 16), ('978-0-385-50421-2', 16),
-- John Grisham
('978-0-440-21285-1', 17), ('978-0-316-69364-3', 17),
-- Brandon Sanderson
('978-0-7653-1698-1', 25), ('978-0-7653-1699-8', 25), ('978-0-7653-1700-1', 25),
-- Khaled Hosseini
('978-0-307-26543-2', 23), ('978-0-307-26544-9', 23),
-- Paulo Coelho
('978-0-06-112008-6', 22),
-- Gabriel García Márquez
('978-0-385-50422-9', 21),
-- Haruki Murakami
('978-0-06-112008-7', 20), ('978-0-06-112008-8', 20),
-- Neil Gaiman
('978-0-06-112008-9', 24), ('978-0-06-112009-0', 24),
-- Margaret Atwood
('978-0-06-112009-2', 19),
-- Chimamanda Ngozi Adichie
('978-0-06-112009-3', 15);

-- ============================================
-- Insert Sample Replenishment Orders
-- ============================================

INSERT INTO Orders (book_isbn, publisher_id, quantity_ordered, status, expected_delivery_date) VALUES
('978-0-670-81364-2', 3, 20, 'pending', DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
('978-0-345-33968-3', 3, 20, 'pending', DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
('978-0-544-17678-1', 3, 20, 'pending', DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
('978-0-684-80145-3', 3, 20, 'confirmed', DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
('978-0-7653-1698-1', 10, 15, 'pending', DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
('978-0-7653-1699-8', 10, 15, 'pending', DATE_ADD(CURDATE(), INTERVAL 10 DAY)),
('978-0-06-112008-8', 2, 20, 'pending', DATE_ADD(CURDATE(), INTERVAL 12 DAY)),
('978-0-553-57344-1', 2, 20, 'pending', DATE_ADD(CURDATE(), INTERVAL 14 DAY));

-- ============================================
-- Insert Sample Sales (for testing reports)
-- ============================================

INSERT INTO Sales (user_id, sale_date, total_amount, payment_method) VALUES
-- John Doe's purchases
(4, DATE_SUB(CURDATE(), INTERVAL 15 DAY), 45.97, 'credit_card'),
(4, DATE_SUB(CURDATE(), INTERVAL 10 DAY), 28.98, 'credit_card'),
(4, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 31.98, 'credit_card'),
-- Jane Smith's purchases
(5, DATE_SUB(CURDATE(), INTERVAL 20 DAY), 38.97, 'credit_card'),
(5, DATE_SUB(CURDATE(), INTERVAL 12 DAY), 25.98, 'credit_card'),
(5, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 42.97, 'credit_card'),
-- Mike Jones's purchases
(6, DATE_SUB(CURDATE(), INTERVAL 18 DAY), 33.98, 'credit_card'),
(6, DATE_SUB(CURDATE(), INTERVAL 8 DAY), 29.98, 'credit_card'),
-- Emily Wilson's purchases
(7, DATE_SUB(CURDATE(), INTERVAL 14 DAY), 51.96, 'credit_card'),
(7, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 27.98, 'credit_card'),
-- David Brown's purchases
(8, DATE_SUB(CURDATE(), INTERVAL 16 DAY), 39.97, 'credit_card'),
(8, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 35.97, 'credit_card'),
-- Sarah Davis's purchases
(9, DATE_SUB(CURDATE(), INTERVAL 11 DAY), 44.97, 'credit_card'),
-- Robert Taylor's purchases
(10, DATE_SUB(CURDATE(), INTERVAL 9 DAY), 32.98, 'credit_card'),
(10, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 28.98, 'credit_card'),
-- Lisa Anderson's purchases
(11, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 46.97, 'credit_card'),
-- James Martinez's purchases
(12, DATE_SUB(CURDATE(), INTERVAL 13 DAY), 41.97, 'credit_card'),
-- Maria Garcia's purchases
(13, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 37.97, 'credit_card');

-- ============================================
-- Insert Sale Items
-- ============================================

INSERT INTO SaleItems (sale_id, book_isbn, quantity, unit_price) VALUES
-- Sale 1 (John Doe - 15 days ago)
(1, '978-0-7475-3269-6', 2, 12.99),
(1, '978-0-7475-3849-0', 1, 12.99),
(1, '978-0-7475-4215-2', 1, 13.99),
-- Sale 2 (John Doe - 10 days ago)
(2, '978-0-553-57340-3', 1, 16.99),
(2, '978-0-553-57341-0', 1, 16.99),
-- Sale 3 (John Doe - 5 days ago)
(3, '978-0-14-143951-8', 1, 9.99),
(3, '978-0-14-143960-0', 1, 9.99),
(3, '978-0-7432-7356-5', 1, 11.99),
-- Sale 4 (Jane Smith - 20 days ago)
(4, '978-0-14-143951-8', 2, 9.99),
(4, '978-0-14-143960-0', 2, 9.99),
(4, '978-0-7432-7356-5', 1, 11.99),
-- Sale 5 (Jane Smith - 12 days ago)
(5, '978-0-06-112008-4', 1, 11.99),
(5, '978-0-06-112009-1', 1, 11.99),
(5, '978-0-14-143956-3', 1, 9.99),
-- Sale 6 (Jane Smith - 3 days ago)
(6, '978-0-385-50420-5', 1, 14.99),
(6, '978-0-385-50421-2', 1, 14.99),
(6, '978-0-440-21285-1', 1, 13.99),
-- Sale 7 (Mike Jones - 18 days ago)
(7, '978-0-544-17678-2', 1, 13.99),
(7, '978-0-544-17678-3', 1, 17.99),
(7, '978-0-14-243717-9', 1, 10.99),
-- Sale 8 (Mike Jones - 8 days ago)
(8, '978-0-670-81364-2', 1, 14.99),
(8, '978-0-345-33968-3', 1, 15.99),
-- Sale 9 (Emily Wilson - 14 days ago)
(9, '978-0-307-26543-2', 2, 13.99),
(9, '978-0-307-26544-9', 1, 13.99),
(9, '978-0-06-112008-6', 1, 12.99),
-- Sale 10 (Emily Wilson - 6 days ago)
(10, '978-0-06-112008-7', 1, 13.99),
(10, '978-0-06-112008-8', 1, 15.99),
-- Sale 11 (David Brown - 16 days ago)
(11, '978-0-06-112008-9', 1, 14.99),
(11, '978-0-06-112009-0', 1, 12.99),
(11, '978-0-7653-1698-1', 1, 16.99),
-- Sale 12 (David Brown - 4 days ago)
(12, '978-0-7653-1699-8', 1, 16.99),
(12, '978-0-06-112009-2', 1, 13.99),
(12, '978-0-06-112009-3', 1, 12.99),
-- Sale 13 (Sarah Davis - 11 days ago)
(13, '978-0-553-29335-7', 1, 12.99),
(13, '978-0-345-53857-2', 1, 15.99),
(13, '978-0-345-53858-9', 1, 11.99),
(13, '978-0-06-112008-5', 1, 13.99),
-- Sale 14 (Robert Taylor - 9 days ago)
(14, '978-0-06-112010-7', 1, 12.99),
(14, '978-0-06-112011-4', 1, 13.99),
(14, '978-0-14-143956-3', 1, 9.99),
-- Sale 15 (Robert Taylor - 2 days ago)
(15, '978-0-670-81365-9', 1, 13.99),
(15, '978-0-670-81366-6', 1, 14.99),
-- Sale 16 (Lisa Anderson - 7 days ago)
(16, '978-0-7475-4624-2', 1, 14.99),
(16, '978-0-7475-5100-3', 1, 15.99),
(16, '978-0-553-57342-7', 1, 17.99),
-- Sale 17 (James Martinez - 13 days ago)
(17, '978-0-385-50422-9', 1, 14.99),
(17, '978-0-316-69364-3', 1, 13.99),
(17, '978-0-06-112008-6', 1, 12.99),
(17, '978-0-06-112008-7', 1, 13.99),
-- Sale 18 (Maria Garcia - 1 day ago)
(18, '978-0-553-57343-4', 1, 18.99),
(18, '978-0-553-57344-1', 1, 19.99);

-- ============================================
-- Insert Sample Carts (for different users)
-- ============================================

INSERT INTO Cart (user_id) VALUES 
(4), -- John Doe
(5), -- Jane Smith
(7), -- Emily Wilson
(9); -- Sarah Davis

-- ============================================
-- Insert Cart Items
-- ============================================

INSERT INTO CartItems (cart_id, book_isbn, quantity) VALUES
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
