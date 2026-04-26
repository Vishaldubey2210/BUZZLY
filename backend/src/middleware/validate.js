'use strict';

const { sendError } = require('../utils/response');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    const errors = error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    return sendError(res, {
      message: 'Validation failed',
      statusCode: 400,
      errors,
    });
  }
};

module.exports = validate;
