// Express App Configuration
import express from 'express';
import cors from 'cors';
import { config } from './config/environment.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import authorRoutes from './routes/authors.js';
import publisherRoutes from './routes/publishers.js';
import orderRoutes from './routes/orders.js';
import cartRoutes from './routes/cart.js';
import checkoutRoutes from './routes/checkout.js';
import customerOrderRoutes from './routes/customerOrders.js';
import reportRoutes from './routes/reports.js';

const app = express();

// Middleware
// CORS configuration - allow localhost on any port for development
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all localhost origins on any port
    if (config.NODE_ENV === 'development') {
      if (origin.match(/^http:\/\/localhost:\d+$/) || 
          origin.match(/^http:\/\/127\.0\.0\.1:\d+$/) ||
          origin.startsWith('http://localhost:') ||
          origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
    }
    
    // Also allow the configured frontend URL
    if (origin === config.FRONTEND_URL) {
      return callback(null, true);
    }
    
    // For development, allow all origins (be more permissive)
    if (config.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In production, reject unknown origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Database health check
app.get('/health/db', async (req, res) => {
  try {
    const pool = (await import('./config/database.js')).default;
    const [rows] = await pool.execute('SELECT 1 as test');
    res.json({
      success: true,
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/publishers', publisherRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/customer-orders', customerOrderRoutes);
app.use('/api/reports', reportRoutes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler (must be last)
app.use(errorHandler);

export default app;

