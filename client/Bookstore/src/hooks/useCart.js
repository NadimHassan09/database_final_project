import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

/**
 * Custom hook to access cart context
 * This is a convenience wrapper around useContext(CartContext)
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

