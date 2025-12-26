// Report Controller
import { Sale } from '../models/Sale.js';
import { Order } from '../models/Order.js';

export const getMonthlySales = async (req, res, next) => {
  try {
    const report = await Sale.getMonthlySales();

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error getting monthly sales:', error);
    next(error);
  }
};

export const getDailySales = async (req, res, next) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required (format: YYYY-MM-DD)'
      });
    }

    const report = await Sale.getDailySales(date);

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error getting daily sales:', error);
    next(error);
  }
};

export const getTopCustomers = async (req, res, next) => {
  try {
    const customers = await Sale.getTopCustomers();

    res.json({
      success: true,
      data: { customers }
    });
  } catch (error) {
    console.error('Error getting top customers:', error);
    next(error);
  }
};

export const getTopBooks = async (req, res, next) => {
  try {
    const books = await Sale.getTopBooks();

    res.json({
      success: true,
      data: { books }
    });
  } catch (error) {
    console.error('Error getting top books:', error);
    next(error);
  }
};

export const getReplenishmentCount = async (req, res, next) => {
  try {
    const { bookISBN } = req.params;
    const decodedISBN = decodeURIComponent(bookISBN);
    const count = await Order.getReplenishmentCount(decodedISBN);

    res.json({
      success: true,
      data: { count, book_isbn: decodedISBN }
    });
  } catch (error) {
    console.error('Error getting replenishment count:', error);
    next(error);
  }
};

