import { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Container fluid className="admin-layout">
      <Row className="admin-layout-row">
        {/* Sidebar */}
        <Col xs={12} md={3} lg={2} className="admin-sidebar p-0">
          <div className="sidebar-content">
            <h5 className="sidebar-title mb-4">Admin Panel</h5>
            <nav className="sidebar-nav">
              <Button
                variant={isActive('/admin') && location.pathname === '/admin' ? 'primary' : 'outline-primary'}
                className={`sidebar-button w-100 mb-2 ${isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}`}
                onClick={() => handleNavigation('/admin')}
              >
                Dashboard
              </Button>
              <Button
                variant={isActive('/admin/books') ? 'primary' : 'outline-primary'}
                className={`sidebar-button w-100 mb-2 ${isActive('/admin/books') ? 'active' : ''}`}
                onClick={() => handleNavigation('/admin/books')}
              >
                Books
              </Button>
              <Button
                variant={isActive('/admin/orders') ? 'primary' : 'outline-primary'}
                className={`sidebar-button w-100 mb-2 ${isActive('/admin/orders') ? 'active' : ''}`}
                onClick={() => handleNavigation('/admin/orders')}
              >
                Orders
              </Button>
              <Button
                variant={isActive('/admin/reports') ? 'primary' : 'outline-primary'}
                className={`sidebar-button w-100 mb-2 ${isActive('/admin/reports') ? 'active' : ''}`}
                onClick={() => handleNavigation('/admin/reports')}
              >
                Reports
              </Button>
            </nav>
          </div>
        </Col>

        {/* Main Content */}
        <Col xs={12} md={9} lg={10} className="admin-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;

