'use strict';

const searchService = require('../services/searchService');
const { sendSuccess } = require('../utils/response');
const { getPaginationOptions } = require('../utils/pagination');

class SearchController {
  async search(req, res, next) {
    try {
      const { q = '', type = 'all' } = req.query;
      const { skip, limit, page } = getPaginationOptions(req.query);
      const results = await searchService.search(q, type, req.user._id, skip, limit);
      sendSuccess(res, { data: results, message: 'Search results' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SearchController();
