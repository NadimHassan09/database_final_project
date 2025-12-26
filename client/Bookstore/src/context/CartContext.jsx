import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as addToCartService, updateCartItem, removeFromCart as removeFromCartService, clearCart as clearCartService } from '../services/cartService';
import { calculateTotal } from '../utils/helpers';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart from localStorage on mount (for offline support)
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (err) {
        console.error('Error loading cart from localStorage:', err);
      }
    }
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cartItems]);

  // Load cart from server (when user is authenticated)
  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCart();
      
      // Backend returns: { success: true, data: { cart: {...}, items: [...] } }
      // cartService.getCart() returns response.data, so:
      // response = { success: true, data: { cart: {...}, items: [...] } }
      // response.data = { cart: {...}, items: [...] }
      // response.data.items = [...]
      
      let itemsArray = [];
      
      if (response && response.data) {
        // Standard backend response structure
        itemsArray = Array.isArray(response.data.items) ? response.data.items : [];
      } else if (Array.isArray(response.cartItems)) {
        itemsArray = response.cartItems;
      } else if (Array.isArray(response.items)) {
        itemsArray = response.items;
      } else if (Array.isArray(response)) {
        itemsArray = response;
      }
      
      setCartItems(itemsArray);
    } catch (err) {
      console.error('Error loading cart:', err);
      // Don't set error for cart loading failures
      setCartItems([]); // Ensure cartItems is always an array
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (book, quantity = 1) => {
    try {
      setError(null);
      
      // Check if item already exists in cart
      const existingItem = cartItems.find(item => item.book_isbn === book.isbn || item.isbn === book.isbn);
      
      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        return await updateItemQuantity(existingItem.cart_item_id || existingItem.id, newQuantity);
      }

      // Add new item
      const newItem = {
        id: Date.now(), // Temporary ID for local state
        cart_item_id: Date.now(),
        book_isbn: book.isbn,
        isbn: book.isbn,
        title: book.title,
        price: book.price,
        unit_price: book.price,
        quantity: quantity,
        image: book.image || book.cover_image,
        authors: book.authors || [],
      };

      // Try to add to server if authenticated
      try {
        const response = await addToCartService(book.isbn, quantity);
        // Backend returns: { success: true, data: { cart: {...}, items: [...] } }
        if (response && response.data && Array.isArray(response.data.items)) {
          setCartItems(response.data.items);
          return { success: true };
        }
      } catch (err) {
        // If not authenticated, just use local storage
        console.log('Using local cart storage');
      }

      setCartItems(prev => [...prev, newItem]);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add item to cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateItemQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    try {
      setError(null);
      
      // Try to update on server
      try {
        const response = await updateCartItem(itemId, quantity);
        // Backend returns: { success: true, data: { cart: {...}, items: [...] } }
        if (response && response.data && Array.isArray(response.data.items)) {
          setCartItems(response.data.items);
          return { success: true };
        }
      } catch (err) {
        console.log('Using local cart storage');
      }

      setCartItems(prev =>
        prev.map(item =>
          (item.cart_item_id === itemId || item.id === itemId)
            ? { ...item, quantity }
            : item
        )
      );
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update cart item';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setError(null);
      
      // Try to remove from server
      try {
        const response = await removeFromCartService(itemId);
        // Backend returns: { success: true, data: { cart: {...}, items: [...] } }
        if (response && response.data && Array.isArray(response.data.items)) {
          setCartItems(response.data.items);
          return { success: true };
        }
      } catch (err) {
        console.log('Using local cart storage');
      }

      // If server response has items, use them; otherwise update local state
      setCartItems(prev => prev.filter(item => 
        item.cart_item_id !== itemId && item.id !== itemId
      ));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to remove item from cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      
      // Try to clear on server
      try {
        const response = await clearCartService();
        // Backend returns: { success: true, data: { cart: {...}, items: [] } }
        if (response && response.data) {
          setCartItems(response.data.items || []);
          return { success: true };
        }
      } catch (err) {
        console.log('Using local cart storage');
      }

      setCartItems([]);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to clear cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getCartTotal = () => {
    return calculateTotal(cartItems);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    loadCart,
    getCartTotal,
    getCartItemCount,
    clearError: () => setError(null),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

