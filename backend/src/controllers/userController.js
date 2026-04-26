'use strict';

const userService = require('../services/userService');
const { sendSuccess } = require('../utils/response');

class UserController {
  async getMe(req, res, next) {
    try {
      const user = await userService.getUserById(req.user._id);
      sendSuccess(res, { data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(req.user._id, req.body);
      sendSuccess(res, { data: user, message: 'Profile updated' });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      sendSuccess(res, { data: user });
    } catch (error) {
      next(error);
    }
  }

  async searchUsers(req, res, next) {
    try {
      const query = req.query.q || '';
      const users = await userService.searchUsers(query, req.user._id);
      sendSuccess(res, { data: users });
    } catch (error) {
      next(error);
    }
  }

  async getSuggestions(req, res, next) {
    try {
      const suggestions = await userService.getSuggestions(req.user._id);
      sendSuccess(res, { data: suggestions });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
