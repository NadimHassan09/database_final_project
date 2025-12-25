// Cart Model
import pool from '../config/database.js';

export const Cart = {
  // Get or create cart for user
  async getOrCreateCart(userId) {
    let [rows] = await pool.execute(
      'SELECT * FROM Cart WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO Cart (user_id) VALUES (?)',
        [userId]
      );
      [rows] = await pool.execute(
        'SELECT * FROM Cart WHERE cart_id = ?',
        [result.insertId]
      );
    }

    return rows[0];
  },

  // Get cart with items
  async getCartWithItems(userId) {
    const cart = await this.getOrCreateCart(userId);
    
    const [items] = await pool.execute(
      `SELECT ci.*, b.title, b.price, b.quantity_in_stock,
       GROUP_CONCAT(DISTINCT a.name ORDER BY a.name SEPARATOR ', ') as authors
       FROM CartItems ci
       JOIN Books b ON ci.book_isbn = b.isbn
       LEFT JOIN Book_Author ba ON b.isbn = ba.book_isbn
       LEFT JOIN Authors a ON ba.author_id = a.author_id
       WHERE ci.cart_id = ?
       GROUP BY ci.cart_item_id`,
      [cart.cart_id]
    );

    return {
      cart,
      items: items.map(item => ({
        ...item,
        unit_price: item.price,
        max_stock: item.quantity_in_stock
      }))
    };
  },

  // Add item to cart
  async addItem(userId, bookISBN, quantity) {
    const cart = await this.getOrCreateCart(userId);

    // Check if item already exists
    const [existing] = await pool.execute(
      'SELECT * FROM CartItems WHERE cart_id = ? AND book_isbn = ?',
      [cart.cart_id, bookISBN]
    );

    if (existing.length > 0) {
      // Update quantity
      await pool.execute(
        'UPDATE CartItems SET quantity = quantity + ? WHERE cart_item_id = ?',
        [quantity, existing[0].cart_item_id]
      );
    } else {
      // Insert new item
      await pool.execute(
        'INSERT INTO CartItems (cart_id, book_isbn, quantity) VALUES (?, ?, ?)',
        [cart.cart_id, bookISBN, quantity]
      );
    }

    return this.getCartWithItems(userId);
  },

  // Update cart item quantity
  async updateItemQuantity(cartItemId, quantity) {
    if (quantity <= 0) {
      await pool.execute('DELETE FROM CartItems WHERE cart_item_id = ?', [cartItemId]);
      return null;
    }

    await pool.execute(
      'UPDATE CartItems SET quantity = ? WHERE cart_item_id = ?',
      [quantity, cartItemId]
    );

    const [rows] = await pool.execute(
      'SELECT cart_id FROM CartItems WHERE cart_item_id = ?',
      [cartItemId]
    );

    if (rows.length > 0) {
      const [userRows] = await pool.execute(
        'SELECT user_id FROM Cart WHERE cart_id = ?',
        [rows[0].cart_id]
      );
      return this.getCartWithItems(userRows[0].user_id);
    }

    return null;
  },

  // Remove item from cart
  async removeItem(cartItemId) {
    const [itemRows] = await pool.execute(
      'SELECT cart_id FROM CartItems WHERE cart_item_id = ?',
      [cartItemId]
    );

    if (itemRows.length === 0) return null;

    await pool.execute('DELETE FROM CartItems WHERE cart_item_id = ?', [cartItemId]);

    const [userRows] = await pool.execute(
      'SELECT user_id FROM Cart WHERE cart_id = ?',
      [itemRows[0].cart_id]
    );

    return this.getCartWithItems(userRows[0].user_id);
  },

  // Clear cart
  async clearCart(userId) {
    const cart = await this.getOrCreateCart(userId);
    await pool.execute('DELETE FROM CartItems WHERE cart_id = ?', [cart.cart_id]);
    return { cart, items: [] };
  }
};

