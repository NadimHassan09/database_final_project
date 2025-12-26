// Cart Model - New Database Structure
import pool from '../config/database.js';

export const Cart = {
  // Get or create cart for user
  async getOrCreateCart(userId) {
    let [rows] = await pool.execute(
      'SELECT CartID as cart_id, CustomerID as user_id, CreatedDate as created_at FROM shopping_cart WHERE CustomerID = ?',
      [userId]
    );

    if (rows.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO shopping_cart (CustomerID) VALUES (?)',
        [userId]
      );
      [rows] = await pool.execute(
        'SELECT CartID as cart_id, CustomerID as user_id, CreatedDate as created_at FROM shopping_cart WHERE CartID = ?',
        [result.insertId]
      );
    }

    return rows[0];
  },

  // Get cart with items
  async getCartWithItems(userId) {
    const cart = await this.getOrCreateCart(userId);
    
    const [items] = await pool.execute(
      `SELECT ic.CartID as cart_id, ic.ISBN as book_isbn, ic.Quantity as quantity,
       b.Title as title, b.Price as price, b.StockQty as quantity_in_stock,
       GROUP_CONCAT(DISTINCT a.AuthorName ORDER BY a.AuthorName SEPARATOR ', ') as authors
       FROM items_cart ic
       JOIN book b ON ic.ISBN = b.ISBN
       LEFT JOIN author a ON b.ISBN = a.ISBN
       WHERE ic.CartID = ?
       GROUP BY ic.CartID, ic.ISBN, ic.Quantity, b.Title, b.Price, b.StockQty`,
      [cart.cart_id]
    );

    return {
      cart,
      items: items.map(item => ({
        cart_item_id: `${item.cart_id}_${item.book_isbn}`, // Composite key
        cart_id: item.cart_id,
        book_isbn: item.book_isbn,
        quantity: item.quantity,
        title: item.title,
        price: parseFloat(item.price) || 0,
        unit_price: parseFloat(item.price) || 0,
        quantity_in_stock: item.quantity_in_stock,
        max_stock: item.quantity_in_stock,
        authors: item.authors || '',
        authors_string: item.authors || ''
      }))
    };
  },

  // Add item to cart
  async addItem(userId, bookISBN, quantity) {
    const cart = await this.getOrCreateCart(userId);

    // Check if item already exists
    const [existing] = await pool.execute(
      'SELECT * FROM items_cart WHERE CartID = ? AND ISBN = ?',
      [cart.cart_id, bookISBN]
    );

    if (existing.length > 0) {
      // Update quantity
      await pool.execute(
        'UPDATE items_cart SET Quantity = Quantity + ? WHERE CartID = ? AND ISBN = ?',
        [quantity, cart.cart_id, bookISBN]
      );
    } else {
      // Insert new item
      await pool.execute(
        'INSERT INTO items_cart (CartID, ISBN, Quantity) VALUES (?, ?, ?)',
        [cart.cart_id, bookISBN, quantity]
      );
    }

    return this.getCartWithItems(userId);
  },

  // Update cart item quantity
  async updateItemQuantity(cartId, bookISBN, quantity) {
    if (quantity <= 0) {
      await pool.execute('DELETE FROM items_cart WHERE CartID = ? AND ISBN = ?', [cartId, bookISBN]);
      return null;
    }

    await pool.execute(
      'UPDATE items_cart SET Quantity = ? WHERE CartID = ? AND ISBN = ?',
      [quantity, cartId, bookISBN]
    );

    const [userRows] = await pool.execute(
      'SELECT CustomerID as user_id FROM shopping_cart WHERE CartID = ?',
      [cartId]
    );

    if (userRows.length > 0) {
      return this.getCartWithItems(userRows[0].user_id);
    }

    return null;
  },

  // Remove item from cart
  async removeItem(cartId, bookISBN) {
    await pool.execute('DELETE FROM items_cart WHERE CartID = ? AND ISBN = ?', [cartId, bookISBN]);

    const [userRows] = await pool.execute(
      'SELECT CustomerID as user_id FROM shopping_cart WHERE CartID = ?',
      [cartId]
    );

    if (userRows.length > 0) {
      return this.getCartWithItems(userRows[0].user_id);
    }

    return null;
  },

  // Clear cart
  async clearCart(userId) {
    const cart = await this.getOrCreateCart(userId);
    await pool.execute('DELETE FROM items_cart WHERE CartID = ?', [cart.cart_id]);
    return { cart, items: [] };
  }
};
