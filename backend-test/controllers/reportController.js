// Report Controller
import { Sale } from '../models/Sale.js';

export const getMonthlySales = async (req, res, next) => {
  try {
    const report = await Sale.getMonthlySales();

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
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
    next(error);
  }
};

export const getReplenishmentCount = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const count = await Sale.getReplenishmentCount(bookId);

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    next(error);
  }
};

