// Author Controller
import { Author } from '../models/Author.js';

export const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await Author.findAll();

    res.json({
      success: true,
      data: { authors }
    });
  } catch (error) {
    next(error);
  }
};

export const getAuthorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = await Author.findById(parseInt(id));

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    res.json({
      success: true,
      data: { author }
    });
  } catch (error) {
    next(error);
  }
};

export const createAuthor = async (req, res, next) => {
  try {
    const author = await Author.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Author created successfully',
      data: { author }
    });
  } catch (error) {
    next(error);
  }
};

export const updateAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = await Author.update(parseInt(id), req.body);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    res.json({
      success: true,
      message: 'Author updated successfully',
      data: { author }
    });
  } catch (error) {
    next(error);
  }
};

