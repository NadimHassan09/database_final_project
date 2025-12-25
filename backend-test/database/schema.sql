-- ============================================
-- Online Bookstore Database Schema
-- Test Backend - MySQL Database
-- ============================================

-- Create Database
-- Note: Database name will be set by the setup script
-- This file assumes the database already exists

-- ============================================
-- User Management Tables
-- ============================================

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    user_type ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- ============================================
-- Publisher Management
-- ============================================

CREATE TABLE Publishers (
    publisher_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone_number VARCHAR(20),
    INDEX idx_name (name)
);

-- ============================================
-- Author Management
-- ============================================

CREATE TABLE Authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    INDEX idx_name (name)
);

-- ============================================
-- Book Management
-- ============================================

CREATE TABLE Books (
    isbn VARCHAR(20) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    publication_year INT,
    quantity_in_stock INT NOT NULL DEFAULT 0 CHECK (quantity_in_stock >= 0),
    min_threshold INT NOT NULL DEFAULT 10 CHECK (min_threshold >= 0),
    publisher_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (publisher_id) REFERENCES Publishers(publisher_id) ON DELETE SET NULL,
    INDEX idx_title (title),
    INDEX idx_publisher (publisher_id),
    INDEX idx_stock (quantity_in_stock)
);

-- ============================================
-- Book-Author Relationship (Many-to-Many)
-- ============================================

CREATE TABLE Book_Author (
    book_isbn VARCHAR(20),
    author_id INT,
    PRIMARY KEY (book_isbn, author_id),
    FOREIGN KEY (book_isbn) REFERENCES Books(isbn) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES Authors(author_id) ON DELETE CASCADE
);

-- ============================================
-- Replenishment Orders (Admin)
-- ============================================

CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    book_isbn VARCHAR(20) NOT NULL,
    publisher_id INT NOT NULL,
    quantity_ordered INT NOT NULL CHECK (quantity_ordered > 0),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    expected_delivery_date DATE,
    FOREIGN KEY (book_isbn) REFERENCES Books(isbn) ON DELETE CASCADE,
    FOREIGN KEY (publisher_id) REFERENCES Publishers(publisher_id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_order_date (order_date)
);

-- ============================================
-- Order Details (Additional details for orders)
-- ============================================

CREATE TABLE OrderDetails (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    book_isbn VARCHAR(20) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (book_isbn) REFERENCES Books(isbn) ON DELETE CASCADE
);

-- ============================================
-- Shopping Cart
-- ============================================

CREATE TABLE Cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_cart (user_id)
);

-- ============================================
-- Cart Items
-- ============================================

CREATE TABLE CartItems (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    book_isbn VARCHAR(20) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES Cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (book_isbn) REFERENCES Books(isbn) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_book (cart_id, book_isbn)
);

-- ============================================
-- Sales/Transactions
-- ============================================

CREATE TABLE Sales (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(50) DEFAULT 'credit_card',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_sale_date (sale_date),
    INDEX idx_user (user_id)
);

-- ============================================
-- Sale Items
-- ============================================

CREATE TABLE SaleItems (
    sale_item_id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    book_isbn VARCHAR(20) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price > 0),
    FOREIGN KEY (sale_id) REFERENCES Sales(sale_id) ON DELETE CASCADE,
    FOREIGN KEY (book_isbn) REFERENCES Books(isbn) ON DELETE CASCADE,
    INDEX idx_sale (sale_id)
);

