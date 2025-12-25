// Customer Order Controller (Sales/Transactions)
import { Sale } from '../models/Sale.js';

export const getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await Sale.findByUserId(req.user.user_id);

    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Sale.findById(parseInt(orderId));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify order belongs to user (unless admin)
    if (req.user.user_type !== 'admin' && order.user_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

