'use strict';

const logger = require('../utils/logger');
const { sendError } = require('../utils/response');
const config = require('../config/config');

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log the error
  logger.error(`${err.name}: ${err.message}\n${err.stack}`);

  // Mongoose duplicate key
  if (err.code === 11000) {
    return sendError(res, {
      message: 'Duplicate field value entered',
      statusCode: 400,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return sendError(res, {
      message,
      statusCode: 400,
    });
  }

  // General error payload
  const payload = {
    message: err.message,
    statusCode,
  };

  // Include stack trace in dev
  if (config.env === 'development') {
    payload.errors = err.stack;
  }

  sendError(res, payload);
};

module.exports = { notFound, errorHandler };
