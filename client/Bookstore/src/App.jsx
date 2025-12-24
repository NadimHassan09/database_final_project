import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import Header from './components/Common/Header';
import Nav from './components/Common/Nav';
import Footer from './components/Common/Footer';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import CustomerDashboard from './components/Customer/Dashboard';
import BookBrowser from './components/Customer/BookBrowser';
import BookSearch from './components/Customer/BookSearch';
import BookDetails from './components/Customer/BookDetails';
import Cart from './components/Customer/Cart';
import Checkout from './components/Customer/Checkout';
import OrderHistory from './components/Customer/OrderHistory';
import Profile from './components/Customer/Profile';
import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <div className="d-flex flex-column min-vh-100">
              <Header />
      <Nav />
              <main className="flex-grow-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Customer Routes */}
                  <Route
                    path="/customer"
                    element={
                      <ProtectedRoute>
                        <CustomerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/books"
                    element={
                      <ProtectedRoute>
                        <BookBrowser />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/search"
                    element={
                      <ProtectedRoute>
                        <BookSearch />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/books/:isbn"
                    element={
                      <ProtectedRoute>
                        <BookDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/orders"
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/orders/:orderId"
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminPanel />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
      <Footer />
            </div>
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
