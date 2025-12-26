-- ============================================
-- Order Processing Database Schema
-- New Database Structure
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS order_processing;
USE order_processing;

-- ============================================
-- Admin Table
-- ============================================

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `AdminID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`AdminID`),
  UNIQUE KEY `Username` (`Username`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- Publisher Table
-- ============================================

DROP TABLE IF EXISTS `publisher`;
CREATE TABLE IF NOT EXISTS `publisher` (
  `PublisherID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Address` varchar(200) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`PublisherID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- Book Table
-- ============================================

DROP TABLE IF EXISTS `book`;
CREATE TABLE IF NOT EXISTS `book` (
  `ISBN` varchar(20) NOT NULL,
  `Title` varchar(200) NOT NULL,
  `PublicationYear` int DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `Category` enum('Science','Art','Religion','History','Geography') DEFAULT NULL,
  `StockQty` int DEFAULT '0',
  `ThresholdQty` int DEFAULT '0',
  `PublisherID` int NOT NULL,
  PRIMARY KEY (`ISBN`),
  KEY `fk_book_publisher` (`PublisherID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- Author Table (Many-to-Many with Book)
-- ============================================

DROP TABLE IF EXISTS `author`;
CREATE TABLE IF NOT EXISTS `author` (
  `AuthorName` varchar(100) NOT NULL,
  `ISBN` varchar(20) NOT NULL,
  PRIMARY KEY (`ISBN`,`AuthorName`),
  KEY `ISBN` (`ISBN`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- Customer Table
-- ============================================

DROP TABLE IF EXISTS `customer`;
CREATE TABLE IF NOT EXISTS `customer` (
  `CustomerID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `FirstName` varchar(100) DEFAULT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `ShippingAddress` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`CustomerID`),
  UNIQUE KEY `Username` (`Username`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- Shopping Cart Table
-- ============================================

DROP TABLE IF EXISTS `shopping_cart`;
CREATE TABLE IF NOT EXISTS `shopping_cart` (
  `CartID` int NOT NULL AUTO_INCREMENT,
  `CustomerID` int NOT NULL,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`CartID`),
  KEY `CustomerID` (`CustomerID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- Items Cart Table
-- ============================================

DROP TABLE IF EXISTS `items_cart`;
CREATE TABLE IF NOT EXISTS `items_cart` (
  `CartID` int NOT NULL,
  `ISBN` varchar(20) NOT NULL,
  `Quantity` int NOT NULL,
  PRIMARY KEY (`CartID`,`ISBN`),
  KEY `ISBN` (`ISBN`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- Customer Order Table
-- ============================================

DROP TABLE IF EXISTS `customer_order`;
CREATE TABLE IF NOT EXISTS `customer_order` (
  `OrderNo` int NOT NULL AUTO_INCREMENT,
  `CustomerID` int NOT NULL,
  `OrderDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `TotalAmount` decimal(10,2) DEFAULT NULL,
  `PaymentCard` varchar(20) DEFAULT NULL,
  `ExpiryDate` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`OrderNo`),
  KEY `CustomerID` (`CustomerID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- Order Books Table
-- ============================================

DROP TABLE IF EXISTS `order_books`;
CREATE TABLE IF NOT EXISTS `order_books` (
  `OrderNo` int NOT NULL,
  `ISBN` varchar(20) NOT NULL,
  `Quantity` int NOT NULL,
  `PriceAtSale` decimal(10,2) NOT NULL,
  PRIMARY KEY (`OrderNo`,`ISBN`),
  KEY `ISBN` (`ISBN`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- Order Publisher Table (Replenishment Orders)
-- ============================================

DROP TABLE IF EXISTS `order_publisher`;
CREATE TABLE IF NOT EXISTS `order_publisher` (
  `OrderID` int NOT NULL AUTO_INCREMENT,
  `ISBN` varchar(20) NOT NULL,
  `PublisherID` int NOT NULL,
  `AdminID` int NOT NULL,
  `OrderDate` date DEFAULT NULL,
  `QuantityOrdered` int DEFAULT NULL,
  `Status` enum('Pending','Confirmed') DEFAULT 'Pending',
  PRIMARY KEY (`OrderID`),
  KEY `ISBN` (`ISBN`),
  KEY `PublisherID` (`PublisherID`),
  KEY `AdminID` (`AdminID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

