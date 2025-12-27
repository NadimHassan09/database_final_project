# User Interface Screen Logic Documentation

This document describes the logic and functionality of each user interface screen in the Bookstore Application.

---

## Table of Contents

1. [Public Screens](#public-screens)
2. [Customer Screens](#customer-screens)
3. [Admin Screens](#admin-screens)
4. [Common Components](#common-components)

---

## Public Screens

### Home Page (`/`)
**Component:** `pages/Home.jsx`

**Logic:**
- Displays the hero header component at the top
- Shows a book browser component that displays all available books
- Books are fetched from the backend and displayed in a grid layout
- Each book card shows: title, authors, price, stock status
- Users can click "View Details" to navigate to the book details page
- Non-authenticated users can browse books but cannot add to cart
- Authenticated customers can add books to cart directly from this page
- Admin users see the same view but without "Add to Cart" buttons

**Key Features:**
- Public access (no authentication required)
- Responsive grid layout for book cards
- Real-time stock status indicators
- Navigation to book details page

---

### Login Page (`/login`)
**Component:** `components/Auth/Login.jsx`

**Logic:**
- Displays a login form with username and password fields
- Validates that both username and password are provided
- On successful validation, calls the authentication service
- Uses AuthContext to handle login state
- On successful login:
  - Stores JWT token and user data in localStorage
  - Updates AuthContext with user information
  - Redirects based on user type:
    - Admin users → `/admin`
    - Customer users → `/customer`
- Displays error messages if login fails
- Shows loading spinner during authentication process
- Clears previous errors when user starts typing

**Key Features:**
- Form validation (required fields)
- Error handling and display
- Role-based redirection
- Persistent authentication via JWT tokens

---

### Register Page (`/register`)
**Component:** `components/Auth/Register.jsx`

**Logic:**
- Displays registration form with fields:
  - Username (required, unique)
  - Email (required, valid email format)
  - Password (required, minimum 6 characters)
  - Confirm Password (must match password)
  - Phone (optional)
  - First Name (required)
  - Last Name (required)
- Validates all fields before submission:
  - Username uniqueness check
  - Email format validation
  - Password strength validation
  - Password confirmation match
- On successful registration:
  - Creates new customer account in database
  - Automatically logs in the new user
  - Redirects to customer dashboard
- Displays validation errors for each field
- Shows success/error notifications

**Key Features:**
- Comprehensive form validation
- Real-time field validation feedback
- Automatic login after registration
- Password confirmation matching

---

## Customer Screens

### Customer Dashboard (`/customer`)
**Component:** `components/Customer/Dashboard.jsx`

**Logic:**
- Displays welcome message with user's name
- Shows overview of customer account
- Provides quick navigation links to:
  - Browse Books
  - View Cart
  - Order History
  - Profile Settings
- Protected route (requires authentication)
- Redirects non-authenticated users to login page

**Key Features:**
- Personalized welcome message
- Quick access to main features
- Protected access

---

### Browse Books (`/customer/books`)
**Component:** `components/Customer/BookBrowser.jsx`

**Logic:**
- Fetches all books from the backend API
- Displays books in a responsive grid layout (3-4 columns)
- Each book card shows:
  - Book title
  - Author(s) names
  - Price (formatted as currency)
  - Stock status badge (In Stock, Low Stock, Out of Stock)
- Provides "View Details" button for each book
- Provides "Add to Cart" button (only for customers, hidden for admins)
- "Add to Cart" button is disabled when book is out of stock
- Handles stock status calculation based on quantity and threshold
- Protected route (requires authentication)
- Uses pagination if there are many books

**Key Features:**
- Real-time stock status
- Add to cart functionality
- Responsive grid layout
- Pagination support
- Admin view without cart buttons

---

### Book Search (`/customer/search`)
**Component:** `components/Customer/BookSearch.jsx`

**Logic:**
- Public route (no authentication required)
- Accepts search query from URL parameter (`?q=searchterm`)
- Searches books by:
  - Title
  - Author name
  - ISBN
- Displays search results in grid layout similar to Browse Books
- Shows "Found X books" message with result count
- Displays "No results found" message if search returns empty
- Provides "Browse All Books" button to return to full catalog
- Each result card has same functionality as Browse Books page
- Real-time search as user types in search bar (if integrated)

**Key Features:**
- Multi-field search (title, author, ISBN)
- URL-based search queries
- Empty state handling
- Same book card functionality as Browse page

---

### Book Details (`/customer/books/:isbn`)
**Component:** `components/Customer/BookDetails.jsx`

**Logic:**
- Fetches book details by ISBN from URL parameter
- Displays comprehensive book information:
  - Title
  - Author(s)
  - ISBN (in database format)
  - Price
  - Publication year
  - Publisher name
  - Stock quantity
  - Minimum threshold (for admins)
  - Stock status badge
- For Customers:
  - Shows quantity selector (1 to available stock)
  - "Add to Cart" button (disabled if out of stock)
  - "View Cart" button
- For Admins:
  - Shows "Create Replenishment Order" form
  - Order quantity input field
  - "Create Replenishment Order" button
  - "View Replenishment Orders" button
- Validates quantity before adding to cart
- Listens for order confirmation events to refresh book data
- Card width set to 60% of screen, centered
- Minimum height of 100vh for better layout

**Key Features:**
- Detailed book information display
- Role-based action buttons
- Quantity validation
- Real-time stock updates
- Replenishment order creation (admin only)

---

### Shopping Cart (`/customer/cart`)
**Component:** `components/Customer/Cart.jsx`

**Logic:**
- Fetches cart items from CartContext
- Displays cart items in a table format showing:
  - Book title and authors (no image)
  - Price per unit
  - Quantity (editable input field)
  - Subtotal (price × quantity)
  - Remove button
- Validates quantity changes:
  - Minimum: 1
  - Maximum: Available stock
- Updates cart via API when quantity changes
- Removes items from cart with confirmation
- Provides "Clear Cart" button (with confirmation dialog)
- Shows order summary sidebar:
  - Subtotal
  - Tax (currently $0.00)
  - Total
- Provides "Proceed to Checkout" button
- Provides "Continue Shopping" button
- Shows empty cart message if no items
- Protected route (requires authentication)

**Key Features:**
- Real-time quantity updates
- Stock validation
- Order summary calculation
- Empty state handling
- Navigation to checkout

---

### Checkout (`/customer/checkout`)
**Component:** `components/Customer/Checkout.jsx`

**Logic:**
- Displays checkout form with payment and shipping information:
  - Credit card number (validated format)
  - Card holder name (required)
  - Expiry date (MM/YY format)
  - CVV (3-4 digits)
  - Shipping address (pre-filled from profile, required)
- Shows order summary:
  - List of cart items with quantities and prices
  - Subtotal
  - Tax
  - Total
- Validates all form fields before submission:
  - Credit card number format
  - Card holder name (required)
  - Expiry date format (MM/YY)
  - CVV format (3-4 digits)
  - Shipping address (required)
- On successful checkout:
  - Creates order in database
  - Processes payment (simulated)
  - Clears shopping cart
  - Shows success notification
  - Redirects to order confirmation page
- Prevents checkout if cart is empty
- Shows loading state during processing
- Protected route (requires authentication)

**Key Features:**
- Comprehensive form validation
- Payment information collection
- Order creation and processing
- Cart clearing after successful order
- Order confirmation redirect

---

### Order History (`/customer/orders`)
**Component:** `components/Customer/OrderHistory.jsx`

**Logic:**
- Fetches all orders for the logged-in customer
- Displays orders in a table format showing:
  - Order number
  - Order date
  - Total amount
  - Status
- Provides expandable order details:
  - Shipping address
  - Customer name
  - Order items (book ISBN, quantity, unit price, subtotal)
  - Order total
- Supports viewing specific order by ID (`/customer/orders/:orderId`)
- Shows loading spinner while fetching data
- Displays error message if orders fail to load
- Shows empty state if no orders exist
- Protected route (requires authentication)

**Key Features:**
- Complete order history
- Expandable order details
- Order item breakdown
- Date and amount formatting
- Empty state handling

---

### Customer Profile (`/customer/profile`)
**Component:** `components/Customer/Profile.jsx`

**Logic:**
- Displays two sections: Profile Information and Change Password

**Profile Information Section:**
- Shows form with editable fields:
  - First Name (required)
  - Last Name (required)
  - Email (required, validated format)
  - Phone (optional, validated format)
  - Shipping Address (textarea)
- Pre-fills form with current user data from AuthContext
- Validates all fields before submission
- Shows confirmation modal before saving changes:
  - Lists all changed fields (old value → new value)
  - Shows "No changes detected" if nothing changed
  - Requires user confirmation to proceed
- On confirmation:
  - Updates profile via API
  - Updates AuthContext with new user data
  - Shows success notification
- Syncs form data when user object changes

**Change Password Section:**
- Shows form with fields:
  - Current Password (required)
  - New Password (required, minimum 6 characters)
  - Confirm New Password (required, must match new password)
- Validates password requirements and matching
- Shows confirmation modal before changing password:
  - Asks for confirmation
  - Requires user confirmation to proceed
- On confirmation:
  - Verifies current password
  - Updates password in database
  - Clears password form fields
  - Shows success notification
- Protected route (requires authentication)

**Key Features:**
- Two-section layout (Profile & Password)
- Confirmation modals for both actions
- Real-time form validation
- Change tracking and display
- Password verification
- Automatic form synchronization

---

## Admin Screens

### Admin Dashboard (`/admin`)
**Component:** `components/Admin/Dashboard.jsx`

**Logic:**
- Displays welcome message with admin's name
- Shows dashboard statistics cards:
  - Total Books (mock data: 1250)
  - Total Orders (mock data: 342)
  - Total Sales (mock data: $45,678.90)
  - Pending Orders (mock data: 12)
- Uses AdminLayout component with sidebar navigation
- Sidebar contains navigation buttons:
  - Dashboard (current page)
  - Books
  - Orders
  - Reports
- Protected route (requires admin authentication)
- Redirects non-admin users to home page

**Key Features:**
- Overview statistics display
- Sidebar navigation
- Admin-only access
- Welcome message

---

### Book Management (`/admin/books`)
**Component:** `components/Admin/BookMangement.jsx`

**Logic:**
- Fetches all books from backend with pagination
- Displays books in a table format showing:
  - ISBN
  - Title
  - Author(s)
  - Price
  - Stock Quantity
  - Stock Status (In Stock, Low Stock, Out of Stock)
  - Actions (Edit, Delete buttons)
- Provides pagination controls (20 books per page)
- Provides "Add New Book" button
- Edit functionality:
  - Navigates to edit page with book ISBN
- Delete functionality:
  - Shows confirmation modal before deletion
  - Deletes book from database
  - Refreshes book list after deletion
- Listens for custom events:
  - `bookAdded`: Refreshes list when new book is added
  - `bookUpdated`: Refreshes list when book is updated
  - `orderConfirmed`: Refreshes list when replenishment order is confirmed
- Shows loading spinner while fetching
- Displays error messages if operation fails
- Protected route (requires admin authentication)

**Key Features:**
- Paginated book list
- CRUD operations (Create, Read, Update, Delete)
- Real-time list updates via custom events
- Confirmation modals for destructive actions
- Stock status indicators

---

### Add Book (`/admin/books/add`)
**Component:** `components/Admin/AddBook.jsx`

**Logic:**
- Displays form for creating a new book with fields:
  - ISBN (required, unique)
  - Title (required)
  - Authors (array, at least one required)
    - Can select from existing authors
    - Can add new author names directly
    - Displays selected authors as removable badges
  - Publisher (dropdown, required)
  - Publication Year (required)
  - Price (required, numeric)
  - Category (dropdown, required)
  - Stock Quantity (required, numeric)
  - Threshold Quantity (required, numeric)
- Validates all required fields
- Validates ISBN format and uniqueness
- Validates at least one author is provided
- On successful submission:
  - Creates book in database
  - Creates author entries if new authors provided
  - Links book to publisher
  - Dispatches `bookAdded` custom event
  - Shows success notification
  - Optionally navigates back to book management
- Shows loading state during submission
- Displays validation errors for each field
- Protected route (requires admin authentication)

**Key Features:**
- Comprehensive book creation form
- Dynamic author management
- Publisher selection
- Category selection
- Stock and threshold configuration
- Event-based list refresh

---

### Edit Book (`/admin/books/edit/:isbn`)
**Component:** `components/Admin/EditBook.jsx`

**Logic:**
- Fetches book details by ISBN from URL parameter
- Pre-fills form with existing book data:
  - ISBN (read-only)
  - Title
  - Authors (array, editable)
  - Publisher
  - Publication Year
  - Price
  - Category
  - Stock Quantity
  - Threshold Quantity
- Validates all fields before submission
- On successful update:
  - Updates book in database
  - Updates author relationships if changed
  - Dispatches `bookUpdated` custom event
  - Shows success notification
  - Navigates back to book management
- Shows loading spinner while fetching/updating
- Displays error messages if operation fails
- Protected route (requires admin authentication)

**Key Features:**
- Pre-filled form with existing data
- Author relationship management
- Real-time updates via custom events
- Error handling

---

### Order Management (`/admin/orders`)
**Component:** `components/Admin/OrderManagement.jsx`

**Logic:**
- Fetches all replenishment orders from backend with pagination
- Displays orders in a table format showing:
  - Order ID
  - Book ISBN
  - Book Title
  - Publisher Name
  - Quantity Ordered
  - Order Date
  - Status (Pending, Confirmed)
  - Actions (Confirm button for pending orders)
- Provides pagination controls (20 orders per page)
- Confirm Order functionality:
  - Shows confirmation before confirming order
  - Calls API to confirm order
  - Updates order status to "Confirmed"
  - Database trigger automatically updates book stock
  - Dispatches `orderConfirmed` custom event
  - Dispatches `newReplenishmentOrder` custom event (if auto-triggered)
  - Refreshes order list after confirmation
- Listens for custom events:
  - `newReplenishmentOrder`: Refreshes list when new order is created
- Shows loading spinner while fetching
- Displays error messages if operation fails
- Protected route (requires admin authentication)

**Key Features:**
- Paginated order list
- Order confirmation workflow
- Automatic stock updates via database triggers
- Real-time list updates via custom events
- Status-based action buttons

---

### Reports (`/admin/reports`)
**Component:** `components/Admin/Reports.jsx`

**Logic:**
- Provides buttons to generate different reports:
  1. **Monthly Sales Report**
     - Shows total sales for the previous month
     - Displays sales count and total amount
  2. **Daily Sales Report**
     - Requires date selection
     - Shows total sales for selected date
     - Displays sales count and total amount
  3. **Top 5 Customers Report**
     - Shows top 5 customers by total purchases (last 3 months)
     - Displays customer name and total spent
  4. **Top 10 Books Report**
     - Shows top 10 selling books (last 3 months)
     - Displays book title, ISBN, and quantity sold
  5. **Replenishment Count Report**
     - Requires book ISBN selection (dropdown)
     - Shows total number of times the book has been ordered
     - Displays book title and order count
- Each report:
  - Fetches data from backend API
  - Displays results in table format
  - Shows loading spinner while fetching
  - Displays error messages if operation fails
  - Shows empty state if no data available
- Only one report can be active at a time
- Protected route (requires admin authentication)

**Key Features:**
- Multiple report types
- Date and book selection for specific reports
- Formatted data display (currency, dates)
- Empty state handling
- Error handling

---

## Common Components

### Header
**Component:** `components/Common/Header.jsx`

**Logic:**
- Displays bookstore logo/brand name (links to home)
- Shows search bar in center
- Shows action icons on right:
  - For authenticated customers: Cart icon (with item count badge)
  - For authenticated admins: No icons
  - For non-authenticated users: Login and Register buttons
- Search functionality:
  - Navigates to search page with query parameter
- Cart icon shows badge with item count (if > 0)
- Responsive design (collapses on mobile)

**Key Features:**
- Role-based icon display
- Search integration
- Cart badge
- Responsive layout

---

### Navigation Bar
**Component:** `components/Common/Nav.jsx`

**Logic:**
- Displays navigation links based on authentication status:
  - **Public:** Home, Browse Books
  - **Customer:** Home, Browse
  - **Admin:** Home, Dashboard
- Shows account dropdown for authenticated users:
  - Customer: Profile, Order History, Logout
  - Admin: Logout only
- Highlights active route
- Handles logout:
  - Clears cart on logout
  - Removes authentication tokens
  - Redirects to home page
- Responsive design (hamburger menu on mobile)

**Key Features:**
- Role-based navigation
- Active route highlighting
- Account dropdown menu
- Logout functionality

---

### Footer
**Component:** `components/Common/Footer.jsx`

**Logic:**
- Displays footer information:
  - Copyright notice
  - Links to important pages (if any)
  - Contact information (if any)
- Sticky footer (stays at bottom of page)
- No top margin (flush with content above)

**Key Features:**
- Consistent footer across all pages
- Sticky positioning

---

### Admin Layout
**Component:** `components/Admin/AdminLayout.jsx`

**Logic:**
- Provides consistent layout for all admin pages
- Displays sidebar on left with navigation buttons:
  - Dashboard
  - Books
  - Orders
  - Reports
- Highlights active route in sidebar
- Main content area on right (uses React Router Outlet)
- Sidebar height fills 100% of admin layout
- Responsive design (sidebar collapses on mobile)
- Sticky sidebar positioning

**Key Features:**
- Persistent sidebar navigation
- Active route highlighting
- Responsive layout
- Consistent admin UI

---

## Authentication & Authorization

### Protected Routes
- Customer routes require authentication
- Admin routes require both authentication and admin role
- Unauthenticated users are redirected to login page
- Non-admin users trying to access admin routes are redirected to home

### Role-Based Access
- **Customer:** Can browse, search, add to cart, checkout, view orders, manage profile
- **Admin:** Can manage books, manage orders, view reports, create replenishment orders
- **Public:** Can browse books and search (no cart functionality)

---

## State Management

### AuthContext
- Manages user authentication state
- Stores JWT token and user data
- Provides login, logout, and user update functions
- Persists authentication via localStorage

### CartContext
- Manages shopping cart state
- Provides cart operations: add, update, remove, clear
- Syncs with backend API
- Persists cart data

### NotificationContext
- Manages global notifications
- Provides success and error notification functions
- Displays toast notifications to user

---

## Custom Events

The application uses custom events for inter-component communication:

- **`bookAdded`**: Dispatched when a new book is created
- **`bookUpdated`**: Dispatched when a book is updated
- **`orderConfirmed`**: Dispatched when a replenishment order is confirmed
- **`newReplenishmentOrder`**: Dispatched when a new replenishment order is created (auto-triggered)

These events allow components to refresh their data without manual page reloads.

---

## Error Handling

All screens implement comprehensive error handling:
- Form validation errors displayed inline
- API error messages shown via notifications
- Loading states during async operations
- Empty states for empty data
- 404 page for invalid routes

---

## Responsive Design

All screens are designed to be responsive:
- Mobile-first approach
- Breakpoints for tablet and desktop
- Collapsible navigation on mobile
- Adaptive grid layouts
- Touch-friendly buttons and inputs

