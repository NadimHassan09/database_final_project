# Bookstore Test Backend

This is a **TEST BACKEND** for the Online Bookstore Order Processing System. It is designed for frontend testing purposes only.

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd backend-test
npm install
```

### 2. Database Setup

**Option A: Automated Setup (Recommended)**
```bash
# Make sure your .env file is configured first
npm run setup-db
```

This script will:
- Create the database
- Run all SQL scripts in order
- Generate proper password hashes for test users

**Option B: Manual Setup**

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE bookstore_test;
   ```

2. **Run SQL Scripts in Order:**
   ```bash
   # Connect to MySQL and run:
   mysql -u root -p bookstore_test < database/schema.sql
   mysql -u root -p bookstore_test < database/constraints.sql
   mysql -u root -p bookstore_test < database/triggers.sql
   mysql -u root -p bookstore_test < database/seed-data.sql
   ```

   Or use MySQL Workbench/phpMyAdmin to execute the files in order.

   **Note:** If you manually run the seed data, you'll need to generate proper bcrypt hashes for the passwords. The seed data uses placeholders that need to be replaced.

### 3. Environment Configuration

Create a `.env` file in the `backend-test` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=backend_test

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=test-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 4. Start the Server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Books
- `GET /api/books` - Get all books (paginated)
- `GET /api/books/search?query=` - Search books
- `GET /api/books/:isbn` - Get book by ISBN
- `POST /api/books` - Create book (Admin only)
- `PUT /api/books/:isbn` - Update book (Admin only)
- `DELETE /api/books/:isbn` - Delete book (Admin only)

### Authors
- `GET /api/authors` - Get all authors
- `GET /api/authors/:id` - Get author by ID
- `POST /api/authors` - Create author (Admin only)
- `PUT /api/authors/:id` - Update author (Admin only)

### Publishers
- `GET /api/publishers` - Get all publishers
- `GET /api/publishers/:id` - Get publisher by ID
- `POST /api/publishers` - Create publisher (Admin only)
- `PUT /api/publishers/:id` - Update publisher (Admin only)

### Orders (Replenishment)
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/:id` - Get order by ID (Admin only)
- `POST /api/orders` - Create order (Admin only)
- `PUT /api/orders/:id/confirm` - Confirm order (Admin only)

### Cart
- `GET /api/cart` - Get user's cart (Customer only)
- `POST /api/cart` - Add item to cart (Customer only)
- `PUT /api/cart/:itemId` - Update cart item (Customer only)
- `DELETE /api/cart/:itemId` - Remove item from cart (Customer only)
- `DELETE /api/cart` - Clear cart (Customer only)

### Checkout
- `POST /api/checkout` - Process checkout (Customer only)
- `GET /api/checkout/order/:orderId` - Get order confirmation

### Customer Orders
- `GET /api/customer-orders` - Get customer's order history (Customer only)
- `GET /api/customer-orders/:orderId` - Get order details (Customer only)

### Reports (Admin only)
- `GET /api/reports/monthly-sales` - Get monthly sales report
- `GET /api/reports/daily-sales?date=YYYY-MM-DD` - Get daily sales report
- `GET /api/reports/top-customers` - Get top customers
- `GET /api/reports/top-books` - Get top selling books
- `GET /api/reports/replenishment-count/:bookId` - Get replenishment count

## 🔐 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## 🧪 Test Users

The seed data includes the following test users:

**Admin:**
- Username: `admin`
- Password: `password123`

**Customers:**
- Username: `john_doe` / Password: `password123`
- Username: `jane_smith` / Password: `password123`
- Username: `mike_jones` / Password: `password123`

## 📝 Notes

- This backend is for **TESTING PURPOSES ONLY**
- All passwords in seed data are hashed with bcrypt
- The database includes triggers for automatic stock management
- CORS is configured to allow requests from the frontend
- JWT tokens expire after 7 days by default

## 🔧 Troubleshooting

**Database Connection Error:**
- Ensure MySQL is running
- Verify database credentials in `.env`
- Check that the database `backend_test` exists

**Port Already in Use:**
- Change the `PORT` in `.env` file
- Or stop the process using port 5000

**CORS Errors:**
- Verify `FRONTEND_URL` in `.env` matches your frontend URL
- Check that the frontend is making requests to the correct API base URL

## 📚 Database Schema

The database includes the following main tables:
- Users (admin and customer accounts)
- Books (with ISBN, title, price, stock)
- Authors (many-to-many with Books)
- Publishers
- Orders (replenishment orders)
- Cart and CartItems
- Sales and SaleItems

See `database/schema.sql` for complete schema details.

