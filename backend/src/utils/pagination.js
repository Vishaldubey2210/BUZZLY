'use strict';

const config = require('../config/config');

/**
 * Helper to build pagination meta data
 */
const getPaginationOptions = (query) => {
  const page = parseInt(query.page, 10) || 1;
  let limit = parseInt(query.limit, 10) || config.pagination.defaultLimit;

  if (limit > config.pagination.maxLimit) {
    limit = config.pagination.maxLimit;
  }

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

module.exports = {
  getPaginationOptions,
};
