// Publisher Controller
import { Publisher } from '../models/Publisher.js';

export const getAllPublishers = async (req, res, next) => {
  try {
    const publishers = await Publisher.findAll();

    res.json({
      success: true,
      data: { publishers }
    });
  } catch (error) {
    next(error);
  }
};

export const getPublisherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const publisher = await Publisher.findById(parseInt(id));

    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher not found'
      });
    }

    res.json({
      success: true,
      data: { publisher }
    });
  } catch (error) {
    next(error);
  }
};

export const createPublisher = async (req, res, next) => {
  try {
    const publisher = await Publisher.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Publisher created successfully',
      data: { publisher }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePublisher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const publisher = await Publisher.update(parseInt(id), req.body);

    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: 'Publisher not found'
      });
    }

    res.json({
      success: true,
      message: 'Publisher updated successfully',
      data: { publisher }
    });
  } catch (error) {
    next(error);
  }
};

