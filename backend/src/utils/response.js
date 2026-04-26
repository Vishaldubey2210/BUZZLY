'use strict';

const sendSuccess = (res, { data = null, message = 'Success', statusCode = 200, meta = null } = {}) => {
  const payload = { success: true, message, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

const sendError = (res, { message = 'An error occurred', statusCode = 500, errors = null } = {}) => {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

const sendCreated = (res, { data = null, message = 'Created successfully' } = {}) => {
  return sendSuccess(res, { data, message, statusCode: 201 });
};

const sendPaginated = (res, { data, page, limit, total, message = 'Success' } = {}) => {
  return sendSuccess(res, {
    data,
    message,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  });
};

module.exports = { sendSuccess, sendError, sendCreated, sendPaginated };
