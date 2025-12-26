import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService, getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Optionally verify token with backend
          // const userData = await getCurrentUser();
          // setUser(userData);
        } catch (err) {
          console.error('Error loading user:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await loginService(username, password);
      
      // Backend returns: { success: true, message: "...", data: { user: {...}, token: "..." } }
      // After axios, response.data is: { success: true, message: "...", data: { user: {...}, token: "..." } }
      const responseData = response.data || response;
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('Login response:', responseData);
      }
      
      const token = responseData.data?.token || responseData.token;
      const user = responseData.data?.user || responseData.user;
      
      if (!token || !user) {
        console.error('Missing token or user in response:', { token: !!token, user: !!user, responseData });
        throw new Error('Invalid response from server: missing token or user data');
      }
      
      // Ensure user has required fields
      if (!user.user_id || !user.username || !user.user_type) {
        console.error('User object missing required fields:', user);
        throw new Error('Invalid user data received from server');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Login successful, user stored:', { username: user.username, user_type: user.user_type });
      }
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      console.error('Login error:', errorMessage, err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await registerService(userData);
      
      // Backend returns: { success: true, message: "...", data: { user: {...}, token: "..." } }
      // After axios, response.data is: { success: true, message: "...", data: { user: {...}, token: "..." } }
      const responseData = response.data || response;
      const token = responseData.data?.token || responseData.token;
      const user = responseData.data?.user || responseData.user;
      
      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      }
      throw new Error('Invalid response from server');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cart'); // Clear cart on logout (TC-22)
      setUser(null);
      setError(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.user_type === 'admin' || user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

