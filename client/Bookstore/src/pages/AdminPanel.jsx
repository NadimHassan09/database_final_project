import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/Admin/AdminLayout';
import Dashboard from '../components/Admin/Dashboard';
import BookManagement from '../components/Admin/BookMangement';
import AddBook from '../components/Admin/AddBook';
import EditBook from '../components/Admin/EditBook';
import OrderManagement from '../components/Admin/OrderManagement';
import ConfirmOrder from '../components/Admin/ConfirmOrder';
import Reports from '../components/Admin/Reports';

const AdminPanel = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="books" element={<BookManagement />} />
        <Route path="books/add" element={<AddBook />} />
        <Route path="books/edit/:isbn" element={<EditBook />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="orders/confirm/:orderId" element={<ConfirmOrder />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
};

export default AdminPanel;

